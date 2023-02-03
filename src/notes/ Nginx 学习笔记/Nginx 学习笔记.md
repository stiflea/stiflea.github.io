# Nginx 学习笔记

> 总的来说，Nginx 的学习是一个实践大于理论的过程，尽管如此，笔者还是尽量详尽地记录这个过程。
>
> 笔者使用的是腾讯云服务器，如果条件允许，您可以使用各个厂商的云服务器。如果您使用本地虚拟机请配置好网络与防火墙，本文不赘述相关配置。

## 概述

### Nginx 常用的四大版本

1. Nginx｜开源版｜nginx.org
2. Nginx Plus｜商业版｜nginx.com｜官方出品
3. Openresty｜Nginx+Lua
4. Tengine｜淘宝

### Nginx 安装

```bash
cd /usr/local/src
wget https://nginx.org/download/nginx-1.21.1.tar.gz
tar -zxf nginx-1.21.1.tar.gz

# 安装环境
yum install -y gcc
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
./configure --prefix=/usr/local/nginx

make
make install


# 启动 Nginx
cd /usr/local/nginx/sbin
./nginx

./nginx            启动
./nginx -s stop    快速停止
./nginx -s quit    优雅关闭
./nginx -s reload  重新加载配置

# 创建脚本文件
vim /usr/lib/systemd/system/nginx.service

[Unit]
Description=nginx - web server
After=network.target remote-fs.target nss-lookup.target
[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true
[Install]
WantedBy=multi-user.target



```

