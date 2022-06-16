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
title: JVM内存模型
---

![](https://img.springlearn.cn/blog/learn_1654432506000.png)

我们在学习JVM的内存管理的时候,我们的思维要跳出Java的局限。我们要这么理解。我们写的Java代码，是运行在JVM上的。
如果让你来实现JVM那么。你会怎么处理呢?


1. 什么是公共部分,什么是私有部分?

- 公共部分(堆heap)
    - Class字节码是公共的,是共享的,所有线程都要认识字节码。
    - new的对象是公共的,也是共享的,所有线程要都能认识这些实例对象,能读取到实例的数据。
- 私有部分 (栈stock)
    - Java中每个线程的执行中的代码，及代码中的局部变量等信息是私有的。每个线程之间都要维护一份。
    - JVM虚拟栈和本地方法栈。
    - 代码是怎么执行的,当然是一行一行执行。那么这一行一行的代码是放在哪里的呢? 是放在栈里面的。Java代码是在JVM来执行的。
      所以这个栈，我们称为JVM虚拟栈。
    - JVM中有些方法是调用其他语言实现的, 会使用本地方法栈。
    - 那么谁来读取栈里面的数据,来出栈执行呢? 这叫做PC寄存区。


2. 这些区域的内存是如何划分的呢?



3. 传说中的GC的内存回收策略?    



https://arthas.gitee.io/jad.html jad命令

打开arthas 找到类 `[arthas@87476]$ sc  sun.reflect.GeneratedMethodAccessor*` 扫描动态生成的类。

反编译看下反射类中的代码


元空间使用 https://xiaogenban1993.github.io/20.04/%E7%BB%BC%E8%BF%B0_%E5%86%85%E5%AD%98.html
