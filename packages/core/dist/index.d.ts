import { PluginOption } from 'vite';

declare type PresetsRules = PresetsRulesString | PresetsRulesReg;
declare type PresetsRulesString = [string, (isNotUnit: boolean) => any];
declare type PresetsRulesReg = [RegExp, (exec: RegExpExecArray, isNotUnit: boolean) => any];
interface MiniunocssParams {
    presets: Presets[];
}
interface Presets {
    rules: PresetsRules[];
}

declare function miniunocss({ presets }: MiniunocssParams): PluginOption;

export { miniunocss };
