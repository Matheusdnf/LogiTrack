"use client";

import { useState } from "react";
import { Vehicle } from "../services/api";

import { validateVehicle } from "../utils/validators_front";
import ModalFormLayout from "./ModalFormLayout";

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: Omit<Vehicle, "id">) => Promise<void>;
  onCancel: () => void;
}

export default function VehicleForm({
  initialData,
  onSubmit,
  onCancel,
}: VehicleFormProps) {
  const formatPlaca = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
    if (clean.length > 3) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    return clean;
  };

  const [formData, setFormData] = useState<Omit<Vehicle, "id">>({
    placa: initialData?.placa ? formatPlaca(initialData.placa) : "",
    modelo: initialData?.modelo || "",
    tipo: initialData?.tipo || "LEVE",
    ano: initialData?.ano || new Date().getFullYear(),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    setError("");
    const validationError = validateVehicle(
      formData.placa,
      formData.modelo,
      formData.ano,
    );

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
      await onSubmit(formData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao salvar o veículo.");
      } else {
        setError("Erro inesperado ao salvar o veículo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalFormLayout
      title={initialData ? "Editar Veículo" : "Novo Veículo"}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      formId="vehicle-form"
      isSubmitting={isSubmitting}
      submitText={initialData ? "Salvar Alterações" : "Salvar Veículo"}
      submittingText="Salvando..."
      error={error}
    >
      <div>
        <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
          Modelo
        </label>
        <input
          type="text"
          required
          placeholder="Ex: Scania R500"
          value={formData.modelo}
          onChange={(e) =>
            setFormData({ ...formData, modelo: e.target.value })
          }
          className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 placeholder-[#748ca6]/60 focus:ring-2 focus:ring-[#0586c7] bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Placa
          </label>
          <input
            type="text"
            required
            placeholder="ABC-1234"
            maxLength={8}
            value={formData.placa}
            onChange={(e) =>
              setFormData({
                ...formData,
                placa: formatPlaca(e.target.value),
              })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 placeholder-[#748ca6]/60 uppercase focus:ring-2 focus:ring-[#0586c7] bg-white font-mono font-bold tracking-wider"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
            Ano
          </label>
          <input
            type="number"
            required
            placeholder="2024"
            value={formData.ano || ""}
            onChange={(e) =>
              setFormData({ ...formData, ano: Number(e.target.value) })
            }
            className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 placeholder-[#748ca6]/60 focus:ring-2 focus:ring-[#0586c7] bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#748ca6] mb-1.5">
          Tipo do Veículo
        </label>
        <select
          required
          value={formData.tipo}
          onChange={(e) =>
            setFormData({ ...formData, tipo: e.target.value })
          }
          className="w-full glass-input border border-[#748ca6]/30 text-[#07497f] rounded-xl px-4 py-2.5 appearance-none focus:ring-2 focus:ring-[#07497f] bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23748ca6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          <option value="LEVE" className="bg-white text-[#07497f]">
            Veículo Leve (Carro / Van)
          </option>
          <option value="PESADO" className="bg-white text-[#07497f]">
            Veículo Pesado (Caminhão / Ônibus)
          </option>
        </select>
      </div>
    </ModalFormLayout>
  );
}
