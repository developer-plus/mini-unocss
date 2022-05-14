import { Context } from "./context";
import { Flags } from "./flags";
import { CssGenerator } from "./generator";
import { VClass } from "./types";

export class Compiler {
  constructor(public _ctx: Context) {
    this.patch()
  }
  patch() {
   this.compilerClass()
  }
  compilerClass() {
    const cssGenerator = new CssGenerator(this._ctx)

    this._ctx._classNameSet.forEach(vClass => {
      this.compilerClassByRuleSting(vClass)
      this.compilerClassByRuleReg(vClass)
    })
    cssGenerator.generateCss()
  }
  compilerClassByRuleSting(vClass: VClass) {
    this._ctx._rulesSting.forEach(rulesSting => {
      const ruleSting = rulesSting[0]
      const {name, flag} = vClass
      const fnRes = rulesSting[1](!(flag & Flags.ARBITRARY_VALUE))
      if (name === ruleSting) {
        loadCache(this._ctx, vClass, fnRes)
      }
    })
  }
  compilerClassByRuleReg(vClass: VClass) {
    this._ctx._rulesReg.forEach(rulesReg => {
      const reg = rulesReg[0]
      const fn = rulesReg[1]
      const { name, flag } = vClass
      const exec = reg.exec(name)
      if (exec) {
        const fnRes = fn(exec, !(flag & Flags.ARBITRARY_VALUE))
        loadCache(this._ctx, vClass, fnRes)
      }
    })
  }
}

function loadCache(ctx: Context, vClass: VClass, fnRes: any) {
  const {className, flag, name, pseudo} = vClass
  let cacheVunocss = ctx._cache.get(className)
  if (!cacheVunocss) {
    cacheVunocss = {
      className,
      attrs: fnRes,
      flag,
      pseudo,
      name
    }
    ctx._cache.set(className, cacheVunocss)
  }
  ctx._vunocss.push(cacheVunocss)
}
