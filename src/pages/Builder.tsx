import { Navigation } from "../Navigation";

export function Builder() {
  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />

      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Spacecraft Builder
            </h1>
            <p className="text-purple-200/70">
              Professional CAD environment for aerospace vehicle design
            </p>
          </div>

          {/* Main Viewport */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-purple-400/30 shadow-2xl shadow-purple-500/20">
            {/* Grid background */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34, 211, 238, 0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34, 211, 238, 0.07) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-cyan-400/40 rounded-full animate-pulse"
                  style={{
                    left: `${(i * 7.3) % 100}%`,
                    top: `${(i * 11.7) % 100}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
