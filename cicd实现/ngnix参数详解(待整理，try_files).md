### nginx 参数详解

#### try_files

1. 语法：try_files file ... uri;
    作用： 
      - 静态处理文件：  优先查找静态文件，例如HTML，CSS Javascript
      - 回退机制:       提供多个候选路径，按顺序查找资源，知道找到一个存在的资源
      - 伪静态化处理：  结合伪静态规则，将'不存在的'静态请求，转交给动态请求处理程序，如PHP或后端应用服务器
      - SEO优化：       将请求重定向到特定的SEO页面
      

2. 用法:

      - vue3 路由模式， createWebHistroy 模式，需要配置try_files
             
            history 维护一个history对象，无法找到对应的路径，页面不会跳转
              需要配置nginx代理，将请求 转发到index.html

              