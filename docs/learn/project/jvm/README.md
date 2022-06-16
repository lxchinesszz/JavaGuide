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
sidebarDepth: 3
title: JVM调优
password: 123
icon: zuanshi
image: https://img.springlearn.cn/blog/learn_1654183539000.png
---

## 一、JVM内存介绍

我们在学习JVM的内存管理的时候,我们的思维要跳出Java的局限。我们要这么理解。我们写的Java代码，是运行在JVM上的。
如果让你来实现JVM那么。你会怎么处理呢?

- 公共部分(堆heap)
    - `Class字节码`是公共的,是共享的,所有线程都要认识字节码。
    - `new的对象`是公共的,也是共享的,所有线程要都能认识这些实例对象,能读取到实例的数据。
- 私有部分 (栈stock)
    - Java中每个线程的执行中的代码，及代码中的局部变量等信息是私有的。每个线程之间都要维护一份。
    - JVM虚拟栈和本地方法栈。
    - 代码是怎么执行的,当然是一行一行执行。那么这一行一行的代码是放在哪里的呢? 是放在栈里面的。Java代码是在JVM来执行的。
      所以这个栈，我们称为`JVM虚拟栈`。
    - JVM中有些方法是调用其他语言实现的, 会使用`本地方法栈`。
    - 那么谁来读取栈里面的数据,来出栈执行呢? 这叫做`PC寄存区`。

## 1.1 堆空间

[JVM参数配置说明](/learn/project/jvm/JVM参数配置说明/)

![](https://img.springlearn.cn/blog/learn_1654183539000.png)

### 1.1.1 堆上信息

![](https://img.springlearn.cn/blog/learn_1654188805000.png)

`new` 出来的对象都在堆上。当堆的内存不足，会触发gc。[GC策略](/)。

### 1.1.2 堆的相关配置

| 配置参数                         | 说明                        | 示例                                                                                                                                                                             |
|:-----------------------------|:--------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-Xmx`                       | 设置最大堆大小。                  | `-Xmx3550m`，设置JVM最大可用内存为3550 MB。                                                                                                                                               |
| `-Xms`                       | 设置JVM初始内存。                | `-Xms3550m`，设置JVM初始内存为3550 MB。此值建议与`-Xmx`相同，避免每次垃圾回收完成后JVM重新分配内存。                                                                                                              |
| `-Xmn2g`                     | 设置年轻代大小。                  | `-Xmn2g`，设置年轻代大小为2 GB。整个JVM内存大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64 MB，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。                                                            |
| `-XX:NewRatio=n`             | 设置年轻代和年老代的比值。             | `-XX:NewRatio=4`，设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。如果设置为4，那么年轻代与年老代所占比值为1:4，年轻代占整个堆栈的1/5。                                                                                |
| `-XX:SurvivorRatio=n`        | 年轻代中Eden区与两个Survivor区的比值。 | `-XX:SurvivorRatio=4`，设置年轻代中Eden区与Survivor区的大小比值。如果设置为4，那么两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6。                                                                    |
| `-XX:MaxPermSize=n`          | 设置持久代大小。(JDK8以移除)         | `-XX:MaxPermSize=16m`，设置持久代大小为16 MB。                                                                                                                                           |
 | `-XX:MaxTenuringThreshold=n` | 设置垃圾最大年龄。                 | `-XX:MaxTenuringThreshold=0`，设置垃圾最大年龄。如果设置为0，那么年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，提高了效率。如果将此值设置为较大值，那么年轻代对象会在Survivor区进行多次复制，增加了对象在年轻代的存活时间，增加在年轻代即被回收的概率。                  |

### 1.1.3 常见问题

- 大对象，无法释放，导致内存移除。
**堆上的问题是比较容易排查的,可以通过工具把堆的信息给dump下来,然后就能直接定位到大对象,并通过调用链路定位到具体的代码,后面会介绍工具**


## 1.2 非堆空间

![](https://img.springlearn.cn/blog/learn_1654188048000.png)

### 1.2.1 非堆上的信息

![](https://img.springlearn.cn/blog/learn_1654188805000.png)

- `Thread` 配置线程的栈大小，决定了你调用链的深度。
- `Metaspace` 可加载类的信息大小

### 1.2.2 相关配置

| 配置参数                         | 说明                        | 示例                                                                                                                                                                             |
|:-----------------------------|:--------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-Xss`                       | 设置线程的栈大小。                 | `-Xss128k`，设置每个线程的栈大小为128 KB。**说明** JDK 5.0版本以后每个线程栈大小为1 MB，JDK 5.0以前版本每个线程栈大小为256 KB。请依据应用的线程所需内存大小进行调整。在相同物理内存下，减小该值可以生成更多的线程。但是操作系统对一个进程内的线程个数有一定的限制，无法无限生成，一般在3000个~5000个。 |
| `-XX:MaxMetaspace=n`         | 设置元空间大小。        | `-XX:MaxMetaspace=16m`，设置元空间大小为16 MB。                                                                                                                                          |


## 二、工具介绍

## 2.1 原生命令

## 2.2 二方可视化分析

### 2.2.1 idea 插件VisualGC

![](https://img.springlearn.cn/blog/learn_1654189397000.png)

![](https://img.springlearn.cn/blog/learn_1654189362000.png)

### 2.2.2 JProfile

[JProfile](https://www.ej-technologies.com/products/jprofiler/overview.html)

![](https://img.springlearn.cn/blog/learn_1654189623000.png)

### 2.2.3 Arthas 

[Arthas](https://arthas.aliyun.com/zh-cn/)

**Arthas功能是比较强大的,非常适合用于排查些疑难问题**

![](https://img.springlearn.cn/blog/learn_1654189757000.png)

## 2.3 GC日志学习

- 开启GC日志参数 `-XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintGCDateStamps`

### 2.3.1 年轻代GC

- 首先是年轻代GC

```
2022-06-03T00:13:48.801-0800: 
0.369: 
[GC (Allocation Failure) 
[PSYoungGen: 7168K->1513K(8704K)] 7168K->4097K(49664K), 0.0183816 secs] 
[Times: user=0.02 sys=0.01, real=0.02 secs] 
```

- `2022-06-03T00:13:48.801-0800` -XX:+PrintGCDateStamps 打印日期
- `0.369` -XX:+PrintGCDateStamps JVM启动到当前日期的总时长的时间戳形式
- `[GC (Allocation Failure)` GC 原因(Allocation Failure) 分配失败
  - ==Allocation Failure== 分配失败
  - ==Metadata GC Threshold== 元空间不足
  - ==Last ditch collection== 元空间GC后,仍然不足,即触发
- `PSYoungGen` 年轻代GC
- `Times` 耗时统计
  - `user` 表示GC线程执行所使用的CPU总时间
  - `sys` 进程在内核态消耗的CPU时间
  - `real` 程序从开始到结束所用的时钟时间,这个时间接近 sys + user

**由于多核的原因,一般的GC事件中, real time是小于sys + user time的,因为一般是多个线程并发的去做GC,所以real time是要小于systuser time的**


### 2.3.2 老年代GC

老年代执行的是 Full GC，Full GC执行的时候，不止回收老年代，还会回收新生代和元数据空间

```
2022-06-03T00:22:27.829-0800:
0.798: 
[Full GC (Allocation Failure) 
[PSYoungGen: 0K->0K(8704K)] 
[ParOldGen: 36024K->36006K(40960K)] 36024K->36006K(49664K), 
[Metaspace: 3078K->3078K(1056768K)], 0.2006976 secs] 
[Times: user=1.11 sys=0.01, real=0.21 secs] 
``` 

- `2022-06-03T00:13:48.801-0800` -XX:+PrintGCDateStamps 打印日期
- `0.369` -XX:+PrintGCDateStamps JVM启动到当前日期的总时长的时间戳形式
- `[Full GC (Allocation Failure)` GC 原因(Allocation Failure) 分配失败 
  - ==Allocation Failure== 分配失败
  - ==Metadata GC Threshold== 元空间不足
  - ==Last ditch collection== 元空间GC后,仍然不足,即触发
- `PSYoungGen` 年轻代GC
- `ParOldGen` 老年代GC
- `Metaspace` 元空间或者叫方法区GC
- `Times` 耗时统计
  - `user` 表示GC线程执行所使用的CPU总时间
  - `sys` 进程在内核态消耗的CPU时间
  - `real` 程序从开始到结束所用的时钟时间,这个时间接近 sys + user



## 三、场景分析

## 3.1 堆空间导致OOM

### 3.1.1 模拟堆栈

### 3.1.2 现象

1. 频繁进行fu gc
2. 应用吞吐量下降
3. 应用rt上升
4. 方法调用报错**OutOfMemoryError : Java heap space**

### 3.1.3 解决方案

1. `jps` 找到应用 `pid`
2. 把堆信息dump下来 `jmap -dump:format=b,file=heap.hprof  ${pid}`
3. 打开JProfile 打开文件,直接看到大对象是哪个。

![](https://img.springlearn.cn/blog/learn_1654191631000.png)

## 3.2 CPU飙升

### 3.2.1 解决方案

1. 找到那些线程在阻塞 `jstack $PID`
2. 如下片段发现线程都是 `BLOCKED` 状态, 调用点都在 `CPU.java:18`

``` 
"Thread-497" #508 prio=5 os_prio=31 tid=0x00007f88f58a0000 nid=0x41903 waiting for monitor entry [0x0000000326ea5000]
   java.lang.Thread.State: BLOCKED (on object monitor)
	at java.io.PrintStream.println(PrintStream.java:735)
	- waiting to lock <0x00000007bce02720> (a java.io.PrintStream)
	at learn.jvm.CPU.lambda$main$0(CPU.java:18)
	at learn.jvm.CPU$$Lambda$1/189568618.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:748)

"Thread-496" #507 prio=5 os_prio=31 tid=0x00007f88f589f800 nid=0x41a03 waiting for monitor entry [0x0000000326da2000]
   java.lang.Thread.State: BLOCKED (on object monitor)
	at java.io.PrintStream.println(PrintStream.java:735)
	- waiting to lock <0x00000007bce02720> (a java.io.PrintStream)
	at learn.jvm.CPU.lambda$main$0(CPU.java:18)
	at learn.jvm.CPU$$Lambda$1/189568618.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:748)

"Thread-495" #506 prio=5 os_prio=31 tid=0x00007f8905034000 nid=0x41c03 waiting for monitor entry [0x0000000326c9f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
	at java.io.PrintStream.println(PrintStream.java:735)
	- waiting to lock <0x00000007bce02720> (a java.io.PrintStream)
	at learn.jvm.CPU.lambda$main$0(CPU.java:18)
	at learn.jvm.CPU$$Lambda$1/189568618.run(Unknown Source)
	at java.lang.Thread.run(Thread.java:748)
```



## 3.3 非堆空间导致OOM

