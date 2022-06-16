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
title: SQL锁机制
---

![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

## 一、场景模拟


```sql
create table shop
(
  id int(4) primary key default 0,
  name varchar(20) default '衣服',
  status varchar(20) default '可售'
)engine = innodb default charset=utf8;

insert into shop  values(1,'衣服','可售');
```

```
mysql> select * from shop;
+----+--------+--------+
| id | name   | status |
+----+--------+--------+
|  1 | 衣服   | 可售   |
+----+--------+--------+
1 row in set (0.00 sec)
```

有一个X姨夫,两个用户并发操作问题

A先看到衣服: X加锁 -> 试衣服 -> 下单 -> 付款 -> 打包 -> X解锁
B也相对衣服: 发现X已经被A加锁了,等待X解锁。

## 二、锁知识

### 锁类型
a. 读锁(共享锁):
b. 写锁(互斥锁): 如果当前写操作没有完毕,则无法进行其他的写操作。

### 锁范围

- innodb默认行锁(开销大,加锁慢,锁范围小,易死锁,不容器锁冲突,并发度高)
- MyISAM默认表锁(开销小,加锁块,无死锁,但是锁范围大容器锁冲突,并发度低)

1. 表锁(对一张表整体加锁)
2. 行锁(对一行数据进行加锁)

---

## 三、锁分析

### 1. 查看加锁的表


`show open tables;`

1代表加锁

```
mysql> show open tables;
+--------------------+---------------------------+--------+-------------+
| Database           | Table                     | In_use | Name_locked |
+--------------------+---------------------------+--------+-------------+
| test               | emp                       |      0 |           0 |
| test               | test_innodb_lock          |      0 |           0 |
| test               | test03                    |      0 |           0 |
| test               | teacher2                  |      0 |           0 |
| test               | course2                   |      0 |           0 |
| test               | book                      |      0 |           0 |
| test               | shop                      |      1 |           0 |
| test               | staffs                    |      0 |           0 |
| test               | dept                      |      0 |           0 |
+--------------------+---------------------------+--------+-------------+
73 rows in set (0.00 sec)
```

### 2. 查看锁的严重程度

`show status like '%Table_locks%';`


```
mysql> show status like '%Table_locks%';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Table_locks_immediate | 79    |
| Table_locks_waited    | 0     |
+-----------------------+-------+
2 rows in set (0.00 sec)
```

**Table_locks_immediate** 能立马加锁
**Table_locks_waited** 越大说明竞争越大

建议:
Table_locks_immediate/Table_locks_waited > 5000,建议采用innodb,否则建议MyISAM。


## 四、模拟加表锁

`lock table 表1 read/write,表2 read/write`

```
lock table shop write;
```


### 加表读锁


如A会话,对shop表加了read锁,则该会话可以对shop表进行读操作,不能进行写操作。
并且只能读自己加锁了的表,如下面列子最shop加锁,能读shop不能写shop,不能读test03

**如果对shop表加了read锁,那么只能对shop进行读,其他任何操作都不行了**


```
mysql> lock table shop read;
Query OK, 0 rows affected (0.01 sec)

mysql> select * from shop
    -> ;
+----+--------+-----------+
| id | name   | status    |
+----+--------+-----------+
|  1 | 衣服   | 已占用    |
+----+--------+-----------+
1 row in set (0.00 sec)

mysql> update shop set status = '可售' where id = 1;
ERROR 1099 (HY000): Table 'shop' was locked with a READ lock and can't be updated
mysql> select * from test03;
ERROR 1100 (HY000): Table 'test03' was not locked with LOCK TABLES
```

![](https://img.springlearn.cn/blog/learn_1596460128000.png)


其他B会话中,对于shop表能读不能写,但是不影响操作其他表。

![](https://img.springlearn.cn/blog/learn_1596460283000.png)

### 加表写锁

- 会话A: lock table shop write;
    当前会话可以对加了锁的表进行任意操作;但是不能操作其他表。
- 其他会话B:
    当会话A释放了锁,B才能对这个表进行增删改查;


## 五、模拟加行锁

```sql
create table linelock
(
    id int(5) primary key auto_increment,
    name varchar(20)
) engine = innodb;

insert into linelock(name) values('1');
insert into linelock(name) values('2');
insert into linelock(name) values('3');
insert into linelock(name) values('4');
insert into linelock(name) values('5');
```

### A窗口写操作

`insert into linelock(name) values('6');`


此时B窗口执行update更新会被锁定。

![](https://img.springlearn.cn/blog/learn_1596463371000.png)

当A会话commit之后B就能继续操作了。
![](https://img.springlearn.cn/blog/learn_1596463461000.png)

行锁是通过事务进行解锁的。

### 行锁转表锁

如果索引列进行了类型转换,则索引失效。


A窗口执行
`update linelock set name = 'ai' where name = 3;`

B窗口执行
`update linelock set name = 'ax' where name = 4;`


![](https://img.springlearn.cn/blog/learn_1596464724000.png)


### 间隙锁

update linelock set name = 'x' where id > 1 and id < 8;

![](https://img.springlearn.cn/blog/learn_1596465102000.png)

### 行锁分析

`show status like '%innodb_row_lock%';`

```
mysql> show status like '%innodb_row_lock%';
+-------------------------------+--------+
| Variable_name                 | Value  |
+-------------------------------+--------+
| Innodb_row_lock_current_waits | 1      |
| Innodb_row_lock_time          | 207248 |
| Innodb_row_lock_time_avg      | 34541  |
| Innodb_row_lock_time_max      | 51605  |
| Innodb_row_lock_waits         | 6      |
+-------------------------------+--------+
5 rows in set (0.00 sec)
```

![](https://img.springlearn.cn/blog/learn_1596465415000.png)


| Variable_name                 | Value  |
| ------ | ----- |
| Innodb_row_lock_current_waits | 当前正在等待的锁的数量      |
| Innodb_row_lock_time          | 等待总时长,从系统启动到现在一共等待时间 |
| Innodb_row_lock_time_avg      | 平均等待时长  |
| Innodb_row_lock_time_max      | 最大等待时长  |
| Innodb_row_lock_waits         | 等待的次数      |


### 查询语句加锁

`set autocommit=0;`
`select * from linelock for update;`

![](https://img.springlearn.cn/blog/learn_1596466172000.png)


最后求关注,求订阅,谢谢你的阅读!


