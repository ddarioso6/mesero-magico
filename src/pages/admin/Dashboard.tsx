import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Utensils, TrendingUp } from "lucide-react";
import { useRestaurantData } from "@/hooks/useRestaurantData";

const Dashboard = () => {
  const { clientes, mesas, reservas, obtenerReservasCompletas } = useRestaurantData();
  
  const reservasCompletas = obtenerReservasCompletas();
  const reservasHoy = reservas.filter(r => r.fecha === new Date().toISOString().split('T')[0]);
  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;

  const estadisticas = [
    {
      titulo: "Total Clientes",
      valor: clientes.length,
      icono: Users,
      descripcion: "Clientes registrados"
    },
    {
      titulo: "Mesas Disponibles",
      valor: mesas.length,
      icono: Utensils,
      descripcion: "Mesas en el restaurante"
    },
    {
      titulo: "Reservas Hoy",
      valor: reservasHoy.length,
      icono: Calendar,
      descripcion: "Reservas para hoy"
    },
    {
      titulo: "Reservas Pendientes",
      valor: reservasPendientes,
      icono: TrendingUp,
      descripcion: "Por confirmar"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-restaurant-dark">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del restaurante</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estadisticas.map((stat, index) => (
          <Card key={index} className="shadow-warm border-restaurant-cream">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.titulo}
              </CardTitle>
              <stat.icono className="h-4 w-4 text-restaurant-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-restaurant-dark">{stat.valor}</div>
              <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reservas Recientes */}
      <Card className="shadow-warm border-restaurant-cream">
        <CardHeader>
          <CardTitle className="text-restaurant-dark">Reservas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {reservasCompletas.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay reservas registradas
            </p>
          ) : (
            <div className="space-y-4">
              {reservasCompletas.slice(0, 5).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 bg-restaurant-cream/30 rounded-lg">
                  <div>
                    <p className="font-medium text-restaurant-dark">{reserva.cliente.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {reserva.mesa.nombre} • {reserva.numeroPersonas} personas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-restaurant-dark">
                      {reserva.fecha} {reserva.hora}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reserva.estado === 'confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : reserva.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Mesas */}
      <Card className="shadow-warm border-restaurant-cream">
        <CardHeader>
          <CardTitle className="text-restaurant-dark">Estado de Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesas.map((mesa) => {
              const reservasHoyMesa = reservasHoy.filter(r => r.mesaId === mesa.id && r.estado !== 'cancelada');
              const estaOcupada = reservasHoyMesa.length > 0;
              
              return (
                <div key={mesa.id} className={`p-4 rounded-lg border-2 ${
                  estaOcupada 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-restaurant-dark">{mesa.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        Capacidad: {mesa.capacidad} personas
                      </p>
                      {mesa.ubicacion && (
                        <p className="text-xs text-muted-foreground">{mesa.ubicacion}</p>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      estaOcupada ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                  </div>
                  {estaOcupada && (
                    <div className="mt-2 text-xs text-red-600">
                      {reservasHoyMesa.length} reserva(s) hoy
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;