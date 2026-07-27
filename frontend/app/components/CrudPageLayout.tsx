"use client";

import React from "react";
import PageHeader from "./ui/PageHeader";
import SearchInput from "./ui/SearchInput";
import AlertError from "./ui/AlertError";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface CrudPageLayoutProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onNewAction: () => void;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  error?: string | null;
  children: React.ReactNode;
  deleteModal: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    loading: boolean;
  };
  formModal: React.ReactNode;
}

export default function CrudPageLayout({
  title,
  subtitle,
  buttonText,
  onNewAction,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  error,
  children,
  deleteModal,
  formModal,
}: CrudPageLayoutProps) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
        buttonText={buttonText} 
        onAction={onNewAction} 
      />

      <SearchInput 
        placeholder={searchPlaceholder} 
        value={searchQuery} 
        onChange={onSearchChange} 
      />

      <AlertError message={error} />

      {children}

      {formModal}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        description={deleteModal.description}
        loading={deleteModal.loading}
      />
    </div>
  );
}
