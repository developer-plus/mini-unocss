import type { Presets, PresetsRulesReg, PresetsRulesString, Vunocss } from "./types";
import { classReg } from "./regexps";
import { Compiler } from "./compiler";

export function createContext(presets: Presets[]) {
  return new Context(presets)
}
export class Context {
  _presets: Presets[]
  _rulesSting: PresetsRulesString[] = []
  _rulesReg: PresetsRulesReg[] = []
  _classNameSet: Set<string> = new Set<string>()
  _pseudoClassSet: Set<string> = new Set<string>()
  _vunocss: Vunocss[] = []
  _cache = new Map<string, Vunocss>()
  constructor(presets: Presets[]) {
    this._presets = presets
    // 初始化正则
    this.initRules(this._presets)
  }
  initRules(presets: Presets[]) {
    presets.forEach(preset => {
      preset.rules.forEach(rule => {
        const flag = rule[0]
        if (typeof flag === 'string') {
          this._rulesSting.push(rule as PresetsRulesString)
        } else if (flag.test) {
          this._rulesReg.push(rule as PresetsRulesReg)
        }
      })
    })
  }
  parseCode(code: string) {
    this.extractClasses(code)
    new Compiler(this)
  }
  extractClasses(code: string) {
    while (true) {
      const exec = classReg.exec(code);
      if (exec) {
        const res = exec[1];
        // todo 伪类
        res.split(" ").forEach((it) => {
          if (/\:/.test(it)) {
            this._pseudoClassSet.add(it)
          } else {
            this._classNameSet.add(it);
          }
        });
      } else {
        break;
      }
    }
  }
  reset() {
    this._vunocss.length = 0
    this._classNameSet.clear()
    this._pseudoClassSet.clear()
  }
}


