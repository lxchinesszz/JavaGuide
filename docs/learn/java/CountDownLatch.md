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
title: 倒计锁 CountDownLatch
category: Java进阶
---


![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

上文我们知道了 `Semaphore` 信号量的用法，那么这一篇基本不用学了。因为原理基本上是一样的。
但是用法不太一样。


`Semaphore` 是获取到资源就执行，获取不到资源就等待。
`CountDownLatch` 跟 `Semaphore` 正好相反。

CountDownLatch#await() 可以理解为获取不到资源，就等待。这么说不太好理解，直接看源码吧。

```java CountDownLatch内部实现类
private static final class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = 4982264981922014374L;

        Sync(int count) {
            setState(count);
        }

        int getCount() {
            return getState();
        }

        protected int tryAcquireShared(int acquires) {
            // 获取资源,await就是调用这个方法。当tryReleaseShared没有进行扣减之前。
            // 这里一直都是-1。而-1就是获取不到资源进行等待
            return (getState() == 0) ? 1 : -1;
        }

        protected boolean tryReleaseShared(int releases) {
            // countDown就调用这个方法,进行扣减1
            for (;;) {
                int c = getState();
                if (c == 0)
                    return false;
                int nextc = c-1;
                if (compareAndSetState(c, nextc))
                    return nextc == 0;
            }
        }
    }

```

## 常用用法

**注意:**
==CountDownLatch不可重复使用，当计数器减少到0之后，就废了，无法继续使用了。==

CountDownLatch是在java1.5被引入的，跟它一起被引入的并发工具类还有CyclicBarrier、Semaphore、ConcurrentHashMap和BlockingQueue，它们都存在于java.util.concurrent包下。CountDownLatch这个类能够使一个线程等待其他线程完成各自的工作后再执行。例如，应用程序的主线程希望在负责启动框架服务的线程已经启动所有的框架服务之后再执行。

CountDownLatch是通过一个计数器来实现的，计数器的初始值为线程的数量。每当一个线程完成了自己的任务后，计数器的值就会减1。当计数器值到达0时，它表示所有的线程已经完成了任务，然后在闭锁上等待的线程就可以恢复执行任务。

![](http://incdn1.b0.upaiyun.com/2015/04/f65cc83b7b4664916fad5d1398a36005.png)



## CountDownLatch 存在的意义

让主线程阻塞，等待线程结束后在运行


直译过来就是倒计数(CountDown)门闩(Latch)。倒计数不用说，门闩的意思顾名思义就是阻止前进。在这里就是指 CountDownLatch.await() 方法在倒计数为0之前会阻塞当前线程。

**实现**

CountDownLatch内部维护一个最大线程数，当每个线程执行结束，就调用
`latch.countDown();` 将数量减 1 ,当数量为0的时候，就放弃阻塞主线程，也就是放弃 `countDownLatch.await() `阻塞的线程


## 代码解释

```java
 public void test()throws Exception{
        int pagecount=3;
        ExecutorService executors = Executors.newFixedThreadPool(pagecount);
        CountDownLatch countDownLatch = new CountDownLatch(pagecount);
        for (int i = 0; i < pagecount; i++) {
            // 启动线程抓取
            executors
                    .execute(new Runnable() {
                        @Override
                        public void run() {
                            System.out.println(Thread.currentThread().getName());
                            countDownLatch.countDown();
                        }
                    });
        }
        countDownLatch.await();//主线程阻塞在这里，等到线程结束,
        //然后关闭线程池
        executors.shutdown();

    }



```



## 最大缺点

通过前面源码我们发现, `CountDownLatch` 只有减没有加，所以导致了一个最大的缺点就是
只能使用一次,当扣减为0的时候,那么就不能在继续使用了。所以就要引入 `CyclicBarrier`了。
