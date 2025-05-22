# nginx 

### 访问
  curl localhost:xxx 
  查看服务器 是否部署成功

### 防火墙
  配置好项目以后，需要关闭防护墙

  sudo systemctl stop firewalld

  否则，打不开项目

### 配置文件demo
  ```
  server {
    listen 8080;
    index  index.html index.html;
    server_name test;

    location / {
      root  /app;
      try_files $uri /index.html;

      add_header 'Access-Control-Allow-Origin' '*';      // 有风险
      add_header Access-Control-Allow-Credentials true;
      add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }

    location /api {
 		   proxy_pass http://192.168.110.101:5080/api;
    }

    location ~ ^/(images|javascript|js|css|flash|media|static|json|html)/ {
      root /app;
      #proxy_cache_valid any 0s;
      expires -1;
      gzip_comp_level 9;
      gzip_min_length 500;
      gzip_types text/csv text/xml text/css text/plain text/javascript application/javascript application/x-javascript application/json application/xml image/gif image/png;


      add_header 'Access-Control-Allow-Origin' '*';    // 有风险
      add_header Access-Control-Allow-Credentials true;
      add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
  }

  ```