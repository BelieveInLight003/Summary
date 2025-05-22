### 参见链接  https://blog.csdn.net/BThinker/article/details/124097795

### 1. 下载  gitlab  镜像
```
  docker pull gitlab/gitlab-ce:latest
```

### 2. 启动
  创建 sh 脚本  - docker_gitlab.sh
    ```
      #!/bin/bash
      docker run -itd -p 9980:80 -v /opt/gitlab/etc:/etc/gitlab -v  /opt/gitlab/log:/var/log/gitlab  -v /opt/gitlab/opt:/var/opt/gitlab  --restart always  --privileged=true --name gitlab gitlab/gitlab-ce
    ```
      第一行 必填
      第二行 注意，不换行，否则执行不成功，无法创建容器

  运行  sh docker_gitlab.sh

### 3. 修改配置文件
  进入容器
  ```
    docker exec -it gitlab /bin/bash
  ```
  修改配置文件
  ```
    vi /etc/gitlab/gitlab.rb
  ```
  修改  external_url 'http://192.168.1.100:9980'  （ip地址根据实际情况修改）
  

### 4. git config 
  –global：使用这个参数可以设置全局范围的 Git 配置。配置项将保存在你的用户主目录下的 .gitconfig 文件中（通常是 ~/.gitconfig）。全局配置对你的所有 Git 仓库都有效，适用于你的用户帐户。示例用法：

        git config --global user.name xxx
  
  
  –local：使用这个参数可以设置当前仓库的 Git 配置。配置项将保存在当前仓库的 .git/config 文件中。这个配置只适用于当前仓库，适用于当前仓库的代码库。示例用法：
        git config --local user.name xxx

  ###### 会出现，配置没覆盖的情况，--local 格式不对应，但是不会报错。
  ###### gitlens展示的提交人信息会是global信息。
  
