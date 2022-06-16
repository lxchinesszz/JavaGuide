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
title: 动态绑定配置
category: Spring
---

![](https://img.springlearn.cn/blog/learn_1652957155000.png)

## 一、如何实现动态配置

在Spring体系下,如果实现了ConfigurationProperties则会自动刷新。而如果只使用`@Value`的方法,要加上 `@RefreshScope` 才能实现。
本篇文章我们来分别研究下他们的原理。然后在来看看其他的方案是如何做的吧。

## 二、实现原理

## 2.1 @ConfigurationProperties

所有被`@ConfigurationProperties`修饰的类都会被ConfigurationPropertiesBeans处理

1. 实现`BeanPostProcessor`处理器，初始化时候判断是否被`@ConfigurationProperties`修饰,如果是就保存到`ConfigurationPropertiesBeans#beans属性中`

```java 
    public Object postProcessBeforeInitialization(Object bean, String beanName)
			throws BeansException {
		// 1. 如果已经被RefreshScope修饰了,也会自动更新就不用在处理了。 	
		if (isRefreshScoped(beanName)) {
			return bean;
		}
		ConfigurationProperties annotation = AnnotationUtils
				.findAnnotation(bean.getClass(), ConfigurationProperties.class);
		if (annotation != null) {
			this.beans.put(beanName, bean);
		}
		else if (this.metaData != null) {
			annotation = this.metaData.findFactoryAnnotation(beanName,
					ConfigurationProperties.class);
			if (annotation != null) {
				this.beans.put(beanName, bean);
			}
		}
		return bean;
	}

```


2. ConfigurationPropertiesRebinder 实现 `EnvironmentChangeEvent` 变更事件, 当收到EnvironmentChangeEvent事件 
会重新触发绑定事件。需要绑定的bean就从ConfigurationPropertiesBeans#beans属性中获取。

具体的实现类 `ConfigurationPropertiesRebinder`

1. 先调用销毁方法
2. 然后重新初始化
```java 
    // 接受事件
    public void onApplicationEvent(EnvironmentChangeEvent event) {
		if (this.applicationContext.equals(event.getSource())
				// Backwards compatible
				|| event.getKeys().equals(event.getSource())) {
			rebind();
		}
	}
	// 重新绑定
    public boolean rebind(String name) {
		if (!this.beans.getBeanNames().contains(name)) {
			return false;
		}
		if (this.applicationContext != null) {
			try {
				Object bean = this.applicationContext.getBean(name);
				if (AopUtils.isAopProxy(bean)) {
					bean = ProxyUtils.getTargetObject(bean);
				}
				if (bean != null) {
					this.applicationContext.getAutowireCapableBeanFactory()
							.destroyBean(bean);
					this.applicationContext.getAutowireCapableBeanFactory()
							.initializeBean(bean, name);
					return true;
				}
			}
			catch (RuntimeException e) {
				this.errors.put(name, e);
				throw e;
			}
			catch (Exception e) {
				this.errors.put(name, e);
				throw new IllegalStateException("Cannot rebind to " + name, e);
			}
		}
		return false;
	}
```

## 2.2 @RefreshScope

`@RefreshScope` 的原理相对流程较长，首先他需要你将类用 `@RefreshScope`来修饰。


1. 首先明确那些是被修饰的`AnnotatedBeanDefinitionReader#registerBean`。

```java AnnotatedBeanDefinitionReader#registerBean
<T> void doRegisterBean(Class<T> annotatedClass, @Nullable Supplier<T> instanceSupplier, @Nullable String name,
			@Nullable Class<? extends Annotation>[] qualifiers, BeanDefinitionCustomizer... definitionCustomizers) {

		AnnotatedGenericBeanDefinition abd = new AnnotatedGenericBeanDefinition(annotatedClass);
		if (this.conditionEvaluator.shouldSkip(abd.getMetadata())) {
			return;
		}

		abd.setInstanceSupplier(instanceSupplier);
		ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(abd);
		abd.setScope(scopeMetadata.getScopeName());
		...
		BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(abd, beanName);
		// 创建bean描述信息 beanClass = ScopedProxyFactoryBean
		// ScopedProxyCreator#createScopedProxy->ScopedProxyUtils#createScopedProxy
		definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);
		BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, this.registry);

}		
```

2. 被Scope修饰的beanClass都是ScopedProxyFactoryBean
    - GenericScope 实现BeanFactoryPostProcessor 会提前将RefreshScope注册到BeanFactory中
    - beanFactory.registerScope(this.name, this)
    - 当执行完上面 AbstractBeanFactory#scopes属性中就有值了。对于RefreshScope name = refresh
```java 
public class GenericScope implements Scope, BeanFactoryPostProcessor,
		BeanDefinitionRegistryPostProcessor, DisposableBean {

}
public class RefreshScope extends GenericScope implements ApplicationContextAware,
		ApplicationListener<ContextRefreshedEvent>, Ordered {	
}		
```
 
3. 当getBean时候,对于域对象会有特殊的处理逻辑,会调用 `Scope#get(String name, ObjectFactory<?> objectFactory)`

```java 
	protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
			@Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {
			...
				// 创建单例逻辑
				if (mbd.isSingleton()) {
					...
					bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
				}
				// 创建原型逻辑
				else if (mbd.isPrototype()) {
					...
					bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
				}
				else {
				    // 创建域对象
				    // refresh
					String scopeName = mbd.getScope();
					// RefreshScope
					final Scope scope = this.scopes.get(scopeName);
					if (scope == null) {
						throw new IllegalStateException("No Scope registered for scope name '" + scopeName + "'");
					}
					try {
						Object scopedInstance = scope.get(beanName, () -> {
							beforePrototypeCreation(beanName);
							try {
								return createBean(beanName, mbd, args);
							}
							finally {
								afterPrototypeCreation(beanName);
							}
						});
						bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
					}
				}
			}
		}
		return (T) bean;
	}
```


```java 
public interface Scope {
	Object get(String name, ObjectFactory<?> objectFactory); 
}
public class GenericScope implements Scope, BeanFactoryPostProcessor,
		BeanDefinitionRegistryPostProcessor, DisposableBean {}
public class RefreshScope extends GenericScope implements ApplicationContextAware,
		ApplicationListener<ContextRefreshedEvent>, Ordered {}		
```

4. RefreshEventListener 接受事件，触发刷新操作

```java 
public class RefreshEventListener implements SmartApplicationListener {
    private ContextRefresher refresh;
    @Override
	public void onApplicationEvent(ApplicationEvent event) {
		if (event instanceof ApplicationReadyEvent) {
			handle((ApplicationReadyEvent) event);
		}
		else if (event instanceof RefreshEvent) {
			handle((RefreshEvent) event);
		}
	}

	public void handle(ApplicationReadyEvent event) {
		this.ready.compareAndSet(false, true);
	}

	public void handle(RefreshEvent event) {
		if (this.ready.get()) { // don't handle events before app is ready
			log.debug("Event received " + event.getEventDesc());
			Set<String> keys = this.refresh.refresh();
			log.info("Refresh keys changed: " + keys);
		}
	}
}
```

5. ContextRefresher#refresh
   1. refreshEnvironment刷新环境
   2. 调用RefreshScope#refreshAll

```java 
public class ContextRefresher {
   public synchronized Set<String> refresh() {
		Set<String> keys = refreshEnvironment();
		this.scope.refreshAll();
		return keys;
	}

	public synchronized Set<String> refreshEnvironment() {
		Map<String, Object> before = extract(
				this.context.getEnvironment().getPropertySources());
		addConfigFilesToEnvironment();
		Set<String> keys = changes(before,
				extract(this.context.getEnvironment().getPropertySources())).keySet();
		this.context.publishEvent(new EnvironmentChangeEvent(this.context, keys));
		return keys;
	}
}
```

6. RefreshScope#refreshAll
会将容器中的bean给销毁。
而ScopedProxyFactoryBean中getObject是一个代理对象。带代理类每次都从容器中获取。而容器前面已经将被RefreshScope修饰的类给销毁了
测试拿到的对象就是重新从容器中生成的。

```java  
public class ScopedProxyFactoryBean extends ProxyConfig
		implements FactoryBean<Object>, BeanFactoryAware, AopInfrastructureBean {
	private Object proxy;	
	private final SimpleBeanTargetSource scopedTargetSource = new SimpleBeanTargetSource();
	@Override
	public void setBeanFactory(BeanFactory beanFactory) {
        ...
		ProxyFactory pf = new ProxyFactory();
		pf.copyFrom(this);
		pf.setTargetSource(this.scopedTargetSource);
		this.proxy = pf.getProxy(cbf.getBeanClassLoader());
	}
}		

public class SimpleBeanTargetSource extends AbstractBeanFactoryBasedTargetSource {
	@Override
	public Object getTarget() throws Exception {
		return getBeanFactory().getBean(getTargetBeanName());
	}
}
```

## 三、其他方案

因为我们项目中用的是阿波罗，那我们只看阿波罗是如何来做的吧。
在阿波罗只用使用@Value就行了

## 3.1 先扫描@Value注解

将被@Value修饰的Bean和配置key先生成一个`SpringValue`对象然后注册到`SpringValueRegistry`中

```java 
public class SpringValueProcessor extends ApolloProcessor implements BeanFactoryPostProcessor, BeanFactoryAware {
   protected void processField(Object bean, String beanName, Field field) {
       // register @Value on field
       Value value = field.getAnnotation(Value.class);
       if (value == null) {
         return;
       }
       Set<String> keys = placeholderHelper.extractPlaceholderKeys(value.value());
   
       if (keys.isEmpty()) {
         return;
       }
   
       for (String key : keys) {
         SpringValue springValue = new SpringValue(key, value.value(), bean, beanName, field, false);
         springValueRegistry.register(beanFactory, key, springValue);
         logger.debug("Monitoring {}", springValue);
       }
  }
}
```

## 3.2 找到需要更新的Bean

接受到配置变更事件后,遍历本地变更的配置key，然后将本次key关联需要变更的Bean,从`springValueRegistry`中找到。

```java 
public class AutoUpdateConfigChangeListener implements ConfigChangeListener{
   @Override
  public void onChange(ConfigChangeEvent changeEvent) {
    Set<String> keys = changeEvent.changedKeys();
    if (CollectionUtils.isEmpty(keys)) {
      return;
    }
    for (String key : keys) {
      // 1. check whether the changed key is relevant
      Collection<SpringValue> targetValues = springValueRegistry.get(beanFactory, key);
      if (targetValues == null || targetValues.isEmpty()) {
        continue;
      }

      // 2. update the value
      for (SpringValue val : targetValues) {
        updateSpringValue(val);
      }
    }
  }
}
```

## 3.3 通过反射的方法注入

```java 
public class SpringValue {
   public void update(Object newVal) throws IllegalAccessException, InvocationTargetException {
       if (isField()) {
         injectField(newVal);
       } else {
         injectMethod(newVal);
       }
     }
    private void injectField(Object newVal) throws IllegalAccessException {
       Object bean = beanRef.get();
       if (bean == null) {
         return;
       }
       boolean accessible = field.isAccessible();
       field.setAccessible(true);
       field.set(bean, newVal);
       field.setAccessible(accessible);
     }
}
```

非常简单，高效。相比使用@RefreshScope是不是清爽多了呢?
