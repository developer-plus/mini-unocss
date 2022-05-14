var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  miniunocss: () => miniunocss
});
module.exports = __toCommonJS(src_exports);

// src/regexps.ts
var classReg = /class=[\"|\'](.+?)[\"|\']/g;

// src/generator.ts
var CssGenerator = class {
  constructor(_ctx) {
    this._ctx = _ctx;
  }
  generateCss() {
    const ctx = this._ctx;
    let css = "";
    ctx._vunocss.forEach((vunocss) => {
      if (vunocss.flag === "pseudo") {
        css += this.generatePseudo(vunocss);
      } else if (vunocss.flag === "class") {
        css += this.generateString(vunocss);
      }
    });
    console.log(css);
    this._ctx.reset();
  }
  generateString(vunocss) {
    const { className } = vunocss;
    const attrStr = this.generateAttrs(vunocss);
    return `.${className}{${attrStr}}`;
  }
  generatePseudo(vunocss) {
    const { className, pseudo } = vunocss;
    const attrStr = this.generateAttrs(vunocss);
    return `.${replaceClassName(className)}:${pseudo}{${attrStr}}`;
  }
  generateAttrs(vunocss) {
    let attrStr = "";
    Object.keys(vunocss.attrs).forEach((key) => {
      const value = vunocss.attrs[key];
      attrStr += `${key}:${value};`;
    });
    return attrStr;
  }
};
function replaceClassName(className) {
  return className.replace(/\:/, "\\:");
}

// src/compiler.ts
var Compiler = class {
  constructor(_ctx) {
    this._ctx = _ctx;
    this.patch();
  }
  patch() {
    this.compilerClass();
  }
  compilerClass() {
    const cssGenerator = new CssGenerator(this._ctx);
    this._ctx._classNameSet.forEach((vClass) => {
      this.compilerClassByRuleSting(vClass);
      this.compilerClassByRuleReg(vClass);
    });
    console.log(this._ctx._vunocss);
    cssGenerator.generateCss();
  }
  compilerClassByRuleSting(vClass) {
    console.log(this._ctx._rulesSting);
    this._ctx._rulesSting.forEach((rulesSting) => {
      const ruleSting = rulesSting[0];
      const fnRes = rulesSting[1]();
      const { name } = vClass;
      if (name === ruleSting) {
        loadCache(this._ctx, vClass, fnRes);
      }
    });
  }
  compilerClassByRuleReg(vClass) {
    this._ctx._rulesReg.forEach((rulesReg) => {
      const reg = rulesReg[0];
      const fn = rulesReg[1];
      const { className, flag, name } = vClass;
      const exec = reg.exec(name);
      console.log(exec);
      if (exec) {
        const fnRes = fn(exec);
        loadCache(this._ctx, vClass, fnRes);
      }
    });
  }
};
function loadCache(ctx, vClass, fnRes) {
  const { className, flag, name, pseudo } = vClass;
  let cacheVunocss = ctx._cache.get(className);
  if (!cacheVunocss) {
    cacheVunocss = {
      className,
      attrs: fnRes,
      flag,
      pseudo,
      name
    };
    ctx._cache.set(className, cacheVunocss);
  }
  ctx._vunocss.push(cacheVunocss);
}

// src/context.ts
function createContext(presets) {
  return new Context(presets);
}
var Context = class {
  _presets;
  _rulesSting = [];
  _rulesReg = [];
  _classNameSet = /* @__PURE__ */ new Set();
  _vunocss = [];
  _cache = /* @__PURE__ */ new Map();
  constructor(presets) {
    this._presets = presets;
    this.initRules(this._presets);
  }
  initRules(presets) {
    presets.forEach((preset) => {
      preset.rules.forEach((rule) => {
        const flag = rule[0];
        if (typeof flag === "string") {
          this._rulesSting.push(rule);
        } else if (flag.test) {
          this._rulesReg.push(rule);
        }
      });
    });
  }
  parseCode(code) {
    this.extractClasses(code);
    new Compiler(this);
  }
  extractClasses(code) {
    while (true) {
      const exec = classReg.exec(code);
      if (exec) {
        const res = exec[1];
        res.split(" ").forEach((it) => {
          const splitClass = it.split(":");
          if (splitClass.length > 1) {
            this._classNameSet.add({
              className: it,
              flag: "pseudo",
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
    this._vunocss.length = 0;
    this._classNameSet.clear();
  }
};

// src/utils.ts
var vueFile = /.vue$/;
function filterVue(id) {
  return vueFile.test(id);
}

// src/index.ts
function miniunocss({ presets }) {
  const context = createContext(presets);
  return {
    name: "miniunocss",
    enforce: "pre",
    transform(code, id) {
      if (!filterVue(id))
        return;
      context.parseCode(code);
      return null;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  miniunocss
});
//# sourceMappingURL=index.js.map