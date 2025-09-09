### vite 配置vue3 多页应用 - build.rollupOptions.input
```
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      // 配置多个入口
      input: {
        main: './index.html',        // 首页入口
        about: './about.html',       // 关于页入口
        contact: './contact.html'    // 联系页入口
      }
    }
  }
})
```
- 每个页面都有自己单独的index.html
- 每个hmtl可以通过， <script src="./xxx.js"></script> 引入各自的script
- 开发时，可以通过 http://localhost:5173/pages/about/index.html 访问子页面
- 构建后会为每个入口生产对应的html文件和资源目录

### node 封装函数
```
import { join } from 'path';
import fs from 'fs';
// 获取指定目录下的所有 HTML 文件
export function getHtmlFiles(dir: string, excludeDirs: string[] = []) {
	/**
	 * 主页入口必备
	 */
	const entryPoints: Record<string, string> = {
		index: join(dir, 'index.html'),
	};
	const pages = fs.readdirSync(dir); // 读取 src/pages 下的所有目录
	pages.forEach((page) => {
		const fullDirPath = join(dir, page);
		const htmlFilePath = join(fullDirPath, 'index.html'); // 检查 index.html 是否存在

		if (fs.statSync(fullDirPath).isDirectory() && fs.existsSync(htmlFilePath) && !excludeDirs.includes(page)) {
			entryPoints[`${page}/index`] = htmlFilePath; // 格式为 {'page1/index': htmlFilePath}
		}
	});

	return entryPoints;
}
```

### 使用该封装函数
```
rollupOptions: {
			input: getHtmlFiles(resolve(__dirname, '../src/page')),
			output: {
				.....
	    }
}
```
