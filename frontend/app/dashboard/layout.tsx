"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Wrench, AlertCircle, Users } from "lucide-react";

// Types matching the backend DTOs
type CategoryVolume = {
  categoria: string;
  totalViagens: number;
};

type MaintenanceSchedule = {
  id: number;
  placa: string;
  dataAgendada: string;
  descricao: string;
  custoEstimado: number;
};

type UtilizationRanking = {
  veiculoId: number;
  placa: string;
  modelo: string;
  tipo: string;
  kmAcumulado: number;
};

export type DashboardSummary = {
  totalKm: number;
  volumePorCategoria: CategoryVolume[];
  proximasManutencoes: MaintenanceSchedule[];
  manutencoesConcluidas: MaintenanceSchedule[];
  rankingUtilizacao: UtilizationRanking[];
  projecaoFinanceiraMes: number;
};

type DashboardContextType = {
  data: DashboardSummary | null;
  totalVehicles: number;
  loading: boolean;
  error: string | null;
};

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  totalVehicles: 0,
  loading: true,
  error: null,
});

export function useDashboardData() {
  return useContext(DashboardContext);
}

import { API_URL } from "../services/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("GESTOR");

  useEffect(() => {
    queueMicrotask(() => {
      setUserRole(localStorage.getItem("userRole") || "GESTOR");
    });
    Promise.all([
      fetch(`${API_URL}/dashboard/summary`, { credentials: 'include' }).then((res) => {
        if (!res.ok) {
            if(res.status === 403 || res.status === 401) throw new Error("Acesso negado. Faça login para acessar o dashboard.");
            throw new Error("Falha ao carregar métricas do dashboard");
        }
        return res.json();
      }),
      fetch(`${API_URL}/vehicles`, { credentials: 'include' }).then((res) => {
        if (!res.ok) return []; // Fallback se der erro
        return res.json();
      })
    ])
      .then(([summaryJson, vehiclesJson]) => {
        setData(summaryJson);
        setTotalVehicles(vehiclesJson.length || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardContext.Provider value={{ data, totalVehicles, loading, error }}>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Menu Lateral do Dashboard */}
        <aside className="w-64 glass border-r border-[#748ca6]/20 flex flex-col h-full bg-[#748ca6]/5">
          <div className="p-6 border-b border-[#748ca6]/20">
            <h2 className="text-lg font-bold text-[#07497f]" style={{ fontFamily: "var(--font-outfit)" }}>Menu do Dashboard</h2>
            <p className="text-xs text-[#748ca6] font-medium">Navegue pelas categorias</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link 
              href="/dashboard" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${pathname === "/dashboard" ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
            >
              <Activity size={18} /> Veículos
            </Link>
            <Link 
              href="/dashboard/maintenance" 
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${pathname === "/dashboard/maintenance" ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
            >
              <Wrench size={18} /> Manutenções
            </Link>
            {userRole === "ADMIN" && (
              <Link 
                href="/dashboard/users" 
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${pathname === "/dashboard/users" ? "bg-[#07497f] text-white shadow-md" : "text-[#748ca6] hover:bg-[#748ca6]/10 hover:text-[#07497f]"}`}
              >
                <Users size={18} /> Usuários & Acesso
              </Link>
            )}
          </nav>
        </aside>

        {/* Conteúdo Principal injetado pelo Next.js (children) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
