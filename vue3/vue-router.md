### vue-router 总结
1. 路由器实例是通过，createRouter() 函数创建的
  ```
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
      }
    ]
  })
  ```

2. 不同的历史模式
  - createWebHistory()：HTML5 模式，使用 HTML5 的 history API，需要服务器配置支持 （常用且主流）
  - createWebHashHistory()：hash 模式，使用 URL 的 hash 部分，不需要服务器配置支持，兼容老旧浏览器
  - createMemoryHistory()：内存模式，不保存历史记录，适用于单页应用

3. 路由的变化： 
      ###### 单页应用（SPA）
        项目只有一个 HTML文件，一旦页面加载完成，SPA不会因为用户的的操作重新加载或者跳转
        而是用*JS静态*变换HTML内容，从而实现页面内容的变化

      注意：vue 和 react 都是 SPA，ngnix代理一个html文件，所做的是DOM替换

      存在问题：
        - SPA无法记住用户的操作： 刷新，前进，后退
        - 实际上只有一个URL，对SEO不友好，爬虫获取到的html只是模板而不是最终的页面


4. 实现SPA的两种方式：
      - hash 模式：监听地址栏中的hash值变化驱动界面变化
      - history模式：用pushState 记录浏览器历史，驱动界面发生变化


5. histroy模式底层原理 - H5 新增的方法
      #### Window.history 维护了一个history对象，包含状态（State）和长度 (Length)，数组方式来记录浏览器历史记录
      ##### history.pushState() 和 history.replaceState()

      ###### history.pushState() 
        - history.pushState(state, title, url)
        - 增加一条新的历史记录
        - 不会触发页面刷新，只是导致His太容易对象发生变化，地址栏会有变化
      注意：在浏览器输入一个可用地址，相当于增加一条历史记录
      使用：在点击菜单栏的时候，就会触发

      ###### history.replaceState()
        - 相当于重定向，不会增加历史记录，地址栏也会发生变化
        - 其余和pushState()一样

      注意：在登录之后，token时效，重新登录跳回到之前的页面，相当于重定向，地址栏会发生变化
      使用：只有使用 history.pushState() 才会触发 

      ###### history.popState() 
        - 当history发生变化时触发，比如点击浏览器的前进后退按钮

6. hash模式
      - 监听url中的hash来进行路由跳转
      - 不向服务器发送请求，不需要服务端支持
      - 地址栏中会有#，不美观
      - 只能监听到hash值的变化，不能监听到url中其他参数的变化

7. 两种路由模式如何选择


### 疑难点：
1. histroy模式，需要服务端支持，具体哪些内容
      ngnix配置: 在nginx.conf中添加 
        try_files: $uri $uri/ /index.html;
      在路由找不到的时候，重定向到index.html
    
    --- 详情见ngnix配置解析
       try_files 是 Nginx 中一个非常有用的指令，主要用于处理文件请求的逻辑。它允许你指定一系列的文件路径，Nginx 会依次尝试这些路径
       直到找到一个存在的文件。如果所有指定的路径都不存在，则会返回一个指定的错误代码或重定向到一个指定的 URI。
    

3. 浏览器缓存 
    -- localStorage
    -- sessionStroage
    -- cookie
    -- indexDB（本地数据库）
    -- applicationCache
    -- cacheStorage
    -- serviceWorker
     