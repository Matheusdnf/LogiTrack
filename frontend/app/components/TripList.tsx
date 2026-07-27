"use client";

import { Trip } from "../services/api";
import { Truck, ArrowRight, Clock } from "lucide-react";
import BaseCard from "./BaseCard";

interface TripListProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: number) => void;
}

export default function TripList({ trips, onEdit, onDelete }: TripListProps) {
  if (trips.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl flex flex-col items-center justify-center border-dashed border-2 border-[#748ca6]/40 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#748ca6]/10 flex items-center justify-center text-[#748ca6] mb-4">
          <Truck size={32} />
        </div>
        <p className="text-[#748ca6] text-lg font-medium">
          Nenhuma viagem registrada.
        </p>
        <p className="text-[#748ca6]/80 text-sm mt-1">
          Clique no botão Nova Viagem para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <BaseCard
          key={trip.id}
          icon={<Truck size={24} />}
          title={trip.veiculo.modelo}
          subtitleBadge={
            <>
              {trip.veiculo.placa} <span className="mx-1">•</span>{" "}
              {trip.veiculo.tipo}
            </>
          }
          onEdit={() => onEdit(trip)}
          onDelete={() => onDelete(trip.id)}
          middleBlock={
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-5 border border-gray-100">
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-xs font-semibold text-[#748ca6] uppercase tracking-wider mb-1">
                  Origem
                </span>
                <span
                  className="text-sm font-bold text-[#07497f] truncate"
                  title={trip.origem}
                >
                  {trip.origem}
                </span>
              </div>

              <div className="text-[#ed842e] flex-shrink-0 mx-2">
                <ArrowRight size={20} />
              </div>

              <div className="flex flex-col text-right flex-1 overflow-hidden">
                <span className="text-xs font-semibold text-[#748ca6] uppercase tracking-wider mb-1">
                  Destino
                </span>
                <span
                  className="text-sm font-bold text-[#07497f] truncate"
                  title={trip.destino}
                >
                  {trip.destino}
                </span>
              </div>
            </div>
          }
          extraContent={
            <div className="flex justify-between mb-5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#748ca6]">
                  <Clock size={14} />
                  <span className="text-xs font-medium">Saída</span>
                </div>
                <span className="text-sm font-semibold text-[#07497f]">
                  {new Date(trip.dataSaida).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-right items-end">
                <div className="flex items-center gap-1.5 text-[#748ca6]">
                  <Clock size={14} />
                  <span className="text-xs font-medium">Chegada</span>
                </div>
                <span className="text-sm font-semibold text-[#07497f]">
                  {trip.dataChegada ? (
                    new Date(trip.dataChegada).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <span className="text-[#ed842e] font-semibold italic">
                      Em andamento
                    </span>
                  )}
                </span>
              </div>
            </div>
          }
          footerLabel="Distância Percorrida"
          footerValue={
            <>
              <span className="text-[#ed842e] font-bold text-lg mr-1">
                {trip.kmPercorrida}
              </span>
              km
            </>
          }
        />
      ))}
    </div>
  );
}
