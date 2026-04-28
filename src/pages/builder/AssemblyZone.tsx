import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Zap, Download } from "lucide-react";

export function AssemblyZone() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Zone d'Assemblage</h2>
          <p className="text-purple-200/70">Espace de travail pour construire le vaisseau spatial</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8 h-96">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Zap className="w-16 h-16 text-purple-500/50 mb-4" />
          <p className="text-purple-200/70 mb-6">Faites glisser les composants ici pour assembler votre satellite</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" />
            Importer depuis la bibliothèque
          </Button>
        </div>
      </Card>

      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold">
        Générer Modèle 3D
      </Button>
    </div>
  );
}
