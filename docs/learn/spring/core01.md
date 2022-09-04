---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: true
contributor: false
editLink: true
updateTime: true
prev: true
next: true
comment: true
footer: true
backtotop: true
title: 第01篇:搞定Spring容器管理
---

![](https://img-blog.csdnimg.cn/img_convert/aa1d259419ff268edc2fe3088f940556.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！


## 一、前言

## 二、BeanFactory 工厂

## 三、ApplicationContext 容器上下文

### 3.1 构造扫描

```java 
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}

public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```

### 3.2 目录扫描

扫描 `com.acme` 包以查找任何 带@Component注释的类，并且这些类在容器中注册为 Spring bean 定义。

```java 
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.scan("com.acme");
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
}
```

### 3.3 容器事件 
https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-functionality-events


| 事件                         | 解释                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| `ContextRefreshedEvent`      | 在初始化或刷新时发布`ApplicationContext`（例如，通过使用接口`refresh()`上的方法`ConfigurableApplicationContext`）。这里，“初始化”意味着所有 bean 都已加载，后处理器 bean 被检测并激活，单例被预实例化，并且`ApplicationContext`对象已准备好使用。只要上下文没有关闭，就可以多次触发刷新，前提是所选择的`ApplicationContext`实际支持这种“热”刷新。例如，`XmlWebApplicationContext`支持热刷新，但 `GenericApplicationContext`不支持。 |
| `ContextStartedEvent`        | 使用接口上的方法 `ApplicationContext`启动时发布。在这里，“已启动”意味着所有 bean 都接收到一个明确的启动信号。通常，此信号用于在显式停止后重新启动 bean，但它也可用于启动尚未配置为自动启动的组件（例如，尚未在初始化时启动的组件）。`start()``ConfigurableApplicationContext``Lifecycle` |
| `ContextStoppedEvent`        | 使用接口上的方法 `ApplicationContext`停止时发布。在这里，“停止”意味着所有 的 bean 都会收到一个明确的停止信号。可以通过 调用重新启动已停止的上下文。`stop()``ConfigurableApplicationContext``Lifecycle``start()` |
| `ContextClosedEvent`         | 在`ApplicationContext`使用接口`close()`上的方法`ConfigurableApplicationContext`或通过 JVM 关闭挂钩关闭时发布。在这里，“关闭”意味着所有的单例 bean 都将被销毁。一旦上下文关闭，它就到了生命的尽头，无法刷新或重新启动。 |
| `RequestHandledEvent`        | 一个特定于 Web 的事件，告诉所有 bean 一个 HTTP 请求已得到服务。此事件在请求完成后发布。此事件仅适用于使用 Spring 的 Web 应用程序`DispatcherServlet`。 |
| `ServletRequestHandledEvent` | 它的子类`RequestHandledEvent`添加了 Servlet 特定的上下文信息。 |

## 四、JavaConfig 配置

## 五、基于注解容器配置

### 5.1 @Required

### 5.2 @Autowired

### 5.3 @Primary

### 5.4 @Qualifier

### 5.5 CustomAutowireConfigurer

### 5.6 @Resource

### 5.7 @Value

### 5.8 声明周期

- @PostConstruct
- @PreDestroy

### 5.9 @Scope

### 5.10 @Import
https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java-using-import

### 5.11 @Profile

https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition-profiles-java

环境抽象
https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-environment

## 六、Aware 

### BeanFactoryAware

### BeanNameAware

### MessageSourceAware

### ApplicationContextAware

## 六、生成候选组件的索引

虽然类路径扫描非常快，但可以通过在编译时创建静态候选列表来提高大型应用程序的启动性能。在这种模式下，作为组件扫描目标的所有模块都必须使用这种机制。

当 ApplicationContext检测到这样的索引时，它会自动使用它而不是扫描类路径,这样能提高速度。

```xml 
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-indexer</artifactId>
        <version>5.3.22</version>
        <optional>true</optional>
    </dependency>
</dependencies>
```





## 问题

### 在配置 Spring 时，注解是否比 XML 更好？

基于注释的配置的引入提出了这种方法是否比 XML“更好”的问题。简短的回答是“视情况而定”。长答案是每种方法都有其优点和缺点，
通常由开发人员决定哪种策略更适合他们。由于它们的定义方式，注释在其声明中提供了大量上下文，从而使配置更短、更简洁。然而，
XML 擅长在不触及源代码或重新编译它们的情况下连接组件。
