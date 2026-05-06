import { Navigation } from "../Navigation";
import { UnityBuilderModal } from "../components/builder/UnityBuilderModal";
import { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, Save, Loader, AlertCircle, Download,
  Camera, X, CheckCircle, AlertTriangle, XCircle, ZapOff, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import { api } from "../api";
import html2canvas from "html2canvas";
import { Scene3DViewer, BUILDABLE_COMPONENTS } from "../components/builder/Scene3DViewer";

// ─────────────────────────────────────────────────────────────────────────────
// INLINE SVG RENDERS — no network requests, always display perfectly
// Each is a recognizable visual of the actual component
// ─────────────────────────────────────────────────────────────────────────────
const COMPONENT_SVG: Record<string, string> = {
  earth: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="eg" cx="35%" cy="35%"><stop offset="0%" stop-color="#6dd5fa"/><stop offset="100%" stop-color="#1a237e"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#eg)" stroke="#1565c0" stroke-width="1"/>
    <ellipse cx="38" cy="40" rx="14" ry="10" fill="#2e7d32" opacity="0.85"/>
    <ellipse cx="62" cy="44" rx="10" ry="14" fill="#388e3c" opacity="0.85"/>
    <ellipse cx="50" cy="62" rx="12" ry="8" fill="#2e7d32" opacity="0.75"/>
    <ellipse cx="30" cy="55" rx="7" ry="5" fill="#1b5e20" opacity="0.7"/>
    <ellipse cx="40" cy="32" rx="18" ry="5" fill="white" opacity="0.3"/>
    <ellipse cx="65" cy="58" rx="12" ry="4" fill="white" opacity="0.25"/>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
  </svg>`,

  Mars: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="mg" cx="35%" cy="35%"><stop offset="0%" stop-color="#ff7043"/><stop offset="100%" stop-color="#8d1c00"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#mg)" stroke="#bf360c" stroke-width="1"/>
    <ellipse cx="42" cy="38" rx="8" ry="6" fill="#6d1e00" opacity="0.5"/>
    <ellipse cx="60" cy="55" rx="6" ry="4" fill="#6d1e00" opacity="0.4"/>
    <ellipse cx="35" cy="60" rx="5" ry="3" fill="#6d1e00" opacity="0.35"/>
    <ellipse cx="50" cy="25" rx="20" ry="6" fill="#ffccbc" opacity="0.4"/>
    <ellipse cx="50" cy="72" rx="15" ry="4" fill="#ffccbc" opacity="0.35"/>
  </svg>`,

  Jupiter: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="jg" cx="35%" cy="35%"><stop offset="0%" stop-color="#ffe0b2"/><stop offset="100%" stop-color="#bf360c"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#jg)" stroke="#e65100" stroke-width="1"/>
    <rect x="4" y="30" width="92" height="7" fill="#d84315" opacity="0.5" rx="3"/>
    <rect x="4" y="42" width="92" height="5" fill="#795548" opacity="0.4" rx="2"/>
    <rect x="4" y="52" width="92" height="8" fill="#d84315" opacity="0.45" rx="3"/>
    <rect x="4" y="64" width="92" height="5" fill="#795548" opacity="0.35" rx="2"/>
    <ellipse cx="34" cy="56" rx="9" ry="6" fill="#bf360c" opacity="0.8" stroke="#ff7043" stroke-width="0.8"/>
    <ellipse cx="34" cy="56" rx="6" ry="4" fill="#e64a19" opacity="0.6"/>
  </svg>`,

  Saturn: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="sg" cx="35%" cy="35%"><stop offset="0%" stop-color="#fff9c4"/><stop offset="100%" stop-color="#f9a825"/></radialGradient></defs>
    <ellipse cx="60" cy="52" rx="55" ry="8" fill="none" stroke="#bcaaa4" stroke-width="5" opacity="0.5"/>
    <circle cx="60" cy="50" r="32" fill="url(#sg)" stroke="#f57f17" stroke-width="1"/>
    <rect x="28" y="42" width="64" height="5" fill="#f57f17" opacity="0.3" rx="2"/>
    <rect x="28" y="52" width="64" height="4" fill="#ef6c00" opacity="0.25" rx="2"/>
    <ellipse cx="60" cy="52" rx="55" ry="8" fill="none" stroke="#d7ccc8" stroke-width="2.5" opacity="0.4"/>
    <ellipse cx="60" cy="52" rx="48" ry="6" fill="none" stroke="#bcaaa4" stroke-width="1.5" opacity="0.35"/>
  </svg>`,

  Venus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="vg" cx="35%" cy="35%"><stop offset="0%" stop-color="#fff9c4"/><stop offset="100%" stop-color="#f57f17"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#vg)" stroke="#f9a825" stroke-width="1"/>
    <ellipse cx="40" cy="38" rx="20" ry="8" fill="#ffe082" opacity="0.5"/>
    <ellipse cx="58" cy="55" rx="16" ry="7" fill="#ffcc02" opacity="0.4"/>
    <ellipse cx="35" cy="62" rx="12" ry="5" fill="#ffd54f" opacity="0.35"/>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#fff9c4" stroke-width="1" opacity="0.3"/>
  </svg>`,

  Mercury: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="merg" cx="35%" cy="35%"><stop offset="0%" stop-color="#bdbdbd"/><stop offset="100%" stop-color="#37474f"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#merg)" stroke="#546e7a" stroke-width="1"/>
    <circle cx="35" cy="38" r="6" fill="#263238" opacity="0.6"/>
    <circle cx="62" cy="45" r="4" fill="#263238" opacity="0.5"/>
    <circle cx="44" cy="62" r="5" fill="#263238" opacity="0.55"/>
    <circle cx="68" cy="62" r="3" fill="#263238" opacity="0.45"/>
    <circle cx="30" cy="58" r="3" fill="#263238" opacity="0.4"/>
    <circle cx="55" cy="30" r="4" fill="#263238" opacity="0.5"/>
  </svg>`,

  Neptune: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="neg" cx="35%" cy="35%"><stop offset="0%" stop-color="#82b1ff"/><stop offset="100%" stop-color="#0d47a1"/></radialGradient></defs>
    <circle cx="50" cy="50" r="46" fill="url(#neg)" stroke="#1565c0" stroke-width="1"/>
    <rect x="4" y="36" width="92" height="6" fill="#1a237e" opacity="0.4" rx="3"/>
    <rect x="4" y="48" width="92" height="4" fill="#0d47a1" opacity="0.35" rx="2"/>
    <rect x="4" y="58" width="92" height="5" fill="#1a237e" opacity="0.3" rx="2"/>
    <ellipse cx="38" cy="52" rx="7" ry="5" fill="#0d47a1" opacity="0.7" stroke="#42a5f5" stroke-width="0.5"/>
  </svg>`,

  Uranus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="urg" cx="35%" cy="35%"><stop offset="0%" stop-color="#b2ebf2"/><stop offset="100%" stop-color="#00838f"/></radialGradient></defs>
    <ellipse cx="50" cy="50" rx="46" ry="35" fill="url(#urg)" stroke="#006064" stroke-width="1" transform="rotate(-15,50,50)"/>
    <ellipse cx="50" cy="50" rx="55" ry="8" fill="none" stroke="#80deea" stroke-width="2" opacity="0.4" transform="rotate(75,50,50)"/>
    <ellipse cx="50" cy="50" rx="50" ry="6" fill="none" stroke="#80deea" stroke-width="1" opacity="0.3" transform="rotate(75,50,50)"/>
  </svg>`,

  Eris: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="erisg" cx="35%" cy="35%"><stop offset="0%" stop-color="#e8eaf6"/><stop offset="100%" stop-color="#4a148c"/></radialGradient></defs>
    <circle cx="50" cy="50" r="38" fill="url(#erisg)" stroke="#7b1fa2" stroke-width="1"/>
    <circle cx="82" cy="28" r="10" fill="#7e57c2" opacity="0.7" stroke="#ce93d8" stroke-width="0.8"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#e1bee7" stroke-width="0.5" opacity="0.4"/>
  </svg>`,

  sun: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sugg" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff9c4"/><stop offset="60%" stop-color="#ff6f00"/><stop offset="100%" stop-color="#e65100" stop-opacity="0"/></radialGradient>
      <radialGradient id="suncore" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff176"/><stop offset="100%" stop-color="#ff8f00"/></radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#sugg)" opacity="0.4"/>
    <circle cx="50" cy="50" r="38" fill="url(#sugg)" opacity="0.3"/>
    <circle cx="50" cy="50" r="32" fill="url(#suncore)"/>
    <ellipse cx="40" cy="42" rx="8" ry="5" fill="#ff6f00" opacity="0.5"/>
    <ellipse cx="60" cy="58" rx="6" ry="4" fill="#ff6f00" opacity="0.45"/>
    <ellipse cx="50" cy="38" rx="5" ry="3" fill="#e65100" opacity="0.4"/>
  </svg>`,

  black_hole: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bhg" cx="50%" cy="50%"><stop offset="0%" stop-color="#000"/><stop offset="40%" stop-color="#000"/><stop offset="70%" stop-color="#7b1fa2" stop-opacity="0.8"/><stop offset="100%" stop-color="#ff6f00" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="#000"/>
    <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#ff8f00" stroke-width="4" opacity="0.7"/>
    <ellipse cx="50" cy="50" rx="42" ry="10" fill="none" stroke="#ff6f00" stroke-width="2" opacity="0.5"/>
    <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#ffd54f" stroke-width="1" opacity="0.4"/>
    <circle cx="50" cy="50" r="16" fill="url(#bhg)"/>
    <circle cx="50" cy="50" r="10" fill="#000"/>
  </svg>`,

  rocket: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#90a4ae"/><stop offset="50%" stop-color="#eceff1"/><stop offset="100%" stop-color="#90a4ae"/></linearGradient></defs>
    <polygon points="50,8 38,45 62,45" fill="#ef5350" stroke="#c62828" stroke-width="1"/>
    <rect x="36" y="44" width="28" height="55" fill="url(#rg)" rx="3" stroke="#546e7a" stroke-width="0.8"/>
    <rect x="42" y="52" width="16" height="12" fill="#29b6f6" opacity="0.8" rx="2"/>
    <rect x="42" y="68" width="16" height="5" fill="#546e7a" opacity="0.5" rx="1"/>
    <polygon points="36,80 22,100 36,96" fill="#90a4ae" stroke="#546e7a" stroke-width="0.5"/>
    <polygon points="64,80 78,100 64,96" fill="#90a4ae" stroke="#546e7a" stroke-width="0.5"/>
    <rect x="40" y="99" width="20" height="14" fill="#37474f" rx="2"/>
    <ellipse cx="50" cy="113" rx="10" ry="4" fill="#ff6f00" opacity="0.9"/>
    <ellipse cx="50" cy="118" rx="7" ry="8" fill="#ff8f00" opacity="0.6"/>
    <ellipse cx="50" cy="124" rx="4" ry="6" fill="#fff9c4" opacity="0.4"/>
  </svg>`,

  rocket_engine: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="reg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#78909c"/><stop offset="50%" stop-color="#cfd8dc"/><stop offset="100%" stop-color="#78909c"/></linearGradient></defs>
    <rect x="30" y="10" width="40" height="30" fill="url(#reg)" rx="4" stroke="#546e7a" stroke-width="1"/>
    <ellipse cx="50" cy="40" rx="22" ry="8" fill="#607d8b" stroke="#455a64" stroke-width="1"/>
    <path d="M28,40 Q20,65 15,90 L85,90 Q80,65 72,40 Z" fill="url(#reg)" stroke="#546e7a" stroke-width="1"/>
    <ellipse cx="50" cy="90" rx="35" ry="10" fill="#37474f" stroke="#263238" stroke-width="1"/>
    <circle cx="50" cy="25" rx="8" ry="8" fill="#37474f" stroke="#90a4ae" stroke-width="1"/>
    <circle cx="50" cy="25" r="4" fill="#29b6f6" opacity="0.8"/>
    <ellipse cx="50" cy="100" rx="25" ry="8" fill="#ff6f00" opacity="0.85"/>
    <ellipse cx="50" cy="108" rx="16" ry="8" fill="#ff8f00" opacity="0.6"/>
    <ellipse cx="50" cy="116" rx="8" ry="6" fill="#fff9c4" opacity="0.4"/>
  </svg>`,

  turbofan_engine: `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="teg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#546e7a"/><stop offset="50%" stop-color="#b0bec5"/><stop offset="100%" stop-color="#546e7a"/></linearGradient></defs>
    <ellipse cx="60" cy="50" rx="50" ry="40" fill="url(#teg)" stroke="#37474f" stroke-width="1.5"/>
    <ellipse cx="60" cy="50" rx="35" ry="27" fill="#455a64" stroke="#607d8b" stroke-width="1"/>
    <ellipse cx="60" cy="50" rx="18" ry="14" fill="#263238" stroke="#546e7a" stroke-width="1"/>
    <circle cx="60" cy="50" r="8" fill="#1565c0" stroke="#29b6f6" stroke-width="1"/>
    <line x1="60" y1="23" x2="60" y2="36" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="64" x2="60" y2="77" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>
    <line x1="33" y1="50" x2="42" y2="50" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>
    <line x1="78" y1="50" x2="87" y2="50" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>
    <line x1="41" y1="31" x2="47" y2="40" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="79" y1="31" x2="73" y2="40" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="41" y1="69" x2="47" y2="60" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="79" y1="69" x2="73" y2="60" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="108" y="40" width="10" height="20" fill="#455a64" rx="2" stroke="#607d8b" stroke-width="0.5"/>
    <ellipse cx="113" cy="50" rx="5" ry="7" fill="#ff6f00" opacity="0.7"/>
  </svg>`,

  satellite: `<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="spg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1565c0"/><stop offset="100%" stop-color="#0d47a1"/></linearGradient></defs>
    <rect x="5" y="30" width="45" height="28" fill="url(#spg)" rx="2" stroke="#42a5f5" stroke-width="0.8"/>
    <line x1="5" y1="38" x2="50" y2="38" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <line x1="5" y1="44" x2="50" y2="44" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <line x1="5" y1="50" x2="50" y2="50" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <rect x="90" y="30" width="45" height="28" fill="url(#spg)" rx="2" stroke="#42a5f5" stroke-width="0.8"/>
    <line x1="90" y1="38" x2="135" y2="38" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <line x1="90" y1="44" x2="135" y2="44" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <line x1="90" y1="50" x2="135" y2="50" stroke="#29b6f6" stroke-width="0.5" opacity="0.5"/>
    <line x1="50" y1="44" x2="60" y2="44" stroke="#90a4ae" stroke-width="2"/>
    <line x1="80" y1="44" x2="90" y2="44" stroke="#90a4ae" stroke-width="2"/>
    <rect x="58" y="34" width="24" height="20" fill="#455a64" rx="3" stroke="#78909c" stroke-width="1"/>
    <rect x="62" y="38" width="16" height="12" fill="#37474f" rx="2"/>
    <circle cx="70" cy="44" r="4" fill="#29b6f6" opacity="0.8"/>
    <line x1="70" y1="54" x2="70" y2="64" stroke="#90a4ae" stroke-width="1.5"/>
    <ellipse cx="70" cy="68" rx="10" ry="5" fill="none" stroke="#29b6f6" stroke-width="1.5" opacity="0.7"/>
  </svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Component definitions — each matches a CV training class
// ─────────────────────────────────────────────────────────────────────────────
interface SpaceComponent {
  id: string;
  name: string;
  category: "SPACECRAFT" | "PLANETS" | "PHENOMENA";
  description: string;
  specs: string[];
  glowColor: string;
  size: number; // canvas tile size in px
}

const SPACE_COMPONENTS: SpaceComponent[] = [
  // Spacecraft
  { id:"rocket",          name:"H70 Rocket",        category:"SPACECRAFT", description:"Heavy-lift launch vehicle, 70m tall with 9-engine cluster.", specs:["Height: 70m","Thrust: 7,600 kN","Payload: 22,800 kg","Engines: 9×Merlin"], glowColor:"#ff7043", size:90 },
  { id:"rocket_engine",   name:"Rocket Engine",      category:"SPACECRAFT", description:"LOX/RP-1 liquid engine with regenerative cooling and turbopump.", specs:["Thrust: 845 kN","Isp: 311s","T/W: 150:1","Turbopump: 2,500rpm"], glowColor:"#ef5350", size:80 },
  { id:"turbofan_engine", name:"Turbofan Engine",    category:"SPACECRAFT", description:"High-bypass turbofan for atmospheric flight and stage recovery.", specs:["Bypass: 12:1","Thrust: 320kN","OPR: 45:1","Fan: 2.8m"], glowColor:"#42a5f5", size:80 },
  { id:"satellite",       name:"Satellite",          category:"SPACECRAFT", description:"NASA-class spacecraft for communications and Earth observation.", specs:["Orbit: LEO/GEO","Power: 2-5kW","Mass: 500-6000kg","Life: 15yr"], glowColor:"#26c6da", size:80 },
  // Planets
  { id:"earth",    name:"Earth",    category:"PLANETS", description:"The Blue Marble — only known world with life, 71% ocean.",       specs:["Dia: 12,742km","1 AU from Sun","1 Moon","Age: 4.5Gyr"], glowColor:"#42a5f5", size:88 },
  { id:"Mars",     name:"Mars",     category:"PLANETS", description:"The Red Planet — largest volcano in solar system.",               specs:["Dia: 6,779km","Day: 24h37m","2 Moons","Gravity: 3.72m/s²"], glowColor:"#ef5350", size:82 },
  { id:"Jupiter",  name:"Jupiter",  category:"PLANETS", description:"Largest planet — Great Red Spot storm for 350+ years.",           specs:["Dia: 139,820km","95 Moons","Day: 9h56m","Mass: 318 Earths"], glowColor:"#ffa726", size:95 },
  { id:"Saturn",   name:"Saturn",   category:"PLANETS", description:"Iconic ring system — 282,000 km wide, only 10m thick.",           specs:["Dia: 116,460km","Ring: 282,000km","146 Moons","Density: 0.69"], size:100, glowColor:"#ffca28" },
  { id:"Venus",    name:"Venus",    category:"PLANETS", description:"Hottest planet at 465°C despite being farther from Sun.",         specs:["Dia: 12,104km","Temp: 465°C","92 atm","Day: 243 Earth days"], glowColor:"#ffd54f", size:82 },
  { id:"Mercury",  name:"Mercury",  category:"PLANETS", description:"Smallest & fastest planet — 600°C temperature swings.",          specs:["Dia: 4,879km","Day: 430°C","Night: -180°C","Year: 88 days"], glowColor:"#90a4ae", size:72 },
  { id:"Neptune",  name:"Neptune",  category:"PLANETS", description:"Ice giant — fastest winds at 2,100 km/h, 30 AU away.",           specs:["Dia: 49,244km","Wind: 2,100km/h","16 Moons","30 AU"], glowColor:"#42a5f5", size:86 },
  { id:"Uranus",   name:"Uranus",   category:"PLANETS", description:"Tilted ice giant — rotates on its side at 98° axial tilt.",      specs:["Dia: 50,724km","Tilt: 98°","28 Moons","13 Rings"], glowColor:"#80deea", size:86 },
  { id:"Eris",     name:"Eris",     category:"PLANETS", description:"Most massive dwarf planet — triggered Pluto's reclassification.", specs:["Dia: 2,326km","96 AU","559yr orbit","Moon: Dysnomia"], glowColor:"#ce93d8", size:70 },
  // Phenomena
  { id:"sun",        name:"The Sun",   category:"PHENOMENA", description:"Our star — fusing 600M tonnes of hydrogen per second.",         specs:["Dia: 1,391,000km","Surface: 5,778K","Core: 15M K","Age: 4.6Gyr"], glowColor:"#ffca28", size:92 },
  { id:"black_hole", name:"Black Hole",category:"PHENOMENA", description:"Spacetime singularity — nothing escapes beyond event horizon.", specs:["M87*: 6.5×10⁹M☉","Hawking temp: ~0K","Event horizon","Schw. radius"], glowColor:"#ce93d8", size:85 },
];

const CATEGORIES = {
  SPACECRAFT: { label: "Spacecraft & Engines", emoji: "🚀" },
  PLANETS:    { label: "Solar System Bodies",  emoji: "🌍" },
  PHENOMENA:  { label: "Space Phenomena",       emoji: "✨" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG Component Renderer
// ─────────────────────────────────────────────────────────────────────────────
function SpaceSVG({ id, size = 64, glow = false, glowColor = "#fff" }: {
  id: string; size?: number; glow?: boolean; glowColor?: string;
}) {
  const svg = COMPONENT_SVG[id];
  if (!svg) return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center bg-white/5 rounded-full">
      <span className="text-2xl">🌌</span>
    </div>
  );
  return (
    <div
      style={{
        width: size, height: size,
        filter: glow ? `drop-shadow(0 0 10px ${glowColor}99)` : undefined,
        flexShrink: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface BuildComponent { id: string; componentId: string; x: number; y: number; }
interface SavedSpacecraft { id: number; name: string; components: string[]; created_at: string; }
interface DiagnosisError { type: string; severity: string; description: string; solution: string; consequence?: string; }
interface DiagnosisResult {
  component_detected: string; confidence: number;
  status: "OK" | "WARNING" | "ERROR" | "CRITICAL";
  errors_found: DiagnosisError[]; overall_assessment: string; recommendations: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Diagnosis Panel
// ─────────────────────────────────────────────────────────────────────────────
function DiagnosisPanel({ result, onClose }: { result: DiagnosisResult; onClose: () => void }) {
  const cfg = ({
    OK:       { g:"from-emerald-900/70 to-emerald-950/70", b:"border-emerald-400/50", badge:"bg-emerald-500/20 text-emerald-300 border-emerald-400/40", icon:<CheckCircle className="w-5 h-5 text-emerald-400"/>,  label:"ALL SYSTEMS NOMINAL" },
    WARNING:  { g:"from-amber-900/70  to-amber-950/70",   b:"border-amber-400/50",   badge:"bg-amber-500/20  text-amber-300  border-amber-400/40",   icon:<AlertTriangle className="w-5 h-5 text-amber-400"/>,   label:"WARNING DETECTED"  },
    ERROR:    { g:"from-red-900/70    to-red-950/70",     b:"border-red-400/50",     badge:"bg-red-500/20    text-red-300    border-red-400/40",     icon:<XCircle className="w-5 h-5 text-red-400"/>,           label:"ERRORS FOUND"      },
    CRITICAL: { g:"from-rose-900/70   to-rose-950/70",    b:"border-rose-500/60",    badge:"bg-rose-500/20   text-rose-300   border-rose-400/40",    icon:<ZapOff className="w-5 h-5 text-rose-400"/>,           label:"CRITICAL FAILURE"  },
  } as any)[result.status] ?? { g:"from-amber-900/70 to-amber-950/70", b:"border-amber-400/50", badge:"bg-amber-500/20 text-amber-300 border-amber-400/40", icon:<AlertTriangle className="w-5 h-5 text-amber-400"/>, label:"DETECTED" };

  const comp = SPACE_COMPONENTS.find(c => c.id === result.component_detected || c.name === result.component_detected);
  const sevColor = (s: string) => s==="HIGH"||s==="CRITICAL" ? "text-red-400 bg-red-500/10 border-red-400/30" : s==="MEDIUM" ? "text-amber-400 bg-amber-500/10 border-amber-400/30" : "text-blue-400 bg-blue-500/10 border-blue-400/30";

  return (
    <div className={`bg-gradient-to-br ${cfg.g} backdrop-blur-xl rounded-2xl border ${cfg.b} p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {cfg.icon}
          <div>
            <h3 className="text-white font-bold text-base">🔬 CV Diagnosis Report</h3>
            <div className="flex items-center gap-2 mt-1">
              {comp && <SpaceSVG id={comp.id} size={28} glow glowColor={comp.glowColor}/>}
              <p className="text-white/50 text-xs">
                <span className="text-white/80 font-semibold">{result.component_detected}</span>
                {" · "}{(result.confidence*100).toFixed(0)}% confidence
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4 text-white/40"/></button>
        </div>
      </div>

      {result.overall_assessment && (
        <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/75 text-sm leading-relaxed">{result.overall_assessment}</p>
        </div>
      )}

      {result.errors_found?.length > 0 && (
        <div className="mb-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">⚠ Issues ({result.errors_found.length})</p>
          {result.errors_found.map((e, i) => (
            <div key={i} className="p-3 bg-black/25 rounded-xl border border-white/10 mb-2">
              <div className="flex justify-between mb-1.5">
                <p className="text-white font-semibold text-sm">{e.type.replace(/_/g," ").toUpperCase()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${sevColor(e.severity)}`}>{e.severity}</span>
              </div>
              <p className="text-white/55 text-xs mb-1">{e.description}</p>
              {e.consequence && <p className="text-rose-300/60 text-xs mb-1">⚡ {e.consequence}</p>}
              <div className="flex gap-2 pt-2 border-t border-white/10 mt-1">
                <span className="text-emerald-400 text-xs font-bold shrink-0">✓ FIX:</span>
                <p className="text-emerald-300/75 text-xs">{e.solution}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">💡 Recommendations</p>
          <ul className="space-y-1">
            {result.recommendations.map((r,i) => (
              <li key={i} className="flex gap-2 text-xs text-white/55">
                <span className="text-purple-400 shrink-0">→</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export function BuilderNew() {
  const [buildArea, setBuildArea]             = useState<BuildComponent[]>([]);
  const [selected, setSelected]               = useState<string | null>(null);
  const [projectName, setProjectName]         = useState("My Mission");
  const [savedBuilds, setSavedBuilds]         = useState<SavedSpacecraft[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [error, setError]                     = useState("");
  const [activeCategory, setActiveCategory]   = useState<string>("PLANETS");
  const [diagnosing, setDiagnosing]           = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisError, setDiagnosisError]   = useState("");
  const [capturedImage, setCapturedImage]     = useState<string | null>(null);
  const [incoming, setIncoming]               = useState<{ id: string; name: string }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const CV_BACKEND = "http://localhost:5000";
    // 3D viewer state
  const [components3D, setComponents3D] = useState<any[]>([]);
  const [view3D, setView3D] = useState(false);
  const [showUnityBuilder, setShowUnityBuilder] = useState(false);
  useEffect(() => {
    const raw = sessionStorage.getItem("pendingBuilderComponents");
    if (raw) {
      try { const p = JSON.parse(raw); if (p.length) { setIncoming(p); sessionStorage.removeItem("pendingBuilderComponents"); } } catch(_) {}
    }
  }, []);
  useEffect(() => { if (api.isAuthenticated()) loadSavedBuilds(); }, []);

  const loadSavedBuilds = async () => {
    try { 
      setLoading(true); 
      const data = await api.getSpacecrafts();
      setSavedBuilds(Array.isArray(data) ? data : []); // ✅ Sécurisé
    }
    catch (err) { 
      console.error("Load error:", err);
      setError("Could not load saved missions"); 
      setSavedBuilds([]); // ✅ Reset sur []
    }
    finally { setLoading(false); }
  };

  const addComponent = (componentId: string) => {
    const newId = `${componentId}-${Date.now()}`;
    
    // Add to 2D canvas
    setBuildArea(p => [...p, {
      id: newId,
      componentId,
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 70,
    }]);
    
    // ALSO add to 3D viewer
    const buildable = BUILDABLE_COMPONENTS.find(b => b.id === componentId || b.type === componentId);
    if (buildable) {
      const new3DComponent = {
        id: newId,
        type: buildable.type,
        position: [
          (Math.random() - 0.5) * 3, // x: -1.5 to 1.5
          Math.random() * 2,          // y: 0 to 2
          (Math.random() - 0.5) * 3   // z: -1.5 to 1.5
        ] as [number, number, number],
      };
      setComponents3D(prev => [...prev, new3DComponent]);
    }
  };

  const acceptIncoming = (comp: { id: string; name: string }, idx: number) => {
    const match = SPACE_COMPONENTS.find(c => c.id === comp.id || c.id === comp.name || c.name === comp.name);
    addComponent(match?.id ?? "satellite");
    setIncoming(p => p.filter((_,i) => i !== idx));
  };

  const removeSelected = () => {
    if (!selected) return;
    setBuildArea(p => p.filter(c => c.id !== selected));
    setSelected(null);
  };

  const saveProject = async () => {
    if (!projectName.trim()) { setError("Give your mission a name"); return; }
    if (buildArea.length === 0) { setError("Add at least one component"); return; }
    if (!api.isAuthenticated()) { setError("Please sign in to save"); return; }
    try {
      setSaving(true); setError("");
      await api.saveSpacecraft({ name: projectName, components: buildArea.map(c => c.componentId) });
      await loadSavedBuilds(); setBuildArea([]); setProjectName("My Mission");
    } catch (err: any) { setError(err.message || "Save error"); }
    finally { setSaving(false); }
  };

  const deleteSpacecraft = async (id: number) => {
    if (!confirm("Delete this mission?")) return;
    try { await api.deleteSpacecraft(id); await loadSavedBuilds(); } catch { alert("Delete error"); }
  };

  const loadSpacecraft = (s: SavedSpacecraft) => {
    setBuildArea(s.components.map((cid,i) => ({
      id: `${cid}-${i}`, componentId: cid,
      x: 10 + (i % 4) * 22, y: 10 + Math.floor(i/4) * 28,
    })));
    setProjectName(s.name);
  };

  const captureAndDiagnose = async () => {
    if (buildArea.length === 0) { setDiagnosisError("Add components to the canvas first!"); return; }
    try {
      setDiagnosing(true); setDiagnosisResult(null); setDiagnosisError(""); setCapturedImage(null);
      if (!canvasRef.current) throw new Error("Canvas not found");

      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#06040f", scale: 2, useCORS: true, logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      const res = await fetch(`${CV_BACKEND}/api/cv/diagnose`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl.split(",")[1], format: "png" }),
      });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || `Error ${res.status}`); }
      setDiagnosisResult(await res.json());
    } catch(err:any) {
      setDiagnosisError(err.message.includes("Failed to fetch")
        ? "❌ CV backend not running. Start it: cd computer-vision/backend && python aeroverse_app.py"
        : `❌ ${err.message}`);
    } finally { setDiagnosing(false); }
  };

  const clearAll = () => {
    setBuildArea([]); setSelected(null); setProjectName("My Mission");
    setDiagnosisResult(null); setDiagnosisError(""); setCapturedImage(null);
  };

  const visibleComponents = SPACE_COMPONENTS.filter(c => c.category === activeCategory);
  const selectedComp = selected ? SPACE_COMPONENTS.find(c => c.id === buildArea.find(b => b.id === selected)?.componentId) : null;

  return (
    <div className="min-h-screen bg-[#06040f]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <Navigation />
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-[1600px] mx-auto">

          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 bg-clip-text text-transparent">
                🛸 Mission Builder
              </h1>
              <p className="text-purple-200/40 text-sm">{SPACE_COMPONENTS.length} Unity assets · drag freely on canvas · CV-matched</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2"/>Clear
              </Button>
              <Button 
                onClick={() => setShowUnityBuilder(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                🛰️ Unity Builder
              </Button>
              <Button onClick={saveProject} disabled={saving} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Save className="w-4 h-4 mr-2"/>{saving ? "Saving..." : "Save Mission"}
              </Button>
              <Button 
                onClick={() => setView3D(!view3D)} 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
              >
                {view3D ? "📋 2D View" : "🎮 3D View"}
              </Button>
            </div>
          </div>

          {/* Incoming from Simulation */}
          {incoming.length > 0 && (
            <div className="mb-4 p-4 bg-cyan-900/20 border border-cyan-400/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-cyan-400"/><p className="text-cyan-200 font-bold text-sm">🔬 Identified in Simulation — add to canvas?</p></div>
              <div className="flex flex-wrap gap-2">
                {incoming.map((comp, i) => {
                  const data = SPACE_COMPONENTS.find(c => c.id === comp.id || c.name === comp.name);
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
                      {data && <SpaceSVG id={data.id} size={28} glow glowColor={data.glowColor}/>}
                      <span className="text-cyan-100 text-sm font-semibold">{comp.name}</span>
                      <button onClick={() => acceptIncoming(comp, i)} className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg font-bold">+ Add</button>
                      <button onClick={() => setIncoming(p=>p.filter((_,j)=>j!==i))} className="text-white/30 hover:text-white/60"><X className="w-3 h-3"/></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-500/15 border border-red-400/30 rounded-xl flex gap-3"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/><p className="text-red-200 text-sm">{error}</p></div>}

          <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4">

            {/* ── Sidebar ── */}
            <div className="flex flex-col gap-3">
              {/* Category tabs */}
              <div className="bg-[#0c0a1e] rounded-2xl border border-purple-400/15 p-3">
                <p className="text-purple-300/30 text-xs uppercase tracking-widest font-semibold mb-3">
                  {view3D ? "🔧 Buildable Parts" : "Component Library"}
                </p>
                
                {!view3D && (
                  <div className="space-y-1">
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <button key={key} onClick={() => setActiveCategory(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          activeCategory === key
                            ? "bg-purple-500/20 text-white border border-purple-400/25"
                            : "text-purple-300/40 hover:bg-purple-500/10 hover:text-purple-200"
                        }`}>
                        <span>{cat.emoji}</span>
                        <span className="flex-1 text-left text-xs">{cat.label}</span>
                        <span className="text-xs text-purple-400/40">{SPACE_COMPONENTS.filter(c=>c.category===key).length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Component list */}
              <div className="bg-[#0c0a1e] rounded-2xl border border-purple-400/15 p-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {view3D ? (
                  /* ══════════ 3D MODE: Buildable Components ══════════ */
                  <div className="space-y-4">
                    {['Rocket Parts', 'Satellite Parts'].map(category => {
                      const parts = BUILDABLE_COMPONENTS.filter(c => c.category === category);
                      return (
                        <div key={category}>
                          <h3 className="text-cyan-300 text-xs font-bold mb-2 uppercase tracking-wider">{category}</h3>
                          <div className="space-y-2">
                            {parts.map(comp => (
                              <button
                                key={comp.id}
                                onClick={() => addComponent(comp.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/15 transition-all group text-left"
                              >
                                <div className="text-3xl group-hover:scale-110 transition-transform">{comp.icon}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white group-hover:text-cyan-200">{comp.name}</p>
                                  <p className="text-xs text-cyan-300/50 truncate mt-0.5">{comp.description}</p>
                                </div>
                                <Plus className="w-4 h-4 text-cyan-400/40 group-hover:text-cyan-400 shrink-0"/>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* ══════════ 2D MODE: Original Components ══════════ */
                  <div className="space-y-2">
                    {visibleComponents.map(comp => (
                      <button key={comp.id} onClick={() => addComponent(comp.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/5 hover:border-white/15 bg-white/2 hover:bg-white/5 transition-all group text-left">
                        <SpaceSVG id={comp.id} size={44} glow glowColor={comp.glowColor}/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white/80 group-hover:text-white truncate">{comp.name}</p>
                          <p className="text-xs text-white/30 truncate mt-0.5">{comp.description.slice(0,42)}…</p>
                        </div>
                        <Plus className="w-4 h-4 text-white/20 group-hover:text-white/60 shrink-0"/>
                      </button>
                    ))}
                  </div>
                )}
              </div>
</div>
            {/* ── Right side ── */}
            <div className="space-y-4">

              {/* Mission name */}
              <div className="bg-[#0c0a1e] rounded-2xl border border-purple-400/15 p-4 flex items-center gap-4">
                <label className="text-purple-200/40 text-sm font-semibold shrink-0">📝 Mission</label>
                <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="flex-1 bg-white/5 border border-purple-400/15 rounded-lg px-4 py-2 text-white placeholder:text-purple-300/20 focus:outline-none focus:border-purple-400/40"
                  placeholder="Apollo XV · Mars Survey · Deep Space Probe..."/>
              </div>

              {/* ── Open Space Canvas — NO boxes, free floating SVGs ── */}
              {/* ── Canvas: 2D or 3D View ── */}
              <div 
                ref={canvasRef}
                className="rounded-2xl border border-purple-400/10 relative overflow-hidden"
                style={{ minHeight: 520 }}
              >
                {view3D ? (
                  /* ════════ 3D VIEWER ════════ */
                  <Scene3DViewer 
                    components={components3D}
                    onComponentAdd={(comp) => setComponents3D(prev => [...prev, comp])}
                    onComponentRemove={(id) => setComponents3D(prev => prev.filter(c => c.id !== id))}
                  />
                ) : (
                  /* ════════ 2D CANVAS (ORIGINAL) ════════ */
                  <div 
                    className="relative"
                    style={{
                      minHeight: 520,
                      background: "radial-gradient(ellipse at 50% 0%, #100830 0%, #06040f 75%)",
                    }}
                  >
                    {/* Stars */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(50)].map((_, i) => (
                        <div key={i} className="absolute bg-white rounded-full"
                          style={{
                            width: Math.random()>0.9?2:1,
                            height: Math.random()>0.9?2:1,
                            left: `${Math.random()*100}%`,
                            top: `${Math.random()*100}%`,
                            opacity: Math.random()*0.7+0.05,
                          }}/>
                      ))}
                    </div>

                    {/* Canvas label */}
                    <div className="absolute top-3 left-4 z-10 pointer-events-none">
                      <span className="text-purple-300/15 text-xs font-mono uppercase tracking-widest">{projectName}</span>
                    </div>

                    {buildArea.length === 0 ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                        <div className="flex gap-4 opacity-20">
                          {["earth","Saturn","rocket","sun"].map(id => <SpaceSVG key={id} id={id} size={48}/>)}
                        </div>
                        <p className="text-purple-200/25 text-sm font-medium">
                          Add components from the library to build your mission
                        </p>
                      </div>
                    ) : (
                      <div className="relative" style={{ height: 520 }}>
                        {buildArea.map(item => {
                          const comp = SPACE_COMPONENTS.find(c => c.id === item.componentId);
                          if (!comp) return null;
                          return (
                            <div key={item.id}
                              onClick={() => setSelected(item.id === selected ? null : item.id)}
                              draggable
                              onDragEnd={e => {
                                const rect = canvasRef.current?.getBoundingClientRect();
                                if (rect) {
                                  const nx = ((e.clientX - rect.left) / rect.width) * 100;
                                  const ny = ((e.clientY - rect.top) / rect.height) * 100;
                                  setBuildArea(p => p.map(c => c.id===item.id ? {...c, x:Math.max(3,Math.min(93,nx)), y:Math.max(3,Math.min(90,ny))} : c));
                                }
                              }}
                              className={`absolute cursor-move transition-transform hover:scale-110 ${selected===item.id?"ring-2 ring-purple-400 rounded-full":""}`}
                              style={{ left:`${item.x}%`, top:`${item.y}%`, transform:"translate(-50%,-50%)" }}>
                              <SpaceSVG id={comp.id} size={comp.size} glow={selected===item.id} glowColor={comp.glowColor}/>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Diagnose button */}
              <div className="flex gap-3">
                <Button onClick={captureAndDiagnose} disabled={diagnosing}
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white flex-1 rounded-xl font-semibold py-3">
                  {diagnosing
                    ? <><Loader className="w-4 h-4 mr-2 animate-spin"/>Analyzing with GPT-4o Vision...</>
                    : <><Camera className="w-4 h-4 mr-2"/>📸 Capture & Diagnose with CV</>}
                </Button>
              </div>

              {diagnosisError && <div className="p-3 bg-red-500/15 border border-red-400/25 rounded-xl flex gap-3"><AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/><p className="text-red-200 text-sm">{diagnosisError}</p></div>}
              {diagnosing && <div className="bg-cyan-900/20 border border-cyan-400/20 rounded-xl p-4 flex gap-4 items-center"><Loader className="w-5 h-5 text-cyan-400 animate-spin shrink-0"/><div><p className="text-cyan-100 font-semibold text-sm">GPT-4o Vision analyzing your space scene...</p><p className="text-cyan-300/40 text-xs">Accurately identifies components from visual content</p></div></div>}
              {capturedImage && !diagnosing && <div className="bg-[#0c0a1e] border border-white/8 rounded-xl p-3"><p className="text-white/20 text-xs uppercase tracking-widest mb-2">📷 Captured</p><img src={capturedImage} className="w-full max-h-28 object-contain rounded-lg" alt="capture"/></div>}
              {diagnosisResult && !diagnosing && <DiagnosisPanel result={diagnosisResult} onClose={() => {setDiagnosisResult(null); setCapturedImage(null);}}/>}

              {/* Selected component detail panel */}
              {selected && selectedComp && (
                <div className="bg-[#0c0a1e] rounded-2xl border border-white/8 p-4 flex items-start gap-4"
                  style={{ boxShadow: `0 0 25px ${selectedComp.glowColor}22` }}>
                  <SpaceSVG id={selectedComp.id} size={72} glow glowColor={selectedComp.glowColor}/>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white font-bold text-base">{selectedComp.name}</h3>
                      <button onClick={removeSelected} className="p-1.5 bg-red-500/15 hover:bg-red-500/25 rounded-lg"><Trash2 className="w-4 h-4 text-red-400"/></button>
                    </div>
                    <p className="text-white/40 text-xs mb-2">CV class: <span className="text-white/60">{selectedComp.id}</span></p>
                    <p className="text-white/50 text-xs leading-relaxed mb-2">{selectedComp.description}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {selectedComp.specs.map((s,i) => <div key={i} className="text-xs bg-white/5 rounded px-2 py-1 text-white/35">{s}</div>)}
                    </div>
                  </div>
                </div>
              )}

              {/* Saved missions */}
              {api.isAuthenticated() && (
                <div className="bg-[#0c0a1e] rounded-2xl border border-green-400/15 p-5">
                  <h3 className="text-base font-semibold text-green-100 mb-4">🚀 Saved Missions</h3>
                  {loading ? <Loader className="w-5 h-5 text-green-400 animate-spin"/>
                    : savedBuilds.length===0 ? <p className="text-green-300/25 text-sm">No saved missions yet</p>
                    : (
                    <div className="space-y-2">
                      {savedBuilds?.map(build => (
                        <div key={build.id} className="flex items-center p-3 bg-green-500/5 border border-green-400/12 rounded-xl hover:bg-green-500/10 transition-all">
                          <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={() => loadSpacecraft(build)}>
                            <div className="flex gap-1">
                              {build.components.slice(0,3).map((cid,i) => <SpaceSVG key={i} id={cid} size={24}/>)}
                            </div>
                            <div>
                              <p className="font-semibold text-green-100 text-sm">{build.name}</p>
                              <p className="text-xs text-green-300/30">{build.components.length} components · {new Date(build.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => loadSpacecraft(build)} size="sm" className="bg-green-700 hover:bg-green-600 text-white text-xs"><Download className="w-3 h-3 mr-1"/>Load</Button>
                            <button onClick={() => deleteSpacecraft(build.id)} className="p-2 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UnityBuilderModal 
        isOpen={showUnityBuilder}
        onClose={() => setShowUnityBuilder(false)}
        onValidationComplete={(result) => {
          console.log("Unity validation:", result);
        }}
      />
    </div>
  );
}
