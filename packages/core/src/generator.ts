import type { Context } from './context'

export class CssGenerator {
  constructor(public _ctx: Context) {
  }

  generateCss() {
    let css = ''
    this._ctx._vunocss.forEach((vunocss) => {
      let attrStr = ''
      Object.keys(vunocss.attrs).forEach((key) => {
        const value = vunocss.attrs[key]
        attrStr += `${key}:${value};`
      })
      css += `.${vunocss.key}{${attrStr}}`
    })
    // eslint-disable-next-line no-console
    console.log(css)
    this._ctx.reset()
    return css
  }
}
