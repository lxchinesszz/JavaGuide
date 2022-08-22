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
title: Elastic-Job源码解析(一)之与Spring完美整合
category: java
---

> 看过小编写SpringFramework源码解析的同学应该对Spring支持自定义标签还有点印象吧，没有的话我们回顾下，然后看看Elastic-Job是如何巧妙的利用自定义标签生成Job任务的吧。请注意这里用了一个巧妙关键字。我们看它如何巧妙的吧。


## Elastic Job 自定义标签原理

在Spring中实现自定义标签只用继承NamespaceHandlerSupport类，然后定义自己的BeanDefinitionParse来生成BeanDefinition就可以了。就会被Spring的IOC容器加载到了。

```java 
/**
 * 分布式作业的命名空间处理器
 */
public final class JobNamespaceHandler extends NamespaceHandlerSupport {
    public JobNamespaceHandler() {
    }

    public void init() {
        this.registerBeanDefinitionParser("simple", new SimpleJobBeanDefinitionParser());
        this.registerBeanDefinitionParser("dataflow", new DataflowJobBeanDefinitionParser());
        this.registerBeanDefinitionParser("script", new ScriptJobBeanDefinitionParser());
    }
}
```

|类型|解析器  |描述|
|--|--|--|
|simple  |SimpleJobBeanDefinitionParser  | 一般任务|
| dataflow | DataflowJobBeanDefinitionParser |数据流任务 |
|script  |ScriptJobBeanDefinitionParser  | 脚本任务|

注册中心解析器

```java 
public final class RegNamespaceHandler extends NamespaceHandlerSupport {
    public RegNamespaceHandler() {
    }

    public void init() {
        this.registerBeanDefinitionParser("zookeeper", new ZookeeperBeanDefinitionParser());
    }
}
```

- 在jar中添加 `/META-INF/spring.handler` 指定文件的解析器
- 在jar中添加 `/META-INF/spring.schemas` 指定文件的xml约束信息

![](https://img.springlearn.cn/blog/ded053e68c5fbedda0c82581c80fba2c.png)

## Elastic-Job如何巧妙?

注意: 定时任务 = 定时器 + 任务
Elastic Job只给我们提供了任务标签，所以我们平时用Elastic-Job写的只是一个任务，而不是一个Bean。另外关于标签的属性，即: 定时的信息,是以属性配置的形式放在xml中的,我们可以看xsd文件约束中找到，都有哪些属性可以用，下图

![](https://img.springlearn.cn/blog/297f09f2a289942949fb4bfe30722dc0.png)

![](https://img.springlearn.cn/blog/c426616c1337a7ba39da1d2171cb07fd.png)

Elastic-Job会解析我们的xml任务信息,并通过定时的相关参数，生成SpringJobScheduler对象,在哪里进行着一操作呢？
感觉很怪异，找了很久才找到，竟然在每个任务的解析器中。为什么这么说呢? 因为实现都在抽象类中生成。

![](https://img.springlearn.cn/blog/d046d029692e7b204f56dc023609ca39.png)

所有的任务解析器都实现了一个抽象方法AbstractJobBeanDefinitionParser。而在这里面对我们写的job标签进行了解析生成job对象，作为属性注入到SpringJobScheduler中，在init方法中，开始执行定时 任务(quartz)。

![](https://img.springlearn.cn/blog/7c71ed058225816bcd38f1de71836f5f.png)

其实BeanDefinitionParse的主要职责是解析Bean对象的，而Elastic-Job巧妙的用来生成SpringJobScheduler。
由此联想到Es Job的标签都是 job:{taskType}开头的，看来命名真的很有技巧，`注意他不是一个bean而是SpringJobSchedulerBean的一个参数声明 !` 还能这么用! get 到一个新技能。

**另外注意**

- ①: init初始化方法中完成定时任务的初始化操作，即开始定时，底层还是使用的quartz的一个封装
- ②: shutdown回收资源,关闭线程池
