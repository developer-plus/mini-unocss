export type PresetsRules = PresetsRulesString | PresetsRulesReg
export type PresetsRulesString = [string, (isNotUnit: boolean) => any]
export type PresetsRulesReg = [RegExp, (exec: RegExpExecArray, isNotUnit: boolean) => any]
