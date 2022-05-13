import { createContext } from "./context"
import {PluginOption} from 'vite'
import { filterVue } from "./utils"

type PresetsRules = [string | RegExp, () => any]
export type PresetsRulesString = [string, () => any]
export type PresetsRulesReg = [RegExp, (exec: RegExpExecArray) => any]

interface MiniunocssParams {
  presets: Presets[]
}
export interface Presets {
  rules: PresetsRules[]
}

export function miniunocss({ presets }: MiniunocssParams) {
  
  const context = createContext(presets)
  
  

  return {
    name: 'miniunocss',
    enforce: 'pre',
    transform(code, id) {
      if (!filterVue(id)) return
      context.generatorCode(code)
      return null
    }
  } as PluginOption
}

