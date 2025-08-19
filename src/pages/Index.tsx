import { Link } from "react-router-dom";
import { ChefHat, Calendar, Users, Utensils, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-foreground">
              <ChefHat className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">La Cantina</h1>
                <p className="text-primary-foreground/80">Sabores auténticos, experiencias inolvidables</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button asChild variant="secondary">
                <Link to="/reservar">Hacer Reserva</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                <Link to="/admin">Panel Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-restaurant-dark mb-6">
            Bienvenido a una experiencia gastronómica única
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Disfruta de los mejores sabores en un ambiente acogedor. 
            Reserva tu mesa y déjanos crear momentos especiales para ti.
          </p>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elegant">
            <Link to="/reservar">
              <Calendar className="mr-2 h-5 w-5" />
              Reservar Mesa
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-restaurant-dark mb-12">
            ¿Por qué elegirnos?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-warm border-restaurant-cream">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-restaurant-dark">Cocina Excepcional</h4>
                <p className="text-muted-foreground">
                  Ingredientes frescos y técnicas culinarias de vanguardia para crear platos únicos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-warm border-restaurant-cream">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-restaurant-dark">Servicio Personalizado</h4>
                <p className="text-muted-foreground">
                  Nuestro equipo se dedica a hacer de tu visita una experiencia memorable.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-warm border-restaurant-cream">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-restaurant-dark">Ambiente Acogedor</h4>
                <p className="text-muted-foreground">
                  Un espacio diseñado para disfrutar de momentos especiales con tus seres queridos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-6">
            ¿Listo para vivir una experiencia única?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Reserva tu mesa ahora y déjanos consentirte
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-elegant">
            <Link to="/reservar">
              Hacer mi Reserva
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-restaurant-dark text-restaurant-cream py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-6 w-6" />
            <span className="text-lg font-semibold">La Cantina</span>
          </div>
          <p className="text-restaurant-cream/80">
            © 2024 La Cantina. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;