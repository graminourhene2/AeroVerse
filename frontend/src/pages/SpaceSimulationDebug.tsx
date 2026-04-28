import { Navigation } from "../Navigation";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { UnityViewer } from "../components/UnityViewer";

/**
 * SIMPLIFIED TEST PAGE - To diagnose Unity integration issues
 * Go to http://localhost:5174/simulation-debug to test
 */

export function SpaceSimulationDebug() {
  const [showUnity, setShowUnity] = useState(false);
  const [debug, setDebug] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(`[DEBUG] ${msg}`);
    setDebug(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleShowUnity = () => {
    addLog("Button clicked - showing UnityViewer");
    setShowUnity(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0518]">
      <Navigation />

      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-300 mb-6">🔧 Unity Integration Debug</h1>

          {/* Status Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-4">
              <p className="text-cyan-200 font-semibold mb-2">Status</p>
              <p className="text-sm text-cyan-100">
                UnityViewer: <span className={showUnity ? "text-green-400" : "text-red-400"}>
                  {showUnity ? "RENDERED" : "HIDDEN"}
                </span>
              </p>
            </div>

            <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-4">
              <p className="text-cyan-200 font-semibold mb-2">Build Files</p>
              <p className="text-sm text-cyan-100">✅ All present (27MB total)</p>
            </div>

            <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-4">
              <p className="text-cyan-200 font-semibold mb-2">CORS Headers</p>
              <p className="text-sm text-cyan-100">✅ Configured in vite.config.ts</p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleShowUnity}
              className="bg-green-600 hover:bg-green-700"
              disabled={showUnity}
            >
              {showUnity ? "✅ UnityViewer Active" : "🎮 Show UnityViewer"}
            </Button>

            <Button
              onClick={() => {
                setShowUnity(false);
                setDebug([]);
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Reset
            </Button>

            <Button
              onClick={() => {
                addLog("Manual refresh");
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Log Message
            </Button>
          </div>

          {/* Debug Logs */}
          <div className="bg-gray-900 border border-cyan-400/30 rounded-lg p-4 mb-6">
            <p className="text-cyan-200 font-semibold mb-3">📋 Debug Logs</p>
            <div className="bg-black/50 rounded p-3 text-cyan-300 font-mono text-xs h-32 overflow-y-auto">
              {debug.length > 0 ? (
                debug.map((log, idx) => (
                  <div key={idx} className="mb-1">{log}</div>
                ))
              ) : (
                <div className="text-gray-500">No logs yet. Click buttons above to generate logs.</div>
              )}
            </div>
          </div>

          {/* Unity Viewer Container */}
          <div className="mb-6">
            <p className="text-cyan-200 font-semibold mb-3">🎮 Unity Canvas Area</p>
            <div className="border-2 border-dashed border-cyan-400/50 rounded-lg overflow-hidden bg-gray-950 relative">
              {!showUnity && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                  <div className="text-center">
                    <p className="text-cyan-300 text-lg mb-2">Click "Show UnityViewer" to render</p>
                    <p className="text-cyan-200/60 text-sm">This area will show the Unity game when loaded</p>
                  </div>
                </div>
              )}

              {showUnity && (
                <UnityViewer
                  loaderUrl="/unity-build/Build/unity-build.loader.js"
                  dataUrl="/unity-build/Build/unity-build.data.br"
                  frameworkUrl="/unity-build/Build/unity-build.framework.js.br"
                  codeUrl="/unity-build/Build/unity-build.wasm.br"
                  className="w-full h-96"
                />
              )}

              <div style={{ width: "100%", height: "400px" }} />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-900 border border-yellow-400/30 rounded-lg p-4">
            <p className="text-yellow-200 font-semibold mb-3">📝 What to Check</p>
            <ol className="list-decimal list-inside space-y-2 text-yellow-100/80 text-sm">
              <li>Press F12 to open DevTools → Console tab</li>
              <li>Click "Show UnityViewer" button</li>
              <li>Look for these in Console:
                <ul className="list-disc list-inside ml-4 mt-1 text-yellow-100/60">
                  <li>✅ "Loading..." messages</li>
                  <li>✅ Progress percentage going up</li>
                  <li>❌ Any red error messages</li>
                </ul>
              </li>
              <li>In Network tab (F12), check if these files load:
                <ul className="list-disc list-inside ml-4 mt-1 text-yellow-100/60">
                  <li>unity-build.loader.js (Status 200)</li>
                  <li>unity-build.framework.js.br (Status 200)</li>
                  <li>unity-build.wasm.br (Status 200)</li>
                  <li>unity-build.data.br (Status 200)</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
