import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateMenu from './src/components/menu'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@vue/repl': 'https://esm.run/@vue/repl@2.5.8',
      'element-plus': 'https://esm.run/element-plus@2.1.10',
      'vue': 'https://esm.run/vue@3.3.4'
    }
  },
  base: '/vue-demo',
  define: {
    MENU_DATA: generateMenu()
  },
  server: {
    port: 5174,
  }
})
