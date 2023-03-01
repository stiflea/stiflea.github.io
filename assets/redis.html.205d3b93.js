import{_ as l}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as t,c as o,a as e,b as s,e as i,r}from"./app.f76af8cb.js";const d={},a=e("h1",{id:"redis",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#redis","aria-hidden":"true"},"#"),s(" redis")],-1),c=e("em",null,"内存数据库",-1),_={href:"https://so.csdn.net/so/search?q=%E6%B6%88%E6%81%AF%E4%B8%AD%E9%97%B4%E4%BB%B6&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},u=e("p",null,"Redis是一种开源的、基于内存的、支持多种数据结构的键值对存储数据库³。它可以用于缓存、事件发布订阅、高速队列等场景¹⁵。它还支持异步复制、持久化和集群。",-1),m=e("p",null,"Redis的应用场景很多，比如：",-1),h=e("ul",null,[e("li",null,"缓存：利用Redis的高速访问和键过期功能，可以提升网站性能和降低数据库压力"),e("li",null,"排行榜：利用Redis的有序集合类型，可以实现各种排行榜功能，如销量榜、上新榜等。"),e("li",null,"分布式锁：利用Redis的单线程特性和原子操作，可以实现分布式锁功能，解决多服务器并发问题"),e("li",null,"消息队列：利用Redis的列表类型，可以实现消息队列功能，支持发布订阅模式")],-1),p=e("div",{class:"language-text line-numbers-mode","data-ext":"text"},[e("pre",{class:"language-text"},[e("code",null,`SET key value [NX|XX] [GET] [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL]
`)]),e("div",{class:"line-numbers","aria-hidden":"true"},[e("div",{class:"line-number"})])],-1);function E(x,f){const n=r("ExternalLinkIcon");return t(),o("div",null,[a,e("p",null,[s("Redis 是C语言开发的一个开源高性能键值对的"),c,s("，可以用来做数据库、缓存、"),e("a",_,[s("消息中间件"),i(n)]),s("等场景，是一种NoSQL(not-only sql,非关系型数据库)的数据库。")]),u,m,h,p])}const R=l(d,[["render",E],["__file","redis.html.vue"]]);export{R as default};
