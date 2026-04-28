# 🔧 Unity WebGL Integration Diagnostic Guide

## Step 1: Open Browser DevTools

1. **Open your browser** and go to `http://localhost:5174/simulation`
2. **Press `F12`** to open Developer Tools
3. Go to the **Console** tab
4. **Take a screenshot** of any errors you see

---

## Step 2: Check Network Tab

1. In DevTools, go to **Network tab**
2. **Refresh the page** (Ctrl+R or Cmd+R)
3. **Look for these files** - they should show status 200:
   - `unity-build.loader.js` ✅
   - `unity-build.data.br` ✅
   - `unity-build.framework.js.br` ✅
   - `unity-build.wasm.br` ✅

4. **If any show red (404):**
   - Right-click → Copy full URL
   - Paste in new tab to test access
   - Check file paths in SpaceSimulation.tsx

5. **If files show 200 but appear empty:**
   - Right-click file → View Response
   - Check if data is actually there

---

## Step 3: Check Console Errors

Look for these specific errors:

### ❌ ERROR: "Cannot find module 'react-unity-webgl'"

**Fix:** Run `npm install react-unity-webgl`

### ❌ ERROR: "SharedArrayBuffer is not defined"

**Fix:** Your CORS headers are set correctly in vite.config.ts

### ❌ ERROR: "Failed to load module: unity-build.loader.js 404"

**Fix:** Paths in SpaceSimulation.tsx are wrong. Should be:

```
loaderUrl="/unity-build/Build/unity-build.loader.js"
```

### ❌ ERROR: "Uncaught ReferenceError: ref is not defined"

**Fix:** UnityViewer component has a bug. React is not imported.

### ⚠️ "Loading timeout - still at X%"

**Fix:** Files are loading but Unity isn't initializing. Check if files are corrupted.

---

## Step 4: Minimal Test

Create a test component to isolate the issue:

**Create file:** `src/components/UnityTest.tsx`

```tsx
import { Unity, useUnityContext } from "react-unity-webgl";
import { useState } from "react";

export function UnityTest() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "/unity-build/Build/unity-build.loader.js",
    dataUrl: "/unity-build/Build/unity-build.data.br",
    frameworkUrl: "/unity-build/Build/unity-build.framework.js.br",
    codeUrl: "/unity-build/Build/unity-build.wasm.br",
  });

  const percent = Math.round(loadingProgression * 100);

  return (
    <div style={{ width: "100%", height: "600px", border: "2px solid red" }}>
      <div style={{ color: "white", padding: "20px" }}>
        <p>Loading: {percent}%</p>
        <p>Is Loaded: {isLoaded ? "✅ YES" : "❌ NO"}</p>
      </div>

      {isLoaded && (
        <Unity
          unityProvider={unityProvider}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
```

Then use it in SpaceSimulation.tsx:

```tsx
import { UnityTest } from "../components/UnityTest";
// ...
<UnityTest />;
```

Expected behavior:

- Progress should go from 0% to 100%
- "Is Loaded" should change from ❌ NO to ✅ YES
- Red box should show Unity canvas

---

## Step 5: Check File Sizes

Run in terminal:

```powershell
cd "c:\Users\wiemb\OneDrive\Bureau\PCD\AeroVerseTestversion\frontend\public\unity-build\Build"
ls -lh
```

Expected sizes (examples - yours may differ):

- `unity-build.loader.js` : ~10-50 KB
- `unity-build.framework.js.br` : ~2-5 MB
- `unity-build.wasm.br` : ~20-100 MB
- `unity-build.data.br` : ~5-50 MB

**If files are < 1KB:** ❌ Corrupted, re-export from Unity

---

## Step 6: Verify Unity Build Export

Make sure your Unity WebGL build was done correctly:

✅ In Unity Editor:

1. File → Build Settings
2. Platform: **WebGL**
3. Build → Select output folder → `public/unity-build/Build/`
4. Wait for build to complete
5. Check that these files exist:
   - `Build/unity-build.loader.js`
   - `Build/unity-build.framework.js.br`
   - `Build/unity-build.wasm.br`
   - `Build/unity-build.data.br`

❌ If missing, re-build or reconfigure build settings

---

## What to Report

When you get stuck, tell me:

```
1. What errors appear in Console (F12)?
2. Which files in Network tab show 404?
3. What does the progress show before timeout?
4. File sizes in public/unity-build/Build/
5. Did you export from Unity WebGL or upload pre-built files?
```

---

## Common Solutions

| Problem                             | Solution                                       |
| ----------------------------------- | ---------------------------------------------- |
| "404 Not Found" for files           | Check vite.config.ts paths, ensure files exist |
| "Loading timeout at 0%"             | Loader JS isn't loading, check file size       |
| "Loading at 50%, stuck"             | Framework file corrupted, re-export from Unity |
| "Loading 100%, doesn't show"        | Unity isn't initializing, check console errors |
| Nothing happens when click "Launch" | Check if `isLaunched` state is toggling        |
| Black screen with no errors         | Canvas rendering issue - check browser zoom    |

---

**🎯 Next: Follow the steps above, then share the console errors you see!**
