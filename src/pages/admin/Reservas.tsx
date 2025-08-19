import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { Reserva } from "@/types/restaurant";

const Reservas = () => {
  const { toast } = useToast();
  const { 
    clientes, 
    mesas, 
    reservas, 
    agregarReserva, 
    actualizarReserva, 
    eliminarReserva, 
    obtenerReservasCompletas,
    encontrarMesaDisponible
  } = useRestaurantData();
  
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
  const [formulario, setFormulario] = useState({
    clienteId: '',
    mesaId: '',
    fecha: '',
    hora: '',
    numeroPersonas: 2,
    estado: 'pendiente' as 'pendiente' | 'confirmada' | 'cancelada',
    notas: ''
  });

  const horasDisponibles = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const reservasCompletas = obtenerReservasCompletas();

  const limpiarFormulario = () => {
    setFormulario({
      clienteId: '',
      mesaId: '',
      fecha: '',
      hora: '',
      numeroPersonas: 2,
      estado: 'pendiente',
      notas: ''
    });
    setReservaEditando(null);
  };

  const abrirDialogoNuevo = () => {
    limpiarFormulario();
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (reserva: Reserva) => {
    setFormulario({
      clienteId: reserva.clienteId,
      mesaId: reserva.mesaId,
      fecha: reserva.fecha,
      hora: reserva.hora,
      numeroPersonas: reserva.numeroPersonas,
      estado: reserva.estado,
      notas: reserva.notas || ''
    });
    setReservaEditando(reserva);
    setDialogoAbierto(true);
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.clienteId || !formulario.fecha || !formulario.hora) {
      toast({
        title: "Error",
        description: "Cliente, fecha y hora son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Si no se seleccionó una mesa específica, buscar una disponible
    let mesaId = formulario.mesaId;
    if (!mesaId) {
      const mesaDisponible = encontrarMesaDisponible(
        formulario.fecha,
        formulario.hora,
        formulario.numeroPersonas
      );
      
      if (!mesaDisponible) {
        toast({
          title: "Error",
          description: "No hay mesas disponibles para la fecha, hora y número de personas seleccionadas",
          variant: "destructive"
        });
        return;
      }
      
      mesaId = mesaDisponible.id;
    }

    try {
      const datosReserva = {
        clienteId: formulario.clienteId,
        mesaId: mesaId,
        fecha: formulario.fecha,
        hora: formulario.hora,
        numeroPersonas: formulario.numeroPersonas,
        estado: formulario.estado,
        notas: formulario.notas || undefined
      };

      if (reservaEditando) {
        actualizarReserva(reservaEditando.id, datosReserva);
        toast({
          title: "Reserva actualizada",
          description: "Los datos de la reserva se han actualizado correctamente"
        });
      } else {
        agregarReserva(datosReserva);
        toast({
          title: "Reserva creada",
          description: "La nueva reserva se ha registrado correctamente"
        });
      }
      
      setDialogoAbierto(false);
      limpiarFormulario();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la reserva",
        variant: "destructive"
      });
    }
  };

  const manejarEliminar = (id: string, clienteNombre: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la reserva de "${clienteNombre}"?`)) {
      try {
        eliminarReserva(id);
        toast({
          title: "Reserva eliminada",
          description: "La reserva ha sido eliminada correctamente"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la reserva",
          variant: "destructive"
        });
      }
    }
  };

  const cambiarEstado = (id: string, nuevoEstado: 'pendiente' | 'confirmada' | 'cancelada') => {
    try {
      actualizarReserva(id, { estado: nuevoEstado });
      toast({
        title: "Estado actualizado",
        description: `La reserva ha sido ${nuevoEstado}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const obtenerBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-dark">Gestión de Reservas</h1>
          <p className="text-muted-foreground">Administra las reservas del restaurante</p>
        </div>
        
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo} className="bg-gradient-primary shadow-elegant">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-restaurant-dark">
                {reservaEditando ? 'Editar Reserva' : 'Nueva Reserva'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select 
                    value={formulario.clienteId} 
                    onValueChange={(valor) => setFormulario(prev => ({ ...prev, clienteId: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre} - {cliente.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mesa">Mesa (opcional - se asignará automáticamente)</Label>
                  <Select 
                    value={formulario.mesaId} 
                    onValueChange={(valor) => setFormulario(prev => ({ ...prev, mesaId: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Asignación automática" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Asignación automática</SelectItem>
                      {mesas.map(mesa => (
                        <SelectItem key={mesa.id} value={mesa.id}>
                          {mesa.nombre} - {mesa.capacidad} personas
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formulario.fecha}
                    onChange={(e) => setFormulario(prev => ({ ...prev, fecha: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Select 
                    value={formulario.hora} 
                    onValueChange={(valor) => setFormulario(prev => ({ ...prev, hora: valor }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horasDisponibles.map(hora => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personas">Personas</Label>
                  <Select 
                    value={formulario.numeroPersonas.toString()} 
                    onValueChange={(valor) => setFormulario(prev => ({ ...prev, numeroPersonas: parseInt(valor) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'persona' : 'personas'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {reservaEditando && (
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    value={formulario.estado} 
                    onValueChange={(valor) => setFormulario(prev => ({ ...prev, estado: valor as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notas">Notas (opcional)</Label>
                <Textarea
                  id="notas"
                  value={formulario.notas}
                  onChange={(e) => setFormulario(prev => ({ ...prev, notas: e.target.value }))}
                  placeholder="Ocasión especial, alergias, preferencias..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-gradient-primary">
                  {reservaEditando ? 'Actualizar' : 'Crear'} Reserva
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-warm border-restaurant-cream">
        <CardHeader>
          <CardTitle className="text-restaurant-dark flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lista de Reservas ({reservasCompletas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasCompletas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay reservas registradas</p>
              <Button onClick={abrirDialogoNuevo} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crear primera reserva
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Mesa</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Personas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservasCompletas
                  .sort((a, b) => new Date(b.fecha + ' ' + b.hora).getTime() - new Date(a.fecha + ' ' + a.hora).getTime())
                  .map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reserva.cliente.nombre}</div>
                        <div className="text-sm text-muted-foreground">{reserva.cliente.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{reserva.mesa.nombre}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reserva.fecha}</div>
                        <div className="text-sm text-muted-foreground">{reserva.hora}</div>
                      </div>
                    </TableCell>
                    <TableCell>{reserva.numeroPersonas}</TableCell>
                    <TableCell>{obtenerBadgeEstado(reserva.estado)}</TableCell>
                    <TableCell className="max-w-40 truncate">{reserva.notas || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {reserva.estado === 'pendiente' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cambiarEstado(reserva.id, 'confirmada')}
                              title="Confirmar"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cambiarEstado(reserva.id, 'cancelada')}
                              title="Cancelar"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirDialogoEditar(reserva)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => manejarEliminar(reserva.id, reserva.cliente.nombre)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reservas;