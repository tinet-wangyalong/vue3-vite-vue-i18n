import { defineConfig } from 'vite'     // vite工具箱
import vue from "@vitejs/plugin-vue";   // vue语法支持
import AutoImport from 'unplugin-auto-import/vite'  // 自动导入
const target = "https://www.baidu.cn/"; // test3
export default defineConfig({
    // 配置选项
    base: "/",
    server: {
        host: "0.0.0.0",
        cors: true,
        open: true,
        port: 43210,
        historyApiFallback: true,
        proxy: {
            "/v1": {
            target,
            secure: true,
            changeOrigin: true,
            // 本地模拟联调个人ip的时候用
            // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    plugins: [
        vue(),
        // 自动导入无需代码不停导入
        AutoImport({
            // 转型目标
            include: [
                /\.[tj]sx?$/, 
                /\.vue$/, 
                /\.vue\?vue/, 
                /\.md$/,
            ],
            imports: [
                // 插件预设支持导入的api
                'vue',
                'vue-router',
                'pinia'
                // 自定义导入的api
            ],
            eslintrc: {
                enabled: false, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
            dts: './auto-imports.d.ts',
        })
    ]
  })