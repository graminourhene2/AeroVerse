import { Navigation } from "../Navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, LogOut, BookOpen, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../api";

export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spacecrafts, setSpacecrafts] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        // Charger progression et vaisseaux
        try {
          const userProgress = await api.getProgress?.();
          if (Array.isArray(userProgress)) {
            setProgress(userProgress);
          } else if (userProgress?.progress && Array.isArray(userProgress.progress)) {
            setProgress(userProgress.progress);
          }
        } catch (err) {
          console.log("Progress not available:", err);
          setProgress([]);
        }
        
        try {
          const userSpacecrafts = await api.getSpacecrafts?.();
          if (Array.isArray(userSpacecrafts)) {
            setSpacecrafts(userSpacecrafts);
          } else if (userSpacecrafts?.spacecrafts && Array.isArray(userSpacecrafts.spacecrafts)) {
            setSpacecrafts(userSpacecrafts.spacecrafts);
          }
        } catch (err) {
          console.log("Spacecrafts not available:", err);
          setSpacecrafts([]);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/authentication";
  };

  const isUserAuthenticated = !!localStorage.getItem("token");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0518]">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">⏳ Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show encouragement message if not authenticated
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
        <Navigation />
        <div className="pt-20 px-6 pb-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-4xl font-bold text-white mb-4">Ready to Explore AeroVerse?</h1>
              <p className="text-xl text-purple-200/70 mb-3">
                "The future of aerospace education starts with knowledge and curiosity."
              </p>
              <p className="text-lg text-purple-200/60 mb-8">
                Sign in to access your personalized learning dashboard, save your progress, and build amazing spacecraft.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => window.location.href = "/authentication"}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Sign In Now
              </Button>
              <Button
                onClick={() => window.location.href = "/authentication?mode=signup"}
                variant="outline"
                className="border-purple-400/50 text-purple-200 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completionRate = Array.isArray(progress) && progress.length > 0
    ? Math.round((progress.filter((p: any) => p.completed).length / progress.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-x-hidden">
      <Navigation />
      <div className="pt-20 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user?.username || "Utilisateur"}</h1>
                  <p className="text-purple-300">{user?.email}</p>
                  <p className="text-purple-200/70 capitalize text-sm inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 mt-2">
                    {user?.role || "Student"}
                  </p>
                </div>
              </div>
              <div className="text-right bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <div className="text-4xl font-bold text-purple-400">{completionRate}%</div>
                <p className="text-purple-200/70 text-sm">Progression</p>
              </div>
            </div>

            {/* Action Buttons - CLICKABLES */}
            <div className="flex gap-4">
              <Button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-purple-200/70 text-sm">Leçons Complétées</p>
                  <p className="text-2xl font-bold text-white">
                    {progress?.filter(p => p.completed).length || 0} / {progress?.length || 0}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-6">
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-purple-200/70 text-sm">Vaisseaux Construits</p>
                  <p className="text-2xl font-bold text-white">{spacecrafts?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Learning History */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              📚 Historique d'apprentissage
            </h2>
            
            {progress?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-purple-200/70">📭 Aucune progression enregistrée</p>
                <Button
                  onClick={() => window.location.href = "/education"}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Commencer l'éducation →
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {progress?.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/20 transition-all hover:border-purple-500/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">Leçon #{p.lesson_id}</h3>
                        <p className="text-purple-200/70 text-sm">Module {p.module_id} • Score: {p.score || 0}%</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded ${
                        p.completed 
                          ? "bg-green-900/30 text-green-300 border border-green-500/30"
                          : "bg-yellow-900/30 text-yellow-300 border border-yellow-500/30"
                      }`}>
                        {p.completed ? "✅ Complété" : "⏳ En cours"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Saved Projects */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🚀 Vaisseaux Sauvegardés
            </h2>
            
            {spacecrafts?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-purple-200/70">🛸 Aucun vaisseau enregistré</p>
                <Button
                  onClick={() => window.location.href = "/builder"}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  Créer un vaisseau →
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {spacecrafts?.map((craft: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-900/20 transition-all cursor-pointer"
                    onClick={() => window.location.href = "/builder"}
                  >
                    <h3 className="text-white font-semibold">{craft.name || "Sans nom"}</h3>
                    <p className="text-purple-200/70 text-sm">{craft.description || "Aucune description"}</p>
                    <p className="text-xs text-purple-300 mt-2">⚙️ {Object.keys(craft.components || {}).length} composants</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
