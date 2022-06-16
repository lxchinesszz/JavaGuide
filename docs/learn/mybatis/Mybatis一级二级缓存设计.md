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
password: 111
backtotop: true
title: 第06篇:Mybatis缓存设计
category: Mybatis
---


[官方文档](https://mybatis.net.cn/sqlmap-xml.html#cache)

:::tip
MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。本篇文章，小编将会在最短的时间呢，通过观察源码来深刻了解Mybatis的
一级二级缓存;然后在说如何定制。
:::




## 一、Mybatis Cache设计

在Mybatis中所有的缓存,都是实现自Cache接口。无论是一级缓存还是二级缓存都是实现这个接口。其中一级缓存是本地缓存，二级缓存是一个允许开发者扩展的
缓存(eg: ehcache/或者内置的很多缓存)。

```java 
public interface Cache {

  String getId();

  void putObject(Object key, Object value);

  Object getObject(Object key);

  Object removeObject(Object key);

  void clear();

  int getSize();

  default ReadWriteLock getReadWriteLock() {
    return null;
  }

}

```

## 二、一级缓存

一级缓存是本地缓存,其实就是PerpetualCache这类,它的源码也很简单,其实就是一个Map而已。一般面试的经常说一级缓存称为
SqlSession缓存,我们看其实最终实现是在BaseExecutor进行做的。就这么简单。

```java
public abstract class BaseExecutor implements Executor {

    // 一级缓存本地缓存
    protected PerpetualCache localCache;
    
    protected BaseExecutor(Configuration configuration, Transaction transaction) {
        this.transaction = transaction;
        this.deferredLoads = new ConcurrentLinkedQueue<>();
        this.localCache = new PerpetualCache("LocalCache");
    }
    
    // 执行查询后添加到一级缓存中
    private <E> List<E> queryFromDatabase(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
        List<E> list;
        localCache.putObject(key, EXECUTION_PLACEHOLDER);
        try {
          list = doQuery(ms, parameter, rowBounds, resultHandler, boundSql);
        } finally {
          localCache.removeObject(key);
        }
        localCache.putObject(key, list);
        if (ms.getStatementType() == StatementType.CALLABLE) {
          localOutputParameterCache.putObject(key, parameter);
        }
        return list;
      }
}  
```

## 三、二级缓存

二级缓存是基于装饰器模式,它允许开发者自定义缓存的实现,只要实现了Cache接口就行。通过装饰器的设计。
CachingExecutor从MappedStatement#getCache获取缓存的具体实现，从而进行缓存操作。

下面代码是看Mybatis是如何进行装饰器的。注意看注释。如果开启缓存,则包装器对Executor进行包装。

```java 
public class Configuration {
    public Executor newExecutor(Transaction transaction, ExecutorType executorType) {
        executorType = executorType == null ? defaultExecutorType : executorType;
        executorType = executorType == null ? ExecutorType.SIMPLE : executorType;
        Executor executor;
        if (ExecutorType.BATCH == executorType) {
          executor = new BatchExecutor(this, transaction);
        } else if (ExecutorType.REUSE == executorType) {
          executor = new ReuseExecutor(this, transaction);
        } else {
          executor = new SimpleExecutor(this, transaction);
        }
        // 如果开启缓存,则包装器对Executor进行包装
        if (cacheEnabled) {
          executor = new CachingExecutor(executor);
        }
        executor = (Executor) interceptorChain.pluginAll(executor);
        return executor;
  }
}
```

CachingExecutor在实际执行时候从MappedStatement#getCache获取缓存的具体实现，从而进行缓存操作。
看到查询是先从二级缓存中获取，如果没有获取到就从一级缓存中获取，还没有就查询db。


```java 
public class CachingExecutor implements Executor {

  @Override
  public <E> List<E> query(MappedStatement ms, Object parameterObject, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql)
      throws SQLException {
    // 从MappedStatement获取Cache
    Cache cache = ms.getCache();
    if (cache != null) {
      flushCacheIfRequired(ms);
      if (ms.isUseCache() && resultHandler == null) {
        ensureNoOutParams(ms, boundSql);
        @SuppressWarnings("unchecked")
        List<E> list = (List<E>) tcm.getObject(cache, key);
        if (list == null) {
          list = delegate.query(ms, parameterObject, rowBounds, resultHandler, key, boundSql);
          tcm.putObject(cache, key, list); // issue #578 and #116
        }
        return list;
      }
    }
    return delegate.query(ms, parameterObject, rowBounds, resultHandler, key, boundSql);
  }
}
```

注意这里可以看到如果指定了要进行缓存，但是没有指定缓存的type默认是 PERPETUAL(PerpetualCache
)

## 四、开启二级缓存

## 4.1 内置二级缓存

1. 首先开启配置
2. 同时在Mapper文件中添加<cache/>标签 (XMLMapperBuilder#cacheElement)
3. 或者是在Mapper类上添加@CacheNamespace注解(MapperAnnotationBuilder#parseCache)

```xml 
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 指定Mybatis使用log4j -->
    <settings>
        <setting name="logImpl" value="LOG4J"/>
        // 通过 cacheEnabled 进行配置,如果不配置默认是true
        <setting name="cacheEnabled" value="false"/>
    </settings>
</configuration>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="orm.example.dal.mapper.TUserMapper">
    // 添加cache标签
    <cache/>
</mapper>    
```

|属性|含义|
|:--|:--|
|eviction|缓存回收策略|
|flushInterval|缓存刷新间隔，缓存多长时间刷新一次，默认不清空，设置一个毫秒值|
|readOnly| 是否只读；true 只读|
|size|缓存存放多少个元素|
|type|指定自定义缓存的全类名(实现Cache 接口即可)|
|blocking|若缓存中找不到对应的key，是否会一直blocking，直到有对应的数据进入缓存。|

一共可以使用的二级缓存有以下这些。

![](https://img.springlearn.cn/blog/learn_1648571791000.png)

## 4.2 外置二级缓存

只要实现了Cache接口那么Mybatis就会调用这个接口实现进行缓存。下面只说一个思路。如下通过指定EhcacheCache
就可以将这个二级缓存的能力，交给Mybatis进行调用了。

```xml 
<cache type="org.mybatis.caches.ehcache.EhcacheCache" > 
      <property name="timeToIdleSeconds" value="3600"/>
      <property name="timeToLiveSeconds" value="3600"/>
      <!-- 同ehcache参数maxElementsInMemory -->
    <property name="maxEntriesLocalHeap" value="1000"/>
    <!-- 同ehcache参数maxElementsOnDisk -->
      <property name="maxEntriesLocalDisk" value="10000000"/>
      <property name="memoryStoreEvictionPolicy" value="LRU"/>
</cache>
```
