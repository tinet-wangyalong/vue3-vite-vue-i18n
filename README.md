# vue3-vite-vue-i18n
vite的常用配置和国际化处理

# vite配置
## AutoImport 自动导入

1、安装插件
2、vite.config.js中配置插件
3、修改tsconfig.json


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


