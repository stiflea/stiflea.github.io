---
title: Mapper重复扫描bean报错
author: deadwings
isOriginal: true
---
### MapperScan不指定包名的时候会在SpringBootApplication的根目录开始扫描，扫描Service层时就会出现报错。

这里有两种办法

1. MapperScan指定特定的包名，避免重复扫描bean。
2. 不使用MapperScan直接在对应的类上写Mapper注解。
