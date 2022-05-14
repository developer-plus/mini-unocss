import { Presets, PresetsRulesReg, PresetsRulesString } from ".";

export function createContext(presets: Presets[]) {
  return new Context(presets)
}
interface Vunocss {
  key: string,
  attrs: { [key: string]: string }
  flag?: number
}
const classReg = /class=[\"|\'](.+?)[\"|\']/g;
class Context {
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
  generatorCode(code: string) {
    
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
    this.patch()
  }
  patch() {
    this.generatorClassName()
  }
  generatorClassName() {
    this._classNameSet.forEach(className => {
      this._rulesSting.forEach(rulesSting => {
        const ruleSting = rulesSting[0]
        const fnRes = rulesSting[1]()
        if (className === ruleSting) {
          generatorCache(this, className, fnRes)
        }
      })

      this._rulesReg.forEach(rulesReg => {
        const reg = rulesReg[0]
        const fn = rulesReg[1]
        const exec = reg.exec(className)
        if (exec) {
          const fnRes = fn(exec)
          generatorCache(this, className, fnRes)
        }
      })
    })
    console.log(this._vunocss);
    
    this.convertCss()
  }
  convertCss() {
    let css = ''
    this._vunocss.forEach(vunocss => {
      let attrStr = ''
      Object.keys(vunocss.attrs).forEach(key => {
        const value = vunocss.attrs[key]
        attrStr+=`${key}:${value};`
      })
      css+=`.${vunocss.key}{${attrStr}}`
    });
    console.log(css);
    reset(this)
    return css
  }
}

function generatorCache(ctx: Context, className: string, fnRes: any) {
  let cacheVunocss = ctx._cache.get(className)
  if (cacheVunocss) {
  } else {
    cacheVunocss = {
      key: className,
      attrs: fnRes
    }
    ctx._cache.set(className, cacheVunocss)
   
  }
  ctx._vunocss.push(cacheVunocss)
}
function reset(ctx: Context) {
  ctx._vunocss.length = 0
  ctx._classNameSet.clear()
  ctx._pseudoClassSet.clear()
}