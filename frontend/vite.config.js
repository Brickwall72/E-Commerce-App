import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  cacheDir: '.vite-cache',
  server: {
    watch: {
      usePolling: true, 
    },
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
})
