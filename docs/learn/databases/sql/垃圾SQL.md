---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: 如何找到垃圾SQL语句,你知道这些方式吗？
---

![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

> 这篇文章主要是讲如何找到需要优化的SQL语句，即找到查询速度非常慢的SQL语句。


# 一、慢查询日志

## 1. 何为慢查询日志

- 慢查询日志是MySQL提供的一种日志记录，它用来记录查询响应时间超过阀值的SQL语句
- 这个时间阀值通过参数 `long_query_time` 设置，如果SQL语句查询时间大于这个值，则会被记录到慢查询日志中，这个值默认是10秒
- MySQL默认不开启慢查询日志，在需要调优的时候可以手动开启，但是多少会对数据库性能有点影响

## 2. 如何开启慢查询日志


查看是否开启了慢查询日志

`SHOW VARIABLES LIKE '%slow_query_log%'`


用命令方式开启慢查询日志，但是重启MySQL后此设置会失效

`set global slow_query_log = 1`

永久生效开启方式可以在my.cnf里进行配置，在`mysqld`下新增以下两个参数，重启MySQL即可生效

```
slow_query_log=1
slow_query_log_file=日志文件存储路径
```


## 3. 慢查询时间阀值

查看慢查询时间阀值

`SHOW VARIABLES LIKE 'long_query_time%';`


修改慢查询时间阀值

`set global long_query_time=3;`

修改后的时间阀值生效

`需要重新连接或者新开一个回话才能看到修改值。`


在MySQL配置文件中修改时间阀值

```
[mysqld]下配置
slow_query_log=1
slow_query_log_file=日志文件存储路径
long_query_time=3
log_output=FILE
```

# 二、慢查询日志分析工具

慢查询日志可能会数据量非常大，那么我们如何快速找到需要优化的SQL语句呢，这个神奇诞生了，它就是mysqldumpshow。

## 1. mysqldumpslow --help语法

![](https://img.springlearn.cn/blog/learn_1596350361000.png)

通过mysqldumpslow --help可知这个命令是由三部分组成：mysqldumpslow `[日志查找选项] [日志文件存储位置]`。

## 2. 日志查找选项

- s：是表示按何种方式排序

| 选项 | 说明                                                |
| ---- | --------------------------------------------------- |
| c    | 访问次数                                            |
| i    | 锁定时间                                                    |
| r    | 返回记录                                                    |
| t    | 查询时间                                                    |
| al   | 平均锁定时间                                                    |
| ar   | 平均返回记录数                                                    |
| at   | 平均查询时间                                                    |

- t：即为返回前面多少条的数据
- g：后边搭配一个正则匹配模式，大小写不敏感的

## 3. 常用分析语法

查找返回记录做多的10条SQL

`mysqldumpslow -s r -t 10 日志路径`

查找使用频率最高的10条SQL

`mysqldumpslow -s c -t 10 日志路径`

查找按照时间排序的前10条里包含左连接的SQL

`mysqldumpslow -s t -t 10 -g "left join" 日志路径`


通过more查看日志，防止爆屏

`mysqldumpslow -s r -t 10 日志路径 | more`




