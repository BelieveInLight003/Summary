### 下载 yum 安装 docker  
1. 工具：  
    -   安装依赖包
      yum install -y yum-utils device-mapper-persistent-data lvm2   
    -   设置 yum 源
      yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

2.  安装 docker
       yum install -y docker-ce
            docker-ce 社区版本，适合小团队，小公司使用
            docker-ee 企业版本，适合大公司使用

3.  启动 docker
        systemctl start docker

4.  设置docker 镜像源
        拉取镜像源的过程中，会涉及如下问题：
            -  拉取镜像慢，停滞不前
            -  

        解决方案：
            -  修改 docker 配置文件
                创建  /etc/docker/daemon.json
            -  复制如下内容到文件中
                
              {
                "registry-mirrors":  
                    "https://docker.1ms.run",
                    "https://hub.rat.dev",
                    "https://docker.1panel.live",
                    "https://dockerhub.xianfish.site"

              }

    重启 docker :  systemctl start docker

### 拉取镜像
1. docker pull
    docker pull 镜像名:版本号

2.  查看镜像
    docker images

3.  删除镜像
      常规       docker rmi 镜像名:版本号
      强制删除   docker rmi -f 镜像名:版本号

### 运行容器
1.  运行容器
    docker run -d --name 容器名 -p 主机端口:容器端口 镜像名:版本号

2.  查看容器
    docker ps

3.  删除容器  
       常规做法： 先停止容器，再删除容器  容器名可只取前三位 容器Id
        
          docker stop 容器名
          docker rm 容器名

          强制做法：直接删除容器 （可删除运行中的容器）
          docker rm -f 容器名

4.  进入容器
    docker exec -it 容器名 /bin/bash

5.  查看容器日志
    docker logs 容器名


### dockerfile 使用
    案例：
    ```
    FROM nginx:latest
    RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/' /etc/ssl/openssl.cnf \
    && sed -i 's/CipherString = DEFAULT@SECLEVEL=2/CipherString = DEFAULT@SECLEVEL=1/' /etc/ssl/openssl.cnf
    ENV TZ=Asia/Shanghai
    RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
    WORKDIR /app
    COPY . ./
    COPY app-nginx.conf /etc/nginx/conf.d/app-nginx.conf
    EXPOSE 8080
    ```

    FROM  镜像名:版本号   -  指定基础镜像
    RUN 命令             
    ENV  环境变量
    WORKDIR 工作目录
    COPY 拷贝文件
    EXPOSE 暴露端口


######     一个dockerfile 两个from 创建了一个容器 ？？=
    在一个Dockerfile中使用多个 FROM 指令定义的是多阶段构建，而不是创建多个独立的容器。多阶段构建是 Docker 提供的一种机制，旨在帮助开发者优化最终生成的镜像大小，并提高构建过程的清晰度和安全性。
     
    多阶段构建简介
        在多阶段构建中，每个 FROM 语句开始一个新的构建阶段。你可以选择性地将前一阶段生成的文件复制到下一阶段，而不需要携带前一阶段的所有内容（例如，开发依赖、编译工具等），从而减少最终镜像的体积。


### 前端自动化部署，实现方案

   Dockerfile 与package.json 文件同级
   ```
        FROM node:18.18.1 AS build
        WORKDIR /app
        COPY . .
        RUN npm install pnpm -g --registry=https://registry.npmmirror.com
        RUN pnpm i --registry=https://registry.npmmirror.com
        RUN pnpm run build:dev

        FROM nginx
        RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/' /etc/ssl/openssl.cnf \
        && sed -i 's/CipherString = DEFAULT@SECLEVEL=2/CipherString = DEFAULT@SECLEVEL=1/' /etc/ssl/openssl.cnf
        ENV TZ=Asia/Shanghai
        RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
        WORKDIR /app
        COPY --from=build /app/dist ./
        COPY app-nginx.conf /etc/nginx/conf.d/app-nginx.conf
        EXPOSE 8080
   ```

   实现在同一个容器，运行两个阶段，第一阶段打包，第二阶段 代理
   将第一阶段的dist包文件拷贝到第二阶段，第二阶段启动nginx，暴露端口8080
    
   
   gitlab-ci.yml
   ```
     stages:
        - check
        - deploy
        - push

    variables:
    IMAGE_NAME: 'demomain'
    DEV_SUFFIX: 'dev'
    TEST_SUFFIX: 'test'
    PROD_SUFFIX: 'prod'
    NODE_VERSION: '18.18.1' #node版本

    check:
    stage: check
    tags:
        - frontend  
    before_script:
        - 'echo 开始构建项目......'
    script:
        - 'docker -v'
    only:
        - dev
        - test
        - master

    deploy-develop:
    stage: deploy
    tags:
        - frontend  
    before_script:
        - 'echo 执行构建部署流程'
    script:
        - 'echo ---------------------开始构建---------------------'
        - "sed -i 's/app-nginx.conf/app-nginx-dev.conf/g' 'Dockerfile'"
        - 'echo ---------------------删除上次容器 ---------------------'
        - 'docker ps -aq --filter "name=$IMAGE_NAME-$DEV_SUFFIX" | grep -q . && docker rm -f $IMAGE_NAME-$DEV_SUFFIX'
        - 'echo ---------------------创建容器 ---------------------'
        - 'docker build -t $IMAGE_NAME-$DEV_SUFFIX:1.0 .'
        - 'echo ---------------------启动容器 ---------------------'
        - 'docker run -d --name $IMAGE_NAME-$DEV_SUFFIX --restart=always -p 18290:8080 $IMAGE_NAME-$DEV_SUFFIX:1.0'
    only:
        - dev
   ```
   

   注意：  
       - "sed -i 's/app-nginx.conf/app-nginx-dev.conf/g' 'Dockerfile'" 
        这句：替换dockerfile中的nginx配置文件名，在多个环境下，可以使用同一个Dockerfile
        

    