---
breadcrumb: false
navbar: true
sidebar: false
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: Zookeeper实践
article: true
---


## 一、Zookeeper介绍

## 1.1 配置管理

在我们的应用中除了代码外，还有一些就是各种配置。比如数据库连接等。一般我们都是使用配置文件的方式，在代码中引入这些配置文件。但是当我们只有一种配置，只有一台服务器，并且不经常修改的时候，使用配置文件是一个很好的做法，但是如果我们配置非常多，有很多服务器都需要这个配置，而且还可能是动态的话使用配置文件就不是个好主意了。这个时候往往需要寻找一种集中管理配置的方法，我们在这个集中的地方修改了配置，所有对这个配置感兴趣的都可以获得变更。比如我们可以把配置放在数据库里，然后所有需要配置的服务都去这个数据库读取配置。

## 1.2 名字服务

名字服务这个就很好理解了。比如为了通过网络访问一个系统，我们得知道对方的IP地址，但是IP地址对人非常不友好，这个时候我们就需要使用域名来访问。但是计算机是不能是别域名的。怎么办呢？如果我们每台机器里都备有一份域名到IP地址的映射，这个倒是能解决一部分问题，但是如果域名对应的IP发生变化了又该怎么办呢？于是我们有了DNS这个东西。我们只需要访问一个大家熟知的(known)的点，它就会告诉你这个域名对应的IP是什么。在我们的应用中也会存在很多这类问题，特别是在我们的服务特别多的时候，如果我们在本地保存服务的地址的时候将非常不方便，但是如果我们只需要访问一个大家都熟知的访问点，这里提供统一的入口，那么维护起来将方便得多了。
分布式锁

## 1.3 集群管理

在分布式的集群中，经常会由于各种原因，比如硬件故障，软件故障，网络问题，有些节点会进进出出。有新的节点加入进来，也有老的节点退出集群。这个时候，集群中其他机器需要感知到这种变化，然后根据这种变化做出对应的决策。比如我们是一个分布式存储系统，有一个中央控制节点负责存储的分配，当有新的存储进来的时候我们要根据现在集群目前的状态来分配存储节点。这个时候我们就需要动态感知到集群目前的状态。还有，比如一个分布式的SOA架构中，服务是一个集群提供的，当消费者访问某个服务时，就需要采用某种机制发现现在有哪些节点可以提供该服务(这也称之为服务发现，比如Alibaba开源的SOA框架Dubbo就采用了Zookeeper作为服务发现的底层机制)。还有开源的Kafka队列就采用了Zookeeper作为Cosnumer的上下线管理。

## 二、本地安装运行

## 2.1 Mac环境部署

```
// 查询
brew search zookeeper
// 安装
brew install zookeeper
// 运行
brew services start zookeeper
// 运行成功了
==> Successfully started `zookeeper` (label: homebrew.mxcl.zookeeper)
```

## 2.2 Windows环境部署

1. [下载安装包](http://mirror.bit.edu.cn/apache/zookeeper/zookeeper-3.4.12/)
2. 运行 `启动zkServer.sh  | zkServer.cmd`


## 三、项目实践

## 3.1 引入依赖

```xml 
        <!-- 对zookeeper的底层api的一些封装 -->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-framework</artifactId>
            <version>2.12.0</version>
        </dependency>


        <!-- 提供一些客户端的操作，例如重试策略等 -->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-client</artifactId>
            <version>2.13.0</version>
        </dependency>


        <!-- 封装了一些高级特性，如：Cache事件监听、选举、分布式锁、分布式计数器、分布式Barrier等 -->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>2.12.0</version>
        </dependency>
```

## 3.2 Curator API

:::info
Curator是Netflix公司开源的一套zookeeper客户端框架，解决了很多Zookeeper客户端非常底层的细节开发工作，包括连接重连、反复注册Watcher和NodeExistsException异常等等。Patrixck Hunt（Zookeeper）以一句“Guava is to Java that Curator to Zookeeper”给Curator予高度评价。
:::

==Curator包含了几个包：==

- curator-framework：对zookeeper的底层api的一些封装
- curator-client：提供一些客户端的操作，例如重试策略等
- curator-recipes：封装了一些高级特性，如：Cache事件监听、选举、分布式锁、分布式计数器、分布式Barrier等

### 3.2.1 创建会话


1.使用静态工程方法创建客户端

```
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
CuratorFramework client =
CuratorFrameworkFactory.newClient(
                        connectionInfo,
                        5000,
                        3000,
                        retryPolicy);
```

**newClient静态工厂方法包含四个主要参数：**

参数名 | 说明
---|---
connectionString | 服务器列表，格式host1:port1,host2:port2,...
retryPolicy | 重试策略,内建有四种重试策略,也可以自行实现RetryPolicy接口
sessionTimeoutMs | 会话超时时间，单位毫秒，默认60000ms
connectionTimeoutMs | 连接创建超时时间，单位毫秒，默认60000ms

---

2.使用Fluent风格的Api创建会话
核心参数变为流式设置，一个列子如下

```
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
        CuratorFramework client =
        CuratorFrameworkFactory.builder()
                .connectString(connectionInfo)
                .sessionTimeoutMs(5000)
                .connectionTimeoutMs(5000)
                .retryPolicy(retryPolicy)
                .build();。
```
---

3.创建包含隔离命名空间的会话
为了实现不同的Zookeeper业务之间的隔离，需要为每个业务分配一个独立的命名空间（NameSpace），即指定一个Zookeeper的根路径（官方术语：为Zookeeper添加“Chroot”特性）。例如（下面的例子）当客户端指定了独立命名空间为“/base”，那么该客户端对Zookeeper上的数据节点的操作都是基于该目录进行的。通过设置Chroot可以将客户端应用与Zookeeper服务端的一课子树相对应，在多个应用共用一个Zookeeper集群的场景下，这对于实现不同应用之间的相互隔离十分有意义。

```
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
        CuratorFramework client =
        CuratorFrameworkFactory.builder()
                .connectString(connectionInfo)
                .sessionTimeoutMs(5000)
                .connectionTimeoutMs(5000)
                .retryPolicy(retryPolicy)
                .namespace("base")
                .build();

```

4. 启动客户端
当创建会话成功，得到client的实例然后可以直接调用其start( )方法：

`client.start();`


### 3.2.2 添加监听器

```java 
/**
   * 只能监听某一个节点的变化
   *
   * @throws Exception
   */
  @Test
  public void nodeCacheListenerTest() throws Exception {
    ExponentialBackoffRetry exponentialBackoffRetry = new ExponentialBackoffRetry(1000, 3);
    CuratorFramework client = CuratorFrameworkFactory.newClient(connect_info,
      exponentialBackoffRetry);
    client.start();
    client.usingNamespace("dubboz");

    final NodeCache cache = new NodeCache(client, ROOT_PATH);

    NodeCacheListener listener = new NodeCacheListener() {
      public void nodeChanged() throws Exception {
        ChildData data = cache.getCurrentData();
        if (null != data) {
          System.out.println("节点数据：" + new String(cache.getCurrentData().getData()));
        } else {
          System.out.println("节点被删除!");
        }
      }
    };
    cache.getListenable().addListener(listener);
    cache.start();

    client.create().creatingParentsIfNeeded().forPath(ROOT_PATH);
    client.setData().forPath(ROOT_PATH, "01".getBytes());
    Thread.sleep(100);
    client.setData().forPath(ROOT_PATH, "02".getBytes());
    Thread.sleep(100);
    client.delete().deletingChildrenIfNeeded().forPath(ROOT_PATH);
    Thread.sleep(1000 * 2);
    cache.close();
    client.close();
    System.out.println("OK!");
  }
```
