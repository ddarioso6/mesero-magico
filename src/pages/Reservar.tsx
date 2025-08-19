import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat, Calendar, Users, Clock, Phone, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { FormularioReserva } from "@/types/restaurant";

const Reservar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { crearReservaPublica } = useRestaurantData();
  
  const [formulario, setFormulario] = useState<FormularioReserva>({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    numeroPersonas: 2,
    notas: ''
  });

  const [cargando, setCargando] = useState(false);

  const horasDisponibles = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const manejarCambio = (campo: keyof FormularioReserva, valor: string | number) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Validaciones básicas
      if (!formulario.nombre || !formulario.email || !formulario.telefono || !formulario.fecha || !formulario.hora) {
        toast({
          title: "Error",
          description: "Por favor, completa todos los campos obligatorios.",
          variant: "destructive"
        });
        return;
      }

      // Validar fecha no sea en el pasado
      const fechaSeleccionada = new Date(formulario.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        toast({
          title: "Error",
          description: "No puedes hacer una reserva en el pasado.",
          variant: "destructive"
        });
        return;
      }

      const resultado = crearReservaPublica(formulario);

      if (resultado.exito) {
        toast({
          title: "¡Reserva exitosa!",
          description: resultado.mensaje,
        });
        
        // Limpiar formulario
        setFormulario({
          nombre: '',
          email: '',
          telefono: '',
          fecha: '',
          hora: '',
          numeroPersonas: 2,
          notas: ''
        });
        
        // Redirigir después de un momento
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast({
          title: "Error al crear reserva",
          description: resultado.mensaje,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-foreground">
              <ChefHat className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">La Cantina</h1>
                <p className="text-primary-foreground/80">Hacer Reserva</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Formulario de Reserva */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-elegant border-restaurant-cream">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-restaurant-dark flex items-center justify-center gap-2">
                <Calendar className="h-8 w-8 text-restaurant-gold" />
                Reservar Mesa
              </CardTitle>
              <p className="text-muted-foreground">
                Completa el formulario para hacer tu reserva. Te confirmaremos disponibilidad pronto.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={manejarEnvio} className="space-y-6">
                {/* Datos Personales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-restaurant-dark flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Datos Personales
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        type="text"
                        value={formulario.nombre}
                        onChange={(e) => manejarCambio('nombre', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formulario.telefono}
                        onChange={(e) => manejarCambio('telefono', e.target.value)}
                        placeholder="+34 600 123 456"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formulario.email}
                      onChange={(e) => manejarCambio('email', e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Detalles de la Reserva */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-restaurant-dark flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Detalles de la Reserva
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha *</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formulario.fecha}
                        onChange={(e) => manejarCambio('fecha', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hora">Hora *</Label>
                      <Select value={formulario.hora} onValueChange={(valor) => manejarCambio('hora', valor)}>
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
                      <Label htmlFor="personas">Personas *</Label>
                      <Select value={formulario.numeroPersonas.toString()} onValueChange={(valor) => manejarCambio('numeroPersonas', parseInt(valor))}>
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
                </div>

                {/* Notas adicionales */}
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas adicionales (opcional)</Label>
                  <Textarea
                    id="notas"
                    value={formulario.notas}
                    onChange={(e) => manejarCambio('notas', e.target.value)}
                    placeholder="Ocasión especial, alergias, preferencias..."
                    rows={3}
                  />
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
                  size="lg"
                  disabled={cargando}
                >
                  {cargando ? (
                    "Procesando reserva..."
                  ) : (
                    <>
                      <Calendar className="mr-2 h-5 w-5" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="mt-8 bg-restaurant-cream/30 border-restaurant-cream">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-restaurant-dark mb-4">Información importante:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Las reservas estarán sujetas a confirmación según disponibilidad.</li>
                <li>• Te contactaremos dentro de las próximas 2 horas para confirmar tu reserva.</li>
                <li>• En caso de cancelación, por favor avísanos con al menos 2 horas de anticipación.</li>
                <li>• Para grupos de más de 8 personas, por favor contáctanos directamente.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Reservar;