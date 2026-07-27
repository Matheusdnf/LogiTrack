"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { 
  Activity, 
  Trophy, 
  AlertCircle,
  Users,
  Shield
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDashboardData } from "./layout";
import { fetchUsers, User } from "../services/api";

export default function DashboardVehiclesPage() {
  const { data, totalVehicles, loading, error } = useDashboardData();
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<string>("GESTOR");

  useEffect(() => {
    queueMicrotask(() => {
      const role = localStorage.getItem("userRole") || "GESTOR";
      setUserRole(role);
      if (role === "ADMIN") {
        fetchUsers()
          .then((res) => setUsers(res))
          .catch(() => {});
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0586c7]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-8 text-center text-[#ed842e] flex flex-col items-center gap-4 font-medium">
        <AlertCircle size={48} />
        <h2 className="text-xl font-bold">Erro ao carregar o dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 border-b border-[#748ca6]/20 pb-6">
        <h1 className="text-3xl font-bold text-[#07497f]" style={{ fontFamily: "var(--font-outfit)" }}>
          Dashboard: Veículos e Viagens
        </h1>
        <p className="text-[#748ca6] mt-1 font-medium">Métricas detalhadas extraídas do banco de dados</p>
      </div>

      <div className="space-y-6">
        <div className={`grid grid-cols-1 ${userRole === 'ADMIN' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* Card 1: Total de Veículos */}
          <div className="glass p-6 rounded-2xl flex flex-col border border-[#748ca6]/20 relative overflow-hidden group shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#748ca6]">
              <Activity size={64} />
            </div>
            <p className="text-[#748ca6] text-sm font-semibold mb-1">Total de Veículos na Frota</p>
            <p className="text-3xl font-bold text-[#07497f]">{totalVehicles} <span className="text-lg text-[#748ca6] font-semibold">veículos</span></p>
          </div>

          {/* Card 2: Total KM Percorrido */}
          <div className="glass p-6 rounded-2xl flex flex-col border border-[#748ca6]/20 relative overflow-hidden group shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#ed842e]">
              <Trophy size={64} />
            </div>
            <p className="text-[#748ca6] text-sm font-semibold mb-1">Soma da Quilometragem (Geral)</p>
            <p className="text-3xl font-bold text-[#ed842e]">{data.totalKm.toLocaleString('pt-BR')} <span className="text-lg text-[#748ca6] font-semibold">km</span></p>
          </div>

          {/* Card 3: Total de Usuários */}
          {userRole === "ADMIN" && (
            <div className="glass p-6 rounded-2xl flex flex-col border border-[#748ca6]/20 relative overflow-hidden group shadow-md animate-fade-in">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#0586c7]">
                <Users size={64} />
              </div>
              <p className="text-[#748ca6] text-sm font-semibold mb-1">Total de Usuários e Acessos</p>
              <p className="text-3xl font-bold text-[#0586c7]">{users.length} <span className="text-lg text-[#748ca6] font-semibold">cadastrados</span></p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart: Volume por Categoria */}
          <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 flex flex-col shadow-md">
            <h3 className="text-lg font-bold text-[#07497f] mb-6 flex items-center gap-2">
              <Activity size={20} className="text-[#748ca6]"/> Viagens por Tipo de Veículo
            </h3>
            <div className="flex-1 min-h-[250px]">
              {data.volumePorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.volumePorCategoria} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="categoria" stroke="#748ca6" tick={{fill: '#748ca6', fontWeight: 600}} />
                    <YAxis stroke="#748ca6" tick={{fill: '#748ca6', fontWeight: 600}} allowDecimals={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(116, 140, 166, 0.1)'}} 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(116, 140, 166, 0.3)', borderRadius: '12px', color: '#07497f', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 600 }}
                    />
                    <Bar dataKey="totalViagens" radius={[6, 6, 0, 0]}>
                      {data.volumePorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.categoria === 'PESADO' ? '#0d9488' : '#7e22ce'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#748ca6] italic font-medium">Sem dados de viagens</div>
              )}
            </div>
          </div>

          {/* Table: Veículos e KM (Ranking) */}
          <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 shadow-md">
            <h3 className="text-lg font-bold text-[#07497f] mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-[#ed842e]"/> Tabela: Veículos e Quilometragem
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#748ca6]/20 text-[#748ca6] text-sm">
                    <th className="pb-3 font-semibold">Pos.</th>
                    <th className="pb-3 font-semibold">Veículo (Modelo)</th>
                    <th className="pb-3 font-semibold">Placa</th>
                    <th className="pb-3 font-semibold text-center">Tipo</th>
                    <th className="pb-3 font-semibold text-right">KM Acumulada</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.rankingUtilizacao.length > 0 ? (
                    data.rankingUtilizacao.map((ranking, idx) => (
                      <tr key={ranking.veiculoId} className="border-b border-[#748ca6]/10 hover:bg-[#748ca6]/5 transition-colors">
                        <td className="py-4 text-[#748ca6] font-bold">
                          #{idx + 1}
                        </td>
                        <td className="py-4 font-extrabold text-[#07497f] text-base">
                          {ranking.modelo}
                        </td>
                        <td className="py-4 font-medium">
                          <div className="bg-[#0586c7]/15 text-[#0586c7] rounded-lg px-3 py-1 inline-block border border-[#0586c7]/40 font-mono font-extrabold tracking-wider shadow-sm">
                            {ranking.placa}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${ranking.tipo === 'PESADO' ? 'bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/40' : 'bg-[#7e22ce]/15 text-[#7e22ce] border border-[#7e22ce]/40'}`}>
                            {ranking.tipo}
                          </span>
                        </td>
                        <td className="py-4 text-right text-[#ed842e] font-bold">{ranking.kmAcumulado.toLocaleString('pt-BR')} km</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#748ca6] italic font-medium">
                        Nenhuma viagem registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resumo de Usuários e Acessos (RBAC) */}
        {userRole === "ADMIN" && (
          <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 shadow-md animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#07497f] flex items-center gap-2">
                  <Users size={20} className="text-[#0586c7]"/> Equipe e Controle de Permissões (RBAC)
                </h3>
                <p className="text-xs text-[#748ca6] mt-0.5 font-medium">
                  Diferencial prático: Apenas Administradores (ADMIN) conseguem adicionar novos membros e definir seus cargos.
                </p>
              </div>
              <Link 
                href="/dashboard/users" 
                className="bg-[#07497f] hover:bg-[#0586c7] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-center"
              >
                <Shield size={14} /> Gerenciar Usuários
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#748ca6]/20 text-[#748ca6] text-sm">
                    <th className="pb-3 font-semibold">Nome de Usuário</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold text-center">Cargo (Role)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-[#748ca6]/10 hover:bg-[#748ca6]/5 transition-colors">
                        <td className="py-3 font-extrabold text-[#07497f] flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#07497f]/10 flex items-center justify-center font-bold text-[10px] text-[#07497f] uppercase">
                            {u.username.charAt(0)}
                          </div>
                          {u.username}
                        </td>
                        <td className="py-3 font-medium text-[#748ca6]">{u.email}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-[#7e22ce]/15 text-[#7e22ce] border border-[#7e22ce]/30 shadow-sm' : 'bg-[#0586c7]/15 text-[#0586c7] border border-[#0586c7]/30'}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[#748ca6] italic font-medium">
                        Carregando lista de usuários...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
