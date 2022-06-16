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
title: FactoryBean接口实例化
category: Spring
image:
---

![文章头](https://img.springlearn.cn/eaf9d1d2bf5c8df466b3376235db919a.jpg)


> Java编程规范中声明,Java接口类是不能直接实例化的,但是我们在平时的开发中经常会遇到只声明接口就可以直接使用的。

eg:

1. Mybatis中只用使用`@MapperScan`声明要扫描的Mapper接口类就可以直接从Spring中获取使用,进行操作数据库
2. Dubbo中只要用Dubbo提供的`@Service`注解,同样可以直接从Spring中获取使用进行远程调用。


**那么以上这些功能在Spring中是如何实现的呢?**

由此就引出本篇主要介绍的接口`FactoryBean`
```java

public interface FactoryBean<T> {
    @Nullable
    T getObject() throws Exception;

    @Nullable
    Class<?> getObjectType();

    default boolean isSingleton() {
        return true;
    }
}
```
在Spring中当发现一个Bean的类型是`FactoryBean`,此时实例化时候就会执行,该对象的`getObject()`方法从而来进行实例化。那么如何获取真实`FactoryBean`呢?只需要在实例化的Bean的name前面加`&`符号才是获取真正`FactoryBean`的实例对象。


Java编程规范中声明,Java接口类是不能直接实例化的,Spring实现接口的实例化操作,本质上只是调用`FactoryBean`的`getObject()`方法,而真正的实例化操作,还是有开发者来实现的。以我们常见的使用框架为例。`MyBatis` and `Dubbo`

- MyBatis中实现FactoryBean的类`MapperFactoryBean`
- Dubbo中实现FactoryBean的类`ReferenceBean`

在此我们以MyBatis为例,讲述MyBatis是如何实现FactoryBean来实现接口实例化操作的。
对Spring的源码有研究的同学知道,在Spring中Bean的读取会生成BeanDefinition对象,实例化实际就是找到Bean对象的BeanDefinition对象,然后根据
BeanDefinition信息来实例的。那么在这里我们首先要看下MyBatis是如何为接口生成BeanDefinition对象的吧。

我们一起看下`ImportBeanDefinitionRegistrar`接口。ImportBeanDefinitionRegistrar接口就是允许开发者来根据开发者的规则来生成BeanDefinition的并注册到`BeanDefinitionRegistry`中。因为Spring默认是根据自己的规则去生成BeanDefinition的，但是这里也提供了一个切口,供开发者使用。
```java

public interface ImportBeanDefinitionRegistrar {
    public void registerBeanDefinitions(
            AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry);
}
```

MyBatis中`MapperScannerRegistrar`实现了`ImportBeanDefinitionRegistrar`。扫描Mapper接口所在的包,为每个接口生成特定的BeanDefinition
#### MapperScannerRegistrar
```java
 public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
    //扫描Mapper接口所在的包
    AnnotationAttributes annoAttrs = AnnotationAttributes.fromMap(importingClassMetadata.getAnnotationAttributes(MapperScan.class.getName()));
    ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
    ....
    //为每个接口生成特定的BeanDefinition 
    scanner.doScan(StringUtils.toStringArray(basePackages));
  }
```

### ClassPathMapperScanner

在doScan方法为每个标记的Mapper接口生成一个BeanName。而实例化工厂都指定为`MapperFactoryBean`。只用调用其`getObject()`方法即可完成接口的实例化。
```java
public Set<BeanDefinitionHolder> doScan(String... basePackages) {
    Set<BeanDefinitionHolder> beanDefinitions = super.doScan(basePackages);

    if (beanDefinitions.isEmpty()) {
      logger.warn("No MyBatis mapper was found in '" + Arrays.toString(basePackages) + "' package. Please check your configuration.");
    } else {
      //开始配置自己的规则
      processBeanDefinitions(beanDefinitions);
    }

    return beanDefinitions;
  }
  private void processBeanDefinitions(Set<BeanDefinitionHolder> beanDefinitions) {
    GenericBeanDefinition definition;
    for (BeanDefinitionHolder holder : beanDefinitions) {
      definition = (GenericBeanDefinition) holder.getBeanDefinition();
      //设置每个Bean的工厂类，MapperFactoryBean
      definition.setBeanClass(this.mapperFactoryBean.getClass());
      ...
    }
  }
}
```

我们举一个例子
```
@Mapper
public interface TUserMapper {

    int insert(TUser record);

    List<TUser> selectAll();

    TUser selectOne(@Param("id") Integer id);

    TUser selectByName(@Param("name") String name);
}
```
这里BeanDefinition的名字就是`TUserMapper`，而工厂方法就是`MapperFactoryBean`。如下伪代码,getBean("TUserMapper"),就是调用`MapperFactoryBean.getObject()`,而`getBean("&TUserMapper")`才是获取`MapperFactoryBean`的实例。


```
    @Test
    public void factoryBeanTest(){
        System.out.println(applicationContextTools.getApp().getBean("&TUserMapper"));
        //org.mybatis.spring.mapper.MapperFactoryBean@3ab6678b
    }
```


### 我们如何定制自己的解析的注解呢?

编写一个类似于`MapperScan`的注解类,`MyMapperScan`。

**注意:** 自定义的注解只能声明在配置类上才有效，配置类就是一定要被`@Configuration`修饰。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(MyMapperScannerRegistrar.class)
public @interface MyMapperScan {
    String value();
}

public class MyMapperScannerRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        AnnotationAttributes annoAttrs = AnnotationAttributes.fromMap(importingClassMetadata.getAnnotationAttributes(MyMapperScan.class.getName()));
        String value = annoAttrs.getString("value");
        System.out.println(value);
        System.out.println("配置类:"+importingClassMetadata.getClassName());
    }
}
```

#### 验证

```
@Configuration
@MyMapperScan(value = "ConfigBean")
public class ConfigBean {
}

@SpringBootApplication //被@Configuration修饰就等同于配置类
@MyMapperScan(value = "test")
@MapperScan(value = "orm.example.dal.mapper")
public class LxchinesszzMybatisStudyApplication {
    public static void main(String[] args) {
        new SpringApplicationBuilder().web(WebApplicationType.NONE).run(args);
    }

}

ConfigBean
配置类:orm.example.ConfigBean
test
配置类:orm.example.LxchinesszzMybatisStudyApplication
```
