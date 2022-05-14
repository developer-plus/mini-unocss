import { PresetsRules } from "../types";


export default [
  [/^bg-\[?(.+?)\]?$/, ([_, d], isNotUnit) => ({ 'background-color': `${d}` })],
] as PresetsRules[]