export type PresetsRules = PresetsRulesString | PresetsRulesReg
export type PresetsRulesString = [string, () => any]
export type PresetsRulesReg = [RegExp, (exec: RegExpExecArray) => any]
