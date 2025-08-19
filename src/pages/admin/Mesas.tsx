import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { Mesa } from "@/types/restaurant";

const Mesas = () => {
  const { toast } = useToast();
  const { mesas, agregarMesa, actualizarMesa, eliminarMesa } = useRestaurantData();
  
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mesaEditando, setMesaEditando] = useState<Mesa | null>(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    capacidad: 2,
    ubicacion: ''
  });

  const ubicacionesDisponibles = [
    'Ventana',
    'Centro',
    'Terraza',
    'Sala privada',
    'Barra',
    'Patio interior'
  ];

  const limpiarFormulario = () => {
    setFormulario({ nombre: '', capacidad: 2, ubicacion: '' });
    setMesaEditando(null);
  };

  const abrirDialogoNuevo = () => {
    limpiarFormulario();
    setDialogoAbierto(true);
  };

  const abrirDialogoEditar = (mesa: Mesa) => {
    setFormulario({
      nombre: mesa.nombre,
      capacidad: mesa.capacidad,
      ubicacion: mesa.ubicacion || ''
    });
    setMesaEditando(mesa);
    setDialogoAbierto(true);
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formulario.nombre || formulario.capacidad < 1) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio y la capacidad debe ser mayor a 0",
        variant: "destructive"
      });
      return;
    }

    try {
      const datosMesa = {
        nombre: formulario.nombre,
        capacidad: formulario.capacidad,
        ubicacion: formulario.ubicacion || undefined
      };

      if (mesaEditando) {
        actualizarMesa(mesaEditando.id, datosMesa);
        toast({
          title: "Mesa actualizada",
          description: "Los datos de la mesa se han actualizado correctamente"
        });
      } else {
        agregarMesa(datosMesa);
        toast({
          title: "Mesa creada",
          description: "La nueva mesa se ha registrado correctamente"
        });
      }
      
      setDialogoAbierto(false);
      limpiarFormulario();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la mesa",
        variant: "destructive"
      });
    }
  };

  const manejarEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la "${nombre}"?`)) {
      try {
        eliminarMesa(id);
        toast({
          title: "Mesa eliminada",
          description: "La mesa ha sido eliminada correctamente"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la mesa",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-restaurant-dark">Gestión de Mesas</h1>
          <p className="text-muted-foreground">Administra las mesas del restaurante</p>
        </div>
        
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogoNuevo} className="bg-gradient-primary shadow-elegant">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Mesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-restaurant-dark">
                {mesaEditando ? 'Editar Mesa' : 'Nueva Mesa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={manejarEnvio} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la mesa</Label>
                <Input
                  id="nombre"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Mesa 1, Mesa VIP, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacidad">Capacidad (personas)</Label>
                <Select 
                  value={formulario.capacidad.toString()} 
                  onValueChange={(valor) => setFormulario(prev => ({ ...prev, capacidad: parseInt(valor) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'persona' : 'personas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación (opcional)</Label>
                <Select 
                  value={formulario.ubicacion} 
                  onValueChange={(valor) => setFormulario(prev => ({ ...prev, ubicacion: valor }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin ubicación específica</SelectItem>
                    {ubicacionesDisponibles.map(ubicacion => (
                      <SelectItem key={ubicacion} value={ubicacion}>
                        {ubicacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-gradient-primary">
                  {mesaEditando ? 'Actualizar' : 'Crear'} Mesa
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
            <Utensils className="h-5 w-5" />
            Lista de Mesas ({mesas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mesas.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay mesas registradas</p>
              <Button onClick={abrirDialogoNuevo} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Agregar primera mesa
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mesas.map((mesa) => (
                    <TableRow key={mesa.id}>
                      <TableCell className="font-medium">{mesa.nombre}</TableCell>
                      <TableCell>{mesa.capacidad} personas</TableCell>
                      <TableCell>{mesa.ubicacion || 'No especificada'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirDialogoEditar(mesa)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => manejarEliminar(mesa.id, mesa.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Vista de tarjetas para mejor visualización */}
              <div>
                <h3 className="text-lg font-semibold text-restaurant-dark mb-4">Vista de Mesas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mesas.map((mesa) => (
                    <Card key={mesa.id} className="border-restaurant-cream/50 hover:shadow-warm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-restaurant-dark">{mesa.nombre}</h4>
                          <Utensils className="h-5 w-5 text-restaurant-gold" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Capacidad: {mesa.capacidad} personas
                        </p>
                        {mesa.ubicacion && (
                          <p className="text-sm text-muted-foreground">
                            Ubicación: {mesa.ubicacion}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Mesas;