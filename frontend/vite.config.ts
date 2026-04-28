import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'unity-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          const url = req.url || ""
          if (url.endsWith(".br")) {
            res.setHeader("Content-Encoding", "br")
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
            if (url.includes("framework"))  res.setHeader("Content-Type", "application/javascript")
            if (url.includes("wasm"))       res.setHeader("Content-Type", "application/wasm")
            if (url.includes("data"))       res.setHeader("Content-Type", "application/octet-stream")
          }
          next()
        })
      }
    }
  ],
  assetsInclude: ["**/*.br", "**/*.loader.js"],
})
