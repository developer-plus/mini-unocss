import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { miniunocss } from '@developer-plus/mini-unocss-core'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), , miniunocss({
    presets: [
      {
        rules: [
          [/^w-(\[?.+?\]?)$/, ([_, d]) => ({ width: `${d}px` })],
        ]
      }
    ]
  })]
})
