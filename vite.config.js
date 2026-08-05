import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/poke-idleworld': {
        target: 'https://poke.idleworld.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/poke-idleworld/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  }
})
