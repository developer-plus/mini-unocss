import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { miniunocss } from '@developer-plus/mini-unocss'
import presets from '@developer-plus/mini-unocss-preset'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), miniunocss({
    presets
  })]
})
