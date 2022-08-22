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
title: dubbo适配Spring原理
category: java
---


> 前面两篇博文,主要讲dubbo服务端和客户端的知识点,在对服务端和客户端有了一个新的认识之后,我们本篇 来看下spring是如何整合dubbo服务的

## 一、整合dubbo的两种方式

spring中使用dubbo一共有两种方式。这两种方式只是在解析dubbo类时候不同。一种通过xml方式，一种注解标签方式。
下面我们说下他们的原理。


1. xml方式
2. 注解方式


## 二、两种方式原理

### 1. NamespaceHandler(xml方式)

NamespaceHandler是spring提供的解析标签的类。dubbo首先继承该接口。在初始化时候
给每个标签绑定一个解析器。

```java
public class DubboNamespaceHandler extends NamespaceHandlerSupport {

	static {
		Version.checkDuplicate(DubboNamespaceHandler.class);
	}

	public void init() {
	    registerBeanDefinitionParser("application", new DubboBeanDefinitionParser(ApplicationConfig.class, true));
        registerBeanDefinitionParser("module", new DubboBeanDefinitionParser(ModuleConfig.class, true));
        registerBeanDefinitionParser("registry", new DubboBeanDefinitionParser(RegistryConfig.class, true));
        registerBeanDefinitionParser("monitor", new DubboBeanDefinitionParser(MonitorConfig.class, true));
        registerBeanDefinitionParser("provider", new DubboBeanDefinitionParser(ProviderConfig.class, true));
        registerBeanDefinitionParser("consumer", new DubboBeanDefinitionParser(ConsumerConfig.class, true));
        registerBeanDefinitionParser("protocol", new DubboBeanDefinitionParser(ProtocolConfig.class, true));
        registerBeanDefinitionParser("service", new DubboBeanDefinitionParser(ServiceBean.class, true));
        registerBeanDefinitionParser("reference", new DubboBeanDefinitionParser(ReferenceBean.class, false));
        registerBeanDefinitionParser("annotation", new DubboBeanDefinitionParser(AnnotationBean.class, true));
    }

}
```

![](https://img.springlearn.cn/blog/learn_1597065763000.png)

到这里spring就能解析各种的dubbo标签了。


### 2. 解析注解方式

- 服务端: BeanPostProcessor#postProcessAfterInitialization在服务端初始化后来根据Service注解生成服务并导出。
- 客户端: BeanPostProcessor#postProcessBeforeInitialization客户端在初始化前解析Reference,并注入到bean中

## 三、服务端ServiceBean

服务端使用@Service或者是xml解析参数生成ServiceBean,用Spring进行管理处理容器完成事件和bean初始化事件来来导出服务。


ServiceBean是一个被Spring管理的bean。
- 实现了InitializingBean#afterPropertiesSet初始化方法
- 实现了DisposableBean#destory销毁方法
- 实现了ApplicationListener的事件方法onApplicationEvent
- 实现了ApplicationContextAware注入上下文
- 实现了BeanNameAware注入beanName

其中当Spring容器启动了,会发出`ContextRefreshedEvent`事件


![](https://img.springlearn.cn/blog/learn_1597066316000.png)


## 四、客户端ReferenceBean

客户端使用Reference生成ReferenceBean,ReferenceBean是一个FactoryBean。


ReferenceBean#getObject来生成代理类。

```java
   public Object getObject() throws Exception {
        return get();
   }
   public synchronized T get() {
        if (destroyed){
            throw new IllegalStateException("Already destroyed!");
        }
    	if (ref == null) {
    		init();
    	}
    	return ref;
    }

```


## 五、总结

导出服务和创建远程服务的本地代理。原理是就是netty实现的。这是dubbo的逻辑。本篇就不说了。本篇的重点是
spring是如何整合dubbo的。你学习到了吗?
