import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'unity-webgl-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // COOP & COEP headers required for WebGL SharedArrayBuffer
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
          
          const url = req.url || ""
          
          // Configure Brotli-compressed files
          if (url.endsWith(".br")) {
            res.setHeader("Content-Encoding", "br")
            res.setHeader("Vary", "Accept-Encoding")
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
            
            // Set correct MIME types for WebGL assets
            if (url.includes("framework")) {
              res.setHeader("Content-Type", "application/javascript; charset=utf-8")
            } else if (url.includes("wasm")) {
              res.setHeader("Content-Type", "application/wasm")
            } else if (url.includes("data")) {
              res.setHeader("Content-Type", "application/octet-stream")
            }
          }
          
          // Unity loader script
          if (url.includes(".loader.js")) {
            res.setHeader("Content-Type", "application/javascript; charset=utf-8")
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
          }
          
          // HTML files - no cache for versioning
          if (url.endsWith(".html")) {
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate")
          }
          
          next()
        })
      }
    }
  ],
  assetsInclude: ["**/*.br", "**/*.loader.js", "**/*.wasm"],
})
