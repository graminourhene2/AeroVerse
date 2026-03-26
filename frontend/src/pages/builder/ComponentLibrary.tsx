import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Package, Plus } from "lucide-react";

export function ComponentLibrary() {
  const components = [
    { id: 1, name: "Moteur Électrique", category: "Moteurs", specs: "12V DC" },
    { id: 2, name: "Panneau Solaire", category: "Énergie", specs: "100W" },
    { id: 3, name: "Module de Communication", category: "Communication", specs: "WiFi/BLE" },
    { id: 4, name: "Batterie Lithium", category: "Énergie", specs: "5000mAh" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Bibliothèque Composants</h2>
          <p className="text-purple-200/70">Liste des composants disponibles (moteurs, panneaux solaires, modules, etc.)</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {components.map((comp) => (
          <Card key={comp.id} className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{comp.name}</h3>
                <p className="text-sm text-purple-300">{comp.category}</p>
                <p className="text-xs text-purple-200/60 mt-1">{comp.specs}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
