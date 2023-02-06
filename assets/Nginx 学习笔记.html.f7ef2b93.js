import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c as r,a as n,b as s,e as t,d as a,r as c}from"./app.3686ca49.js";const o={},p=a('<h1 id="nginx-学习笔记" tabindex="-1"><a class="header-anchor" href="#nginx-学习笔记" aria-hidden="true">#</a> Nginx 学习笔记</h1><blockquote><p>总的来说，Nginx 的学习是一个实践大于理论的过程，尽管如此，笔者还是尽量详尽地记录这个过程。</p><p>笔者使用的是腾讯云服务器，如果条件允许，您可以使用各个厂商的云服务器。如果您使用本地虚拟机请配置好网络与防火墙，本文不赘述相关配置。</p></blockquote><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h2><h3 id="nginx-常用的四大版本" tabindex="-1"><a class="header-anchor" href="#nginx-常用的四大版本" aria-hidden="true">#</a> Nginx 常用的四大版本</h3>',4),d={href:"http://nginx.org",target:"_blank",rel:"noopener noreferrer"},v=n("li",null,"Nginx Plus｜商业版｜nginx.com｜官方出品",-1),u=n("li",null,"Openresty｜Nginx+Lua",-1),b=n("li",null,"Tengine｜淘宝",-1),m=a(`<h3 id="nginx-安装" tabindex="-1"><a class="header-anchor" href="#nginx-安装" aria-hidden="true">#</a> Nginx 安装</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /usr/local/src
<span class="token function">wget</span> https://nginx.org/download/nginx-1.21.1.tar.gz
<span class="token function">tar</span> <span class="token parameter variable">-zxf</span> nginx-1.21.1.tar.gz

<span class="token comment"># 安装环境</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> gcc
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> pcre pcre-devel
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> zlib zlib-devel
./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/nginx

<span class="token function">make</span>
<span class="token function">make</span> <span class="token function">install</span>


<span class="token comment"># 启动 Nginx</span>
<span class="token builtin class-name">cd</span> /usr/local/nginx/sbin
./nginx

./nginx            启动
./nginx <span class="token parameter variable">-s</span> stop    快速停止
./nginx <span class="token parameter variable">-s</span> quit    优雅关闭
./nginx <span class="token parameter variable">-s</span> reload  重新加载配置

<span class="token comment"># 创建脚本文件</span>
<span class="token function">vim</span> /usr/lib/systemd/system/nginx.service

<span class="token punctuation">[</span>Unit<span class="token punctuation">]</span>
<span class="token assign-left variable">Description</span><span class="token operator">=</span>nginx - web server
<span class="token assign-left variable">After</span><span class="token operator">=</span>network.target remote-fs.target nss-lookup.target
<span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">Type</span><span class="token operator">=</span>forking
<span class="token assign-left variable">PIDFile</span><span class="token operator">=</span>/usr/local/nginx/logs/nginx.pid
<span class="token assign-left variable">ExecStartPre</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-t</span> <span class="token parameter variable">-c</span> /usr/local/nginx/conf/nginx.conf
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-c</span> /usr/local/nginx/conf/nginx.conf
<span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-s</span> reload
<span class="token assign-left variable">ExecStop</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-s</span> stop
<span class="token assign-left variable">ExecQuit</span><span class="token operator">=</span>/usr/local/nginx/sbin/nginx <span class="token parameter variable">-s</span> quit
<span class="token assign-left variable">PrivateTmp</span><span class="token operator">=</span>true
<span class="token punctuation">[</span>Install<span class="token punctuation">]</span>
<span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function g(k,x){const e=c("ExternalLinkIcon");return l(),r("div",null,[p,n("ol",null,[n("li",null,[s("Nginx｜开源版｜"),n("a",d,[s("nginx.org"),t(e)])]),v,u,b]),m])}const _=i(o,[["render",g],["__file","Nginx 学习笔记.html.vue"]]);export{_ as default};
