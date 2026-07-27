"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Exclusão",
  description = "Tem certeza de que deseja excluir este registro? Esta ação é irreversível e os dados serão removidos permanentemente.",
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#f5f8f9] rounded-2xl shadow-2xl border border-[#748ca6]/20 p-6 md:p-8 transform transition-all scale-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar no topo */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-[#748ca6] hover:text-[#07497f] transition-colors p-1 rounded-lg hover:bg-gray-200/50"
          title="Fechar"
        >
          <X size={20} />
        </button>

        {/* Ícone de destaque central / topo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-4 shadow-inner">
            <AlertTriangle size={32} className="animate-pulse" />
          </div>

          <h3 
            className="text-xl font-bold text-[#07497f] mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {title}
          </h3>

          <p className="text-sm text-[#748ca6] leading-relaxed mb-8">
            {description}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#748ca6]/10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#748ca6]/30 text-[#07497f] bg-white hover:bg-gray-50 font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#748ca6]"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Trash2 size={16} />
            {loading ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
