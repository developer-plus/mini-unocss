import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { miniunocss } from '@developer-plus/mini-unocss-core'
import presets from '@developer-plus/mini-unocss-presets-default'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    miniunocss({
      presets,
    }),
  ],
})
