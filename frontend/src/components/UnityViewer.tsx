import { Unity, useUnityContext } from "react-unity-webgl";
import { useState, useEffect } from "react";

interface UnityViewerProps {
  loaderUrl: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  className?: string;
}

export function UnityViewer({
  loaderUrl,
  dataUrl,
  frameworkUrl,
  codeUrl,
  className = "w-full h-full",
}: UnityViewerProps) {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const loadingPercent = Math.round(loadingProgression * 100);

  useEffect(() => {
    console.log(`[UnityViewer] Initialized with loader: ${loaderUrl}`);
  }, [loaderUrl]);
  // Load Unity-React bridge script
// Inline Unity bridge (FIXED VERSION - no external file)
  // Inline Unity bridge - FIXED with MutationObserver
useEffect(() => {
  console.log('[Unity Bridge INLINE] Setting up bridge...');
  
  if ((window as any).unityBridgeInitialized) {
    console.log('[Unity Bridge INLINE] Bridge already initialized, skipping');
    return;
  }
  (window as any).unityBridgeInitialized = true;
  
  (window as any).unityCVMode = false;
  
  (window as any).setUnityCVMode = function(active: boolean) {
    (window as any).unityCVMode = active;
    console.log('[Unity Bridge INLINE] ✅ CV Mode set to:', active);
    
    // Update cursor immediately
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.style.cursor = active ? 'crosshair' : 'default';
      console.log('[Unity Bridge INLINE] 🎨 Cursor set to:', active ? 'crosshair' : 'default');
    }
    
    if (active && document.pointerLockElement) {
      document.exitPointerLock();
    }
  };
  
  console.log('[Unity Bridge INLINE] ✅ Functions registered');
  
  // Wait for canvas to appear in DOM
  const waitForCanvas = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    
    if (canvas) {
      console.log('[Unity Bridge INLINE] ✅ Canvas found!');
      console.log('[Unity Bridge INLINE] Canvas ID:', canvas.id);
      setupClickListener(canvas);
      return;
    }
    
    // Canvas not found yet, use MutationObserver
    console.log('[Unity Bridge INLINE] Canvas not found, observing DOM...');
    
    const observer = new MutationObserver((mutations) => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        console.log('[Unity Bridge INLINE] ✅ Canvas appeared!');
        observer.disconnect();
        setupClickListener(canvas);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Fallback timeout
    setTimeout(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        observer.disconnect();
        setupClickListener(canvas);
      } else {
        console.error('[Unity Bridge INLINE] ❌ Canvas never appeared');
      }
    }, 10000);
  };
  
  const setupClickListener = (canvas: HTMLCanvasElement) => {
    const handleClick = (event: MouseEvent) => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      
      if (!(window as any).unityCVMode) {
        return;
      }
      
      console.log('[Unity Bridge INLINE] 🖱️ CLICK at:', event.clientX, event.clientY);
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const relX = (x / rect.width) * 100;
      const relY = (y / rect.height) * 100;
      console.log('[Unity Bridge INLINE] 📍 Position:', relX.toFixed(1) + '%', relY.toFixed(1) + '%');
      console.log('[Unity Bridge INLINE] 🎯 CALIBRATION: Click to see which zone this activates');
      
      
      let objectName = 'Unknown';
      
      if (relX < 25 && relY > 20 && relY < 80) {
        objectName = 'Sun';
      } else if (relX > 55 && relX < 75 && relY > 35 && relY < 65) {
        objectName = 'Earth';
      } else if (relX > 40 && relX < 55 && relY > 40 && relY < 60) {
        objectName = 'Mars';
      } else if (relX > 70 && relX < 90 && relY > 30 && relY < 70) {
        objectName = 'Jupiter';
      } else if (relX > 85) {
        objectName = 'Saturn';
      }
      
      console.log('[Unity Bridge INLINE] 🎯 Detected:', objectName);
      
      if ((window as any).onUnityObjectClicked) {
        console.log('[Unity Bridge INLINE] 📤 Sending to React:', objectName);
        (window as any).onUnityObjectClicked(objectName);
      }
    };
    
    canvas.addEventListener('click', handleClick);
    console.log('[Unity Bridge INLINE] ✅ Click listener attached to canvas');
  };
  
  // Start waiting for canvas
  waitForCanvas();
  
  console.log('[Unity Bridge INLINE] ✅ Setup complete');
  
  return () => {
    (window as any).unityBridgeInitialized = false;
  };
}, []);

  useEffect(() => {
    console.log(`[UnityViewer] Progress: ${loadingPercent}%`);
  }, [loadingPercent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded && loadingPercent < 100) {
        console.warn(`[UnityViewer] Loading timeout - still at ${loadingPercent}%`);
        setLoadingTimeout(true);
      }
    }, 45000);
    return () => clearTimeout(timer);
  }, [isLoaded, loadingPercent]);

  const getLoadingStage = (percent: number) => {
    if (percent < 20) return "Initializing engine...";
    if (percent < 40) return "Loading graphics...";
    if (percent < 60) return "Loading physics...";
    if (percent < 80) return "Loading assets...";
    if (percent < 100) return "Finalizing...";
    return "Complete!";
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Unity canvas always rendered so it has real dimensions */}
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

      {/* Loading overlay shown until Unity is ready */}
      {!isLoaded && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(to bottom right, rgb(10, 5, 24), rgb(26, 26, 46))",
          zIndex: 10
        }}>
          <div style={{ textAlign: "center", maxWidth: "400px", padding: "24px" }}>
            <div style={{ marginBottom: "24px" }}>
              <div style={{
                width: "64px", height: "64px",
                border: "4px solid rgba(34, 211, 238, 0.3)",
                borderTop: "4px solid rgb(34, 211, 238)",
                borderRadius: "50%", margin: "0 auto",
                animation: "spin 1s linear infinite"
              }} />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#06b6d4", marginBottom: "8px" }}>
              Loading Environment
            </h2>
            <p style={{ color: "rgba(34, 211, 238, 0.7)", fontSize: "14px", marginBottom: "24px" }}>
              {getLoadingStage(loadingPercent)}
            </p>
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                width: "100%", height: "8px",
                background: "rgba(34, 211, 238, 0.2)", borderRadius: "9999px",
                border: "1px solid rgba(34, 211, 238, 0.3)", overflow: "hidden", marginBottom: "8px"
              }}>
                <div style={{
                  height: "100%",
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                  width: `${loadingPercent}%`, transition: "width 0.3s ease-in-out"
                }} />
              </div>
              <p style={{ color: "rgba(34, 211, 238, 0.8)", fontSize: "12px", fontFamily: "monospace" }}>
                {loadingPercent}%
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
              {["Graphics", "Physics", "Audio"].map((label, i) => {
                const threshold = [40, 60, 80][i];
                const active = loadingPercent >= threshold;
                return (
                  <div key={label} style={{
                    padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
                    border: active ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(107, 114, 128, 0.3)",
                    background: active ? "rgba(34, 197, 94, 0.2)" : "rgba(107, 114, 128, 0.2)",
                    color: active ? "#86efac" : "rgb(107, 114, 128)",
                  }}>
                    {active ? "✓" : "○"} {label}
                  </div>
                );
              })}
            </div>
            {loadingTimeout && (
              <div style={{
                background: "rgba(234, 179, 8, 0.2)", border: "1px solid rgba(234, 179, 8, 0.5)",
                borderRadius: "8px", padding: "16px", color: "#fef3c7", fontSize: "12px", marginTop: "16px"
              }}>
                <p style={{ fontWeight: "600", marginBottom: "8px" }}>⚠️ Taking longer than expected...</p>
                <p>Unity is initializing. Please wait...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
