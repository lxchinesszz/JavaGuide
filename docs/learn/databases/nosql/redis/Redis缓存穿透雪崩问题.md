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
title: Redis缓存穿透雪崩问题
---

![](https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::


## 一、缓存穿透

**数据层没有,导致查询一直都是穿透了缓存去查db。**

缓存穿透的概念很简单，用户想要查询一个数据，发现redis内存数据库没有，也就是缓存没有命中，于是向持久层数据库查询。发现也没有，于是本次查询失败。当用户很多的时候，缓存都没有命中，于是都去请求了持久层数据库。这会给持久层数据库造成很大的压力，这时候就相当于出现了缓存穿透。



### 解决方案

#### （1）布隆过滤器

布隆过滤器是一种数据结构，垃圾网站和正常网站加起来全世界据统计也有几十亿个。网警要过滤这些垃圾网站，总不能到数据库里面一个一个去比较吧，这就可以使用布隆过滤器。假设我们存储一亿个垃圾网站地址。将者一亿个都放到布隆过滤器中。

原理: 将User中的指定的字段进行hash计算到某一个位置上,比如在本案例中name和age是两个字段分别映射到了。1和4。

![](https://img.springlearn.cn/blog/learn_1596446105000.png)

当用xiaoming去查询发现，1和4都已经被标记成1了,说明就有这个值了。
而用xiaozhang去查询,发现小张对应的位置上都还是0说明就不存在这个值。

但是这也存在一个问题,假如说xiaozhang也被hash映射到了1和4,不存在xiaozhang但是布隆判断缺存在。


```
public class BloomFilterTest {

    private static class User {

        private String name;

        private int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }

    public static void main(String[] args) {
        BloomFilter<User> bloomFilter = BloomFilter.create((Funnel<User>) (user, primitiveSink) -> primitiveSink.putString(user.getName(), Charset.defaultCharset())
                .putInt(user.getAge()), 10, 0.01);
        User xiaoming = new User("xiaoming", 1);
        bloomFilter.put(xiaoming);

        System.out.println(bloomFilter.mightContain(xiaoming));
        System.out.println(bloomFilter.mightContain(new User("xiaozhang", 2)));
    }
}
```

#### （2） 设置空对象

当存储层不命中后，即使返回的空对象也将其缓存起来，同时会设置一个过期时间，之后再访问这个数据将会从缓存中获取，保护了后端数据源；

当数据层也没有发现就放一个空对象,空对象设置一个过期时间

## 二、缓存击穿

这种数据正常情况。就是给了一个说法名字而已

**缓存中本来存在,但是某一个顺序缓存过期失效了,就被击穿访问到db层。**

缓存击穿，是指一个key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。



## 三、缓存雪崩


缓存雪崩是指，缓存层出现了错误，不能正常工作了。于是所有的请求都会达到存储层，存储层的调用量会暴增，造成存储层也会挂掉的情况。

### 解决方案

#### （1）redis高可用

这个思想的含义是，既然redis有可能挂掉，那我多增设几台redis，这样一台挂掉之后其他的还可以继续工作，其实就是搭建的集群。

#### （2）限流降级

这个解决方案的思想是，在缓存失效后，通过加锁或者队列来控制读数据库写缓存的线程数量。比如对某个key只允许一个线程查询数据和写缓存，其他线程等待。

#### （3）数据预热

数据加热的含义就是在正式部署之前，我先把可能的数据先预先访问一遍，这样部分可能大量访问的数据就会加载到缓存中。在即将发生大并发访问前手动触发加载缓存不同的key，设置不同的过期时间，让缓存失效的时间点尽量均匀。


最后求关注,求订阅,谢谢你的阅读!


