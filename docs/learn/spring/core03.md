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
title: 第03篇:Validation参数校验
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---
![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)


## 一、前言

数据校验是任何开发情况下都不能避免的逻辑, 在实际的业务中往往我们会通过在业务中去前置校验我们需要使用的数据。代码可能是这样的。

```java
  public void saveUser(User user) {
        // 前置校验
        if (Objects.isNull(user)) {
            throw new RuntimeException("user 不能为空");
        }
        if (StringUtils.isBlank(user.getName())) {
            throw new RuntimeException("userName 不能为空");
        }
        if (Objects.isNull(user.getAge()) || user.getAge() <= 0 || user.getAge() > 120) {
            throw new RuntimeException("age 非法");
        }
        if (Objects.isNull(user.getAddress())) {
            throw new RuntimeException("address 不能为空");
        }
        // 数据保存
        doSave(user);
    }
```

但是其实,Spring Framework 提供对 Java Bean Validation API 的支持。我们完全可以使用Spring提供的能力。如果使用Spring的能力,我们的代码就会变成下面这样。

```java
@Data
@ToString
public class User{

    @NotBlank(message = "name 不能为空")
    @Size(min = 2, max = 120, message = "不能小于2字符,大于120字符")
    private String name;

    @Max(value = 120, message = "年龄不能大于120")
    @Min(value = 0, message = "年龄不能小于0")
    private Integer age;

    @NotEmpty(message = "家庭成员不能为空")
    @Size(max = 4, message = "数量不能超过4个")
    private List<String> membersFamily;

    @NotNull(message = "地址不能为空")
    private Address address;
}

 public void saveUser(@Validated User user) {
        // 数据保存
        doSave(user);
 }
```

本篇我们就是来了解下我们如何借助Spring的能力,来帮助我们减少工作量。

## 二、Java Bean Validation API


Bean Validation 通过约束声明和 Java 应用程序的元数据提供了一种通用的验证方式。要使用它，您可以使用声明性验证约束来注释域模型属性，然后由运行时强制执行。有内置约束，您也可以定义自己的自定义约束。

以下示例，该示例显示了一个PersonForm具有两个属性的简单模型：

```java
public class PersonForm {
    private String name;
    private int age;
}
```

Bean Validation 允许您声明约束，如以下示例所示：

```java
public class PersonForm {

    @NotNull
    @Size(max=64)
    private String name;

    @Min(0)
    private int age;
}
```

一个 Bean Validation 验证器然后根据声明的约束来验证这个类的实例。

下面一起来学习下如何正确使用。

## 2.1 配置 Bean 验证提供程序


Spring 为 Bean Validation API 提供全面支持，包括将 Bean Validation 提供者引导为 Spring bean。这使您可以在应用程序中注入一个 javax.validation.ValidatorFactory或任何需要验证的位置。javax.validation.Validator

您可以使用LocalValidatorFactoryBean 默认验证器配置为 Spring bean，如以下示例所示：

```java
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class AppConfig {

    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
}
```


```xml
        <dependency>
            <groupId>org.hibernate.validator</groupId>
            <artifactId>hibernate-validator</artifactId>
        </dependency>
```


## 2.2 注入验证器

除了使用 `@Validated` 注解修饰外，我们还能通过硬编码来使用,比如我们直接注入一个验证器。

>LocalValidatorFactoryBean实现javax.validation.ValidatorFactory 和 javax.validation.Validator以及 Spring 的org.springframework.validation.Validator. 您可以将对这些接口中的任何一个的引用注入到需要调用验证逻辑的 bean 中。

javax.validation.Validator如果您更喜欢直接使用 Bean Validation API，您可以注入一个引用，如以下示例所示

```java
import javax.validation.Validator;

@Service
public class MyService {

    @Autowired
    private Validator validator;
}
```


如果您的 bean 需要 Spring Validation API，您可以注入一个引用org.springframework.validation.Validator，如以下示例所示：

```java
import org.springframework.validation.Validator;

@Service
public class MyService {

    @Autowired
    private Validator validator;
}
```

**注意看所依赖的包是不一样哦,因为LocalValidatorFactoryBean都实现这些接口**


## 2.3 内置约束注解

![](https://img.springlearn.cn/blog/cd0bef8bfba2dc0facdc1fe90dad69fa.png)

如果你用的idea可以在右侧找到 `Bean Validation`,这里可以看到内置和我们自定义的约束注解。

下面我们看了默认都支持那些校验及支持的数据类型。

|注解|说明|支持类型|
|:--|:--|:--|
|@Size|带注释的元素大小必须在指定边界（包括）之间。|CharSequence、Collection、Map、数组|
|@PositiveOrZero|带注释的元素必须是正数或 0。|BigDecimal、BigInteger、byte ， short ， int ， long ， float ， double和它们各自的包装器，null是被允许的|
|@Positive|带注释的元素必须是严格的正数（即 0 被视为无效值）。|BigDecimal、BigInteger、byte ， short ， int ， long ， float ， double和它们各自的包装器，null是被允许的|
|@Pattern|带注释的CharSequence必须匹配指定的正则表达式。正则表达式遵循 Java 正则表达式约定|接受CharSequence 。 null元素被认为是有效的。|
|@PastOrPresent|注释元素必须是过去或现在的瞬间、日期或时间|java.time.*、Date、java.time.chrono|
|@Past|带注释的元素必须是过去的瞬间、日期或时间|同上|
|@Null|带注释的元素必须为null|接受任何类型。|
|@NotNull|带注释的元素不能为null |接受任何类型。|
|@NotEmpty|带注释的元素不能为null也不能为空|CharSequence、Collection、Map、数组|
|@NotBlank|带注释的元素不能为null ，并且必须至少包含一个非空白字符|CharSequence|
|@NegativeOrZero|带注释的元素必须是负数或 0|BigDecimal、BigInteger、byte ， short ， int ， long ， float ， double和它们各自的包装器，null是被允许的|
|@Negative|带注释的元素必须是严格的负数（即，0 被视为无效值）。|BigDecimal、BigInteger、byte ， short ， int ， long ， float ， double和它们各自的包装器，null是被允许的|
|@Min|带注释的元素必须是一个数字，其值必须大于或等于指定的最小值|BigDecimal、BigInteger、byte ， short ， int ， long ，它们各自的包装器，null是被允许的，不支持double和float |
|@Max|带注释的元素必须是一个数字，其值必须小于或等于指定的最大值。|BigDecimal、BigInteger、byte ， short ， int ， long ，它们各自的包装器，null是被允许的，不支持double和float|
|@FutureOrPresent|注释元素必须是现在或将来的瞬间、日期或时间。|java.time.*、Date、java.time.chrono|
|@Future|带注释的元素必须是未来的瞬间、日期或时间。|java.time.*、Date、java.time.chrono|
|@Email|该字符串必须是格式正确的电子邮件地址|CharSequence|
|@Digits|带注释的元素必须是可接受范围内的数字支持的类型有|BigDecimal、BigInteger、CharSequence、byte 、 short 、 int 、 long以及它们各自的包装类型|
|@DecimalMin|带注释的元素必须是一个数字，其值必须大于或等于指定的最小值。|BigDecimal、BigInteger、CharSequence、byte 、 short 、 int 、 long以及它们各自的包装类型，不支持double和float |
|@DecimalMax|带注释的元素必须是一个数字，其值必须小于或等于指定的最大值。|BigDecimal、BigInteger、CharSequence、byte 、 short 、 int 、 long以及它们各自的包装类型，不支持double和float |
|@AssertTrue|带注释的元素必须为真。|支持的类型是boolean和Boolean，null元素被认为是有效的。|
|@AssertFalse|带注释的元素必须为假|支持的类型是boolean和Boolean |


## 2.4 配置自定义约束

如果前面内置的还不能满足你，那么我们可以自定义一个约束类型。


使用 `@Constraint` 来修饰我们自定义的注解,然后实现 `javax.validation.ConstraintValidator` 约束行为的接口。


以下示例显示了一个自定义@Constraint声明，后跟一个 ConstraintValidator使用 Spring 进行依赖注入的关联实现：

```java
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy=MyConstraintValidator.class)
public @interface MyConstraint {
    // 错误提示语句
    String message() default "";
    // 更加细维度控制是否验证【注意必须是接口】
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

定义自定的验证器

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
public class MyConstraintValidator implements ConstraintValidator<MyConstraint, Address> {

    private MyConstraint myConstraint;

    /**
     * 初始化,会注入注解的信息
     *
     * @param constraintAnnotation annotation instance for a given constraint declaration
     */
    @Override
    public void initialize(MyConstraint constraintAnnotation) {
        this.myConstraint = constraintAnnotation;
    }

    @Override
    public boolean isValid(Address value, ConstraintValidatorContext context) {
        System.out.println("MyConstraint:" + myConstraint);
        System.out.println("MyConstraintValidator:" + value);
        return true;
    }
}
```

如前面的示例所示，实现可以像任何其他 Spring bean 一样ConstraintValidator具有其依赖项。

## 2.5 细维度校验

前面说了如果要自定义注解,有三个必须要的参数.

- message 错误语句
- groups  分组控制【注意必须是接口】
- payload 【有效负载】

下面通过举一个例子,来演示groups和payload究竟有什么用。

举一个例子 `Person` 这个模型,在查询,修改和保存时候都会使用。但是只有保存时候才要求校验，其他场景: 查询和修改都不用校验。那么我们该怎么办呢? 如下代码实例。看如何使用groups来完成这个需求。

### 2.5.1 定义模型

```java
public class Person {

    @NotNull(message = "name不能为空")
    @Size(max = 64, message = "长度不能大于64")
    private String name;

    @Min(0)
    private int age;

    // 地址保存时候必须有值, 其他情况可以为空
    @MyConstraint(message = "address不能为空",groups = Save.class)
    private Address address;

}
```

### 2.5.2 不生效示例

```java
   @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated @RequestBody Person person) {
        return "success";
    }
    
   @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated(Query.class) @RequestBody Person person) {
        return "success";
    }
```

### 2.5.3 生效示例

```java
    @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated(Save.class) @RequestBody Person person) {
        return "success";
    }
```

原理: `org.hibernate.validator.internal.engine.ValidatorImpl`,感兴趣的可以研究下。

## 2.6 校验原理


**MethodValidationPostProcessor**

- 初始化时候,使用AOP做了一个切面,当方法参数使用@Validated修饰,就给加上一个代理。
- MethodValidationInterceptor 方法执行时候去检查参数。

```java
  // 初始化时候,使用AOP做了一个切面,当方法参数使用@Validated修饰,就给加上一个代理。
  @Override
	public void afterPropertiesSet() {
		Pointcut pointcut = new AnnotationMatchingPointcut(Validated.class, true);
		this.advisor = new DefaultPointcutAdvisor(pointcut, createMethodValidationAdvice(this.validator));
	}

	/**
	 * Create AOP advice for method validation purposes, to be applied
	 * with a pointcut for the specified 'validated' annotation.
	 * @param validator the JSR-303 Validator to delegate to
	 * @return the interceptor to use (typically, but not necessarily,
	 * a {@link MethodValidationInterceptor} or subclass thereof)
	 * @since 4.2
	 */
	protected Advice createMethodValidationAdvice(@Nullable Validator validator) {
		return (validator != null ? new MethodValidationInterceptor(validator) : new MethodValidationInterceptor());
	}
```

## 三、总结

看起来使用注解来约束数据对象,是一个很好的选择。但是也不是那么好,因为这会导致,数据的校验逻辑
比较分散。在面临项目需求的快速的迭代和项目组人员调整的情况,分散数据校验逻辑,往往会带的意想不到的问题。

最后仁者见仁智者见智，如果是你，你会怎么来选择呢?



![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)



- message 错误语句
- groups  分组控制【注意必须是接口】
- payload

下面通过举一个例子,来演示groups和payload究竟有什么用。

### 2.5.1 定义模型

```java
public class Person {

    @NotNull(message = "name不能为空")
    @Size(max = 64, message = "长度不能大于64")
    private String name;

    @Min(0)
    private int age;

    // 地址保存时候必须有值, 其他情况可以为空
    @MyConstraint(message = "address不能为空",groups = Save.class)
    private Address address;

}
```

### 2.5.2 不生效示例

```java
   @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated @RequestBody Person person) {
        return "success";
    }
    
   @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated(Query.class) @RequestBody Person person) {
        return "success";
    }
```

### 2.5.3 生效示例

```java
    @PostMapping(value = "validation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String post(@Validated(Save.class) @RequestBody Person person) {
        return "success";
    }
```

原理: `org.hibernate.validator.internal.engine.ValidatorImpl`,感兴趣的可以研究下。

## 2.6 校验原理


**MethodValidationPostProcessor**

- 初始化时候,使用AOP做了一个切面,当方法参数使用@Validated修饰,就给加上一个代理。
- MethodValidationInterceptor 方法执行时候去检查参数。

```java
  // 初始化时候,使用AOP做了一个切面,当方法参数使用@Validated修饰,就给加上一个代理。
  @Override
	public void afterPropertiesSet() {
		Pointcut pointcut = new AnnotationMatchingPointcut(Validated.class, true);
		this.advisor = new DefaultPointcutAdvisor(pointcut, createMethodValidationAdvice(this.validator));
	}

	/**
	 * Create AOP advice for method validation purposes, to be applied
	 * with a pointcut for the specified 'validated' annotation.
	 * @param validator the JSR-303 Validator to delegate to
	 * @return the interceptor to use (typically, but not necessarily,
	 * a {@link MethodValidationInterceptor} or subclass thereof)
	 * @since 4.2
	 */
	protected Advice createMethodValidationAdvice(@Nullable Validator validator) {
		return (validator != null ? new MethodValidationInterceptor(validator) : new MethodValidationInterceptor());
	}
```

## 三、总结

看起来使用注解来约束数据对象,是一个很好的选择。但是也不是那么好,因为这会导致,数据的校验逻辑
比较分散。在面临项目需求的快速的迭代和项目组人员调整的情况,分散数据校验逻辑,往往会带的意想不到的问题。

最后仁者见仁智者见智，如果是你，你会怎么来选择呢?



![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)

