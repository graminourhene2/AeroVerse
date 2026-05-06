# Unity WebGL Integration - Quick Reference

## 🚀 Quick Start

### Development Environment

```bash
# Terminal 1: Backend (Flask)
cd app
python run.py
# Runs on http://localhost:5000

# Terminal 2: Frontend (Vite)
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**That's it!** Both servers automatically handle Brotli compression and COOP/COEP headers.

---

## 📁 Key Files

| File                                        | Purpose                          |
| ------------------------------------------- | -------------------------------- |
| `frontend/src/components/UnityViewer.tsx`   | Canvas rendering + loading UI    |
| `frontend/src/hooks/useUnityBridge.ts`      | React ↔ Unity communication      |
| `frontend/src/pages/SpaceSimulationNew.tsx` | Main simulation page             |
| `frontend/vite.config.ts`                   | Dev server middleware for Brotli |
| `app/unity_server_config.py`                | Flask routes for Unity files     |
| `app/app/__init__.py`                       | Registers Unity routes           |

---

## 🎮 Using UnityViewer Component

### Basic Usage

```tsx
import { UnityViewer } from "../components/UnityViewer";

export function MyPage() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <UnityViewer
        loaderUrl="/unity-build/Build/Build.loader"
        dataUrl="/unity-build/Build/Build.data.br"
        frameworkUrl="/unity-build/Build/Build.framework.js.br"
        codeUrl="/unity-build/Build/Build.wasm.br"
      />
    </div>
  );
}
```

### With Error Handling

```tsx
<UnityViewer
  loaderUrl="/unity-build/Build/Build.loader"
  dataUrl="/unity-build/Build/Build.data.br"
  frameworkUrl="/unity-build/Build/Build.framework.js.br"
  codeUrl="/unity-build/Build/Build.wasm.br"
  onError={(error) => {
    console.error("Unity failed to load:", error);
    // Show user-friendly error message
  }}
  onLoadingChange={(isLoading) => {
    console.log("Loading:", isLoading);
    // Update UI to show loading state
  }}
/>
```

---

## 🔌 Communication with Unity

### Listen for Clicks from Unity

```tsx
import { useUnityBridge } from "../hooks/useUnityBridge";

export function MyComponent() {
  const lastClick = useUnityBridge();

  useEffect(() => {
    if (lastClick) {
      console.log(`Clicked on: ${lastClick.objectName}`);
      console.log(`At time: ${lastClick.timestamp}`);
    }
  }, [lastClick]);

  return <div>Last clicked: {lastClick?.objectName}</div>;
}
```

### Toggle CV (Computer Vision) Mode

```tsx
import { setUnityCVMode } from "../hooks/useUnityBridge";

function MyComponent() {
  const [cvActive, setCvActive] = useState(false);

  const toggleCV = () => {
    const newState = !cvActive;
    setCvActive(newState);
    setUnityCVMode(newState); // Tell Unity about mode change
  };

  return <button onClick={toggleCV}>{cvActive ? "CV ON" : "CV OFF"}</button>;
}
```

---

## 📦 Updating the Unity Build

### Step 1: Export from Unity

In Unity Editor:

1. Go to **Build Settings**
2. Select **WebGL** platform
3. Enable **Compression Format: Brotli**
4. Click **Build**
5. Select output folder: `frontend/public/unity-build/Build/`

### Step 2: Verify Files

```bash
cd frontend/public/unity-build/Build/
ls -lah

# Should see:
# Build.loader           (27 KB)
# Build.data.br          (487 MB)  ← Usually the largest
# Build.wasm.br          (8.3 MB)
# Build.framework.js.br  (77 KB)
```

### Step 3: Test in Development

```bash
npm run dev
# Open http://localhost:5173
# Navigate to Space Simulation page
# Click "Launch Unity Simulation"
# Verify loading progresses to 100%
```

---

## 🐛 Debugging

### Check Loading Progress

```typescript
// In browser console while Unity is loading
setInterval(() => {
  const logs = document.querySelectorAll('[role="status"]');
  console.log(logs[logs.length - 1]?.textContent);
}, 1000);
```

### Verify MIME Types

```javascript
// In browser DevTools > Network tab
// Click on Build.data.br
// Check Response Headers:
// - Content-Type: application/octet-stream
// - Content-Encoding: br
// - Cross-Origin-Embedder-Policy: require-corp
```

### Test Backend Routes

```bash
# Check if Flask server is running
curl http://localhost:5000/api/unity-build/status | jq

# Should return:
# {
#   "ready": true,
#   "files": {
#     "loader": true,
#     "data": true,
#     "wasm": true,
#     "framework": true
#   }
# }
```

### Check Canvas Setup

```javascript
// In browser console
const canvas = document.querySelector("canvas");
console.log("Canvas exists:", !!canvas);
console.log("Canvas size:", canvas?.width, "x", canvas?.height);
console.log("WebGL context:", canvas?.getContext("webgl2"));
```

---

## ⚠️ Common Issues

### Issue: Loading stuck at 0%

**Cause**: Files not found or wrong paths

**Fix**:

```bash
# Verify files exist
find frontend/public -name "Build.*"

# Check vite is serving them
curl http://localhost:5173/unity-build/Build/Build.loader
```

### Issue: "Failed to load" error message

**Cause**: Brotli decompression failed or MIME type wrong

**Fix**:

```bash
# Verify Brotli files are valid
file frontend/public/unity-build/Build/*.br
# Should show: "data"

# Re-export from Unity with Brotli compression enabled
```

### Issue: Canvas blank after loading

**Cause**: Graphics API not supported

**Fix**:

- Try different browser (Chrome/Edge recommended)
- Check browser console for WebGL errors
- Verify graphics card supports WebGL 2.0

### Issue: CV Mode clicks not detected

**Cause**: Unity bridge not initialized

**Fix**:

```javascript
// In browser console
window.setUnityCVMode(true);
window.onUnityObjectClicked("TestObject");
// If it works, the bridge is ready
```

---

## 📊 Performance Tips

### Reduce Load Time

1. **Enable Browser Caching**:
   - Already configured (1 year cache)
   - First visit takes longer (~60s), subsequent visits use cache

2. **Use CDN in Production**:
   - Serve Brotli files from edge locations
   - Reduces latency for global users

3. **Monitor Network**:
   ```javascript
   // In DevTools > Network > Build.data.br
   // Note the download time and size
   ```

### Optimize Memory

- UnityViewer component: ~500-800 MB RAM
- Don't create multiple instances
- Clean up when component unmounts

---

## 🔐 Security Checklist

- ✅ COOP/COEP headers set (required for SharedArrayBuffer)
- ✅ CORS configured for localhost:5173
- ✅ File paths validated (no directory traversal)
- ✅ MIME types correct (prevents content sniffing)
- ✅ Cache headers set (prevents stale assets)

---

## 📚 API Reference

### UnityViewer Props

```typescript
interface UnityViewerProps {
  loaderUrl: string; // "/unity-build/Build/Build.loader"
  dataUrl: string; // "/unity-build/Build/Build.data.br"
  frameworkUrl: string; // "/unity-build/Build/Build.framework.js.br"
  codeUrl: string; // "/unity-build/Build/Build.wasm.br"
  className?: string; // e.g., "w-full h-full"
  onError?: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}
```

### useUnityBridge Hook

```typescript
// Listen for clicks from Unity
const lastClick = useUnityBridge();
// Returns: { objectName: string; timestamp: number } | null

// Set CV mode
setUnityCVMode(true); // Enable
setUnityCVMode(false); // Disable

// Global functions (auto-created)
window.setUnityCVMode(active); // Set CV mode
window.onUnityObjectClicked(objectName); // Called by Unity
window.unityCVMode; // Current state
```

### Flask Routes

```
GET /api/unity-build/status
  Returns: { ready, files, path }

GET /api/unity-build/Build.loader
GET /api/unity-build/Build.data.br
GET /api/unity-build/Build.wasm.br
GET /api/unity-build/Build.framework.js.br
  Returns: File with proper headers
```

---

## 🚢 Production Deployment

### Vite Build

```bash
cd frontend
npm run build
# Creates dist/ folder with optimized code
```

### Flask Production

```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables

```bash
# .env file
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

## 📖 File Structure Template

If creating a new simulation page:

```tsx
import { Navigation } from "../Navigation";
import { UnityViewer } from "../components/UnityViewer";
import { useUnityBridge, setUnityCVMode } from "../hooks/useUnityBridge";
import { useState } from "react";

const UNITY_LOADER = "/unity-build/Build/Build.loader";
const UNITY_DATA = "/unity-build/Build/Build.data.br";
const UNITY_FRAMEWORK = "/unity-build/Build/Build.framework.js.br";
const UNITY_CODE = "/unity-build/Build/Build.wasm.br";

export function MySimulation() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cvMode, setCvMode] = useState(false);
  const lastClick = useUnityBridge();

  return (
    <div>
      <Navigation />
      <div className="w-full h-screen">
        <UnityViewer
          loaderUrl={UNITY_LOADER}
          dataUrl={UNITY_DATA}
          frameworkUrl={UNITY_FRAMEWORK}
          codeUrl={UNITY_CODE}
          onLoadingChange={setIsLoaded}
        />
      </div>
    </div>
  );
}
```

---

## 🤝 Contributing

When making changes:

1. **UnityViewer component**: Affects all simulation pages
2. **useUnityBridge hook**: Affects communication logic
3. **vite.config.ts**: Affects dev server headers
4. **unity_server_config.py**: Affects production serving
5. **SpaceSimulationNew.tsx**: Only affects one page

Test changes on multiple browsers if possible.

---

## ❓ Quick FAQ

**Q: Can I use multiple UnityViewer instances?**
A: Not recommended. WebGL contexts are limited; stick to one.

**Q: Does it work on mobile?**
A: Depends on device. Most modern phones support WebGL 2.0. Test first.

**Q: How long does it take to load?**
A: First load: 30-60 seconds. Cached loads: 2-5 seconds.

**Q: Can I customize the loading screen?**
A: Yes! Edit `UnityViewer.tsx` components and styling.

**Q: What if Brotli isn't supported?**
A: Browser should auto-fall back. Check Content-Encoding header.

---

**Last Updated**: April 2026  
**Status**: Production Ready ✅
