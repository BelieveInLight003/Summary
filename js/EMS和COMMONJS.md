  js 社区存在多种模块化规范，最常使用到的是，node本身的commonjs 和 es6标准的esm

### 差异总结

#### 差异1： COMMONJS 输出的是一个值的拷贝，ES6模块输出的是值的引用
  - COMMONJS 值拷贝 - 一旦输出某个值，模块内部的变化不会影响到这个值
    ```
    // lib.js
    var counter = 3;
    function incCounter() {
      counter++;
    }
    module.exports = {
      counter: counter,
      incCounter: incCounter,
    };

    // main.js
    var mod = require('./lib');

    console.log(mod.counter);  // 3
    mod.incCounter();
    console.log(mod.counter); // 3
    ```
    lib.js 模块加载后，内部变化影响不到输出的counter。原因：mod.counter 是一个原始类型的值，会被缓存。
           除非写一个get函数，才能得到内部变动后的值。

  - ES6: JS引擎对脚本分析的时候，遇到模块加载import，就会生成一个只读引用，等到脚本真正执行的时候，再根据这个只读引用，到被夹在的模块里面取值。
          原始值变了，引用值，也会跟着改变。<span style="color: red;">因此，ES6模块是动态引用的，并不会被缓存。</span>

    案例1：
    ```
    // lib.js
    export let counter = 3;
    export function incCounter() {
      counter++;
    }

    // main.js
    import { counter, incCounter } from './lib';
    console.log(counter); // 3
    incCounter();
    // 动态取值
    console.log(counter); // 4
    ```
    
    案例2：
    ```
    // m1.js
    export var foo = 'bar';
    setTimeout(() => foo = 'baz', 500);

    // m2.js
    import {foo} from './m1.js';
    // 动态取值
    console.log(foo);   // bar
    setTimeout(() => console.log(foo), 500);  // baz
    ```


#### 差异2： esm存在export/import 模块提升的特性，具体表现是
              规定 import/export 必须位于模块顶级，不能位于作用域内，
              其次，对于模块内的import/export 会提升到模块顶部，这是在编译阶段完成的

      ```
      // a.mjs
      export let a_done = false;
      import { b_done } from './b';
      console.log('a.js: b.done = %j', b_done);
      console.log('a.js执行完毕');

      // b.mjs
      import { a_done } from './a';
      console.log('b.js: a.done = %j', a_done);
      export let b_done = true;
      console.log('b.js执行完毕');

      // main.mjs
      import { a_done } from './a';
      import { b_done } from './b';
      console.log('main.js: a.done = %j, b.done = %j', a_done, b_done);

      // 输出结果
      // node --experimental-modules main.mjs
      ReferenceError: a_done is not defined
      ```

  ###### 因为export 提升问题：
      这就要考虑到 a.mjs 的 import/export 提升的问题，a.mjs 中的export a_done被提升到顶部，执行到import './b'时，执行权限移交到 b.mjs，此时a_done只是一个指定导出的接口，但是未定义，所以出现引用报错

      相当于：
      exoport a_done
      let a_done = true;

      所以会报错，找不到错误


#### 差异3：esm的read-only特性
      read-only 的特性很好理解，import 的属性是只读的，不能赋值

