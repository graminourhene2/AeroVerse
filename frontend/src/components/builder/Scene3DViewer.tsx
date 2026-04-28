import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════
interface Component3D {
  id: string;
  type: 'rocket_body' | 'nose_cone' | 'fins' | 'engine' | 'satellite_core' | 'solar_panel' | 'antenna';
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface Scene3DViewerProps {
  components: Component3D[];
  onComponentAdd?: (component: Component3D) => void;
  onComponentRemove?: (id: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D COMPONENT MODELS (Simple geometries for now - can be replaced with GLB models)
// ═══════════════════════════════════════════════════════════════════════════

function RocketBody({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
      <meshStandardMaterial color="#e0e0e0" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

function NoseCone({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.5, 1, 32]} />
      <meshStandardMaterial color="#ef5350" metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

function Fins({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 4 fins around the rocket */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh key={i} position={[Math.cos((angle * Math.PI) / 180) * 0.6, 0, Math.sin((angle * Math.PI) / 180) * 0.6]} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <boxGeometry args={[0.05, 0.8, 0.4]} />
          <meshStandardMaterial color="#90a4ae" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Engine({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animated flame effect
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.set(1, scale, 1);
    }
  });
  
  return (
    <group position={position}>
      {/* Engine bell */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.55, 0.6, 32]} />
        <meshStandardMaterial color="#37474f" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Flame (animated) */}
      <mesh ref={meshRef} position={[0, -0.4, 0]}>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ff6f00" emissive="#ff8f00" emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function SatelliteCore({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#546e7a" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

function SolarPanel({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={[0.05, 1.5, 2]} />
      <meshStandardMaterial color="#1a237e" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

function Antenna({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
        <meshStandardMaterial color="#90a4ae" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#29b6f6" emissive="#29b6f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT RENDERER
// ═══════════════════════════════════════════════════════════════════════════
function Component3DRenderer({ component }: { component: Component3D }) {
  switch (component.type) {
    case 'rocket_body':
      return <RocketBody position={component.position} />;
    case 'nose_cone':
      return <NoseCone position={component.position} />;
    case 'fins':
      return <Fins position={component.position} />;
    case 'engine':
      return <Engine position={component.position} />;
    case 'satellite_core':
      return <SatelliteCore position={component.position} />;
    case 'solar_panel':
      return <SolarPanel position={component.position} rotation={component.rotation} />;
    case 'antenna':
      return <Antenna position={component.position} />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCENE
// ═══════════════════════════════════════════════════════════════════════════
export function Scene3DViewer({ components, onComponentAdd, onComponentRemove }: Scene3DViewerProps) {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Canvas shadows>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[5, 4, 8]} fov={50} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          target={[0, 0, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#29b6f6" />

        {/* Grid */}
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#1e293b" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#334155" 
          fadeDistance={25} 
          fadeStrength={1}
          position={[0, -2, 0]}
        />

        {/* Platform */}
        <mesh receiveShadow position={[0, -1.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4, 64]} />
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Render all components */}
        {components.map((component) => (
          <group key={component.id}>
            <Component3DRenderer component={component} />
          </group>
        ))}

        {/* Stars background */}
        <mesh position={[0, 0, -20]}>
          <sphereGeometry args={[30, 32, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2">
        <p className="text-cyan-300 text-sm font-semibold">
          Components: {components.length}
        </p>
        <p className="text-white/50 text-xs mt-1">
          🖱️ Drag to rotate • Scroll to zoom
        </p>
      </div>

      {/* Instructions */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl px-8 py-6 max-w-md">
            <p className="text-cyan-300 text-lg font-bold mb-2">🚀 Start Building</p>
            <p className="text-white/60 text-sm">
              Click components from the library on the left to add them to your spacecraft
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Component Library Items (to be used in BuilderNew.tsx)
// ═══════════════════════════════════════════════════════════════════════════
export const BUILDABLE_COMPONENTS = [
  {
    id: 'rocket_body',
    type: 'rocket_body' as const,
    name: 'Rocket Body',
    category: 'Rocket Parts',
    description: 'Main cylindrical body of the rocket',
    icon: '🚀'
  },
  {
    id: 'nose_cone',
    type: 'nose_cone' as const,
    name: 'Nose Cone',
    category: 'Rocket Parts',
    description: 'Aerodynamic nose cone for the rocket',
    icon: '🔺'
  },
  {
    id: 'fins',
    type: 'fins' as const,
    name: 'Stabilizer Fins',
    category: 'Rocket Parts',
    description: 'Fins for stability during flight',
    icon: '📐'
  },
  {
    id: 'engine',
    type: 'engine' as const,
    name: 'Rocket Engine',
    category: 'Rocket Parts',
    description: 'Propulsion engine with animated thrust',
    icon: '🔥'
  },
  {
    id: 'satellite_core',
    type: 'satellite_core' as const,
    name: 'Satellite Core',
    category: 'Satellite Parts',
    description: 'Main body of the satellite',
    icon: '🛰️'
  },
  {
    id: 'solar_panel',
    type: 'solar_panel' as const,
    name: 'Solar Panel',
    category: 'Satellite Parts',
    description: 'Solar panel for power generation',
    icon: '⚡'
  },
  {
    id: 'antenna',
    type: 'antenna' as const,
    name: 'Communication Antenna',
    category: 'Satellite Parts',
    description: 'Antenna for communication',
    icon: '📡'
  }
];
