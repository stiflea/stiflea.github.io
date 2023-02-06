# Nginx 防火墙模块 静态编译安装 CentOS

```
# 安装环境
yum install -y git gcc pcre pcre-devel zlib zlib-devel flex bison

cd /usr/local/src
wget https://nginx.org/download/nginx-1.20.1.tar.gz
tar -zxf nginx-1.20.1.tar.gz


cd /usr/local/src
git clone -b lts https://github.com/ADD-SP/ngx_waf.git


cd /usr/local/src/nginx-1.20.1

cd /usr/local/src/ngx_waf && make && cd /usr/local/src/nginx-1.20.1

cd /usr/local/src \
        &&  git clone https://github.com/troydhanson/uthash.git \
        &&  export LIB_UTHASH=/usr/local/src/uthash \
        &&  cd /usr/local/src/nginx-1.20.1
        
cd /usr/local/src/ngx_waf && git clone https://github.com/libinjection/libinjection.git inc/libinjection && cd /usr/local/src/nginx-1.20.1

git clone https://github.com/jedisct1/libsodium.git --branch stable libsodium-src \
        &&  cd libsodium-src \
        &&  ./configure --prefix=/usr/local/src/nginx-1.20.1/libsodium --with-pic \
        &&  make -j$(nproc) && make check -j $(nproc) && make install \
        &&  export LIB_SODIUM=/usr/local/src/nginx-1.20.1/libsodium \
        &&  cd /usr/local/src/nginx-1.20.1
        
        

./configure --prefix=/usr/local/nginx --add-module=/usr/local/src/ngx_waf --with-cc-opt='-std=gnu99'


sed -i 's/^\(CFLAGS.*\)/\1 -fstack-protector-strong -Wno-sign-compare/' objs/Makefile


make && make install

cd /usr/local/nginx/sbin

./nginx
```

**make异常解决**

![image-20230206142110970](https://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/image-20230206142110970.png)

```
cd /usr/local/src/ngx_waf/inc/libinjection/src/ && mv version.h.in version.h


cd /usr/local/src/nginx-1.20.1
./configure --prefix=/usr/local/nginx --add-module=/usr/local/src/ngx_waf --with-cc-opt='-std=gnu99'

sed -i 's/^\(CFLAGS.*\)/\1 -fstack-protector-strong -Wno-sign-compare/' objs/Makefile

make && make install
```

