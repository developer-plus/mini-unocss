import { PresetsRules } from "../types";


export default [
  [/^w-(\[?.+?\]?)$/, ([_, d]) => ({ width: `${d}px` })],
  [/^h-(\[?.+?\]?)$/, ([_, d]) => ({ height: `${d}px` })],
] as PresetsRules[]
