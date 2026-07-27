export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getJsonHeaders = () => {
  return { 'Content-Type': 'application/json' };
};

export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
}

export interface Trip {
  id: number;
  veiculo: Vehicle;
  dataSaida: string;
  dataChegada: string | null;
  origem: string;
  destino: string;
  kmPercorrida: number;
}

export interface TripRequest {
  veiculoId: number;
  dataSaida: string;
  dataChegada: string | null;
  origem: string;
  destino: string;
  kmPercorrida: number;
}

export const fetchTrips = async (): Promise<Trip[]> => {
  const res = await fetch(`${API_URL}/trips`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar viagens (você está logado?)');
  return res.json();
};

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch(`${API_URL}/vehicles`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar veículos (você está logado?)');
  return res.json();
};

export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao criar veículo');
  }
  return res.json();
};

export const updateVehicle = async (id: number, vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar veículo');
  }
  return res.json();
};

export const deleteVehicle = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao deletar veículo');
  }
};

export const createTrip = async (trip: TripRequest): Promise<Trip> => {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(trip),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao criar viagem');
  }
  return res.json();
};

export const updateTrip = async (id: number, trip: TripRequest): Promise<Trip> => {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(trip),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar viagem');
  }
  return res.json();
};

export const deleteTrip = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/trips/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao excluir viagem');
};

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${API_URL}/users`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro ao criar usuário');
    throw new Error(errorText || 'Erro ao criar usuário');
  }
  return res.json();
};

export interface UpdateUserRequest {
  username: string;
  email: string;
  password?: string;
  role: string;
}

export const updateUser = async (id: number, user: UpdateUserRequest): Promise<User> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: getJsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro ao editar usuário');
    throw new Error(errorText || 'Erro ao editar usuário');
  }
  return res.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Erro ao excluir usuário');
    throw new Error(errorText || 'Erro ao excluir usuário');
  }
};


