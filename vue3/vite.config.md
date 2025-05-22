### 文件常用属性解析


##### BASE
  - 指定静态资源的基础路径，默认为 /
  
  - 若需要部署到子路径
    ```
    base: '/sub-path/'
    ```
  
  - 在某些情况下，需要根据环境变量，动态设置base
    ```
    base: process.env.NODE_ENV === 'production' ? '/foo/' : '/'
    ``` 


  ###### base 属性主要影响以下几个方面: 
    - 静态资源的加载路径
    - 路由系统的基础路径 *router.base
    - HTML中相对路径的解析

  ###### viteconfig-base 与 router-base 为何需要互相匹配
    - vite的base，在静态资源加载时，会在构建时，替换HTML和CSS的相对路径，例如
          base: '/' 时，HTML 中引用的 <script src="main.js"> 会被编译为 <script src="/main.js">
          base: '/my-app/' 时，会被编译为 <script src="/my-app/main.js">

    - 路由系统的需要知道，url哪部分是，基础路径，哪部分是，路由路径，例如：
          URL https://example.com/my-app/about 中，/my-app 是基础路径，/about 是路由路径。
          如果 Vue Router 或 React Router 不知道基础路径是 /my-app，就会把完整路径 /my-app/about 当作路由路径，导致匹配失败。
         

##### SERVER
  