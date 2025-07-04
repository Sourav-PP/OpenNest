import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 This exposes the dev server to your local network
    port: 5173,       // optional, if you want to specify
  },
})
