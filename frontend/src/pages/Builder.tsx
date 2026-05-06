import { Navigation } from "../Navigation";
import { useState } from "react";
import { Plus, Trash2, Save, Download, Sparkles, Database } from "lucide-react";
import { Button } from "../components/ui/button";

const components = [
  // Propulsion
  { id: "engine-rl10", name: "RL-10 Engine", category: "Propulsion", mass: 385, power: 0, isp: 465, color: "bg-blue-600" },
  { id: "engine-merlin", name: "Merlin Engine", category: "Propulsion", mass: 540, power: 0, isp: 282, color: "bg-blue-600" },
  { id: "engine-rs25", name: "RS-25 Engine", category: "Propulsion", mass: 3177, power: 0, isp: 453, color: "bg-blue-600" },
  
  // Tanks
  { id: "tank-fuel-lox", name: "LOX Tank (5000L)", category: "Fuel", mass: 2400, power: 0, isp: 0, color: "bg-orange-600" },
  { id: "tank-fuel-rp1", name: "RP-1 Tank (3000L)", category: "Fuel", mass: 1800, power: 0, isp: 0, color: "bg-orange-600" },
  { id: "tank-lh2", name: "Hydrogen Tank (4000L)", category: "Fuel", mass: 1200, power: 0, isp: 0, color: "bg-orange-600" },
  
  // Avionics & Control
  { id: "avionics-primary", name: "Primary Flight Computer", category: "Avionics", mass: 45, power: 850, isp: 0, color: "bg-green-600" },
  { id: "avionics-rcs", name: "RCS Thrusters (12)", category: "Avionics", mass: 380, power: 0, isp: 225, color: "bg-green-600" },
  { id: "inertial-nav", name: "Inertial Measurement Unit", category: "Avionics", mass: 12, power: 15, isp: 0, color: "bg-green-600" },
  
  // Power
  { id: "solar-array-5kw", name: "Solar Array (5kW)", category: "Power", mass: 850, power: 5000, isp: 0, color: "bg-yellow-600" },
  { id: "battery-pack", name: "Battery Pack (200Ah)", category: "Power", mass: 420, power: 0, isp: 0, color: "bg-yellow-600" },
  { id: "radiator-thermal", name: "Thermal Radiator", category: "Power", mass: 280, power: 0, isp: 0, color: "bg-yellow-600" },
  
  // Communications
  { id: "antenna-hga", name: "HGA (High Gain)", category: "Comms", mass: 32, power: 120, isp: 0, color: "bg-cyan-600" },
  { id: "transponder-uhf", name: "UHF Transponder", category: "Comms", mass: 4, power: 80, isp: 0, color: "bg-cyan-600" },
  { id: "laser-comm", name: "Laser Comm Terminal", category: "Comms", mass: 15, power: 150, isp: 0, color: "bg-cyan-600" },
  
  // Structures
  { id: "truss-kevlar", name: "Kevlar Truss Frame", category: "Structure", mass: 520, power: 0, isp: 0, color: "bg-red-600" },
  { id: "heatshield-silica", name: "Silica Heatshield", category: "Structure", mass: 1850, power: 0, isp: 0, color: "bg-red-600" },
  { id: "alloy-frame-al", name: "Aluminum Frame", category: "Structure", mass: 380, power: 0, isp: 0, color: "bg-red-600" },
  
  // Instruments
  { id: "camera-high-res", name: "High-Res Camera (12MP)", category: "Instruments", mass: 2.8, power: 45, isp: 0, color: "bg-purple-600" },
  { id: "lidar-scanner", name: "LiDAR Scanner", category: "Instruments", mass: 8.5, power: 120, isp: 0, color: "bg-purple-600" },
  { id: "spectrometer", name: "Spectrometer", category: "Instruments", mass: 3.2, power: 35, isp: 0, color: "bg-purple-600" },
];

interface BuildComponent {
  id: string;
  type: string;
  x: number;
  y: number;
}

export function Builder() {
  const [buildArea, setBuildArea] = useState<BuildComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Spacecraft Design");

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

  const clearAll = () => {
    setBuildArea([]);
    setSelectedComponent(null);
  };

  const getComponentData = (type: string) => {
    return components.find(c => c.id === type);
  };

  const calculateStats = () => {
    let totalMass = 0, totalPower = 0;
    buildArea.forEach(comp => {
      const data = getComponentData(comp.type);
      if (data) {
        totalMass += data.mass;
        totalPower += data.power;
      }
    });
    return { totalMass, totalPower };
  };

  const stats = calculateStats();
  const categories = ["Propulsion", "Fuel", "Avionics", "Power", "Comms", "Structure", "Instruments"];

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Spacecraft Design Studio
              </h1>
              <p className="text-purple-200/70">
                Professional CAD environment for aerospace vehicle design and integration
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10"
                onClick={clearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Design
              </Button>
              <Button 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Component Library */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-300" />
                  Component Library
                </h3>
                
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <h4 className="text-xs font-bold uppercase text-cyan-300 mb-2 px-2">{category}</h4>
                      <div className="space-y-1">
                        {components
                          .filter(c => c.category === category)
                          .map((comp) => (
                            <button
                              key={comp.id}
                              onClick={() => addComponent(comp.id)}
                              className="w-full flex items-start gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-400/20 hover:bg-purple-500/20 hover:border-purple-400/40 transition-all group text-left"
                              title={`Mass: ${comp.mass}kg | Power: ${comp.power}W${comp.isp ? ` | Isp: ${comp.isp}s` : ''}`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 ${comp.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                                {comp.category[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-purple-100 text-xs font-medium truncate">
                                  {comp.name}
                                </div>
                                <div className="text-purple-300/50 text-xs">
                                  {comp.mass}kg {comp.power > 0 && `• ${comp.power}W`}
                                </div>
                              </div>
                              <Plus className="w-3 h-3 ml-auto text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Design Stats */}
                <div className="mt-6 pt-6 border-t border-purple-400/20">
                  <h4 className="text-xs font-bold uppercase text-cyan-300 mb-3">Design Specs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-300/70">Components:</span>
                      <span className="text-cyan-300 font-bold">{buildArea.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-300/70">Total Mass:</span>
                      <span className="text-cyan-300 font-bold">{stats.totalMass.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-purple-300/70">Power Budget:</span>
                      <span className="text-cyan-300 font-bold">{stats.totalPower.toLocaleString()} W</span>
                    </div>
                    <div className="pt-2 border-t border-purple-400/20">
                      <div className="text-xs text-purple-300/60 mb-2">Complexity Level</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              level <= Math.ceil(buildArea.length / 3) 
                                ? "bg-cyan-500" 
                                : "bg-purple-500/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Canvas */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[16/10] rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 overflow-hidden shadow-2xl shadow-cyan-500/20">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `
                    linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />

                {/* Axis labels */}
                <div className="absolute top-4 left-4 text-xs text-cyan-300/50 font-mono">
                  CAD VIEWPORT
                </div>

                {/* Project Name */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-400/30">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-transparent text-cyan-100 font-mono text-sm outline-none w-64"
                    placeholder="Project Name"
                  />
                </div>

                {/* Components */}
                {buildArea.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-20">⬛</div>
                      <p className="text-cyan-200/40 text-lg font-mono">
                        Add components from library to begin design
                      </p>
                    </div>
                  </div>
                ) : (
                  buildArea.map((comp) => {
                    const compData = getComponentData(comp.type);
                    const isSelected = selectedComponent === comp.id;
                    if (!compData) return null;
                    
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedComponent(comp.id)}
                        className={`absolute cursor-move group transition-transform hover:scale-125 ${
                          isSelected ? "scale-125 z-20" : "z-10"
                        }`}
                        style={{
                          left: `${comp.x}%`,
                          top: `${comp.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className={`relative ${compData.color} rounded-lg p-3 shadow-2xl border ${
                          isSelected ? "border-cyan-300 ring-2 ring-cyan-400" : "border-opacity-50"
                        }`}>
                          <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                            {compData.category[0]}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeComponent(comp.id);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-red-400"
                        >
                          <span className="text-white text-xs">×</span>
                        </button>
                        
                        {isSelected && (
                          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-cyan-100 border border-cyan-400/40 font-mono z-50">
                            <div className="font-bold">{compData.name}</div>
                            <div className="text-cyan-300/70">M:{compData.mass}kg {compData.power > 0 && `P:${compData.power}W`}</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Export Button */}
                {buildArea.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CAD
                    </Button>
                  </div>
                )}
              </div>

              {/* Info Panels */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
                  <div className="text-sm font-mono text-cyan-300 mb-1">DESIGN RULES</div>
                  <p className="text-cyan-200/70 text-xs leading-relaxed">
                    Mass balance for stability. Power budget determines operational capacity. Check specs before finalization.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <div className="text-sm font-mono text-blue-300 mb-1">INTEGRATION</div>
                  <p className="text-blue-200/70 text-xs leading-relaxed">
                    Components must be compatible. Thermal management critical. Verify mass distribution for launch.
                  </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4">
                  <div className="text-sm font-mono text-purple-300 mb-1">OPTIMIZATION</div>
                  <p className="text-purple-200/70 text-xs leading-relaxed">
                    Drag reduction through positioning. Redundancy for critical systems. Export final design for analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
