declare type PresetsRules = PresetsRulesString | PresetsRulesReg;
declare type PresetsRulesString = [string, () => any];
declare type PresetsRulesReg = [RegExp, (exec: RegExpExecArray) => any];

declare const _default: {
    rules: PresetsRules[];
}[];

export { _default as default };
