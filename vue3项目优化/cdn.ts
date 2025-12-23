Content Security Policy of your site blocks the use of 'eval' in JavaScript`.  还是一直在闪


/*
 * @Author: 李运鹏 13145@qq.com
 * @Date: 2025-09-04 11:47:15
 * @LastEditors: 李运鹏 13145@qq.com
 * @LastEditTime: 2025-09-04 11:47:23
 * @FilePath: \admin-4.0\config\vite.config.test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import compressPlugin from 'vite-plugin-compression';
// import viteImagemin from 'vite-plugin-imagemin';
import purgecss from 'vite-plugin-purgecss';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import fs from 'fs';
import path from 'path';
import { getHtmlFiles } from '../src/util/getHtmlFiles/index';

// 10KB 对应的字节数（10*1024）
const SIZE_10KB = 10240;
const timestamp = new Date().getTime();
const getFileSize = (filePath: string): number => {
    try {
        // 拼接完整文件路径（vite 构建时的临时文件路径）
        const fullPath = path.resolve(process.cwd(), filePath);
        // 获取文件状态 → 提取大小（字节）
        const stats = fs.statSync(fullPath);
        return stats.size;
    } catch (err) {
        // 若文件不存在/读取失败，默认返回 0（不压缩）
        console.warn(`读取文件大小失败: ${filePath}`, err);
        return 0;
    }
};
export default defineConfig({
    mode: 'production',
    root: './src/pages',
    // base: '/admin/',
    base: './',
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', '@arco-design/web-vue', 'vue-i18n', 'axios', 'csmart-map'], // 强制预构建核心依赖
        exclude: [], // 排除无需预构建的依赖（如CDN引入的）
        esbuildOptions: {
            target: 'esnext', // 提升预构建目标，减少转换开销
        },
    },
    cacheDir: resolve(__dirname, '../node_modules/.vite'),
    plugins: [
        vue(),
        vueJsx(),
        svgLoader({
            svgoConfig: {
                multipass: true
            },
        }),
        AutoImport({
            resolvers: [ArcoResolver()],
            imports: ['vue', 'pinia', 'vue-i18n'],
            dts: '../pages/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    // sideEffect: true,
                }),
            ],
        }),
        //  配置图片压缩
        // ViteImageOptimizer({
        //     /* 核心配置 */
        //     test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i, // 要处理的文件类型
        //     includePublic: true, // 是否处理 public 目录下的图片
        //     logStats: true, // 在控制台打印压缩比例（很有成就感，建议开启）
            
        //     /* 具体的格式配置 (基于 Sharp) */
        //     png: {
        //         // 0-100，通常 80 是质量与体积的最佳平衡点
        //         quality: 80, 
        //         // 压缩等级 0-9，越大越慢但压缩率越高
        //         compressionLevel: 9, 
        //         // 调色板，设为 true 可显著减小 PNG 体积，但可能有轻微失真，摄影图建议 false，图标建议 true
        //         palette: true, 
        //     },
        //     jpeg: {
        //         // JPEG 有损压缩，75 肉眼几乎看不出区别，体积下降明显
        //         quality: 75, 
        //         progressive: true, // 渐进式加载（先模糊后清晰），提升体验
        //         mozjpeg: true, // 使用 mozjpeg 算法，压缩率更高
        //     },
        //     jpg: {
        //         quality: 75,
        //         progressive: true,
        //         mozjpeg: true,
        //     },
        //     webp: {
        //         lossless: false, // 有损压缩
        //         quality: 80,
        //     },
        //     tiff: {
        //         quality: 80,
        //     },
        //     // GIF 处理比较特殊，通常只优化色彩，不建议过度压缩以免动画卡顿
        //     gif: {
        //         optimizationLevel: 3, 
        //     },
        //     // SVG 优化 (基于 SVGO)
        //     svg: {
        //         multipass: true, // 多次扫描优化
        //         plugins: [
        //             // 默认插件配置，可以根据需要禁用某些破坏性优化
        //             {
        //             name: 'preset-default',
        //             params: {
        //                 overrides: {
        //                 cleanupIDs: false, // 避免清理 ID 导致引用失效
        //                 removeViewBox: false, // 强烈建议设为 false，否则 SVG 可能无法缩放
        //                 removeUnknownsAndDefaults: false,
        //                 },
        //             },
        //             },
        //             'sortAttrs',
        //             {
        //                 name: 'addAttributesToSVGElement',
        //                 params: {
        //                     attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
        //                 },
        //             },
        //         ],
        //     },
        // }),
        compressPlugin({
            ext: '.gz',
            deleteOriginFile: false, // 过滤规则：仅处理文件大小 ≤ 10KB 的文件
            filter: (file: string) => {
                const fileSize = getFileSize(file);
                // 仅处理 ≤ 10KB 的文件
                return fileSize > 0 && fileSize <= SIZE_10KB;
            },
            threshold: 0, // 阈值设为0（确保所有小文件都进入过滤逻辑）
        }),
        // 新增Brotli压缩
        // compressPlugin({
        //     ext: '.br',
        //     algorithm: 'brotliCompress',
        //     deleteOriginFile: false,
        //     filter: (file: string) => {
        //         const fileSize = getFileSize(file);
        //         // 仅处理 > 10KB 的文件
        //         return fileSize > SIZE_10KB;
        //     },
        //     threshold: SIZE_10KB, // 仅压缩大于10kb的文件
        //     compressionOptions: {
        //         level: 11, // brotli最高压缩级别（1-11，级别越高压缩率越高，耗时略长）
        //     },
        // }),
        // viteImagemin({
        //     gifsicle: { optimizationLevel: 3 }, // gif优化
        //     optipng: { optimizationLevel: 7 }, // png优化
        //     mozjpeg: { quality: 80 }, // jpg质量
        //     pngquant: { quality: [0.7, 0.8], speed: 4 },
        //     svgo: {
        //         plugins: [
        //             { name: 'removeViewBox', active: false },
        //             { name: 'cleanupIDs', active: true }, // 清理SVG无用ID
        //         ],
        //     },
        // }),
        // purgecss({
        //     content: [
        //         resolve(__dirname, '../src/**/*.vue'),
        //         resolve(__dirname, '../src/**/*.tsx'),
        //         resolve(__dirname, '../src/**/*.html'),
        //     ],
        //     safelist: {
        //         standard: [/^arco-/], // 保留ArcoDesign的样式前缀（避免误删）
        //         // 避免闪屏
        //         deep: [/:enter/, /:leave/, /fade/, /slide/, /modal/], // 保留 Vue 过渡类
        //         greedy: [/^router-/, /^nprogress/, /^arco-menu/], // 动态生成的类名
        //     },
        // }),
        // createHtmlPlugin({
        //     minify: {
        //         collapseWhitespace: true, // 折叠空白
        //         removeComments: true, // 移除注释
        //         removeEmptyAttributes: true, // 移除空属性
        //     },
        //     // 注入环境变量到HTML
        //     inject: {
        //         data: {
        //             timestamp, // 注入时间戳防缓存
        //             base: '/admin/',
        //         },
        //         tags: [
        //             // 1. 先加载 CSS
        //             {
        //               tag: 'link',
        //               attrs: {
        //                 rel: 'preload',
        //                 as: 'style',
        //                 href: 'https://cdn.jsdelivr.net/npm/video.js@8.5.2/dist/video-js.css'
        //               },
        //               injectTo: 'head'
        //             },
        //             // 2. 再加载 JS（defer 确保在模块前）
        //             {
        //               tag: 'script',
        //               attrs: {
        //                 src: 'https://cdn.jsdelivr.net/npm/video.js@8.5.2/dist/video.min.js',
        //                 async: true
        //               },
        //               injectTo: 'head'
        //             },
        //             // {
        //             //     tag: 'meta',
        //             //     injectTo: 'head',
        //             //     attrs: {
        //             //         'http-equiv': 'Content-Security-Policy',
        //             //         content: "script-src 'self' 'unsafe-eval'; object-src 'self';"
        //             //     }
        //             // }
        //           ]
        //     },
        // }),
        // visualizer({
        //     open: true,  //注意这里要设置为true，否则无效
        //     filename: "stats.html", //分析图生成的文件名
        //     gzipSize: true, // 收集 gzip 大小并将其显示
        //     brotliSize: true, // 收集 brotli 大小并将其显示
        // }),
        // externalCDN({
        //     modules: [
        //       {
        //         name: 'video.js',
        //         var: 'videojs',  // 全局变量名，必须匹配
        //         path: 'https://cdn.jsdelivr.net/npm/video.js@8.5.2/dist/video.min.js'
        //       }
        //     ]
        //   })
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, '../src'),
            },
            {
                find: 'assets',
                replacement: resolve(__dirname, '../src/assets'),
            },
            {
                find: 'vue',
                replacement: 'vue/dist/vue.esm-bundler.js',
            },
            {
                find: /^echarts$/,
                replacement: path.resolve(__dirname, '../src/util/echarts/index.ts'),
                customResolver(source, importer) {
                    // 如果导入者是配置文件自身，跳过别名
                    if (importer && importer.includes('src\\util\\echarts\\index.ts')) {
                      return null // Vite 会继续从 node_modules 解析
                    }
                    
                    // 其他情况正常返回别名路径
                    return resolve(__dirname, '../src/util/echarts/index.ts')
                  }
            },
        ],
        extensions: ['.ts', '.tsx', '.js'],
    },
    define: {
        'process.env': {
            API_CN_BASE_URL: 'https://c-smart-gatwey.csmart-test.com/', // 内地API请求地址
            API_MACAU_BASE_URL: 'https://c-smart-gatwey.csmart-test.com/', // 澳门API请求地址
            VIDEO_PLAY_JIXIE_URL: 'https://mileview-hk.c-smart.cn/808gps/open/player/video.html', // 机械360播放器
            API_HK_BASE_URL: 'https://c-smart-gatwey.csmart-test.com/', // 香港API请求地址
            // API_HK_BASE_URL: 'https://test-gateway3.c-smart.hk/', // 香港API请求地址
            TENANT_ID: 1660324805547,
            timestamp,
            versionType: '测试服',
            happyWorker: 'happy-worker-5',
            versionTypeCode: 'test',
        },
    },
    build: {
        target: 'esnext',
        outDir: '../../dist',
        assetsDir: '../../assets',
        assetsInlineLimit: 4096,
        cssCodeSplit: false, // 出现闪屏，先关闭
        sourcemap: false,
        emptyOutDir: true,
        minify: 'esbuild',
        rollupOptions: {
            onwarn: (warning:any, warn:any)=> {
                if (warning.code === 'EVAL') return;
                if (warning.message.includes('Use of eval')) return; 
                if (warning.code === 'SOURCEMAP_ERROR') return;
                // 新增：忽略 Rollup 无法识别注释的警告
                // 检查警告代码是否为 'ANNOTATION_REMOVED' (Rollup 5.x 可能会是这个代码)
                // 或者检查消息是否包含特定关键词
                if (warning.code === 'ANNOTATION_REMOVED' || 
                    (warning.message.includes('A comment') && warning.message.includes('contains an annotation that Rollup cannot interpret'))
                ) {
                    // 还可以进一步限定只忽略 node_modules 中的文件
                    if (warning.loc && warning.loc.file && warning.loc.file.includes('node_modules/mathjs')) {
                        return;
                    }
                }
                // 默认行为
                warn(warning);
            },
            input: getHtmlFiles(resolve(__dirname, '../src/pages')),
            output: {
                // 静态资源分类打包
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
     
                // eslint-disable-next-line consistent-return
                // manualChunks(id) {
                //     // 静态资源分拆打包
                //     if (id.includes('node_modules')) {
                //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
                //     }
                // },
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        const str = id.toString().split('node_modules/')[1];
                        // 核心库
                        // if (str.includes('vue')) return 'vendor-vue';
                        // if (str.includes('pinia')) return 'vendor-pinia';
                        // if (str.includes('vue-router')) return 'vendor-router';
                        // if (str.includes('@vueuse')) return 'vendor-vueuse';
                        // if (str.includes('@arco-design')) return 'vendor-arco';

                        // if (str.includes('vue') || str.includes('pinia') || str.includes('router')) return 'vendor-core';
                        // 将大库分离
                        if (str.includes('echarts') || str.includes('zrender')) return 'vendor-charts';
                        if (str.includes('three')) return 'vendor-three';
                        if (str.includes('lodash-es'))    return 'vendor-lodash';
                        if (str.includes('dayjs'))        return 'vendor-dayjs';
                        if (str.includes('axios'))        return 'vendor-axios';
                        // 其他小库合并
                        return 'vendor-libs';
                    }
                },
            },
            external: ['video.js']
        },
        // terserOptions: {
        //     compress: {
        //         drop_console: true,
        //         drop_debugger: true,
        //     },
        // },
    },
    esbuild: {
        minifyIdentifiers: true, // 压缩标识符
        minifySyntax: true, // 压缩语法
        minifyWhitespace: true, // 压缩空格
        // 可选：其他 esbuild 全局配置（如语法降级）
        target: 'esnext',
    },
});
