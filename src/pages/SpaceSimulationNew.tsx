import { Navigation } from "../Navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Play, Pause, Sparkles, Zap, Eye, Rocket } from "lucide-react";
import { useState } from "react";

export function SpaceSimulationNew() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0518] overflow-hidden">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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

        {/* Animated grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgb(139, 92, 246)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with gradient text */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              <p className="text-sm font-semibold text-cyan-300">Immersive 3D Experience</p>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Space Simulation
            </h1>
            
            <p className="text-xl text-cyan-200/70 max-w-2xl mx-auto">
              Explore infinite cosmic environments with cutting-edge 3D rendering and interactive physics
            </p>
          </div>

          {/* Main Simulation Container */}
          <Card className="bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-purple-900/20 border-2 border-cyan-500/30 p-0 overflow-hidden mb-8 shadow-2xl shadow-cyan-500/20">
            <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center group">
              {!unityLoaded ? (
                <div className="text-center space-y-6 z-10">
                  {/* Animated loading ring */}
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 w-full h-full border-4 border-cyan-500/30 rounded-full" />
                      <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text mb-2">
                      Loading Environment
                    </p>
                    <p className="text-cyan-200/70">Initializing 3D engine...</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-xs">
                    <div className="p-2 rounded border border-cyan-500/20 bg-cyan-500/10">
                      <p className="text-cyan-400">Physics</p>
                      <p className="text-cyan-200/70">Enabled</p>
                    </div>
                    <div className="p-2 rounded border border-blue-500/20 bg-blue-500/10">
                      <p className="text-blue-400">Graphics</p>
                      <p className="text-blue-200/70">HD Ready</p>
                    </div>
                    <div className="p-2 rounded border border-purple-500/20 bg-purple-500/10">
                      <p className="text-purple-400">Audio</p>
                      <p className="text-purple-200/70">Ready</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-black">
                  {/* Unity WebGL will be embedded here */}
                  <iframe
                    title="Unity Simulation"
                    width="100%"
                    height="100%"
                    src="" // Add your Unity WebGL URL here
                    allow="autoplay"
                  />
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />

              {/* Controls */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4 z-20">
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full px-8 py-3 flex items-center gap-2 shadow-lg shadow-cyan-500/50 font-semibold"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Launch
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Camera Controls */}
            <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-6 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Camera Control</h3>
              </div>
              <div className="space-y-3 text-cyan-200/70 text-sm">
                <div>
                  <p className="font-semibold text-white mb-1">Mouse</p>
                  <p>Click & Drag: Rotate • Scroll: Zoom</p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Keyboard</p>
                  <p>WASD: Move • Space: Up • Ctrl: Down</p>
                </div>
              </div>
            </Card>

            {/* Rendering Features */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 p-6 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Features</h3>
              </div>
              <ul className="space-y-2 text-blue-200/70 text-sm">
                <li>✓ Real-time 3D rendering</li>
                <li>✓ Physics-based interactions</li>
                <li>✓ Multiple environments</li>
                <li>✓ Interactive objects</li>
                <li>✓ Educational overlays</li>
              </ul>
            </Card>

            {/* Performance */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Performance</h3>
              </div>
              <div className="space-y-2 text-purple-200/70 text-sm">
                <div className="flex justify-between">
                  <span>FPS</span>
                  <span className="text-purple-300 font-semibold">60+</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency</span>
                  <span className="text-purple-300 font-semibold">&lt;16ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolution</span>
                  <span className="text-purple-300 font-semibold">4K Ready</span>
                </div>
              </div>
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
}
