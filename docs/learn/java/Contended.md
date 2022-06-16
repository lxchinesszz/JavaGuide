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
comment: true
footer: true
backtotop: true
title: 性能优化之@Contended减少伪共享
category: Java进阶
---

## 一、什么叫伪共享

说到伪共享,就要说CPU缓存,我们程序执行时候信息会被保存到CPU缓存中
而这些缓存中的数据可能被多线程访问,假如一个线程还没处理完，另外一个线程
就对数据进行了修改,就会导致上一个线程发生幻读的情况,比如刚才看到a=1,然后准备a = a+1。
但是还没做,另外一个线程就先将a变成2了。导致了上一个线程计算后本来应该是a = 1 + 1,变成了a = 2 + 1
计算结果就不对了。

那么对于这种情况当然是不允许发生的，解决方案就是当发现另外一个线程更新了共享变量，就会把cpu缓存中的数据给失效。
然后都重新读取最新的变量值。

==这里有一个前提是共享变量，因为两个线程都会用到a,所以a是共享变量。==

那么我们在聊伪共享就简单了，下面举一个伪共享变量的例子。

```java 
public class ContendedTest {

    volatile long a;
    
    volatile long b;
    
    @Test
    public void test() throws Exception {
        ContendedTest c = new ContendedTest();
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 10000_0000L; i++) {
                c.a = i;
            }
        });
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 10000_0000L; i++) {
                c.b = i;
            }
        });
        final long start = System.nanoTime();
        thread1.start();
        thread2.start();
        thread1.join();
        thread2.join();
        // 1933
        System.out.println((System.nanoTime() - start) / 100_0000);
    }
     
}    
```


两个线程分别来更新a和b属性,根据缓存失效的原理,因为a和b都在同一个对象中,当一个属性被更新,就会触发cpu缓存失效。
那么等于这种情况cpu缓存就没什么用了。我们思考下两个线程分别更新a和b，而a和b没有任何关系。那么a和b是共享变量吗?
当然不是,这就叫伪共享。


## 二、主动告诉程序伪共享

我们可以使用 `@Contended` 来声明伪共享变量,从而是cpu不更新缓存。 
本地测试时候记得加上jvm参数 ==-XX:-RestrictContended==，否则无效哦。

```java 
public class ContendedTest {

    @Contended
    volatile int a;

    @Contended
    volatile int b;

    @Test
    public void test() throws Exception {
        ContendedTest c = new ContendedTest();
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 10000_0000L; i++) {
                c.a = i;
            }
        });
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 10000_0000L; i++) {
                c.b = i;
            }
        });
        final long start = System.nanoTime();
        thread1.start();
        thread2.start();
        thread1.join();
        thread2.join();
        System.out.println((System.nanoTime() - start) / 100_0000);
    }
}
```

那么你猜下性能能提高多少呢? 前者`1933`后者`758ms`,差不多2.5倍的样子。


那么留下一个问题? 有多少场景都在使用`@Contended`呢? 知道的请留言评论。
