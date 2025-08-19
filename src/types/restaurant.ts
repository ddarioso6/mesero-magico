export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaCreacion: string;
}

export interface Mesa {
  id: string;
  nombre: string;
  capacidad: number;
  ubicacion?: string;
}

export interface Reserva {
  id: string;
  clienteId: string;
  mesaId: string;
  fecha: string;
  hora: string;
  numeroPersonas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  notas?: string;
  fechaCreacion: string;
}

export interface ReservaCompleta extends Reserva {
  cliente: Cliente;
  mesa: Mesa;
}

export interface FormularioReserva {
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  numeroPersonas: number;
  notas?: string;
}