### jsx 和 tsx 的本质区别
| 特性        | JSX                                | TSX                                      |
| --------- | ---------------------------------- | ---------------------------------------- |
| **语言基础**  | JavaScript                         | TypeScript                               |
| **类型检查**  | 无静态类型检查                            | 具备静态类型检查                                 |
| **文件扩展名** | `.jsx`                             | `.tsx`                                   |
| **编译过程**  | 通常通过 Babel 编译为 React.createElement | 通过 TypeScript 编译器编译为 JavaScript，同时进行类型检查 |
| **类型定义**  | 不支持类型定义                            | 支持接口、类型别名、泛型等 TypeScript 特性              |
| **开发体验**  | 依赖 IDE 插件或工具进行语法高亮和提示              | 原生支持 TypeScript 的语法高亮、自动补全、类型提示          |

### vue 项目引入 vue-plugin-jsx 插件的理由
- tsx 文件只负责类型检查
- tsx = ts + jsx
  ##### 重要原因 「TSX 支持 JS 语法」≠「知道怎么把 JSX 编译成 Vue 的运行时代码」 


### vue-plugin-jsx 负责代码转换
###### h() 是js方法
- jsx 转换为js，拿给浏览器识别
- <div>hi</div> 转换为 import { h } from 'vue'； h('div', 'hi')； 转译为js文件
- vue本身不识别tsx，构建时，借助插件，完成转换 

# 总结如下： 
- TSX 只「放行」JSX 语法并给类型
- Vue-JSX 插件才「动手」把 JSX 变成 Vue 能运行的 h() 调用
- create-vue 和 vue-cli 都有预置的jsx语法支持
  