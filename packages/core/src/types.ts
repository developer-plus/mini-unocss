export interface Vunocss {
  className: string,
  attrs: { [key: string]: string }
  flag: 'pseudo' | 'class'
  pseudo?: string
  name?: string
}

export interface VClass {
  className: string
  flag: 'pseudo' | 'class'
  pseudo?: string
  name?: string
}

type PresetsRules = PresetsRulesString | PresetsRulesReg
export type PresetsRulesString = [string, () => any]
export type PresetsRulesReg = [RegExp, (exec: RegExpExecArray) => any]


export interface MiniunocssParams {
  presets: Presets[]
}
export interface Presets {
  rules: PresetsRules[]
}
