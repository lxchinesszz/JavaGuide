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
title: 第07篇:Mybatis缓存装饰器
category: Mybatis
---


![](https://img.springlearn.cn/blog/learn_1648571408000.png)


:::tip
MyBatis 对缓存的设计是非常巧妙的。花样很多,但却不是真的花样。因为`Mybatis`只是对 `Map`数据结构的封装, 但是却实现了很多挺好用的能力。
如果单单从设计模式上的角度来,其实就是典型的装饰器模式, 装饰器模式其实并不难,所以我们不讲设计模式, 本篇文章我们来看看`Mybatils` 缓存设计巧妙的点。
:::

[官方文档](https://mybatis.net.cn/sqlmap-xml.html#cache)

下面通过简单的代码review来分析下这11个缓存类设计的巧妙点。（因为是对博客重构,历史图片就没有补充,图上只有10个,请讲究下）

---
## 一、模式分析

![](https://img.springlearn.cn/blog/learn_1648571612000.png)
从目录就很清晰看出,核心就是`impl` 包下面只有一个,其他都是装饰器模式，在
`decorators` 包下

:::tip

其实上面就是`Mybatis` 关于 `Cache` 的核心实现,其实看到这里还没有很多知识点. 那么我们从中能学到什么呢? 如果真要找一条学习的点,那么就是:

设计要面向接口设计，而不是具体实现。 这样当我们要重写 `Cache` ，比如说我们不想底层用 `HashMap` 来实现了,其实我们只要实现一下 `Cache` 接口，然后替换掉`PerpetualCache`就可以了。对于使用者其实并不感知。

:::
## 1.1 Cache

接口设计没有什么好讲的，提供获取和添加方法，跟Map接口一样。 本篇我们要一起Review的类都会实现该接口的。

(这句话简直就是废话,大佬勿喷,就是简单提醒。意思就是其实代码不难)

```java
public interface Cache {

  String getId();
  
  void putObject(Object key, Object value);
  
  Object getObject(Object key);

  Object removeObject(Object key);

  void clear();

  int getSize();
  
  ReadWriteLock getReadWriteLock();

}
```

## 1.2 PerpetualCache

这个类就是 `Mybatis` 缓存最底层的设计, 看一下就知道其实是对 `Map` 的封装。
其实我们只要知道他是简单的 `HashMap` 的封装就可以了。因为代码实战是太简单了,没啥分析的。

```java
public class PerpetualCache implements Cache {
  // 唯一标识
  private final String id;
  // 就是一个HashMap结构
  private Map<Object, Object> cache = new HashMap<Object, Object>();

  public PerpetualCache(String id) {
    this.id = id;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public int getSize() {
    return cache.size();
  }

  @Override
  public void putObject(Object key, Object value) {
    cache.put(key, value);
  }

  @Override
  public Object getObject(Object key) {
    return cache.get(key);
  }

  @Override
  public Object removeObject(Object key) {
    return cache.remove(key);
  }

  @Override
  public void clear() {
    cache.clear();
  }
  // 基本没啥用,外层谁要用,谁重写
  @Override
  public ReadWriteLock getReadWriteLock() {
    return null;
  }

  @Override
  public boolean equals(Object o) {
    if (getId() == null) {
      throw new CacheException("Cache instances require an ID.");
    }
    if (this == o) {
      return true;
    }
    if (!(o instanceof Cache)) {
      return false;
    }

    Cache otherCache = (Cache) o;
    return getId().equals(otherCache.getId());
  }

  @Override
  public int hashCode() {
    if (getId() == null) {
      throw new CacheException("Cache instances require an ID.");
    }
    return getId().hashCode();
  }

}

```


## 二、开始重头戏

从这里我们主要一起看下,代码设计的巧妙之处,一个一个研究下,以下这10个类。看 `Mybatis` 是如何巧妙设计的。

![](https://img.springlearn.cn/blog/learn_1648571791000.png)

## 2.1 BlockingCache
BlockingCache是一个简单和低效的`Cache`的装饰器,我们主要看几个重要方法。
```java
public class BlockingCache implements Cache {

  private long timeout;
  //实现Cache接口的缓存对象
  private final Cache delegate;
  //对每个key生成一个锁对象
  private final ConcurrentHashMap<Object, ReentrantLock> locks;

  public BlockingCache(Cache delegate) {
    this.delegate = delegate;
    this.locks = new ConcurrentHashMap<Object, ReentrantLock>();
  }

  @Override
  public String getId() {
    return delegate.getId();
  }

  @Override
  public int getSize() {
    return delegate.getSize();
  }

  @Override
  public void putObject(Object key, Object value) {
    try {
      delegate.putObject(key, value);
    } finally {
      //释放锁。 为什么不加锁? 所以get和put是组合使用的，当get加锁,如果没有就查询数据库然后put释放锁，然后其他线程就可以直接用缓存数据了。
      releaseLock(key);
    }
  }

  @Override
  public Object getObject(Object key) {
    //1. 当要获取一个key,首先对key进行加锁操作,如果没有锁就加一个锁,有锁就直接锁
    acquireLock(key);
    Object value = delegate.getObject(key);
    if (value != null) {
      //2. 如果缓存命中,就直接解锁
      releaseLock(key);
    }
    //3. 当value=null, 就是说没有命中缓存,那么这个key就会被锁住,其他线程进来都要等待
    return value;
  }

  @Override
  public Object removeObject(Object key) {
    // 移除key的时候,顺便清楚缓存key的锁对象
    releaseLock(key);
    return null;
  }

  @Override
  public void clear() {
    delegate.clear();
  }

  @Override
  public ReadWriteLock getReadWriteLock() {
    return null;
  }
  
  private ReentrantLock getLockForKey(Object key) {
    ReentrantLock lock = new ReentrantLock();
    ReentrantLock previous = locks.putIfAbsent(key, lock);
    //如果key对应的锁存在就返回,没有就创建一个新的
    return previous == null ? lock : previous;
  }
  
  private void acquireLock(Object key) {
    Lock lock = getLockForKey(key);
    //1. 如果设置超时时间,就可以等待timeout时间(如果超时了报错)
    if (timeout > 0) {
      try {
        boolean acquired = lock.tryLock(timeout, TimeUnit.MILLISECONDS);
        if (!acquired) {
          throw new CacheException("Couldn't get a lock in " + timeout + " for the key " +  key + " at the cache " + delegate.getId());  
        }
      } catch (InterruptedException e) {
        throw new CacheException("Got interrupted while trying to acquire lock for key " + key, e);
      }
    } else {
      //2. 如果没有设置,直接就加锁(如果这个锁已经被人用了,那么就一直阻塞这里。等待上一个释放锁)
      lock.lock();
    }
  }
  
  private void releaseLock(Object key) {
    ReentrantLock lock = locks.get(key);
    if (lock.isHeldByCurrentThread()) {
      lock.unlock();
    }
  }

  public long getTimeout() {
    return timeout;
  }

  public void setTimeout(long timeout) {
    this.timeout = timeout;
  }  
}
```


**建议**看代码注释

| 方法          | 解释                                             |
| ------------- | ------------------------------------------------ |
| acquireLock   | 加锁操作                                         |
| getObject     | 进来加锁,如果缓存存在就释放锁,不存在就不释放锁。 |
| putObject     | 添加元素并释放锁                                 |
| removeObject  | 移除key的时候,顺便清楚缓存key的锁对象            |
| getLockForKey | 如果key对应的锁存在就返回,没有就创建一个新的     |

**思考**
1. 这个因为每次key请求都会加lock真的会很慢吗? 我们举两种场景。

注意这个加lock并不是对get方法加lock,而是对每个要get的key来加lock。

**场景一:** 试想一种场景,当有10个线程同时从数据库查询一个key为123的数据时候，当第一个线程来首先从cache中读取时候，这个时候其他九个线程是会阻塞的，因为这个key已经被加lock了。当第一个线程get这个key完成时候，其他线程才能继续走。这种场景来说是不好的，

**场景二:** 但是当第一个线程来发现cache里面没有数据这个时候其他线程会阻塞，而第一个线程会从db中查询，然后在put到cache里面。这样其他9个线程就不需要在去查询db了,就减少了9次db查询。


## 2.2 FifoCache
**FIFO( First Input First Output),简单说就是指先进先出**

如何实现先进先出呢? 其实非常简单,当put时候,先判断是否需要执行淘汰策略,如果要执行淘汰,就 移除先进来的。 直接通过 `Deque` API 来实现先进先出。

```java
  private final Cache delegate;
  private final Deque<Object> keyList;
  private int size;

  public FifoCache(Cache delegate) {
    this.delegate = delegate;
    this.keyList = new LinkedList<Object>();
    this.size = 1024;
  }

@Override
  public void putObject(Object key, Object value) {
      //1. put时候就判断是否需要淘汰
    cycleKeyList(key);
    delegate.putObject(key, value);
  }
  private void cycleKeyList(Object key) {
    keyList.addLast(key);
    //1. size默认如果大于1024就开始淘汰
    if (keyList.size() > size) {
      //2. 利用Deque队列移除第一个。
      Object oldestKey = keyList.removeFirst();
      delegate.removeObject(oldestKey);
    }
  }
```

## 2.3 LoggingCache
从名字上看就是跟日志有关， `LoggingCache` 会在 `debug`级别下把缓存命中率给统计出来,然后通过日志系统打印出来。

```java
public Object getObject(Object key) {
    requests++;
    final Object value = delegate.getObject(key);
    if (value != null) {
      hits++;
    }
    //1. 打印缓存命中率
    if (log.isDebugEnabled()) {
      log.debug("Cache Hit Ratio [" + getId() + "]: " + getHitRatio());
    }
    return value;
  }
```

除此之外没有什么其他功能。我们主要看下他是如何统计缓存命中率的。其实很简单。

```java
public class LoggingCache implements Cache {

  private final Log log;
  private final Cache delegate;
  //1. 总请求次数
  protected int requests = 0;
  //2. 命中次数
  protected int hits = 0;
 
  ...
}  
```

在get请求时候无论是否命中,都自增总请求次数( `request` ), 当get命中时候自增命中次数( `hits` )

```java
public Object getObject(Object key) {
    //1. 无论是否命中,都自增总请求次数( `request` )
    requests++;
    final Object value = delegate.getObject(key);
    if (value != null) {
      //2. get命中时候自增命中次数( `hits` )
      hits++;
    }
    if (log.isDebugEnabled()) {
      log.debug("Cache Hit Ratio [" + getId() + "]: " + getHitRatio());
    }
    return value;
  }
```

然后我们看命中率怎么算 `getHitRatio()`

`命中率 = 命中次数 / 总请求次数`
```java
 private double getHitRatio() {
    return (double) hits / (double) requests;
  }
```


## 2.4 LruCache
LRU是Least Recently Used的缩写，即最近最少使用。

首先我们看如何实现 `LRU` 策略。
它其实就是利用 `LinkedHashMap`来实现 `LRU` 策略, `JDK` 提供的 `LinkedHashMap`天然就支持 `LRU` 策略。
`LinkedHashMap` 有一个特点如果开启LRU策略后,每次获取到数据后,都会把数据放到最后一个节点，这样第一个节点肯定是最近最少用的元素。

```java
public V get(Object key) {
        Node<K,V> e;
        if ((e = getNode(hash(key), key)) == null)
            return null;
        //1. 判断是否开始LRU策略
        if (accessOrder)
            //2. 开启就往后面放
            afterNodeAccess(e);
        return e.value;
    }
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019122316004441.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)
构造中先声明LRU淘汰策略,当size()大于构造中声明的1024就可以在每次
putObject时候将要淘汰的移除掉。这点非常的巧妙,不知道你学习到了没 ?


![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223160143543.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

## 2.5 ScheduledCache

定时删除,设计巧妙,可以借鉴。

```java
public class ScheduledCache implements Cache {

  private final Cache delegate;
  protected long clearInterval;
  protected long lastClear;

  public ScheduledCache(Cache delegate) {
    this.delegate = delegate;
    //1. 指定多久清理一次缓存
    this.clearInterval = 60 * 60 * 1000; // 1 hour
    //2. 设置初始值
    this.lastClear = System.currentTimeMillis();
  }

  public void setClearInterval(long clearInterval) {
    this.clearInterval = clearInterval;
  }

  @Override
  public String getId() {
    return delegate.getId();
  }

  @Override
  public int getSize() {
    clearWhenStale();
    return delegate.getSize();
  }

  @Override
  public void putObject(Object key, Object object) {
    clearWhenStale();
    delegate.putObject(key, object);
  }

  @Override
  public Object getObject(Object key) {
    return clearWhenStale() ? null : delegate.getObject(key);
  }

  @Override
  public Object removeObject(Object key) {
    clearWhenStale();
    return delegate.removeObject(key);
  }

  @Override
  public void clear() {
    //1. 记录最近删除一次时间戳
    lastClear = System.currentTimeMillis();
    //2. 清理掉缓存信息
    delegate.clear();
  }

  @Override
  public ReadWriteLock getReadWriteLock() {
    return null;
  }

  @Override
  public int hashCode() {
    return delegate.hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    return delegate.equals(obj);
  }

  private boolean clearWhenStale() {
    if (System.currentTimeMillis() - lastClear > clearInterval) {
      clear();
      return true;
    }
    return false;
  }

}

```

**核心代码**

1. 构造中指定多久清理一次缓存(1小时)
2. 设置初始值
3. `clearWhenStale()` 核心方法
4. 然后在每个方法中调用一次这段代码,判断是否需要清理。

```java
private boolean clearWhenStale() {
    //1. 当前时间 - 最后清理时间,如果大于定时删除时间,说明要执行清理了。
    if (System.currentTimeMillis() - lastClear > clearInterval) {
      clear();
      return true;
    }
    return false;
  }
```

## 2.6 SerializedCache

从名字上看就是支持序列化的缓存,那么我们就要问了，为啥要支持序列化?

**为啥要支持序列化?**

因为如果多个用户同时共享一个数据对象时，同时都引用这一个数据对象。如果有用户修改了这个数据对象，那么其他用户拿到的就是已经修改过的对象，这样就是出现了线程不安全。

**如何解决这种问题**

1. 加锁当一个线程在操作时候,其他线程不允许操作
2. 新生成一个对象,这样多个线程获取到的数据就不是一个对象了。

**只看一下核心代码**

1. `putObject` 将对象序列化成`byte[]`
2. `getObject` 将`byte[]`反序列化成对象

```java
public void putObject(Object key, Object object) {
    if (object == null || object instanceof Serializable) {
      //1. 将对象序列化成byte[]
      delegate.putObject(key, serialize((Serializable) object));
    } else {
      throw new CacheException("SharedCache failed to make a copy of a non-serializable object: " + object);
    }
  }
private byte[] serialize(Serializable value) {
    try {
      ByteArrayOutputStream bos = new ByteArrayOutputStream();
      ObjectOutputStream oos = new ObjectOutputStream(bos);
      oos.writeObject(value);
      oos.flush();
      oos.close();
      return bos.toByteArray();
    } catch (Exception e) {
      throw new CacheException("Error serializing object.  Cause: " + e, e);
    }
  }

 public Object getObject(Object key) {
    Object object = delegate.getObject(key);
    //1. 获取时候将byte[]反序列化成对象
    return object == null ? null : deserialize((byte[]) object);
  }
  private Serializable deserialize(byte[] value) {
    Serializable result;
    try {
      ByteArrayInputStream bis = new ByteArrayInputStream(value);
      ObjectInputStream ois = new CustomObjectInputStream(bis);
      result = (Serializable) ois.readObject();
      ois.close();
    } catch (Exception e) {
      throw new CacheException("Error deserializing object.  Cause: " + e, e);
    }
    return result;
  }
```

这种就类似于深拷贝,因为简单的浅拷贝会出现线程安全问题,而这种办法,因为字节在被反序列化时，会在创建一个新的对象，这个新的对象的数据和原来对象的数据一模一样。所以说跟深拷贝一样。

[Java开发之深浅拷贝](https://blog.springlearn.cn/posts/43446/)


## 2.7 SoftCache
从名字上看,Soft其实就是软引用。软引用就是如果内存够,GC就不会清理内存,只有当内存不够用了会出现OOM时候,才开始执行GC清理。

如果要看明白这个源码首先要先了解一点垃圾回收,垃圾回收的前提是还有没有别的地方在引用这个对象了。如果没有别的地方在引用就可以回收了。
本类中为了阻止被回收所以声明了一个变量`hardLinksToAvoidGarbageCollection`，
也指定了一个将要被回收的垃圾队列`queueOfGarbageCollectedEntries` 。

这个类的主要内容是当缓存value已经被垃圾回收了，就自动把key也清理。

`Mybatis` 在实际中并没有使用这个类。

```java
public class SoftCache implements Cache {
  private final Deque<Object> hardLinksToAvoidGarbageCollection;
  private final ReferenceQueue<Object> queueOfGarbageCollectedEntries;
  private final Cache delegate;
  private int numberOfHardLinks;

  public SoftCache(Cache delegate) {
    this.delegate = delegate;
    this.numberOfHardLinks = 256;
    this.hardLinksToAvoidGarbageCollection = new LinkedList<Object>();
    this.queueOfGarbageCollectedEntries = new ReferenceQueue<Object>();
  }
}  
```
**先看下变量声明**

`hard Links To Avoid Garbage Collection`
硬连接,避免垃圾收集
`queue Of Garbage Collected Entries`
垃圾要收集的队列
`number Of Hard Links`
硬连接数量

```java
@Override
  public void putObject(Object key, Object value) {
    //1. 清除已经被垃圾回收的key
    removeGarbageCollectedItems();
    //2. 注意看SoftEntry(),声明一个SoftEnty对象,指定垃圾回收后要进入的队列
    //3. 当SoftEntry中数据要被清理,会添加到类中声明的垃圾要收集的队列中
    delegate.putObject(key, new SoftEntry(key, value, queueOfGarbageCollectedEntries));
  }

  @Override
  public Object getObject(Object key) {
    Object result = null;
    @SuppressWarnings("unchecked") // assumed delegate cache is totally managed by this cache
    SoftReference<Object> softReference = (SoftReference<Object>) delegate.getObject(key);
    if (softReference != null) {
      result = softReference.get();
      if (result == null) {
        //1. 如果数据已经没有了,就清理这个key
        delegate.removeObject(key);
      } else {
        // See #586 (and #335) modifications need more than a read lock 
        synchronized (hardLinksToAvoidGarbageCollection) {
          //2. 如果key存在,读取时候加一个锁操作,并将缓存值添加到硬连接集合中,避免垃圾回收
          hardLinksToAvoidGarbageCollection.addFirst(result);
          //3. 构造中指定硬链接最大256,所以如果已经有256个key的时候回开始删除最先添加的key
          if (hardLinksToAvoidGarbageCollection.size() > numberOfHardLinks) {
            hardLinksToAvoidGarbageCollection.removeLast();
          }
        }
      }
    }
    return result;
  }

  @Override
  public void clear() {
    //执行三清
    synchronized (hardLinksToAvoidGarbageCollection) {
      //1.清除硬链接队列
      hardLinksToAvoidGarbageCollection.clear();
    }
    //2. 清除垃圾队列
    removeGarbageCollectedItems();
    //3. 清除缓存
    delegate.clear();
  }

  private void removeGarbageCollectedItems() {
    SoftEntry sv;
    //清除value已经gc准备回收了,就就将key也清理掉
    while ((sv = (SoftEntry) queueOfGarbageCollectedEntries.poll()) != null) {
      delegate.removeObject(sv.key);
    }
  }
```


## 2.8 SynchronizedCache

从名字看就是同步的缓存,从代码看即所有的方法都被`synchronized`修饰。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223175457202.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

## 2.9 TransactionalCache
从名字上看就应该能隐隐感觉到跟事务有关,但是这个事务呢又不是数据库的那个事务。只是类似而已是, 即通过 `java` 代码来实现了一个暂存区域,如果事务成功就添加缓存，事务失败就回滚掉或者说就把暂存区的信息删除,不进入真正的缓存里面。 这个类是比较重要的一个类,因为所谓的二级缓存就是指这个类。既然说了🎧缓存就顺便提一下一级缓存。但是说一级缓存就设计到 `Mybatis`架构里面一个 `Executor` 执行器
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223193000589.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

所有的查询都先从一级缓存中查询
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223193115847.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223193308898.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

看到这里不由己提一个面试题,面试官会问你知道`Mybatis` 的一级缓存吗?
一般都会说`Mybatis` 的一级缓存就是 `SqlSession` 自带的缓存,这么说也对就是太笼统了，因为 `SqlSession`其实就是生成 `Executor` 而一级缓存就是里面query方法中的 `localCache`。这个时候我们就要看下了`localCache` 究竟是什么?
看一下构造,突然豁然开朗。原来本篇文章讲的基本就是一级缓存的实现呀。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191223193711876.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01lc3NhZ2VfbHg=,size_16,color_FFFFFF,t_70)

说到这里感觉有点跑题了，我们不是要看 `TransactionalCache` 的实现吗?

`clearOnCommit` 为false就是这个事务已经完成了,可以从缓存中读取数据了。

当`clearOnCommit`为 `true` ,这个事务正在进行中呢?  来的查询都给你返回 `null` , 等到 `commit` 提交时候在查询就可以从缓存中取数据了。

```java
public class TransactionalCache implements Cache {

  private static final Log log = LogFactory.getLog(TransactionalCache.class);
    // 真正的缓存
  private final Cache delegate;
  // 是否清理已经提交的实物
  private boolean clearOnCommit;
  // 可以理解为暂存区
  private final Map<Object, Object> entriesToAddOnCommit;
  // 缓存中没有的key
  private final Set<Object> entriesMissedInCache;

  public TransactionalCache(Cache delegate) {
    this.delegate = delegate;
    this.clearOnCommit = false;
    this.entriesToAddOnCommit = new HashMap<Object, Object>();
    this.entriesMissedInCache = new HashSet<Object>();
  }

  @Override
  public String getId() {
    return delegate.getId();
  }

  @Override
  public int getSize() {
    return delegate.getSize();
  }

  @Override
  public Object getObject(Object key) {
    // 先从缓存中拿数据
    Object object = delegate.getObject(key);
    if (object == null) {
      // 如果没有添加到set集合中
      entriesMissedInCache.add(key);
    }
    // 返回数据库的数据。
    if (clearOnCommit) {
      return null;
    } else {
      return object;
    }
  }

  @Override
  public ReadWriteLock getReadWriteLock() {
    return null;
  }

  @Override
  public void putObject(Object key, Object object) {
    entriesToAddOnCommit.put(key, object);
  }

  @Override
  public Object removeObject(Object key) {
    return null;
  }

  @Override
  public void clear() {
    clearOnCommit = true;
    entriesToAddOnCommit.clear();
  }

  public void commit() {
    if (clearOnCommit) {
      delegate.clear();
    }
    flushPendingEntries();
    reset();
  }

  public void rollback() {
    unlockMissedEntries();
    reset();
  }

  private void reset() {
    //1. 是否清除提交
    clearOnCommit = false;
    //2. 暂存区清理,代表这个事务从头开始做了，之前的清理掉
    entriesToAddOnCommit.clear();
    //3. 同上
    entriesMissedInCache.clear();
  }
    
  /** 
   * 将暂存区的数据提交到缓存中
   **/
  private void flushPendingEntries() {
    for (Map.Entry<Object, Object> entry : entriesToAddOnCommit.entrySet()) {
      delegate.putObject(entry.getKey(), entry.getValue());
    }
    //如果缓存中不包含这个key,就将key对应的value设置为默认值null
    for (Object entry : entriesMissedInCache) {
      if (!entriesToAddOnCommit.containsKey(entry)) {
        delegate.putObject(entry, null);
      }
    }
  }

  // 移除缺失的key,就是这个缓存中没有的key都移除掉
  private void unlockMissedEntries() {
    for (Object entry : entriesMissedInCache) {
      try {
        delegate.removeObject(entry);
      } catch (Exception e) {
        log.warn("Unexpected exception while notifiying a rollback to the cache adapter."
            + "Consider upgrading your cache adapter to the latest version.  Cause: " + e);
      }
    }
  }

}

```

## 2.10 WeakCache
从名字上看跟 `SoftCache` 有点关系,Soft引用是当内存不够用时候才清理, 而`Weak` 弱引用则相反, 只要有GC就会回收。 所以他们的类型特性并不是自己实现的，而是依赖于 `Reference<T>` 类的特性，所以代码就不看了基本和 `SoftCache` 实现一摸一样。



