---
breadcrumb: false
navbar: true
sidebar: auto
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
sidebarDepth: 3
title: Disruptor高性能队列
password: 123
icon: zuanshi
---

::: info 介绍
Disruptor是英国外汇交易公司LMAX开发的一个高性能队列，研发的初衷是解决内存队列的延迟问题。与Kafka、RabbitMQ用于服务间的消息队列不同，disruptor一般用于线程间消息的传递。基于Disruptor开发的系统单线程能支撑每秒600万订单。

disruptor适用于多个线程之间的消息队列，`作用与ArrayBlockingQueue有相似之处`，但是disruptor从功能、性能都远好于ArrayBlockingQueue，当多个线程之间传递大量数据或对性能要求较高时，可以考虑使用disruptor作为ArrayBlockingQueue的替代者。
官方也对disruptor和ArrayBlockingQueue的性能在不同的应用场景下做了对比，目测性能只有有5~10倍左右的提升。
:::


## 一、Disruptor的好处

通过前面的介绍我们知道Disruptor作用与ArrayBlockingQueue类似,适用于多个线程之间的消息队列。为什么呢?
因为Java中的队列就以BlockingQueue为例子,从命名上就能看出是一个阻塞的队列。当多线程的环境下会进行加锁。所以导致了性能不高，而Disruptor的设计
非常的巧妙,他形成了一个环形队列。通过消除锁,从而提高了性能。

[如何你还不了解Queue,请点这里✈️](/learn/java/BlockingQueue/)

Log4j2 异步输出，在使用了Disruptor的提升如下图。来源[log4j2官网](https://logging.apache.org/log4j/2.x/performance.html)

![](https://img.springlearn.cn/blog/learn_1653013607000.png)


## 二、为什么这么快

这里涉及到的知识点比较多,如果想学性能优化的同学可以去看看。可以学习里面的设计思想和优化的方向。

[Disruptor详解](https://www.jianshu.com/p/bad7b4b44e48)

[伪共享概念](/learn/java/Contended/)

## 三、如何使用

```xml 
        <dependency>
            <groupId>com.lmax</groupId>
            <artifactId>disruptor</artifactId>
            <version>3.4.2</version>
        </dependency>
```

## 3.1 定义Disruptor

```java 
        //指定RingBuffer大小,
        //必须是2的N次方
        int bufferSize = 1024;

        //构建Disruptor
        Disruptor<LongEvent> disruptor
                = new Disruptor<>(
                LongEvent::new,
                bufferSize,
                DaemonThreadFactory.INSTANCE);
```

## 3.2 定义事件处理器

```java 
        //注册事件处理器
        disruptor.handleEventsWith(
                (event, sequence, endOfBatch) ->
                        System.out.println("E: " + event));
```

## 3.3 生产数据

```java 
        //启动Disruptor
        disruptor.start();

        //获取RingBuffer
        RingBuffer<LongEvent> ringBuffer
                = disruptor.getRingBuffer();
        //生产Event
        ByteBuffer bb = ByteBuffer.allocate(8);
        for (long l = 0; l < 10; l++) {
            bb.putLong(0, l);
            //生产者生产消息
            ringBuffer.publishEvent(
                    (event, sequence, buffer) ->
                            event.setValue(buffer.getLong(0)), bb);
        }
```
