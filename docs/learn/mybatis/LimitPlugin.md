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
comment: true
footer: true
password: 111
backtotop: true
title: 第09篇:Mybatis查询限制插件设计
---
<PageBanner/>

## 一、实现目标

对查询类接口如果没有添加where条件的, 同时没有加 limit 限制的语句,我们自动给它加上limit参数。
这里我们需要使用到的技术就是sql分析和mybatis的代理的支持。


## 二、实现分析

## 2.1 sql分析

首先我们分析sql是否有where,是否有limit语句。这里我们使用[Druid SQL解析](https://java.springlearn.cn/learn/tools/druid/)
里面讲的知识点。

```java 
public SqlHelper{
    // 1. 入参分析sql,判断是否需要加上limit语句
    public boolean canAppendLimit(String sql){
        returen true;
    }
    
    // 2. 将原来sql添加上limit
    public SqlSource newSqlSource(SqlSource originSqlSource){
    
    } 
}
```

## 2.2 注册到插件中
