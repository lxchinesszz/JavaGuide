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
title: Reactive 反应式编程
---

::: tip 反应式编程
reactive 是一种新的编程思想, 如同名字一样, 反应式编程。而Reactor 是一个工具包，类似于
Spring一样。这点我们可以直接在Spring的官网上可以看到。本篇基于小编自己的学习进行总结。
:::

![](https://img.springlearn.cn/blog/learn_1651411884000.png)

## 一、提出问题

目前来说反应式编程在Java行业其实不是很流行, 其原因1在于传统的编程模型已经根深蒂固。虽然阻塞但是其实对于业务开发
并不是一个很大的痛点。其2新的编程思想具有学习成本，但是又不是特别的痛，所以没有引起关注。下面我们来带着问题来学习吧。

## 1.1 什么是反应式编程?

哎，可能因为都是从外国翻译过来的缘故，总喜欢翻译写高大上，且晦涩难懂的文字进行描述，搞得大多数程序猿一头雾水。但是没办法，
谁让你不主动去学习原文，而要吃一些大牛的二手翻译资料呢。所以我们就要最这些二手资料进行重读，并且深入思考，来总结出自己的理解。
小编理解，所谓反应式编程，简单来说就是基于事件编程，由事件去驱动。比如我们servlet api，传统的方式servlet 线程是阻塞线程，
如果方法没有执行完成，那么servlet线程会一直在阻塞等待。从而会导致不能接受更多的外部请求。而如果要使用反应式编程

## 1.2 反应式编程中背压指得是什么?

我也不知道为什么称背压，如果单从这个词汇来说，想死都想不通。什么鬼玩意呀。现在我们忽略这个sb的词汇。直接来说他的含义。
要想搞明白这个，先知道事件驱动是如何设计的。首先有一个事件发送者，和一个事件处理者。传统的方式是事件处理者被动的来接受
事件发送者，发起的事件，并进行处理，而在reactor中，事件的处理者不仅可以被动的接受，同时也支持主动的拉去事件。于是这种
能力被称为背压。在高大上的解释就是，这能实现组件之间的弹性。

## 1.3 反应式编程好处是什么?

我们直接看官网的说明，然后进行白话翻译。

> Reactive systems better utilize modern processors. Also, the inclusion of back-pressure in reactive programming
> ensures better resilience between decoupled components.

直白点就是可以充分的利用其cpu多核多线程的处理能力, 另外背压的能力,使组件知道当前的负载,动态的确定自己还能接受的任务数量,称之为弹性。

## 二、Reactor 核心类

这种编程思想其实还是值得学习的，因为基于事件来驱动，确实可以充分的利用其cpu多核多线程的处理能力。充分压榨cpu的能力。
其实我们在很多地方都能看到类似的设计思想。eg: RxJava, Netty。
下面我们就学习下如何使用吧。

## 2.1 Publisher 发布者

发布者只有一个接口,提供订阅能力。

```java 
public interface Publisher<T> {
    // 绑定一个订阅者
    public void subscribe(Subscriber<? super T> s);
}
```

## 2.2 Subscriber 订阅者

订阅者主要处理发布者发布的信息

```java 
public interface Subscriber<T> {
    // 确定订阅关系
    public void onSubscribe(Subscription s);
    // 处理数据
    public void onNext(T t);
    // 错误处理
    public void onError(Throwable t);
    // 当事件处理完时触发
    public void onComplete();
}
```

## 2.3 Subscription 订阅关系

订阅关系，可以取消订阅，通知可以实现拉去能力。

```java 
public interface Subscription {
    // 获取指定数量的数据
    public void request(long n);
    // 取消订阅关系
    public void cancel();
}
```

## 2.4 Sink 数据池

Sink#next会将数据放入池中，由Sink缓存或直接发送给订阅者。

Mono和Flux分别提供了create和generate的方法,用来绑定事件发射器 Sink。开发者可以利用Sink来
生产事件数据，然后发送给订阅者。

## 三、事件模式

Push推模式，PUSH_PULL混合模式

```java 
enum CreateMode {
	PUSH_ONLY, PUSH_PULL
}
```

## 3.1 Pull 模式

generate 方法适用于拉去模式，当订阅者调用Subscription#request,则从Sink#next生产一条数据。
如下两个代码示例。

```java 
    @Test
    @DisplayName("Flux Pull模式 Integer.MAX_VALUE")
    public void testFluxPull() {
        Flux.generate((Consumer<SynchronousSink<Integer>>) sink -> {
                    int k = (int) (Math.random() * 10);
                    sink.next(k);
                })
                // 默认获取 request(Integer.MAX_VALUE)
                .subscribe(integer -> System.out.println("Pull:" + integer));
    }

    @Test
    @DisplayName("Flux Pull模式 request调用一次,则调用Sink生产一次")
    public void testFluxPullTwo() {
        Flux.generate((Consumer<SynchronousSink<Integer>>) sink -> {
                    int k = (int) (Math.random() * 10);
                    sink.next(k);
                })
                .subscribe(new Subscriber<Integer>() {
                    Subscription subscription;

                    private int count;

                    @Override
                    public void onSubscribe(Subscription s) {
                        this.subscription = s;
                        // 订阅时候,生产1条数据
                        this.subscription.request(1);
                    }

                    @Override
                    public void onNext(Integer integer) {
                        count++;
                        System.out.println("处理:" + integer);
                        // 在处理1次，当第二次处理时候,就不拉数据了
                        if (count < 2) {
                            this.subscription.request(1);
                        }
                    }

                    @Override
                    public void onError(Throwable t) {
                        System.out.println("onError");
                    }

                    @Override
                    public void onComplete() {
                        System.out.println("onComplete");
                    }
                });
    }
```

``` 
处理:3
处理:1
```

## 3.2 Push 模式

发布者主动推动数据,跟Pull的区别是。他不会随着,订阅者调用Subscription#request,而从Sink#next生产一条数据。
只有订阅时候Subscription#request,Sink只会执行一次

```java 
    @Test
    @DisplayName("Flux Push模式")
    public void testFluxPush() {
        Flux.create((Consumer<FluxSink<Integer>>) sink -> {
            int k = (int) (Math.random() * 10);
            sink.next(k);
        }).subscribe(new Subscriber<Integer>() {

            Subscription subscription;

            @Override
            public void onSubscribe(Subscription s) {
                this.subscription = s;
                this.subscription.request(1);
            }

            @SneakyThrows
            @Override
            public void onNext(Integer integer) {
                System.out.println("处理:" + integer);
            }

            @Override
            public void onError(Throwable t) {
                System.out.println("处理失败");
            }

            @Override
            public void onComplete() {
                System.out.println("处理完成");
            }
        });
    }
```

```
处理:9
```


## 四、事件驱动的好处

反应式编程的好处, 主要是编程思想的不同, 抓住关键点非阻塞+事件驱动。

```
StopWatch '耗时统计': running time = 2070915374 ns
---------------------------------------------
ns         %     Task name
---------------------------------------------
063036666   003%  基于事件驱动的编程思想
2007878708  097%  传统阻塞式的编程思想
```

如下举一个例子,假如这是Servlet API。Servlet 线程负责调用getMonoUserName()。但是其实没有执行
处理逻辑,而真正的执行逻辑交给业务线程处理。而此时Servlet线程可以释放出来,继续接受外部请求。


```java 
    @Test
    @DisplayName("Mono 事件驱动的好处")
    public void testMono() {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start("基于事件驱动的编程思想");
        Mono<String> userNameMono = getMonoUserName();
        stopWatch.stop();
        stopWatch.start("传统阻塞式的编程思想");
        System.out.println(getUserName());
        stopWatch.stop();
        System.out.println(userNameMono.block());
        System.out.println(stopWatch.prettyPrint());
    }


    @SneakyThrows
    public String getUserName() {
        Thread.sleep(2000L);
        return "JayChou";
    }

    /**
     * 基于事件驱动的编程思想
     *
     * @return Mono<String>
     */
    public Mono<String> getMonoUserName() {
        return Mono.create(monoSink -> {
            try {
                Thread.sleep(2000L);
            } catch (InterruptedException e) {
                monoSink.error(new RuntimeException(e));
                return;
            }
            monoSink.success("JayChou");
        });
    }

```


## 五、总结 & 思考

传统的编程思想是: 基于数据处理来写处理逻辑,逻辑中可能直接就阻塞了。
反应式编程思想是: 我们只写数据处理逻辑,里面虽然也有阻塞,但是并不直接执行。类似线程中,Future#get

![](https://img.springlearn.cn/blog/learn_1651427177000.png)

其主要的不同就是编程思想不同，非阻塞的编程思想。但是我们也发现, 这样的思想其实带来好处其实并不是很大。
我们也可以直接使用多线程来直接搞定，而不用增加学习成本来学习新的框架。

**为什么反应式编程在后端开发者里面推广不起来**

作为后台服务, 开发者其实对吞吐量并不是很关心,比如页面请求了后端，就算我后端服务慢，前台请求就会卡住。卡住就卡住等待呗，不管用什么框架都会卡住。（秒杀高并发服务除外，并不是所有的服务都要求高并发。特殊情况特殊处理, 异步也解决不了高并发的吞吐和rt问题）

但是如果作为安卓开发呢？
用户发起了一个请求, 请求慢就让用户主线程就卡住，手机不能滑动。这样用户体验是非常的差的。所以安卓开发会比较关注，解决方案就是纯异步，主线程只接受请求，然后任务安排给后台异步线程，这样就算请求慢，但是用户不会感觉手机是卡顿的。等到异步任务执行完，在跳转出来就行了。

所以RxJava 是鼻祖，Reactor是追随者。也是因为上面的特性，所以后台开发者没有安卓开发者感兴趣，不需要压榨机器的性能。

`Reactor要想推广起来，必须要与异步Servlet或是Spring WebFlux结合`（开发者无感使用），或是`云原生应用彻底推广起来,强制开发者必须使用。`才可能推广使用起来。
但是不管怎么样这种编程思想是可以借鉴。

