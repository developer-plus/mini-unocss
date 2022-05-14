import type { Presets, PresetsRulesReg, PresetsRulesString, VClass, Vunocss } from "./types";
import { classReg } from "./regexps";
import { Compiler } from "./compiler";

export function createContext(presets: Presets[]) {
  return new Context(presets)
}
export class Context {
  _presets: Presets[]
  _rulesSting: PresetsRulesString[] = []
  _rulesReg: PresetsRulesReg[] = []
  _classNameSet: Set<VClass> = new Set<VClass>()
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
          const splitClass = it.split(':')
          if (splitClass.length>1) {
            this._classNameSet.add({
              className: it,
              flag: 'pseudo',
              pseudo: splitClass[0],
              name: splitClass[1]
            });
          } else {
            this._classNameSet.add({
              className: it,
              flag: "class",
              name: it
            });
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
  }
}


