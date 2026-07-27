"use client";

import { Vehicle } from "../services/api";
import { Van, Calendar, Tag } from "lucide-react";
import BaseCard from "./BaseCard";

interface VehicleListProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: number) => void;
}

export default function VehicleList({
  vehicles,
  onEdit,
  onDelete,
}: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl flex flex-col items-center justify-center border-dashed border-2 border-[#748ca6]/40 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#748ca6]/10 flex items-center justify-center text-[#748ca6] mb-4">
          <Van size={32} />
        </div>
        <p className="text-[#748ca6] text-lg font-medium">
          Nenhum veículo registrado.
        </p>
        <p className="text-[#748ca6]/80 text-sm mt-1">
          Clique no botão Novo Veículo para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((v) => (
        <BaseCard
          key={v.id}
          icon={<Van size={24} />}
          title={v.modelo}
          subtitleBadge={
            <>
              {v.placa} <span className="mx-1">•</span> {v.tipo}
            </>
          }
          onEdit={() => onEdit(v)}
          onDelete={() => onDelete(v.id)}
          middleBlock={
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-5 border border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#748ca6] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Tag size={12} />
                  Placa
                </span>
                <span className="text-sm font-extrabold text-[#07497f] font-mono tracking-wider">
                  {v.placa}
                </span>
              </div>

              <div className="h-8 w-px bg-gray-200 mx-2"></div>

              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-[#748ca6] uppercase tracking-wider mb-1">
                  Categoria
                </span>
                <span className="text-sm font-bold text-[#ed842e]">
                  {v.tipo}
                </span>
              </div>
            </div>
          }
          footerLabel={
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              Ano de Fabricação
            </span>
          }
          footerValue={
            <span className="text-[#07497f] font-bold text-lg">{v.ano}</span>
          }
        />
      ))}
    </div>
  );
}
