### tsc

- tsc 是 TypeScript 编译器的命令行工具
- 将 ts 代码（.ts 文件）编译为 js 代码（.js 文件）
- 脚本作用

```
# 当你在终端运行 npm run build 时，实际上执行的是 tsc 命令，即编译项目中的所有 TypeScript 文件。
# tsc命令把指定文件里的ts文件，编译为js输出，但是本身是js文件则不会识别，需要手动导入或者复制
# copy 复制文件到dist文件夹下
{
  "scripts": {
    "build": "tsc && copy index.html dist\\"
  }
}
```

- 配置文件 tsconfig.json

```
{
   "compilerOptions": {
     "target": "ES2020",      // 编译为 ES2020 版本的 JS
     "module": "commonjs",    // 使用 CommonJS 模块规范
     "outDir": "./dist",      // 输出目录为 dist
     "strict": true           // 启用严格类型检查
   }
}
```

- electron

```
# 在 Electron 项目中，通常需要先编译 TypeScript，再启动 Electron：
{
  "scripts": {
    "build": "tsc",                  // 编译 TypeScript
    "start": "npm run build && electron .",  // 先编译，再启动 Electron
    "dist": "npm run build && electron-builder"  // 打包前先编译
  }
}
```

### tsconfig.json 配置作用

-
