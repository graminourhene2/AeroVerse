import { Navigation } from "../Navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Play, Pause, Sparkles, Zap, Eye, Rocket, RotateCcw,
  Camera, X, Loader, Plus, ChevronRight,
  Cpu, BookOpen, Wrench, Star, MousePointer2, Crosshair, Maximize2
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { UnityViewer } from "../components/UnityViewer";
import { useUnityBridge, setUnityCVMode } from "../hooks/useUnityBridge";
import { mapUnityNameToComponentId } from "../utils/unityMapper";
// ── Types ─────────────────────────────────────────────────────────────────────
interface ComponentInfo {
  component_name: string;
  component_id: string;
  category: string;
  emoji: string;
  description: string;
  how_to_use: string;
  technical_specs: string[];
  fun_facts: string[];
  can_add_to_builder: boolean;
  builder_component_id: string | null;
}

interface ClickPopup {
  x: number;
  y: number;
  loading: boolean;
  result: ComponentInfo | null;
  error: string;
  addedToBuilder: boolean;
}

const CV_BACKEND = "http://localhost:5000";
const CROP_RADIUS = 250;

// Unity build paths
const UNITY_LOADER    = "/unity-build/Build/unity-build.loader.js";
const UNITY_DATA      = "/unity-build/Build/unity-build.data.br";
const UNITY_FRAMEWORK = "/unity-build/Build/unity-build.framework.js.br";
const UNITY_CODE      = "/unity-build/Build/unity-build.wasm.br";

// ── Category color map ────────────────────────────────────────────────────────
const catColor: Record<string, string> = {
  "Propulsion":     "text-orange-400 bg-orange-500/10 border-orange-400/30",
  "Navigation":     "text-blue-400   bg-blue-500/10   border-blue-400/30",
  "Power":          "text-yellow-400 bg-yellow-500/10 border-yellow-400/30",
  "Structure":      "text-slate-400  bg-slate-500/10  border-slate-400/30",
  "Celestial Body": "text-purple-400 bg-purple-500/10 border-purple-400/30",
  "Communication":  "text-cyan-400   bg-cyan-500/10   border-cyan-400/30",
  "Science":        "text-green-400  bg-green-500/10  border-green-400/30",
  "Planet":         "text-blue-400   bg-blue-500/10   border-blue-400/30",
  "Phenomena":      "text-violet-400 bg-violet-500/10 border-violet-400/30",
  "Spacecraft":     "text-cyan-400   bg-cyan-500/10   border-cyan-400/30",
  "Engine":         "text-orange-400 bg-orange-500/10 border-orange-400/30",
};

// ── CV Click Popup ────────────────────────────────────────────────────────────
function ClickPopup({
  popup, containerRect, onClose, onAddToBuilder, onGoToBuilder,
}: {
  popup: ClickPopup;
  containerRect: DOMRect | null;
  onClose: () => void;
  onAddToBuilder: () => void;
  onGoToBuilder: () => void;
}) {
  if (!containerRect) return null;

  const POPUP_W = 290;
  const POPUP_H = 420;
  const margin = 14;

  let left = popup.x + margin;
  let top  = popup.y - 60;
  if (left + POPUP_W > containerRect.width) left = popup.x - POPUP_W - margin;
  top = Math.max(8, Math.min(top, containerRect.height - POPUP_H - 8));

  const cc = catColor[popup.result?.category || ""] || "text-cyan-400 bg-cyan-500/10 border-cyan-400/30";

  return (
    <>
      {/* Ripple */}
      <div className="absolute pointer-events-none z-40"
        style={{ left: popup.x - 20, top: popup.y - 20 }}>
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border border-cyan-300" />
      </div>

      {/* Dot */}
      <div className="absolute z-40 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50 pointer-events-none"
        style={{ left: popup.x - 6, top: popup.y - 6 }} />

      {/* Card */}
      <div className="absolute z-50 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 overflow-hidden"
        style={{ left, top, width: POPUP_W, background: "rgba(5,8,30,0.97)", backdropFilter: "blur(16px)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${popup.loading ? "bg-amber-400 animate-pulse" : popup.result ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className="text-cyan-300 text-xs font-bold tracking-wider uppercase">CV Scanner</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3" style={{ maxHeight: POPUP_H - 52 }}>

          {popup.loading && (
            <div className="flex flex-col items-center py-6 gap-3">
              <Loader className="w-7 h-7 text-cyan-400 animate-spin" />
              <p className="text-cyan-300 text-xs font-semibold">Identifying component...</p>
              <p className="text-white/30 text-xs">AI Vision analyzing</p>
            </div>
          )}

          {!popup.loading && popup.error && (
            <div className="py-4 text-center">
              <p className="text-red-400 text-xs leading-relaxed">{popup.error}</p>
            </div>
          )}

          {!popup.loading && popup.result && (
            <>
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-3xl">{popup.result.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight">{popup.result.component_name}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-semibold ${cc}`}>
                    {popup.result.category}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">What is it?</span>
                </div>
                <p className="text-white/65 text-xs leading-relaxed">{popup.result.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Wrench className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">How it works</span>
                </div>
                <p className="text-white/65 text-xs leading-relaxed">{popup.result.how_to_use}</p>
              </div>

              {popup.result.technical_specs?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Specs</span>
                  </div>
                  <div className="space-y-1">
                    {popup.result.technical_specs.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <ChevronRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-white/55">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {popup.result.fun_facts?.length > 0 && (
                <div className="p-2 bg-yellow-500/5 border border-yellow-400/20 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Did you know?</span>
                  </div>
                  <p className="text-white/55 text-xs">{popup.result.fun_facts[0]}</p>
                </div>
              )}

              {popup.result.can_add_to_builder && popup.result.builder_component_id && (
                <div className="pt-1 space-y-2">
                  {!popup.addedToBuilder ? (
                    <button onClick={onAddToBuilder}
                      className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                      <Plus className="w-3.5 h-3.5" />Add to My Builder
                    </button>
                  ) : (
                    <>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-center">
                        <p className="text-emerald-300 text-xs font-bold">✅ Added to Builder!</p>
                      </div>
                      <button onClick={onGoToBuilder}
                        className="w-full py-2 px-3 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                        <Rocket className="w-3.5 h-3.5" />Go to Builder →
                      </button>
                    </>
                  )}
                </div>
              )}

              {!popup.result.can_add_to_builder && (
                <p className="text-center text-white/30 text-xs py-1">
                  Celestial bodies cannot be added to the builder
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function SpaceSimulationNew() {
  const navigate = useNavigate();

  // Unity state
  const [isLaunched, setIsLaunched]   = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);

  // CV state
  const [cvMode, setCvMode]   = useState(false);
  const [popup, setPopup]     = useState<ClickPopup | null>(null);
  const simulationRef         = useRef<HTMLDivElement>(null);
  const unityClick = useUnityBridge();
  // Handle Unity clicks
  useEffect(() => {
    if (!unityClick || !cvMode) return;
    
    console.log('[CV] Processing Unity click:', unityClick.objectName);
    
    const componentId = mapUnityNameToComponentId(unityClick.objectName);
    
    if (componentId === 'unknown') {
      console.warn('[CV] Unknown Unity object:', unityClick.objectName);
      setPopup({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        loading: false,
        result: null,
        error: `Unknown object: ${unityClick.objectName}`,
        addedToBuilder: false
      });
      return;
    }
    
    // Fetch component details from backend
    fetchComponentDetails(componentId);
    
  }, [unityClick, cvMode]);

  // Fetch function
  const fetchComponentDetails = async (componentId: string) => {
    setPopup({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      loading: true,
      result: null,
      error: "",
      addedToBuilder: false
    });
    
    try {
      const res = await fetch(`${CV_BACKEND}/api/components/${componentId}`);
      
      if (!res.ok) {
        throw new Error(`Component not found: ${componentId}`);
      }
      
      const data = await res.json();
      
      setPopup(prev => prev ? {
        ...prev,
        loading: false,
        result: data
      } : null);
      
    } catch (err: any) {
      console.error('[CV] Failed to fetch component:', err);
      setPopup(prev => prev ? {
        ...prev,
        loading: false,
        error: err.message || "Failed to load component info"
      } : null);
    }
  };
  // ── CV click handler ─────────────────────────────────────────────────────
  const handleSimulationClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cvMode) return;
    if (!simulationRef.current) return;

    // Don't fire if clicking buttons
    if ((e.target as HTMLElement).closest("[data-cv-overlay]")) return;

    const rect   = simulationRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setPopup({ x: clickX, y: clickY, loading: true, result: null, error: "", addedToBuilder: false });

    try {
      // Screenshot the simulation area
      const canvas = await html2canvas(simulationRef.current, {
        backgroundColor: "#000000",
        scale: 1,
        useCORS: true,
        logging: false,
        ignoreElements: (el) => el.hasAttribute("data-cv-overlay"),
      });

      // Crop around click
      // ══════════════════════════════════════════════════════════════════
      // IMPROVED CROP: Larger radius + centered extraction
      // ══════════════════════════════════════════════════════════════════

      // Use larger crop for better context
      const EFFECTIVE_RADIUS = CROP_RADIUS; // 250px from constant

      // Calculate crop boundaries (centered on click)
      const cropX = Math.max(0, Math.round(clickX) - EFFECTIVE_RADIUS);
      const cropY = Math.max(0, Math.round(clickY) - EFFECTIVE_RADIUS);
      const cropW = Math.min(EFFECTIVE_RADIUS * 2, canvas.width  - cropX);
      const cropH = Math.min(EFFECTIVE_RADIUS * 2, canvas.height - cropY);

      // Create crop canvas
      const crop = document.createElement("canvas");
      crop.width  = cropW;
      crop.height = cropH;

      const ctx = crop.getContext("2d")!;

      // Draw the cropped region
      ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      // VISUAL DEBUG (optional): Draw crosshair at center to help GPT-4o
      // Uncomment these lines to add a visual marker at click point
      
      const centerX = Math.min(clickX - cropX, cropW);
      const centerY = Math.min(clickY - cropY, cropH);
      ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY);
      ctx.lineTo(centerX + 20, centerY);
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX, centerY + 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.stroke();
      

      // Convert to base64
      const base64 = crop.toDataURL("image/png").split(",")[1];

      console.log(`[CV] Crop: ${cropW}x${cropH} at (${cropX},${cropY}), click relative: (${clickX-cropX},${clickY-cropY})`);

      const res = await fetch(`${CV_BACKEND}/api/cv/identify-component`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, format: "png" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data: ComponentInfo = await res.json();
      setPopup(prev => prev ? { ...prev, loading: false, result: data } : null);

    } catch (err: any) {
      const msg = err.message?.includes("Failed to fetch")
        ? "CV backend not running. Start Flask: python aeroverse_app.py (port 5000)"
        : err.message || "Unknown error";
      setPopup(prev => prev ? { ...prev, loading: false, error: msg } : null);
    }
  }, [cvMode]);

  const addToBuilder = () => {
    if (!popup?.result?.builder_component_id) return;
    const pending = JSON.parse(sessionStorage.getItem("pendingBuilderComponents") || "[]");
    pending.push({ id: popup.result.builder_component_id, name: popup.result.component_name, addedAt: new Date().toISOString() });
    sessionStorage.setItem("pendingBuilderComponents", JSON.stringify(pending));
    setPopup(prev => prev ? { ...prev, addedToBuilder: true } : null);
  };

  const handleLaunch = () => {
    setIsLaunched(true);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsLaunched(false);
    setIsPlaying(false);
    setCvMode(false);
    setPopup(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.1 }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-sm font-semibold text-cyan-300">🌌 Immersive 3D Experience</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Space Simulation
            </h1>
            <p className="text-lg text-cyan-200/70 max-w-2xl mx-auto">
              Explore the Unity 3D universe · Enable CV Mode to click & identify any component with AI
            </p>
          </div>

          {/* CV Mode banner */}
          {cvMode && (
            <div data-cv-overlay
              className="mb-4 flex items-center gap-3 px-5 py-3 rounded-2xl border border-cyan-400/50 bg-cyan-500/10 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <MousePointer2 className="w-4 h-4 text-cyan-300 shrink-0" />
              <p className="text-cyan-200 text-sm font-semibold flex-1">
                <span className="text-cyan-300">CV Mode active</span> — Click on any object in the Unity simulation to identify it
              </p>
              <button onClick={() => { setCvMode(false); setPopup(null); }}
                className="px-3 py-1 rounded-lg border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all">
                Exit CV Mode
              </button>
            </div>
          )}

          {/* ── Main Simulation Container ── */}
          <Card className="bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-purple-900/20 border-2 border-cyan-500/30 p-0 overflow-hidden mb-6 shadow-2xl shadow-cyan-500/20">
            <div
              ref={simulationRef}
              className="relative aspect-video"
              style={{ cursor: cvMode ? "crosshair" : "default" }}
              onClick={(e) => {
                // Only use old CV if Unity bridge is not active
                if (!isLaunched) {
                  handleSimulationClick(e);
                }
                // If Unity is launched, let the Unity bridge handle it
              }}
            >

              {/* ── BEFORE LAUNCH: preview image ── */}
              {!isLaunched && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#050215] to-slate-900 flex flex-col items-center justify-center gap-6">
                  {/* Stars */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(60)].map((_, i) => (
                      <div key={i} className="absolute rounded-full bg-white"
                        style={{ width: Math.random() > 0.9 ? 2 : 1, height: Math.random() > 0.9 ? 2 : 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.7 + 0.1 }} />
                    ))}
                  </div>

                  {/* Unity logo placeholder */}
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin" />
                      <div className="absolute inset-2 flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">AeroVerse Unity Engine</h2>
                    <p className="text-cyan-200/60 text-sm mb-6 max-w-sm">
                      Click Launch to load the 3D simulation (~30MB). Once loaded, enable CV Mode to identify objects.
                    </p>

                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-xs mb-6">
                      {[["🪐", "Planets"], ["🚀", "Rockets"], ["🛰️", "Satellites"]].map(([icon, label]) => (
                        <div key={label} className="p-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                          <p className="text-lg mb-1">{icon}</p>
                          <p className="text-cyan-300/70">{label}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      data-cv-overlay
                      onClick={(e) => { e.stopPropagation(); handleLaunch(); }}
                      className="px-10 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-full shadow-lg shadow-cyan-500/40 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-5 h-5" />
                      Launch Unity Simulation
                    </button>
                  </div>
                </div>
              )}

              {/* ── AFTER LAUNCH: Unity WebGL fills the frame ── */}
              {isLaunched && (
                <div className="absolute inset-0">
                  <UnityViewer
                    loaderUrl={UNITY_LOADER}
                    dataUrl={UNITY_DATA}
                    frameworkUrl={UNITY_FRAMEWORK}
                    codeUrl={UNITY_CODE}
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* CV crosshair hint — shown over Unity when CV mode active */}
              {cvMode && isLaunched && !popup && (
                <div data-cv-overlay
                  className="absolute inset-0 pointer-events-none flex items-end justify-center pb-20">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/30">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    <p className="text-cyan-300 text-xs font-semibold">Click on any object to identify it</p>
                  </div>
                </div>
              )}

              {/* CV Popup */}
              {popup && (
                <ClickPopup
                  popup={popup}
                  containerRect={simulationRef.current?.getBoundingClientRect() || null}
                  onClose={() => setPopup(null)}
                  onAddToBuilder={addToBuilder}
                  onGoToBuilder={() => navigate("/builder")}
                />
              )}

              {/* LIVE indicator */}
              {isLaunched && isPlaying && (
                <div data-cv-overlay
                  className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-3 py-1.5 z-20">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-100 text-xs font-bold">LIVE</span>
                </div>
              )}

              {/* Bottom controls bar */}
              <div
                data-cv-overlay
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 px-6 py-4 z-20"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Play/Pause or Launch */}
                <Button
                  onClick={() => { if (!isLaunched) { handleLaunch(); } else { setIsPlaying(p => !p); } }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-lg font-semibold"
                >
                  {isPlaying ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />{isLaunched ? "Resume" : "Launch"}</>}
                </Button>

                {/* Reset */}
                {isLaunched && (
                  <Button onClick={handleReset} variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10 rounded-full px-4 py-2.5 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />Reset
                  </Button>
                )}

                {/* ── CV Camera button ── */}
                <Button
                  onClick={() => { 
                    const newMode = !cvMode;
                    setCvMode(newMode); 
                    setPopup(null);
                    
                    // Tell Unity to activate CV mode
                    setUnityCVMode(newMode);
                    console.log('[CV] Mode toggled:', newMode);
                  }}
                >
                  <Camera className="w-4 h-4" />
                  {cvMode ? "🔬 CV ON" : "🔬 CV Camera"}
                </Button>

                {/* Fullscreen hint */}
                <Button variant="ghost"
                  className="rounded-full text-white/50 hover:text-white hover:bg-white/10 p-2.5"
                  onClick={() => simulationRef.current?.requestFullscreen?.()}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Info cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-5 hover:border-cyan-500/60 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Camera Control</h3>
              </div>
              <div className="space-y-2 text-cyan-200/70 text-sm">
                <div><p className="font-semibold text-white mb-0.5">Mouse</p><p>Click & Drag: Rotate · Scroll: Zoom</p></div>
                <div><p className="font-semibold text-white mb-0.5">Keyboard</p><p>WASD: Move · Space: Up · Ctrl: Down</p></div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 p-5 hover:border-blue-500/60 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Features</h3>
              </div>
              <ul className="space-y-1.5 text-blue-200/70 text-sm">
                <li>✓ Real-time Unity 3D rendering</li>
                <li>✓ Physics-based interactions</li>
                <li>✓ Planets, rockets & satellites</li>
                <li>✓ <span className="text-cyan-300 font-semibold">🔬 Click-to-Identify with AI CV</span></li>
                <li>✓ Add objects to Mission Builder</li>
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-5 hover:border-purple-500/60 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Performance</h3>
              </div>
              <div className="space-y-2 text-purple-200/70 text-sm">
                <div className="flex justify-between"><span>FPS</span><span className="text-purple-300 font-semibold">60+</span></div>
                <div className="flex justify-between"><span>Latency</span><span className="text-purple-300 font-semibold">&lt;16ms</span></div>
                <div className="flex justify-between"><span>Resolution</span><span className="text-purple-300 font-semibold">4K Ready</span></div>
                <div className="flex justify-between"><span>Engine</span><span className="text-purple-300 font-semibold">Unity WebGL</span></div>
              </div>
            </Card>
          </div>

          {/* CV How-to guide */}
          <Card className="bg-gradient-to-br from-violet-900/30 to-cyan-900/20 border border-violet-500/30 p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-500/20 rounded-xl shrink-0">
                <MousePointer2 className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-2">🔬 How to use CV Camera with Unity</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  {[
                    ["1.", "cyan",   "Click Launch to load Unity. Navigate to any planet, rocket, or satellite in 3D space."],
                    ["2.", "violet", "Click 🔬 CV Camera to enable CV Mode — cursor becomes a crosshair."],
                    ["3.", "purple", "Click directly on any 3D object. AI identifies it and gives full specs + add to Builder!"],
                  ].map(([n, c, t]) => (
                    <div key={n as string} className="flex items-start gap-2">
                      <span className={`text-${c}-400 font-bold shrink-0 text-base`}>{n}</span>
                      <p className="text-white/60 text-xs leading-relaxed">{t as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
