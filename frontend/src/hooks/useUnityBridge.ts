import { useEffect, useState } from 'react';

interface UnityObjectClick {
  objectName: string;
  timestamp: number;
}

export function useUnityBridge() {
  const [lastClick, setLastClick] = useState<UnityObjectClick | null>(null);

  useEffect(() => {
    console.log('[React] Setting up Unity bridge listener...');
    
    // Global function that Unity bridge calls
    (window as any).onUnityObjectClicked = (objectName: string) => {
      console.log('[React ← Unity] Received click:', objectName);
      
      setLastClick({
        objectName,
        timestamp: Date.now()
      });
    };

    // Cleanup
    return () => {
      console.log('[React] Cleaning up Unity bridge listener');
      delete (window as any).onUnityObjectClicked;
    };
  }, []);

  return lastClick;
}

// Helper to toggle Unity CV mode
export function setUnityCVMode(active: boolean) {
  console.log('[React → Unity] Setting CV mode:', active);
  
  if ((window as any).setUnityCVMode) {
    (window as any).setUnityCVMode(active);
  } else {
    console.warn('[React] Unity bridge not ready yet');
  }
}