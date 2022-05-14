import { Flags } from "./flags"

export interface Vunocss {
  className: string,
  attrs: { [key: string]: string }
  flag: Flags
  pseudo?: string
  name?: string
}
export interface VClass {
  className: string
  flag: Flags
  pseudo?: string
  name?: string
}

export type PresetsRules = PresetsRulesString | PresetsRulesReg
export type PresetsRulesString = [string, (isNotUnit: boolean) => any]
export type PresetsRulesReg = [RegExp, (exec: RegExpExecArray,isNotUnit: boolean) => any]


export interface MiniunocssParams {
  presets: Presets[]
}
export interface Presets {
  rules: PresetsRules[]
}
