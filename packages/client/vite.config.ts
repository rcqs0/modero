import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), jsx(), components({ dts: 'src/components.d.ts' })],

  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
