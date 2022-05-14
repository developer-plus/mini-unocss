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
var brackets = /\[.+?\]/;

// src/generator.ts
var CssGenerator = class {
  constructor(_ctx) {
    this._ctx = _ctx;
  }
  generateCss() {
    const ctx = this._ctx;
    let css = "";
    ctx._vunocss.forEach((vunocss) => {
      if (vunocss.flag & 4 /* CLASS_PSEUDO */) {
        css += this.generatePseudo(vunocss);
      } else if (vunocss.flag & 1 /* CLASS_STRING */) {
        console.log("vunocss.className", vunocss.className);
        css += this.generateString(vunocss);
      }
    });
    console.log(css);
    this._ctx._css = css;
    this._ctx.reset();
  }
  generateString(vunocss) {
    const { className } = vunocss;
    const attrStr = this.generateAttrs(vunocss);
    return `.${replaceClassName(className)}{${attrStr}}`;
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
      attrStr += `${key}:${this.parseAttrValue(value)};`;
    });
    return attrStr;
  }
  parseAttrValue(value) {
    return isNotUnit(value) ? value : removeBrackets(value);
  }
};
function replaceClassName(className) {
  return className.replace(/\:/, "\\:").replace(/\[/, "\\[").replace(/\]/, "\\]");
}
function removeBrackets(str) {
  return str.replace(/\[/, "").replace(/\]/, "");
}
function isNotUnit(str) {
  return !!(parseInt(str[str.length - 1]) + 1);
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
    cssGenerator.generateCss();
  }
  compilerClassByRuleSting(vClass) {
    this._ctx._rulesSting.forEach((rulesSting) => {
      const ruleSting = rulesSting[0];
      const { name, flag } = vClass;
      const fnRes = rulesSting[1](!(flag & 8 /* ARBITRARY_VALUE */));
      if (name === ruleSting) {
        loadCache(this._ctx, vClass, fnRes);
      }
    });
  }
  compilerClassByRuleReg(vClass) {
    this._ctx._rulesReg.forEach((rulesReg) => {
      const reg = rulesReg[0];
      const fn = rulesReg[1];
      const { name, flag } = vClass;
      const exec = reg.exec(name);
      if (exec) {
        const fnRes = fn(exec, !(flag & 8 /* ARBITRARY_VALUE */));
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
  code;
  _css;
  _presets;
  _rulesSting = [];
  _rulesReg = [];
  _classNameSet = [];
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
    return this._css;
  }
  extractClasses(code) {
    while (true) {
      const exec = classReg.exec(code);
      if (exec) {
        const res = exec[1];
        res.split(" ").forEach((it) => {
          let res2 = {
            className: it,
            flag: 16 /* DEFAULT */
          };
          const splitClass = it.split(":");
          if (splitClass.length > 1) {
            res2.flag |= 4 /* CLASS_PSEUDO */;
            res2.pseudo = splitClass[0];
            res2.name = splitClass[1];
          } else {
            res2.flag |= 1 /* CLASS_STRING */;
            res2.name = it;
          }
          this.hasBrackets(res2);
          this.addClassSet(res2);
        });
      } else {
        break;
      }
    }
  }
  reset() {
    this._vunocss.length = 0;
    this._classNameSet.length = 0;
  }
  hasClassNameSet(vClass) {
    return this._classNameSet.some((v) => {
      return v.className === vClass.className;
    });
  }
  addClassSet(res) {
    if (!this.hasClassNameSet(res)) {
      this._classNameSet.push(res);
    }
  }
  hasBrackets(res) {
    if (brackets.test(res.className)) {
      res.flag |= 8 /* ARBITRARY_VALUE */;
    }
  }
};

// src/utils.ts
var vueFile = /.vue$/;
function filterVue(id) {
  return vueFile.test(id);
}

// src/index.ts
var server;
function invalidateVirtualModule(server2, id) {
  if (!server2)
    return;
  const { moduleGraph, ws } = server2;
  const module2 = moduleGraph.getModuleById(id);
  if (module2) {
    moduleGraph.invalidateModule(module2);
    if (ws) {
      ws.send({
        type: "full-reload",
        path: "*"
      });
    }
  }
}
function update() {
  invalidateVirtualModule(server, "u.css");
}
function miniunocss({ presets }) {
  const context = createContext(presets);
  return {
    name: "miniunocss",
    enforce: "pre",
    transform(code, id) {
      if (!filterVue(id))
        return;
      context.code = code;
      update();
      return null;
    },
    resolveId(i) {
      return i === "u.css" ? i : null;
    },
    load(i) {
      if (i === "u.css") {
        return context.parseCode(context.code);
      }
      return null;
    },
    configureServer(_server) {
      server = _server;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  miniunocss
});
//# sourceMappingURL=index.js.map