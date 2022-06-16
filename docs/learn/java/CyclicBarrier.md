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
title: 循环锁屏障 CyclicBarrier
category: Java进阶
---


![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

举个例子,五个人开黑,少一个人就开不了。



```java 
public static void main(String[] args) throws Throwable {
        CyclicBarrier cb = new CyclicBarrier(5, new Runnable() {
            @Override
            public void run() {
                System.out.println("人都到齐了,游戏开始进入峡谷");
            }
        });
        Runnable player = new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + "已经进来了");
                try {
                    cb.await();
                } catch (Throwable e) {
                    e.printStackTrace();
                }
            }
        };
        new Thread(player, "上路程咬金").start();
        new Thread(player, "中路安琪拉").start();
        new Thread(player, "下路小鲁班").start();
        new Thread(player, "辅助李元芳").start();
        new Thread(player, "打野孙悟空").start();
    }
```
