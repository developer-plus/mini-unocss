import type { Context } from './context'
import { Flags } from './flags'
import type { Vunocss } from './types'

export class CssGenerator {
  constructor(public _ctx: Context) {
  }

  generateCss() {
    const ctx = this._ctx
    let css = ''
    ctx._vunocss.forEach((vunocss) => {
      if (vunocss.flag & Flags.CLASS_PSEUDO) {
        css += this.generatePseudo(vunocss)
      }
      else if (vunocss.flag & Flags.CLASS_STRING) {
        // console.log('vunocss.className', vunocss.className)
        css += this.generateString(vunocss)
      }
    })
    // console.log(css)
    this._ctx._css = css
    this._ctx.reset()
  }

  generateString(vunocss: Vunocss) {
    const { className } = vunocss
    const attrStr = this.generateAttrs(vunocss)
    return `.${replaceClassName(className)}{${attrStr}}`
  }

  generatePseudo(vunocss: Vunocss) {
    const { className, pseudo } = vunocss
    const attrStr = this.generateAttrs(vunocss)
    return `.${replaceClassName(className)}:${pseudo}{${attrStr}}`
  }

  generateAttrs(vunocss: Vunocss) {
    let attrStr = ''
    Object.keys(vunocss.attrs).forEach((key) => {
      const value = vunocss.attrs[key]
      attrStr += `${key}:${this.parseAttrValue(value)};`
    })

    return attrStr
  }

  parseAttrValue(value: string) {
    return isNotUnit(value) ? value : removeBrackets(value)
  }
}

function replaceClassName(className: string) {
  return className.replace(/\:/, '\\:').replace(/\[/, '\\[').replace(/\]/, '\\]')
}
function removeBrackets(str: string) {
  return str.replace(/\[/, '').replace(/\]/, '')
}
function isNotUnit(str: string) {
  return !!(parseInt(str[str.length - 1]) + 1)
}
