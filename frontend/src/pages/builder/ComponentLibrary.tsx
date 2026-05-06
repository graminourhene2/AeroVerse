import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";

// Components avec URLs d'images fonctionnelles (pas de CORS)
const SPACE_COMPONENTS = [
  {
    id: "command_module",
    name: "Command Module",
    category: "Control",
    description: "Main control center of the spacecraft",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop", // Space capsule
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#4338ca" stroke="#818cf8" stroke-width="2"/>
      <circle cx="50" cy="35" r="10" fill="#60a5fa" opacity="0.8"/>
      <rect x="30" y="60" width="40" height="20" rx="3" fill="#1e3a8a"/>
      <text x="50" y="90" text-anchor="middle" fill="#e0e7ff" font-size="10" font-family="Arial">CMD</text>
    </svg>`
  },
  {
    id: "rocket_engine",
    name: "Rocket Engine",
    category: "Propulsion",
    description: "Primary propulsion system",
    imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&h=300&fit=crop", // Rocket engine
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="20" width="30" height="40" rx="5" fill="#dc2626" stroke="#f87171" stroke-width="2"/>
      <polygon points="35,60 50,80 65,60" fill="#f97316" opacity="0.9"/>
      <circle cx="50" cy="35" r="8" fill="#fbbf24"/>
      <circle cx="50" cy="50" r="6" fill="#fef3c7"/>
    </svg>`
  },
  {
    id: "solar_panel",
    name: "Solar Panel",
    category: "Energy",
    description: "Solar power generation",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop", // Solar panels
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="40" fill="#1e40af" stroke="#3b82f6" stroke-width="2"/>
      <line x1="10" y1="50" x2="90" y2="50" stroke="#60a5fa" stroke-width="1"/>
      <line x1="30" y1="30" x2="30" y2="70" stroke="#60a5fa" stroke-width="1"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="#60a5fa" stroke-width="1"/>
      <line x1="70" y1="30" x2="70" y2="70" stroke="#60a5fa" stroke-width="1"/>
      <circle cx="50" cy="15" r="5" fill="#fbbf24"/>
    </svg>`
  },
  {
    id: "satellite",
    name: "Satellite",
    category: "Communication",
    description: "Communication and observation",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop", // Satellite
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="40" width="20" height="20" fill="#059669" stroke="#10b981" stroke-width="2"/>
      <rect x="15" y="45" width="20" height="10" fill="#3b82f6" opacity="0.7"/>
      <rect x="65" y="45" width="20" height="10" fill="#3b82f6" opacity="0.7"/>
      <line x1="50" y1="20" x2="50" y2="35" stroke="#ef4444" stroke-width="2"/>
      <circle cx="50" cy="15" r="5" fill="#f87171"/>
    </svg>`
  },
  {
    id: "fuel_tank",
    name: "Fuel Tank",
    category: "Storage",
    description: "Fuel storage capacity",
    imageUrl: "https://picsum.photos/seed/fueltank/400/300", // Placeholder industrial
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="30" rx="25" ry="10" fill="#7c3aed" stroke="#a78bfa" stroke-width="2"/>
      <rect x="25" y="30" width="50" height="50" fill="#6d28d9" stroke="#a78bfa" stroke-width="2"/>
      <ellipse cx="50" cy="80" rx="25" ry="10" fill="#5b21b6" stroke="#a78bfa" stroke-width="2"/>
      <rect x="45" y="15" width="10" height="10" rx="2" fill="#c4b5fd"/>
    </svg>`
  },
  {
    id: "science_lab",
    name: "Science Lab",
    category: "Research",
    description: "Scientific research module",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", // Lab
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="50" rx="5" fill="#0891b2" stroke="#22d3ee" stroke-width="2"/>
      <rect x="30" y="40" width="15" height="15" fill="#67e8f9" opacity="0.6"/>
      <rect x="55" y="40" width="15" height="15" fill="#67e8f9" opacity="0.6"/>
      <circle cx="37.5" cy="65" r="5" fill="#fbbf24"/>
      <circle cx="62.5" cy="65" r="5" fill="#34d399"/>
    </svg>`
  },
  {
    id: "living_module",
    name: "Living Module",
    category: "Habitat",
    description: "Crew living quarters",
    imageUrl: "https://picsum.photos/seed/habitat/400/300", // Placeholder
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="50" height="40" rx="8" fill="#db2777" stroke="#f472b6" stroke-width="2"/>
      <rect x="35" y="45" width="12" height="15" fill="#fef3c7" opacity="0.8"/>
      <rect x="53" y="45" width="12" height="15" fill="#fef3c7" opacity="0.8"/>
      <circle cx="50" cy="25" r="8" fill="#fbbf24"/>
      <path d="M 50 25 L 50 35" stroke="#fbbf24" stroke-width="2"/>
    </svg>`
  },
  {
    id: "communication",
    name: "Communication Antenna",
    category: "Systems",
    description: "Long-range communication",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop", // Antenna
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="45" y="50" width="10" height="35" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
      <polygon points="50,20 35,50 65,50" fill="#10b981" stroke="#34d399" stroke-width="2"/>
      <circle cx="50" cy="20" r="6" fill="#ef4444"/>
      <path d="M 30 35 Q 50 30 70 35" stroke="#22d3ee" stroke-width="2" fill="none"/>
      <path d="M 25 45 Q 50 38 75 45" stroke="#22d3ee" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    id: "turbofan_engine",
    name: "Turbofan Engine",
    category: "Propulsion",
    description: "Advanced jet propulsion",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=300&fit=crop", // Jet engine
    fallbackSVG: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#1e293b" stroke="#475569" stroke-width="3"/>
      <circle cx="50" cy="50" r="20" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <circle cx="50" cy="50" r="10" fill="#ef4444" opacity="0.8"/>
      <path d="M 20 50 L 10 40 M 20 50 L 10 60" stroke="#f97316" stroke-width="3"/>
      <path d="M 80 50 L 90 40 M 80 50 L 90 60" stroke="#f97316" stroke-width="3"/>
    </svg>`
  }
];

export function ComponentLibrary() {
  const handleAddComponent = (comp: typeof SPACE_COMPONENTS[0]) => {
    // Dispatch event ou appel API pour ajouter au canvas
    window.dispatchEvent(new CustomEvent('addComponent', { detail: comp }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📦 Component Library</h2>
          <p className="text-purple-200/70">Select components to build your spacecraft</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {SPACE_COMPONENTS.map((comp) => (
          <Card 
            key={comp.id} 
            className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 p-4 hover:border-purple-500/50 transition-all cursor-pointer group"
            onClick={() => handleAddComponent(comp)}
          >
            <div className="flex items-start gap-4">
              {/* Image avec fallback SVG */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-purple-900/30 flex-shrink-0 border border-purple-500/30">
                <img 
                  src={comp.imageUrl}
                  alt={comp.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Si l'image échoue, affiche le SVG
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const svg = target.nextElementSibling as HTMLDivElement;
                    if (svg) svg.style.display = 'block';
                  }}
                />
                <div 
                  className="w-full h-full hidden"
                  dangerouslySetInnerHTML={{ __html: comp.fallbackSVG }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors">
                      {comp.name}
                    </h3>
                    <p className="text-sm text-purple-300">{comp.category}</p>
                    <p className="text-xs text-purple-200/60 mt-1 line-clamp-2">{comp.description}</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddComponent(comp);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl">
        <p className="text-sm text-purple-200/70 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>Click on any component to add it to your spacecraft assembly zone</span>
        </p>
      </div>
    </div>
  );
}
