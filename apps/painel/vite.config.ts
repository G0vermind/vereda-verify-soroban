import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Polyfill correto do Buffer para o Stellar SDK no browser
      buffer: 'buffer/',
    },
  },
  define: {
    // Torna o Buffer globalmente disponível (necessário para o Stellar SDK)
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
