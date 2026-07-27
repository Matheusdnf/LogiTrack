"use client";

import { useEffect, useState } from "react";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  Vehicle,
} from "../services/api";
import VehicleList from "../components/VehicleList";
import VehicleForm from "../components/VehicleForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CrudPageLayout from "../components/CrudPageLayout";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const vehiclesData = await fetchVehicles();
      setVehicles(vehiclesData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (formData: Omit<Vehicle, "id">) => {
    if (editingVehicle && editingVehicle.id) {
      await updateVehicle(editingVehicle.id, formData);
    } else {
      await createVehicle(formData);
    }
    await loadData();
    handleCloseModal();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteVehicle(deleteId);
      await loadData();
      setDeleteId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tipo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CrudPageLayout
      title="LogiTrack"
      subtitle="Gerenciamento de Veículos da Frota"
      buttonText="Novo Veículo"
      onNewAction={handleOpenModal}
      searchPlaceholder="Buscar por modelo, placa ou tipo..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      error={error}
      deleteModal={{
        isOpen: deleteId !== null,
        onClose: () => setDeleteId(null),
        onConfirm: handleConfirmDelete,
        title: "Excluir Veículo",
        description:
          "Tem certeza de que deseja excluir este veículo? Se houver viagens associadas a ele, elas também poderão ser removidas do sistema.",
        loading: deleting,
      }}
      formModal={
        isModalOpen && (
          <VehicleForm
            initialData={editingVehicle || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        )
      }
    >
      <VehicleList
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </CrudPageLayout>
  );
}
