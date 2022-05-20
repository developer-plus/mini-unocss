import type {
  Presets,
  PresetsRulesReg,
  PresetsRulesString,
  VClass,
  Vunocss
} from './types'
import { brackets, classReg } from './regexps'
import { Compiler } from './compiler'
import { Flags } from './flags'

export function createContext(presets: Presets[]) {
  return new Context(presets)
}
export class Context {
  buildResolve: any
  _code?: string
  _css?: string
  _presets: Presets[]
  _rulesSting: PresetsRulesString[] = []
  _rulesReg: PresetsRulesReg[] = []
  _classNameSet: VClass[] = []
  _vunocss: Vunocss[] = []
  _cache = new Map<string, Vunocss>()
  constructor(presets: Presets[]) {
    this._presets = presets
    // 初始化正则
    this.initRules(this._presets)
  }

  initRules(presets: Presets[]) {
    presets.forEach((preset) => {
      preset.rules.forEach((rule) => {
        const flag = rule[0]
        if (typeof flag === 'string')
          this._rulesSting.push(rule as PresetsRulesString)
        // else if (flag.test)
        //   this._rulesReg.push(rule as PresetsRulesReg)
      })
    })
  }

  parseCode(code: string) {
    this.extractClasses(code)
    // eslint-disable-next-line no-new
    new Compiler(this)
    return this._css
  }

  async _waitAndParseCode() {
    // eslint-disable-next-line promise/param-names
    return new Promise<string>((res) => {
      this.buildResolve = res
    }).then((code) => {
      this.extractClasses(code)
      // eslint-disable-next-line no-new
      new Compiler(this)
      return this._css
    })
  }

  extractClasses(code: string) {
    while (true) {
      const exec = classReg.exec(code)
      if (exec) {
        const res = exec[1]
        // todo 伪类
        res.split(' ').forEach((it) => {
          const res: VClass = {
            className: it,
            flag: Flags.DEFAULT
          }
          const splitClass = it.split(':')
          if (splitClass.length > 1) {
            res.flag |= Flags.CLASS_PSEUDO
            res.pseudo = splitClass[0]
            res.name = splitClass[1]
          }
          else {
            res.flag |= Flags.CLASS_STRING
            res.name = it
          }
          this.hasBrackets(res)
          this.addClassSet(res)
        })
      }
      else {
        break
      }
    }
  }

  reset() {
    this._vunocss.length = 0
    this._classNameSet.length = 0
  }

  hasClassNameSet(vClass: VClass) {
    return this._classNameSet.some((v) => {
      return v.className === vClass.className
    })
  }

  addClassSet(res: VClass) {
    if (!this.hasClassNameSet(res))
      this._classNameSet.push(res)
  }

  hasBrackets(res: VClass) {
    if (brackets.test(res.className))
      res.flag |= Flags.ARBITRARY_VALUE
  }

  get code() {
    return this._code!
  }

  set code(c: string) {
    this._code = c
    if (this.buildResolve)
      this.buildResolve(c)
  }
}
