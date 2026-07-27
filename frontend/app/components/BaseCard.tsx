"use client";

import React from "react";

interface BaseCardProps {
  icon: React.ReactNode;
  title: string;
  subtitleBadge: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  middleBlock: React.ReactNode;
  extraContent?: React.ReactNode;
  footerLabel: React.ReactNode;
  footerValue: React.ReactNode;
}

export default function BaseCard({
  icon,
  title,
  subtitleBadge,
  onEdit,
  onDelete,
  middleBlock,
  extraContent,
  footerLabel,
  footerValue,
}: BaseCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-5 group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header: Ícone, Título e Tag + Botões de Ação */}
        <div className="flex items-start justify-between gap-2 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#07497f]/10 flex items-center justify-center text-[#07497f] flex-shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#07497f]">{title}</h3>
              <div className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-md bg-gray-100 text-[#748ca6] text-xs font-semibold tracking-wide">
                {subtitleBadge}
              </div>
            </div>
          </div>

          {/* Botões de Ação (Editar e Excluir) */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={onEdit} 
              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200" 
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              onClick={onDelete} 
              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200" 
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bloco Central */}
        {middleBlock}

        {/* Conteúdo Extra (como os horários das viagens) */}
        {extraContent}
      </div>

      <div>
        {/* Divisor */}
        <hr className="border-gray-100 mb-4" />

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#748ca6]">
            {footerLabel}
          </span>
          <div className="text-[#07497f] font-medium text-sm">
            {footerValue}
          </div>
        </div>
      </div>
    </div>
  );
}
