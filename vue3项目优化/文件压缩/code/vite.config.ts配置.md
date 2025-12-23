```
import compressPlugin from 'vite-plugin-compression';
// 10KB 对应的字节数（10*1024）
const SIZE_10KB = 10240;

plugins: [
    compressPlugin({
        ext: '.gz',
        deleteOriginFile: false, // 过滤规则：仅处理文件大小 ≤ 10KB 的文件
        filter: (file: string) => {
            const fileSize = getFileSize(file);
            // 仅处理 ≤ 10KB 的文件
            return fileSize > 0 && fileSize <= SIZE_10KB;
        },
        threshold: 0, // 阈值设为0（确保所有小文件都进入过滤逻辑）
    }),
    // // 新增Brotli压缩
    compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile: false,
        filter: (file: string) => {
            const fileSize = getFileSize(file);
            // 仅处理 > 10KB 的文件
            return fileSize > SIZE_10KB;
        },
        threshold: SIZE_10KB, // 仅压缩大于10kb的文件
        compressionOptions: {
            level: 11, // brotli最高压缩级别（1-11，级别越高压缩率越高，耗时略长）
        },
    }),
]
```

### 注意

- 此处限制的大小，不一定 10kb 最佳，根据打包文件大小和打包结果判断，找出合适限制
