import { PluginOption } from 'vite';

declare type PresetsRules = PresetsRulesString | PresetsRulesReg;
declare type PresetsRulesString = [string, () => any];
declare type PresetsRulesReg = [RegExp, (exec: RegExpExecArray) => any];
interface MiniunocssParams {
    presets: Presets[];
}
interface Presets {
    rules: PresetsRules[];
}

declare function miniunocss({ presets }: MiniunocssParams): PluginOption;

export { miniunocss };
