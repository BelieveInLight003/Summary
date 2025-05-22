gitlab 配置文件 - gitlab.rb
###### 点击导入项目，没有对应的选项
  - 需要在 gitlab.rb 中添加以下配置
      gitlab_rails['import_sources'] = ['github', 'bitbucket', 'gitlab', 'google_code', 'fogbugz', 'git']
      重启 gitlab
  - 需要在gitlab页面配置
      admin area -> settings -> Import/Export -> Import projects from other instances
      管理员 - 设置 - 通用 - 导入导出设置 - 添加源

      下方有文件大小限制！

###### 导入项目后，clone 地址，没有对应的ip和端口
   - 需要修改 gitlab.rb
   - external_url 'http://192.168.110.82:9980' # 修改为对应的ip和端口
   - nginx['listen_port'] = 80 # nginx 监听容器端口，是容器端口
   - nginx['listen_addresses'] = ['0.0.0.0'] # nginx 监听地址 可加可不加
   