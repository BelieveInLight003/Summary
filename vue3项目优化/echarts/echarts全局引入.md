### echarts & echarts/core

- echarts 完整包，打包体积在 800kb+
- echarts/core：仅包含核心功能，需要按需引入模块，打包体积可控制在 100-300KB

### 模块化架构

- echarts/core：核心引擎
- echarts/charts：各种图表类型
- echarts/components：UI 组件（标题、图例等）
- echarts/renderers：渲染器（Canvas/SVG）

### 函数类

```
import { init, graphic, getInstanceByDom, registerMap } from 'echarts/core';
```

### vite.config.js

```
resolve: {
        alias: [
            {
                <!-- 配置别名劫持，项目中引入echarts的地方，自动到该文件下寻找 -->
                find: /^echarts$/,
                replacement: path.resolve(__dirname, '../src/util/echarts/index.ts'),
                customResolver(source, importer) {
                    // 如果导入者是配置文件自身，跳过别名
                    if (importer && importer.includes('src\\util\\echarts\\index.ts')) {
                      return null // Vite 会继续从 node_modules 解析
                    }

                    // 其他情况正常返回别名路径
                    return resolve(__dirname, '../src/util/echarts/index.ts')
                  }
            },
        ],
        extensions: ['.ts', '.tsx', '.js'],
    },
```
