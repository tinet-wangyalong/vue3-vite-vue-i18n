# vue3-vite-vue-i18n
vite的常用配置和国际化处理

# vite配置

## CSS 预处理器配置

preprocessorOptions: {
    scss: {
        additionalData: `@import '/src/assets/style/constant.scss';`
    }
}

## 别名
resolve: {
    alias: {
        "@": path.resolve(__dirname, './src') // 路径别名,
    },
}

## postcss配置移动端

## resolve.extensions

## 拆包策略

# 插件
## vite-plugin-vue-setup-extend
直接在setup定义name
```
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>

<script setup name="MyComponent">
import { ref } from 'vue';

const message = ref('Hello, world!');
</script>
```

## @vitejs/plugin-legacy
兼容的版本
开发环境配置babel，生产环境配置legacy

## @vitejs/plugin-vue
支持vue语法

## unplugin-auto-import/vite 自动导入
```
1、安装插件
2、vite.config.js中配置插件
3、修改tsconfig.json
```
## vite-plugin-compression
打包视图分析插件

## vite-plugin-svg-icons
处理 SVG 图标。它可以将多个 SVG 文件打包成一个 SVG Sprite，从而高效地管理和使用 SVG 图标
使用方法：
1、mainjs中注入：`import 'virtual:svg-icons-register';`
2、vue中使用：
``` 
<template>
  <div>
    <svg aria-hidden="true" class="icon">
      <use xlink:href="#icon-home"></use>
    </svg>
    <svg aria-hidden="true" class="icon">
      <use xlink:href="#icon-user"></use>
    </svg>
  </div>
</template>

<style>
.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
```

手动注入：
1、mainjs文件
```
// 手动注入 SVG Sprite 到特定 DOM 节点
const injectSvgSprite = async (selector) => {
  const res = await fetch('/src/icons/sprite.svg');
  const svgSprite = await res.text();
  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = svgSprite;
  }
};

injectSvgSprite('body'); // 或者其他选择器，例如 '#my-custom-icons'
```
2、index.html文件
```
<body>
  <div id="app"></div>
  <!-- 插件将自动在此处注入 SVG sprite -->
  <div id="my-custom-icons" style="display: none;"></div>
</body>
```

# build基础配置
1、minify：
false：不进行代码压缩。
true：默认使用 terser 进行代码压缩。
terser：使用 terser 进行代码压缩。
esbuild：使用 esbuild 进行代码压缩。

2、terserOptions
当使用 Vite 配置 build.minify 为 terser 时，可以通过 terserOptions 来进一步配置 Terser 的行为。Terser 是一个高度可配置的 JavaScript 压缩工具，支持多种压缩和优化选项。
`ompress：配置压缩选项。`
drop_console: 删除所有 console 语句，默认值为 false。
drop_debugger: 删除所有 debugger 语句，默认值为 true。
pure_funcs: 指定不影响结果的函数列表，Terser 会直接删除这些函数调用。
format：配置输出选项（以前叫 output）。

comments: 控制是否保留注释，默认值为 true。可以设置为 false 或者一个函数，来决定哪些注释应该被保留。
beautify: 美化输出（不会压缩），默认值为 false。
mangle：配置变量和函数名的混淆选项。

properties: 配置对象属性的混淆。
toplevel：启用顶级变量和函数名的混淆，默认值为 false。
3、rollupOptions
分包设置
