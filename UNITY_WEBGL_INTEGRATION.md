# Unity WebGL Build Integration Guide

## Overview

This guide explains how the AeroVerse project integrates a Unity WebGL build into the React frontend with proper compression support, loading screens, error handling, and responsive sizing.

---

## File Structure

```
AeroVerseTestversionNNW/
├── frontend/
│   ├── public/
│   │   └── unity-build/
│   │       └── Build/
│   │           ├── Build.loader           (27 KB - JavaScript Source)
│   │           ├── Build.data.br          (487,207 KB - Brotli compressed)
│   │           ├── Build.wasm.br          (8,386 KB - Brotli compressed)
│   │           └── Build.framework.js.br  (77 KB - Brotli compressed)
│   ├── src/
│   │   ├── components/
│   │   │   └── UnityViewer.tsx            (Enhanced component with loading/error UI)
│   │   ├── hooks/
│   │   │   └── useUnityBridge.ts          (Cross-framework communication)
│   │   └── pages/
│   │       └── SpaceSimulationNew.tsx     (Main simulation page)
│   ├── vite.config.ts                     (Updated with Unity WebGL headers)
│   └── package.json
│
├── app/
│   ├── unity_server_config.py             (NEW - Flask route configuration)
│   ├── app/
│   │   └── __init__.py                    (Updated to register Unity routes)
│   └── run.py
│
└── README.md
```

---

## Key Technologies

1. **React Unity WebGL** - Bridge library for React ↔ Unity communication
2. **Vite** - Frontend dev server with custom middleware for Brotli headers
3. **Flask** - Backend server with API routes for Unity build files
4. **Brotli Compression** - `.br` files for reduced bandwidth (80-90% smaller)
5. **COOP/COEP Headers** - Enable SharedArrayBuffer for best performance

---

## Component Details

### 1. UnityViewer.tsx (Frontend Component)

**Purpose**: Renders the Unity WebGL canvas with loading overlay and error handling.

**Key Features**:

- Real-time loading progress (0-100%)
- Animated loading screen with stage descriptions
- Error handling with retry functionality
- Canvas bridge setup for page ↔ Unity communication
- Responsive sizing (fills container)
- CV Mode cursor management

**Props**:

```typescript
interface UnityViewerProps {
  loaderUrl: string; // Path to .loader file
  dataUrl: string; // Path to .data.br file
  frameworkUrl: string; // Path to .framework.js.br file
  codeUrl: string; // Path to .wasm.br file
  className?: string; // Tailwind classes (default: "w-full h-full")
  onError?: (error: string) => void; // Error callback
  onLoadingChange?: (isLoading: boolean) => void; // Loading state callback
}
```

**Usage Example**:

```tsx
<UnityViewer
  loaderUrl="/unity-build/Build/Build.loader"
  dataUrl="/unity-build/Build/Build.data.br"
  frameworkUrl="/unity-build/Build/Build.framework.js.br"
  codeUrl="/unity-build/Build/Build.wasm.br"
  onError={(error) => console.error("Unity load failed:", error)}
  onLoadingChange={(isLoading) => console.log("Loading:", isLoading)}
/>
```

**Loading Stages**:

- 0-10%: "Initializing engine..."
- 10-30%: "Loading WebGL context..."
- 30-50%: "Loading graphics pipeline..."
- 50-70%: "Loading physics engine..."
- 70-85%: "Loading assets and textures..."
- 85-95%: "Initializing gameplay systems..."
- 95-100%: "Finalizing startup..."

### 2. useUnityBridge.ts (Communication Hook)

**Purpose**: Handles bidirectional communication between React and Unity.

**Functions**:

**`useUnityBridge()`** - Hook for listening to Unity events:

```typescript
const lastClick = useUnityBridge();
// Returns: { objectName: string, timestamp: number } | null
```

**`setUnityCVMode(active: boolean)`** - Toggle Computer Vision mode:

```typescript
setUnityCVMode(true); // Enable CV detection on clicks
setUnityCVMode(false); // Disable CV detection
```

**Global Functions** (attached to `window`):

- `window.setUnityCVMode(active)` - Set CV mode
- `window.onUnityObjectClicked(objectName)` - Called by Unity when object clicked
- `window.unityCVMode` - Current CV mode state

### 3. vite.config.ts (Dev Server Configuration)

**Middleware Features**:

```typescript
- COOP/COEP headers for SharedArrayBuffer support
- Content-Encoding: br for .br files
- Correct MIME types for each file type
- Immutable cache headers for versioned assets
- Vary: Accept-Encoding for browser caching
```

**Header Mappings**:
| File Type | Content-Type | Content-Encoding | Cache-Control |
|-----------|--------------|------------------|----------------|
| `.js.br` | application/javascript | br | max-age=31536000 |
| `.wasm.br` | application/wasm | br | max-age=31536000 |
| `.data.br` | application/octet-stream | br | max-age=31536000 |
| `.loader` | application/javascript | - | max-age=31536000 |

### 4. unity_server_config.py (Flask Backend)

**Purpose**: Serve Unity build files with proper headers in production.

**Routes**:

**`GET /api/unity-build/<filename>`** - Serve individual build files

```bash
# Examples:
curl http://localhost:5000/api/unity-build/Build.loader
curl http://localhost:5000/api/unity-build/Build.data.br
curl http://localhost:5000/api/unity-build/Build.wasm.br
curl http://localhost:5000/api/unity-build/Build.framework.js.br
```

**`GET /api/unity-build/status`** - Health check endpoint

```json
{
  "ready": true,
  "files": {
    "loader": true,
    "data": true,
    "wasm": true,
    "framework": true
  },
  "path": "/path/to/unity/build"
}
```

**Headers Sent**:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: cross-origin
Content-Encoding: br (for .br files)
Cache-Control: public, max-age=31536000, immutable
```

---

## Setup Instructions

### 1. Verify Unity Build Files

Ensure all files are in the correct location:

```bash
cd frontend/public/unity-build/Build/
ls -lah
# Should show:
# Build.loader           27 KB
# Build.data.br          487 MB
# Build.wasm.br          8.3 MB
# Build.framework.js.br  77 KB
```

### 2. Update Backend (Flask)

The integration is already set up in `app/app/__init__.py`:

```python
from unity_server_config import configure_unity_build_serving
configure_unity_build_serving(app)
```

This registers the `/api/unity-build/*` routes automatically.

### 3. Verify Vite Configuration

The `frontend/vite.config.ts` already includes the Unity middleware. No changes needed.

### 4. Update SpaceSimulationNew.tsx (Already Done)

The component uses UnityViewer:

```tsx
<UnityViewer
  loaderUrl={UNITY_LOADER}
  dataUrl={UNITY_DATA}
  frameworkUrl={UNITY_FRAMEWORK}
  codeUrl={UNITY_CODE}
  className="w-full h-full"
/>
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1: Start Flask backend
cd app
python run.py
# Server runs on http://localhost:5000

# Terminal 2: Start Vite frontend
cd frontend
npm run dev
# App runs on http://localhost:5173
```

**Vite Middleware** automatically handles:

- Brotli decompression headers
- COOP/COEP security headers
- MIME type routing
- Local file serving

### Production Mode

**Option 1: Serve via Flask**

Update your production Flask config to serve static files:

```python
from flask import send_file

@app.route('/unity-build/<path:filename>')
def serve_unity_build(filename):
    from unity_server_config import serve_unity_static_direct
    return serve_unity_static_direct(filename)
```

**Option 2: Use CDN with Proper Headers**

If using CloudFront, S3, or similar:

```
Set-Cookie: Public, Cache-Control=max-age=31536000
Content-Encoding: br
Content-Type: [appropriate MIME type]
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

---

## Browser Compatibility

| Feature           | Chrome | Firefox     | Safari       | Edge   |
| ----------------- | ------ | ----------- | ------------ | ------ |
| WebGL 2.0         | ✅ 56+ | ✅ 51+      | ✅ 15+       | ✅ 79+ |
| Brotli            | ✅ 50+ | ⚠️ (manual) | ✅ 11+       | ✅ 79+ |
| SharedArrayBuffer | ✅ 91+ | ⚠️ (gated)  | ⚠️ (limited) | ✅ 91+ |

**Note**: Some browsers require COOP/COEP headers for SharedArrayBuffer, which are already configured.

---

## Troubleshooting

### 1. Build Not Loading (0% stays at 0%)

**Symptoms**: Loading bar doesn't progress

**Causes & Solutions**:

- Missing build files: Check `frontend/public/unity-build/Build/` for all 4 files
- MIME type mismatch: Verify vite.config.ts has correct types
- CORS issue: Check browser console for CORS errors
- Brotli decompression: Browser might not support Brotli (check vite middleware)

**Fix**:

```bash
# Verify files exist
ls -la frontend/public/unity-build/Build/

# Check file sizes match expected values
file frontend/public/unity-build/Build/*.br

# Test MIME type in browser console
fetch('/unity-build/Build/Build.data.br')
  .then(r => r.headers)
  .then(h => console.log(h.get('content-type')))
```

### 2. Canvas Not Appearing (Loaded but blank)

**Symptoms**: Loading completes but canvas is black/empty

**Causes & Solutions**:

- Graphics API not supported: Try different browser
- WebGL context not initialized: Check browser console for errors
- Z-index issue: Verify CSS doesn't hide canvas

**Fix**:

```typescript
// In browser console, check Unity state:
console.log(document.querySelector("canvas"));
console.log(document.querySelector("canvas").getContext("webgl2"));
```

### 3. Slow Loading (Takes > 2 minutes)

**Symptoms**: Loading works but very slow

**Causes & Solutions**:

- Network throttling: Check browser DevTools > Network
- Brotli decompression CPU bound: Normal on first load
- File size issue: Verify .br files aren't corrupted

**Fix**:

```bash
# Check file integrity
md5sum frontend/public/unity-build/Build/*.br
# Compare with source files from Unity export

# Test direct download speed
time curl -o /dev/null -s -w '%{speed_download}\n' \
  http://localhost:5173/unity-build/Build/Build.data.br
```

### 4. CV Mode Not Working (Clicks not detected)

**Symptoms**: CV Camera button works but clicks don't trigger

**Causes & Solutions**:

- Bridge not initialized: Check console for "Bridge initialized"
- Canvas not found: MutationObserver timeout after 10s
- Event listener issue: Check `pointer-events` CSS

**Fix**:

```typescript
// In browser console:
(window as any).setUnityCVMode(true);
(window as any).onUnityObjectClicked("TestObject");
console.log((window as any).unityCVMode);

// Verify canvas exists:
const canvas = document.querySelector("canvas");
console.log("Canvas:", canvas);
```

### 5. CORS/COEP Errors

**Symptoms**: Console error: "Cross-Origin-Embedder-Policy"

**Fix**:

```typescript
// Verify vite middleware sets correct headers
// In browser DevTools > Network > unity-build.loader
// Should see: Cross-Origin-Embedder-Policy: require-corp
```

---

## Performance Optimization

### Loading Speed

**Current Metrics**:

- .br files: 495.7 MB total (compressed from ~2 GB)
- Typical load time: 30-60 seconds on 5Mbps connection
- Browser cache: 1 year (31536000 seconds)

**Optimization Strategies**:

1. **Enable Service Worker Caching**:

```typescript
// Add to frontend/src/main.tsx
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
```

2. **Lazy Load Non-Critical Assets**:

```tsx
{
  isLaunched && <UnityViewer {...props} />;
}
```

3. **Use HTTP/2 Server Push** (production):

```
Link: </unity-build/Build/Build.data.br>; rel=preload; as=fetch
```

### Memory Usage

- Loaded Unity scene: ~500-800 MB RAM
- Canvas rendering: GPU-dependent
- React overhead: <50 MB

**Optimization**:

```typescript
// Monitor memory (Chrome DevTools)
performance.memory.usedJSHeapSize / 1048576; // MB
```

---

## Security Considerations

### 1. Content Security Policy (CSP)

Ensure CSP allows WebGL:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'wasm-unsafe-eval';
    img-src 'self' data: blob:;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' http://localhost:5000 http://localhost:5173;
  "
/>
```

### 2. COOP/COEP Headers

Already configured - ensures:

- Isolated process
- Cross-Origin-Embedder-Policy enforcement
- SharedArrayBuffer safety

### 3. File Integrity

In production, consider:

```python
# Add to unity_server_config.py
import hashlib

EXPECTED_HASHES = {
    'Build.loader': 'abc123...',
    'Build.data.br': 'def456...',
    # ... etc
}

@app.route('/api/unity-build/verify')
def verify_integrity():
    # Compute hashes of build files
    # Compare with EXPECTED_HASHES
    pass
```

---

## API Reference

### UnityViewer Component

```typescript
<UnityViewer
  loaderUrl={string}            // Required: Path to loader
  dataUrl={string}              // Required: Path to data
  frameworkUrl={string}         // Required: Path to framework
  codeUrl={string}              // Required: Path to WASM
  className={string}            // Optional: CSS classes
  onError={callback}            // Optional: Error handler
  onLoadingChange={callback}    // Optional: Loading state
/>
```

### useUnityBridge Hook

```typescript
const lastClick = useUnityBridge();
// Returns: null | { objectName: string; timestamp: number }

// Set CV mode:
setUnityCVMode(true); // Enable detection
setUnityCVMode(false); // Disable detection
```

### Flask Routes

```
GET /api/unity-build/status
  Returns: { ready: boolean; files: object; path: string }

GET /api/unity-build/<filename>
  Serves: Build.loader, Build.data.br, Build.wasm.br, Build.framework.js.br
  Headers: COOP, COEP, Content-Encoding, proper MIME types
```

---

## Further Reading

- **React Unity WebGL**: https://github.com/elraccoone/react-unity-webgl
- **Unity WebGL Build Settings**: https://docs.unity3d.com/Manual/webgl-building.html
- **Brotli Compression**: https://github.com/google/brotli
- **COOP/COEP Security**: https://web.dev/cross-origin-isolation/
- **WebGL Best Practices**: https://www.khronos.org/webgl/wiki/

---

## Maintenance

### Updating the Build

1. Export new build from Unity (with Brotli compression)
2. Replace files in `frontend/public/unity-build/Build/`
3. Verify file sizes and integrity
4. Test loading in development
5. Deploy to production

### Monitoring

Add analytics to track:

```typescript
// In SpaceSimulationNew.tsx
const handleLoadingChange = (isLoading: boolean) => {
  analytics.track("Unity Build", {
    loading: isLoading,
    timestamp: Date.now(),
  });
};
```

### Version Control

Add to `.gitignore`:

```
frontend/public/unity-build/Build/*.br
frontend/public/unity-build/Build/*.wasm
frontend/public/unity-build/Build/*.data
```

(These files are too large for Git)

---

## Support & Questions

For issues or questions:

1. Check troubleshooting section above
2. Review browser console errors
3. Verify file locations and sizes
4. Test with different browser
5. Check MIME type headers with DevTools

Good luck! 🚀
