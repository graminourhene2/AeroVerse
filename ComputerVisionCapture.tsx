import { Card } from "../../components/ui/card";
import { Camera, Download } from "lucide-react";

export function ComputerVisionCapture() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Capture Computer Vision</h2>
        <p className="text-purple-200/70">Capture automatique des composants lors de l'assemblage</p>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8 h-80">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Camera className="w-16 h-16 text-purple-500/50 mb-4" />
          <p className="text-purple-200/70 mb-6">Caméra de surveillance active</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            En direct
          </button>
        </div>
      </Card>
    </div>
  );
}
