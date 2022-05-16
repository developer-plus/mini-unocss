import type { PresetsRules } from '../types'

export default [
  [/^bg-\[?(.+?)\]?$/, ([_, d], _isNotUnit) => ({ 'background-color': `${d}` })],
] as PresetsRules[]
