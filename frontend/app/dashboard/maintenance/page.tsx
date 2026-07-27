"use client";

import { 
  DollarSign,
  Wrench,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useDashboardData } from "../layout";

export default function DashboardMaintenancePage() {
  const { data, loading, error } = useDashboardData();

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <>
      <div className="mb-8 border-b border-[#748ca6]/20 pb-6">
        <h1 className="text-3xl font-bold text-[#07497f]" style={{ fontFamily: "var(--font-outfit)" }}>
          Dashboard: Custos e Manutenções
        </h1>
        <p className="text-[#748ca6] mt-1 font-medium">Métricas detalhadas extraídas do banco de dados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex flex-col border border-[#059669]/30 relative overflow-hidden group shadow-md bg-[#059669]/5">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[#059669]">
            <DollarSign size={64} />
          </div>
          <p className="text-[#748ca6] text-sm font-semibold mb-1">Projeção Financeira (Mês Atual)</p>
          <p className="text-3xl font-bold text-[#059669]">{formatCurrency(data.projecaoFinanceiraMes)}</p>
          <p className="text-xs text-[#748ca6] font-medium mt-2">Soma do custo estimado para o mês vigente</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 lg:col-span-2 shadow-md">
          <h3 className="text-lg font-bold text-[#07497f] mb-6 flex items-center gap-2">
            <Wrench size={20} className="text-[#748ca6]"/> Cronograma de Manutenções Pendentes
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#748ca6]/20 text-[#748ca6] text-sm">
                  <th className="pb-3 font-semibold">Placa</th>
                  <th className="pb-3 font-semibold">Data Agendada</th>
                  <th className="pb-3 font-semibold">Serviço</th>
                  <th className="pb-3 font-semibold text-right">Custo Est.</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.proximasManutencoes.length > 0 ? (
                  data.proximasManutencoes.map((manutencao) => (
                    <tr key={manutencao.id} className="border-b border-[#748ca6]/10 hover:bg-[#748ca6]/5 transition-colors">
                      <td className="py-4 font-medium">
                        <div className="bg-[#0586c7]/15 text-[#0586c7] rounded-lg px-3 py-1 inline-block border border-[#0586c7]/40 font-mono font-extrabold tracking-wider shadow-sm">
                          {manutencao.placa}
                        </div>
                      </td>
                      <td className="py-4 text-[#07497f] font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-[#748ca6]" />
                        {new Date(manutencao.dataAgendada).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 text-[#07497f] font-medium">{manutencao.descricao}</td>
                      <td className="py-4 text-right text-[#059669] font-bold">{formatCurrency(manutencao.custoEstimado)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#748ca6] italic font-medium">
                      Nenhuma manutenção pendente agendada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histórico de Manutenções Concluídas */}
        <div className="glass p-6 rounded-2xl border border-[#748ca6]/20 lg:col-span-3 mt-2 shadow-md">
          <h3 className="text-lg font-bold text-[#07497f] mb-6 flex items-center gap-2">
            <Wrench size={20} className="text-[#748ca6]"/> Histórico de Manutenções Concluídas
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#748ca6]/20 text-[#748ca6] text-sm">
                  <th className="pb-3 font-semibold">Placa</th>
                  <th className="pb-3 font-semibold">Data Conclusão</th>
                  <th className="pb-3 font-semibold">Serviço</th>
                  <th className="pb-3 font-semibold text-right">Custo Realizado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.manutencoesConcluidas?.length > 0 ? (
                  data.manutencoesConcluidas.map((manutencao) => (
                    <tr key={manutencao.id} className="border-b border-[#748ca6]/10 hover:bg-[#748ca6]/5 transition-colors">
                      <td className="py-4 font-medium">
                        <div className="bg-[#0586c7]/15 text-[#0586c7] rounded-lg px-3 py-1 inline-block border border-[#0586c7]/40 font-mono font-extrabold tracking-wider shadow-sm">
                          {manutencao.placa}
                        </div>
                      </td>
                      <td className="py-4 text-[#07497f] font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-[#748ca6]" />
                        {new Date(manutencao.dataAgendada).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 text-[#07497f] font-medium">{manutencao.descricao}</td>
                      <td className="py-4 text-right text-[#059669] font-bold">{formatCurrency(manutencao.custoEstimado)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#748ca6] italic font-medium">
                      Nenhuma manutenção concluída registrada no histórico.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
