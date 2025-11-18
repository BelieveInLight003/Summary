### workspace 
  指定某些依赖为工作空间内所有项目共享的，避免每个项目都安装相同的依赖，节省磁盘空间和优化依赖管理。

  否则，会被pnpm当做一整个项目，node_modules  只安装在当前层级。

### 存在pnpm.workspace.yaml 文件 安装依赖的结果如下
![workspace](./assets//worspace.png)
