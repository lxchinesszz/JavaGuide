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
comment: false
footer: true
backtotop: true
sidebarDepth: 3
title: 反射框架Reflections
---

[Github](https://github.com/ronmamo/reflections)


## 一、简介

Reflections通过扫描classpath，索引元数据，并且允许在运行时查询这些元数据。

使用Reflections可以很轻松的获取以下元数据信息：

- [x] 获取某个类型的全部子类
- [x] 只要类型、构造器、方法，字段上带有特定注解，便能获取带有这个注解的全部信息（类型、构造器、方法，字段）
- [x] 获取所有能匹配某个正则表达式的资源
- [x] 获取所有带有特定签名的方法，包括参数，参数注解，返回类型
- [x]  获取所有方法的名字
- [x] 获取代码里所有字段、方法名、构造器的使用权


## 二、Maven依赖

```xml 
<dependency>
    <groupId>org.reflections</groupId>
    <artifactId>reflections</artifactId>
    <version>0.9.11</version>
</dependency>
```

## 三、使用方法

### 3.1 实例化

指定要扫描的包名

```java 
// 实例化Reflections，并指定要扫描的包名
Reflections reflections = new Reflections("my.project");
// 获取某个类的所有子类
Set<Class<? extends SomeType>> subTypes = reflections.getSubTypesOf(SomeType.class);
// 获取包含某个注解的所有类
Set<Class<?>> annotated = reflections.getTypesAnnotatedWith(SomeAnnotation.class);
  
```

指定要扫描的包名并添加过滤器

[ConfigurationBuilder API](https://ronmamo.github.io/reflections/org/reflections/util/ConfigurationBuilder.html)
```java 
Reflections reflections = new Reflections(
  new ConfigurationBuilder()
    .forPackage("com.my.project")
    .filterInputsBy(new FilterBuilder().includePackage("com.my.project")));
```

添加扫描器

[Scanners API](https://ronmamo.github.io/reflections/org/reflections/scanners/Scanners.html)
```java 
// scan package with specific scanners
Reflections reflections = new Reflections(
  new ConfigurationBuilder()
    .forPackage("com.my.project")
    .filterInputsBy(new FilterBuilder().includePackage("com.my.project").excludePackage("com.my.project.exclude"))
    .setScanners(TypesAnnotated, MethodsAnnotated, MethodsReturn));

// scan package with all standard scanners
Reflections reflections = new Reflections("com.my.project", Scanners.values());
```

### 3.2 扫描子类

```java 
Set<Class<? extends Module>> modules = 
    reflections.getSubTypesOf(com.google.inject.Module.class);
```

### 3.3 扫描注解

```java 
//TypeAnnotationsScanner 
Set<Class<?>> singletons = 
    reflections.getTypesAnnotatedWith(javax.inject.Singleton.class);
```

### 3.4 扫描资源

```java 
//ResourcesScanner
Set<String> properties = 
    reflections.getResources(Pattern.compile(".*\\.properties"));
```

### 3.5 扫描方法、构造注解

```java 
//MethodAnnotationsScanner
Set<Method> resources =
    reflections.getMethodsAnnotatedWith(javax.ws.rs.Path.class);
Set<Constructor> injectables = 
    reflections.getConstructorsAnnotatedWith(javax.inject.Inject.class);
```

### 3.6 扫描字段注解

```java 
Set<Field> ids = 
    reflections.getFieldsAnnotatedWith(javax.persistence.Id.class);
```

### 3.7 扫描方法参数

```java 
//MethodParameterScanner
Set<Method> someMethods =
    reflections.getMethodsMatchParams(long.class, int.class);
Set<Method> voidMethods =
    reflections.getMethodsReturn(void.class);
Set<Method> pathParamMethods =
    reflections.getMethodsWithAnyParamAnnotated(PathParam.class);
```

### 3.8 扫描方法参数名

```java 
List<String> parameterNames = 
    reflections.getMethodParamNames(Method.class)
```

### 3.9 扫描方法调用情况

```java 
//MemberUsageScanner
Set<Member> usages = 
    reflections.getMethodUsages(Method.class)
```
