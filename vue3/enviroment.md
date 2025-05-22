### dotenv第三方库，读取环境变量配置文件
  ```
  // 手动加载环境变量
  const dotenv = require('dotenv');
  dotenv.config();

  // 使用加载的环境变量
  const apiUrl = process.env.API_URL;
  ```

### vite内置函数 - loadEnv 专门为 Vite 项目设计，紧密集成在 Vite 的构建和开发流程中
  ######  loadEnv 一般在 vite.config.js 或者 vite.config.ts 中使用
     根据传入的环境模式，加载对应的环境变量文件，并返回一个包含环境变量的对象

     ```
      import { defineConfig, loadEnv } from 'vite';

      export default ({ mode }) => {
          const env = loadEnv(mode, process.cwd());
          return defineConfig({
              // 使用加载的环境变量
              define: {
                  'process.env': env
              },
              // 其他配置...
          });
      };
     ```


  ###### loadEnv 的作用域和访问方式
       loadEnv加载的环境变量会注入到，import.meta.env 里面，在vite项目的代码里可以通过   import.meta.env.VARIABLE_NAME  访问

       ```
       // 在代码中使用 loadEnv 加载的环境变量
       const apiUrl = import.meta.env.VITE_API_URL;
       ```

  ###### 自动加载
      会根据vite的环境模式，自动加载对应的环境变量文件，.env.development、.env.production  并默认加载 VITE_ 开头的变量


  ###### loadEnv参数
      loadEnv(mode, envDir, prefixes)

      - 必填 mode 模式，development/production 
      - 必填 envDir 环境变量文件目录 一般在主项目以及目录下，使用 process.cwd()  来获取当前项目目录
            process.cwd() 是node提供的方法，获取当前项目目录 
      - 可选
         prefixes 可以是 string / string[] 
          默认是 VITE_ 为开头的环境变量

          需要额外添加 可以配置数组 如 ['VITE_', 'APP_'] 

   案例如下
   ```
    import { defineConfig, loadEnv } from 'vite';

    export default ({ mode }) => {
        // 加载当前环境的环境变量，只加载以 'VITE_' 开头的变量
        const env = loadEnv(mode, process.cwd());

        // 加载当前环境的环境变量，加载以 'VITE_' 和 'APP_' 开头的变量
        const envWithAppPrefix = loadEnv(mode, process.cwd(), ['VITE_', 'APP_']);

        return defineConfig({
            // 使用加载的环境变量
            define: {
                'process.env': env
            },
            // 其他配置...
        });
    };
   ```


  ##### 注意
    - 在vite.config.js/ts 中，读取不到import.meta.env  此时环境变量尚未注入
    - 在vite.config.js/ts 中，通过 loadEnv返回的对象，获取当前环境文件存储的变量，

    
    
