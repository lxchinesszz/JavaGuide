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
title: ②如何知道是否依赖Spring容器
---


默认使用 `BlockJUnit4ClassRunner` 来进行运行。即不依赖容器。
假如说如果需要容器怎么办呢 ? <Version>基于SpringBoot 2.1.x版本分析</Version>

```java
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class}) // 指定启动类
public class BaseApplicationTest {
}
```

- SpringRunner告诉JUnit要使用Spring容器
- SpringBootTest告诉JUnit容器的引导类是这个


JUnit是如何实现的呢?

![](https://img.springlearn.cn/blog/learn_1617791013000.png)

前面启动类中我们使用的注解是 `@RunWith` 和 `@SpringBootTest` 那么哪里来解析这个的呢?


![](https://img.springlearn.cn/blog/learn_1617791209000.png)


由此 `JUnit` 知道要使用 `SpringRunner` 进行引导。

由上图我们知道 `SpringRunner` 实例化的入参就是当前的测试类。那么后续所有的奥妙就在这里了。
我们跟进构造往下追究。

![](https://img.springlearn.cn/blog/learn_1617795279000.png)

`BootstrapUtils#resolveTestContextBootstrapper`
拿到SpringBoot的测试引导类 `SpringBootTestContextBootstrapper`

![](https://img.springlearn.cn/blog/learn_1617795346000.png)

拿到SpringBoot容器的启动 `Main` 函数。

到此已经拿到了所有的SpringBoot容器启动参数了。



