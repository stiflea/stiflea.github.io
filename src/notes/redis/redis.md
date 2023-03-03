# redis 基础

## Redis的应用场景

- 缓存：利用Redis的高速访问和键过期功能，可以提升网站性能和降低关系型数据库压力
- 排行榜：利用Redis的有序集合类型，可以实现各种排行榜功能，如销量榜、上新榜等。
- 分布式锁：利用Redis的单线程特性和原子操作，可以实现分布式锁功能，解决多服务器并发问题
- 消息队列：利用Redis的列表类型，可以实现消息队列功能，支持发布订阅模式

## Redis 安装

```bash
cd /usr/local/src
wget https://codeload.github.com/redis/redis/tar.gz/refs/tags/7.0.8
tar -zxvf 7.0.8
cd redis-7.0.8
make && make install
```

## 十大数据类型

- string
- list
- hash
- set
- zset
- bitmap
- HyperLog
- GEO
- Stream
- bitfield

## Redis 持久化

- RDB
- AOF
- RDB+AOF

## 复制 replica

功能

- 主从模式
- 读写分离
- 容灾恢复
- 数据备份
- 水平扩容

劣势

- 需要人工干预

## 哨兵 sentinel

功能

- 主从监控
- 消息通知
- 故障转移
- 配置中心

劣势

- 哨兵集群+主从复制,并不能保证数据零丢失

## 集群 cluster

- 多master
- 自带哨兵
