import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias @ to src directory
    },
  },
  server: {
    host: '0.0.0.0', // 👈 This exposes the dev server to your local network
    port: 5173,       // optional, if you want to specify
  },
})
