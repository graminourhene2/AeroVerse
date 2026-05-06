import { Navigation } from "../Navigation";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, Satellite, Radio } from "lucide-react";

const options = [
  {
    id: "satellite",
    title: "Satellite",
    subtitle: "Earth Observation & Communications",
    description:
      "Design and assemble a satellite from scratch. Choose components like solar panels, antennas, attitude control systems, and scientific instruments to build a fully functional spacecraft.",
    icon: Satellite,
    gradient: "from-cyan-900/40 via-blue-900/30 to-cyan-900/20",
    border: "border-cyan-500/30",
    hoverBorder: "hover:border-cyan-400/60",
    shadow: "shadow-cyan-500/20",
    hoverShadow: "hover:shadow-cyan-500/40",
    badge: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300",
    iconColor: "text-cyan-400",
    btnGradient: "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700",
    tag: "Beginner Friendly",
    specs: ["Low Earth Orbit", "Communications", "Earth Observation", "Navigation"],
  },
  {
    id: "gateway",
    title: "Lunar Gateway",
    subtitle: "Deep Space Habitation Station",
    description:
      "Engineer the Lunar Gateway — NASA's planned space station orbiting the Moon. Connect habitation modules, power systems, and docking ports to build humanity's next step toward deep space exploration.",
    icon: Radio,
    gradient: "from-purple-900/40 via-violet-900/30 to-purple-900/20",
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/60",
    shadow: "shadow-purple-500/20",
    hoverShadow: "hover:shadow-purple-500/40",
    badge: "bg-purple-500/20 border-purple-400/30 text-purple-300",
    iconColor: "text-purple-400",
    btnGradient: "from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
    tag: "Advanced",
    specs: ["Lunar Orbit", "Deep Space Hab", "Crew Transport", "Research Lab"],
  },
];

export function BuilderHub() {
  const navigate = useNavigate();

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
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 3) % 100}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
              }}
            />
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-14 text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-sm font-semibold text-cyan-300">Spacecraft Design Lab</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Choose Your Mission
            </h1>
            <p className="text-lg text-cyan-200/60 max-w-xl mx-auto">
              Select a spacecraft type to begin your design simulation
            </p>
          </div>

          {/* Two option cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <Card
                  key={opt.id}
                  className={`bg-gradient-to-br ${opt.gradient} ${opt.border} ${opt.hoverBorder} border-2 p-8 flex flex-col gap-6 transition-all duration-300 shadow-2xl ${opt.shadow} ${opt.hoverShadow} cursor-pointer group`}
                  onClick={() => navigate(`/builder/${opt.id}`)}
                >
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${opt.iconColor}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${opt.badge}`}>
                      {opt.tag}
                    </span>
                  </div>

                  {/* Title & description */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{opt.title}</h2>
                    <p className="text-sm font-medium text-white/50 mb-4">{opt.subtitle}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{opt.description}</p>
                  </div>

                  {/* Spec tags */}
                  <div className="flex flex-wrap gap-2">
                    {opt.specs.map((spec) => (
                      <span key={spec} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/50">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full bg-gradient-to-r ${opt.btnGradient} text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg mt-auto`}
                    onClick={(e) => { e.stopPropagation(); navigate(`/builder/${opt.id}`); }}
                  >
                    Launch Simulation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
