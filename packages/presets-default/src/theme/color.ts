import { PresetsRules } from "../types";


export default [
  [/^bg-(.+?)$/, ([_, d]) => ({ 'background-color': `${d}` })],
] as PresetsRules[]