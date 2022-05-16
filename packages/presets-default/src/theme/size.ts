import type { PresetsRules } from '../types'

export default [
  [/^w-(.+?)$/, ([_, d], isNotUnit) => ({ width: isNotUnit ? `${d}px` : d })],
  [/^h-(.+?)$/, ([_, d], isNotUnit) => ({ height: isNotUnit ? `${d}px` : d })],
] as PresetsRules[]
