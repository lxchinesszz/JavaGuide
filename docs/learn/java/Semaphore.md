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
title: 信号量 Semaphore
category: Java进阶
---


![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

## 🚀 知识快读

`Semaphore` 翻译过来就是信号量, 其根本原理就是基于 `CAS` 共享锁的一种实现。举一个例子。
假设停车场只有三个车位，一开始三个车位都是空的。这时如果同时来了五辆车，看门人允许其中三辆不受阻碍的进入，然后放下车拦，剩下的车则必须在入口等待，此后来的车也都不得不在入口处等待。这时，有一辆车离开停车场，看门人得知后，打开车拦，放入一辆，如果又离开两辆，则又可以放入两辆，如此往复。

那么上面的这个例子可以这样理解，资源一共有3个, 即三个车位。如何来控制这5辆汽车，来合理的使用这3个资源呢?
`Semaphore` 可以这样来定义。

```java
// 1. 定一个信号量,声明有3个资源。使用公平模式线程将会按到达的顺序（FIFO）执行(也就是等待时间最长的先执行),如果是非公平，则可以后请求的有可能排在队列的头部。
Semaphore semp = new Semaphore(3);
// 2. 获取1个许可 - 最大允许3个进入，一但超过就让其等待,除非已经释放
semp.acquire();  
// 3. 释放1个许可 
semp.release(); 
// 4. 获取1许可,失败就返回,不等待
semp.tryAcquire();  
// 5. 获取2许可,失败就返回,不等待
semp.tryAcquire(2);  
// 6. 不允许被中断
semp.acquireUninterruptibly();
```

## 知识点1: Fair & NoFair

`Semaphore` 的模式配置,只是构造来定义。

- 默认构造不公平模式, 谁来申请资源,就先尝试获取资源。排队的要等到没有资源进来申请才能继续申请

```java
    public Semaphore(int permits) {
        sync = new NonfairSync(permits);
    }

    public Semaphore(int permits, boolean fair) {
        sync = fair ? new FairSync(permits) : new NonfairSync(permits);
    }
```

![](https://img.springlearn.cn/blog/learn_1640531082000.png)

## 知识点2: 申请资源

- acquire() 获取1个资源,获取不到就等待,如果线程中断,会直接中断。
- acquire(2) 获取2个资源,获取不到就等待,如果线程中断,会直接中断。
- tryAcquire() 获取1个资源,获取不到就返回 `false`,如果线程中断,会直接中断。
- acquireUninterruptibly() 获取1个资源,获取不到就等待,不会关心线程中断。

## 知识点3: 释放资源

- release() 释放一个资源
- release(2) 释放两个资源

## 知识点4: 其他API

- availablePermits() 当前资源数量
- drainPermits() 获取当前资源数量，并将剩余资源清零，直接赋值0
- reducePermits(2) 将资源数量，扣减2个 
- isFair() 是否公平
- hasQueuedThreads() 是否还有线程等待
- getQueueLength() 还有多少线程等待
- getQueuedThreads() 获取所有的线程集合
