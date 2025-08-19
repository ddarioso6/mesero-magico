import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { ChefHat } from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card shadow-elegant border-r border-restaurant-cream">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <ChefHat className="h-8 w-8 text-restaurant-gold" />
              <div>
                <h1 className="text-xl font-bold text-restaurant-dark">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">La Cantina</p>
              </div>
            </div>
            <Navigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;