### webworker 解决问题
- 为浏览器注入多线程，能力
- webworker创建了独立的线程，每个worker拥有自己的函数调用栈和运行时环境，这些线程能同时执行代码，互补阻塞主线程和其他worker
- 过程：
    1. 允许主线程，创建worker线程，将一些任务分配给后者运行
    2. 在主线程运行的同时，worker线程在后台运行，两者互补干扰，
    3. 等到worker线程完成计算任务，再把结果返回给主线程 
- worker与主线程并行执行，且worker中不能直接操作dom
    效果： 
    1. 主线程解放： 耗时任务被迁移到worker, ui始终保持响应
    2. 安全性保证： 避免多个线程同时操控dom导致混乱
    3. 真正里实现了，**利用多核硬件资源并行处理任务**


### 特点
- 同源限制  
   　　分配给worker线程运行的脚本文件，必须与主线程的脚本文件同源  
- DOM限制   
    　　worker线程所在的全局对象，与主线程不同，无法读取主线程所在网页的dom对象，也无法使用document window parent这些对象，
    　　但是worker线程可以使用，navigator对象和location对象
- 通信联系  
    　　worker线程和主线程，不在同一个上下文环境，不能直接通信，必须通过消息完成
- 脚本限制  
    　　worker线程不能执行alert() confirm() 方法，可以使用XMLHttpRequest 对象发出AJAX请求
- 文件限制  
    　　worker线程无法读取，本地文件，即不能打开本机的文件系统(file://) 它所加载的脚本，必须来自于网络


### self 解析
- 在webworker中，self 是一个指向worker全局作用域的关键字，类似于主线程的window对象
- self = ** Worker 线程的 "window" ，是 Worker 脚本的 全局上下文 **，用于：
    1. 访问 Worker 专用 API
    2. 与主线程通信
    3. 保持代码清晰（明确这是 Worker 环境）
- **在 Worker 里用 self，因为它就是 Worker 的"自己"**
- API
    ```
    // 在 worker.js 中
    console.log(self); // WorkerGlobalScope 对象

    // 等价写法
    self.postMessage()      // 发送消息到主线程
    self.onmessage          // 接收消息事件
    self.importScripts()    // 导入其他脚本
    self.close()            // 关闭 Worker

    // 在 Worker 里，以下也可以工作（省略 self）
    postMessage()           // 默认就是 self.postMessage()
    onmessage = () => {}    // 等价于 self.onmessage
    ```

### 使用
- 创建worker.js 脚本文件
```
// worker.js - Worker 线程代码

// 导入其他脚本（可选）
importScripts('lib1.js', 'lib2.js');

// 监听主线程消息
self.onmessage = (event) => {
  const data = event.data;
  // 复杂计算...
  self.postMessage({ status: 'completed', result: data });
};

// 错误处理
self.onerror = (error) => {
  console.error('Worker 错误:', error);
};


// 发送消息
self.postMessage({ type: 'progress', value: 50 });

// 关闭自身
// self.close(); // Worker 内部关闭

// 定时器可用
let timer = setTimeout(() => {}, 1000);
clearTimeout(timer);
```

- 创建 main.js 或 HTML 中的 script：
```
// 1. 创建 Worker 实例
const myWorker = new Worker('./worker.js');

// 2. 发送数据到 Worker
myWorker.postMessage(100); // 发送任意数据

// 3. 接收 Worker 返回的数据
myWorker.onmessage = function(event) {
  console.log('主线程收到:', event.data); // 200
};

// 4. 错误监听
myWorker.onerror = function(error) {
  console.error('Worker 错误:', error.message);
};

// 5. 用完记得关闭
// myWorker.terminate(); // 主线程主动关闭
```


### 线程的关闭
```
主线程 --------------------------→ Worker 线程
   |                                  |
   |  new Worker()                    |
   |--------------------------------->| 创建
   |                                  |
   |  worker.terminate()              |
   |--------------------------------->| 强制关闭（外部）
   |                                  |
   |                                  | self.close()
   |<---------------------------------| 自我关闭（内部）
   |                                  |
   |  页面关闭/刷新                   |
   |--------------------------------->| 浏览器自动关闭所有 Worker
```