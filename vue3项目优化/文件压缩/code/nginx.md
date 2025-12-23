```
http {

    # 开启 gzip 和 brotli
    gzip on;
    brotli on;

    # 优先使用 br 压缩文件
    brotli_static on;
    gzip_static on;

    # 配置压缩文件类型
    brotli_types text/plain text/css application/javascript application/json image/svg+xml;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    server {
        location / {
            root /path/to/your/dist;
            try_files $uri $uri/ /index.html;

                    # 优先返回.br文件，其次.gz，最后原文件
                    add_header Vary Accept-Encoding;
                    if ($http_accept_encoding ~ br) {
                        add_header Content-Encoding br;
                        try_files $uri.br $uri.gz $uri =404;
                    }
                    if ($http_accept_encoding ~ gzip) {
                        add_header Content-Encoding gzip;
                        try_files $uri.gz $uri =404;
                    }
            }

    }

}

```
