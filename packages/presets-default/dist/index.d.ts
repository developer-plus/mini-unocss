declare type PresetsRules = PresetsRulesString | PresetsRulesReg;
declare type PresetsRulesString = [string, (isNotUnit: boolean) => any];
declare type PresetsRulesReg = [RegExp, (exec: RegExpExecArray, isNotUnit: boolean) => any];

declare const _default: {
    rules: PresetsRules[];
}[];

export { _default as default };
