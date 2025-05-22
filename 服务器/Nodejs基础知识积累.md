### Node 在项目中用到的点滴记录
  ###### process.cwd()
    - 用于获取Node.js进程中，当前的工作目录
    - 返回的是，Nodejs进程启动时的工作目录的绝对路径
    - 通常是在启动 Node.js 应用程序时指定的，或者是在命令行中运行 Node.js 时的当前目录

    
  ###### resolve()
    - vite.config.ts 文件里，表示自动生成文件的目录地址，直接写不生效
    - 需要使用 resolve() 方法，将相对路径转换为绝对路径

    import path from 'path';
    const resolve = (filePath) => path.resolve(__dirname, filePath);

  ###### path 模块 - 他提供了一些用于处理和转换文件路径的工具， 特别是在操作系统
    - path.join() - 用于将多个路径片段拼接成一个路径片段
