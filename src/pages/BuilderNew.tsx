import { Navigation } from "../Navigation";
import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Lightbulb, Loader, AlertCircle, Download, Rocket } from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../api";

// ── Real spacecraft component visuals (SVG-based) ────────────────────────────

const ComponentSVGs: Record<string, JSX.Element> = {
  capsule: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      <ellipse cx="32" cy="20" rx="16" ry="18" fill="#6366f1" />
      <ellipse cx="32" cy="20" rx="16" ry="18" fill="url(#capGrad)" />
      <rect x="20" y="34" width="24" height="12" rx="3" fill="#4f46e5" />
      <ellipse cx="32" cy="22" rx="8" ry="7" fill="#a5b4fc" opacity="0.5" />
      <circle cx="26" cy="20" r="3" fill="#c7d2fe" opacity="0.8" />
      <circle cx="38" cy="20" r="3" fill="#c7d2fe" opacity="0.8" />
      <rect x="27" y="46" width="10" height="5" rx="2" fill="#818cf8" />
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  engine: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      <rect x="22" y="8" width="20" height="28" rx="4" fill="#dc2626" />
      <rect x="22" y="8" width="20" height="28" rx="4" fill="url(#engGrad)" />
      <polygon points="22,36 42,36 46,54 18,54" fill="#b91c1c" />
      <ellipse cx="32" cy="54" rx="8" ry="4" fill="#fbbf24" opacity="0.8" />
      <ellipse cx="32" cy="52" rx="5" ry="3" fill="#fde68a" />
      <rect x="25" y="12" width="4" height="8" rx="2" fill="#fca5a5" opacity="0.6" />
      <rect x="35" y="12" width="4" height="8" rx="2" fill="#fca5a5" opacity="0.6" />
      <circle cx="32" cy="22" r="4" fill="#ef4444" />
      <defs>
        <linearGradient id="engGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  solar: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      {/* Central hub */}
      <rect x="28" y="24" width="8" height="16" rx="2" fill="#64748b" />
      {/* Left panel */}
      <rect x="4" y="26" width="22" height="12" rx="2" fill="#1d4ed8" />
      <line x1="7" y1="26" x2="7" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="11" y1="26" x2="11" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="15" y1="26" x2="15" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="19" y1="26" x2="19" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="23" y1="26" x2="23" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="4" y1="30" x2="26" y2="30" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="4" y1="34" x2="26" y2="34" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      {/* Right panel */}
      <rect x="38" y="26" width="22" height="12" rx="2" fill="#1d4ed8" />
      <line x1="41" y1="26" x2="41" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="45" y1="26" x2="45" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="49" y1="26" x2="49" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="53" y1="26" x2="53" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="57" y1="26" x2="57" y2="38" stroke="#93c5fd" strokeWidth="1" />
      <line x1="38" y1="30" x2="60" y2="30" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      <line x1="38" y1="34" x2="60" y2="34" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.5" />
      {/* Sun glare */}
      <circle cx="32" cy="10" r="6" fill="#fbbf24" opacity="0.6" />
      <line x1="32" y1="3" x2="32" y2="1" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="38" y1="5" x2="40" y2="3" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="26" y1="5" x2="24" y2="3" stroke="#fbbf24" strokeWidth="1.5" />
    </svg>
  ),
  antenna: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      {/* Dish */}
      <ellipse cx="32" cy="28" rx="20" ry="6" fill="#475569" />
      <path d="M12,28 Q32,8 52,28" fill="#334155" />
      <ellipse cx="32" cy="28" rx="20" ry="6" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Feed */}
      <line x1="32" y1="22" x2="32" y2="14" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="32" cy="13" r="3" fill="#e2e8f0" />
      {/* Mast */}
      <rect x="30" y="34" width="4" height="18" rx="1" fill="#64748b" />
      {/* Base */}
      <rect x="22" y="50" width="20" height="5" rx="2" fill="#475569" />
      {/* Signal waves */}
      <path d="M44,10 Q52,16 44,22" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
      <path d="M48,7 Q58,16 48,25" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  fuel: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      <ellipse cx="32" cy="14" rx="14" ry="6" fill="#0f766e" />
      <rect x="18" y="14" width="28" height="32" fill="#0d9488" />
      <rect x="18" y="14" width="28" height="32" fill="url(#fuelGrad)" />
      <ellipse cx="32" cy="46" rx="14" ry="6" fill="#0f766e" />
      {/* Level indicator */}
      <rect x="22" y="22" width="20" height="16" rx="2" fill="#115e59" />
      <rect x="22" y="32" width="20" height="6" rx="1" fill="#2dd4bf" opacity="0.8" />
      {/* Valve */}
      <rect x="29" y="50" width="6" height="8" rx="1" fill="#134e4a" />
      <rect x="26" y="56" width="12" height="3" rx="1" fill="#0f766e" />
      {/* Pressure lines */}
      <line x1="18" y1="24" x2="14" y2="24" stroke="#5eead4" strokeWidth="1.5" />
      <circle cx="13" cy="24" r="2" fill="#99f6e4" />
      <defs>
        <linearGradient id="fuelGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      {/* Main cylinder */}
      <ellipse cx="32" cy="16" rx="18" ry="6" fill="#7c3aed" />
      <rect x="14" y="16" width="36" height="28" fill="#6d28d9" />
      <ellipse cx="32" cy="44" rx="18" ry="6" fill="#5b21b6" />
      {/* Windows */}
      <circle cx="22" cy="26" r="5" fill="#c4b5fd" opacity="0.8" />
      <circle cx="22" cy="26" r="3" fill="#7c3aed" />
      <circle cx="42" cy="26" r="5" fill="#c4b5fd" opacity="0.8" />
      <circle cx="42" cy="26" r="3" fill="#7c3aed" />
      {/* Center window */}
      <rect x="27" y="30" width="10" height="8" rx="2" fill="#a78bfa" opacity="0.7" />
      {/* Docking ports */}
      <rect x="10" y="27" width="6" height="10" rx="2" fill="#5b21b6" />
      <rect x="48" y="27" width="6" height="10" rx="2" fill="#5b21b6" />
      {/* Equipment */}
      <rect x="20" y="36" width="24" height="3" rx="1" fill="#8b5cf6" />
    </svg>
  ),
  habitat: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      {/* Main module */}
      <ellipse cx="32" cy="14" rx="20" ry="7" fill="#b45309" />
      <rect x="12" y="14" width="40" height="30" fill="#d97706" />
      <ellipse cx="32" cy="44" rx="20" ry="7" fill="#92400e" />
      {/* Windows row */}
      <circle cx="20" cy="26" r="4" fill="#fef3c7" opacity="0.9" />
      <circle cx="32" cy="26" r="4" fill="#fef3c7" opacity="0.9" />
      <circle cx="44" cy="26" r="4" fill="#fef3c7" opacity="0.9" />
      {/* Inner window glow */}
      <circle cx="20" cy="26" r="2.5" fill="#fbbf24" opacity="0.6" />
      <circle cx="32" cy="26" r="2.5" fill="#fbbf24" opacity="0.6" />
      <circle cx="44" cy="26" r="2.5" fill="#fbbf24" opacity="0.6" />
      {/* Hatch */}
      <rect x="27" y="36" width="10" height="12" rx="3" fill="#92400e" />
      <circle cx="32" cy="42" r="2" fill="#d97706" />
      {/* Stripes */}
      <rect x="12" y="18" width="40" height="3" fill="#fbbf24" opacity="0.3" />
    </svg>
  ),
  wing: (
    <svg viewBox="0 0 64 64" className="w-12 h-12">
      {/* Central body */}
      <rect x="28" y="20" width="8" height="24" rx="3" fill="#64748b" />
      {/* Left wing */}
      <polygon points="28,24 4,32 4,40 28,36" fill="#475569" />
      <polygon points="28,24 4,32 4,40 28,36" fill="url(#wingGrad)" />
      <line x1="28" y1="28" x2="6" y2="35" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="32" x2="5" y2="38" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" />
      {/* Right wing */}
      <polygon points="36,24 60,32 60,40 36,36" fill="#475569" />
      <polygon points="36,24 60,32 60,40 36,36" fill="url(#wingGrad2)" />
      <line x1="36" y1="28" x2="58" y2="35" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" />
      <line x1="36" y1="32" x2="59" y2="38" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" />
      {/* Control surfaces */}
      <polygon points="4,36 4,40 12,40 12,37" fill="#334155" />
      <polygon points="60,36 60,40 52,40 52,37" fill="#334155" />
      <defs>
        <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wingGrad2" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

const COMPONENTS = [
  { id: "capsule",  name: "Command Module",   color: "#6366f1", description: "Main crew capsule & control center" },
  { id: "engine",   name: "Rocket Engine",    color: "#dc2626", description: "Primary propulsion system" },
  { id: "solar",    name: "Solar Panels",     color: "#1d4ed8", description: "Solar power generation array" },
  { id: "antenna",  name: "Comms Antenna",   color: "#0ea5e9", description: "Deep-space communication dish" },
  { id: "fuel",     name: "Fuel Tank",        color: "#0d9488", description: "Propellant storage vessel" },
  { id: "lab",      name: "Science Lab",      color: "#7c3aed", description: "Pressurised research module" },
  { id: "habitat",  name: "Crew Habitat",     color: "#d97706", description: "Living quarters for astronauts" },
  { id: "wing",     name: "Stabilizer",       color: "#475569", description: "Aerodynamic control surfaces" },
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
    loadSavedBuilds();
  }, []);

  const loadSavedBuilds = async () => {
    try {
      setLoading(true);
      const builds = await api.getSpacecrafts();
      setSavedBuilds(Array.isArray(builds) ? builds : []);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComponent = (type: string) => {
    const component: BuildComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: Math.random() * 55 + 20,
      y: Math.random() * 55 + 15,
    };
    setBuildArea([...buildArea, component]);
  };

  const removeComponent = (id: string) => {
    setBuildArea(buildArea.filter(c => c.id !== id));
    if (selectedComponent === id) setSelectedComponent(null);
  };

  const saveProject = async () => {
    if (!projectName.trim()) { setError("Give your spacecraft a name"); return; }
    if (buildArea.length === 0) { setError("Add at least one component"); return; }

    try {
      setSaving(true);
      setError("");
      await api.saveSpacecraft({ name: projectName, components: buildArea.map(c => c.type) });
      await loadSavedBuilds();
      setBuildArea([]);
      setProjectName("My Spacecraft");
      setSelectedComponent(null);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteSpacecraft = async (id: number) => {
    if (!confirm("Delete this spacecraft?")) return;
    try {
      await api.deleteSpacecraft(id);
      await loadSavedBuilds();
    } catch { alert("Delete failed"); }
  };

  const loadSpacecraft = (spacecraft: SavedSpacecraft) => {
    const newBuildArea: BuildComponent[] = spacecraft.components.map((type, idx) => ({
      id: `${type}-${idx}`,
      type,
      x: (idx % 4) * 22 + 10,
      y: Math.floor(idx / 4) * 30 + 10,
    }));
    setBuildArea(newBuildArea);
    setProjectName(spacecraft.name);
    setSelectedComponent(null);
  };

  const checkHint = async () => {
    if (buildArea.length === 0) { setHintResult("Build a spacecraft first!"); return; }
    try {
      setCheckingHint(true);
      setHintResult("Analyzing your spacecraft...");
      const res = await api.sendMessage(
        `Analyze this spacecraft design with these components: ${buildArea.map(c => c.type).join(", ")}.
         Is it a valid design? What's missing? Give brief, practical aerospace engineering feedback in 2-3 sentences.`
      );
      setHintResult(res?.reply || getFallbackHint());
    } catch {
      setHintResult(getFallbackHint());
    } finally {
      setCheckingHint(false);
    }
  };

  const getFallbackHint = () => {
    const types = buildArea.map(c => c.type);
    const hasEngine  = types.includes("engine");
    const hasPower   = types.includes("solar") || types.includes("fuel");
    const hasControl = types.includes("capsule");
    const hasComm    = types.includes("antenna");
    const missing: string[] = [];
    if (!hasEngine)  missing.push("Rocket Engine");
    if (!hasPower)   missing.push("Solar Panels or Fuel Tank");
    if (!hasControl) missing.push("Command Module");
    if (!hasComm)    missing.push("Comms Antenna");
    return missing.length === 0
      ? "Your spacecraft has all essential systems! Well-designed mission architecture."
      : `Missing critical systems: ${missing.join(", ")}.`;
  };

  const getComponentData = (type: string) =>
    COMPONENTS.find(c => c.id === type) || COMPONENTS[0];

  const selectedComp = buildArea.find(c => c.id === selectedComponent);

  return (
    <div className="min-h-screen bg-[#0a0518]" style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <Navigation />

      <div className="pt-24 px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 bg-clip-text text-transparent">
                Space Builder
              </h1>
              <p className="text-purple-200/60 text-base">Assemble a spacecraft from real components</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10" onClick={() => { setBuildArea([]); setSelectedComponent(null); setProjectName("My Spacecraft"); }}>
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
              <Button onClick={saveProject} disabled={saving} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Component Library */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4">Components</h3>
                <div className="space-y-2">
                  {COMPONENTS.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => addComponent(comp.id)}
                      className="w-full text-left p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 hover:bg-purple-500/25 hover:border-purple-400/50 transition-all group flex items-center gap-3"
                    >
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-black/30 rounded-lg">
                        {ComponentSVGs[comp.id]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-purple-100 truncate">{comp.name}</p>
                        <p className="text-xs text-purple-400/70 truncate leading-tight">{comp.description}</p>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Build Area */}
            <div className="lg:col-span-3 space-y-5">
              {/* Project Name */}
              <div className="bg-purple-900/30 border border-purple-400/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-purple-400 text-sm font-semibold flex-shrink-0">Name:</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-purple-300/40 focus:outline-none text-sm"
                  placeholder="e.g. Explorer-X"
                />
              </div>

              {/* Canvas */}
              <div className="relative bg-[#050212] rounded-2xl border-2 border-purple-400/20 overflow-hidden" style={{ minHeight: "420px" }}>
                {/* Grid background */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9333ea" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
                    style={{ left: `${(i * 17 + 3) % 100}%`, top: `${(i * 13 + 7) % 100}%` }} />
                ))}

                {buildArea.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center opacity-40">
                      <Rocket className="w-8 h-8 text-purple-300" />
                    </div>
                    <p className="text-purple-300/50 text-sm">Click a component on the left to add it here</p>
                    <p className="text-purple-400/30 text-xs mt-1">Drag to reposition components</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full" style={{ minHeight: "420px" }}>
                    {buildArea.map((comp) => {
                      const data = getComponentData(comp.type);
                      const isSelected = selectedComponent === comp.id;
                      return (
                        <div
                          key={comp.id}
                          onClick={() => setSelectedComponent(comp.id)}
                          draggable
                          onDragEnd={(e) => {
                            const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                            if (rect) {
                              const x = Math.max(5, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
                              const y = Math.max(5, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
                              setBuildArea(buildArea.map(c => c.id === comp.id ? { ...c, x, y } : c));
                            }
                          }}
                          className={`absolute flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none transition-all duration-150 group`}
                          style={{
                            left: `${comp.x}%`,
                            top: `${comp.y}%`,
                            transform: "translate(-50%, -50%)",
                            width: "80px",
                          }}
                        >
                          {/* Component visual */}
                          <div className={`rounded-xl p-2 border transition-all ${
                            isSelected
                              ? "bg-yellow-500/20 border-yellow-400/70 shadow-lg shadow-yellow-500/30 scale-115"
                              : "bg-white/5 border-purple-400/20 hover:border-purple-400/50 hover:bg-white/10"
                          }`} style={{ transform: isSelected ? "scale(1.15)" : "scale(1)" }}>
                            {ComponentSVGs[comp.type] || ComponentSVGs["capsule"]}
                          </div>
                          <span className={`text-center mt-1 text-xs font-medium leading-tight max-w-20 ${
                            isSelected ? "text-yellow-200" : "text-purple-200/70"
                          }`}>
                            {data.name}
                          </span>
                          {/* Delete button on hover/select */}
                          {isSelected && (
                            <button
                              onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md"
                            >
                              <Trash2 className="w-2.5 h-2.5 text-white" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Component count + AI hint */}
              <div className="flex items-center gap-3">
                <div className="flex-1 text-sm text-purple-300/60">
                  {buildArea.length} component{buildArea.length !== 1 ? "s" : ""} placed
                  {selectedComp && ` · ${getComponentData(selectedComp.type).name} selected`}
                </div>
                <Button
                  onClick={checkHint}
                  disabled={checkingHint}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm"
                >
                  <Lightbulb className="w-4 h-4 mr-1.5" />
                  {checkingHint ? "Analyzing..." : "AI Design Review"}
                </Button>
              </div>

              {hintResult && (
                <div className="bg-amber-900/30 border border-amber-400/30 rounded-xl p-4">
                  <p className="text-amber-100 text-sm leading-relaxed">{hintResult}</p>
                </div>
              )}

              {/* Saved Builds */}
              <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 border border-green-400/20 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-green-200 mb-4 flex items-center gap-2">
                  <Save className="w-4 h-4" /> Saved Spacecraft
                </h3>
                {loading ? (
                  <Loader className="w-5 h-5 text-green-400 animate-spin" />
                ) : savedBuilds.length === 0 ? (
                  <p className="text-green-300/50 text-sm">No saved spacecraft yet. Build and save one above!</p>
                ) : (
                  <div className="space-y-2">
                    {savedBuilds.map((build) => (
                      <div key={build.id} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/15 rounded-xl hover:bg-green-500/20 transition-all">
                        {/* Component preview icons */}
                        <div className="flex gap-1 flex-shrink-0">
                          {build.components.slice(0, 3).map((type, i) => (
                            <div key={i} className="w-7 h-7 bg-black/30 rounded-md flex items-center justify-center" style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
                              {ComponentSVGs[type] || ComponentSVGs["capsule"]}
                            </div>
                          ))}
                          {build.components.length > 3 && (
                            <div className="w-7 h-7 bg-green-800/50 rounded-md flex items-center justify-center">
                              <span className="text-xs text-green-300">+{build.components.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-green-100 text-sm truncate">{build.name}</p>
                          <p className="text-xs text-green-300/50">{build.components.length} components · {new Date(build.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button onClick={() => loadSpacecraft(build)} size="sm" className="bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 h-7">
                            <Download className="w-3 h-3 mr-1" /> Load
                          </Button>
                          <button onClick={() => deleteSpacecraft(build.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
