import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

/** Base path for GitHub Pages (production only). Use '/' for username.github.io; use '/repo-name/' for project pages. */
const base = process.env.NODE_ENV === 'production' ? (process.env.VITE_BASE_PATH ?? '/tournament-tracker/') : '/'

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
