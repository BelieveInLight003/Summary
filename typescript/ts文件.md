### 代码逻辑：.ts 文件中的函数、类、变量赋值等会被编译为 JS 并执行
### 类型声明文件（.d.ts）：仅用于类型提示，不参与编译后的执行

### 项目配置文件 功能区分  # 用于 Node.js 脚本（如 Vite 配置、构建脚本）
#### tsconfig.node.json  
  1. 为Nodejs脚本 (如构建配置， CLI工具)设计的TspeScript配置，避免与前端代码混用，提高类型安全和编译效率
  2. 在tsconfig.json里引入
```
// tsconfig.json
{
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```
  3. 文件
```
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "target": "ES2020",
    "types": ["node"]
  },
  "include": ["vite.config.ts", "scripts/**/*"]
}
```
#### 关键字段解析：
| 字段                           | 作用                               |
| ---------------------------- | -------------------------------- |
| `"composite": true`          | 启用项目引用，支持增量编译（常用于 monorepo）      |
| `"module": "ESNext"`         | 使用现代模块语法（如 `import`）             |
| `"moduleResolution": "Node"` | 使用 Node.js 风格的模块解析               |
| `"types": ["node"]`          | 引入 Node.js 的类型定义（如 `fs`, `path`） |
| `"include"`                  | 明确指定要编译的文件（如 `vite.config.ts`）   |


#### tsconfig.json
- 用于浏览器/前端代码
  

| 字段                                | 值                                     | 解释                                                                              |
| --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| `"target": "ESNext"`              | 最新 ECMAScript 语法                      | 编译后的 JS 语法版本，**不降级**，完全交给 Vite 处理。                                              |
| `"useDefineForClassFields": true` | 启用“原生”类字段语义                           | 与标准对齐；Vue 3 的响应式系统依赖此行为。                                                        |
| `"module": "ESNext"`              | ES 模块语法                               | `import/export` 保持原样，打包器（Vite）再处理。                                              |
| `"moduleResolution": "Node"`      | Node 风格解析                             | 兼容老模块包；**Vite 项目其实更推荐 `"bundler"`**，但 `"Node"` 也能跑。                             |
| `"strict": true"`                 | 启用所有严格检查                              | 相当于一次性打开 `strictNullChecks`、`strictFunctionTypes` 等。                            |
| `"jsx": "preserve"`               | 不转换 JSX                               | 让 Vue 的 JSX 插件（`@vitejs/plugin-vue-jsx`）后续处理。                                   |
| `"sourceMap": true`               | 生成 `.map` 文件                          | 调试 TS 源码用。                                                                      |
| `"resolveJsonModule": true`       | 允许 `import pkg from './package.json'` | 直接导入 JSON 文件，带类型提示。                                                             |
| `"isolatedModules": true`         | 单文件编译模式                               | 与 `esbuild` / `swc` 等工具保持一致，防止跨文件语法错误。                                          |
| `"esModuleInterop": true`         | 兼容 CommonJS 默认导出                      | 让 `import fs from 'fs'` 不报错。                                                    |
| `"lib": ["ESNext", "DOM"]`        | 引入库声明                                 | 支持最新 ES 语法 + 浏览器 DOM API。                                                       |
| `"skipLibCheck": true`            | 跳过 `.d.ts` 文件检查                       | 加速编译；第三方库类型有错也能过。                                                               |
| `"types": ["vue/macros-global"]`  | 额外全局类型                                | 让 `defineProps`、`defineEmits` 等 Vue 宏在全局可用，**不写 import 也能用**。                   |
| `"paths"`                         | 路径别名                                  | `/src/*` 和 `@/*` 都映射到 `./src/*`，模板里可写 `import Foo from '@/components/Foo.vue'`。 |

- include 详解（哪些文件被 TS 处理）

| 模式                                                            | 作用                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| `"src/**/*.ts"`                                               | 所有 TS 逻辑文件                                           |
| `"src/**/*.d.ts"`                                             | 手动写的类型声明                                             |
| `"src/**/*.tsx"`                                              | JSX/TSX 组件（Vue 3 也支持 `.tsx`）                         |
| `"src/**/*.vue"`                                              | 单文件组件                                                |
| `"components.d.ts"`                                           | `unplugin-vue-components` 自动生成的全局组件类型                |
| `"node_modules/vite-plugin-pwa/client.d.ts"`                  | PWA 插件的客户端类型                                         |
| `"window.d.ts"`                                               | 你自定义的全局 `window` 类型扩展                                |
| `"src/pages/shou-biao/components/ShowConfirmDialog/index.js"` | **特例**：显式把单个 `.js` 文件拉进来，让它也能享受类型检查（可能你在渐进迁移 JS→TS）。 |

