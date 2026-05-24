import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    proxy: {
      // R-ONE API: CORS 우회 프록시
      '/proxy/r-one': {
        target: 'https://www.reb.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/r-one/, '/r-one'),
      },
      // 중소벤처24 bizinfo.go.kr RSS: CORS 우회 프록시
      '/proxy/bizinfo': {
        target: 'https://www.bizinfo.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/bizinfo/, ''),
      },
    },
  },
})
