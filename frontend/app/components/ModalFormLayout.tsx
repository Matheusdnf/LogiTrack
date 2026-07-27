"use client";

import React from "react";

interface ModalFormLayoutProps {
  title: string;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formId: string;
  isSubmitting: boolean;
  submitText: string;
  submittingText: string;
  error?: string | null;
  children: React.ReactNode;
}

export default function ModalFormLayout({
  title,
  onCancel,
  onSubmit,
  formId,
  isSubmitting,
  submitText,
  submittingText,
  error,
  children,
}: ModalFormLayoutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#f5f8f9] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200/80 max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-[#748ca6]/20 flex justify-between items-center bg-white">
          <h3
            className="text-xl font-bold text-[#07497f]"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#748ca6] hover:text-[#07497f] transition-colors hover:bg-gray-100 rounded-full p-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-5 p-3 border border-[#ed842e]/40 bg-[#ed842e]/10 text-[#07497f] font-medium rounded-xl text-sm flex items-start gap-2 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0 mt-0.5 text-[#ed842e]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form id={formId} onSubmit={onSubmit} className="space-y-5">
            {children}
          </form>
        </div>

        <div className="px-6 py-4 border-t border-[#748ca6]/20 flex justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-[#748ca6] hover:text-[#07497f] hover:bg-gray-100 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#07497f] hover:bg-[#07497f]/90 text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {submittingText}
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
