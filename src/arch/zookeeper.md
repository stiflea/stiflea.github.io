---
author: 腾讯技术工程
---


# ZooKeeper 核心通识

作者：mosun，腾讯 PCG 后台开发工程师

> 文章分三部分展开陈述：ZooKeeper 核心知识、ZooKeeper 的典型应用实现原理、ZooKeeper 在中间件的落地案例。

为了应对大流量，现代应用/中间件通常采用分布式部署，此时不得不考虑 CAP 问题。ZooKeeper（后文简称 ZK）是面向 CP 设计的一个开源的**分布式协调框架**，将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的原语集，并以一系列简单易用的接口提供给用户使用，分布式应用程序可以基于它实现诸如 **数据发布/订阅、负载均衡、命名服务、集群管理、Master 选举、分布式锁、分布式队列** 等功能。ZK 之所以能够提供上述一套分布式数据一致性解决方案，核心在于其设计精妙的**数据结构、watcher 机制、Zab 一致性协议等**，下面将依次剖析。

## **数据结构**

ZK 在**内存**中维护了一个**类似文件系统的树状数据结构**实现命名空间（如下），树中的节点称为 **znode**。

![图片](http://dean-imgsubmit.oss-cn-beijing.aliyuncs.com/imm/640-20221202234644662.jpeg)

然而，znode 要比文件系统的路径复杂，既可以通过路径访问，又可以存储数据。znode 具有四个属性 data、acl、stat、children，如下

```java
public class DataNode implements Record {
    byte data[];
    Long acl;
    public StatPersisted stat;
    private Set<String> children = null;
}
```

- **data**: znode 相关的业务数据均存储在这里，但是，**父节点不可存储数据**；
- **children**: 存储当前节点的子节点引用信息，因为内存限制，所以 **znode 的子节点数不是无限的**；
- **stat**: 包含 znode 节点的状态信息，比如: 事务 id、版本号、时间戳等，**其中事务 id 和 ZK 的数据一直性、选主相关，下面将重点介绍**；
- **acl**: 记录客户端对 znode 节点的访问权限；

**注意**：znode 的**数据操作具有原子性**，读操作将获取与节点相关的所有数据，写操作也将替换掉节点的所有数据。**znode 可存储的最大数据量是 1MB** ，但实际上我们在 znode 的数据量应该尽可能小，因为数据过大会导致 zk 的性能明显下降。**每个 ZNode 都对应一个唯一的路径**。

### 事物 ID：Zxid

Zxid 由 Leader 节点生成。当有新写入事件时，Leader 节点生成新的 Zxid，并随提案一起广播。Zxid 的生成规则如下：