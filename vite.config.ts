import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // ✅ Use '' (empty string) for correct relative paths on Vercel
})
