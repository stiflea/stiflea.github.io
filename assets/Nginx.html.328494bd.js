import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as s,e}from"./app.b0df6560.js";const l={},a=e(`<h1 id="nginx-防火墙模块-静态编译安装-centos" tabindex="-1"><a class="header-anchor" href="#nginx-防火墙模块-静态编译安装-centos" aria-hidden="true">#</a> Nginx 防火墙模块 静态编译安装 CentOS</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 安装环境
yum install -y git gcc pcre pcre-devel zlib zlib-devel flex bison

cd /usr/local/src
wget https://nginx.org/download/nginx-1.21.1.tar.gz
tar -zxf nginx-1.21.1.tar.gz


cd /usr/local/src
git clone -b lts https://github.com/ADD-SP/ngx_waf.git


cd /usr/local/src/nginx-1.21.1

cd /usr/local/src/ngx_waf &amp;&amp; make &amp;&amp; cd /usr/local/src/nginx-1.21.1

cd /usr/local/src \\
        &amp;&amp;  git clone https://github.com/troydhanson/uthash.git \\
        &amp;&amp;  export LIB_UTHASH=/usr/local/src/uthash \\
        &amp;&amp;  cd /usr/local/src/nginx-1.21.1
        
cd /usr/local/src/ngx_waf &amp;&amp; git clone https://github.com/libinjection/libinjection.git inc/libinjection &amp;&amp; cd /usr/local/src/nginx-1.21.1

git clone https://github.com/jedisct1/libsodium.git --branch stable libsodium-src \\
        &amp;&amp;  cd libsodium-src \\
        &amp;&amp;  ./configure --prefix=/usr/local/src/nginx-1.21.1/libsodium --with-pic \\
        &amp;&amp;  make -j$(nproc) &amp;&amp; make check -j $(nproc) &amp;&amp; make install \\
        &amp;&amp;  export LIB_SODIUM=/usr/local/src/nginx-1.21.1/libsodium \\
        &amp;&amp;  cd /usr/local/src/nginx-1.21.1
        
        

./configure --prefix=/usr/local/nginx --add-module=/usr/local/src/ngx_waf --with-cc-opt=&#39;-std=gnu99&#39;


sed -i &#39;s/^\\(CFLAGS.*\\)/\\1 -fstack-protector-strong -Wno-sign-compare/&#39; objs/Makefile


make &amp;&amp; make install

cd /usr/local/nginx/sbin

./nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>make异常解决</strong></p><p><img src="https://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/image-20230206142110970.png" alt="image-20230206142110970" loading="lazy"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cd /usr/local/src/ngx_waf/inc/libinjection/src/ &amp;&amp; mv version.h.in version.h


cd /usr/local/src/nginx-1.21.1
./configure --prefix=/usr/local/nginx --add-module=/usr/local/src/ngx_waf --with-cc-opt=&#39;-std=gnu99&#39;

sed -i &#39;s/^\\(CFLAGS.*\\)/\\1 -fstack-protector-strong -Wno-sign-compare/&#39; objs/Makefile

make &amp;&amp; make install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),c=[a];function d(r,m){return i(),s("div",null,c)}const t=n(l,[["render",d],["__file","Nginx.html.vue"]]);export{t as default};
