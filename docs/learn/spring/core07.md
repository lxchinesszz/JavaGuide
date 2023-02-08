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
title: 第07篇:Converter SPI类型转换
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---
![](https://img-blog.csdnimg.cn/img_convert/aa1d259419ff268edc2fe3088f940556.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog "https://springlearn.blog.csdn.net")<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！


[toc]

## 一、前言

本篇文章中的内容,非常的小众,虽然在实际开发中,基本上不会有使用的场景,但是在Spring中却无处不在的知识点。因为我们是学习Spring,所以我们最好了解一下。

本篇文章,主要学习两个东西。第一个是类型转换, 第二个是格式化输出。

## 1.1 类型转换

类型转换,比如说Long类型转换Date、String类型转换Long类型。
在实际的开发中我们可能直接使用 `BeanUtils.copy()` 或者其他三方工具来实现,但其实Spring已经提供了这种的接口能力了。我们只需要下面这样就可以了。

如下演示,将Long类型转Date。

```java
@SpringBootApplication
public class Application {

    // 注册一个转换器,目标由Long转Date
    public static class LongToDateConvert implements Converter<Long, Date> {
        @Override
        public Date convert(Long source) {
            return new Date(source);
        }
    }

    @Bean("customerConvert")
    public ConversionServiceFactoryBean customerConvert() {
        ConversionServiceFactoryBean conversionServiceFactoryBean = new ConversionServiceFactoryBean();
        conversionServiceFactoryBean.setConverters(Collections.singleton(new LongToDateConvert()));
        return conversionServiceFactoryBean;
    }
}
@SpringBootTest
@TestConfiguration
public class SpringConvertTest {

    @Autowired
    @Qualifier("customerConvert")
    private ConversionService conversionService;

    @Test
    public void test() {
        // 直接使用即可。
        Date convert = conversionService.convert(System.currentTimeMillis(), Date.class);
        // Mon Oct 17 21:38:07 CST 2022
        System.out.println(convert);
    }
}
```

举一反三,通过上面的接口能力,我们还能实现更多的使用场景。如上我们只实现了1:1的转换,其还可以1:N、N:N,更多的内容下面会讲。

## 1.2 格式化输出

什么是格式化输出,往往只针对的是文本类型。

1. 对象类型转文本类型
2. 文本类型转对象类型

所以格式化是围绕String进行的,在格式化这方面最典型的一个案例就是国际化。

同样的文本,针对不同国家地域展示为当地的语言类型。
下面我们看他的接口定义。

```java
public interface Formatter<T> extends Printer<T>, Parser<T> {
}

@FunctionalInterface
public interface Printer<T> {
  // 对象类型,转换String类型,支持国际化
	String print(T object, Locale locale);
}
@FunctionalInterface
public interface Parser<T> {
  // String类型转换泛型,支持国际化
	T parse(String text, Locale locale) throws ParseException;
}
```

下面我们看详细的内容。


## 二、Converter 类型转换

Spring 3 引入了一个core.convert提供通用类型转换系统的包。系统定义了一个 SPI 来实现类型转换逻辑和一个 API 来在运行时执行类型转换。在 Spring 容器中，您可以使用此系统作为实现的替代PropertyEditor方案，将外部化的 bean 属性值字符串转换为所需的属性类型。您还可以在应用程序中需要类型转换的任何地方使用公共 API。

![](https://img-blog.csdnimg.cn/img_convert/e434654f83434c08d5fe5c04bb2f493d.png)

|接口|介绍|
|:--|:--|
|Converter|单一的类型转换,从泛型 S -> T|
|ConverterFactory|按照官方的描述是,具有层次的转换,从泛型 S -> 转换成 R 的子类,实现一对多个类型的转换|
|GenericConverter|前面是一对多，一对一,这个是多对多|
|ConditionalGenericConverter|在前者的基础上,添加上条件判断,符合条件才进行转换|

下面我们来以此看下,每个接口的

## 2.1 Converter

### 2.1.1 接口定义

```
package org.springframework.core.convert.converter;

public interface Converter<S, T> {

    T convert(S source);
}
```

这个接口非常的简单,没什么好解释的。我们要创建自己的转换器，只用实现Converter接口就可以了。

### 2.1.2 接口功能

实现从 S，向 T 的泛型转换，Spring提供了很多内置的转换,如下示例。

![](https://img-blog.csdnimg.cn/img_convert/c8d837bbb35e0881eb6ef53422e7bd5a.png)

Spring默认提供了很多的默认实现,下面我们看一个简单的实现。看下面的源码,感觉Spring是真的用心呀。

- on、true、1、yes 都会转换成 true
- off、false、0、no 都会转换成 false


```java
final class StringToBooleanConverter implements Converter<String, Boolean> {
    private static final Set<String> trueValues = new HashSet(8);
    private static final Set<String> falseValues = new HashSet(8);

    StringToBooleanConverter() {
    }

    @Nullable
    public Boolean convert(String source) {
        String value = source.trim();
        if (value.isEmpty()) {
            return null;
        } else {
            value = value.toLowerCase();
            if (trueValues.contains(value)) {
                return Boolean.TRUE;
            } else if (falseValues.contains(value)) {
                return Boolean.FALSE;
            } else {
                throw new IllegalArgumentException("Invalid boolean value '" + source + "'");
            }
        }
    }

    static {
        trueValues.add("true");
        trueValues.add("on");
        trueValues.add("yes");
        trueValues.add("1");
        falseValues.add("false");
        falseValues.add("off");
        falseValues.add("no");
        falseValues.add("0");
    }
}
```


## 2.2 ConverterFactory

ConverterFactory 跟 Converter的区别在于, ConverterFactory 提供一个泛化的接口。根据泛型获取自己的转换类。但是前提是Converter要具备能处理返回接口的能力。以此来处理 1 对 N的转换。

### 2.2.1 接口定义

```java
package org.springframework.core.convert.converter;

public interface ConverterFactory<S, R> {

    <T extends R> Converter<S, T> getConverter(Class<T> targetType);
}
```

可以看到泛型是从 S -> R, getConverter 泛型方法允许 ` <T extends R> ` 返回 T


### 2.2.2 接口功能

```java
package org.springframework.core.convert.support;

final class StringToEnumConverterFactory implements ConverterFactory<String, Enum> {

    public <T extends Enum> Converter<String, T> getConverter(Class<T> targetType) {
        return new StringToEnumConverter(targetType);
    }

    private final class StringToEnumConverter<T extends Enum> implements Converter<String, T> {

        private Class<T> enumType;

        public StringToEnumConverter(Class<T> enumType) {
            this.enumType = enumType;
        }
        // 将泛化类型
        public T convert(String source) {
            return (T) Enum.valueOf(this.enumType, source.trim());
        }
    }
}
```

通过 `<T exends R>` 的限定, 最终实现 1 : N 的转换。


## 2.3 GenericConverter

- Converter 处理 1:1的转换
- ConverterFactory 处理 1:N的转换
- GenericConverter 处理里 N: N的转换

下面我们看接口

### 2.3.1 接口定义

- getConvertibleTypes 返回了一个集合,而集合中每个key都是一个键值对。就支持 N:N 了。

```
package org.springframework.core.convert.converter;

public interface GenericConverter {

    public Set<ConvertiblePair> getConvertibleTypes();

    Object convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType);
}

```

getConvertibleTypes() 是一个Set集合。可以看到ConvertiblePair是成对的,只要转换双方是包含在这set结合中,都会调用这个进行转换。

```java
final class ConvertiblePair {
		private final Class<?> sourceType;
		private final Class<?> targetType;
}  
```

意味着一个转换器可以处理多种类型的转换。

### 2.3.2 接口功能

下面举一个例子

```java
 @Data
    public static class SourceOne {
        private String name;
    }

    @Data
    public static class TargetOne {
        private String name;
    }

    @Data
    public static class TargetTwo {
        private String name;
    }


    @Test
    public void test() {
        ApplicationConversionService applicationConversionService = new ApplicationConversionService();
        GenericConverter genericConverter = new GenericConverter() {
            @Override
            public Set<ConvertiblePair> getConvertibleTypes() {
                Set<ConvertiblePair> paris = new HashSet<>();
                paris.add(new ConvertiblePair(SourceOne.class, TargetOne.class));
                paris.add(new ConvertiblePair(SourceOne.class, TargetTwo.class));

                return paris;
            }

            @Override
            public Object convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType) {
                if (sourceType.getObjectType().equals(SourceOne.class) && targetType.getObjectType().equals(TargetOne.class)) {
                    TargetOne targetOne = new TargetOne();
                    targetOne.setName(((SourceOne) source).getName() + "-> TargetOne");
                    return targetOne;
                }
                if (sourceType.getObjectType().equals(SourceOne.class) && targetType.getObjectType().equals(TargetTwo.class)) {
                    TargetTwo TargetTwo = new TargetTwo();
                    TargetTwo.setName(((SourceOne) source).getName() + "-> TargetTwo");
                    return TargetTwo;
                }
                return null;
            }
        };
        applicationConversionService.addConverter(genericConverter);
        SourceOne sourceOne = new SourceOne();
        sourceOne.setName("Jay");
        System.out.println(applicationConversionService.convert(sourceOne, TargetOne.class));
        System.out.println(applicationConversionService.convert(sourceOne, TargetTwo.class));

    }
```


## 2.4 ConditionalGenericConverter

有时,你希望 Converter只有在特定条件成立时才运行，此时可以实现这个接口。这个接口是实现了 `GenericConverter` 、 `ConditionalConverter`。

![](https://img-blog.csdnimg.cn/img_convert/844f01a10884f95ad81f5ca066d22eb8.png)

### 2.4.1 接口定义

```java
public interface ConditionalConverter {

    boolean matches(TypeDescriptor sourceType, TypeDescriptor targetType);
}

public interface ConditionalGenericConverter extends GenericConverter, ConditionalConverter {
}
```

## 2.5 Spring 实践

ConversionService定义了一个统一的 API，用于在运行时执行类型转换逻辑。

### 2.5.1 ConversionService


```java
package org.springframework.core.convert;

public interface ConversionService {
    // 如果sourceType的对象可以转换为targetType ，则返回true 
    boolean canConvert(Class<?> sourceType, Class<?> targetType);
    // 将给定的source转换为指定的targetType 。
    <T> T convert(Object source, Class<T> targetType);
    // 如果sourceType的对象可以转换为targetType ，则返回true
    boolean canConvert(TypeDescriptor sourceType, TypeDescriptor targetType);
    // 将给定的source转换为指定的targetType 。 TypeDescriptors 提供有关将发生转换的源和目标位置的附加上下文，通常是对象字段或属性位置。
    Object convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType);
}
```

### 2.5.2 硬编码使用

如果转换失败会抛出 `org.springframework.core.convert.ConversionFailedException`

```java
public class ConvertTest {

    @Test
    public void test(){
        ConversionService sharedInstance = DefaultConversionService.getSharedInstance();
        System.out.println(sharedInstance.convert("1", Boolean.class));
        System.out.println(sharedInstance.convert("123", Long.class));
        System.out.println(sharedInstance.convert("1234", Integer.class));
        System.out.println(sharedInstance.convert("1235", int.class));
    }

}
```

### 2.5.3 整合Spring

```java
@SpringBootApplication
public class Application {


    public static class LongToDateConvert implements Converter<Long, Date> {
        @Override
        public Date convert(Long source) {
            return new Date(source);
        }
    }

    @Bean("customerConvert")
    public ConversionServiceFactoryBean customerConvert() {
        ConversionServiceFactoryBean conversionServiceFactoryBean = new ConversionServiceFactoryBean();
        conversionServiceFactoryBean.setConverters(Collections.singleton(new LongToDateConvert()));
        return conversionServiceFactoryBean;
    }
}
    
@SpringBootTest
@TestConfiguration
public class SpringConvertTest {

    @Autowired
    @Qualifier("customerConvert")
    private ConversionService conversionService;

    @Test
    public void test() {
        Date convert = conversionService.convert(System.currentTimeMillis(), Date.class);
        System.out.println(convert);
    }
}
```




## 三、Formatter 格式化输出

`core.convert` 是一个通用的类型转换系统。它提供了一个统一的ConversionServiceAPI 以及一个强类型的ConverterSPI，用于实现从一种类型到另一种类型的转换逻辑。

现在考虑典型客户端环境的类型转换要求，例如 Web 或桌面应用程序。在这样的环境中，您通常转换 fromString 以支持客户端回发过程，以及转换回String以支持视图呈现过程。

此外，您经常需要本地化String值（国际化）。`core.convert Converter` 不直接解决此类格式要求。为了直接解决这些问题，Spring 3 引入了一个方便的SPI，它为客户端环境的实现Formatter提供了一个简单而健壮的替代方案。PropertyEditor。

## 3.1 自定义Formatter

要想自定义Formatter我们只用实现 `Formatter` 接口即可。下面我们看他们的接口定义,就能看到。
Formatter 跟Convert的区别是什么。

- Formatter 只支持String和对象的双向转换，适合文本格式化、国际化的处理。
- Converter 支持任意类型的转换

```java
public interface Formatter<T> extends Printer<T>, Parser<T> {}
@FunctionalInterface
public interface Printer<T> {
  // 对象转String
	String print(T object, Locale locale);
}
@FunctionalInterface
public interface Parser<T> {
	// String转对象
	T parse(String text, Locale locale) throws ParseException;
}
```

如下我们自定义一个时间的转换器

```java
public class DateFormatterTest {

    @Test
    public void test() {
        DefaultFormattingConversionService defaultFormattingConversionService = new DefaultFormattingConversionService();
        defaultFormattingConversionService.addFormatter(new DateFormatter("yyyy-MM-dd"));
        Date convert = defaultFormattingConversionService.convert("2022-10-10", Date.class);
        System.out.println(convert);
    }

    public final class DateFormatter implements Formatter<Date> {
        private String pattern;
        public DateFormatter(String pattern) {
            this.pattern = pattern;
        }
        public String print(Date date, Locale locale) {
            if (date == null) {
                return "";
            }
            return getDateFormat(locale).format(date);
        }
        public Date parse(String formatted, Locale locale) throws ParseException {
            if (formatted.length() == 0) {
                return null;
            }
            return getDateFormat(locale).parse(formatted);
        }
        protected DateFormat getDateFormat(Locale locale) {
            DateFormat dateFormat = new SimpleDateFormat(this.pattern, locale);
            dateFormat.setLenient(false);
            return dateFormat;
        }
    }
}
```

## 3.1 注解驱动Formatter

在Spring中很多很多功能都是可以基于注解进行驱动的，开发者不用关心底层实现，直接使用注解。就能使用很强大的工具了。下面我们实现一个注解驱动的类型转换。

自定一个注解 `@DatePattern` , 将String类型,根据注解的配置最终给方法参数赋值。

```java
    public String print(@DatePattern(pattern = "yyyy-MM-dd") Date date) {
        System.out.println(date.toString());
        return date.toString();
    }
```



1. 首先我们要实现这个接口。


```java
public interface AnnotationFormatterFactory<A extends Annotation> {

    Set<Class<?>> getFieldTypes();

    Printer<?> getPrinter(A annotation, Class<?> fieldType);

    Parser<?> getParser(A annotation, Class<?> fieldType);
}
```

2.

注意这里一定要用 `TypeDescriptor` 构造的方式来处理，因为只有这样才会处理注解。

```java
   @Test
    public void test() throws Exception {
        DefaultFormattingConversionService defaultFormattingConversionService = new DefaultFormattingConversionService();
        defaultFormattingConversionService.addFormatterForFieldAnnotation(new DatePatternFormatAnnotationFormatterFactory());
        Method print = getClass().getDeclaredMethod("print", Date.class);
        // 注意一定要使用 TypeDescriptor 构造的方式声明才会有注解信息
        for (Parameter parameter : print.getParameters()) {
            // true
            System.out.println(new TypeDescriptor(MethodParameter.forParameter(parameter)).hasAnnotation(DatePattern.class));
        }
        // 通过注解的方式实现解析
        Object convert = defaultFormattingConversionService.convert("2021-12-12", new TypeDescriptor(MethodParameter.forExecutable(print, 0)));
        System.out.println(convert);
    }

    public String print(@DatePattern(pattern = "yyyy-MM-dd") Date date) {
        System.out.println(date.toString());
        return date.toString();
    }

    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.FIELD, ElementType.PARAMETER})
    public @interface DatePattern {
        String pattern();
    }

    public final class DatePatternFormatAnnotationFormatterFactory
            implements AnnotationFormatterFactory<DatePattern> {
        public Set<Class<?>> getFieldTypes() {
            return new HashSet<Class<?>>(Arrays.asList(new Class<?>[]{Date.class}));
        }

        public Printer<Date> getPrinter(DatePattern annotation, Class<?> fieldType) {
            return configureFormatterFrom(annotation, fieldType);
        }

        public Parser<Date> getParser(DatePattern annotation, Class<?> fieldType) {
            return configureFormatterFrom(annotation, fieldType);
        }

        private Formatter<Date> configureFormatterFrom(DatePattern annotation, Class<?> fieldType) {
            return new DateFormatter(annotation.pattern());
        }
    }
    public final class DateFormatter implements Formatter<Date> {
        private String pattern;
        public DateFormatter(String pattern) {
            this.pattern = pattern;
        }
        public String print(Date date, Locale locale) {
            if (date == null) {
                return "";
            }
            return getDateFormat(locale).format(date);
        }
        public Date parse(String formatted, Locale locale) throws ParseException {
            if (formatted.length() == 0) {
                return null;
            }
            return getDateFormat(locale).parse(formatted);
        }
        protected DateFormat getDateFormat(Locale locale) {
            DateFormat dateFormat = new SimpleDateFormat(this.pattern, locale);
            dateFormat.setLenient(false);
            return dateFormat;
        }
    }
```


![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)


