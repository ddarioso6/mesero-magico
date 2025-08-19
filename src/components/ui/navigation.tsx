import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, Calendar, Utensils, ChefHat } from "lucide-react";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/clientes", label: "Clientes", icon: Users },
    { path: "/admin/mesas", label: "Mesas", icon: Utensils },
    { path: "/admin/reservas", label: "Reservas", icon: Calendar },
  ];

  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            "hover:bg-secondary/50 hover:shadow-warm",
            isActive(item.path)
              ? "bg-gradient-primary text-primary-foreground shadow-elegant"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function PublicHeader() {
  return (
    <header className="bg-gradient-primary shadow-elegant">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <ChefHat className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Restaurante Delicia</h1>
          </Link>
          <Link 
            to="/reservar" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Hacer Reserva
          </Link>
        </div>
      </div>
    </header>
  );
}