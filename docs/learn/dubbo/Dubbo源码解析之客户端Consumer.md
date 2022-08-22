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
title: dubbo 客户端调用流程
category: java
---


> 前面我们学习了服务端如何启动暴露一个外部服务,本文主要学习客户端如何通过代理方式访问客户端请求


## 一、启动一个客户端Consumer


### 1. 定义一个接口

注意这里其实是引用的前文中的接口。生产中是服务提供方打一个jar包给客户端用。

```java
public interface UserService {
    void say(String message);
}
```

### 2. 生成本地服务

```java
    @Test
    public void consumerTest() {
        // 当前应用配置
        ApplicationConfig application = new ApplicationConfig();
        application.setName("consumerTest");

        // 连接注册中心配置
        RegistryConfig registry = new RegistryConfig();
        registry.setAddress("zookeeper://127.0.0.1:2181");

        // 注意：ReferenceConfig为重对象，内部封装了与注册中心的连接，以及与服务提供方的连接
        // 引用远程服务
        ReferenceConfig<UserService> reference = new ReferenceConfig<UserService>(); // 此实例很重，封装了与注册中心的连接以及与提供者的连接，请自行缓存，否则可能造成内存和连接泄漏
        reference.setApplication(application);
        reference.setRegistry(registry); // 多个注册中心可以用setRegistries()
        reference.setInterface(UserService.class);
        reference.setVersion("1.0.0");
        UserService userService = reference.get();
        userService.say("hello");
    }
```

### 3. 原理分析

首先客户端只有接口的,那么可以根据这个接口生成一个代理。而代理对象中逻辑就是,从zk中找到服务端地址。
然后通过netty客户端去请求服务端的数据。然后返回

## 二、源码分析

带着我们猜测的逻辑一起来看下`ReferenceConfig`的实现原理。

```java
  public synchronized T get() {
        if (destroyed){
            throw new IllegalStateException("Already destroyed!");
        }
    	if (ref == null) {
    	    //逻辑就在init里面
    		init();
    	}
    	return ref;
    }
```

init先做写检查信息,如这个方法是否存在接口中
createProxy#loadRegistries

![](https://img.springlearn.cn/blog/learn_1597062241000.png)

### 1. 集群容错策略

![](https://img.springlearn.cn/blog/learn_1597062347000.png)

可以看到一共有9中策略。

![](https://img.springlearn.cn/blog/learn_1597063062000.png)

当时服务端是多个的时候,才会生成集群策略。另外既然是集群就要选择到底使用哪个来执行。这就是
负载均衡或者说叫路由策略。

#### LoadBalance负载均衡

![](https://img.springlearn.cn/blog/learn_1597064955000.png)

- directory中获取所有的invoker
- 如果有多个invoker就去看配置的负载均衡策略
- 根据负载均衡策略找到一个Inoker

```java
public abstract class AbstractClusterInvoker<T> implements Invoker<T> {
    public Result invoke(final Invocation invocation) throws RpcException {

        checkWheatherDestoried();

        LoadBalance loadbalance;
        //获取所有的invoker
        List<Invoker<T>> invokers = list(invocation);
        //如果有多个invoker就去看配置的负载均衡策略
        if (invokers != null && invokers.size() > 0) {
            loadbalance = ExtensionLoader.getExtensionLoader(LoadBalance.class).getExtension(invokers.get(0).getUrl()
                    .getMethodParameter(invocation.getMethodName(),Constants.LOADBALANCE_KEY, Constants.DEFAULT_LOADBALANCE));
        } else {
            loadbalance = ExtensionLoader.getExtensionLoader(LoadBalance.class).getExtension(Constants.DEFAULT_LOADBALANCE);
        }
        RpcUtils.attachInvocationIdIfAsync(getUrl(), invocation);
        //根据策略选一个
        return doInvoke(invocation, invokers, loadbalance);
    }
     
     protected  List<Invoker<T>> list(Invocation invocation) throws RpcException {
    	List<Invoker<T>> invokers = directory.list(invocation);
    	return invokers;
     }
}
```

![](https://img.springlearn.cn/blog/learn_1597064611000.png)

### 2. invoker生成代理对象

![](https://img.springlearn.cn/blog/learn_1597063197000.png)
代理的知识点不用说了。


### 3. 客户端的invoker逻辑

#### Protocol#refer
主要看DubboProtocol的逻辑

```java
  public <T> Invoker<T> refer(Class<T> serviceType, URL url) throws RpcException {
        // create rpc invoker.
        DubboInvoker<T> invoker = new DubboInvoker<T>(serviceType, url, getClients(url), invokers);
        invokers.add(invoker);
        return invoker;
  }
```

####  DubboInvoker

底层调用netty通信api发送数据到客户端。然后读取数据。


```java

客户端doInvoke时候会生成ExchangeClient就是NettyClient。
public class DubboInvoker<T> extends AbstractInvoker<T> {

    @Override
    protected Result doInvoke(final Invocation invocation) throws Throwable {
        RpcInvocation inv = (RpcInvocation) invocation;
        final String methodName = RpcUtils.getMethodName(invocation);
        inv.setAttachment(Constants.PATH_KEY, getUrl().getPath());
        inv.setAttachment(Constants.VERSION_KEY, version);
        
        ExchangeClient currentClient;
        if (clients.length == 1) {
            currentClient = clients[0];
        } else {
            currentClient = clients[index.getAndIncrement() % clients.length];
        }
        try {
            boolean isAsync = RpcUtils.isAsync(getUrl(), invocation);
            boolean isOneway = RpcUtils.isOneway(getUrl(), invocation);
            int timeout = getUrl().getMethodParameter(methodName, Constants.TIMEOUT_KEY,Constants.DEFAULT_TIMEOUT);
            if (isOneway) {
            	boolean isSent = getUrl().getMethodParameter(methodName, Constants.SENT_KEY, false);
                currentClient.send(inv, isSent);
                RpcContext.getContext().setFuture(null);
                return new RpcResult();
            } else if (isAsync) {
            	ResponseFuture future = currentClient.request(inv, timeout) ;
                RpcContext.getContext().setFuture(new FutureAdapter<Object>(future));
                return new RpcResult();
            } else {
            	RpcContext.getContext().setFuture(null);
                return (Result) currentClient.request(inv, timeout).get();
            }
        } catch (TimeoutException e) {
            throw new RpcException(RpcException.TIMEOUT_EXCEPTION, "Invoke remote method timeout. method: " + invocation.getMethodName() + ", provider: " + getUrl() + ", cause: " + e.getMessage(), e);
        } catch (RemotingException e) {
            throw new RpcException(RpcException.NETWORK_EXCEPTION, "Failed to invoke remote method: " + invocation.getMethodName() + ", provider: " + getUrl() + ", cause: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean isAvailable() {
        if (!super.isAvailable())
            return false;
        for (ExchangeClient client : clients){
            if (client.isConnected() && !client.hasAttribute(Constants.CHANNEL_ATTRIBUTE_READONLY_KEY)){
                //cannot write == not Available ?
                return true ;
            }
        }
        return false;
    }

  
}
```


## 三、总结

在前文的基础上,客户端的代码算是比较简单的。主要是集群容错和负载均衡、路由。

主要是利用代理来实现的。


最后求关注,求订阅,谢谢你的阅读!

下一篇会讲,dubbo如何与Spring进行整合。


![](https://img.springlearn.cn/blog/learn_1589360371000.png)
