import { createContext } from "./context"
import { PluginOption } from 'vite'
import { filterVue } from "./utils"
import type { MiniunocssParams } from './types'

export function miniunocss({ presets }: MiniunocssParams) {
  const context = createContext(presets)
  return {
    name: 'miniunocss',
    enforce: 'pre',
    transform(code, id) {
      if (!filterVue(id)) return
      context.parseCode(code)
      return null
    }
  } as PluginOption
}

