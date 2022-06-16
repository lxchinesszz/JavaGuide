---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: true
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: explain调优
---

![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

> 这篇文章主要讲 explain 如何使用，还有 explain 各种参数概念，之后会讲优化

# 一、Explain 用法

explain模拟Mysql优化器是如何执行SQL查询语句的，从而知道Mysql是如何处理你的SQL语句的。分析你的查询语句或是表结构的性能瓶颈。

**语法**：`Explain + SQL 语句;`

如：`Explain select * from user;` 会生成如下 SQL 分析结果，下面详细对每个字段进行详解

![](https://img.springlearn.cn/blog/learn_1596351159000.png)

## 1. id

是一组数字，代表多个表之间的查询顺序，或者包含子句查询语句中的顺序，id 总共分为三种情况，依次详解

### id相同

id相同，执行顺序由上至下
![](https://img.springlearn.cn/blog/learn_1596351240000.png)

### id不同

id 不同，如果是子查询，id 号会递增，id 值越大优先级越高，越先被执行

![](https://img.springlearn.cn/blog/learn_1596351303000.png)


### id相同和不同

id 相同和不同的情况同时存在

![](https://img.springlearn.cn/blog/learn_1596351331000.png)

## 2. select_type

select_type 包含以下几种值

`simple`、`primary`、`subquery`、`derived`、`union`、`union result`

### simple

简单的 `select` 查询，查询中不包含子查询或者 `union` 查询

![](https://img.springlearn.cn/blog/learn_1596351522000.png)

### primary

如果 SQL 语句中包含任何子查询，那么子查询的最外层会被标记为 `primary`

![](https://img.springlearn.cn/blog/learn_1596351575000.png)


### subquery

在 `select` 或者 `where` 里包含了子查询，那么子查询就会被标记为 `subQquery`，同三.二同时出现

![](https://img.springlearn.cn/blog/learn_1596351651000.png)


### derived

在 `from` 中包含的一个子查询，会被标记为衍生查询，会把查询结果放到一个临时表中

![](https://img.springlearn.cn/blog/learn_1596351720000.png)

### union / union result

如果有两个 `select` 查询语句，他们之间用 `union` 连起来查询，那么第二个 `select` 会被标记为 `union`，`union` 的结果被标记为 `union result`。它的 id 是为 null 的

![](https://img.springlearn.cn/blog/learn_1596351779000.png)

## 3. table

表示这一行的数据是哪张表的数据

## 4. type

type 是代表 MySQL 使用了哪种索引类型，不同的索引类型的查询效率也是不一样的，type 大致有以下种类。
越往上性能越高。

| Type类型 | 说明                                              |
| ---- | --------------------------------------------------- |
| system    | 表中只有一行记录，system 是 const 的特例，几乎不会出现这种情况，可以忽略不计                                           |
| const    | 必须是用主键索引或者唯一索引放到 where 条件中查询                                                   |
| eq_ref    | 多表查询中,索引查出来的数据都是唯一的（不能是多个,也不能是0个），常见于唯一索引和主键索引                                               |
| ref    | 不是主键索引，也不是唯一索引，就是普通的索引，可能会返回多个符合条件的行。               |
| range   | 体现在对某个索引进行区间范围检索，一般出现在 where 条件中的 between、and、<、>、in 等范围查找中。 |
| index   | 将所有的索引树都遍历一遍，查找到符合条件的行。索引文件比数据文件还是要小很多，所以比不用索引全表扫描还是要快很多。 |
| all   | 没用到索引，单纯的将表数据全部都遍历一遍，查找到符合条件的数据                     |

## 5. possible_keys


此次查询中涉及字段上若存在索引，则会被列出来，表示可能会用到的索引，但并不是实际上一定会用到的索引


## 6. key

此次查询中实际上用到的索引

## 7. key_len

表示索引中使用的字节数，通过该属性可以知道在查询中使用的索引长度，注意：这个长度是最大可能长度，并非实际使用长度，在不损失精确性的情况下，长度越短查询效率越高

## 8. ref

显示关联的字段。如果使用常数等值查询，则显示 const，如果是连接查询，则会显示关联的字段。

![](https://img.springlearn.cn/blog/learn_1596352252000.png)

- tb_emp 表为非唯一性索引扫描，实际使用的索引列为 idx_name，由于 tb_emp.name='rose'为一个常量，所以 ref=const。
- tb_dept 为唯一索引扫描，从 sql 语句可以看出，实际使用了 PRIMARY 主键索引，ref=db01.tb_emp.deptid 表示关联了 db01 数据库中 tb_emp 表的 deptid 字段。

## 9. rows

根据表信息统计以及索引的使用情况，大致估算说要找到所需记录需要读取的行数，rows 越小越好


## 10. extra

不适合在其他列显示出来，但在优化时十分重要的信息

### using  fileSort（重点优化）

俗称 " 文件排序 " ，在数据量大的时候几乎是“九死一生”，在 order by 或者在 group by 排序的过程中，order by 的字段不是索引字段，或者 select 查询字段存在不是索引字段，或者 select 查询字段都是索引字段，但是 order by 字段和 select 索引字段的顺序不一致，都会导致 fileSort

如果where后面的查询和order by的索引，不是一个值。就会出现fileSort。

复合索引,夸界,也会出现fileSort。

优化建议: where 什么就order by 什么。 或者 where和order by 按照复合索引顺序，不要跨列或者无序使用
![](https://img.springlearn.cn/blog/learn_1596352476000.png)


### using temporary（重点优化）

使用了临时表保存中间结果，常见于 order by 和 group by 中。

优化建议: 查询哪些列就用哪些列来order by。 能不用创建临时表就不要创建。

![](https://img.springlearn.cn/blog/learn_1596352573000.png)


### USING index（重点）

索引覆盖,就是当前sql查询不用读取原文件,只用读取索引。因为查询的列就是索引列

表示相应的 select 操作中使用了覆盖索引（Coveing Index）,避免访问了表的数据行，效率不错！如果同时出现 using where，表明索引被用来执行索引键值的查找；如果没有同时出现 using where，表面索引用来读取数据而非执行查找动作。

![](https://img.springlearn.cn/blog/learn_1596352650000.png)

### Using where

跟using index相反，要回表去查询。

表明使用了 where 过滤

### Using join buffer

使用了连接缓存

### impossible where

where 子语句的值总是 false，不能用来获取任何数据。出现这个就要检查sql。

eg: select a from test where a = 1 and a = 2。  a肯定不可能即1又是2

### select tables optimized away

在没有 GROUPBY 子句的情况下，基于索引优化 MIN/MAX 操作或者 对于 MyISAM 存储引擎优化 COUNT(*)操作，不必等到执行阶段再进行计算， 查询执行计划生成的阶段即完成优化。


### distinct

优化 distinct，在找到第一匹配的元组后即停止找同样值的工作
