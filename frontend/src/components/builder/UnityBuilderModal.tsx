import { useState, useEffect, useRef } from "react";
import { Loader2, Check, Camera, RotateCcw, X } from "lucide-react";
import { Button } from "../ui/button";

interface UnityBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidationComplete?: (result: any) => void;
}

export function UnityBuilderModal({ isOpen, onClose, onValidationComplete }: UnityBuilderModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [detectedParts, setDetectedParts] = useState<string[]>([]);
  const [buildComplete, setBuildComplete] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const requiredParts = ["panel1 (1)", "body (1)", "panel2 (1)"];

  useEffect(() => {
    if (!isOpen) return;

    // Listen for messages from Unity iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, partName } = event.data;

      if (type === 'UNITY_READY') {
        console.log('[React] Unity loaded in iframe');
        setIsLoaded(true);
      } else if (type === 'PART_DETECTED') {
        console.log(`[React] Part detected: ${partName}`);
        setDetectedParts(prev => {
          if (!prev.includes(partName)) {
            return [...prev, partName];
          }
          return prev;
        });
      } else if (type === 'BUILD_COMPLETE') {
        console.log('[React] Build complete');
        setBuildComplete(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen]);

  const validateWithGPT4o = async () => {
    if (!iframeRef.current) return;
    
    setValidating(true);
    
    try {
      // Get canvas from iframe
      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) throw new Error("Cannot access iframe content");

      const canvas = iframeDoc.getElementById('unity-canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas not found in iframe");

      const screenshot = canvas.toDataURL('image/png');
      const base64Image = screenshot.split(',')[1];

      const response = await fetch('http://localhost:5000/api/builder/validate-assembly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          component_type: 'satellite',
          detected_parts: detectedParts
        })
      });

      const result = await response.json();
      setValidationResult(result);
      onValidationComplete?.(result);

    } catch (error) {
      console.error("[Validation] Error:", error);
    } finally {
      setValidating(false);
    }
  };

  const resetBuild = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'RESET_BUILD'
      }, '*');
    }
    setDetectedParts([]);
    setBuildComplete(false);
    setValidationResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-purple-400/30 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-4 border-b border-purple-400/20">
          <div>
            <h2 className="text-2xl font-bold text-white">🛰️ Satellite Assembly</h2>
            <p className="text-sm text-purple-300">Click parts to assemble the satellite</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={resetBuild}
              disabled={!isLoaded}
              variant="outline"
              className="border-slate-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={validateWithGPT4o}
              disabled={!buildComplete || validating}
              className="bg-gradient-to-r from-cyan-600 to-blue-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              {validating ? "Validating..." : "Validate"}
            </Button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            src="/unity-loader.html"
            className="w-full h-full border-0"
            title="Unity Satellite Builder"
          />

          {isLoaded && (
            <div className="absolute right-4 top-4 w-64 bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30 pointer-events-auto">
              <h3 className="text-white font-bold mb-3">Required Parts</h3>
              <div className="space-y-2">
                {requiredParts.map(part => {
                  const isPlaced = detectedParts.includes(part);
                  return (
                    <div
                      key={part}
                      className={`flex items-center gap-2 text-sm ${
                        isPlaced ? "text-green-400" : "text-slate-400"
                      }`}
                    >
                      {isPlaced ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-slate-600 rounded" />
                      )}
                      <span>{part.replace(/ \(\d+\)/, "")}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{detectedParts.length}/{requiredParts.length}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all" 
                    style={{ width: `${(detectedParts.length / requiredParts.length) * 100}%` }}
                  />
                </div>
              </div>

              {buildComplete && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                  <p className="text-green-300 text-sm font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Complete!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {validationResult && (
          <div className="p-4 border-t border-purple-400/20 bg-slate-800/50 max-h-48 overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-2">GPT-4o Validation</h3>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">
              {validationResult.gpt4o_analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}