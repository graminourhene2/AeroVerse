# Unity WebGL Integration - Setup Verification Checklist

## ✅ Pre-Integration Checklist

### Build Files

- [ ] `Build.loader` exists in `frontend/public/unity-build/Build/` (27 KB)
- [ ] `Build.data.br` exists (487 MB)
- [ ] `Build.wasm.br` exists (8.3 MB)
- [ ] `Build.framework.js.br` exists (77 KB)
- [ ] Total size is ~495 MB
- [ ] All files are readable (permissions correct)

### Frontend Setup

- [ ] `frontend/src/components/UnityViewer.tsx` exists
- [ ] `frontend/src/hooks/useUnityBridge.ts` exists
- [ ] `frontend/src/pages/SpaceSimulationNew.tsx` exists
- [ ] `frontend/vite.config.ts` has Unity middleware
- [ ] `package.json` has `react-unity-webgl` dependency
- [ ] `package.json` has lucide-react for icons

### Backend Setup

- [ ] `app/unity_server_config.py` exists
- [ ] `app/app/__init__.py` imports and calls `configure_unity_build_serving(app)`
- [ ] Flask routes are registered: `/api/unity-build/*`
- [ ] `app/requirements.txt` includes Flask and dependencies

### Documentation

- [ ] `UNITY_WEBGL_INTEGRATION.md` exists
- [ ] `UNITY_QUICK_REFERENCE.md` exists
- [ ] This checklist exists

---

## 🔧 Installation Verification

### Python Dependencies

```bash
cd app
pip list | grep -E "Flask|CORS|SQLAlchemy|JWT"
```

**Expected Output**:

```
Flask==3.0.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.5.3
```

**Action if missing**:

```bash
pip install -r requirements.txt
```

### Node Dependencies

```bash
cd frontend
npm list react-unity-webgl lucide-react
```

**Expected Output**:

```
└── react-unity-webgl@9.x.x
└── lucide-react@0.x.x
```

**Action if missing**:

```bash
npm install react-unity-webgl lucide-react
```

---

## 🚀 Runtime Verification

### Start Backend

```bash
cd app
python run.py
```

**Verify**:

- [ ] Server starts without errors
- [ ] Shows "🚀 STARTING AEROVERSE BACKEND"
- [ ] Database tables created
- [ ] Server listening on http://127.0.0.1:5000
- [ ] No import errors for `unity_server_config`

**Test Endpoint**:

```bash
curl http://localhost:5000/api/unity-build/status | jq
```

**Expected Response**:

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

### Start Frontend

```bash
cd frontend
npm run dev
```

**Verify**:

- [ ] Vite dev server starts
- [ ] Server listening on http://localhost:5173
- [ ] No TypeScript errors
- [ ] Vite middleware loaded (check console)

**Test Headers** (in browser DevTools):

1. Open http://localhost:5173
2. Go to **DevTools > Network**
3. Filter by "Build."
4. Click on one of these files:
   - `Build.data.br`
   - `Build.wasm.br`
   - `Build.framework.js.br`
5. Go to **Response Headers** tab

**Should See**:

```
cross-origin-opener-policy: same-origin
cross-origin-embedder-policy: require-corp
cross-origin-resource-policy: cross-origin
content-encoding: br
content-type: [appropriate MIME type]
cache-control: public, max-age=31536000, immutable
```

---

## 🎮 Feature Verification

### Navigation to Simulation Page

1. Open http://localhost:5173
2. Log in (if required)
3. Navigate to `/simulation` route
4. [ ] Page loads without errors
5. [ ] See "Space Simulation" heading
6. [ ] See "Launch Unity Simulation" button

### Launch Unity Build

1. Click "Launch Unity Simulation" button
2. [ ] Loading overlay appears
3. [ ] Progress bar starts moving (0% → 100%)
4. [ ] See loading stage descriptions:
   - "Initializing engine..."
   - "Loading WebGL context..."
   - "Loading graphics pipeline..."
   - "Loading physics engine..."
   - "Loading assets and textures..."
   - "Initializing gameplay systems..."
   - "Finalizing startup..."

**Expected Duration**: 30-60 seconds (first load)

5. [ ] Progress reaches 100%
6. [ ] Loading overlay disappears
7. [ ] Unity canvas is visible
8. [ ] 3D scene is interactive

### CV Mode Testing

1. Click "🔬 CV Camera" button
2. [ ] Button changes to "🔬 CV ON"
3. [ ] Crosshair cursor appears
4. [ ] "CV Mode active" banner appears at top
5. [ ] Click on any object in the Unity scene
6. [ ] Identification popup appears (or error message)
7. [ ] Click "Exit CV Mode" button
8. [ ] Mode deactivates

### Control Panel Testing

1. [ ] Play/Pause button works
2. [ ] Reset button resets the scene
3. [ ] CV Camera toggle works
4. [ ] "LIVE" indicator shows when playing

---

## 🌐 Browser Compatibility Check

### Chrome/Edge (Recommended)

- [ ] Navigate to http://localhost:5173/simulation
- [ ] Launch Unity build
- [ ] Should load without warnings
- [ ] CV mode should work

**Check WebGL Support**:

```javascript
// In browser console
const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2");
console.log("WebGL 2.0 supported:", !!gl);
```

### Firefox

- [ ] Page loads
- [ ] Unity build might load slower (Brotli support varies)
- [ ] Verify in DevTools that .br files load correctly

### Safari

- [ ] Page loads (may need macOS 11+)
- [ ] WebGL 2.0 support limited
- [ ] File sizes should still be small due to Brotli

---

## 🔒 Security Verification

### CORS Headers

```bash
curl -i http://localhost:5000/api/unity-build/Build.data.br | grep -i "cross-origin"
```

**Expected**:

```
cross-origin-opener-policy: same-origin
cross-origin-embedder-policy: require-corp
cross-origin-resource-policy: cross-origin
```

### MIME Types

```bash
curl -i http://localhost:5173/unity-build/Build/Build.wasm.br | grep -i "content-type"
```

**Expected**:

```
content-type: application/wasm
```

### Cache Headers

```bash
curl -i http://localhost:5173/unity-build/Build/Build.loader | grep -i "cache-control"
```

**Expected**:

```
cache-control: public, max-age=31536000, immutable
```

---

## 📊 Performance Baseline

Record these metrics for future comparison:

### Load Times

```javascript
// In browser console during Unity load
console.time("UnityLoad");
// Watch loading bar to 100%
console.timeEnd("UnityLoad");
```

**Baseline**: First load ~45 seconds, cached load ~3 seconds

### Network Metrics (DevTools > Network)

- [ ] Build.data.br: ~200-300 MB transferred
- [ ] Build.wasm.br: ~3-4 MB transferred
- [ ] Build.framework.js.br: ~30-40 KB transferred
- [ ] Build.loader: ~12-15 KB transferred

### Memory Usage (DevTools > Memory)

- [ ] Heap before load: ~50-100 MB
- [ ] Heap after load: ~550-850 MB
- [ ] Memory increase: ~500-800 MB

---

## 🐛 Troubleshooting Checklist

### If Build Won't Load

- [ ] Check `frontend/public/unity-build/Build/` folder exists
- [ ] Verify all 4 files are present
- [ ] Check file permissions (readable)
- [ ] Open DevTools > Console for JavaScript errors
- [ ] Check DevTools > Network for 404 errors
- [ ] Verify backend is running (`curl http://localhost:5000`)
- [ ] Verify frontend is running (`curl http://localhost:5173`)

### If Canvas Is Blank

- [ ] Check browser console for WebGL errors
- [ ] Try different browser (Chrome/Edge preferred)
- [ ] Check GPU drivers are up to date
- [ ] Verify WebGL 2.0 is supported: `window.WebGL2RenderingContext`
- [ ] Check file sizes are reasonable (not 0 bytes)

### If CV Mode Doesn't Work

- [ ] Ensure Unity build is fully loaded (LIVE indicator shows)
- [ ] Check browser console for "Bridge initialized" message
- [ ] Try clicking different areas of the canvas
- [ ] Verify `onUnityObjectClicked` is accessible:
  ```javascript
  typeof (window as any).onUnityObjectClicked
  // Should be 'function'
  ```
- [ ] Check backend API is responding to CV requests

### If Performance Is Poor

- [ ] Check network speed: `curl -o /dev/null -s -w '%{speed_download}\n' http://localhost:5173/unity-build/Build/Build.data.br`
- [ ] Check if file is actually Brotli compressed: `file frontend/public/unity-build/Build/*.br`
- [ ] Check browser cache is enabled: DevTools > Network > Disable cache (checkbox)
- [ ] Monitor memory usage: DevTools > Memory > Record heap snapshots

---

## 📋 Pre-Production Checklist

Before deploying to production:

### Code Quality

- [ ] No console errors in development
- [ ] No TypeScript compilation errors
- [ ] All tests pass (if applicable)
- [ ] Code follows project conventions

### Configuration

- [ ] Environment variables set correctly
- [ ] CORS origins updated for production domain
- [ ] Database URL points to production database
- [ ] JWT secret is strong and unique

### Performance

- [ ] Vite build completes without warnings: `npm run build`
- [ ] Flask production server tested: `gunicorn`
- [ ] Assets are properly cached
- [ ] CDN configured for static files (if using)

### Security

- [ ] HTTPS enabled on production domain
- [ ] COOP/COEP headers properly set
- [ ] CORS headers restricted to your domains
- [ ] File integrity verification enabled (optional)
- [ ] CSP policy configured

### Monitoring

- [ ] Error tracking enabled (e.g., Sentry)
- [ ] Performance monitoring enabled
- [ ] Analytics configured
- [ ] Uptime monitoring enabled

### Documentation

- [ ] README updated with production URLs
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Team members trained on deployment

---

## ✨ Final Sign-Off

**Completed By**: ******\_\_\_\_******  
**Date**: ******\_\_\_\_******  
**Status**:

- [ ] Development: Ready ✅
- [ ] Staging: Ready ✅
- [ ] Production: Ready ✅

**Notes**:

```
[Add any special notes or issues discovered]
```

---

## 🔄 Ongoing Maintenance

### Weekly

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backups working

### Monthly

- [ ] Review performance trends
- [ ] Update dependencies
- [ ] Test failover/recovery procedures

### Quarterly

- [ ] Security audit
- [ ] Performance optimization review
- [ ] Documentation update

---

**Next Steps**: Once all items are checked, refer to [UNITY_QUICK_REFERENCE.md](UNITY_QUICK_REFERENCE.md) for daily development tasks.
