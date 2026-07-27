import { TripRequest, Vehicle } from "../services/api";

export const validateLogin = (
  email: string,
  password: string,
): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Por favor, insira um email válido para entrar.";
  }
  if (password.length < 6) {
    return "A senha deve ter no mínimo 6 caracteres.";
  }
  return null;
};

export const validateRegister = (
  username: string,
  email: string,
  password: string,
): string | null => {
  if (username.length < 3) {
    return "O nome de usuário deve ter no mínimo 3 caracteres.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Por favor, insira um email válido.";
  }
  if (password.length < 6) {
    return "A senha deve ter no mínimo 6 caracteres.";
  }
  return null;
};

export const validateVehicle = (
  placa: string,
  modelo: string,
  ano: number,
): string | null => {
  const placaRegex = /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/i;

  if (!placa.trim() || !placaRegex.test(placa)) {
    return "Placa inválida. Use o formato AAA-1234.";
  }
  if (!modelo.trim() || modelo.length > 50) {
    return "Modelo não pode estar vazio e deve ter até 50 caracteres.";
  }
  if (ano < 1900 || ano > new Date().getFullYear() + 1) {
    return "Ano inválido.";
  }
  return null;
};

export const validateTrip = (trip: TripRequest): string | null => {
  if (!trip.veiculoId || trip.veiculoId <= 0) {
    return "Por favor, selecione um veículo válido.";
  }
  if (!trip.origem.trim()) {
    return "A origem não pode estar vazia.";
  }
  if (!trip.destino.trim()) {
    return "O destino não pode estar vazio.";
  }
  if (!trip.dataSaida) {
    return "A data de saída é obrigatória.";
  }
  if (
    trip.dataChegada &&
    new Date(trip.dataChegada) < new Date(trip.dataSaida)
  ) {
    return "A data de chegada não pode ser anterior à data de saída.";
  }
  if (trip.kmPercorrida <= 0) {
    return "A quilometragem percorrida deve ser maior que zero.";
  }
  return null;
};
