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
title: 第08篇:Data Binding类型绑定
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

## 一、前言

## 1.1 什么是数据绑定?

本文我们所描述的数据绑定可以理解成。

1. 将结构化的数据文本, 转换成Java对象。
2. 通过Spring提供的API方式,而不通过反射的方式将属性信息,绑定到Java对象。

## 1.2 为什么需要数据绑定API呢?

为什么需要数据绑定呢? 因为在Spring中很多地方都使用到了数据绑定,通过提供统一的API,有以下这些好处。

1. 不使用反射,给开发者提供了一种更优雅的方式。
2. 逻辑业务收口,将Spring中自带的很多功能进行组合,通过一个API的方式进行业务收口,而不是要开发者自己去组装Spring已有的功能。
3. 通过提供标准的API的方式,在标准API中暴露扩展点,方便开发者二次开发,定制转换逻辑。

## 1.3 Spring中常见的数据绑定有那些?

在Spring中随处可见参数的绑定如下。

1. 比如 `@RequestBody` 如何将参数绑定到实体对象上。
2. 应用配置信息如何通过 `@ConfigurationProperties`将参数绑定到配置实体类中
3. 参数绑定如何实现,弱类型绑定绑定。即: 下划线自动转驼峰,忽略字母大小写。 ConfigurationPropertiesBinder


如果你有下面这些疑问,那么本篇文章将会告诉你这些问题的答案,希望对你有用。


## 二、数据绑定API

在回答 `1.3` 提出的问题前,我们先了解下在Spring中有那些能进行数据绑定的工具类把。

为了方面演示,首先我们这里先定义一个实体。

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
```

## 2.1 BeanWrapper

首先分享一个简单的用法,使用这种方式我们可以给一个实体对象,进行属性的绑定。（PS: 如果你看过Spring自动注入的原理,会发现也会用到`BeanWrapper:AbstractAutowireCapableBeanFactory#autowireBean` ）

下面我们给User对象进行属性的绑定。
```java
    @Test
    public void testBeanWrapper() {
        User emptyUser = new User();
        BeanWrapper beanWrapper = new BeanWrapperImpl(emptyUser);
        beanWrapper.setPropertyValue("name", "Jay");
        beanWrapper.setPropertyValue("address", new Address("中国"));
        beanWrapper.setPropertyValue(new PropertyValue("age", "32"));
        beanWrapper.setPropertyValue(new PropertyValue("membersFamily", Arrays.asList("谢霆锋", "孙悟空")));
        System.out.println(emptyUser);
        // User(name=Jay, age=32, membersFamily=[谢霆锋, 孙悟空], address=Address(name=中国, oneAddress=null, twoAddress=null))
    }
```

BeanWrapper还可以针对字段进行定制转换逻辑,我们看下面这几个API.
- `void registerCustomEditor(Class<?> requiredType, PropertyEditor propertyEditor)` 如果不指定字段名称,可以只针对类型进行定制。

- `void registerCustomEditor(@Nullable Class<?> requiredType, @Nullable String propertyPath, PropertyEditor propertyEditor)` 根据类型 + 字段名注册。

- `PropertyEditor findCustomEditor(@Nullable Class<?> requiredType, @Nullable String propertyPath);` 根据类型获取属性编辑器

1. 给name字段绑定时候,将value转换成小写。

```java
    @Test
    public void testBeanWrapper2() {
        BeanWrapper beanWrapper = new BeanWrapperImpl(User.class);
        // String类型,属性是name的,将属性自动转换成小写。
        beanWrapper.registerCustomEditor(String.class, "name", new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                super.setValue(text.toLowerCase(Locale.ROOT));
            }
        });
        beanWrapper.setPropertyValue("name", "Jay");
        beanWrapper.setPropertyValue("address", new Address("中国"));
        beanWrapper.setPropertyValue(new PropertyValue("age", "32"));
        beanWrapper.setPropertyValue(new PropertyValue("membersFamily", Arrays.asList("谢霆锋", "孙悟空")));
        // User(name=jay, age=32, membersFamily=[谢霆锋, 孙悟空], address=Address(name=中国, oneAddress=null, twoAddress=null))
        System.out.println(beanWrapper.getWrappedInstance());
    }
```

除此之外,Spring中还有很多内置的属性编辑器,如下表格。

|Class|作用|
|:--|:--|
|ByteArrayPropertyEditor|将字符串转换为相应的字节表示形式。BeanWrapperImpl默认注册。|
|ClassEditor|将表示类的字符串解析为实际类，反之亦然。当找不到类时，将引发IllegalArgumentException。默认情况下，由BeanWrapperImpl注册|
|CustomBooleanEditor|布尔属性的可自定义属性编辑器。默认情况下，由BeanWrapperImpl注册，但可以通过将其自定义实例注册为自定义编辑器来覆盖。|
|CustomCollectionEditor|集合的属性编辑器，将任何源集合转换为给定的目标集合类型。|
|CustomDateEditor|java.util的可定制属性编辑器。日期，支持自定义DateFormat。默认情况下未注册。用户必须根据需要以适当的格式注册。|
|CustomNumberEditor|任何Number子类的可自定义属性编辑器，如Integer、Long、Float或Double。默认情况下，由BeanWrapperImpl注册，但可以通过将其自定义实例注册为自定义编辑器来覆盖。|
|FileEditor|将字符串解析为java.io。文件对象。默认情况下，由BeanWrapperImpl注册。|
|InputStreamEditor|单向属性编辑器，可以获取字符串并（通过中间的ResourceEditor和Resource）生成InputStream，以便可以将InputStriam属性直接设置为字符串。请注意，默认用法不会为您关闭InputStream。默认情况下，由BeanWrapperImpl注册。|
|LocaleEditor|可以将字符串解析为Locale对象，反之亦然（字符串格式为[language]_[country]_[variant]，与Locale的toString（）方法相同）。也接受空格作为分隔符，作为下划线的替代。默认情况下，由BeanWrapperImpl注册。|
|PatternEditor|将字符串解析为java.util.regex。|
|PropertiesEditor|可以将字符串（使用java.util.Properties类的javadoc中定义的格式格式化）转换为Properties对象。默认情况下，由BeanWrapperImpl注册。|
|StringTrimmerEditor|修剪字符串的属性编辑器。可选地，允许将空字符串转换为空值。默认情况下未注册 — 必须是用户注册的。|
|URLEditor|可以将URL的字符串表示解析为实际的URL对象。默认情况下，由BeanWrapperImpl注册。|

这些属性编辑器都比较简单,我们只分析其中的一个。`CustomBooleanEditor`

```java
public class CustomBooleanEditor extends PropertyEditorSupport {
  // 当text等于on/yes/1的时候都会自动转换成布尔类型。true
  @Override
	public void setAsText(@Nullable String text) throws IllegalArgumentException {
  
	}

}
```

## 2.2 Binder

`Binder` 可以给绑定的对象添加指定的前缀。

```java
    @Test
    public void test2() {
        MockEnvironment environment = new MockEnvironment();
        // 下划线,中划线自动转驼峰，大小写不敏感
        environment.setProperty("customer.Name", "Jay");
        // 大小写不敏感
        environment.setProperty("customer.Age", "0");
        environment.setProperty("customer.members_family", "周杰伦,谢霆锋,诸葛亮");
        environment.setProperty("customer.address.name", "杭州");
        environment.setProperty("customer.address.oneAddress", "上城区");
        environment.setProperty("customer.address.twoAddress", "学区房");

        Binder binder = Binder.get(environment);
        User user = new User();
        // 这里我们声明所有的前缀都是customer开头
        binder.bind(ConfigurationPropertyName.of("customer"), Bindable.ofInstance(user), null);
        // User(name=Jay, age=0, membersFamily=[周杰伦, 谢霆锋, 诸葛亮], address=Address(name=杭州, oneAddress=上城区, twoAddress=学区房))
        System.out.println(user);
    }
```

## 2.3 DataBinder

- `setDisallowedFields()` 设置需要忽略的字段,如果给忽略的字段赋值,就会报错。
- `setAllowedFields()` 允许绑定的,如果没有指定默认都允许,如果指定了就仅限指定的字段,可以绑定。
- `setRequiredFields()` 指定的字段必须要有值,不能为null。
- `registerCustomEditor()` 注册转换逻辑。
- `addValidators(...)` 添加绑定的验证器。
- `bind()` 执行绑定动作。
- `validate()` 执行规则校验。
- `getBindingResult()` 获取绑定结果信息
- `getTarget()` 获取绑定后的数据对象

```java
    @Test
    public void testDataBinder() {
        // 绑定那个字段,以及绑定的逻辑
        DataBinder dataBinder = new DataBinder(new User());
        // 忽略不绑定的,如果有绑定就报错
//        dataBinder.setDisallowedFields("age");
        // 允许绑定的,如果没有指定默认都允许,如果指定了就仅限指定的字段,可以绑定。
//        dataBinder.setAllowedFields("name","address","age");
        // 必须要有值,不能为null
        dataBinder.setRequiredFields("age");
        // 字段转换器
        dataBinder.registerCustomEditor(String.class, "name", new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                // name转成大写
                setValue(text.toUpperCase());
            }
        });
        dataBinder.registerCustomEditor(Address.class, "address", new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                // name转成大写
                setValue(text.toUpperCase());
            }

            @Override
            public void setValue(Object value) {
                if (value instanceof Address) {
                    ((Address) value).setName("Beijing");
                }
                super.setValue(value);
            }
        });
        // 添加验证规则
        dataBinder.addValidators(new Validator() {
            @Override
            public boolean supports(Class<?> clazz) {
                return User.class.equals(clazz);
            }

            @Override
            public void validate(Object target, Errors errors) {
                if (((User) target).getAge() <= 0) {
                    errors.rejectValue("age", "年龄不合法");
                }
            }
        });
        PropertyValues pvs = new MutablePropertyValues(
                Arrays.asList(new PropertyValue("name", "jar"),
                        new PropertyValue("age", 0),
                        new PropertyValue("address", new Address())));
        dataBinder.bind(pvs);
        // 验证字段
        dataBinder.validate();
        BindingResult results = dataBinder.getBindingResult();
        // org.springframework.validation.BeanPropertyBindingResult: 1 errors
        // Field error in object 'target' on field 'age': rejected value [0]; codes [年龄不合法.target.age,年龄不合法.age,年龄不合法.java.lang.Integer,年龄不合法]; arguments []; default message [null]
        System.out.println(results);
        // User(name=JAR, age=0, membersFamily=null, address=Address(name=Beijing, oneAddress=null, twoAddress=null))
        System.out.println(dataBinder.getTarget());
    }

```

## 2.4 WebDataBinder 自定义Web请求参数转换器

WebDataBinder 继承自DataBinder Spring允许通过其进行自定义的类型转换,从而将请求参数转换成方法参数。

- 如下我们定义一个get请求,将请求参数转换成 Address对象。
```java
    @GetMapping("get")
    public String test(@RequestParam("ads") Address address) {
        return address.toString();
    }
```

- 首先我们先实现PropertyEditorRegistrar,设置解析的规则


```java
@Component("customPropertyEditorRegistrar")
public class AddressPropertyEditorRegistrar implements PropertyEditorRegistrar {

    @Override
    public void registerCustomEditors(PropertyEditorRegistry registry) {
        registry.registerCustomEditor(Address.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                String[] split = text.split("\\|");
                Address address = new Address();
                address.setOneAddress(split[0]);
                address.setTwoAddress(split[1]);
                setValue(address);
            }
        });
    }
}
```

- 给WebDataBinder添加转换器

```java
@RestController
public class RegisterUserController
  
   @Autowired
   private PropertyEditorRegistrar customPropertyEditorRegistrar;
   
   /**
     * 只对当前接口有效
     *
     * @param binder
     */
    @InitBinder
    void initBinder(WebDataBinder binder) {
        this.customPropertyEditorRegistrar.registerCustomEditors(binder);
    }
    // GET http://localhost:8080/get?ads=杭州市|上城区
    @GetMapping("get")
    public String test(@RequestParam("ads") Address address) {
        // Address(name=null, oneAddress=杭州市, twoAddress=上城区)
        return address.toString();
    }
}    
```


## 三、问题解答

## 3.1 @RequestBody 如何将参数绑定到实体对象上

主要思路就是从HttpServletRequest中获取参数,通过读取请求方法的 `MediaType` 类型,选择对应的
`HttpMessageConverter` 转换器。

1. HandlerMethodArgumentResolver 处理web方法的参数
2. HandlerMethodReturnValueHandler 处理web方法的参数

![](https://img.springlearn.cn/blog/87db17f2f12a9f30f4611f036eef86ce.png)

### 3.1.1 执行器请求方法

同时如果请求类的使用到了 @InitBinder 自定义请求参数转换,在这里也会被执行。

```java
  // 从Request对象中获取方法参数 getMethodArgumentValues
	@Nullable
	public Object invokeForRequest(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
			Object... providedArgs) throws Exception {

		Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
		if (logger.isTraceEnabled()) {
			logger.trace("Arguments: " + Arrays.toString(args));
		}
		return doInvoke(args);
	}
```

### 3.1.2 转换请求参数

![](https://img.springlearn.cn/blog/9a061a096787aee746c8993168e6dfca.png)

- RequestResponseBodyMethodProcessor

### 3.1.3 @RequestBody 处理

这里主要使用到的接口是 `HttpMessageConverter`，同时这里我们能看到一段逻辑就是
什么时候会进行参数检查。就在 `validateIfApplicable`,如果参数失败就会抛出 `MethodArgumentNotValidException` 异常。

![](https://img.springlearn.cn/blog/98fa4b35ed341d19e43b23b86958f65b.png)

![](https://img.springlearn.cn/blog/0df70689e2560afd5ff613e221945218.png)


## 3.2 ConfigurationProperties 参数绑定原理


- ConfigurationPropertiesBindingPostProcessor

在配置类Bean, 初始化前,执行绑定。

```java
public class ConfigurationPropertiesBindingPostProcessor
		implements BeanPostProcessor, PriorityOrdered, ApplicationContextAware, InitializingBean {
  
    private ConfigurationPropertiesBinder binder;
    
    // 从容器中获取绑定工具类,ConfigurationPropertiesBinder
    @Override
    public void afterPropertiesSet() throws Exception {
      this.registry = (BeanDefinitionRegistry) this.applicationContext.getAutowireCapableBeanFactory();
      this.binder = ConfigurationPropertiesBinder.get(this.applicationContext);
    }

    // bean初始化前,进行绑定
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      bind(ConfigurationPropertiesBean.get(this.applicationContext, bean, beanName));
      return bean;
    }

    private void bind(ConfigurationPropertiesBean bean) {
      if (bean == null || hasBoundValueObject(bean.getName())) {
        return;
      }
      Assert.state(bean.getBindMethod() == BindMethod.JAVA_BEAN, "Cannot bind @ConfigurationProperties for bean '"
          + bean.getName() + "'. Ensure that @ConstructorBinding has not been applied to regular bean");
      try {
        this.binder.bind(bean);
      }
      catch (Exception ex) {
        throw new ConfigurationPropertiesBindException(bean, ex);
      }
    }  
    
}
```

### 3.2.1 ConfigurationPropertiesBinder

因为在构造中就获取到了Spring的上下文对象,所有就能从Spring中获取到所有他想要的工具。
最终调用前面我们学过的 `Binder` 去进行绑定。

```java
class ConfigurationPropertiesBinder {

	ConfigurationPropertiesBinder(ApplicationContext applicationContext) {
      this.applicationContext = applicationContext;
      this.propertySources = new PropertySourcesDeducer(applicationContext).getPropertySources();
      this.configurationPropertiesValidator = getConfigurationPropertiesValidator(applicationContext);
      this.jsr303Present = ConfigurationPropertiesJsr303Validator.isJsr303Present(applicationContext);
	}
  
  BindResult<?> bind(ConfigurationPropertiesBean propertiesBean) {
      Bindable<?> target = propertiesBean.asBindTarget();
      ConfigurationProperties annotation = propertiesBean.getAnnotation();
      BindHandler bindHandler = getBindHandler(target, annotation);
      // 获取到前缀,进行绑定
      return getBinder().bind(annotation.prefix(), target, bindHandler);
	}
}  
```

### 3.2.2 ConstructorBinding 的用法

最后我们介绍一个很少用的注解,这个注解往往用于配合 @ConfigurationProperties使用,但是使用的场景不多。

`@ConstructorBinding` 可用于指示应该,使用构造函数参数而不是调用setter来绑定配置属性的注释。可以在类型级别(如果有明确的构造函数)或在要使用的实际构造函数上添加。


![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**
