import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/getnotes': 'http://localhost:3000',
      '/addnote': 'http://localhost:3000',
      '/updatenote': 'http://localhost:3000',
      '/deletenote': 'http://localhost:3000',
      '/getnote': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
})
