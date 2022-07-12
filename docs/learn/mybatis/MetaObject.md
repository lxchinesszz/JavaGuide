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
title: 第14篇:Mybatis中反射工具
category: Mybatis
---

::: tip
我们知道在java中基于反射的速度相对来说是很慢的, 但是如果对反射信息加了缓存性能可以提升1半以上, 如果在对反射设置了忽略安全检查, 性能更是会再提升1半。那么这个时候
反射带来的性能问题基本可以忽略了。在Mybatis中关于反射的工具就可以很大程度来解决这个问题。本篇讲解下Mybatis中的工具类, 以后在项目中也可以直接使用。
:::

## 一、反射缓存类 Reflector

所有的反射对象都会被生成一个 `Reflector`, Reflector 会把反射的方法、构造、字段、类型等信息都缓存起来。这样的设计主要是为了解决性能问题。

```java 
public class Reflector {

  private final Class<?> type;
  private final String[] readablePropertyNames;
  private final String[] writablePropertyNames;
  private final Map<String, Invoker> setMethods = new HashMap<>();
  private final Map<String, Invoker> getMethods = new HashMap<>();
  private final Map<String, Class<?>> setTypes = new HashMap<>();
  private final Map<String, Class<?>> getTypes = new HashMap<>();
  private Constructor<?> defaultConstructor;

  private Map<String, String> caseInsensitivePropertyMap = new HashMap<>();
  
}  
```

ReflectorFactory 反射工厂用来缓存反射对象 Reflector

```java 

public class DefaultReflectorFactory implements ReflectorFactory {
  private boolean classCacheEnabled = true;
  private final ConcurrentMap<Class<?>, Reflector> reflectorMap = new ConcurrentHashMap<>();
  
  @Override
  public Reflector findForClass(Class<?> type) {
    if (classCacheEnabled) {
      // synchronized (type) removed see issue #461
      return MapUtil.computeIfAbsent(reflectorMap, type, Reflector::new);
    } else {
      return new Reflector(type);
    }
  }
  
}  
```

## 二、通过反射操作对象 MetaObject

MetaObject 从名字来看就是对对象进行操作,他的操作都是通过反射来进行的。

## 2.1 简单对象操作

```java 
    @AllArgsConstructor
    @ToString
    public static class Person {

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private String name;

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private int age;

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private Long userId;
    }

    /**
     * 通过反射给对象赋值
     */
    @Test
    public void metaObjectTest() {
        Person jay = new Person("周杰伦", 40, 1L);
        MetaObject jayMetaObject = MetaObject.forObject(jay, new DefaultObjectFactory(), new DefaultObjectWrapperFactory(), new DefaultReflectorFactory());
        if (jayMetaObject.hasGetter("name")) {
            Class<?> name = jayMetaObject.getGetterType("name");
            // class java.lang.String
            System.out.println(name);
            jayMetaObject.setValue("name", "昆凌");
            // 昆凌
            System.out.println(jayMetaObject.getValue("name"));
        }
        // 昆凌
        System.out.println(jay.getName());
    }
```

## 2.2 嵌套对象操作


```java 
    @AllArgsConstructor
    @ToString
    public static class Person {

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private String name;

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private int age;

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private Long userId;
    }
    
    @AllArgsConstructor
    @ToString
    public static class School {

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private String name;

        @Getter(AccessLevel.PRIVATE)
        @Setter(AccessLevel.PRIVATE)
        private Person person;
    }
    
    @Test
    public void fillChildObjectTest() {
        School school = new School("西天大学", new Person("周杰伦", 40, 1L));
        MetaObject schoolMetaObject = MetaObject.forObject(school, new DefaultObjectFactory(), new DefaultObjectWrapperFactory(), new DefaultReflectorFactory());
        // 周杰伦
        System.out.println(schoolMetaObject.getValue("person.name"));
        schoolMetaObject.setValue("person.name", "昆凌");
        // 昆凌
        System.out.println(school.getPerson().getName());
    }
```

## 三、获取反射信息 MetaClass

MetaClass 主要是对 Reflector信息的一个包装并提供些更高级的操作。如跟嵌套类赋值

```java 
    @Test
    public void metaClassTest() throws Exception {
        MetaClass metaClass = MetaClass.forClass(School.class, new DefaultReflectorFactory());
        // class com.test.tool.MetaObjectTest$Person
        System.out.println(metaClass.getGetterType("person"));

        School school = new School();
        Invoker setNameInvoker = metaClass.getSetInvoker("name");
        // 通过反射给空对象赋值
        setNameInvoker.invoke(school, new Object[]{"Jay"});

        // 通过反射获取空对象
        Invoker getNameInvoker = metaClass.getGetInvoker("name");
        // Jay
        System.out.println(getNameInvoker.invoke(school, new Object[]{}));
    }
```
