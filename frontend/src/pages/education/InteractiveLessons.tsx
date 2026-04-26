import { Card } from "../../components/ui/card";
import { BookMarked, Volume2 } from "lucide-react";

export function InteractiveLessons() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Leçons Interactives</h2>
        <p className="text-purple-200/70">Contenu éducatif avec animations et explications</p>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8">
        <div className="flex items-start gap-4">
          <BookMarked className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-4">Leçon: Introduction aux Orbites</h3>
            <div className="space-y-3">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <p className="text-purple-200/80 mb-2">Une orbite est la trajectoire courbe d'un objet autour d'un point de masse...</p>
                <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mt-2">
                  <Volume2 className="w-4 h-4" />
                  Lire la leçon à haute voix
                </button>
              </div>
              <div className="aspect-video bg-purple-900/30 rounded-lg border-2 border-purple-500/20 flex items-center justify-center text-purple-400">
                Animation 3D Interactif
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
