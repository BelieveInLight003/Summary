### Node 在项目中用到的点滴记录

###### process.cwd()

- 用于获取 Node.js 进程中，当前的工作目录
- 返回的是，Nodejs 进程启动时的工作目录的绝对路径
- 通常是在启动 Node.js 应用程序时指定的，或者是在命令行中运行 Node.js 时的当前目录

###### resolve()

- vite.config.ts 文件里，表示自动生成文件的目录地址，直接写不生效
- 需要使用 resolve() 方法，将相对路径转换为绝对路径

  import path from 'path';
  const resolve = (filePath) => path.resolve(\_\_dirname, filePath);

###### path 模块 - 提供了一些用于处理和转换文件路径的工具， 特别是在操作系统

- path.join() - 用于将多个路径片段拼接成一个路径片段

###### fs 模块 文件系统交互

这个模块对所有文件系统操作提供异步（不具有 sync 后缀）和同步（具有 sync 后缀）两种操作方式，而供开发者选择

### fs 模块常用方法

- fs.existsSync 同步检查文件或目录是否存在
- fs.statSync 同步地获取文件或目录的状态信息，包括文件大小、创建时间、修改时间等。这个方法不仅适用于文件，也适用于目录
