import { Navigation } from "../Navigation";
import { useState } from "react";
import { Plus, Trash2, Save, Download, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";

const components = [
  { id: "capsule", name: "Command Module", icon: "🚀", color: "bg-blue-500" },
  { id: "engine", name: "Rocket Engine", icon: "🔥", color: "bg-red-500" },
  { id: "solar", name: "Solar Panel", icon: "⚡", color: "bg-yellow-500" },
  { id: "antenna", name: "Communication", icon: "📡", color: "bg-green-500" },
  { id: "fuel", name: "Fuel Tank", icon: "⛽", color: "bg-purple-500" },
  { id: "lab", name: "Science Lab", icon: "🔬", color: "bg-cyan-500" },
  { id: "habitat", name: "Living Module", icon: "🏠", color: "bg-pink-500" },
  { id: "wing", name: "Stabilizer", icon: "✈️", color: "bg-indigo-500" },
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
  const [projectName, setProjectName] = useState("My Spacecraft");

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
    return components.find(c => c.id === type) || components[0];
  };

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 bg-clip-text text-transparent">
                Space Builder
              </h1>
              <p className="text-purple-200/70">
                Design your own spacecraft and space stations
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Component Library */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl rounded-2xl border border-purple-400/30 p-6">
                <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  Components
                </h3>
                <div className="space-y-2">
                  {components.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => addComponent(comp.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 hover:bg-purple-500/20 hover:border-purple-400/40 transition-all group"
                    >
                      <div className={`w-10 h-10 ${comp.color} rounded-lg flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {comp.icon}
                      </div>
                      <span className="text-purple-100 text-sm font-medium">
                        {comp.name}
                      </span>
                      <Plus className="w-4 h-4 ml-auto text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-purple-400/20">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300/70">Components:</span>
                      <span className="text-purple-100 font-semibold">{buildArea.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300/70">Mass:</span>
                      <span className="text-purple-100 font-semibold">{buildArea.length * 1.2}t</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300/70">Complexity:</span>
                      <span className="text-cyan-300 font-semibold">
                        {buildArea.length < 3 ? "Simple" : buildArea.length < 7 ? "Moderate" : "Advanced"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Build Area */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[16/10] rounded-2xl border-2 border-purple-400/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/40 to-pink-950/40 overflow-hidden shadow-2xl shadow-purple-500/20">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(rgba(167, 139, 250, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />

                {/* Stars */}
                <div className="absolute inset-0">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Project Name */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-400/30">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="bg-transparent text-purple-100 font-semibold outline-none w-48"
                    placeholder="Project Name"
                  />
                </div>

                {/* Components in build area */}
                {buildArea.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-50">🚀</div>
                      <p className="text-purple-200/50 text-lg">
                        Click components to start building
                      </p>
                    </div>
                  </div>
                ) : (
                  buildArea.map((comp) => {
                    const compData = getComponentData(comp.type);
                    const isSelected = selectedComponent === comp.id;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedComponent(comp.id)}
                        className={`absolute cursor-move group transition-transform hover:scale-110 ${
                          isSelected ? "scale-110 z-10" : ""
                        }`}
                        style={{
                          left: `${comp.x}%`,
                          top: `${comp.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className={`relative ${compData.color} rounded-xl p-4 shadow-2xl ${
                          isSelected ? "ring-4 ring-cyan-400/60" : ""
                        }`}>
                          <div className="text-3xl">{compData.icon}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeComponent(comp.id);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        {isSelected && (
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-purple-100 border border-purple-400/30">
                            {compData.name}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Export Button */}
                {buildArea.length > 0 && (
                  <div className="absolute bottom-4 right-4">
                    <Button
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Design
                    </Button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">💡</div>
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">Tip:</span> Click components to select and position them
                  </p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">⚙️</div>
                  <p className="text-cyan-200 text-sm">
                    <span className="font-semibold">Pro:</span> Balance your design for optimal performance
                  </p>
                </div>
                <div className="bg-pink-500/10 border border-pink-400/20 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-pink-200 text-sm">
                    <span className="font-semibold">Create:</span> Mix different modules for unique designs
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
