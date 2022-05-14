export interface Vunocss {
  key: string
  attrs: Record<string, string>
  flag?: number
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
