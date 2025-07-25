### AST 抽象语法树在前端的核心应用
   AST 在前端领域的核心价值，就是将代码转换为可操作的数据结构，从而实现跨工具链的自动处理。
   从编译，检查，到优化，AST已经成为现在前端工程化的基石，支撑Babel,EsLint,Webpack等关键工具的运行


#### babel的编译过程
  babel的转换流程是：解析(Parsing) -> 转换(Transformation) -> 生成(Code Generation)，核心是通过 <span style="color: red;">AST</span> 实现语法转换。

  #### 1 解析阶段： 通过parsing将源代码解析为抽象语法树(AST) 分为两个步骤：
  ###### 词法分析：将源代码解析为tokens（词法单元）， 比如数字、运算符、关键字、标识符等等。

  ```
  // 源代码
  const sum = (a, b) => a + b;V

  // 分解为 tokens
  [
    { type: 'Keyword', value: 'const' },
    { type: 'Identifier', value: 'sum' },
    { type: 'Punctuator', value: '=' },
    { type: 'Punctuator', value: '(' },
    // ... 更多 tokens
  ]
  ```
    
  ######   语法分析：将词法单元解析为抽象语法树(AST)   
  ######        将 tokens 转换为结构化的 AST，每个节点代表代码中的一个语法结构（如变量声明、函数调用等） 
 

  ```
  // 对应 const sum = ... 的 AST 节点（简化）
  {
    type: 'VariableDeclaration',
    kind: 'const',
    declarations: [
      {
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: 'sum' },
        init: {
          type: 'ArrowFunctionExpression',
          params: [...],
          body: [...]
        }
      }
    ]
  }
  ```

      

  #### 2 转换阶段： 通过transformations 修改AST节点，实现语法转换
    这个过程 依赖(Plugins) 插件 和 预设(Presets)

  - 插件 - 是babel转换的最小单位，每个插件负责处理特定的语法转换

    比如： 
        @babel/plugin-transform-arrow-functions 将箭头函数转化为普通函数
        @babel/plugins-transform-classes 将es6转换为es5构造函数
        
  - 预设 - 是插件的集合，用于定义一组语法转换规则
    比如:
        @babel/preset-env  根据目标浏览器自动确定需要的插件
        @babel/preset-typescript  处理typescript语法

  
  - 转换过程： babel 递归遍历AST，对每个节点应用插件逻辑，生成新的AST节点
  ```
  // 箭头函数转换前的 AST 节点
  {
    type: 'ArrowFunctionExpression',
    params: [{ type: 'Identifier', name: 'a' }],
    body: { type: 'Identifier', name: 'a' }
  }

  // 转换后的 AST 节点（普通函数）
  {
    type: 'FunctionExpression',
    params: [{ type: 'Identifier', name: 'a' }],
    body: {
      type: 'BlockStatement',
      body: [{
        type: 'ReturnStatement',
        argument: { type: 'Identifier', name: 'a' }
      }]
    }
  }
  ```
  
  #### 3 生成阶段： 通过code generation 将AST转换为js代码字符串,并生成source map 用于调试
  - 代码生成过程: 遍历修改后的AST，递归生成对应的代码字符串
  ```
  // 修改后的 AST 生成的代码
  var sum = function(a) {
    return a;
  };
  ```
  - 格式化选项： 可配置生成的代码的格式(如 是否压缩，缩进等)
  ```
  {
    compact: true, // 压缩代码
    retainLines: true // 保留原代码行号（用于调试）
  }
  ```

### 模板引擎
  #### ReactJsx 编译
  - 原理：通过Babel/plugin-transform-react-jsx 将JSX 语法解析为AST，转换为 React.createElement 调用
  - 示例：
  ```
  // JSX 代码
  const element = <h1 className="title">Hello</h1>;

  // 编译后
  const element = React.createElement("h1", { className: "title" }, "Hello");
  ```

  ### Vue 模板编译
  - 原理： Vue 编译器 将模板 （如 <div>{{ message }}</div>）解析为 AST，生成渲染函数。
  - 示例：
  ```
  <!-- Vue 模板 -->
  <template>
    <div>{{ message }}</div>
  </template>

  // 编译后的渲染函数（简化）
  function render() {
    return _createElement('div', [_toDisplayString(this.message)]);
  }
  ```

### IDE与编辑器功能
  - 代码高亮：VSCode WebStorm 等编辑器通过AST分析代码结构，提供智能提示
  - 代码重构工具：基于AST安全的修改代码结构 （如  重命名变量， 提取函数）


### Webpack 与模块打包
  - 原理：Webpack通过acorn 等解析器将模块代码转换为AST，分析依赖关系并生成打包后的代码
  - 示例:
  ```
  // 模块 A
  import { add } from './utils';
  console.log(add(1, 2));

  // Webpack 打包后，会通过 AST 分析依赖关系，将 utils 模块合并
  ``` 
  