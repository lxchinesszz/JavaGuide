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
title: Guava-Map
---

## 一、简介

Guava 是一组来自 Google 的核心 Java 库，其中包括新的集合类型（例如 multimap 和 multiset）、不可变集合、图形库以及用于并发、I/O、散列、缓存、原语、字符串等的实用程序！它广泛用于 Google
内部的大多数 Java 项目，也被许多其他公司广泛使用。


API 非常的简单，我们可以非常轻松的使用，来封装成我们业务中自己的组件。

## 二、依赖

```xml 
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
        <version>30.1.1-jre</version>
    </dependency>
```

## 三、使用介绍

### 3.1 Table 双键 Map

java中的Map只允许有一个key和一个value存在，但是guava中的Table允许一个value存在两个key。Table中的两个key分别被称为rowKey和columnKey，也就是行和列。

```java 
Table<String,String,Integer> table= HashBasedTable.create();
//存放元素
table.put("Hydra", "Jan", 20);
table.put("Hydra", "Feb", 28);
table.put("Trunks", "Jan", 28);
table.put("Trunks", "Feb", 16);
//取出元素
Integer dayCount = table.get("Hydra", "Feb");
```

### 3.2 BiMap 双向Map

在普通Map中，如果要想根据value查找对应的key，没什么简便的办法，无论是使用for循环还是迭代器，都需要遍历整个Map。
而guava中的BiMap提供了一种key和value双向关联的数据结构。

```java {7}
HashBiMap<String, String> biMap = HashBiMap.create();
biMap.put("Hydra","Programmer");
biMap.put("Tony","IronMan");
biMap.put("Thanos","Titan");
//使用key获取value
System.out.println(biMap.get("Tony"));
BiMap<String, String> inverse = biMap.inverse();
//使用value获取key
System.out.println(inverse.get("Titan"));
```

注意: 反转后的BiMap并不是一个新的对象，它实现了一种视图的关联，所以对反转后的BiMap执行的所有操作会作用于原先的BiMap上。

```java 
HashBiMap<String, String> biMap = HashBiMap.create();
biMap.put("Hydra","Programmer");
biMap.put("Tony","IronMan");
biMap.put("Thanos","Titan");
BiMap<String, String> inverse = biMap.inverse();
inverse.put("IronMan","Stark");
System.out.println(biMap);
```
对反转后的BiMap中的内容进行了修改后，再看一下原先BiMap中的内容：

```java 
{Hydra=Programmer, Thanos=Titan, Stark=IronMan}
```
可以看到，原先值为IronMan时对应的键是Tony，虽然没有直接修改，但是现在键变成了Stark。



### 3.3 Multimap 多值Map

java中的Map维护的是键值一对一的关系，如果要将一个键映射到多个值上，那么就只能把值的内容设为集合形式，而在guava中可以使用如下：

```java 
Multimap<String, Integer> multimap = ArrayListMultimap.create();
multimap.put("day",1);
multimap.put("day",2);
multimap.put("day",8);
multimap.put("month",3);
```

打印这个Multimap的内容，可以直观的看到每个key对应的都是一个集合：

``` 
{month=[3], day=[1, 2, 8]}
```

### 3.4 RangeMap 范围Map

先看一个例子，假设我们要根据分数对考试成绩进行分类，那么代码中就会出现这样丑陋的if-else：

```java 
public static String getRank(int score){
    if (0<=score && score<60)
        return "fail";
    else if (60<=score && score<=90)
        return "satisfactory";
    else if (90<score && score<=100)
        return "excellent";
    return null;
}
```

而guava中的RangeMap描述了一种从区间到特定值的映射关系，让我们能够以更为优雅的方法来书写代码。下面用RangeMap改造上面的代码并进行测试：

```java 
RangeMap<Integer, String> rangeMap = TreeRangeMap.create();
rangeMap.put(Range.closedOpen(0,60),"fail");
rangeMap.put(Range.closed(60,90),"satisfactory");
rangeMap.put(Range.openClosed(90,100),"excellent");
System.out.println(rangeMap.get(59));
System.out.println(rangeMap.get(60));
System.out.println(rangeMap.get(90));
System.out.println(rangeMap.get(91));
```

在上面的代码中，先后创建了[0,60)的左闭右开区间、[60,90]的闭区间、(90,100]的左开右闭区间，并分别映射到某个值上。运行结果打印：

``` 
fail
satisfactory
satisfactory
excellent
```

### 3.5 ClassToInstanceMap 实例Map

ClassToInstanceMap是一个比较特殊的Map，它的键是Class，而值是这个Class对应的实例对象。先看一个简单使用的例子，使用putInstance方法存入对象

```java 
ClassToInstanceMap<Object> instanceMap = MutableClassToInstanceMap.create();
User user=new User("Hydra",18);
Dept dept=new Dept("develop",200);
instanceMap.putInstance(User.class,user);
instanceMap.putInstance(Dept.class,dept);
```
那么，使用ClassToInstanceMap这种方式有什么好处呢?

最明显的就是在取出对象时省去了复杂的强制类型转换，避免了手动进行类型转换的错误。
所以，如果你想缓存对象，又不想做复杂的类型校验，那么使用方便的ClassToInstanceMap就可以了。
