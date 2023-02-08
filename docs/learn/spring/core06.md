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
title: 第06篇:AOP面向切面编程
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

## 一、前言

> 面向切面编程 (AOP) 通过提供另一种思考程序结构的方式来补充面向对象编程 (OOP)。

OOP 中模块化的关键单元是类，而 AOP 中模块化的单元是切面。切面支持跨多种类型和对象的关注点（例如事务管理）的模块化。（这种关注点在 AOP 文献中通常被称为“横切”关注点。）

Spring 的关键组件之一是 AOP 框架。虽然 Spring IoC 容器不依赖 AOP（这意味着如果您不想使用 AOP，则无需使用 AOP），AOP 补充了 Spring IoC 以提供非常强大的中间件解决方案。


AOP 在 Spring Framework 中用于：

1. 提供声明式事务管理。（TransactionalRepositoryProxyPostProcessor#postProcess）
2. 让用户实现自定义切面，用 AOP 补充他们对 OOP 的使用。
    - 常用于接口日志打印
    - 或是基于接口的权限校验、数据预处理等操作


下面我们就学习下spring中aop的用法, 不用死记硬背, 了解收藏, 遇到会用即可。

## 二、AOP的概念

## 2.1 Aspect 切面

Aspect: 方面、切面,如果说oop是看整体,那么aop就是看一个面。

Spring 提供两种使用方法,1是基于注解方式, 2是基于配置方式。

### 2.1.1 注解方式

Spring会从被@Aspect修饰的类中读取切面信息,为符合条件的对象生成代理类。

```java
@Aspect
public class NotVeryUsefulAspect {}
```

### 2.1.2 xml方式

```xml
<aop:config>
    <aop:aspect id="myAspect" ref="aBean">
        ...
    </aop:aspect>
</aop:config>

<bean id="aBean" class="...">
    ...
</bean>
```

因为目前使用SpringBoot的较多,使用配置的方式的比较少,本文也只介绍使用注解方式。如果想了解xml配置方式,可以参考官方文档。

## 2.2 Join point 连接点

Join point(连接点)：程序执行过程中的一个点，例如方法的执行或异常的处理。在 Spring AOP 中，一个连接点总是代表一个方法执行。

![](https://img.springlearn.cn/blog/e05790e9d53efc94f952730851f7f669.png)

- JoinPoint 基类方法，可以获取如下信息。
- ProceedingJoinPoint 公开proceed(..)方法，以支持@AJ方面的around通知


我们可以通过连接点来获取当前执行的方法的信息,具体如下。

### 2.2.1 接口声明

```java
public interface JoinPoint {
    // 当前执行的切面,或者说是拦截的方法
    String toString();
    // 连接点的缩写字符串表示形式。
    String toShortString();
    // 连接点的扩展字符串表示形式。
    String toLongString();
    // 返回当前正在执行的对象。这将始终与@this切入点指示符匹配的对象相同。
    // 除非您特别需要这种反射访问，否则您应该使用this切入点指示符来获取该对象，
    // 以获得更好的静态类型和性能。 当当前没有可用的执行对象时返回null。
    // 这包括在静态上下文中出现的所有连接点。
    // 当前正在执行的对象(如果不可用则为空——例如静态上下文)
    Object getThis();
    // 返回目标对象。这将始终与目标切入点指示符匹配的对象相同。
    Object getTarget();
    // 这个连接点上的参数
    Object[] getArgs();
    // 连接的执行方法签名,可以获取到执行的方法
    Signature getSignature();
    // 源代码信息，比如获取执行的行，列，文件名。
    SourceLocation getSourceLocation();
    // 当前的拦击的类型。
    String getKind();
    // 封装此连接点的静态部分的对象。
    StaticPart getStaticPart();
}    
```

### 2.2.2 实践

```java
@Component
public class AopDemoService {

    public void say(String name) {
        System.out.println("AopDemoService Say:" + name);
    }
}

@Aspect
@Component
public class AspectManager {

    @Before(value = "within(AopDemoService)")
    public void beforeArgs(JoinPoint joinPoint) {
        System.out.println("拦截器逻辑----------------------------");
        // execution(void learn.spring.aop.AopDemoService.say(String))
        System.out.println(joinPoint.toString());
        // execution(AopDemoService.say(..))
        System.out.println(joinPoint.toShortString());
        // execution(public void learn.spring.aop.AopDemoService.say(java.lang.String))
        System.out.println(joinPoint.toLongString());
        // method-execution
        System.out.println(joinPoint.getKind());
        // [Jay]
        System.out.println(Arrays.toString(joinPoint.getArgs()));
        // learn.spring.aop.AopDemoService@73c9e8e8
        System.out.println(joinPoint.getTarget());
        // learn.spring.aop.AopDemoService@73c9e8e8
        System.out.println(joinPoint.getThis());
        // void learn.spring.aop.AopDemoService.say(String)
        System.out.println(joinPoint.getSignature());
        // execution(void learn.spring.aop.AopDemoService.say(String))
        System.out.println(joinPoint.getStaticPart());
        // org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint$SourceLocationImpl@582a764a
        System.out.println(joinPoint.getSourceLocation());
        System.out.println("拦截器逻辑----------------------------");
    }

}


```

## 2.3 Advice 通知

通过使用 Advice通知,我们可以在方法执行的各个阶段植入我们的自定义代码。具体有哪些通知呢？可以参考下文。

注解 | 说明
---|---
@Before | 前置通知, 在方法执行之前执行
@After | 后置通知, 在方法执行之后执行
@AfterRunning | 返回通知 在方法返回结果之后执行
@AfterThrowing | 异常通知在方法抛出异常之后
@Around | 环绕通知, 围绕着方法执行

### 2.3.1  Before Advice

通过前置请求,我们可以获取请求参数和请求方法等信息。
在连接点之前运行但不能阻止执行流继续到连接点的通知（除非它抛出异常）。

```java
@Aspect
@Component
public class AspectManager {
    @Before(value = "within(AopDemoService)")
    public void beforeArgs(JoinPoint joinPoint) {
        System.out.println("拦截器逻辑----------------------------");
        System.out.println(joinPoint.toString());
        System.out.println(joinPoint.toShortString());
        System.out.println(joinPoint.toLongString());
        System.out.println(joinPoint.getKind());
        System.out.println(Arrays.toString(joinPoint.getArgs()));
        System.out.println(joinPoint.getTarget());
        System.out.println(joinPoint.getThis());
        System.out.println(joinPoint.getSignature());
        System.out.println(joinPoint.getStaticPart());
        System.out.println(joinPoint.getSourceLocation());
        System.out.println("拦截器逻辑----------------------------");
    }
}
```

### 2.3.2  After Advice

在连接点正常完成后运行的通知（例如，如果方法返回而没有引发异常）。【注意如果方法异常,则不执行】
@After注释声明的方法,会在连接方法执行退出时(finally)执行。所以必须准备好处理正常和异常返回条件。它通常用于释放资源和类似的目的。下面的例子展示了如何使用after finally advice:

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.After;

@Aspect
public class AfterFinallyExample {

    @After("com.xyz.myapp.CommonPointcuts.dataAccessOperation()")
    public void doReleaseLock() {
        // ...
    }
}
```

### 2.3.3  AfterRunning Advice

无论连接点以何种方式退出（正常或异常返回），都将运行建议。

有时，您需要在通知体中访问返回的实际值。你可以使用@ afterreturns的形式绑定返回值来获得访问权限，如下例所示:

返回属性中使用的名称必须与advice方法中的参数名称对应。当方法执行返回时，返回值作为对应的参数值传递给advice方法。返回子句还将匹配限制为仅那些返回指定类型值的方法执行(在本例中为Object，它匹配任何返回值)。

请注意，在返回advice之后使用时，不可能返回一个完全不同的引用。

```java
@Aspect
@Component
public class AopArgsMatchProcessor {

    @AfterReturning(value = "within(Person) && args(name,age)", returning = "retValue")
    public void beforeArgs(Integer age, String name, String retValue) {
        System.out.println("拦截器逻辑----------------------------");
        System.out.println("入参name:" + name);
        System.out.println("入参age:" + age);
        System.out.println("返回值:" + value);
        System.out.println("拦截器逻辑----------------------------");
    }
}
```

### 2.3.4 AfterThrowing Advice

如果方法因抛出异常而退出，则运行。

当匹配的方法执行通过抛出异常退出时，将运行通知。你可以使用@ afterthrows注释来声明它，如下面的例子所示:

通常，您希望仅在抛出给定类型的异常时才运行通知，而且通常还需要在通知主体中访问抛出的异常。您可以使用throw属性来限制匹配(如果需要，则使用Throwable作为异常类型)，并将抛出的异常绑定到通知参数。下面的例子展示了如何做到这一点:

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.AfterThrowing;

@Aspect
public class AfterThrowingExample {

    @AfterThrowing(
        pointcut="com.xyz.myapp.CommonPointcuts.dataAccessOperation()",
        throwing="ex")
    public void doRecoveryActions(DataAccessException ex) {
        // ...
    }
}
```

### 2.3.5  Around Advice

Around Advice: 环绕通知

Around通知在匹配方法的执行过程中“绕”运行。它有机会在方法运行之前和之后都做一些工作，并决定什么时候、如何，甚至是否真的要运行方法。如果您需要以线程安全的方式在方法执行前后共享状态(例如，启动和停止计时器)，则经常使用Around通知。

环绕通知可以在方法调用之前和之后执行自定义行为。它还负责选择是继续到连接点还是通过返回自己的返回值或抛出异常来缩短建议的方法执行。

```java
    @Around("controllerLog()&& @annotation(logAnnotation)")
    public Object doAround(ProceedingJoinPoint joinPoint, ApiOperation logAnnotation) {
        try {
            Long startTime = this.doBefore(joinPoint, logAnnotation);
            Object result = joinPoint.proceed();
            this.doAfterReturning(result, logAnnotation, startTime);
            return result;
        } catch (Throwable var5) {
            return this.doAfterThrowingAdvice(joinPoint, logAnnotation, var5);
        }
    }
```

## 2.4 Pointcut 切面表达式

切面,Pointcut 配合 Advice 才有用, Advice只有在遇到Pointcut指定的类或者方法上才会执行。spring中Pointcut提供了灵活的匹配表达式。我们日常中最常用的就是 `execution` ,但是实际上匹配表达式还包含了很多的注解。如下图表格。这些你都见过吗?

注解 | 说明
---|---
within | 拦截指定类及指定包下所有的类
@within | 拦截被指定注解修饰的类
this | 拦截指定的类型
bean | 执行的bean中，支持模糊匹配 `*Service`
args | 拦截指定参数类型的方法，同时可以传递参数
@annotation | 拦截带指定注解的方法
@args | 拦截方法入参被中@args指定的注解(入参只能有一个)
@target | 拦截方法被指定注解修饰的方法
execution | 表达式详情见下文

这里先做简单的介绍,因为内容较多,更多的实践见下文,三,切面表达式最佳实践。

### 2.4.1 注解匹配

凡是带@符号的，都是用来匹配注解的，如下，这些注解，可以用来匹配注解修饰的: 类，方法，参数.

- @within，拦截被指定注解，修饰的类

如下 `AopDemoService` 被 `@CustomerAnnotation` 修饰,所以就可以使用 `@within` 匹配到。

```java
@Component
@CustomerAnnotation
public class AopDemoService {
    public void say(String name) {
        System.out.println("AopDemoService Say:" + name);
    }
    public void sayAge(Integer age) {
        System.out.println("AopDemoSerCue sayAge:" + age);
    }
    public void sayPerson(Person person) {
        System.out.println("AopDemoSerCue Person:" + person);
    }
}
@Aspect
@Component
public class AspectConfig {
    @After(value = "@within(CustomerAnnotation)")
    public void matchAnno() {
        System.out.println("CustomerAnnotation @within 修饰类");
    }
}    

```
- @target，跟@within是一样的,功能。不同的是,@within会把被注解标记的目标对象及其子类的方法都进行拦截,而@target只会拦截目标对象。
- @annotation，拦截被指定注解，修饰的方法
```java
@Aspect
@Component
public class AspectConfig {
    @After(value = "within(AopDemoService) && @annotation(CustomerAnnotation)")
    public void matchAnnoAn() {
        System.out.println("CustomerAnnotation @target 任意连接点");
    }
}
@Component
public class AopDemoService {
    @CustomerAnnotation
    public void say(String name) {
        System.out.println("AopDemoService Say:" + name);
    }
}
```
- @args，拦截方法入参被中@args指定的注解

如下 Person 被 `@CustomerAnnotation` 修饰,故可以使用 `@args` 匹配到

```java
@CustomerAnnotation
public class Person {
}
@Component
public class AopDemoService {
    public void sayPerson(Person person) {
        System.out.println("AopDemoSerCue Person:" + person);
    }
}
@Aspect
@Component
public class AspectConfig {
    @Before(value = "this(AopDemoService) &&  @args(customerAnnotation)")
    public void matchAnno1(CustomerAnnotation customerAnnotation) {
        System.out.println("CustomerAnnotation @args 修饰方法参数");
    }
}
```

### 2.4.2 参数传递

使用 `args` 可以将参数进行传递。如下。

```java
@Component
public class AopDemoService {
    public void sayPerson(Person person, Integer count) {
        System.out.println("AopDemoSerCue " + count + "Person:" + person);
    }
}
@Aspect
@Component
public class AspectConfig {
    // args中是变量名,会自动从当前方法的入参中找到这个变量名对应的实际类型。
    @After(value = "within(AopDemoService) && args(person,age,..)")
    public void args(Person person, Integer age) {
        System.out.println("指定匹配参数");
    }
}    
```

## 2.5 Target object 目标、代理类

一个或多个切面建议的对象。也称为“目标对象”。由于 Spring AOP 是使用运行时代理实现的，因此该对象始终是代理对象。

```java
public abstract class AbstractAdvisingBeanPostProcessor extends ProxyProcessorSupport implements BeanPostProcessor {

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
      ...
      if (isEligible(bean, beanName)) {
        ProxyFactory proxyFactory = prepareProxyFactory(bean, beanName);
        if (!proxyFactory.isProxyTargetClass()) {
          evaluateProxyInterfaces(bean.getClass(), proxyFactory);
        }
        proxyFactory.addAdvisor(this.advisor);
        customizeProxyFactory(proxyFactory);
        return proxyFactory.getProxy(getProxyClassLoader());
      }

      // No proxy needed.
      return bean;
    }
}
```

## 2.6 AOP proxy 代理工具

由 AOP 框架创建的对象。在 Spring Framework 中，AOP 代理是 JDK 动态代理或 CGLIB 代理。

我们可以使用下面这段代码, 来生成代理类, 而具体是用jdk还是cglib这些就交给底层自己去选择。更多的实践, 看下文。

```java
    @Test
    public void testProxy() throws Exception {
        AopTest aopTest = new AopTest();
        ProxyFactory proxyFactory = new ProxyFactory(aopTest);
      
        proxyFactory.addAdvisor(defaultPointcutAdvisor);
        proxyFactory.setExposeProxy(true);
        AopTest proxy = (AopTest) proxyFactory.getProxy();
        proxy.test();
    }
```

以上是spring aop的主要

## 三、切面表达式最佳实践

以下代码,全部已上传仓库: `https://github.com/lxchinesszz/spring-learning`

## 3.1 within

### 3.1.1 API说明

1. 精确匹配类名
2. 模糊匹配包中所有的类
3. 模糊匹配包中所有的带Impl后缀的

### 3.1.2 目录

```
└── WithinMatchProcessor
    ├── AopWithinMatchProcessor.java
    ├── CokeImpl.java
    ├── Water.java
    └── readme.md
```

### 3.1.3 拦截代码

```java
@Aspect
@Component
public class AopWithinMatchProcessor {

    /**
     * 精确匹配类名
     */
    @Pointcut("within(spring.learning.aop.WithinMatchProcessor.Water)")
    private void matchClassName() {
    }

    /**
     * 模糊匹配包中所有的类
     */
    @Pointcut("within(spring.learning.aop.WithinMatchProcessor.*)")
    private void matchAllClassFromPackage() {
    }

    /**
     * 模糊匹配包中所有的带Impl后缀的
     */
    @Pointcut("within(spring.learning.aop.WithinMatchProcessor.*Impl)")
    private void matchClassFromPackage() {
    }


    @Before("matchClassName()")
    public void beforeMatchClassName() {
        System.out.println("--------精确匹配类名-------");
    }

    @Before("matchAllClassFromPackage()")
    public void beforeMatchAllClassFormPackage() {
        System.out.println("--------模糊匹配包中所有的类-------");
    }

    @Before("matchClassFromPackage()")
    public void beforeMatchClassFromPackage() {
        System.out.println("--------模糊匹配包中所有的带Impl后缀的-------");
    }


}

```

## 3.2 @within

### 3.2.1 API说明

拦截被指定注解标注的类

### 3.2.2 目录

```
├── AnnotationWithinMatchProcessor
│   ├── AopAnnotationWithinMatchProcessor.java
│   ├── Log.java
│   ├── Sprite.java
│   └── readme.md

```

### 3.2.3 拦截代码

```java
@Log(tag = "SpriteLog")
@Component
public class Sprite {

    public void drink() {
        System.out.println("空参数");
    }

    public void drink(Integer age) {
        System.out.println("age");
    }


    public String name() {
        return "Sprite.name";
    }

    public void toCalculate() throws Exception {
        System.out.println(0 / 0);
    }
}

@Aspect
@Component
public class AopAnnotationWithinMatchProcessor {


    /**
     * 注意可以将注解,放到参数中,此时@within()会将参数入参名去找到注解的类型
     * 凡是被Log标记的类,都会被拦截
     *
     * @param spriteLog 注解
     */
    @Before("@within(spriteLog)")
    public void beforeAnnotationMatch(Log spriteLog) {
        System.out.println("--------拦截被Log修饰类的所有方法" + spriteLog.tag() + "-------");
    }


    /**
     * 返回值
     *
     * @param value     返回值
     * @param spriteLog 注解
     */
    @AfterReturning(value = "@within(spriteLog)", returning = "value")
    public void afterReturningAnnotationMatch(String value, Log spriteLog) {
        System.out.println("afterReturningAnnotationMatch返回值:" + value + ",注解:" + spriteLog);
    }

    /**
     * 拦截异常
     *
     * @param e         异常
     * @param spriteLog 拦截日志
     */
    @AfterThrowing(value = "@within(spriteLog)", throwing = "e")
    public void AfterThrowingAnnotationMatch(Exception e, Log spriteLog) {
        System.out.println(e.getMessage());
    }

}
```

## 3.3 this

### 3.3.1 API说明

拦截指定的类

### 3.3.2 目录

```
├── ThisMatchProcessor
│   ├── AopThisMatchProcessor.java
│   ├── ThisPerson.java
│   └── readme.md

```

### 3.3.3 拦截代码

```java
@Aspect
@Component
public class AopThisMatchProcessor {

    @Before(value = "this(ThisPerson)")
    public void thisMatch() {
        System.out.println("--------------ThisPerson------------");
    }
}

```

## 3.4 args

### 3.4.1 API说明

```java
@Component
public class Person {

    public String info(String name) {
        return "姓名：" + name;
    }

    public String info(String name, Integer age) {
        return "姓名：" + name + ",年龄:" + age;
    }
}
```
Person类中有两个info方法,但是入参不一样,假如要拦截指定入参的方法时候,就可以使用args

### 3.4.2 目录

```
├── ArgsMatchProcessor
│   ├── AopArgsMatchProcessor.java
│   ├── Person.java
│   └── readme.md
```

### 3.4.3 拦截代码

可以看到args 和 within可以通过&&来进行,联合匹配。另外可以通过returning方法指定方法的返回值。但是注意，类型要和要拦截的方法的返回类型匹配。否则会报错。

```java
@Aspect
@Component
public class AopArgsMatchProcessor {

    @AfterReturning(value = "within(Person) && args(name,age)", returning = "value")
    public void beforeArgs(Integer age, String name, String value) {
        System.out.println("拦截器逻辑----------------------------");
        System.out.println("入参name:" + name);
        System.out.println("入参age:" + age);
        System.out.println("返回值:" + value);
        System.out.println("拦截器逻辑----------------------------");
    }
}
```

## 3.5 @annotation

### 3.5.1 API说明

拦截被指定注解标记的方法。

### 3.5.2 目录

```
├── AnnotationMethodMatchProcessor
│   ├── AopAnnotationMethodMatchProcessor.java
│   ├── LogMethod.java
│   └── Main.java

```

### 3.5.3 代码

```java
@Aspect
@Component
public class AopAnnotationMethodMatchProcessor {


    @Before(value = "@annotation(logMethod) && args(args)")
    public void annotationMethodMatch(LogMethod logMethod, String args) {
        System.out.println("注解方法匹配");
    }
}
```

## 3.6 @args

### 3.6.1 API说明

拦截方法中入参被@args指定注解的方法。

### 3.6.2 目录

```
├── AnnotationArgsMatchProcessor
│   ├── AopAnnotationArgsMatchProcessor.java
│   ├── Apple.java
│   ├── Fruit.java
│   ├── Orange.java
│   └── Teacher.java
```

### 3.6.3 代码

注意当出现以下异常说明aop声明的拦截范围太广泛了，导致了一些不能拦截的类被拦截从而报错了，此时只用缩小拦截的范围即可
```
 Cannot subclass final class org.springframework.boot.autoconfigure.AutoConfigurationPackages$BasePackages
 ```

缩小拦截范围如下使用this拦截指定类型

```java
@Aspect
@Component
public class AopAnnotationArgsMatchProcessor {

    @Before(value = "@args(fruit) && this(Teacher)")
    public void annotationMethodMatch(Fruit fruit) {
        System.out.println("拦截被Fruit+tag:"+fruit.tag());
    }
}

```

## 3.7 execution

### 3.7.1 API说明

execution()是最常用的切点函数，其语法如下所示：

`execution(<修饰符模式>? <返回类型模式> <方法名模式>(<参数模式>) <异常模式>?) 除了返回类型模式、方法名模式和参数模式外，其它项都是可选的`



表达式 | 说明
---|---
execution(public * *(..)) | 匹配所有目标类的public方法
execution(* *Test(..)) | 匹配目标类所有以To为后缀的方法
execution(*spring.learning.Water.*(..)) | 匹配Water接口所有方法
execution(*spring.learning.Water+.*(..)) | 匹配Water接口以及实现类中所有方法(包括Water接口中没有的方法)
execution(* spring.learning.*(..))| 匹配spring.learning包下所有的类所有方法
execution(* spring.learning..*(..))| 匹配spring.learning包及其子孙包下所有的类所有方法
execution(* spring..*.*Dao.find*(..))|匹配包名前缀为spring的任何包下类名后缀为Dao的方法，方法名必须以find为前缀
execution(* info(String,Integer)) | 匹配info方法中,第一个参数是String,第二个Integer的方法
execution(* info(String,*))) | 匹配info方法中,第一个参数是String,第二个任意类型
execution(* info(String,..))) | 匹配info方法中,第一个参数是String,后面任意参数
execution(* info(Object+))) | 匹配info方法中,方法拥有一个入参，且入参是Object类型或该类的子类

## 四、编程式AOP

spring的aop功能如此强大, 难道只能用来写业务吗? 相信如果你要用aop这么灵活的东西来写业务代码，一定会被喷的。
因为太灵活了, 如果你不说，可能没人会发现，哎这块代码竟然有一个植入了切面逻辑。

![](https://img.soogif.com/jI6uiyFLIYMscPWSlfL3TlYupYUQmAMg.gif?scope=mdnice)

所以我们学习这么多的, 终极目的是做中间件的开发, 这么强大的功能, 不好好利用,那不是亏了吗。就比如说aop,
这不就是java代理的增强吗? 要你自己做代理，你还要兼容jdk和cglib的场景，我们直接用spring的aop模块它不香吗?

所以下面我们学习如果编程是使用spring的aop能力。

```java
ProxyFactory factory = new ProxyFactory(myBusinessInterfaceImpl);
factory.addAdvice(myMethodInterceptor);
factory.addAdvisor(myAdvisor);
MyBusinessInterface tb = (MyBusinessInterface) factory.getProxy();
```

## 4.1 Advice 通知

这种方法就跟代理一样，advice就好比jdk代理中的 `InvocationHandler`，是否需要执行，要看拦截器中如何处理。

- `ProxyFactory proxyFactory = new ProxyFactory(aopTest)`
- `proxyFactory.addAdvice()`

注意这种方法获取的代理类是针对所有的代理对象的方法。如果你想使用匹配的方式去精确的制定要连接那个方法，就不要这样使用。你要用 `Advisor`。

```java
    @Test
    public void test1() throws Exception {
        AopTest aopTest = new AopTest();
        // 原始对象hashCode:124407148
        System.out.println("原始对象hashCode:" + aopTest.hashCode());
        ProxyFactory proxyFactory = new ProxyFactory(aopTest);
        proxyFactory.addAdvice(new MethodBeforeAdvice() {
            @Override
            public void before(Method method, Object[] args, Object target) throws Throwable {
                System.out.println(method.getName() + "开始执行前");
            }
        });
        proxyFactory.addAdvice(new MethodInterceptor() {
            @Override
            public Object invoke(MethodInvocation invocation) throws Throwable {
                System.out.println(invocation.getMethod().getName() + "真正开始执行");
                return invocation.proceed();
            }
        });
        AopTest proxy = (AopTest) proxyFactory.getProxy();
        // 代理对象hashCode:-487413954
        System.out.println("代理对象hashCode:" + proxy.hashCode());
        TargetSource targetSource = proxyFactory.getTargetSource();
        // 获取原始对象hashCode:124407148
        System.out.println("获取原始对象hashCode:" + targetSource.getTarget().hashCode());
        // test开始执行前
        // test真正开始执行
        // test
        proxy.test();
    }
```

## 4.2 Advisor

Advisor 是支持切面匹配的, 通过设置切入点,来生成代理类。我们只用向 `DefaultPointcutAdvisor` 设置你的切面匹配器和 `Advice` 就行。如下。

```java
DefaultPointcutAdvisor defaultPointcutAdvisor = new DefaultPointcutAdvisor();
defaultPointcutAdvisor.setPointcut(new NameMatchMethodPointcut());
defaultPointcutAdvisor.setAdvice(...);
```

如果我们想自定义切面,那么只用实现这个切面的方法

```java
public interface Pointcut {

	/**
	 * Return the ClassFilter for this pointcut.
	 * @return the ClassFilter (never {@code null})
	 */
	ClassFilter getClassFilter();

	/**
	 * Return the MethodMatcher for this pointcut.
	 * @return the MethodMatcher (never {@code null})
	 */
	MethodMatcher getMethodMatcher();
}
```

当然spring中给我们提供了很多可用的工具,但是为了加深大家的体感，这里我们就自定一个切面处理类吧。如下实例。


```java
  DefaultPointcutAdvisor defaultPointcutAdvisor = new DefaultPointcutAdvisor();
        defaultPointcutAdvisor.setPointcut(new Pointcut() {
            @Override
            public ClassFilter getClassFilter() {
                // 类都匹配
                return ClassFilter.TRUE;
            }

            @Override
            public MethodMatcher getMethodMatcher() {
                return new MethodMatcher() {
                    @Override
                    public boolean matches(Method method, Class<?> targetClass) {
                        return method.getName().equals("test007");
                    }

                    @Override
                    public boolean isRuntime() {
                        return false;
                    }

                    @Override
                    public boolean matches(Method method, Class<?> targetClass, Object... args) {
                        return method.getName().equals("test007");
                    }
                };
            }
        });
        defaultPointcutAdvisor.setAdvice(new MethodInterceptor() {
            @Override
            public Object invoke(MethodInvocation invocation) throws Throwable {
                System.out.println(invocation.getMethod().getName() + "真正开始执行");
                return invocation.proceed();
            }
        });
```

如果你绝的麻烦你也可以直接使用spring提供的切面工具。比如我们可以使用方法匹配工具。

```java
        DefaultPointcutAdvisor defaultPointcutAdvisor = new DefaultPointcutAdvisor();
        NameMatchMethodPointcut nameMatchMethodPointcut = new NameMatchMethodPointcut();
        nameMatchMethodPointcut.setMappedName("test007");
        nameMatchMethodPointcut.setClassFilter(ClassFilter.TRUE);
        defaultPointcutAdvisor.setPointcut(nameMatchMethodPointcut);
```

然后执行下面代码获取代理类对象。

```java
    @Test
    public void test2() throws Exception {
        AopTest aopTest = new AopTest();
        ProxyFactory proxyFactory = new ProxyFactory(aopTest);
      
        proxyFactory.addAdvisor(defaultPointcutAdvisor);
        proxyFactory.setExposeProxy(true);
        AopTest proxy = (AopTest) proxyFactory.getProxy();
        proxy.test();
        // 只拦截test007
        proxy.test007();
    }
```

像这样的工具还有非常的多,毕竟Spring中切面非常的灵活,所以工具就非常的多。这个没比较都一一都掌握,了解就行。方便以后我们自己造轮子使用。但是如果你想了解的话,那就敬请期待下一课堂吧。

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)

