import { Unity, useUnityContext } from "react-unity-webgl";
import { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface UnityViewerProps {
  loaderUrl: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  className?: string;
  onError?: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function UnityViewer({
  loaderUrl,
  dataUrl,
  frameworkUrl,
  codeUrl,
  className = "w-full h-full",
  onError,
  onLoadingChange,
}: UnityViewerProps) {
  const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadingPercent = Math.round(loadingProgression * 100);

  useEffect(() => {
    console.log(`[UnityViewer] Initialized with loader: ${loaderUrl}`);
  }, [loaderUrl]);

  useEffect(() => {
    onLoadingChange?.(isLoaded);
  }, [isLoaded, onLoadingChange]);

  // Setup Unity Bridge - CORRECT VERSION
  useEffect(() => {
    console.log('[Unity Bridge] Setting up CORRECT bridge...');
    
    if ((window as any).unityBridgeInitialized) {
      console.log('[Unity Bridge] Bridge already initialized');
      return;
    }
    (window as any).unityBridgeInitialized = true;
    
    // CV Mode state
    (window as any).unityCVMode = false;
    
    // Function to toggle CV mode - called from React
    (window as any).setUnityCVMode = function(active: boolean) {
      (window as any).unityCVMode = active;
      console.log('[Unity Bridge] ✅ CV Mode set to:', active);
      
      // Update cursor
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        canvas.style.cursor = active ? 'crosshair' : 'default';
      }
      
      // Tell Unity C# to enable CV mode
      try {
        // TEMPORAIREMENT DÉSACTIVÉ - GameObject pas attaché dans Unity
        console.log('[Unity Bridge] ⚠️ Skipping SendMessage (GameObject not in scene yet)');
        
        /* RÉACTIVER APRÈS QUE COLLÈGUE FIXE UNITY
        if ((window as any).unityInstance) {
          (window as any).unityInstance.SendMessage(
            'ObjectClickDetector', 
            'SetCVMode', 
            active ? 'true' : 'false'
          );
          console.log('[Unity Bridge] ✅ Sent SetCVMode to Unity:', active);
        }
        */
      } catch (e) {
        console.warn('[Unity Bridge] Could not send to Unity:', e);
      }
      if (active && document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
    
    // Function called FROM Unity C# - receives object name
    (window as any).SendObjectToReact = function(objectName: string) {
      console.log('[Unity → React] Received object name:', objectName);
      
      // Trigger event for useUnityBridge hook
      if ((window as any).onUnityObjectClicked) {
        (window as any).onUnityObjectClicked(objectName);
      }
    };
    
    console.log('[Unity Bridge] ✅ Bridge functions registered');
    console.log('[Unity Bridge] - setUnityCVMode: React → Unity');
    console.log('[Unity Bridge] - SendObjectToReact: Unity → React');
    
    return () => {
      (window as any).unityBridgeInitialized = false;
    };
  }, []);

  // Store Unity instance for SendMessage calls
  useEffect(() => {
    if (isLoaded && unityProvider) {
      (window as any).unityInstance = {
        SendMessage: (gameObject: string, method: string, value: string) => {
          console.log(`[Unity Bridge] SendMessage: ${gameObject}.${method}(${value})`);
          sendMessage(gameObject, method, value);
        }
      };
      console.log('[Unity Bridge] ✅ Unity instance ready for communication');
    }
  }, [isLoaded, sendMessage, unityProvider]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded && loadingPercent < 100) {
        console.warn(`[UnityViewer] Loading timeout - still at ${loadingPercent}%`);
        const timeoutError = `Unity build failed to load (${loadingPercent}% complete). Check:
- Network connection
- Build files present in public/unity-build/Build/
- Browser console for detailed errors`;
        setLoadingTimeout(true);
        setLoadError(timeoutError);
        onError?.(timeoutError);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [isLoaded, loadingPercent, onError]);

  const getLoadingStage = (percent: number) => {
    if (percent < 10) return "Initializing engine...";
    if (percent < 30) return "Loading WebGL context...";
    if (percent < 50) return "Loading graphics pipeline...";
    if (percent < 70) return "Loading physics engine...";
    if (percent < 85) return "Loading assets and textures...";
    if (percent < 95) return "Initializing gameplay systems...";
    if (percent < 100) return "Finalizing startup...";
    return "Complete!";
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }} className={className}>
      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          visibility: isLoaded ? "visible" : "hidden",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
            <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse" />
          </div>

          <div className="relative z-10 text-center space-y-8 px-4">
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <Loader2 className="w-24 h-24 text-cyan-400 animate-spin" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs font-bold text-cyan-300">{loadingPercent}%</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Initializing Space Simulation</h2>
              <p className="text-sm text-slate-400">{getLoadingStage(loadingPercent)}</p>
            </div>

            <div className="w-48 mx-auto">
              <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${loadingPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{loadingPercent}% loaded</p>
            </div>

            <div className="text-xs text-slate-400 space-y-1 mt-6">
              <p>💡 This might take 30-60 seconds on first load</p>
              <p>📦 Downloading {(loadingPercent < 50 ? "graphics" : "assets")} data...</p>
            </div>
          </div>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 z-50">
          <div className="relative z-10 text-center space-y-6 px-4 max-w-md">
            <div className="flex justify-center">
              <AlertCircle className="w-16 h-16 text-red-400" strokeWidth={1.5} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Failed to Load</h2>
              <p className="text-sm text-slate-400 whitespace-pre-wrap">{loadError}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
            </div>

            <div className="text-xs text-slate-500 pt-4 border-t border-slate-700/50">
              <p>If the problem persists:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                <li>Check your internet connection</li>
                <li>Clear browser cache and try again</li>
                <li>Try a different browser</li>
                <li>Contact support if issue continues</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
