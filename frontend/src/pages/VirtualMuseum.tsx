import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building2, Telescope, ArrowRight } from "lucide-react";

export function VirtualMuseum() {
  const exhibits = [
    { id: 1, name: "Satellites Spatiaux", description: "Découvrez les satellites en 3D" },
    { id: 2, name: "Vaisseaux Spatiaux", description: "Explore les engins spatiaux interactifs" },
    { id: 3, name: "Télescopes Spatiaux", description: "Observez l'univers avec le Hubble" },
    { id: 4, name: "Stations Spatiales", description: "Visitez les stations orbitales" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-10 h-10 text-purple-500" />
              <h1 className="text-4xl font-bold text-white">Musée Virtuel</h1>
            </div>
            <p className="text-purple-200/70 text-lg">
              Explorez l'univers avec nos modèles 3D interactifs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {exhibits.map((exhibit) => (
              <Card
                key={exhibit.id}
                className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <Telescope className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{exhibit.name}</h3>
                <p className="text-purple-200/70">{exhibit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
