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
title: 第05篇:手写JavaRPC框架之执行层思路
category: mojito
---

![](https://img.springlearn.cn/blog/d0e05f0a0f96e2399aefe0e8fe00e23c.png)

**作者:** 西魏陶渊明

**博客:** https://blog.springlearn.cn/

> 天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

## 一、思路分析

![](https://img.springlearn.cn/blog/fe6f42fd58fad7a1ca190f66c730405b.png)

通过前四篇文章的一起 Coding, 我们已经完成了 30%的工作,即完成了一个通信层的搭建。在不依赖任何 web 容器的情况下,可以实现服务之间的通信工作。就像下面这样。

**客户端&服务端通信**

```java
    /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建服务端【阻塞方式】")
    public void server() throws Exception {
       Mojito.server(RpcRequest.class, RpcResponse.class)
                // 业务层,读取请求对象,返回结果
                .businessHandler((channelContext, request) -> new RpcResponse())
                .create().start(666);
    }

    @Test
    @DisplayName("构建客户端【同步方式】")
    public void clientSync() throws Exception{
        Client<RpcRequest, RpcResponse> client = Mojito.client(RpcRequest.class, RpcResponse.class)
                .connect("127.0.0.1", 6666);
        System.out.println(client.send(new RpcRequest()));
    }
```

这只是完成了通信, 就好比,两台服务器之间建立了沟通管道,但是究竟怎么用这个管道呢? 如何将客户端的请求参数发送到服务端的服务器上执行结果,并返回给客户端呢? 这就是本篇文章要讨论的话题。

![](https://img.springlearn.cn/blog/70b0a4323f80010510da069e00929af9.png)

暂且我们把这一层叫做 RPC 执行层吧。按照老套路,在真正开始 Coding 之前,我们先梳理一下逻辑,画一个最基础的图。

![](https://img.springlearn.cn/blog/e159fc7ffa56083fdbb9b81048b9c5ee.png)

- 左边客户端一个方法, 有 4 个服务端的实现。
- 右边某个服务端有一个具体的实现。

左边客户端的接口,通过代理的方式,将客户端的参数通过网络管道传输给某台服务端的本地进行执行。执行后获取结果,返回给客户端的调用方。而这些都是通过代理的方式实现的,所以开发者就好像调用本地方法一样。实现一次远程方法的调用。

以上是最最基础的远程调用的过程,但是如果就这的话就太基础了,下面我们会在这个基础上去做更多的事情。

### 1.1 客户端实现思路

RPC 服务,服务端会给客户端提供一个 API 包,这个包里面没有具体的实现,但是客户端能直接进行调用。学习 Java 的都知道接口是不能实例化的,但是为什么服务端给我们的 API,我们能直接调用呢? 当然是代理了。所以我们要学的第一个东西,就是学会代理。

1. 使用代理实现接口的实例化。【代理是我们必须要掌握的】

但是代理层里面怎么做呢?

2. 代理层将要调用的远程类和当前的客户端的参数,进行封装,然后通过通信层发送给服务端进行直接,然后拿到结果返回。这里面可能就设计到异步转同步的问题,但是没关系我们通信层直接就提供了实现。

以上就是客户端最基础的功能了。但是我们不满足于此, 市面上 RPC 框架有的功能,我们也要有。比如那些呢?
负载均衡、容错策略、事件广播我们也要有。那么他们究竟怎么做的呢?

3. 负载均衡,我们看上面客户端的图,会发现这个服务有 4 个实现 [`172.168.10.1`,`172.168.10.2`,`172.168.10.3`,`172.168.10.4`],说明服务端可能是集群部署的。那么既然有 4 个实例,我们就不能尽管这，一个 ip 进行进行调用,那么如何尽量让每个实例都能收到请求呢? 这就是负载均衡。

4. 容错策略,当我们调用一台实例出错了,直接报错? 还是重试一下请求？或者是换一个实例在请求呢? 这就是容错策略。甚至我们还可以实现一个熔断器。

![](https://img.springlearn.cn/blog/9d8ac7a0fcfb51c2951a93a86f7a3961.png)

这里不会设计也没关系,我们会抄,哦,不对是借鉴。以下是dubbo的容错策略。

![](https://img.springlearn.cn/blog/ba911f5f18960a64e512665ffa0f09e0.png)


5. 既然客户端有这个服务的所有实例信息,那么是不是不仅可以进行点对点的请求，还是能进行广播呢。
   如下右图,同一个请求,如果发现是广播模式,就不在负载均衡的选其中的一个进行执行,而是每个都进行通知。

![](https://img.springlearn.cn/blog/bf08e6ff0fd9428f810b39174b8c51ed.png)

这五点就是客户端要具备的基础能力。除此之外客户端还要有断线重连, 自动剔除无效的链接的功能。极端情况也还要考虑当注册中心也挂了,无法找到服务端地址的场景,本地是不是也要维护一个服务连接的注册表。

### 1.2 服务端实现思路

服务端我们就可以参考 Web 容器的思路，比如 Servle 如何处理请求呢? http 过来就是一个 url,如何匹配到要执行的方法的呢?

1. 服务启动将 API 实现保存到 Map 接口中。
2. 服务收到请求,Dispatch 根据请求信息从 map 中获取执行器。
3. 通过反射获取执行结果,返回给调用方。

![](https://img.springlearn.cn/blog/cb8c0658eee15b5b8a5790fa5bb621ef.png)

同时将自己的信息注册到注册中心,让客户端能注册中心发现自己。

![](https://img.springlearn.cn/blog/3ec7c0abdc42dd28e81a1d48a9ec41dc.png)


好了我们实现代码的大概思路就是这些,后面我们会一步一会去实现上面我们所说的功能。下面我们来看下
如果要实现上面的思路,还需要那些技术储备和软实力吧。

## 二、技术储备

要实现上面的想法,究竟需要哪些技术储备呢? 最基础的就是代理了。除此之外还要有架构设计能力。

### 2.1 代理模式

上面我们所说的负载均衡，容错策略，广播都要在代理中实现。

#### 2.1.1 JDK 代理

JDK 代理必须要实现接口,第二个参数是接口数组,第三个参数是`InvocationHandler`。属于比较基础的内容。

```java
public class ProxyFactory {

    public interface User {
        String queryName();
    }

    public static void main(String[] args) {
        User user = (User) Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(), new Class[]{User.class}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if (method.getName().equals("queryName")) {
                    return "Jay";
                } else {
                    return null;
                }
            }
        });
        System.out.println(user.queryName());
    }
}
```

#### 2.1.2 Cglib 代理

Cglib 代理,代理类不用有接口。

```java
    public static class Person {

        public String queryName() {
            return "jay";
        }
    }

    public static void main(String[] args) {
        Person person = (Person) Enhancer.create(Person.class, new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                if (method.getName().equals("queryName")) {
                    return "代理:Jay";
                } else {
                    return null;
                }
            }
        });
        System.out.println(person.queryName());
    }
```

### 2.2 负载均衡策略

#### 2.2.1 随机算法

```java
public static String random(List<String> services) {
        Random random = new Random();
        String[] addressArr = services.toArray(new String[0]);
        // random
        return addressArr[random.nextInt(services.size())];
 }
```

#### 2.2.2 轮训算法

```java
public class RoundBalanceTest {

    public static void main(String[] args) {
        List<String> services = Arrays.asList("service1", "service2", "service3");
        XxlBalanceTest.manyRoute(i -> {
            // 请求次数,取模。serviceKey 可以更细粒度的控制轮训
            ColorConsole.colorPrintln("轮训负载({}):{}", i, round(services));
        });
    }

    private static final AtomicInteger atomicInteger = new AtomicInteger();

    private static String round(List<String> services) {
        int count = atomicInteger.get();
        if (count >= Integer.MAX_VALUE) {
            atomicInteger.set(0);
        }
        atomicInteger.incrementAndGet();
        String[] toArray = services.toArray(new String[0]);
        return toArray[count % toArray.length];
    }
}

```

#### 2.2.3 加权算法

加权算法的有很多的变异算法, 可以通过配置的方式，也可以通过某种策略动态的给每台服务器进行加权，从而来提高被轮训到的次数。 这里说两种网上常见的实现。

**简单加权算法**
一个简单暴力的加权算法,如下图。按照权重，重新构建集合。然后再将集合进行取模轮训即可。即可实现一个最简单 的加权算法。

![](https://img.springlearn.cn/blog/learn_1652884737000.png)

代码实现也是比较简单的,如下代码。

```java
public class WeightBalanceTest {

    private static class Server {

        private String host;

        private Integer port;

        public Server(String host, Integer port) {
            this.host = host;
            this.port = port;
        }

        @Override
        public String toString() {
            return "Server{" +
                    "host='" + host + '\'' +
                    ", port=" + port +
                    '}';
        }
    }

    private static final AtomicInteger atomicInteger = new AtomicInteger();

    public static Server round(List<Server> services) {
        int count = atomicInteger.get();
        if (count >= Integer.MAX_VALUE) {
            atomicInteger.set(0);
        }
        atomicInteger.incrementAndGet();
        Server[] toArray = services.toArray(new Server[0]);
        return toArray[count % toArray.length];
    }

    public static void main(String[] args) {
        Map<Server, Integer> confWeight = new HashMap<>();
        confWeight.put(new Server("127.0.0.1", 80), 2);
        confWeight.put(new Server("127.0.0.1", 81), 3);
        confWeight.put(new Server("127.0.0.1", 82), 5);

        List<Server> servers = new ArrayList<>();
        for (Map.Entry<Server, Integer> entity : confWeight.entrySet()) {
            Server server = entity.getKey();
            Integer weight = entity.getValue();
            for (int i = 0; i < weight; i++) {
                servers.add(server);
            }
        }
        Loops.loop(10, i -> {
            ColorConsole.colorPrintln("第{}次,权重轮训{}", i, round(servers));
        });
    }

}
第0次,权重轮训Server{host='127.0.0.1', port=80}
第1次,权重轮训Server{host='127.0.0.1', port=80}
第2次,权重轮训Server{host='127.0.0.1', port=82}
第3次,权重轮训Server{host='127.0.0.1', port=82}
第4次,权重轮训Server{host='127.0.0.1', port=82}
第5次,权重轮训Server{host='127.0.0.1', port=82}
第6次,权重轮训Server{host='127.0.0.1', port=82}
第7次,权重轮训Server{host='127.0.0.1', port=81}
第8次,权重轮训Server{host='127.0.0.1', port=81}
第9次,权重轮训Server{host='127.0.0.1', port=81}

```

但这样还是不均匀的, 相同的 ip 可能被连续的访问到其实就没有做到负载均衡。

**平滑加权算法**

主要解决上面那种不平滑的方案。这种方案是由 nginx (opens new window)提出来的。 算法的数学原理。

- 最大权重，减总权重
- 当前权重加上原权重
  如下权重变化。

| 轮数 | 选择前的当前权重 | 选择节点 | 选择后的当前权重 |
| ---- | ---------------- | -------- | ---------------- |
| 1    | {5, 1, 1}        | a        | {-2, 1, 1}       |
| 2    | {3, 2, 2}        | a        | {-4, 2, 2}       |
| 3    | {1, 3, 3}        | b        | {1, -4, 3}       |
| 4    | {6, -3, 4}       | a        | {-1, -3, 4}      |
| 5    | {4, -2, 5}       | c        | {4, -2, -2}      |
| 6    | {9, -1, -1}      | a        | {2, -1, -1}      |
| 7    | {7, 0, 0}        | a        | {0, 0, 0}        |

下面我们通过代码来实现。

- 首先我们定义出服务器模型, `weight` 是初始配置的权重，`currentWeight` 是计算后的权重。
- 初始值 `weight = currentWeight`

```java
    @Data
    @AllArgsConstructor
    @ToString
    @EqualsAndHashCode
    private static class Server {
        private String host;
        private Integer port;
        // 初始化权重
        private Integer weight;
        // 计算后的当前权重
        private Integer currentWeight;
    }
```

然后我们根据算法的核心点来选择节点。这里我们先不考虑性能只说思路，有了思路在自己来优化代码。

1. ==line(3-6)== 首先获取总权重
2. ==line(8-14)== 然后获取当前最大权重的节点
3. ==line(16-21)== 重新计算权重(`主要使用算法的思想`)
   - 当前最大权重节点，重新计算权重。当前权重 = 当前权重 - 总权重 + 原始权重
   - 其他节点，重新计算权重。当前权重 = 当前权重 + 原始权重

```java {3-6,8-14,16-21}
    public static Server selectServer(List<Server> servers) {
        // 获取总权重
        Integer totalWeight = 0;
        for (Server server : servers) {
            totalWeight += server.getWeight();
        }
        // 根据权重从小到大排序
        List<Server> sortByCurrentWeight = servers.stream().sorted(Comparator.comparing(Server::getCurrentWeight))
                .collect(Collectors.toList());
        // 集合反转,从大到小排序
        Collections.reverse(sortByCurrentWeight);
        // 当前最大权重
        Server maxWeightServer = sortByCurrentWeight.get(0);
        // 重新计算权重
        for (Server server : servers) {
            if (server.equals(maxWeightServer)) {
                server.setCurrentWeight(server.getCurrentWeight() - totalWeight);
            }
            server.setCurrentWeight(server.getCurrentWeight() + server.getWeight());
        }
        return maxWeightServer;
    }
```

可以看到非常的平滑均匀，每个 ip 都会被分散。

```
第0次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8080, weight=4, currentWeight=1)
第1次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8081, weight=2, currentWeight=-1)
第2次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8080, weight=4, currentWeight=2)
第3次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8082, weight=1, currentWeight=-2)
第4次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8080, weight=4, currentWeight=3)
第5次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8081, weight=2, currentWeight=0)
第6次,平滑权重轮训WeightBalanceTest2.Server(host=127,0,0,1, port=8080, weight=4, currentWeight=4)
```

很难想象,手写一个 RPC 框架,执行层所需要的技术储备只有这些而已。可以看出来，重要的是思路，思路决定出路。好了,下面我们就来实现这些思路吧。

那么你准备好跟我一起 Coding 了吗?

![](https://img.springlearn.cn/blog/dcdc576db14dda19819196a4dba05a21.png)
