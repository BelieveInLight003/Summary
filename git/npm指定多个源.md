### npmrc文件
##### 作用域 Scop 的配置
- @scope:registry 语法为特定作用域的包，指定专属的registry
```
# 默认公共 Registry 
registry=https://registry.npmmirror.com
 
# 公司私有作用域包使用内部源 
@mycompany:registry=https://npm.mycompany.com/ 
 
# 其他第三方作用域（如云服务商）
@aliyun:registry=https://packages.aliyun.com/npm/  
```
- 在package.json中包名需要匹配：
```
"dependencies": {
    "@mycompany/cde": "0.4.0",
    "@aliyun/abc": "0.4.0",
    "axios": "0.24.0",
     ....
  },
```

##### 认证与安全
- always-auth=true 在npmrc中，**强制npm对所有请求都发送认证信息**
- 配置在