// Unity object names → Component IDs mapping

export const UNITY_TO_COMPONENT_MAP: Record<string, string> = {
  // Planets
  'Sun': 'sun',
  'Mercury': 'mercury',
  'Venus': 'venus',
  'Earth': 'earth',
  'Mars': 'mars',
  'Jupiter': 'jupiter',
  'Saturn': 'saturn',
  'Uranus': 'uranus',
  'Neptune': 'neptune',
  
  // Spacecraft (adapt based on your Unity object names)
  'Rocket': 'rocket',
  'Satellite': 'satellite',
  'H70 Rocket': 'rocket',
  
  // Phenomena
  'BlackHole': 'black_hole',
  'Black Hole': 'black_hole',
  
  // Unknown
  'Unknown': 'unknown',
};

export function mapUnityNameToComponentId(unityName: string): string {
  // Direct match
  if (UNITY_TO_COMPONENT_MAP[unityName]) {
    return UNITY_TO_COMPONENT_MAP[unityName];
  }
  
  // Case-insensitive match
  const lowerName = unityName.toLowerCase();
  for (const [key, value] of Object.entries(UNITY_TO_COMPONENT_MAP)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Partial match (e.g., "Earth_Clone" → "earth")
  for (const [key, value] of Object.entries(UNITY_TO_COMPONENT_MAP)) {
    if (unityName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  console.warn('[Mapper] Unknown Unity object:', unityName);
  return 'unknown';
}