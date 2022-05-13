import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {miniunocss} from './miniunocss/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), miniunocss({
    presets: [
      {
        rules: [
          [/^w-(\[?.+?\]?)$/, ([_, d]) => ({ width: `${d}px` })],
        ]
      }
    ]
  })]
})
