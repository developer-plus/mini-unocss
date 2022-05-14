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
  convertCss() {
    let css = "";
    this._ctx._vunocss.forEach((vunocss) => {
      let attrStr = "";
      Object.keys(vunocss.attrs).forEach((key) => {
        const value = vunocss.attrs[key];
        attrStr += `${key}:${value};`;
      });
      css += `.${vunocss.key}{${attrStr}}`;
    });
    console.log(css);
    this._ctx.reset();
    return css;
  }
};

// src/compiler.ts
var Compiler = class {
  constructor(_ctx) {
    this._ctx = _ctx;
  }
  patch() {
    this.compilerToClassName();
  }
  compilerToClassName() {
    this._ctx._classNameSet.forEach((className) => {
      this._ctx._rulesSting.forEach((rulesSting) => {
        const ruleSting = rulesSting[0];
        const fnRes = rulesSting[1]();
        if (className === ruleSting) {
          loadCache(this._ctx, className, fnRes);
        }
      });
      this._ctx._rulesReg.forEach((rulesReg) => {
        const reg = rulesReg[0];
        const fn = rulesReg[1];
        const exec = reg.exec(className);
        if (exec) {
          const fnRes = fn(exec);
          loadCache(this._ctx, className, fnRes);
        }
      });
    });
    const cssGenerator = new CssGenerator(this._ctx);
    cssGenerator.convertCss();
  }
};
function loadCache(ctx, className, fnRes) {
  let cacheVunocss = ctx._cache.get(className);
  if (cacheVunocss) {
  } else {
    cacheVunocss = {
      key: className,
      attrs: fnRes
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
  _pseudoClassSet = /* @__PURE__ */ new Set();
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
  generatorCode(code) {
    while (true) {
      const exec = classReg.exec(code);
      if (exec) {
        const res = exec[1];
        res.split(" ").forEach((it) => {
          if (/\:/.test(it)) {
            this._pseudoClassSet.add(it);
          } else {
            this._classNameSet.add(it);
          }
        });
      } else {
        break;
      }
    }
    const compiler = new Compiler(this);
    compiler.patch();
  }
  reset() {
    this._vunocss.length = 0;
    this._classNameSet.clear();
    this._pseudoClassSet.clear();
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
      context.generatorCode(code);
      return null;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  miniunocss
});
//# sourceMappingURL=index.js.map