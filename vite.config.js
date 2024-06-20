import { defineConfig, loadEnv } from 'vite'     // vite工具箱
import { fileURLToPath, URL } from "node:url";
import path from 'path'
// import postcssPxToViewport from 'postcss-px-to-viewport'
import vue from "@vitejs/plugin-vue";   // vue语法支持
import AutoImport from 'unplugin-auto-import/vite'  // 自动导入
// import viteCompression from "vite-plugin-compression";
const postcssPresetEnv = require("postcss-preset-env") 
import legacy from '@vitejs/plugin-legacy'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
// import babel from '@rollup/plugin-babel';
import vueSetupExtend from "vite-plugin-vue-setup-extend";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
export default defineConfig(({mode}) => {
    const outDirPrefix = mode === "production" ? `./dist/static` : `./dist/static_dev`;
    const env = loadEnv(mode, process.cwd() + "/env");  // 环境变量
    console.log(`${outDirPrefix}${env.VITE_APP_OUTDIR_PREFIX}`)
    console.log(env)
    return {
        // 配置选项
        base: `${env.VITE_APP_BASE_PREFIX}`,  // 绝对 URL 路径
        envDir: "env",  // 指定环境变量文件
        server: {
            host: "0.0.0.0",    // 监听所有地址
            cors: true,
            open: true,
            port: Number(env.VITE_APP_PORT),
            historyApiFallback: true,
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_PROXY_URL,
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
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: true, // 删除所有 console 语句
                    drop_debugger: true, // 删除所有 debugger 语句
                    pure_funcs: ['console.info', 'console.debug'] // 删除指定的函数调用
                },
                format: {
                    comments: false // 删除所有注释
                },
                mangle: {
                    properties: {
                        // 混淆属性名称的选项
                        regex: /^_/ // 仅混淆以 _ 开头的属性名
                    }
                },
                // oplevel: true // 启用顶级变量和函数名的混淆
            },
            outDir: `${outDirPrefix}${env.VITE_APP_OUTDIR_PREFIX}`, // 打包文件的输出目录
            assetsInlineLimit: "4096", // 小于此阈值的导入或引用资源将内联为 base64 编码
            chunkSizeWarningLimit: 2000, // chunk 大小警告的限制
            emptyOutDir: true, //打包前先清空原有打包文件
            assetsDir: 'static', // 静态资源的存放目录
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
            },
        },
        define: {
            __INTLIFY_PROD_DEVTOOLS__: false,   // Vue I18n（国际化库）相关的全局常量
            "process.env": process.env,     // 全局变量
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
            vueSetupExtend(),
            createSvgIconsPlugin({
                iconDirs: [
                    fileURLToPath(new URL("./src/assets/img/svg", import.meta.url)),
                    // import.meta.url: 当前文件系统路径 例如：file:///path/to/module.js
                    // new URL()：创建当前文件路径的绝对路径 例如：http://...s
                    // fileURLToPath：用于将文件 URL 转换为文件路径 例如：/path/to/module.js
                    // path.dirname：当前模块所在目录的路径 例如：/path/to
                    // 为什么要用：fileURLToPath处理路径
                    // 正确和一致地处理文件路径，特别是在跨平台开发和使用 ES 模块时，因为window或者mac等电脑的系统文件位置是不一样的
                ],
                symbolId: "icon-[dir]-[name]",
                inject: "body-last",    // true代表自动注入；false或者其他需要手动注入
                customDomId: "__svg__icons__dom__", // 自定义注入到 HTML 中的 SVG Sprite 的容器节点的 ID
            }),
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
                // 解决组件命名冲突问题
                directoryAsNamespace: true,
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
    }
  })