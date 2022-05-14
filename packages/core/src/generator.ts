import { Context } from "./context";
import { Vunocss } from "./types";

export class CssGenerator {
  constructor(public _ctx: Context) {
  }
  generateCss() {
    const ctx = this._ctx
    let css = ''
    ctx._vunocss.forEach(vunocss => {
      if (vunocss.flag === 'pseudo') {
        css += this.generatePseudo(vunocss)
      } else if (vunocss.flag === 'class') {
        css += this.generateString(vunocss)
      }
    })
    console.log(css);
    this._ctx.reset()
  }
  generateString(vunocss: Vunocss) {
    const {className} = vunocss
    const attrStr = this.generateAttrs(vunocss)
    return `.${className}{${attrStr}}`
  }
  generatePseudo(vunocss: Vunocss) {
    const {className,pseudo} = vunocss
    const attrStr = this.generateAttrs(vunocss)
    return `.${replaceClassName(className)}:${pseudo}{${attrStr}}`
  }
  generateAttrs(vunocss: Vunocss) {
    let attrStr = ''
    Object.keys(vunocss.attrs).forEach(key => {
      const value = vunocss.attrs[key]
      attrStr += `${key}:${value};`
    })

    return attrStr
  }
}

function replaceClassName(className: string) {

  return className.replace(/\:/, '\\:')
}


