# mini-unocss (WIP)

一个即时按需的原子 CSS 引擎，[unocss](https://github.com/unocss/unocss) 的 mini 版本。

> 注意，当前版本代码仍很不完善，`mini-unocss` 即将大重构，若您想参与贡献/研究原理，可关注项目开发进度。
> 
> move to [amcss](https://github.com/developer-plus/amcss)(重构版本)

## 使用

### 安装依赖

``` bash
pnpm add @developer-plus/mini-unocss @developer-plus/mini-unocss-preset -D
```

### 修改 `vite.confg.ts` 文件

``` ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { miniunocss } from '@developer-plus/mini-unocss'
import preset from '@developer-plus/mini-unocss-preset'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    miniunocss({
      presets: preset
    })
  ]
})
```

### 在 `main.ts` 引用 css 文件

``` ts
import { createApp } from 'vue'
import App from './App.vue'
import 'u.css' // 新增
createApp(App).mount('#app')
```

## 目前支持的预设

- 宽：`w-100` | `w-[100vw]`
- 高：`h-100` | `h-[100vh]`
- 背景色：`bg-red` | `bg-#fff`
- hover：`hover:w-100`
- active：`active:w-200`

欢迎大家踊跃提 pr 完善。

## LICENSE

MIT, made with 💗.
