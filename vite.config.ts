import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves project sites from /<repo-name>/, so the production
// build needs that base path; local dev stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/retro/' : '/',
  plugins: [react(), tailwindcss()],
}))
