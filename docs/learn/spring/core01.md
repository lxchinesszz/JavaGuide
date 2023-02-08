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
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

@[TOC]

## 一、前言

![](https://img.springlearn.cn/blog/1c861b137fedd470229042b05bc85d97.png)

`Spring` 是 `java` 开发者,永远绕不开的结。`Spring` 是非常值得开发者来学习的, 以目前 `Spring` 在 `java` 领域的统治性地位, 可以说学 `java` 就是在学 `Spring`。但是作为新入门的开发人员,甚至说是有一定工作经验的同学,面对如此庞大的框架,都不一定是充分掌握了所有的知识点。因为大多数人的学习,都不是系统的学习,都是片面的。以经验为主。本系列专题的主要目的就是,一起系统的来学习一下Spring这个框架, 以一个六年经验的老鸟的视角里,来重学Spring。通过直接阅读 Spring的官方文档来获取一手知识。

因为内容较多,建议收藏学习。

## 二、BeanFactory 工厂

![](https://img.springlearn.cn/blog/0d795a24e1b06ffc172762ae82e18241.png)

## 2.1 什么是Bean ?

平时我们来创建对象, 一般都是 new。如果这个对象里有一个属性, 那么就需要我来进行set,赋值。但是如果要有10个属性呢? 你也要自己来赋值吗? 那不累死个人嘛。Spring的解决方案就是, 这么重的活, 开发者不用关心了，都交给我来处理吧。那么Spring是如何来处理的呢? 对,就是`BeanFactory`,Spring通过 BeanFactory的方式帮实现对象的实例化。那么所有被Spring管理的对象,我们就可以理解成Bean对象。

凡是有属性和方法的对象都是Bean对象,凡是被Spring管理的Bean对象就是Spring Bean对象。


## 2.2 如何使用Bean工厂

- 方式一直接使用代码自动注入

```java
@Component
public class SpringIocTest{

    @Autowired
    private BeanFactory beanFactory;
}    
```

- 方式二使用BeanFactoryAware注入

```java
@Component
public class SpringIocTest implements BeanFactoryAware {

    private BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }
}    
```

## 2.3 BeanFactory的体系

在 `Spring` 中 `BeanFactory` 是一个非常重要的组件, 要想搞清楚 `Spring`, 一定要先搞清楚 `BeanFactory`
的体系,这里我们详细来解释下 BeanFactory的体系。

![](https://img.springlearn.cn/blog/13a8f0f36ab6b4da0b1e678c5365ef4e.png)

看这张图,密密麻麻的都是,但是我们不要担心,实际我们不用关心这么多。大部分人都是因为看到了这里,给劝退了, 下面给大家精简一下。希望对你有所帮助。

![](https://img.springlearn.cn/blog/2e34a842a68200398d70b8d6c0283c17.png)

我们只关心上面这张图就好了，但是看类还是比较多，为什么呢? 因为Spring定义BeanFactory接口比较细，每个接口的维度都很细维度。但是我们能看到最底层的实现,是实现了所有接口的功能。下面我们以此来解释每个接口的功能。来窥探一下Spring中BeanFactory的体系。非常的全，建议大家可以收藏一下，没必要死记硬背。如果不理解的话，背下来也没有什么的用。

下面分享，希望对大家有点用。

### 2.3.1 BeanFactory

最顶层的接口，提供了根据Bean名称获取Bean的最基础的能力。详细可以看下面的注释说明。接口没有任何实现,只是做定义。

```java
public interface BeanFactory {

	// 如果要获取FactoryBean,那么要的Bean的名称前加 &
	String FACTORY_BEAN_PREFIX = "&";

	// 根据名称获取实例,如果没有就抛异常,结果是Object类型
	Object getBean(String name) throws BeansException;

	// 跟前者一样,不同是结果是泛型类型,会自动帮我们转换类型
	<T> T getBean(String name, Class<T> requiredType) throws BeansException;

	// 允许指定显式构造函数参数,很少会用
	Object getBean(String name, Object... args) throws BeansException;

	// 根据类型获取Bean实例,如果找到了多个类型,则会报错
	<T> T getBean(Class<T> requiredType) throws BeansException;

	// 根据类型获取实例,并显式构造函数参数
	<T> T getBean(Class<T> requiredType, Object... args) throws BeansException;

	// 根据类型获取Bean的生成对象,这里并不是直接获取了Bean的实例
	<T> ObjectProvider<T> getBeanProvider(Class<T> requiredType);

	// 跟前者大同小异
	<T> ObjectProvider<T> getBeanProvider(ResolvableType requiredType);

	// 判断是否保存这个名字的实例
	boolean containsBean(String name);

	// 判断是否单例
	boolean isSingleton(String name) throws NoSuchBeanDefinitionException;

	// 判断是否是原型模式
	boolean isPrototype(String name) throws NoSuchBeanDefinitionException;

	// bean名称和类型是否匹配
	boolean isTypeMatch(String name, ResolvableType typeToMatch) throws NoSuchBeanDefinitionException;

	// bean名称和类型是否匹配
	boolean isTypeMatch(String name, Class<?> typeToMatch) throws NoSuchBeanDefinitionException;

	// 获取名称的类型
	@Nullable
	Class<?> getType(String name) throws NoSuchBeanDefinitionException;

	// 根据名称获取类型,FactoryBean比较特殊,allowFactoryBeanIn   // it是说,是否也要算FactoryBean,一般情况用true
	@Nullable
	Class<?> getType(String name, boolean allowFactoryBeanInit) throws NoSuchBeanDefinitionException;

	// bean声明的别名，如果没有则为空数组
	String[] getAliases(String name);

}

```

### 2.3.2 HierarchicalBeanFactory

**Hierarchical翻译:** 分层

HierarchicalBeanFactory的意思是具有层次关系,这个BeanFactory可以创建一个BeanFactory,那么是否可以根据这个BeanFactory知道是谁创建他的呢? 这个接口就是干这个事情的。

```java
public interface HierarchicalBeanFactory extends BeanFactory {

	// 返回当前工厂的父工厂
	@Nullable
	BeanFactory getParentBeanFactory();

	// 返回当工厂是否包含这个bean,不从父工厂中去获取
	boolean containsLocalBean(String name);

}
```

### 2.3.3 ListableBeanFactory

- 一个接口可能会有多个实现,每个实现都是一个Bean。所以根据一个类型可能会获取多个Bean的实例。
- 一个工厂会有很多的Bean,能不能一下获取工厂所有的Bean呢?

这个工厂名字定义的很有意思，Listable, List 所以大多接口是返回集合。你不信,你看下面展示。



```java
public interface ListableBeanFactory extends BeanFactory {

	// 是否包含BeanDefinition,BeanDefinition是bean实例化的基   // 本信息。
	boolean containsBeanDefinition(String beanName);

	// 获取BeanDefinition的数量
	int getBeanDefinitionCount();

	// 获取BeanDefinition的名称
	String[] getBeanDefinitionNames();

	// 根据类型,获取这个类型的所有Bean的名称
	String[] getBeanNamesForType(ResolvableType type);

	// 根据类型获取bean的名称,包含非单例的,允许初始化
	String[] getBeanNamesForType(ResolvableType type, boolean includeNonSingletons, boolean allowEagerInit);

	// 根据类型,获取这个类型的所有Bean的名称
	String[] getBeanNamesForType(@Nullable Class<?> type);

	// 根据类型获取bean的名称,包含非单例的,允许初始化
	String[] getBeanNamesForType(@Nullable Class<?> type, boolean includeNonSingletons, boolean allowEagerInit);

	// 根据类型获取Bean的字典,key是名称 value是实例
	<T> Map<String, T> getBeansOfType(@Nullable Class<T> type) throws BeansException;

	// 根据类型获取Bean的字典(包含非单例),key是名称 value是实例
	<T> Map<String, T> getBeansOfType(@Nullable Class<T> type, boolean includeNonSingletons, boolean allowEagerInit)
			throws BeansException;

	// 获取被当前注解修饰的Bean的名称,只获取名称不实例化,支持注解派   // 生的方式
	String[] getBeanNamesForAnnotation(Class<? extends Annotation> annotationType);

	// 获取被该注解修饰的bean，key是名称,value是实例。
	Map<String, Object> getBeansWithAnnotation(Class<? extends Annotation> annotationType) throws BeansException;

	// 获取当前名称Bean的,当前注解的信息
	@Nullable
	<A extends Annotation> A findAnnotationOnBean(String beanName, Class<A> annotationType)
			throws NoSuchBeanDefinitionException;

}
```

### 2.3.4 ConfigurableBeanFactory

这个工厂，是最容易看出他的用途的，名字一个看就是跟配置相关的。

```java
public interface ConfigurableBeanFactory extends HierarchicalBeanFactory, SingletonBeanRegistry {

	// 单例:一个容器只都存在实例
	String SCOPE_SINGLETON = "singleton";

	// 原型:每次getBean一次生成一个实例
	String SCOPE_PROTOTYPE = "prototype";

	// 设置他的父工厂
	void setParentBeanFactory(BeanFactory parentBeanFactory) throws IllegalStateException;

	// 设置类加载器以用于加载 bean 类。默认是线程上下文类加载器。
	void setBeanClassLoader(@Nullable ClassLoader beanClassLoader);

	// 返回此工厂的类加载器以加载 bean 类
	@Nullable
	ClassLoader getBeanClassLoader();

	// 指定用于类型匹配目的的临时 ClassLoader。默认为无
	void setTempClassLoader(@Nullable ClassLoader tempClassLoader);

	// 获取临时的类加载器
	@Nullable
	ClassLoader getTempClassLoader();

	// 设置是否缓存 bean 元数据，例如给定的 bean 定义（以合并方式）和解析的 bean 类。默认开启。
	void setCacheBeanMetadata(boolean cacheBeanMetadata);

	// 返回是否缓存 bean 元数据
	boolean isCacheBeanMetadata();

	// bean 定义值中的表达式指定解析策略。
  // 默认是 StandardBeanExpressionResolver。
	void setBeanExpressionResolver(@Nullable BeanExpressionResolver resolver);

	// 获取解析类型 StandardBeanExpressionResolver
	@Nullable
	BeanExpressionResolver getBeanExpressionResolver();

	// 设置转换层统一的API,后面有专门章节说这个体系。
	void setConversionService(@Nullable ConversionService conversionService);

	// 获取转换API
	@Nullable
	ConversionService getConversionService();

	// 给工厂添加一个属性设置的注册器,实际用的不多,但是有必要去了解,后面也会介绍
	void addPropertyEditorRegistrar(PropertyEditorRegistrar registrar);

	// 为给定类型的所有属性注册给定的自定义属性编辑器。在工厂配置期间调用。
	void registerCustomEditor(Class<?> requiredType, Class<? extends PropertyEditor> propertyEditorClass);

	// BeanFactory 中注册的自定义编辑器初始化给定的 PropertyEditorRegistry
	void copyRegisteredEditorsTo(PropertyEditorRegistry registry);

	// 设置类型转换器
	void setTypeConverter(TypeConverter typeConverter);

	// 获取类型转换器
	TypeConverter getTypeConverter();

	// 添加字符串解析器。
	void addEmbeddedValueResolver(StringValueResolver valueResolver);

	// 是否有字符串解析器
	boolean hasEmbeddedValueResolver();

	// 解析数据
	@Nullable
	String resolveEmbeddedValue(String value);

	// 添加一个新的 BeanPostProcessor，它将应用于此工厂创建的 bean。在工厂配置期间调用。
  // 非系统定义的处理器，都可以使用Order进行排序
  // 这是一个非常重要的Bean处理器
	void addBeanPostProcessor(BeanPostProcessor beanPostProcessor);

	// 处理器的个人
	int getBeanPostProcessorCount();

	// 注册由给定 Scope 实现支持的给定范围
  // 这里稍微解释下什么是Scope,就比如Session内有效或者是Request内有效
	void registerScope(String scopeName, Scope scope);

	// 返回所有当前注册范围的名称,不会公开诸如“singleton”和“prototype”之类的内置作用域
	String[] getRegisteredScopeNames();

	// 获取域的域对象
	@Nullable
	Scope getRegisteredScope(String scopeName);

	// 提供与该工厂相关的安全访问控制上下文。
	AccessControlContext getAccessControlContext();

	// 拷贝当Bean工厂的配置
	void copyConfigurationFrom(ConfigurableBeanFactory otherFactory);

	// 给bean注册一个别名
	void registerAlias(String beanName, String alias) throws BeanDefinitionStoreException;

	// 解析在此工厂中注册的所有别名目标名称和别名，并将给定的 StringValueResolver 应用于它们。
	void resolveAliases(StringValueResolver valueResolver);

	// 返回给定 bean 名称的合并 BeanDefinition，如有必要，将子 bean 定义与其父合并。
	BeanDefinition getMergedBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;

	// 是否是FactoryBean
	boolean isFactoryBean(String name) throws NoSuchBeanDefinitionException;

	// 设置当前Bean正在创建中。仅供容器内部会使用。
	void setCurrentlyInCreation(String beanName, boolean inCreation);

	// 当前Bean是否创建中
	boolean isCurrentlyInCreation(String beanName);

	// 为给定的 bean 注册一个依赖 bean
	void registerDependentBean(String beanName, String dependentBeanName);

	// 返回依赖于指定 bean 的所有 bean 的名称
	String[] getDependentBeans(String beanName);

	// 获取当前Bean依赖的Bean
	String[] getDependenciesForBean(String beanName);

	// 销毁bean
	void destroyBean(String beanName, Object beanInstance);

	// 销毁当前目标作用域中的指定作用域bean（如果有）
	void destroyScopedBean(String beanName);

	// 销毁单例
	void destroySingletons();

}

```

### 2.3.5 AutowireCapableBeanFactory

Autowire是不是看着很熟,提供自动注入的方法。

```java
public interface AutowireCapableBeanFactory extends BeanFactory {

	// 不需要自动装配
	int AUTOWIRE_NO = 0;

	// 表示按名称自动装配 bean 属性的常量
	int AUTOWIRE_BY_NAME = 1;

	// 按照类型来自动装配
	int AUTOWIRE_BY_TYPE = 2;

	// 指示自动装配可以满足的最贪婪构造函数的常量
	int AUTOWIRE_CONSTRUCTOR = 3;

	//
	@Deprecated
	int AUTOWIRE_AUTODETECT = 4;

	// 5.1 才有的。初始化现有 bean 实例时的“原始实例”约定的后缀：附加到完全限定的 bean 类名，例如“com.mypackage.MyClass.ORIGINAL”，以强制返回给定的实例，即没有代理等。
	String ORIGINAL_INSTANCE_SUFFIX = ".ORIGINAL";


	//-------------------------------------------------------------------------
	// 创建和填充bean 实例的方法
	//-------------------------------------------------------------------------

	// 创建bean
	<T> T createBean(Class<T> beanClass) throws BeansException;

	// 自动装配bean
	void autowireBean(Object existingBean) throws BeansException;

	// 给一个空实例,也能进行填充。
	Object configureBean(Object existingBean, String beanName) throws BeansException;


	//-------------------------------------------------------------------------
	// 对 bean 生命周期进行细粒度控制的专用方法
	//-------------------------------------------------------------------------

	
	Object createBean(Class<?> beanClass, int autowireMode, boolean dependencyCheck) throws BeansException;
  
	Object autowire(Class<?> beanClass, int autowireMode, boolean dependencyCheck) throws BeansException;
  
	void autowireBeanProperties(Object existingBean, int autowireMode, boolean dependencyCheck)
			throws BeansException;
      
	void applyBeanPropertyValues(Object existingBean, String beanName) throws BeansException;
  
	Object initializeBean(Object existingBean, String beanName) throws BeansException;
  
	Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)
			throws BeansException;
      
	Object applyBeanPostProcessorsAfterInitialization(Object existingBean, String beanName)
			throws BeansException;
      
	void destroyBean(Object existingBean);

	<T> NamedBeanHolder<T> resolveNamedBean(Class<T> requiredType) throws BeansException;

	Object resolveBeanByName(String name, DependencyDescriptor descriptor) throws BeansException;

	@Nullable
	Object resolveDependency(DependencyDescriptor descriptor, @Nullable String requestingBeanName) throws BeansException;

	@Nullable
	Object resolveDependency(DependencyDescriptor descriptor, @Nullable String requestingBeanName,
			@Nullable Set<String> autowiredBeanNames, @Nullable TypeConverter typeConverter) throws BeansException;

}

```

### 2.3.6 ConfigurableListableBeanFactory

看名字大概就能猜出些什么了，具体接口定义看下面。

```java
public interface ConfigurableListableBeanFactory
		extends ListableBeanFactory, AutowireCapableBeanFactory, ConfigurableBeanFactory {

	// 自动装配时候，忽略这些类型
	void ignoreDependencyType(Class<?> type);

	// 自动装配时候，忽略这些接口
	void ignoreDependencyInterface(Class<?> ifc);

	// 给当前类型,注入指定的实例。
	void registerResolvableDependency(Class<?> dependencyType, @Nullable Object autowiredValue);

	// 判断当前bean是否有资格作为自动装配的候选者
	boolean isAutowireCandidate(String beanName, DependencyDescriptor descriptor)
			throws NoSuchBeanDefinitionException;

	// 返回指定 bean 的注册 BeanDefinition
	BeanDefinition getBeanDefinition(String beanName) throws NoSuchBeanDefinitionException;

	// 返回此工厂管理的所有 bean 名称
	Iterator<String> getBeanNamesIterator();

	// 清除合并的 bean 定义缓存，通常在更改原始 bean 定义后触发
	void clearMetadataCache();

	// 冻结所有 bean 定义，表示注册的 bean 定义将不会被修改或进一步后处理
	void freezeConfiguration();

	// 返回此工厂的 bean 定义是否被冻结，即不应该进一步修改或后处理。
	boolean isConfigurationFrozen();

	// 单例初始化方法,非常重要,我们开发中大部分bean初始化就是这个方法调用的哦。
	void preInstantiateSingletons() throws BeansException;

}

```

好了关于工厂的定义已经全部展示了，剩下的都是具体的实现。具体的实现就不单独拿出来了。下面我们来看Spring中的上下文对象。

## 三、ApplicationContext 容器上下文


应用上下文,是Spring中最最核心的类,也是功能最强大的类,Spring所有的工具基本都能通过上下文来获取。

- 获取环境变量
- 获取Bean工厂
- 发送容器事件

下面我们看Spring中构建上下文的几种方式。

## 3.1 构建上下文

### 3.1.1 参数化构建


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



### 3.1.2 目录扫描

扫描 `com.acme` 包以查找任何 带@Component注释的类，并且这些类在容器中注册为 Spring bean 定义。

```java 
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.scan("com.acme");
    ctx.refresh();
    MyService myService = ctx.getBean(MyService.class);
}
```

## 3.2 容器事件

| 事件                         | 解释                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| `ContextRefreshedEvent`      | 在初始化或刷新时发布`ApplicationContext`（例如，通过使用接口`refresh()`上的方法`ConfigurableApplicationContext`）。这里，“初始化”意味着所有 bean 都已加载，后处理器 bean 被检测并激活，单例被预实例化，并且`ApplicationContext`对象已准备好使用。只要上下文没有关闭，就可以多次触发刷新，前提是所选择的`ApplicationContext`实际支持这种“热”刷新。例如，`XmlWebApplicationContext`支持热刷新，但 `GenericApplicationContext`不支持。 |
| `ContextStartedEvent`        | 使用接口上的方法 `ApplicationContext`启动时发布。在这里，“已启动”意味着所有 bean 都接收到一个明确的启动信号。通常，此信号用于在显式停止后重新启动 bean，但它也可用于启动尚未配置为自动启动的组件（例如，尚未在初始化时启动的组件）。`start()``ConfigurableApplicationContext``Lifecycle` |
| `ContextStoppedEvent`        | 使用接口上的方法 `ApplicationContext`停止时发布。在这里，“停止”意味着所有 的 bean 都会收到一个明确的停止信号。可以通过 调用重新启动已停止的上下文。`stop()``ConfigurableApplicationContext``Lifecycle``start()` |
| `ContextClosedEvent`         | 在`ApplicationContext`使用接口`close()`上的方法`ConfigurableApplicationContext`或通过 JVM 关闭挂钩关闭时发布。在这里，“关闭”意味着所有的单例 bean 都将被销毁。一旦上下文关闭，它就到了生命的尽头，无法刷新或重新启动。 |
| `RequestHandledEvent`        | 一个特定于 Web 的事件，告诉所有 bean 一个 HTTP 请求已得到服务。此事件在请求完成后发布。此事件仅适用于使用 Spring 的 Web 应用程序`DispatcherServlet`。 |
| `ServletRequestHandledEvent` | 它的子类`RequestHandledEvent`添加了 Servlet 特定的上下文信息。 |

### 3.2.1 ContextRefreshedEvent 容器刷新事件

容器启动的最后一步,发送容器刷新事件,当收到这个事件的时候,容器就已经准备就绪了,你就可以正常使用了。

- `AbstractApplicationContext#finishRefresh`

![](https://img.springlearn.cn/blog/125e0b6ea32c588517f32b72ed49e461.png)

### 3.2.2 ContextClosedEvent 关闭事件

一旦应用被关闭或者中断就会触发容器关闭事件。但是 `kill -9` 除外, `kill ` 是可以的。这背后的原因,这是linux系统的机制,更多详细请自行百度。


### 3.2.3 ContextStartedEvent 启动事件

ContextStartedEvent 跟前面两个的事件不同是,必须要显示触发,比如下面这样。

```java
 public static void main(String[] args) {
        SpringApplication.run(Application.class,args).start();
 }
```

### 3.2.4 ContextStoppedEvent 停止事件

ContextStoppedEvent 和 ContextStartedEvent 是一样的，必须要显示调用。

```java
 public static void main(String[] args) {
        SpringApplication.run(Application.class,args).stop();
 }
```


### 3.2.5 RequestHandledEvent

当收到http请求时候触发,此事件仅适用于使用 Spring 的 Web 应用程序DispatcherServlet。

### 3.2.6 ServletRequestHandledEvent

跟前这一样,不同的是增加了Servlet的信息.

![](https://img.springlearn.cn/blog/1157fdfe955ecc93d98bbb3090e2258f.png)


**更多事件相关,请看下一篇,Event专题**


## 四、JavaConfig 配置

>在之前Spring的配置都是基于xml方式,当Jdk5之后支持注解后,Spring的配置方式增加了基于注解的配置。

那么你认为Java代码注解配置好? 还是xml方式好呢?

我们看下官方的回答:

- 简短的回答是“视情况而定”。
- 长答案是每种方法都有其优点和缺点，通常由开发人员决定哪种策略更适合他们。

由于它们的定义方式，注解方式在其声明中提供了大量上下文，从而使配置更短、更简洁。
然而，XML 擅长在不触及源代码或重新编译它们的情况下连接组件。一些开发人员更喜欢在源附近进行布线，而另一些开发人员则认为带注释的类不再是 POJO，此外，配置变得分散且更难控制。
无论选择如何，Spring 都可以同时适应这两种风格，甚至可以将它们混合在一起。

改部分介绍如何在 Java 代码中使用注解来配置 Spring 容器。它包括以下主题：

## 4.1 @Configuration 配置类

Spring 新的 Java 配置,的主要使用的是 @Configuration注释的类。

```java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

前面的AppConfig类等价于下面的 Spring <beans/>XML：

```xml
<beans>
    <bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

## 4.2 带@Bean注解的方法

当@Bean方法在没有用 `@Configuration` 注解修饰的类中声明时 ，它们被称为以“精简”模式处理。
如下代码示例。

```java
@Component
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

## 4.3 @Configuration和@Bean的区别

与@Configuration不同的是,使用@Bean方法的模式, 不能声明 bean 间的依赖关系。这句话怎么理解的。我们举一个代码的例子。

```java
@Component
public class BeanConf {

    @Bean("serverA")
    public ServerA serverA() {
        ServerA serverA = new ServerA("Configuration 方式");
        System.out.println("ServerA:" + serverA.hashCode());
        return serverA;
    }

    @Bean("serverB")
    public ServerB serverB() {
        ServerB serverB = new ServerB();
        ServerA serverA = serverA();
        System.out.println("Method ServerA:" + serverA.hashCode());
        serverB.setServerA(serverA);
        return serverB;
    }
}
```

我们使用 `Component` 来修饰, `ServerA:` 这一行,会打印2次,第一次是 `@Bean`解析Bean时候。第二次是
在 serverB方法调用时候执行。此时ServerB中注入的ServerA并不是被容器管理的Bean。而是调用方法新建的ServerA。

好下面我们看另外一个例子。

```java
@Configuration
public class BeanConf {

    @Bean("serverA")
    public ServerA serverA() {
        ServerA serverA = new ServerA("Configuration 方式");
        System.out.println("ServerA:" + serverA.hashCode());
        return serverA;
    }

    @Bean("serverB")
    public ServerB serverB() {
        ServerB serverB = new ServerB();
        ServerA serverA = serverA();
        System.out.println("Method ServerA:" + serverA.hashCode());
        serverB.setServerA(serverA);
        return serverB;
    }
}
```

与前面不同的是, `ServerA:` 这一行,会打印1次,就是解析 `@Bean`的时候。而 serverB()方法中虽然调用了 serverA()方法,但是并不会执行,而是从容器中直接拿到前面解析的Bean。


所以我们得出结论,我们尽量要用 `@Configuration` 来声明配置,避免出现意外的问题。

## 五、基于注解容器配置

## 5.1 @Required

此注解指示必须在配置时通过 bean 定义中的显式属性值或通过自动装配来填充受影响的 bean 属性。如果受影响的 bean 属性尚未填充，则容器将引发异常。

处理类: `RequiredAnnotationBeanPostProcessor`

注意: 这种方式已经声明废弃了,不过也支持,但是不建议使用。

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Required
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```

## 5.2 @Autowired

声明注入的,@Autowired 默认不允许为空,即跟 `@Required` 一样,如果为空就中断,但是也允许为空。
如果为空,不想中断,可以这样使用 `@Autowired(required = false)`

```java
public class MovieRecommender {

    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}
```

## 5.3 @Primary

- Primary翻译: 主要的

由于按类型自动装配可能会导致多个候选者，因此通常需要对选择过程进行更多控制。实现这一点的一种方法是使用 Spring 的 @Primary注释。@Primary: 当多个 bean 是自动装配到单值依赖项的候选对象时，应该优先考虑特定的 bean。如果候选中恰好存在一个主 bean，则它将成为自动装配的值。

如下,MovieCatalog类型有两个Bean。
```java
@Configuration
public class MovieConfiguration {

    @Bean("MovieCatalog1")
    @Primary
    public MovieCatalog firstMovieCatalog() { ... }

    @Bean("MovieCatalog2")
    public MovieCatalog secondMovieCatalog() { ... }

    // ...
}
```

当要进行注入时候就会报错,因为根据类型发现了两个备选的Bean。而这种情况的解决办法就是其中一个使用 `@Primary` 来修饰。此时容器就知道你到底要注册那个了,当被 `@Primary` 修饰的Bean会被正确注入。

此时可能有朋友会问,如果两个一样类型的Bean都用 `@Primary` 来修饰呢? 结果就是会报错。如下。

```
No qualifying bean of type 'learn.spring.service.ServerA' available: more than one 'primary' bean found among candidates: [serverA1, serverA2]
```

## 5.4 @Qualifier

`@Primary`当可以确定一个主要候选者时，是一种通过类型使用多个实例的自动装配的有效方法。当您需要对选择过程进行更多控制时，可以使用 Spring 的@Qualifier注解。您可以将限定符值与特定参数相关联，缩小类型匹配的范围，以便为每个参数选择特定的 bean。

```java
@Configuration
public class MovieConfiguration {

    @Bean("main")
    public MovieCatalog firstMovieCatalog() { ... }

    @Bean
    public MovieCatalog secondMovieCatalog() { ... }

    // ...
}

public class MovieRecommender {

    @Autowired
    @Qualifier("main")
    private MovieCatalog movieCatalog;

    // ...
}
```


一个最简单的解释就是 `@Autowired + @Qualifier` = `@Resource`。


## 5.5 CustomAutowireConfigurer

前面我们可以通过 @Qualifier 实现根据名字的注入, CustomAutowireConfigurer 允许我们自定义一个注解, 具备和  @Qualifier 一样的功能。

首先我们声明一个注解,保持和@Qualifier一样的结构

```java
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface ConditionAutowire {
    String value() default "";
}
```

然后使用CustomAutowireConfigurer来,配置我们自定义的注解。
```java
    /**
     * 自定义一个注入工具
     *
     * @return 注入工具
     */
    @Bean
    public CustomAutowireConfigurer customAutowireConfigurer() {
        CustomAutowireConfigurer customAutowireConfigurer = new CustomAutowireConfigurer();
        customAutowireConfigurer.setCustomQualifierTypes(Collections.singleton(ConditionAutowire.class));
        return customAutowireConfigurer;
    }
```

这样我们就能使用下面的代码了。


```java
@Component
public class ServerB {

    ServerA serverA;


    @Autowired
    // @Qualifier("serverAA") 与下面代码等价。
    @ConditionAutowire("serverAA")
    public void setServerA(ServerA serverA) {
        this.serverA = serverA;
    }
}    
```


## 5.6 @Resource

Spring 还通过在字段或 bean 属性设置器方法上使用 JSR-250@Resource注释 ( )来支持注入。javax.annotation.Resource这是 Java EE 中的常见模式：例如，在 JSF 管理的 bean 和 JAX-WS 端点中。Spring 也支持 Spring 管理的对象的这种模式。

@Resource采用名称属性。默认情况下，Spring 将该值解释为要注入的 bean 名称。换句话说，它遵循按名称语义，如以下示例所示：


```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource(name="myMovieFinder") 
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

如果没有明确指定名称，则默认名称派生自字段名称或 setter 方法。如果是字段，则采用字段名称。对于 setter 方法，它采用 bean 属性名称。以下示例将把名为 bean 的 beanmovieFinder注入到它的 setter 方法中：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```
## 5.7 @Value

@Value通常用于注入外部属性

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name}") String catalog) {
        this.catalog = catalog;
    }
}
```

application.properties文件,添加上一下配置

```
catalog.name=MovieCatalog
```

### 5.7.1 默认值

- @Value("${catalog.name:defaultCatalog}")

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name:defaultCatalog}") String catalog) {
        this.catalog = catalog;
    }
}
```

### 5.7.1 支持SpringEL 表达式

当@Value包含SpEL表达式时，该值将在运行时动态计算，如以下示例所示：

```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("#{systemProperties['user.catalog'] + 'Catalog' }") String catalog) {
        this.catalog = catalog;
    }
}
```

SpEL 还支持使用更复杂的数据结构：

- 注意如果使用EL表达式,就不是$而是#

```java
@Component
public class MovieRecommender {

    private final Map<String, Integer> countOfMoviesPerCatalog;

    public MovieRecommender(
            @Value("#{{'Thriller': 100, 'Comedy': 300}}") Map<String, Integer> countOfMoviesPerCatalog) {
        this.countOfMoviesPerCatalog = countOfMoviesPerCatalog;
    }
}
```

## 5.8 初始化 & 销毁方法

- @PostConstruct
- @PreDestroy

处理类: InitDestroyAnnotationBeanPostProcessor

```java
public class CachingMovieLister {

    @PostConstruct
    public void populateMovieCache() {
        // 初始化执行
    }

    @PreDestroy
    public void clearMovieCache() {
        // Bean销毁执行
    }
}
```

可能会有人问

- 不是还有`InitializingBean`初始化和`DisposableBean`接口能实现初始化和销毁方法吗?

```java
public interface InitializingBean {
    void afterPropertiesSet() throws Exception;
}
public interface DisposableBean {
    void destroy() throws Exception;
}
```
- 不是还可以通过 `@Bean(initMethod = "init",destroyMethod = "destroy")` 来声明吗?

是的当然都可以,不过这也是有执行顺序的,顺序如下。

![](https://img.springlearn.cn/blog/4c45e9413b184783019c571ab95c779b.png)


## 5.9 @Scope

这个注解平时接触的都很少,但是其实我们都在用,因为如果不显示声明,默认就是 @Scope("singleton")

这个怎么理解呢? 比如在Spring中默认都是单例 `singleton`,这就意味着就是说在容器不关闭的情况下，不管你调用了几次都是同一个实例。如果我们想让每个Thread拿到自己的实例呢? 有没有办法呢?

当然有,如下我们定一个Thread范围的Bean, 首先给工厂定义自己的域范围。

```java
@Component
public class BeanFactoryConf implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        beanFactory.registerScope("thread", new SimpleThreadScope());
    }

    @Bean
    @Scope("thread")
    public ThreadScopeBean threadScopeBean() {
        return new ThreadScopeBean(Thread.currentThread().getName());
    }

    public static class ThreadScopeBean {

        String name;

        public ThreadScopeBean(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return name;
        }
    }

}
```

然后使用多个线程来获取这个Bean,最终我们会发现,每个线程得到的实例都是不一样的。符合Thread这个域的范围。

```java
    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(Application.class, args);
        ServerB bean = run.getBean(ServerB.class);
        System.out.println(bean);
        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                BeanFactoryConf.ThreadScopeBean threadScope = run.getBean(BeanFactoryConf.ThreadScopeBean.class);
                // thread-scope-1
                // thread-scope-2
                // thread-scope-0
                System.out.println(threadScope);
            }, "thread-scope-" + i).start();
        }
    }
```

**注意:** 上面这个例子,必须每次从容器中重新获取Bean才会生效。

当然这里是Thread范围,其实还有Session范围和request范围,这两个是我们使用最多的。他们两个是如何实现的呢? 大家可以思考下,其实也很简单。就是对工具类和ThreadLocal的利用。有知道原理的,可以下面评论。


### 5.9.1 HttpServletRequest 注入


这里解释一个经常被弄混淆概念,就是我们知道我们在容器中注入一个 `HttpServletRequest` 这个类,
`HttpServletRequest` 不是一个 `Bean`, 为什么能注入呢?
每次在使用的时候,都会获取当前的请求对象。他是如何实现的呢? 他不是Scope来实现的。而是通过。下面
这两个行代码一起来实现的。

- beanFactory.registerScope(WebApplicationContext.SCOPE_REQUEST, new RequestScope()) 这一行的意思是,当发现你要注入的是SCOPE_REQUEST,时候会调用RequestScope@getObject来实例化。这个类不是单例不会被容器保存,也不是原型不会每次都来重新创建。
- beanFactory.registerResolvableDependency(ServletRequest.class, new RequestObjectFactory()) 的意思是，当这个类被注入到其他类的时候,要进行代理。

```java
public static void registerWebApplicationScopes(ConfigurableListableBeanFactory beanFactory,
			@Nullable ServletContext sc) {

		beanFactory.registerScope(WebApplicationContext.SCOPE_REQUEST, new RequestScope());
		beanFactory.registerResolvableDependency(ServletRequest.class, new RequestObjectFactory());
    ...
	}
```

在进行自动注入的时候,如果发现实例是一个 `ObjectFactory`  就会生成代理类。

```java
public static Object resolveAutowiringValue(Object autowiringValue, Class<?> requiredType) {
		if (autowiringValue instanceof ObjectFactory && !requiredType.isInstance(autowiringValue)) {
      // 这里获取到RequestObjectFactory
			ObjectFactory<?> factory = (ObjectFactory<?>) autowiringValue;
			if (autowiringValue instanceof Serializable && requiredType.isInterface()) {
				autowiringValue = Proxy.newProxyInstance(requiredType.getClassLoader(),
						new Class<?>[] {requiredType}, new ObjectFactoryDelegatingInvocationHandler(factory));
			}
			else {
				return factory.getObject();
			}
		}
		return autowiringValue;
	}

```

然后代理类中这样处理,在执行每个方法的时候,都从新获取 `ObjectFactory#getObject()`。

```java
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
			String methodName = method.getName();
			if (methodName.equals("equals")) {
				// Only consider equal when proxies are identical.
				return (proxy == args[0]);
			}
			else if (methodName.equals("hashCode")) {
				// Use hashCode of proxy.
				return System.identityHashCode(proxy);
			}
			else if (methodName.equals("toString")) {
				return this.objectFactory.toString();
			}
			try {
        // 每次执行方法,都从新获取objectFactory.getObject()
        // RequestObjectFactory中是使用ThreadLocal的方式来实现。
				return method.invoke(this.objectFactory.getObject(), args);
			}
			catch (InvocationTargetException ex) {
				throw ex.getTargetException();
			}
		}
```

## 5.10 @Import


`@Import` 注解允许 `@Bean` 从另一个配置类加载定义，如以下示例所示：

```java
@Configuration
public class ConfigA {

    @Bean
    public A a() {
        return new A();
    }
}

@Configuration
@Import(ConfigA.class)
public class ConfigB {

    @Bean
    public B b() {
        return new B();
    }
}
```

现在，不需要同时指定ConfigA.class和ConfigB.class在实例化上下文时，只ConfigB需要显式提供，如以下示例所示：

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(ConfigB.class);

    // now both beans A and B will be available...
    A a = ctx.getBean(A.class);
    B b = ctx.getBean(B.class);
}
```

> 从 Spring Framework 4.2 开始，@Import还支持对常规组件类的引用，类似于AnnotationConfigApplicationContext.register方法。如果您想通过使用一些配置类作为入口点来显式定义所有组件来避免组件扫描，这将特别有用。


这里我们定义一个注解,使用Import修饰,这样当使用这个注解时候,就会自动去注册 `DubboComponentScanRegistrar` 到容器,然后去处理些dubbo组件扫描的逻辑。然后就可以你在DubboComponentScanRegistrar中来获取到DubboComponentScan注解的信息。


```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(DubboComponentScanRegistrar.class)
public @interface DubboComponentScan {
   String[] value() default {};
}

public class DubboComponentScanRegistrar implements ImportBeanDefinitionRegistrar {

   public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        // 获取DubboComponentScan注解中配置要扫描的目录
        Set<String> packagesToScan = getPackagesToScan(importingClassMetadata);
        // 扫描上面指定的目录,生成BeanDefinition通过registry去注册。
        registerServiceAnnotationBeanPostProcessor(packagesToScan, registry);
        
        registerReferenceAnnotationBeanPostProcessor(registry);

    }
}
```

## 5.11 @Profile

Bean 定义配置文件在核心容器中提供了一种机制，允许在不同环境中注册不同的 bean。“环境”这个词对不同的用户可能意味着不同的东西，这个功能可以帮助许多用例，包括：

- 在开发中处理内存中的数据源，而不是在 QA 或生产中从 JNDI 中查找相同的数据源。
- 仅在将应用程序部署到性能环境时才注册监控基础架构。
- 为客户 A 和客户 B 部署注册定制的 bean 实现。

```java
@Configuration
@Profile("development")
public class StandaloneDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }
}
@Configuration
@Profile("production")
public class JndiDataConfig {

    @Bean
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

### 5.11.1 自定义环境注解

可以将 `@Profile` 其用作元注释以创建自定义组合注释。以下示例定义了一个自定义 `@Production` 注释，您可以将其用作 的替代品 `@Profile("production")`

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Profile("production")
public @interface Production {
}
```

### 5.11.2 激活环境

```java
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.getEnvironment().setActiveProfiles("development");
ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
ctx.refresh();
```

此外，您还可以通过 `spring.profiles.active` 属性以声明方式激活配置文件

以声明方式，`spring.profiles.active` 可以接受以逗号分隔的配置文件名称列表，如以下示例所示：

```
-Dspring.profiles.active="profile1,profile2"
```

## 六、Aware

这个比较简单,当你看到实现了Aware结尾的接口,Spring都会给你自动给你注入对应的Spring种内置的组件。这个怎么理解呢,看下面。

![](https://img.springlearn.cn/blog/30492b96a0e4cf1464aa274a101483c9.png)

## 6.1 BeanFactoryAware

获取 `BeanFactory`

```java
public interface BeanFactoryAware extends Aware {
	void setBeanFactory(BeanFactory beanFactory) throws BeansException;
}
```

## 6.2 BeanNameAware

获取 `Bean` 的名称

```java
public interface BeanNameAware extends Aware {
	void setBeanName(String name);
}
```
## 6.3 MessageSourceAware

获取国际化对象 `MessageSource`

```java
public interface MessageSourceAware extends Aware {
	void setMessageSource(MessageSource messageSource);
}
```
## 6.4 ApplicationContextAware

获取容器上下文 `ApplicationContext`

```java
public interface ApplicationContextAware extends Aware {
	void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

## 6.5 ApplicationEventPublisherAware

获取事件发送者 `ApplicationEventPublisher`

```java
public interface ApplicationEventPublisherAware extends Aware {
	void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher);
}
```

## 6.6 ResourceLoaderAware

获取资源加载器 `ResourceLoader`

```java
public interface ResourceLoaderAware extends Aware {
	void setResourceLoader(ResourceLoader resourceLoader);
}
```

## 6.7 ServletConfigAware

获取 `ServletConfig`

```java
public interface ServletConfigAware extends Aware {
	void setServletConfig(ServletConfig servletConfig);
}
```

## 6.8 ServletContextAware

```java
public interface ServletContextAware extends Aware {
	void setServletContext(ServletContext servletContext);
}
```

## 七、生成候选组件的索引

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

当引用之后,再编译期间生成配置文件。

![](https://img.springlearn.cn/blog/21fe9b4d82feb3f7e88e2d1bffde298d.png)

这个的原理,其实就跟lombok类似,使用到的都是 `APT` 技术,如果感兴趣的话,可以看我这篇文章。

[【lombok原理】无聊的周末一个人手写一个lombok](https://springlearn.blog.csdn.net/article/details/126695402)



![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)
