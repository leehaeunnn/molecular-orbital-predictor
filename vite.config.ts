import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/molecular-orbital-predictor/',
  plugins: [react()],
  server: {
    port: 5174,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
