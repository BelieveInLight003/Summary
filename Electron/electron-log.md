### electron-log  分析客户端的日志；定位和分析，表象无法找到的问题
 [electron-log 参考链接](https://blog.csdn.net/github_39132491/article/details/144710823)


##### 初始化
  - 在主进程初始化，否则会报错 - 在主进程未初始化
  - 为满足场景，构建electron-log
  - preload实现
  
##### 封装
  ```
  # 类封装
  # src/common/log/api.ts
  class ElectronLogger {
    private static instance: ElectronLogger | null = null;
    private logger: any;
  
    private constructor() {}
  
    private async initialize() {
      try {
        const log = require("electron-log/main")
        log.initialize();
        this.logger = log;
      } catch (error) {
        console.error("Failed to initialize logger:", error);
        this.logger = null;
      }
    }
  
    static getInstance(): ElectronLogger {
      if (ElectronLogger.instance === null) {
        ElectronLogger.instance = new ElectronLogger();
        ElectronLogger.instance.initialize();
      }
      return ElectronLogger.instance;
    }
  
    info(message: string): void {
      this.logger?.info(message);
    }
  
    warn(message: string): void {
      this.logger?.warn(message);
    }
  
    error(message: string): void {
      this.logger?.error(message);
    }
  
    debug(message: string): void {
      this.logger?.debug(message);
    }
  }
  
  export { ElectronLogger };
  ```
  
##### 方法暴露   
  ```
  # 构建可供渲染进程和主进程使用的log方法，暴露
  import { ElectronLogger } from "./api";
 
  export type LOG_TYPE = 'error' | 'warn' | 'info' | 'debug'
  export interface LOG_PARAMS {
    type: LOG_TYPE
    value: string
  }
  
  let loggerInstance: ElectronLogger | null = null;
  
  const ElectronLoggerInstance = () => {
    if (!loggerInstance) {
      loggerInstance = ElectronLogger.getInstance();
    }
    return loggerInstance;
  };
  
  export const Elog = {
    info: (value: string) => {
      if (import.meta.env.VITE_CURRENT_RUN_MODE === "render") {
        window.electronAPI.Elog('info',value)
        console.info(value)
      } else {
        ElectronLoggerInstance().info(value)
      }
    },
    warn: (value: string) => {
      if (import.meta.env.VITE_CURRENT_RUN_MODE === "render") {
        window.electronAPI.Elog('warn',value)
        console.warn(value)
      } else {
        ElectronLoggerInstance().warn(value)
      }
    },
    error: (value: string) => {
      if (import.meta.env.VITE_CURRENT_RUN_MODE === "render") {
        window.electronAPI.Elog('error',value)
        console.error(value)
      } else {
        ElectronLoggerInstance().error(value)
      }
    },
    debug: (value: string) => {
      if (import.meta.env.VITE_CURRENT_RUN_MODE === "render") {
        window.electronAPI.Elog('debug',value)
        console.debug(value)
      } else {
        ElectronLoggerInstance().debug(value)
      }
    }
  }
  ```

##### 注入preload
  ```
  Elog: (type: LOG_TYPE, value: string) => {
    ipcRenderer.send('Elog', { type, value })
  }
  ```
  
##### index文件，接入
  ```
  ipcMain.on('Elog', (event:IpcMainEvent,arg: LOG_PARAMS) => {
    const { type, value } = arg
    switch (type) {
      case 'info':
        Elog.info(value)
        break
      case 'error':
        Elog.error(value)
        break
      case 'warn':
        Elog.warn(value)
        break
      case 'debug':
        Elog.debug(value)
        break
      default:
        console.log('Unknown log type:', type, ...value)
        break
    }
  })
  ```
  