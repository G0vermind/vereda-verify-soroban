import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Isso garante que o SDK use a versão correta do Buffer para transações
      'Buffer': 'buffer',
    },
  },
})
