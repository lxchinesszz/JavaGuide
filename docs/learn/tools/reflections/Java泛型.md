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
title: Java泛型体系知识学习
---

<Djt/>

![](https://img.springlearn.cn/blog/learn_1652114729000.png)

## 一、Java泛型体系

Type 是 Java 语言中所有类型的公共父接口，其从 JDK5 开始引入，引入的目的主要是为了支持泛型。
Java的泛型体系还是比较复杂的, 不过没关系，本篇文章会从实战的角度来，学习泛型。

## 1.1 ParameterizedType 参数化泛型

ParameterizedType 是, `参数化泛型`只要记住凡是带泛型的是明确的类型,只要不是数组GenericArrayType那么一定是ParameterizedType。
如下:
- List<?> list 中的 list
- Map<String,String> map中的map
- Map<String,String> map中的map

### 1.1.1 API 说明

ParameterizedType 一共有3个方法如下。

```java 
public interface ParameterizedType extends Type {
    // 获取泛型信息，输一个数组。因为可能泛型有多个
    Type[] getActualTypeArguments();
    // 原始数据类型
    Type getRawType();
    // 
    Type getOwnerType();
}
```

- getRawType 获取原始数据类型
- getActualTypeArguments 获取泛型信息,因为泛型可以是多个,所以返回是数组

### 1.1.2 代码示例

```java 
public class Test {
    class Girl implements Person {}
    class Boy implements Person {}
    interface Person {}
    class School<A extends Boy & Person> {}
    School<Boy> boySchool;
    School<Boy>[] schools;
    @Test
    public void test() {
        // class java.lang.Class
        System.out.println(ReflectionUtils.findField(Test.class, "boy").getGenericType().getClass());
        // class sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl
        System.out.println(ReflectionUtils.findField(Test.class, "boySchool").getGenericType().getClass());
        // class sun.reflect.generics.reflectiveObjects.GenericArrayTypeImpl
        System.out.println(ReflectionUtils.findField(Test.class, "schools").getGenericType().getClass());
    }
}
```


- `boy` 是具体类型,且不是泛型,所以是Class类型
- `School<Boy> boySchool` 是具体类型,但是有泛型`<Boy>`,所以是ParameterizedType
  - `ParameterizedType#getActualTypeArguments` 下标0就是泛型`Boy`
- `School<Boy>[] schools` 是具体类型,有泛型`<Boy>`,但是是数组类型所以是GenericArrayType

## 1.2 GenericArrayType  泛型数组

`GenericArrayType`和`ParameterizedType`是比较类似的,唯一的区别是GenericArrayType一定是数组,如果不是数组就是ParameterizedType

### 1.2.1 API 说明

GenericArrayType 只提供了一个方法就是获取泛型的方法

```java 
public interface GenericArrayType extends Type {
    // 获取数组泛型
    Type getGenericComponentType();
}
```

### 1.2.2 代码示例

```java 
public class Test {
    class Girl implements Person {}
    class Boy implements Person {}
    interface Person {}
    class School<A extends Boy & Person> {}
    School<Boy> boySchool;
    School<Boy>[] schools;
    @Test
    public void test2(){
        GenericArrayType schoolsArrayType = (GenericArrayType) ReflectionUtils.findField(Test.class, "schools").getGenericType();
        Type genericComponentType = schoolsArrayType.getGenericComponentType();
        // learn.common.print.Test$School<learn.common.print.Test$Boy>
        System.out.println(genericComponentType.getTypeName());
        // class sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl
        System.out.println(genericComponentType.getClass());
    }
}  
```

- `School<Boy> boySchool` 是具体类型,且有泛型,但是`不是`数组所以是`ParameterizedType`
- `School<Boy>[] schools` 是具体类型,且有泛型,但是`是`数组所以就是`GenericArrayType`
  - `GenericArrayType#getGenericComponentType` = `School<Boy>` = `ParameterizedType`




## 1.3 TypeVariable 泛型变量

`TypeVariable`变量泛型是比较好判断的,只要是变量泛型。一定就是TypeVariable。

### 1.3.1 API 说明

```java 
public interface TypeVariable<D extends GenericDeclaration> extends Type, AnnotatedElement {
    // 获取泛型信息
    Type[] getBounds();

    D getGenericDeclaration();

    String getName();

    AnnotatedType[] getAnnotatedBounds();
}
```

### 1.3.2 代码示例

```java 
    class TypeVariableObj<A extends Number> {
        A a;
        TypeVariableObj<A> as;
    }
    @Test
    public void test3() {
        Type a = ReflectionUtils.findField(TypeVariableObj.class, "a").getGenericType();
        // class sun.reflect.generics.reflectiveObjects.TypeVariableImpl
        System.out.println(a.getClass());

        Type as = ReflectionUtils.findField(TypeVariableObj.class, "as").getGenericType();
        // class sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl
        System.out.println(as.getClass());
        Type[] actualTypeArguments = ((ParameterizedType) as).getActualTypeArguments();
        // A 因为只有1个泛型,所以直接去下标0
        TypeVariable actualTypeArgument = (TypeVariable) actualTypeArguments[0];
        System.out.println(actualTypeArgument.getTypeName());
    }
```

- `A a = TypeVariable`
- `TypeVariableObj<A> as = ParameterizedType`
  - `ParameterizedType#getActualTypeArguments()[0] = <A>`

  

## 1.4 WildcardType 泛型表达式

`WildcardType`也比较好判断只要是通配符,可以简单理解,直接带有 `?` 的泛型限定那么就是 `WildcardType`

### 1.4.1 API 说明

WildcardType通配符, 如 `?`, `? extends Number`, `? super Integer`

```java 
public interface WildcardType extends Type {
    // 泛型上限
    Type[] getUpperBounds();
    // 泛型下限
    Type[] getLowerBounds();
}
```

- `Type[] getUpperBounds();` //获得泛型表达式上界（上限） 获取泛型变量的上边界（extends） 
- `Type[] getLowerBounds();` //获得泛型表达式下界（下限） 获取泛型变量的下边界（super）

### 1.4.2 代码示例

```java 
public class WildcardTypeTest {
    Map<? extends String, ? super Number> map;
    @Test
    public void wildcardTypeTest() {
        Field map = ReflectionUtils.findField(WildcardTypeTest.class, "map");
        Type[] actualTypeArguments = ((ParameterizedType) map.getGenericType()).getActualTypeArguments();
        // ? extends java.lang.String
        System.out.println(((WildcardType) actualTypeArguments[0]).getTypeName());
        // class java.lang.String
        System.out.println(((WildcardType) actualTypeArguments[0]).getUpperBounds()[0]);
    }
}
```

- `Map<? extends String, ? super Number> map` 中 map是 `ParameterizedType`
  - `ParameterizedType#getActualTypeArguments[0]` = `WildcardType#getUpperBounds[0]` = `String`
  - `ParameterizedType#getActualTypeArguments[1]` = `WildcardType#getLowerBounds[0]` = `Number`


## 二、泛型获取

通过上面的学习,我们可以使用原始API来获取各种泛型的信息,而Spring中有一个比较好用的工具。屏蔽了底层的
具体实现。比较方便。

## 2.1 获取接口泛型

```java 
    class A {}
    class B {}
    interface School<T, K> {}
    interface X extends School<A, B> {}
    @Test
    public void test() {
        // 获取实现的接口是泛型的信息
        ResolvableType resolvableType = ResolvableType.forClass(X.class);
        Class<?> resolve1 = resolvableType.getInterfaces()[0].getGeneric(0).resolve();
        // class learn.common.print.ColorConsoleTest$A
        System.out.println(resolve1);
        Class<?> resolve2 = resolvableType.getInterfaces()[0].getGeneric(1).resolve();
        // class learn.common.print.ColorConsoleTest$B
        System.out.println(resolve2);
    }
```

## 2.2 获取父类泛型

```java 
    class A {}
    class B {}
    class School<T, K> {}
    class X extends School<A, B> {}
    @Test
    public void test() {
        // 获取实现的接口是泛型的信息
        ResolvableType resolvableType = ResolvableType.forClass(X.class);
        Class<?> resolve1 = resolvableType.getSuperType().getGeneric(0).resolve();
        // class learn.common.print.ColorConsoleTest$A
        System.out.println(resolve1);
        Class<?> resolve2 = resolvableType.getSuperType().getGeneric(1).resolve();
        // class learn.common.print.ColorConsoleTest$B
        System.out.println(resolve2);
    }
```

## 2.3 获取字段泛型

```java 
    class A {}
    class B {}
    class School<T, K> {}
    class X {
        private School<A, B> school;
    }

    @Test
    public void test() {
        // Spring的提供工具类,用于字段的泛型信息,Person<String>
        ResolvableType resolvableType = ResolvableType.forField(Objects.requireNonNull(ReflectionUtils.findField(X.class, "school")));
        System.out.println(resolvableType);
        Class<?> resolve1 = resolvableType.getGeneric(0).resolve();
        // class learn.common.print.ColorConsoleTest$A
        System.out.println(resolve1);
        Class<?> resolve2 = resolvableType.getGeneric(1).resolve();
        // class learn.common.print.ColorConsoleTest$B
        System.out.println(resolve2);
    }
```

## 2.4 获取方法泛型

```java 
    class A {}
    class B {}
    class School<T, K> {}
    class X {
        public School<A, B> getSchool() {
            return null;
        }
    }

    @Test
    public void test() {
        // Spring的提供工具类,用于字段的泛型信息,Person<String>
        ResolvableType resolvableType = ResolvableType.forMethodReturnType(Objects.requireNonNull(ReflectionUtils.findMethod(X.class, "getSchool")));
        System.out.println(resolvableType);
        Class<?> resolve1 = resolvableType.getGeneric(0).resolve();
        // class learn.common.print.ColorConsoleTest$A
        System.out.println(resolve1);
        Class<?> resolve2 = resolvableType.getGeneric(1).resolve();
        // class learn.common.print.ColorConsoleTest$B
        System.out.println(resolve2);
    }
```
