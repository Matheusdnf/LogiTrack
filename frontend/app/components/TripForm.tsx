"use client";

import { useState } from "react";
import { TripRequest, Vehicle } from "../services/api";

import { validateTrip } from "../utils/validators_front";
import ModalFormLayout from "./ModalFormLayout";

interface TripFormProps {
  vehicles: Vehicle[];
  initialData?: TripRequest | null;
  onSubmit: (data: TripRequest) => Promise<void>;
  onCancel: () => void;
}

export default function TripForm({
  vehicles,
  initialData,
  onSubmit,
  onCancel,
}: TripFormProps) {
  const [formData, setFormData] = useState<TripRequest>(
    initialData || {
      veiculoId: vehicles.length > 0 ? vehicles[0].id : 0,
      dataSaida: "",
      dataChegada: "",
      origem: "",
      destino: "",
      kmPercorrida: 0,
    },
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    setError("");
    const validationError = validateTrip(formData);

    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dataChegada: formData.dataChegada || null,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro inesperado ao salvar a viagem.");
      } else {
        setError("Erro inesperado ao salvar a viagem.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalFormLayout
      title={initialData ? "Editar Viagem" : "Nova Viagem"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      formId="trip-form"
      isSubmitting={isSubmitting}
      submitText={initialData ? "Salvar Alterações" : "Salvar Viagem"}
      submittingText="Salvando..."
      error={error}
    >
      <div>
        <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
          Veículo
        </label>
        <select
          required
          value={formData.veiculoId}
          onChange={(e) =>
            setFormData({
              ...formData,
              veiculoId: Number(e.target.value),
            })
          }
          className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 appearance-none focus:ring-2 focus:ring-[#0586c7] bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23748ca6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          <option value={0} disabled className="bg-white text-[#748ca6]">
            Selecione um veículo
          </option>
          {vehicles.map((v) => (
            <option
              key={v.id}
              value={v.id}
              className="bg-white text-[#07497f]"
            >
              {v.modelo} - {v.placa}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Origem
          </label>
          <input
            type="text"
            required
            placeholder="Ex: São Paulo, SP"
            value={formData.origem}
            onChange={(e) =>
              setFormData({ ...formData, origem: e.target.value })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 placeholder-[#748ca6]/60 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Destino
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Rio de Janeiro, RJ"
            value={formData.destino}
            onChange={(e) =>
              setFormData({ ...formData, destino: e.target.value })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 placeholder-[#748ca6]/60 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Data de Saída
          </label>
          <input
            type="datetime-local"
            required
            value={formData.dataSaida}
            onChange={(e) =>
              setFormData({ ...formData, dataSaida: e.target.value })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Data de Chegada (Opcional)
          </label>
          <input
            type="datetime-local"
            value={formData.dataChegada || ""}
            onChange={(e) =>
              setFormData({ ...formData, dataChegada: e.target.value })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
          Quilometragem (KM)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            value={formData.kmPercorrida || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                kmPercorrida: Number(e.target.value),
              })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl pl-4 pr-12 py-2.5 placeholder-[#748ca6]/60 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#748ca6] text-sm font-semibold">
            km
          </span>
        </div>
      </div>
    </ModalFormLayout>
  );
}
