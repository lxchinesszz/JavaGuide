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
title: 没有条件创造条件Condition
category: Java进阶
---


![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::


https://blog.csdn.net/a1439775520/article/details/98471610


Condition 是为了调换 Object 中的 wait()
和notify().

|API|Object|Condition|
|:---:|:---:|:---:|
|等待|wait()|wait()|
|通知|notify()|signal()|
|通知所有|notifyAll()|signalAll()|

**wait是会释放锁**

## 相同点

- 都必须被包裹在同步代码块中，即加锁
- 当调用wait都会释放锁

## 不同点

- Object 依赖 synchronized 锁
- Condition 依赖 Lock 锁

## ObjectWait

::: tip 运行结果
- 当前线程进入线程一
- 当前线程进入线程二
- 当前线程释放main
- 当前线程释放main
- 当前线程退出线程一
- 当前线程退出线程二
:::
  
```java ObjectWait
/**
 * @author liuxin
 * 2022/1/5 12:24 上午
 */
public class ObjectWait {

    public synchronized void objWait() throws Exception {
        System.out.println("当前线程进入" + Thread.currentThread().getName());
        wait();
        System.out.println("当前线程退出" + Thread.currentThread().getName());
    }

    public synchronized void objNotify() throws Exception {
        System.out.println("当前线程释放" + Thread.currentThread().getName());
        notify();
    }

    public static void main(String[] args) throws Exception {
        ObjectWait objectWait = new ObjectWait();
        // 使用synchronized修饰方法，就是锁的是当前这个示例synchronized(this)
        new Thread(() -> {
            try {
                // 当前进入等待，然后释放锁。wait会释放锁
                objectWait.objWait();
            } catch (Exception e) {
                e.printStackTrace();
            }
        },"线程一").start();

        // 使用synchronized修饰方法，就是锁的是当前这个示例synchronized(this)
        new Thread(() -> {
            try {
                // 当前进入等待，然后释放锁。wait会释放锁
                objectWait.objWait();
            } catch (Exception e) {
                e.printStackTrace();
            }
        },"线程二").start();
        Thread.sleep(1000L);
        // 释放锁后才会放行
        objectWait.objNotify();
        // 释放锁后才会放行
        objectWait.objNotify();
    }
}

```

## LockWait

::: tip 运行结果
- 当前线程进入线程一
- 当前线程进入线程二
- 当前线程释放main
- 当前线程释放main
- 当前线程退出线程一
- 当前线程退出线程二
:::

```java  LockWait
/**
 * @author liuxin
 * 2022/1/5 24:24 上午
 */
public class LockWait {

    private ReentrantLock lock = new ReentrantLock();

    private Condition condition = lock.newCondition();

    public void lockWait() throws Exception {
        lock.lock();
        System.out.println("当前线程进入" + Thread.currentThread().getName());
        condition.await();
        System.out.println("当前线程退出" + Thread.currentThread().getName());
        lock.unlock();
    }

    public void lockNotify() {
        lock.lock();
        System.out.println("当前线程释放" + Thread.currentThread().getName());
        condition.signal();
        lock.unlock();
    }

    public static void main(String[] args) throws Exception {
        LockWait lockWait = new LockWait();
        // lock.lock()  线程一: 获取锁,然后wait之后，进入释放锁,然后进入到等待队列
        new Thread(() -> {
            try {
                // 当前进入等待，然后释放锁。
                lockWait.lockWait();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "线程一").start();
        // lock.lock()  当前线程二获取锁,然后wait之后，进入释放锁,然后进入到等待队列
        new Thread(() -> {
            try {
                // 当前进入等待，然后释放锁。
                lockWait.lockWait();
            } catch (Exception e) {
                e.printStackTrace();
            }
        },"线程二").start();

        Thread.sleep(1000L);
        // 调用第一次，会唤醒线程一，继续向下执行
        lockWait.lockNotify();
        // 调用第二次，会唤醒线程二，继续向下执行
        lockWait.lockNotify();
    }
}

```
