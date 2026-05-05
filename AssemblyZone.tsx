import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Camera, Download, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

interface PlacedComponent {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  imageUrl?: string;
  svg?: string;
}

export function AssemblyZone() {
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Listen for component additions from ComponentLibrary
  useEffect(() => {
    const handleAddComponent = (e: CustomEvent) => {
      const comp = e.detail;
      const newComponent: PlacedComponent = {
        id: `${comp.id}-${Date.now()}`,
        type: comp.id,
        name: comp.name,
        x: Math.random() * 60 + 20, // 20-80% range
        y: Math.random() * 60 + 20,
        imageUrl: comp.imageUrl,
        svg: comp.fallbackSVG
      };
      setComponents(prev => [...prev, newComponent]);
    };

    window.addEventListener('addComponent', handleAddComponent as EventListener);
    return () => window.removeEventListener('addComponent', handleAddComponent as EventListener);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, comp: PlacedComponent) => {
    e.preventDefault();
    setSelectedId(comp.id);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDragOffset({
        x: x - comp.x,
        y: y - comp.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x;
      const y = ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y;

      setComponents(prev => prev.map(comp =>
        comp.id === selectedId
          ? { ...comp, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
          : comp
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const clearAll = () => {
    setComponents([]);
    setSelectedId(null);
  };

  const captureCanvas = async () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#1a0b2e',
        scale: 2
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `spacecraft-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      console.log('Canvas captured successfully');
    } catch (error) {
      console.error('Failed to capture canvas:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">🚀 Assembly Zone</h2>
          <p className="text-purple-200/70">Drag components to build your spacecraft</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={clearAll}
            variant="outline"
            className="border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={captureCanvas}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card 
        ref={canvasRef}
        className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 p-8 min-h-[500px] relative overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Empty state */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="text-6xl mb-4 opacity-30">🛸</div>
            <p className="text-purple-200/50 text-lg">
              Click components in the library to add them here
            </p>
            <p className="text-purple-300/40 text-sm mt-2">
              Then drag to position them
            </p>
          </div>
        )}

        {/* Placed components */}
        {components.map((comp) => (
          <div
            key={comp.id}
            className={`absolute cursor-move transition-all ${
              selectedId === comp.id 
                ? 'ring-4 ring-yellow-400 scale-110 z-20' 
                : 'hover:scale-105 z-10'
            }`}
            style={{
              left: `${comp.x}%`,
              top: `${comp.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px'
            }}
            onMouseDown={(e) => handleMouseDown(e, comp)}
          >
            <div className="relative w-full h-full bg-purple-900/40 backdrop-blur-sm rounded-xl border-2 border-purple-400/30 hover:border-purple-400/60 p-2 shadow-xl">
              {/* Image or SVG */}
              <div className="w-full h-full flex items-center justify-center">
                {comp.imageUrl ? (
                  <img
                    src={comp.imageUrl}
                    alt={comp.name}
                    className="w-full h-full object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const svg = target.nextElementSibling as HTMLDivElement;
                      if (svg) svg.style.display = 'block';
                    }}
                  />
                ) : null}
                {comp.svg && (
                  <div 
                    className={comp.imageUrl ? 'hidden w-full h-full' : 'w-full h-full'}
                    dangerouslySetInnerHTML={{ __html: comp.svg }}
                  />
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeComponent(comp.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity shadow-lg z-30"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>

              {/* Label */}
              {selectedId === comp.id && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-purple-100 border border-purple-400/30">
                  {comp.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-purple-500/10 border-purple-400/20 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-200">{components.length}</div>
            <div className="text-sm text-purple-300/70">Components</div>
          </div>
        </Card>
        <Card className="bg-blue-500/10 border-blue-400/20 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-200">{(components.length * 1.2).toFixed(1)}t</div>
            <div className="text-sm text-blue-300/70">Est. Mass</div>
          </div>
        </Card>
        <Card className="bg-green-500/10 border-green-400/20 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">
              {components.length < 3 ? 'Simple' : components.length < 7 ? 'Medium' : 'Complex'}
            </div>
            <div className="text-sm text-green-300/70">Complexity</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
