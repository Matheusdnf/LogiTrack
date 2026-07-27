"use client";

import { useEffect, useState } from "react";
import { fetchTrips, fetchVehicles, createTrip, updateTrip, deleteTrip, Trip, Vehicle, TripRequest } from "../services/api";
import TripForm from "../components/TripForm";
import TripList from "../components/TripList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CrudPageLayout from "../components/CrudPageLayout";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [tripsData, vehiclesData] = await Promise.all([fetchTrips(), fetchVehicles()]);
      setTrips(tripsData);
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
  };

  const handleOpenModal = (trip?: Trip) => {
    setEditingTrip(trip || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrip(null);
  };

  const handleSubmit = async (formData: TripRequest) => {
    if (editingTrip) {
      await updateTrip(editingTrip.id, formData);
    } else {
      await createTrip(formData);
    }
    await loadData();
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTrip(deleteId);
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

  const filteredTrips = trips.filter(t => 
    t.veiculo.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.veiculo.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.origem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destino.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CrudPageLayout
      title="LogiTrack"
      subtitle="Gerenciamento de Viagens"
      buttonText="Nova Viagem"
      onNewAction={() => handleOpenModal()}
      searchPlaceholder="Buscar por origem, destino, modelo ou placa..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      error={error}
      deleteModal={{
        isOpen: deleteId !== null,
        onClose: () => setDeleteId(null),
        onConfirm: handleConfirmDelete,
        title: "Excluir Viagem",
        description:
          "Tem certeza de que deseja excluir esta viagem? O registro será removido permanentemente.",
        loading: deleting,
      }}
      formModal={
        isModalOpen && (
          <TripForm
            vehicles={vehicles}
            initialData={
              editingTrip
                ? {
                    veiculoId: editingTrip.veiculo.id,
                    dataSaida: editingTrip.dataSaida.slice(0, 16),
                    dataChegada: editingTrip.dataChegada
                      ? editingTrip.dataChegada.slice(0, 16)
                      : "",
                    origem: editingTrip.origem,
                    destino: editingTrip.destino,
                    kmPercorrida: editingTrip.kmPercorrida,
                  }
                : null
            }
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        )
      }
    >
      <TripList
        trips={filteredTrips}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />
    </CrudPageLayout>
  );
}
