import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

/** Base path: '/' on Vercel (VERCEL=1), else VITE_BASE_PATH or GitHub Pages default. */
const base = process.env.VERCEL
  ? '/'
  : process.env.NODE_ENV === 'production'
    ? (process.env.VITE_BASE_PATH ?? '/tournament-tracker/')
    : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404-for-gh-pages',
      closeBundle() {
        const outDir = join(process.cwd(), 'dist')
        const index = join(outDir, 'index.html')
        const fallback = join(outDir, '404.html')
        if (existsSync(index)) copyFileSync(index, fallback)
      },
    },
  ],
})
