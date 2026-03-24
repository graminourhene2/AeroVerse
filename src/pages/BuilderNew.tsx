import { Navigation } from "../Navigation";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Lightbulb, Loader, AlertCircle, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../api";

const COMPONENTS = [
  { id: "capsule", name: "Command Module", image: "🛸", description: "Main control center of the spacecraft" },
  { id: "engine", name: "Rocket Engine", image: "🚀", description: "Primary propulsion system" },
  { id: "solar", name: "Solar Panel", image: "☀️", description: "Solar power generation" },
  { id: "antenna", name: "Communication", image: "📡", description: "Communication system" },
  { id: "fuel", name: "Fuel Tank", image: "⛽", description: "Fuel storage capacity" },
  { id: "lab", name: "Science Lab", image: "🔬", description: "Scientific research module" },
  { id: "habitat", name: "Living Module", image: "🏠", description: "Crew living quarters" },
  { id: "wing", name: "Stabilizer", image: "✈️", description: "Stabilization system" },
];

interface BuildComponent {
  id: string;
  type: string;
  x: number;
  y: number;
}

interface SavedSpacecraft {
  id: number;
  name: string;
  components: string[];
  created_at: string;
}

export function BuilderNew() {
  const [buildArea, setBuildArea] = useState<BuildComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("My Spacecraft");
  const [savedBuilds, setSavedBuilds] = useState<SavedSpacecraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hintResult, setHintResult] = useState<string>("");
  const [checkingHint, setCheckingHint] = useState(false);

  useEffect(() => {
    if (api.isAuthenticated()) {
      loadSavedBuilds();
    }
  }, []);

  const loadSavedBuilds = async () => {
    try {
      setLoading(true);
      const builds = await api.getSpacecrafts();
      setSavedBuilds(builds);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Impossible de charger les vaisseaux sauvegardés");
    } finally {
      setLoading(false);
    }
  };

  const addComponent = (type: string) => {
    const component: BuildComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
    };
    setBuildArea([...buildArea, component]);
  };

  const removeComponent = (id: string) => {
    setBuildArea(buildArea.filter(c => c.id !== id));
    if (selectedComponent === id) setSelectedComponent(null);
  };

  const saveProject = async () => {
    if (!projectName.trim()) {
      setError("Please give your spacecraft a name");
      return;
    }

    if (buildArea.length === 0) {
      setError("Add at least one component");
      return;
    }

    if (!api.isAuthenticated()) {
      setError("Please sign in to save");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const componentTypes = buildArea.map(c => c.type);
      await api.saveSpacecraft({
        name: projectName,
        components: componentTypes
      });

      // Recharger les constructions
      await loadSavedBuilds();
      setError(""); // Pas de message "localhost save"
      
      // Réinitialiser
      setBuildArea([]);
      setProjectName("My Spacecraft");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const deleteSpacecraft = async (id: number) => {
    if (!confirm("Êtes-vous sûr?")) return;

    try {
      await api.deleteSpacecraft(id);
      await loadSavedBuilds();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const loadSpacecraft = async (spacecraft: SavedSpacecraft) => {
    // Charger un vaisseau sauvegardé dans le builder
    const newBuildArea: BuildComponent[] = spacecraft.components.map((type, idx) => ({
      id: `${type}-${idx}`,
      type,
      x: (idx % 4) * 25,
      y: Math.floor(idx / 4) * 30,
    }));
    setBuildArea(newBuildArea);
    setProjectName(spacecraft.name);
  };

  const checkHint = async () => {
    if (buildArea.length === 0) {
      setHintResult("❌ Build a spacecraft first!");
      return;
    }

    try {
      setCheckingHint(true);
      setHintResult("🔍 Analyzing your spacecraft...");

      // Call API to verify construction
      const result = await api.analyzeImage?.({
        components: buildArea.map(c => c.type),
        projectName
      });

      if (result?.message) {
        setHintResult(result.message);
      } else {
        // Simplified feedback
        const hasEngine = buildArea.some(c => c.type === "engine");
        const hasPower = buildArea.some(c => c.type.includes("solar") || c.type === "fuel");
        const hasComm = buildArea.some(c => c.type.includes("antenna"));
        
        if (hasEngine && hasPower && hasComm) {
          setHintResult("✅ Excellent! Your spacecraft has all essential systems!");
        } else {
          let missing = [];
          if (!hasEngine) missing.push("engine");
          if (!hasPower) missing.push("power source");
          if (!hasComm) missing.push("communication system");
          setHintResult(`⚠️ Missing: ${missing.join(", ")}`);
        }
      }
    } catch (err) {
      setHintResult("❌ Error checking spacecraft");
    } finally {
      setCheckingHint(false);
    }
  };

  const clearAll = () => {
    setBuildArea([]);
    setSelectedComponent(null);
    setProjectName("My Spacecraft");
  };

  const getComponentData = (type: string) => {
    return COMPONENTS.find(c => c.id === type) || COMPONENTS[0];
  };

  return (
    <div className="min-h-screen bg-[#0a0518]" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <Navigation />
      
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 bg-clip-text text-transparent" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                🛸 Space Builder
              </h1>
              <p className="text-purple-200/70 text-lg" style={{ fontWeight: 500 }}>
                Design your own spacecraft and save it to your profile
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                onClick={clearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button 
                onClick={saveProject}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Component Library */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-purple-100 mb-4" style={{ fontWeight: 600 }}>📦 Components</h3>
                <div className="space-y-3">
                  {COMPONENTS.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => addComponent(comp.id)}
                      className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 hover:bg-purple-500/20 hover:border-purple-400/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{comp.image}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-purple-100 truncate">
                            {comp.name}
                          </p>
                          <p className="text-xs text-purple-400 truncate">{comp.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Build Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Project Name */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6">
                <label className="block text-purple-100 text-sm font-semibold mb-2">📝 Nom du Vaisseau</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-purple-900/30 border border-purple-400/30 rounded-lg px-4 py-2 text-white placeholder:text-purple-300/50 focus:outline-none focus:border-purple-400/60"
                  placeholder="Ex: Explorer-X"
                />
              </div>

              {/* Build Canvas */}
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border-2 border-purple-400/30 p-6 min-h-96 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle, #9333ea 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                  }} />
                </div>

                {buildArea.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl mb-3">🛸</p>
                      <p className="text-purple-300/70">Sélectionnez un composant pour commencer</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96">
                    {buildArea.map((comp) => {
                      const data = getComponentData(comp.type);
                      return (
                        <div
                          key={comp.id}
                          onClick={() => setSelectedComponent(comp.id)}
                          className={`absolute w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-move transition-all backdrop-blur-sm ${
                            selectedComponent === comp.id
                              ? "ring-2 ring-yellow-400 scale-110 bg-yellow-500/30"
                              : "hover:scale-105 bg-purple-500/30 hover:bg-purple-500/50"
                          } shadow-lg border border-purple-300/30 hover:border-purple-300/60`}
                          style={{
                            left: `${comp.x}%`,
                            top: `${comp.y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                          draggable
                          onDragEnd={(e) => {
                            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                            if (rect) {
                              const newX = ((e.clientX - rect.left) / rect.width) * 100;
                              const newY = ((e.clientY - rect.top) / rect.height) * 100;
                              setBuildArea(buildArea.map(c => 
                                c.id === comp.id ? { ...c, x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) } : c
                              ));
                            }
                          }}
                        >
                          <span className="text-3xl">{data.image}</span>
                          <p className="text-xs text-white text-center mt-1 font-semibold line-clamp-1">{data.name}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Hint Button */}
              <div className="flex gap-3">
                <Button
                  onClick={checkHint}
                  disabled={checkingHint}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-1 rounded-xl"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {checkingHint ? "Vérification..." : "💡 Aide (CV)"}
                </Button>
              </div>

              {hintResult && (
                <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 backdrop-blur-xl rounded-2xl border border-amber-400/30 p-6">
                  <p className="text-amber-100 text-sm">{hintResult}</p>
                </div>
              )}

              {/* Component Details */}
              {selectedComponent && (
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 backdrop-blur-xl rounded-2xl border border-blue-400/30 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-4xl mb-2">{getComponentData(buildArea.find(c => c.id === selectedComponent)?.type || "").image}</div>
                      <h3 className="text-lg font-semibold text-blue-100 mb-2">
                        {getComponentData(buildArea.find(c => c.id === selectedComponent)?.type || "").name}
                      </h3>
                      <p className="text-blue-200/70 text-sm">
                        {getComponentData(buildArea.find(c => c.id === selectedComponent)?.type || "").description}
                      </p>
                    </div>
                    <button
                      onClick={() => removeComponent(selectedComponent)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Builds */}
              {api.isAuthenticated() && (
                <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 backdrop-blur-xl rounded-2xl border border-green-400/30 p-6">
                  <h3 className="text-lg font-semibold text-green-100 mb-4">🚀 Projets Sauvegardés</h3>
                  {loading ? (
                    <Loader className="w-6 h-6 text-green-400 animate-spin" />
                  ) : savedBuilds.length === 0 ? (
                    <p className="text-green-300/70">Aucun vaisseau sauvegardé</p>
                  ) : (
                    <div className="space-y-3">
                      {savedBuilds.map((build) => (
                        <div
                          key={build.id}
                          className="flex items-center justify-between p-4 bg-green-500/10 border border-green-400/20 rounded-lg hover:bg-green-500/20 transition-all group cursor-pointer"
                        >
                          <div 
                            className="flex-1"
                            onClick={() => loadSpacecraft(build)}
                          >
                            <p className="font-medium text-green-100 group-hover:text-green-50">📦 {build.name}</p>
                            <p className="text-xs text-green-300/70">{build.components.length} composants • {new Date(build.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => loadSpacecraft(build)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Download className="w-4 h-4" />
                              Charger
                            </Button>
                            <button
                              onClick={() => deleteSpacecraft(build.id)}
                              className="p-2 hover:bg-red-500/20 rounded transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
