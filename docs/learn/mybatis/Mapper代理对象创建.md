---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: true
footer: true
password: 111
backtotop: true
title: 第04篇:Mybatis代理对象生成
---

<PageBanner/>


## 一、思路分析

1. 为Mapper接口,生成代理类。
2. 解析Mapper.xml或者是@Select等注解生成Sql信息
3. 解析方法的参数解析@Param
4. 执行Sql语句并解析数据转换成方法的返回值。

## 二、源码分析

## 2.1 MapperProxyFactory 代理工厂

```java 
public class MapperProxyFactory<T> {

  private final Class<T> mapperInterface;
  private final Map<Method, MapperMethodInvoker> methodCache = new ConcurrentHashMap<>();

  // Jdk代理Proxy,可以看到主要逻辑在MapperProxy中
  protected T newInstance(MapperProxy<T> mapperProxy) {
    return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);
  }

  public T newInstance(SqlSession sqlSession) {
    final MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession, mapperInterface, methodCache);
    return newInstance(mapperProxy);
  }

}
```

## 2.2 MapperProxy 代理逻辑

MapperProxy 的代理逻辑其实非常简单,就以下三个能力,看图理解。


![](https://img.springlearn.cn/blog/learn_1649079715000.png)

下面将核心的处理代码给挑选了出来,增加了注释。

```java 
public class MapperProxy<T> implements InvocationHandler, Serializable {
  @Override
  public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    try {
      // Object方法直接执行
      if (Object.class.equals(method.getDeclaringClass())) {
        return method.invoke(this, args);
      } else {
        // 其他方法生成代理方法
        return cachedInvoker(method).invoke(proxy, method, args, sqlSession);
      }
    } catch (Throwable t) {
      throw ExceptionUtil.unwrapThrowable(t);
    }
  }
  
  private MapperMethodInvoker cachedInvoker(Method method) throws Throwable {
    try {
      return MapUtil.computeIfAbsent(methodCache, method, m -> {
        // 如果是默认方法
        if (m.isDefault()) {
          try {
            if (privateLookupInMethod == null) {
              // 生成java8的语法解析生成代理方法
              return new DefaultMethodInvoker(getMethodHandleJava8(method));
            } else {
              // // 生成java9的语法解析生成代理方法
              return new DefaultMethodInvoker(getMethodHandleJava9(method));
            }
          } catch (IllegalAccessException | InstantiationException | InvocationTargetException
              | NoSuchMethodException e) {
            throw new RuntimeException(e);
          }
        } else {
        // 不是默认方法，生成代理方法 MapperMethod
          return new PlainMethodInvoker(new MapperMethod(mapperInterface, method, sqlSession.getConfiguration()));
        }
      });
    } catch (RuntimeException re) {
      Throwable cause = re.getCause();
      throw cause == null ? re : cause;
    }
  }
}
```

## 2.3 MapperMethod

MapperProxy 方法的三个主要能力, 其实最重要的是需要生成sql进行执行的能力，最终是交给MapperMethod来处理了。
下面我们主要看下 MapperMethod 的方法构成。同样我们看图说话。

![](https://img.springlearn.cn/blog/learn_1649082086000.png)

1. 判断方法DML类型（增删改查）- SqlCommand
2. 解析方法参数信息 - MethodSignature
3. 分别调用SqlSession的增删改查方法 - execute

```java {5}
public class MapperMethod {
  // sql命令
  private final SqlCommand command;
  // 方法签名，提供一些工具方法
  private final MethodSignature method;

  public MapperMethod(Class<?> mapperInterface, Method method, Configuration config) {
    this.command = new SqlCommand(config, mapperInterface, method);
    this.method = new MethodSignature(config, mapperInterface, method);
  }

  public Object execute(SqlSession sqlSession, Object[] args){}
}  
```

### 2.3.1 SqlCommand

SqlCommand 用来判断Sql的类型, 确定调用哪个SqlSession方法。但是核心的逻辑也不是由它来实现，它也是从Configuration中去获取。
我们看下下面的伪代码。

```java 
SqlCommand sqlCommand = new SqlCommand(config, mapperInterface, method);

// 构造参数中找MappedStatement
public SqlCommand(Configuration configuration, Class<?> mapperInterface, Method method) {
      final String methodName = method.getName();
      final Class<?> declaringClass = method.getDeclaringClass();
      MappedStatement ms = resolveMappedStatement(mapperInterface, methodName, declaringClass,
          configuration);
}          
// 寻找方法是接口全路径名.方法名
private MappedStatement resolveMappedStatement(){
    String statementId = mapperInterface.getName() + "." + methodName;
    configuration.hasStatement(statementId)
}
```

1. 组装statementId 调用 Configuration#hasStatement(statementId)
2. MappedStatement#getSqlCommandType

说明MappedStatement才是主要方法。这个类前面我们讲了,主要有2种生成的方法。第一种是xml方式。
第二种是注解方式。

我们分别来看如何实现的。

**xml方式**

解析xml标签来实现 

XMLMapperBuilder#parseStatementNode
```java
public class XMLStatementBuilder extends BaseBuilder {
 public void parseStatementNode() {
    String id = context.getStringAttribute("id");
    String databaseId = context.getStringAttribute("databaseId");

    if (!databaseIdMatchesCurrent(id, databaseId, this.requiredDatabaseId)) {
      return;
    }

    String nodeName = context.getNode().getNodeName();
    SqlCommandType sqlCommandType = SqlCommandType.valueOf(nodeName.toUpperCase(Locale.ENGLISH));
  }
}  
public enum SqlCommandType {
  UNKNOWN, INSERT, UPDATE, DELETE, SELECT, FLUSH
}    
```

**注解方式**
一定是解析注解方法 `AnnotationWrapper`
MapperAnnotationBuilder#getAnnotationWrapper(method, true, statementAnnotationTypes)

```java 
private class AnnotationWrapper {
    private final Annotation annotation;
    private final String databaseId;
    private final SqlCommandType sqlCommandType;

    AnnotationWrapper(Annotation annotation) {
      super();
      this.annotation = annotation;
      if (annotation instanceof Select) {
        databaseId = ((Select) annotation).databaseId();
        sqlCommandType = SqlCommandType.SELECT;
      } else if (annotation instanceof Update) {
        databaseId = ((Update) annotation).databaseId();
        sqlCommandType = SqlCommandType.UPDATE;
      } else if (annotation instanceof Insert) {
        databaseId = ((Insert) annotation).databaseId();
        sqlCommandType = SqlCommandType.INSERT;
      } else if (annotation instanceof Delete) {
        databaseId = ((Delete) annotation).databaseId();
        sqlCommandType = SqlCommandType.DELETE;
      } else if (annotation instanceof SelectProvider) {
        databaseId = ((SelectProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.SELECT;
      } else if (annotation instanceof UpdateProvider) {
        databaseId = ((UpdateProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.UPDATE;
      } else if (annotation instanceof InsertProvider) {
        databaseId = ((InsertProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.INSERT;
      } else if (annotation instanceof DeleteProvider) {
        databaseId = ((DeleteProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.DELETE;
      } else {
        sqlCommandType = SqlCommandType.UNKNOWN;
        if (annotation instanceof Options) {
          databaseId = ((Options) annotation).databaseId();
        } else if (annotation instanceof SelectKey) {
          databaseId = ((SelectKey) annotation).databaseId();
        } else {
          databaseId = "";
        }
      }
    }

    Annotation getAnnotation() {
      return annotation;
    }

    SqlCommandType getSqlCommandType() {
      return sqlCommandType;
    }
}    
```


### 2.3.2 MethodSignature

前面我们知道了SqlCommand是判断sql的类型,那么就是做第二件是,解析方法的参数。传递给SqlSession进行执行。
我们看下MethodSignature都有那些能力。

```java 
  public static class MethodSignature {
    // 是否返回集合
    private final boolean returnsMany;
    // 是否返回是map结构
    private final boolean returnsMap;
    // 是否没有返回值
    private final boolean returnsVoid;
    // 是否返回的是游标
    private final boolean returnsCursor;
    // 是否返回的是Optional对象
    private final boolean returnsOptional;
    // 返回值类型
    private final Class<?> returnType;
    // 返回map结构使用的key字段
    private final String mapKey;
    // 如果入参是ResultHandler 记录器下标
    private final Integer resultHandlerIndex;
    // 如果参数是RowBounds，记录其下标
    private final Integer rowBoundsIndex;
    // 参数处理
    private final ParamNameResolver paramNameResolver;
    
  }  
```

前面我们说了MethodSignature能解析参数，解析参数的方法就在下面。

```java 
 public Object convertArgsToSqlCommandParam(Object[] args) {
      return paramNameResolver.getNamedParams(args);
 }
```

参数会被解析成什么样呢?

```java 
 public Object getNamedParams(Object[] args) {
    final int paramCount = names.size();
    // 没有参数直接返回
    if (args == null || paramCount == 0) {
      return null;
    } else if (!hasParamAnnotation && paramCount == 1) {
      // 没有注解只有一个参数
      Object value = args[names.firstKey()];
      return wrapToMapIfCollection(value, useActualParamName ? names.get(0) : null);
    } else {
      final Map<String, Object> param = new ParamMap<>();
      int i = 0;
      // names key = 参数下标 value = @Param里面的值
      for (Map.Entry<Integer, String> entry : names.entrySet()) {
        // key = @Param里面的值,value = args[index] 真实数据
        param.put(entry.getValue(), args[entry.getKey()]);
        // 生成param1,参数
        final String genericParamName = GENERIC_NAME_PREFIX + (i + 1);
        // ensure not to overwrite parameter named with @Param
        if (!names.containsValue(genericParamName)) {
          param.put(genericParamName, args[entry.getKey()]);
        }
        i++;
      }
      return param;
    }
  }
```

|参数类型|方法签名|参数值|结果|
|:--|:--|:--|:--|
|解析单参数不带@Param|TUser queryUserByName(String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{"孙悟空"})|孙悟空|
|解析单参数带@Param|TUser queryUserById(@Param("userId") Long id)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L})|{userId=1, param1=1}|
|解析多参数不带@Param|TUser queryUserByTokenId(Long tokenId,String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L, "孙悟空"})|{arg0=1, arg1=孙悟空, param1=1, param2=孙悟空}|
|解析多参数带@Param|TUser queryUserByTokenId(@Param("tokenId") Long tokenId, @Param("name") String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L, "孙悟空"})|{tokenId=1, name=孙悟空, param1=1, param2=孙悟空}|


