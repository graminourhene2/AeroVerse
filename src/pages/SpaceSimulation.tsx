import { Navigation } from "../Navigation";
import { useState } from "react";
import { Play, Pause, RotateCcw, Info, Maximize2 } from "lucide-react";
import { Button } from "../components/ui/button";

const destinations = [
  {
    id: "earth",
    name: "Earth Orbit",
    description: "Experience our beautiful planet from the International Space Station",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGZyb20lMjBzcGFjZXxlbnwxfHx8fDE3Njk5ODM4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    facts: [
      "Orbital altitude: ~408 km",
      "Orbital speed: 7.66 km/s",
      "One orbit: ~90 minutes",
    ],
  },
  {
    id: "mars",
    name: "Mars Surface",
    description: "Walk on the red planet and explore Martian landscapes",
    image: "https://images.unsplash.com/photo-1710676145418-51accf3af505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwc3VyZmFjZXxlbnwxfHx8fDE3NzAwMjE5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    facts: [
      "Distance from Earth: 225 million km",
      "Day length: 24h 37min",
      "Temperature: -63°C average",
    ],
  },
  {
    id: "spacewalk",
    name: "EVA Mission",
    description: "Float in the void during an Extra-Vehicular Activity",
    image: "https://images.unsplash.com/photo-1614727187346-ec3a009092b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3Ryb25hdXQlMjBzcGFjZXdhbGt8ZW58MXx8fHwxNzcwMDIxOTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    facts: [
      "Spacesuit weight: ~130 kg",
      "EVA duration: 5-8 hours",
      "Vacuum of space: 0 pressure",
    ],
  },
];

export function SpaceSimulation() {
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />
      
      {/* Main Simulation Viewer */}
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Space Simulation
            </h1>
            <p className="text-purple-200/70">
              Explore the cosmos in real-time 3D environments
            </p>
          </div>

          {/* Main Viewer */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-purple-400/30 shadow-2xl shadow-purple-500/20 mb-6">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ backgroundImage: `url('${selectedDestination.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
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

            {/* Info Panel */}
            {showInfo && (
              <div className="absolute top-6 left-6 right-6 md:right-auto md:max-w-sm bg-black/60 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-purple-100 mb-2">
                  {selectedDestination.name}
                </h3>
                <p className="text-purple-200/80 text-sm mb-4">
                  {selectedDestination.description}
                </p>
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

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-xl rounded-full px-6 py-3 border border-purple-400/30">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full text-purple-100 hover:bg-purple-500/20"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-purple-400/30" />
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full text-purple-100 hover:bg-purple-500/20"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full text-purple-100 hover:bg-purple-500/20"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Status Indicator */}
            {isPlaying && (
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-red-100 text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>

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
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {dest.name}
                    </h4>
                    <p className="text-white/70 text-sm line-clamp-1">
                      {dest.description}
                    </p>
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
