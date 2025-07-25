### 应用1： ESlint 与代码规范的检查
  - 原理： ESlint 通过解析代码为ASY，遍历节点检查是否符合预设规则（如  no-console, semi）
  - AST 关键应用
      识别未定义变量 （检查Identifier 节点是否在作用域内声明）
      验证代码风格 （如，箭头函数括号使用，分号位置）

  
### Terser 与 代码压缩
  - 原理： Terser姜js解析为AST，通过移除注释，缩短变量名，合并语句等优化后生成更小的代码
  - 示例:
  ```
  // 原始代码
  function calculateTotal(a, b) {
    return a + b;
  }

  // Terser 压缩后
  function calculateTotal(n,t){return n+t}
  ```

### Tree Shaking 摇树优化
  - 工具：webpack rollup 等打包工具，基于AST分析未使用的模块到处，实现按需打包
  - 示例：
  ```
  // utils.js
  export const add = (a, b) => a + b;
  export const subtract = (a, b) => a - b;

  // main.js
  import { add } from './utils';
  console.log(add(1, 2));

  // 打包后，subtract 函数会被移除（通过 AST 检测到未被引用）
  ```

### POSTCSS 与 css 转换
  - 原理： PostCss 将Css 解析为 AST （如 postcss插件），通过插件 autoprefixer 添加浏览器前缀
  - 示例：
  ```
  /* 输入 CSS */
  div {
    display: flex;
  }

  /* autoprefixer 处理后 */
  div {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  ```

