import { Navigation } from "../Navigation";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Rocket, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="inline-block">
              <div className="text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                404
              </div>
            </div>
          </div>

          {/* Rocket Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Rocket className="w-24 h-24 text-purple-400 animate-bounce-soft" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Oups! Page Non Trouvée
          </h1>
          <p className="text-purple-200/70 text-lg mb-8">
            Il semble que vous ayez essayé de visiter une page qui n'existe pas ou a été supprimée. 
          </p>

          {/* Suggestions */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-xl p-6 mb-8">
            <p className="text-purple-100 text-sm mb-4">
              Voici ce que vous pouvez faire:
            </p>
            <ul className="text-purple-200/70 text-sm space-y-2 text-left">
              <li>✓ Vérifiez l'URL que vous avez entrée</li>
              <li>✓ Retournez à la page d'accueil</li>
              <li>✓ Contactez le support si le problème persiste</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
            <Link to="/simulation">
              <Button
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Aller au Simulation
              </Button>
            </Link>
          </div>

          {/* Fun Message */}
          <p className="text-purple-300/50 text-xs mt-8">
            Conseil: Le fondateur s'excuse pour cette erreur 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
