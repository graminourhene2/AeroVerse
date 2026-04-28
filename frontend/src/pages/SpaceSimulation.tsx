import { Navigation } from "../Navigation";
import { useState, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Info, Maximize2, Camera, X, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { UnityViewer } from "../components/UnityViewer";
import html2canvas from "html2canvas";

const destinations = [
  {
    id: "earth",
    name: "Earth Orbit",
    description: "Experience our beautiful planet from the International Space Station",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGZyb20lMjBzcGFjZXxlbnwxfHx8fDE3Njk5ODM4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    facts: ["Orbital altitude: ~408 km", "Orbital speed: 7.66 km/s", "One orbit: ~90 minutes"],
  },
  {
    id: "mars",
    name: "Mars Surface",
    description: "Walk on the red planet and explore Martian landscapes",
    image: "https://images.unsplash.com/photo-1710676145418-51accf3af505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwc3VyZmFjZXxlbnwxfHx8fDE3NzAwMjE5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    facts: ["Distance from Earth: 225 million km", "Day length: 24h 37min", "Temperature: -63°C average"],
  },
  {
    id: "spacewalk",
    name: "EVA Mission",
    description: "Float in the void during an Extra-Vehicular Activity",
    image: "https://images.unsplash.com/photo-1614727187346-ec3a009092b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3Ryb25hdXQlMjBzcGFjZXdhbGt8ZW58MXx8fHwxNzcwMDIxOTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    facts: ["Spacesuit weight: ~130 kg", "EVA duration: 5-8 hours", "Vacuum of space: 0 pressure"],
  },
];

interface CVResult {
  name: string;
  category: string;
  confidence: number;
  description: string;
  specs: Record<string, string>;
  funFacts: string[];
}

export function SpaceSimulation() {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isLaunched, setIsLaunched] = useState(false);
  const [cvMode, setCvMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [popup, setPopup] = useState<CVResult | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleLaunch = useCallback(() => {
    setIsLaunched(true);
    setIsPlaying(true);
  }, []);

  const handleViewerClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cvMode || isAnalyzing || !viewerRef.current) return;

    const rect = viewerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsAnalyzing(true);
    setPopup(null);

    try {
      const canvas = await html2canvas(viewerRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
      });

      const cropSize = 300;
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropSize;
      cropCanvas.height = cropSize;
      const ctx = cropCanvas.getContext("2d")!;
      ctx.drawImage(
        canvas,
        Math.max(0, x - cropSize / 2),
        Math.max(0, y - cropSize / 2),
        cropSize,
        cropSize,
        0, 0, cropSize, cropSize
      );

      const blob = await new Promise<Blob>((res) => cropCanvas.toBlob((b) => res(b!), "image/jpeg", 0.8));
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      const response = await fetch("http://localhost:5000/api/cv/identify-component", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPopup(data);
        setPopupPos({ x: e.clientX, y: e.clientY });
      } else {
        // Fallback mock result
        setPopup({
          name: "Space Object",
          category: "Unknown",
          confidence: 0.5,
          description: "CV backend not available. Start Flask server at port 5000.",
          specs: {},
          funFacts: ["Run: python aeroverse_app.py"],
        });
        setPopupPos({ x: e.clientX, y: e.clientY });
      }
    } catch {
      setPopup({
        name: "CV Error",
        category: "Error",
        confidence: 0,
        description: "Could not connect to CV backend. Make sure Flask is running on port 5000.",
        specs: {},
        funFacts: ["cd D:\\PCD\\AeroVerse\\computer-vision\\backend", "python aeroverse_app.py"],
      });
      setPopupPos({ x: e.clientX, y: e.clientY });
    } finally {
      setIsAnalyzing(false);
    }
  }, [cvMode, isAnalyzing]);

  const addToBuilder = useCallback(() => {
    if (!popup) return;
    const existing = JSON.parse(sessionStorage.getItem("pendingBuilderComponents") || "[]");
    existing.push({ name: popup.name, category: popup.category, specs: popup.specs });
    sessionStorage.setItem("pendingBuilderComponents", JSON.stringify(existing));
    setPopup(null);
    alert(`"${popup.name}" added to Mission Builder!`);
  }, [popup]);

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />

      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Space Simulation
            </h1>
            <p className="text-purple-200/70">
              {cvMode
                ? "🔬 CV Mode active · Click any object to identify it with AI"
                : "Explore the cosmos in real-time 3D environments"}
            </p>
          </div>

          {/* Main Viewer */}
          <div
            ref={viewerRef}
            className="relative aspect-video rounded-2xl overflow-hidden border-2 border-purple-400/30 shadow-2xl shadow-purple-500/20 mb-6"
            style={{ cursor: cvMode ? "crosshair" : "default" }}
            onClick={handleViewerClick}
          >
            {/* Before Launch */}
            {!isLaunched && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url('${selectedDestination.image}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
                </div>
                {showInfo && (
                  <div className="absolute top-6 left-6 right-6 md:right-auto md:max-w-sm bg-black/60 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30">
                    <h3 className="text-2xl font-bold text-purple-100 mb-2">{selectedDestination.name}</h3>
                    <p className="text-purple-200/80 text-sm mb-4">{selectedDestination.description}</p>
                    <div className="space-y-2">
                      {selectedDestination.facts.map((fact, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5" />
                          <span className="text-cyan-100/90 text-sm">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* After Launch: Unity */}
            {isLaunched && (
              <UnityViewer
                loaderUrl="/unity-build/Build/unity-build.loader.js"
                dataUrl="/unity-build/Build/unity-build.data.br"
                frameworkUrl="/unity-build/Build/unity-build.framework.js.br"
                codeUrl="/unity-build/Build/unity-build.wasm.br"
                className="w-full h-full"
              />
            )}

            {/* CV Mode scanning overlay */}
            {cvMode && isLaunched && (
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(6,182,212,0.08) 100%)" }}>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-full px-4 py-2">
                  <span className="text-cyan-300 text-sm font-medium">
                    {isAnalyzing ? "🔍 Analyzing..." : "🎯 Click any object to identify"}
                  </span>
                </div>
              </div>
            )}

            {/* Controls bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl rounded-full px-6 py-3 border border-purple-400/30 z-20">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLaunched) handleLaunch();
                  else setIsPlaying(!isPlaying);
                }}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={(e) => e.stopPropagation()}>
                <RotateCcw className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-purple-400/30" />
              <Button size="icon" variant="ghost" className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}>
                <Info className="w-5 h-5" />
              </Button>
              {/* CV Camera button */}
              <Button
                size="sm"
                variant="ghost"
                className={`rounded-full flex items-center gap-2 px-4 ${cvMode ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50" : "text-purple-100 hover:bg-purple-500/20"}`}
                onClick={(e) => { e.stopPropagation(); setCvMode(!cvMode); setPopup(null); }}
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm">CV Camera</span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={(e) => e.stopPropagation()}>
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>

            {/* LIVE indicator */}
            {isPlaying && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-4 py-2 z-20">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-100 text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>

          {/* CV Result Popup */}
          {popup && (
            <div className="fixed z-50 bg-[#0d0b1e] border border-cyan-400/40 rounded-2xl shadow-2xl shadow-cyan-500/20 p-5 w-80"
              style={{ left: Math.min(popupPos.x, window.innerWidth - 340), top: Math.min(popupPos.y, window.innerHeight - 400) }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-cyan-300">{popup.name}</h3>
                  <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">{popup.category}</span>
                </div>
                <button onClick={() => setPopup(null)} className="text-purple-400 hover:text-purple-200 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-purple-200/80 text-sm mb-3">{popup.description}</p>
              {Object.keys(popup.specs || {}).length > 0 && (
                <div className="mb-3 space-y-1">
                  {Object.entries(popup.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-purple-300">{k}</span>
                      <span className="text-cyan-200">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {popup.funFacts?.length > 0 && (
                <div className="mb-3">
                  {popup.funFacts.slice(0, 2).map((f, i) => (
                    <p key={i} className="text-xs text-purple-200/60">• {f}</p>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addToBuilder}
                  className="flex-1 flex items-center justify-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded-lg py-2 text-cyan-300 text-sm transition"
                >
                  <Plus className="w-4 h-4" /> Add to Builder
                </button>
                <button
                  onClick={() => setPopup(null)}
                  className="px-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 text-sm transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Destination Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className={`relative overflow-hidden rounded-xl border-2 transition-all group ${
                  selectedDestination.id === dest.id
                    ? "border-cyan-400/60 shadow-lg shadow-cyan-500/20"
                    : "border-purple-400/20 hover:border-purple-400/40"
                }`}
              >
                <div className="aspect-video relative">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-lg font-semibold text-white mb-1">{dest.name}</h4>
                    <p className="text-white/70 text-sm line-clamp-1">{dest.description}</p>
                  </div>
                </div>
                {selectedDestination.id === dest.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50" />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
