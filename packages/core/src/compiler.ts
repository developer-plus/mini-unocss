import { Context } from "./context";
import { CssGenerator } from "./generator";

export class Compiler {
  constructor(public _ctx: Context) {
    this.patch()
  }
  patch() {
   this.compilerClass()
  }
  compilerClass() {
    this._ctx._classNameSet.forEach(className => {
      this._ctx._rulesSting.forEach(rulesSting => {
        const ruleSting = rulesSting[0]
        const fnRes = rulesSting[1]()
        if (className === ruleSting) {
          loadCache(this._ctx, className, fnRes)
        }
      })

      this._ctx._rulesReg.forEach(rulesReg => {
        const reg = rulesReg[0]
        const fn = rulesReg[1]
        const exec = reg.exec(className)
        if (exec) {
          const fnRes = fn(exec)
          loadCache(this._ctx, className, fnRes)
        }
      })
    })
    const cssGenerator = new CssGenerator(this._ctx)
    cssGenerator.generateCss()
  }
}

function loadCache(ctx: Context, className: string, fnRes: any) {
  let cacheVunocss = ctx._cache.get(className)
  if (!cacheVunocss) {
    cacheVunocss = {
      key: className,
      attrs: fnRes
    }
    ctx._cache.set(className, cacheVunocss)
  }
  ctx._vunocss.push(cacheVunocss)
}
