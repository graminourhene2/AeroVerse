/**
 * Unity Object Name → Backend Component ID Mapper
 * Maps exact Unity GameObject names to backend component IDs
 * 
 * IMPORTANT: Unity names must match EXACTLY (case-sensitive)
 */
const UNITY_NAME_MAP: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════════
  // PLANETS & CELESTIAL BODIES
  // ═══════════════════════════════════════════════════════════════
  'Sun': 'sun', 'sun': 'sun', 'SUN': 'sun',
  'Mercury': 'mercury', 'mercury': 'mercury', 'MERCURY': 'mercury',
  'Venus': 'venus', 'venus': 'venus', 'VENUS': 'venus',
  'Earth': 'earth', 'earth': 'earth', 'EARTH': 'earth',
  'Mars': 'mars', 'mars': 'mars', 'MARS': 'mars',
  'Jupiter': 'jupiter', 'jupiter': 'jupiter', 'JUPITER': 'jupiter',
  'Saturn': 'saturn', 'saturn': 'saturn', 'SATURN': 'saturn',
  'Uranus': 'uranus', 'uranus': 'uranus', 'URANUS': 'uranus',
  'Neptune': 'neptune', 'neptune': 'neptune', 'NEPTUNE': 'neptune',
  'Moon': 'moon', 'moon': 'moon', 'MOON': 'moon',
  
  // ═══════════════════════════════════════════════════════════════
  // DEEP SPACE OBJECTS
  // ═══════════════════════════════════════════════════════════════
  'Nebula_01': 'orion_nebula',
  'nebula_01': 'orion_nebula',
  'Orion Nebula': 'orion_nebula',
  'orion_nebula': 'orion_nebula',
  
  'MegaBlackHole': 'black_hole',
  'megablackhole': 'black_hole',
  'Black Hole': 'black_hole',
  'black_hole': 'black_hole',
  
  'blue_dwarf_star_spitting_out_energy_pulsar': 'pulsar',
  'pulsar': 'pulsar',
  'Pulsar': 'pulsar',
  
  // ═══════════════════════════════════════════════════════════════
  // ASTEROIDS & SMALL BODIES
  // ═══════════════════════════════════════════════════════════════
  'asteroid_ceres': 'ceres',
  'asteroid_ceres (1)': 'ceres',
  'asteroid_ceres (3)': 'ceres',
  'ceres': 'ceres',
  'Ceres': 'ceres',
  
  'meteoroid': 'meteoroid',
  'Meteoroid': 'meteoroid',
  
  'asteroid_low_poly': 'asteroid',
  'asteroid_low_poly (1)': 'asteroid',
  'asteroid_low_poly (2)': 'asteroid',
  'asteroid_low_poly (3)': 'asteroid',
  'asteroid_low_poly (4)': 'asteroid',
  'asteroid_low_poly (5)': 'asteroid',
  'asteroid_low_poly (6)': 'asteroid',
  
  // ═══════════════════════════════════════════════════════════════
  // SPACECRAFTS & VEHICLES
  // ═══════════════════════════════════════════════════════════════
  
  // Agena Target Vehicle
  'Agena Target Vehicle': 'agena_target_vehicle',
  'agena_target_vehicle': 'agena_target_vehicle',
  'Agena': 'agena_target_vehicle',
  
  // Gateway Core (Lunar Gateway)
  'Gateway Core': 'lunar_gateway',
  'GatewayCore': 'lunar_gateway',
  'gateway_core': 'lunar_gateway',
  'Lunar Gateway': 'lunar_gateway',
  'lunar_gateway': 'lunar_gateway',
  
  // Space Cargo Transporter (Progress MS)
  'space_cargo_transporter': 'progress_ms',
  'Space Cargo Transporter': 'progress_ms',
  'Progress MS': 'progress_ms',
  'progress_ms': 'progress_ms',
  
  // Generic Satellite
  'sat05_satellite': 'satellite_generic',
  'satellite': 'satellite_generic',
  'Satellite': 'satellite_generic',
  
  // ═══════════════════════════════════════════════════════════════
  // SPACE STATIONS
  // ═══════════════════════════════════════════════════════════════
  
  // International Space Station
  'iss_stationary (3)': 'iss',
  'iss_stationary': 'iss',
  'ISS': 'iss',
  'iss': 'iss',
  'International Space Station': 'iss',
  
  // ═══════════════════════════════════════════════════════════════
  // SATELLITES (Scientific)
  // ═══════════════════════════════════════════════════════════════
  
  // ACRIMSAT
  'Active Cavity Irradiance Monitor Satellite (AcrimSAT) (B)': 'acrimsat',
  'ACRIMSAT': 'acrimsat',
  'AcrimSAT': 'acrimsat',
  'acrimsat': 'acrimsat',
  
  // Landsat
  'Landsat 1, 2, and 3': 'landsat',
  'Landsat': 'landsat',
  'landsat': 'landsat',
  
  // ═══════════════════════════════════════════════════════════════
  // GROUND STATIONS & ANTENNAS
  // ═══════════════════════════════════════════════════════════════
  
  // Deep Space Network Antenna (70 meter dish)
  '70 meter dish': 'dsn_antenna',
  '70meterdish': 'dsn_antenna',
  '70_meter_dish': 'dsn_antenna',
  'DSN Antenna': 'dsn_antenna',
  'dsn_antenna': 'dsn_antenna',
  
  // ═══════════════════════════════════════════════════════════════
  // HUMANS & CHARACTERS
  // ═══════════════════════════════════════════════════════════════
  
  'Walking astronaut': 'astronaut',
  'walking_astronaut': 'astronaut',
  'Astronaut': 'astronaut',
  'astronaut': 'astronaut',
};

/**
 * Maps Unity GameObject name to backend component ID
 * @param unityName - Name of GameObject from Unity (case-insensitive fallback)
 * @returns Backend component ID or 'unknown'
 */
export function mapUnityNameToComponentId(unityName: string | null | undefined): string {
  if (!unityName) {
    console.warn('[Mapper] ⚠️ Received null/undefined Unity name');
    return 'unknown';
  }
  
  const trimmed = unityName.trim();
  
  // Try exact match first (case-sensitive)
  let mapped = UNITY_NAME_MAP[trimmed];
  
  // Try lowercase match if exact fails
  if (!mapped) {
    mapped = UNITY_NAME_MAP[trimmed.toLowerCase()];
  }
  
  if (mapped) {
    console.log(`[Mapper] ✅ Mapped: "${trimmed}" → "${mapped}"`);
    return mapped;
  }
  
  // Not found
  console.warn(`[Mapper] ❌ No mapping for: "${trimmed}"`);
  console.warn(`[Mapper] 💡 Add this line to UNITY_NAME_MAP:`);
  console.warn(`    '${trimmed}': 'your_component_id',`);
  return 'unknown';
}

/**
 * Get all mapped Unity names (for debugging)
 */
export function getAllMappedUnityNames(): string[] {
  return Object.keys(UNITY_NAME_MAP);
}

/**
 * Check if a Unity name has a mapping
 */
export function hasMappingFor(unityName: string): boolean {
  if (!unityName) return false;
  const trimmed = unityName.trim();
  return !!UNITY_NAME_MAP[trimmed] || !!UNITY_NAME_MAP[trimmed.toLowerCase()];
}

/**
 * Debug: Print all mappings to console
 */
export function debugPrintAllMappings(): void {
  console.log('[Mapper] 📋 All Unity → Backend mappings:');
  const uniqueMappings = new Set(Object.values(UNITY_NAME_MAP));
  uniqueMappings.forEach(componentId => {
    const unityNames = Object.entries(UNITY_NAME_MAP)
      .filter(([_, id]) => id === componentId)
      .map(([name, _]) => name);
    console.log(`  ${componentId}:`, unityNames);
  });
}