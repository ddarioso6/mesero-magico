import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { Cliente } from "@/types/restaurant";

const Clientes = () => {
  const { toast } = useToast();
  const { clientes, agregarCliente, actualizarCliente, eliminarCliente } = useRestaurantData();
  
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', email: '', telefono: '' });
    setClienteEditando(null);
  };

  const abrirDialogoNuevo = () => {
    limpiarFormulario();
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (cliente: Cliente) => {
    setFormulario({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono
    });
    setClienteEditando(cliente);
    setDialogoAbierto(true);
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.nombre || !formulario.email || !formulario.telefono) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      if (clienteEditando) {
        actualizarCliente(clienteEditando.id, formulario);
        toast({
          title: "Cliente actualizado",
          description: "Los datos del cliente se han actualizado correctamente"
        });
      } else {
        agregarCliente(formulario);
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente se ha registrado correctamente"
        });
      }
      
      setDialogoAbierto(false);
      limpiarFormulario();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente",
        variant: "destructive"
      });
    }
  };

  const manejarEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente "${nombre}"?`)) {
      try {
        eliminarCliente(id);
        toast({
          title: "Cliente eliminado",
          description: "El cliente ha sido eliminado correctamente"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-dark">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra la información de los clientes</p>
        </div>
        
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo} className="bg-gradient-primary shadow-elegant">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-restaurant-dark">
                {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre del cliente"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@ejemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="+34 600 123 456"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-gradient-primary">
                  {clienteEditando ? 'Actualizar' : 'Crear'} Cliente
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
            <Users className="h-5 w-5" />
            Lista de Clientes ({clientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay clientes registrados</p>
              <Button onClick={abrirDialogoNuevo} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Agregar primer cliente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>
                      {new Date(cliente.fechaCreacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirDialogoEditar(cliente)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => manejarEliminar(cliente.id, cliente.nombre)}
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

export default Clientes;