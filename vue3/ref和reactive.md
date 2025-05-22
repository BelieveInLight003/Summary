### 响应式原理
  ###### Proxy 可以拦截<span style="color:red">对象属性</span>的读取、设置、删除等操作，在这些操作发生时触发相应的更新逻辑，从而实现响应式效果

### proxy  https://zhuanlan.zhihu.com/p/674933571 
  - ES6+ 引入的新对象，用于创建一个对象的代理，可以拦截并重定义基本的操作
  - 拦截操作：
         - get()
         - set()
         - has()
         - deleteProperty()
         - apply()
  - 示例
  ```
  const target = {
    name: 'Alice',
    age: 30
  };

  const handler = {
    get: function (target, prop) {
      console.log(`Getting property "${prop}"`);
      return target[prop];
    },
    set: function (target, prop, value) {
      console.log(`Setting property "${prop}" to "${value}"`);
      target[prop] = value;
    }
  };

  const proxy = new Proxy(target, handler);

  proxy.name; // 输出: Getting property "name", 然后输出 "Alice"
  proxy.age = 31; // 输出: Setting property "age" to "31"
  ```
###### 函数
  ```
  handler.getPrototypeOf()：
  在读取代理对象的原型时触发该操作，比如在执行 Object.getPrototypeOf(proxy) 时。

  handler.setPrototypeOf()：
  在设置代理对象的原型时触发该操作，比如在执行 Object.setPrototypeOf(proxy, null) 时。

  handler.isExtensible()：
  在判断一个代理对象是否是可扩展时触发该操作，比如在执行 Object.isExtensible(proxy) 时。

  handler.preventExtensions()：
  在让一个代理对象不可扩展时触发该操作，比如在执行 Object.preventExtensions(proxy) 时。

  handler.getOwnPropertyDescriptor()：
  在获取代理对象某个属性的属性描述时触发该操作，比如在执行 Object.getOwnPropertyDescriptor(proxy, "foo") 时。

  handler.defineProperty()：
  在定义代理对象某个属性时的属性描述时触发该操作，比如在执行 Object.defineProperty(proxy, "foo", {}) 时。

  handler.has()：
  在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。

  handler.get()：
  在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。

  handler.set()：
  在给代理对象的某个属性赋值时触发该操作，比如在执行 proxy.foo = 1 时。

  handler.deleteProperty()：
  在删除代理对象的某个属性时触发该操作，即使用 delete 运算符，比如在执行 delete proxy.foo 时。

  handler.ownKeys()：
  当执行Object.getOwnPropertyNames(proxy) 和Object.getOwnPropertySymbols(proxy)时触发。

  handler.apply()：
  当代理对象是一个function函数时，调用apply()方法时触发，比如proxy.apply()。

  handler.construct()：
  当代理对象是一个function函数时，通过new关键字实例化时触发，比如new proxy()。
  ```

###### 作用
  - 灵活性: Proxy提供了丰富的拦截操作，使得我们能够对对象的行为进行灵活的定制
  - 可读性: 通过Proxy能够实现更清晰和易读的代码，避免了传统的一些hack手段

###### 参见链接  https://segmentfault.com/a/1190000044769265
### reactive 
  - 内部利用 proxy 实现，特别是借助 handle的set 方法，可以实现双向绑定逻辑，从 vue2 - Object.defineProperty 改变很大
      对比：
      - Object.defineProperty()只能单一的监听已有属性的修改或者变化，无法检测到对象属性的新增或删除，而Proxy则可以轻松实现
      - Object.defineProperty()无法监听属性值是数组类型的变化，而Proxy则可以轻松实现

  ##### 单层对象
    ```
    let foo = {
        a:1,
        b:2
    }
    let handler = {
        set:(obj,key,value)=>{
            console.log('set')
            // 双向绑定相关逻辑
            obj[key] = value
            return true
        }
    }

    let p = new Proxy(foo,handler)

    p.a = 3
    ```

  #####  多层对象
   - 上面代码中，对于简单的对象foo是完全没问题的，但是如果foo是一个复杂对象，里面嵌套的很多对象，那么当去尝试修改里层对象的值时，
     set方法就不会触发，为了解决这种场景，在Vue3中，采用了递归的方式来解决这个问题：
    
    
    ```
    let foo = {a:{c:3,d:{e:4}},b:2}
    const isObject = (val)=>{
        return val !== null && typeof val === 'object'
    }
    const createProxy = (target)=>{
        let p = new Proxy(target,{
            get:(obj,key)=>{
                let res = obj[key] ? obj[key] : undefined

                // 判断类型，避免死循环
                if (isObject(res)) {
                    return createProxy(res)
                } else {d
                    return res
                }
            },
            set: (obj, key, value)=> {
              console.log('set')
              obj[key] = value;

            }
        })

        return p
    }

    let result = createProxy(foo)

    result.a.d.e = 6 // 打印出set
    ```

  重点：当尝试去修改一个多层嵌套的对象的属性时，会触发该属性的上一级对象的get方法，
        利用这个就可以对每个层级的对象添加Proxy代理，这样就实现了多层嵌套对象的属性修改问题。


### ref
  -  封装原理： 类似reactive 如下：
  
  ```
  // 在ref的封装过程中，我们将值包装在一个对象的value属性中，
  // 这个过程就解释了为什么我们需要使用.value来访问和修改ref封装返回的值
  function ref(value) {
    // 将传入的初始值存在reactiveObj中
    const reactiveObj = { value };

    // 返回一个Proxy代理
    return new Proxy(reactiveObj, {
      // 读取数据
      get(target, property, receiver) {
        console.log('触发了获取操作');
        return target.value;
      },
      
      // 更新数据
      set(target, property, value, receiver) {
        target.value = value;
        
        console.log('触发了更新操作');
        return 'set';
      },
    });
  }

  // 测试
  const count = ref(100000);
  count.value // 输出'get'
  count.value = 1; // 输出'set'
  ```

##### vue3 数据双向绑定 - 为啥改变ref和reactive值，视图会发生变化？
  - 在proxy的 set() 里面，可以通过id 等来获取对应的dom元素，然后修改dom元素，实现双向绑定
  ```
  <div id="app"></div>
    <button onclick="count.value++">加一</button>
  <div id="updateTest"></div>

  <script>
    function ref(value) {
      const reactiveObj = { value };

      return new Proxy(reactiveObj, {
        // 读取数据
        get(target, property, receiver) {
          console.log('get', property);
          return target.value;
        },
        
        // 更新数据
        set(target, property, value, receiver) {
          target.value = value;
          console.log('set');
          // 视图更新
          document.querySelector("#updateTest").innerHTML = value;
          return 'set';
        },
      });
    }

    const count = ref(100000);

    document.querySelector("#updateTest").innerHTML = count.value;
  </script>
  ```

### reactive 避坑
  ######  有限的值类型
    只能用于对象，数组，Map，Set 等集合类型，不能用于基本类型，比如：string number boolean 等
  ######  不能替换整个对象
       reactive 函数是基于 JavaScript 的 Proxy 实现的。当你使用 reactive 创建一个响应式对象时，
    实际上是创建了一个原对象的代理（Proxy）实例。
       这个代理对象会拦截对原对象属性的各种操作（如读取、设置、删除等），
    并在操作发生时触发相应的依赖收集和更新逻辑，从而实现响应式。
  ######  对解构操作不友好
    我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

    当对 reactive 定义的对象进行解构时，实际上是将响应式对象的属性值复制到了独立的变量中，
    这些变量不再和原响应式对象的代理有任何关联。

    ```
    const state = reactive({ count: 0 })

    // 当解构时，count 已经与 state.count 断开连接
    let { count } = state
    // 不会影响原始的 state
    count++

    // 该函数接收到的是一个普通的数字
    // 并且无法追踪 state.count 的变化
    // 我们必须传入整个对象以保持响应性
    callSomeFunction(state.count)
    ```