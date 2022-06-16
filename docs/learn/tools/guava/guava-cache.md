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
title: Guava-cache
---

![](https://img.springlearn.cn/blog/learn_1588264022000.png)

**本篇主要是本地缓存代码实战，提供业务中常用的本地缓存使用代码片段(直接跳过看标题五)**

:::info 写在前面
常在业务系统中做开发,不会点高级知识点,有点不好意思了。在业务系统中，提高系统响应速度，提供系统高并发能力，其实方向很简单，三个方向,六个字而已: **缓存降级限流。**
当然这是在排除代码质量非常差的情况，如果代码质量很差，都是while循环和高内存占用，那么其实再怎么做都于事无补。除非你有一个马云爸爸，性能不够，机器来凑嘛。阿里云前来支持(1000台机器够了吗?)
:::

![](https://cdn.nlark.com/yuque/0/2020/png/182855/1588128723239-12cbd329-ab03-4e8c-86be-fd63da9cb39f.png?x-oss-process=image%2Fresize%2Cw_1492)


## 一、什么是Guava Cache

```
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>29.0-jre</version>
</dependency>
```

其实就是Google提供的一个开发工具包,里面有很多好用的Java开工具,比如我们本文将的Cache缓存能力。
说到缓存,每个业务系统中现在都会用到缓存,常用的缓存数据库就是Redis和Memcache,这两款kv数据库最常用的场景就是当缓存使用，极其适合在微服务架构下做缓存使用。速度是极高的，但是跟本地缓存来比，还是算慢的，毕竟本地缓存其实就相当于一个Map集合，本地缓存获取没有网络IO。但是最大的缺点是每台服务器的本地缓存是不能共享的。所以如果要用分布式缓存就可以跳过了。因为本文将的本地缓存使用。


说到底其实缓存我们就可以理解为是一个Map集合，不过生产中我们不能用Map来做缓存，除非是缓存的数据只有一点点一点点。否则如果数据量瞬时或者数据积累量很大，很容易就直接就把Map撑爆。导致内存溢出,服务宕机下线风险。 所以我们必须要对Map做控制。
1. 控制数据量大小
2. 控制数据生命周期
3. 如果能做些数据命中率统计更好了


对，以上就是Guava Cache已经为我们做好的能力了。我们只用使用就可以了


## 二、什么场景适合缓存
不长更新的数据都可以使用缓存，只要我们定时去刷新缓存获取最新的数据就可以了。
注意: 凡是使用GuavaCache的地方都可以使用RedisCache,但是使用RedisCache的地方不一定可以使用GuavaCache。因为前面我们也说了Guava是本地缓存，不支持多服务器数据共享,如果要共享缓存数据直接用Redis是更好的选择。

## 三、使用本地缓存,高并发会把机器打爆
这个担心是逻辑思考的必然,使用缓存主要是提高系统响应效率的,如果用不过把机器搞爆就不好了。所以这种担心很有必要，但是只要弄清楚没参数或者它的实现原理就不用担心了。4和5是快速入门即代码片段，直接根据代码去做不会有问题。


## 四、快速入门API
CacheBuilder

| 属性             | 作用             | 例子                                 |
| ---------------- | ---------------- | ------------------------------------ |
| removalListener  | 缓存移除的监听   | 对指定key的删除,做监听               |
| maximumSize      | 设置最大缓存数量 | 当达到最大数量，会删除多余的缓存记录 |
| expireAfterWrite | 设置过期时间     | 过期的缓存自动移除                   |
| recordStats      | 统计信息         | 统计缓存命中率                       |

### 1. 设置最大缓存数量

```java
    Cache<String,String> cache = CacheBuilder.newBuilder()
                                 .maximumSize(2).build();
    cache.put("key1","value1");
    cache.put("key2","value2");
    cache.put("key3","value3");
    // 第一个key是null，因为指定缓存数量是2个，当超过就删除前面一条
    System.out.println("第一个值:" + cache.getIfPresent("key1"));
    System.out.println("第一个值:" + cache.getIfPresent("key2"));
    System.out.println("第一个值:" + cache.getIfPresent("key3"));
```

### 2. 设置过期时间

```java 
    Cache<String,String> cache = CacheBuilder.newBuilder()
                                 .maximumSize(2)
                                 .expireAfterWrite(3,TimeUnit.SECONDS)
                                     .build();
    cache.put("key1","value1");
    int time = 1;
    while(true){
        System.out.println("第" + time ++ "次取到的key1的值为：" + cache.getIfPresent("key1"));
        Thread.sleep(1000)
    }
```
### 3. 统计命中率

```java 
    Cache<String,String> cache = CacheBuilder.newBuilder()
                                 .maximumSize(3)
                                 .recordStats()
                                     .build();
    cache.put("key1","value1");
    cache.put("key2","value2");
    cache.put("key3","value3");
    
    cache.getIfPresent("key1")
    cache.getIfPresent("key1")
    cache.getIfPresent("key2")
    cache.getIfPresent("key3")
    // 获取统计信息
    System.out.println(cache.stats());
```

**CacheStats**

|属性值|含义|
|:--|:--|
|requestCount|返回cache查找缓存的次数|
|hitCount|命中缓存的次数|
|missCount|未命中缓存的次数|
|missRate|返回缓存请求未命中的比率，未命中次数除以请求次数 |
|loadCount|返回缓存调用load方法加载新值的次数|
|loadSuccessCount|返回缓存加载新值的成功次数|
|loadExceptionCount|返回缓存加载新值出现异常的次数|
|loadExceptionRate|返回缓存加载新值出现异常的比率|
|totalLoadTime|返回缓存加载新值所耗费的总时间|
|averageLoadPenalty|缓存加载新值的耗费的平均时间，加载的次数除以加载的总时间|
|evictionCount|返回缓存中条目被移除的次数|

## 五、代码片段

```java 
    private LoadingCache<Long,UserInfoDTO> userCache;
    
    {
        userCache =  CacheBuilder.newBuilder().maximumSize(30)//缓存30条数据
                .expireAfterWrite(10,TimeUnit.SECONDS) // 缓存时间10s
                    .build(// 缓存加载器，如果没有找到key,就去加载这个key到缓存中
                new CacheLoader<Long,UserInfoDTO>(){
                    @Override
                    public UserInfoDTO load(Long key) throws Exception{
                        return userService.queryById(key);
                    }
                }
            )
    }
    
    public UserInfoDTO queryUserInfoByIdFromCache(Long userId){
        return userCache.get(userId);
    }
```

