# redis

Redis 是C语言开发的一个开源高性能键值对的*内存数据库*，可以用来做数据库、缓存、[消息中间件](https://so.csdn.net/so/search?q=消息中间件&spm=1001.2101.3001.7020)等场景，是一种NoSQL(not-only sql,非关系型数据库)的数据库。

Redis是一种开源的、基于内存的、支持多种数据结构的键值对存储数据库³。它可以用于缓存、事件发布订阅、高速队列等场景¹⁵。它还支持异步复制、持久化和集群。

Redis的应用场景很多，比如：

- 缓存：利用Redis的高速访问和键过期功能，可以提升网站性能和降低数据库压力
- 排行榜：利用Redis的有序集合类型，可以实现各种排行榜功能，如销量榜、上新榜等。
- 分布式锁：利用Redis的单线程特性和原子操作，可以实现分布式锁功能，解决多服务器并发问题
- 消息队列：利用Redis的列表类型，可以实现消息队列功能，支持发布订阅模式







```
SET key value [NX|XX] [GET] [EX seconds|PX milliseconds|EXAT unix-time-seconds|PXAT unix-time-milliseconds|KEEPTTL]
```

