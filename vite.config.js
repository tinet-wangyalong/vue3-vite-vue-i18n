import { defineConfig } from 'vite'     // vite工具箱
import path from 'path'
// import postcssPxToViewport from 'postcss-px-to-viewport'
import vue from "@vitejs/plugin-vue";   // vue语法支持
import AutoImport from 'unplugin-auto-import/vite'  // 自动导入
// import viteCompression from "vite-plugin-compression";
const postcssPresetEnv = require("postcss-preset-env") 
import legacy from '@vitejs/plugin-legacy'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import babel from '@rollup/plugin-babel';
const target = "https://www.baidu.cn/"; // test3
export default defineConfig({
    // 配置选项
    base: "/",  // 绝对 URL 路径
    server: {
        host: "0.0.0.0",    // 监听所有地址
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
            "@": path.resolve(__dirname, './src') // 路径别名,
        },
        //文件类型，默认值
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import '/src/assets/style/constant.scss';`
            }
        },
        postcss: {
            plugins: [
                // viewport 布局适配
                // postcssPxToViewport({
                //     viewportWidth: 375
                // }),
                postcssPresetEnv()
            ]
        },
        // devSourcemap:true    // css的映射
    },
    build: {
        outDir: 'build', // 打包文件的输出目录
        assetsDir: 'static', // 静态资源的存放目录
        assetsInlineLimit: 4096, // 图片转 base64 编码的阈值
        rollupOptions: {
            // 最小化拆分包 
            output: {
                manualChunks: (id) => {
                    // vue axios相关
                    if (
                        id.includes("node_modules") &&
                        (id.includes("vue") || id.includes("axios"))
                    ) {
                        return "vendor01";
                    }
                    // ui模块
                    if (id.includes("node_modules") && id.includes("element-plus")) {
                        return "vendor02";
                    }
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }
                },
                // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
                entryFileNames: "js/[name].[hash].js",
                // 用于命名代码拆分时创建的共享块的输出命名
                chunkFileNames: "js/[name].[hash].js",
            }
        }
    },
    // optimizeDeps: {
    //     force: true // 强制进行依赖预构建
    // },
    plugins: [
        legacy({
            targets: ['chrome < 60', 'edge < 15'],
            renderLegacyChunks: true,
        }),
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
                'pinia',
                'vue-i18n'
                // 自定义导入的api
            ],
            eslintrc: {
                enabled: false, // Default `false`
                filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
                globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
            },
            dts: './auto-imports.d.ts',
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        // {
        //     ...babel({
        //         include: [/\.vue$/, /\.ts$/, /\.tsx$/, /\.jsx$/, /\.js$/],
        //         extensions: ['.vue', '.ts', '.js', '.tsx', '.jsx'],
        //         presets: [
        //         [
        //             '@babel/preset-env',
        //             {
        //             useBuiltIns: 'usage',
        //             corejs: 3,
        //             targets: {
        //                 chrome: '72',
        //             },
        //             modules: false,
        //             },
        //         ],
        //         ],
        //     }),
        //     // 只在开发环境下生效
        //     apply: 'serve',
        // },
        // viteCompression({
        //   verbose: true, // 是否在控制台中输出压缩结果
        //   disable: false,
        //   threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        //   algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        //   ext: '.gz',
        //   deleteOriginFile: true // 源文件压缩后是否删除(我为了看压缩后的效果，先选择了true)
        // }),
    ]
  })