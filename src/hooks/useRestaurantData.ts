import { useState, useEffect } from 'react';
import { Cliente, Mesa, Reserva, ReservaCompleta, FormularioReserva } from '@/types/restaurant';

// Datos de ejemplo para el prototipo
const clientesIniciales: Cliente[] = [
  {
    id: '1',
    nombre: 'María García',
    email: 'maria@email.com',
    telefono: '+34 600 123 456',
    fechaCreacion: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    nombre: 'Carlos López',
    email: 'carlos@email.com',
    telefono: '+34 600 654 321',
    fechaCreacion: '2024-01-20T14:30:00Z'
  }
];

const mesasIniciales: Mesa[] = [
  { id: '1', nombre: 'Mesa 1', capacidad: 2, ubicacion: 'Ventana' },
  { id: '2', nombre: 'Mesa 2', capacidad: 4, ubicacion: 'Centro' },
  { id: '3', nombre: 'Mesa 3', capacidad: 6, ubicacion: 'Terraza' },
  { id: '4', nombre: 'Mesa 4', capacidad: 8, ubicacion: 'Sala privada' },
];

const reservasIniciales: Reserva[] = [
  {
    id: '1',
    clienteId: '1',
    mesaId: '1',
    fecha: '2024-12-25',
    hora: '20:00',
    numeroPersonas: 2,
    estado: 'confirmada',
    notas: 'Cena romántica',
    fechaCreacion: '2024-12-20T10:00:00Z'
  }
];

export function useRestaurantData() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [mesas, setMesas] = useState<Mesa[]>(mesasIniciales);
  const [reservas, setReservas] = useState<Reserva[]>(reservasIniciales);

  // Clientes CRUD
  const agregarCliente = (cliente: Omit<Cliente, 'id' | 'fechaCreacion'>) => {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString()
    };
    setClientes(prev => [...prev, nuevoCliente]);
    return nuevoCliente;
  };

  const actualizarCliente = (id: string, datosActualizados: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...datosActualizados } : c));
  };

  const eliminarCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    // También eliminar reservas del cliente
    setReservas(prev => prev.filter(r => r.clienteId !== id));
  };

  // Mesas CRUD
  const agregarMesa = (mesa: Omit<Mesa, 'id'>) => {
    const nuevaMesa: Mesa = {
      ...mesa,
      id: Date.now().toString()
    };
    setMesas(prev => [...prev, nuevaMesa]);
    return nuevaMesa;
  };

  const actualizarMesa = (id: string, datosActualizados: Partial<Mesa>) => {
    setMesas(prev => prev.map(m => m.id === id ? { ...m, ...datosActualizados } : m));
  };

  const eliminarMesa = (id: string) => {
    setMesas(prev => prev.filter(m => m.id !== id));
    // También eliminar reservas de la mesa
    setReservas(prev => prev.filter(r => r.mesaId !== id));
  };

  // Reservas CRUD
  const agregarReserva = (reserva: Omit<Reserva, 'id' | 'fechaCreacion'>) => {
    const nuevaReserva: Reserva = {
      ...reserva,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString()
    };
    setReservas(prev => [...prev, nuevaReserva]);
    return nuevaReserva;
  };

  const actualizarReserva = (id: string, datosActualizados: Partial<Reserva>) => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, ...datosActualizados } : r));
  };

  const eliminarReserva = (id: string) => {
    setReservas(prev => prev.filter(r => r.id !== id));
  };

  // Función para crear reserva pública
  const crearReservaPublica = (formulario: FormularioReserva): { exito: boolean; mensaje: string; reservaId?: string } => {
    // Buscar o crear cliente
    let cliente = clientes.find(c => c.email === formulario.email);
    if (!cliente) {
      cliente = agregarCliente({
        nombre: formulario.nombre,
        email: formulario.email,
        telefono: formulario.telefono
      });
    }

    // Buscar mesa disponible
    const mesaDisponible = encontrarMesaDisponible(
      formulario.fecha,
      formulario.hora,
      formulario.numeroPersonas
    );

    if (!mesaDisponible) {
      return {
        exito: false,
        mensaje: 'No hay mesas disponibles para la fecha, hora y número de personas seleccionadas.'
      };
    }

    // Crear reserva
    const nuevaReserva = agregarReserva({
      clienteId: cliente.id,
      mesaId: mesaDisponible.id,
      fecha: formulario.fecha,
      hora: formulario.hora,
      numeroPersonas: formulario.numeroPersonas,
      estado: 'pendiente',
      notas: formulario.notas
    });

    return {
      exito: true,
      mensaje: `Reserva creada exitosamente en ${mesaDisponible.nombre} para ${formulario.numeroPersonas} personas.`,
      reservaId: nuevaReserva.id
    };
  };

  // Función para encontrar mesa disponible
  const encontrarMesaDisponible = (fecha: string, hora: string, numeroPersonas: number): Mesa | null => {
    const mesasConCapacidad = mesas.filter(m => m.capacidad >= numeroPersonas);
    
    for (const mesa of mesasConCapacidad) {
      const estaOcupada = reservas.some(r => 
        r.mesaId === mesa.id && 
        r.fecha === fecha && 
        r.hora === hora && 
        r.estado !== 'cancelada'
      );
      
      if (!estaOcupada) {
        return mesa;
      }
    }
    
    return null;
  };

  // Obtener reservas completas (con datos de cliente y mesa)
  const obtenerReservasCompletas = (): ReservaCompleta[] => {
    return reservas.map(reserva => {
      const cliente = clientes.find(c => c.id === reserva.clienteId);
      const mesa = mesas.find(m => m.id === reserva.mesaId);
      
      return {
        ...reserva,
        cliente: cliente || { id: '', nombre: 'Cliente no encontrado', email: '', telefono: '', fechaCreacion: '' },
        mesa: mesa || { id: '', nombre: 'Mesa no encontrada', capacidad: 0 }
      };
    });
  };

  return {
    // Datos
    clientes,
    mesas,
    reservas,
    
    // Funciones CRUD
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    
    agregarMesa,
    actualizarMesa,
    eliminarMesa,
    
    agregarReserva,
    actualizarReserva,
    eliminarReserva,
    
    // Funciones especiales
    crearReservaPublica,
    encontrarMesaDisponible,
    obtenerReservasCompletas
  };
}