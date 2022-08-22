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
title: 第04篇:手写JavaRPC框架之搞定网络通信
category: mojito
---


![](https://img.springlearn.cn/blog/26890ec0ad52a3b8bb3c0470c43c95a5.png)

**作者:** 西魏陶渊明

**博客:** https://blog.springlearn.cn/

> 天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)


## 一、前言

- 听说你Sql写的很溜，那么你知道服务端的Sql是如何被传输到SQL服务器执行的吗?
- 听说你10分钟能写两个接口，那你知道数据是如何在两个系统中通讯的吗?
- 听说你微服务玩的很熟练,那你知道微服务的基础是什么吗?

可以这样说，我们写的任何系统都离不开通讯，离不开网络编程，就没有现在我们发达的互联网世界。就没有什么分布式，没有什么微服务。所以由此可见网络编程是非常基础的知识。

但是我们思考下，`有多少同学真正使用过Java网络通信的API了呢`? 相信百分之80的小伙伴可能都没用过? 为什么呢? 因为我们站在巨人的肩膀上, 底层的代码都被层层的封装起来了,为了使我们能专注于业务的开发。这虽然提高了我们的开发效率。但是呢? 从另一个方面讲,他不利于我们的技术成长,使我们只会用，而不去思考为什么这么用。逐渐沦为CRUD Body。

个人如果想成长，想打破这种现状, 那么网络通信是一定要掌握的，当你掌握了这些，才算掌握了一点核心技术。当你掌握了这些，才能收获一些不一样的东西，看问题的维度又会有所提升。


本系列文章, 我们会一起来写RPC框架,而网络通讯是必要要掌握的知识,如果说以前你不懂,那么没关系跟着小编来Coding。我们一起来从0到1搭建一个网络通信层,然后以此为基础实现一个Java RPC框架吧。


## 二、目标

### 2.1 目标介绍

![](https://img.springlearn.cn/blog/8a2630c9ab3f4e155e02c2f11d4ce632.png)

本篇文章是我们的第四篇，内容主要是实现网络通讯。通信层框架主要使用的是Netty进行实现, 说到Netty可能很多同学都没有用过。而要想实现通讯Netty就必须要知道，所以本篇内容篇幅较多。

- 第一个目标,快速学习Netty的架构,掌握Netty 核心的API,最终唯我所用。
- 第二个目标,使用Netty完成我们的通信层。


内容非常的硬核,难度指数比较大,也主要是偏向于实战。请专注学习,内容中如果有差错,欢迎提出。小编会积极回复,并改正。

## 三、Netty API 学习

![](https://img.springlearn.cn/blog/70b0a4323f80010510da069e00929af9.png)

前面第三篇我们学习了搞定序列化,在上一篇中我们介绍了这幅图,序列化就是将数据转换成二进制数据,在网络管道中传输。今天开头还是这一张图, 不过今天要说的不在是里面的数据,而是要研究下如何来构建一个通信的管道。本篇文章我们要利用Netty搭建一个网络管道。

![](https://img.springlearn.cn/blog/625f13664d5fcbe898413cfc4884ac5f.png)

这张图是对第一张图的一个细化，可以看到在这个管道的里面有一个双向的数据流【双工】。

客服端向服务端发送数据，服务端也可以同时向客户端发送数据。这个过程叫做全双工。为什么呢? 因为这个管道是TCP管道。我们所知道的Dubbo也是在此基础上实现的。所以说dubbo和http是平级的关系。

- 一个inbound入栈方向，负责将二进制数据转换成Java对象
- 一个outbound出库方向，负责将Java对象转换成二进制对象

### 3.1 ChannelPipeline 网络管道

上面的那个管道在Netty中就是 `ChannelPipeline`, `ChannelPipeline` 是Netty 中一个非常重要的组件,我们说的管道,就可以理解成是这个类，在这个管道中有两个方向的流向。如下

- ChannelInboundHandler   入栈
- ChannelOutboundHandler  出栈

只有管道还不行，要对管道中流动的数据进行处理。怎么来处理呢? 就是 `ChannelHandler`

### 3.2 ChannelHandler 管道处理器

`ChannelHandle` 通道处理器是最顶层接口, `ChannelHandler` 和 `ChannelPipeline` 的关系,好比这张图。

`ChannelPipeline` 相当于是管道,而 `ChannelHandler` 相当于管道中的每个拦路虎, 通过对数据的拦截,然后进行处理。下面这张图比较形象。

![](https://img.springlearn.cn/blog/064c7be3d1767d991e0fc467ad9d123f.png)

`Netty` 要想学的好, `ChannelHandler` 学习不能少,下面是 `Netty` 中 `ChannelHandler` 的类关系图。想要处理数据只用继承这其中的一些类就可以了。

![](https://img.springlearn.cn/blog/5aefc5608f7d907c36fb247257affc6d.png)

请记住这张图,我们下面会利用这些管道处理器来实现我们的网络通信。

### 3.3 入栈管道解码器

>编码器本质上就是一个 `ChannelHandler`, 所以上图我们也能看出来它是实现了 `ChannelHandler`的。

二进制数据转换成Java对象就要我们来搞一个入栈的解码器,通过上面的图我们知道Netty给我们提供了一个
入栈方向的类。`ByteToMessageDecoder`。那么我们就先实现他,直接看代码。

```
/**
 * 请求解码器负责将二进制数据转换成能处理的协议
 * 个人博客：https://java.springlearn.cn
 * 公众号：西魏陶渊明  ｛关注获取学习源码｝
 */
@Slf4j
public abstract class ChannelDecoder extends ByteToMessageDecoder {

    /**
     * 解码方法
     *
     * @param ctx 通道上下文信息
     * @param in  网络传过来的信息(注意粘包和拆包问题)
     * @param out in中的数据转换成对象调用out.add方法
     * @throws Exception 未知异常
     */
    @Override
    public void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        doDecode(ctx, in, out);
    }


    /**
     * 解码方法
     *
     * @param ctx 通道上下文信息
     * @param in  网络传过来的信息(注意粘包和拆包问题)
     * @param out in中的数据转换成对象调用out.add方法
     * @throws Exception 未知异常
     */
    protected abstract void doDecode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception;
}
```

- doDecode 方法,通过读取ByteBuf中数据,然后经过的**规则处理,就是协议处理,然后反序列化成Java对象**,然后调用out.add()。


- 这个规则处理，就是协议，我们在本系列文章的第二篇,就说了我们的协议是什么,如下这张图。那么我们就按照这个规则来解析数据吧。

![](https://img.springlearn.cn/blog/18634a291755ae51cd4e6ef64b0a8ac8.png)

- 实际上这里我们还要面对黏包和拆包的问题。什么是黏包和拆包呢？

### 3.4 黏包和拆包及解决方案

我们举一个例子,前两天某某国前首相安老三,遇到刺客了。这时候你很悲伤想发一个说说: 只要人没事就好。

**拆包:**

只要人没事就好 = 只要人没 + 事就好。
![](https://img.springlearn.cn/blog/ffc187f8f60e18c0ac897034f3e8960f.png)

就是形容一条完整的数据报文,因为某些原因,数据被分成多段进行传输了,当你读取数据的时候,读到的不是完整的数据，而是一半的数据。此时意思就比较尴尬了。只要人没，事就好 😂。

**黏包:**

![](https://img.springlearn.cn/blog/5f4bdcf9294c387b03c9d89dc1a08383.png)

两条报文,连在一起发送了。导致了意思大变样。

就是数据都在网络管道中传输，但是我们服务定位每个报文的长度，导致了读取的数据就是混乱的。

那么拆包和黏包的问题我们都知道了,下面直接说解决方案吧。在Netty中有如下解决方案。

![](https://img.springlearn.cn/blog/5c524dee4dd0fb65d9f031bae5cd8030.png)

1. LineBasedFrameDecoder

遇到了换行符，就当做是一条完整的消息

```java
    @Test
    @DisplayName("使用换行符分隔符")
    void lineBasedFrameDecoder() {
        int maxLength = 100;
        ByteBuf buffer = ByteBufAllocator.DEFAULT.buffer();
        buffer.writeBytes("hello world\nhello\nworld\n".getBytes(StandardCharsets.UTF_8));
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG),
                new LineBasedFrameDecoder(maxLength),
                new ChannelInboundHandlerAdapter() {
                    @Override
                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                        ByteBuf buf = ((ByteBuf) msg);
                        String content = buf.toString(StandardCharsets.UTF_8);
                        System.out.println(content);
                    }
                });
//        hello world
//        hello 
//        world
        channel.writeInbound(ByteBufAllocator.DEFAULT.buffer().writeBytes(buffer));
    }
```

2. DelimiterBasedFrameDecoder

遇到了分隔符，就当做是一条完整的消息,分隔符可以自定义。我们可以指定多个分隔符,如下示例。

```java
    @Test
    @DisplayName("自定义换行符分隔符")
    void delimiterBasedFrameDecoder() {
        int maxLength = 100;
        ByteBuf buffer = ByteBufAllocator.DEFAULT.buffer();
        buffer.writeBytes("hello world\nhello\rworld\\".getBytes(StandardCharsets.UTF_8));
        ByteBuf delimeter1 = Unpooled.buffer().writeBytes("\n".getBytes(StandardCharsets.UTF_8));
        ByteBuf delimeter2 = Unpooled.buffer().writeBytes("\r".getBytes(StandardCharsets.UTF_8));
        ByteBuf delimeter3 = Unpooled.buffer().writeBytes("\\".getBytes(StandardCharsets.UTF_8));
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG),
                new DelimiterBasedFrameDecoder(maxLength, delimeter1, delimeter2, delimeter3),
                new ChannelInboundHandlerAdapter() {
                    @Override
                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                        ByteBuf buf = ((ByteBuf) msg);
                        String content = buf.toString(StandardCharsets.UTF_8);
                        System.out.println(content);
                    }
                });
//        hello world
//        hello
//        world
        channel.writeInbound(ByteBufAllocator.DEFAULT.buffer().writeBytes(buffer));
    }
```

3. FixedLengthFrameDecoder

固定长度对消息进行拆分

```java
    @Test
    @DisplayName("固定长度进行拆解")
    void fixedLengthFrameDecoder() {
        //这里每条消息设置的固定长度是5
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG), new FixedLengthFrameDecoder(5),
                new ChannelInboundHandlerAdapter() {
                    @Override
                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                        ByteBuf buf = ((ByteBuf) msg);
                        String content = buf.toString(StandardCharsets.UTF_8);
                        System.out.println(content);
                    }
                });
//        hello
//        world
//        welco
        channel.writeInbound(ByteBufAllocator.DEFAULT.buffer().writeBytes("helloworldwelcome".getBytes(StandardCharsets.UTF_8)));
    }
```

4. LengthFieldBasedFrameDecoder

消息分为两部分，一部分为消息头部，一部分为实际的消息体。其中消息头部是固定长度的，消息体是可变的，且消息头部一般会包含一个Length字段。


```java
    @Test
    @DisplayName("动态获取长度报文")
    void lengthFieldBasedFrameDecoder() {
        ByteBuf buffer = ByteBufAllocator.DEFAULT.buffer();
        byte[] bytes = "hello world".getBytes(StandardCharsets.UTF_8);
        // 11
        System.out.println(bytes.length);
        // 4字节
        buffer.writeInt(bytes.length);
        // 真正的数据
        buffer.writeBytes(bytes);
        // 最大包长100字节
        int maxFrameLength = 100;
        // 从0开始,说明开头就是长度
        int lengthFieldOffset = 0;
        // 0 说明, 报文是有长度+真实数据组成的,没有其他的东西
        int lengthAdjustment = 0;
        // 跳过长度的字节，因为是int,所以是4字节
        int initialBytesToStrip = 4;
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG),
                new LengthFieldBasedFrameDecoder(maxFrameLength, lengthFieldOffset, 4, lengthAdjustment, initialBytesToStrip),
                new ChannelInboundHandlerAdapter() {
                    @Override
                    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                        ByteBuf buf = ((ByteBuf) msg);
                        String content = buf.toString(StandardCharsets.UTF_8);
                        System.out.println(content);
                    }
                });
        channel.writeInbound(ByteBufAllocator.DEFAULT.buffer().writeBytes(buffer));
    }
```

好了，其实知道了问题产生的原因和已有的解决方案,我们也可以自己重新实现一个拆包和解包的方案,本篇文章我们就会自己来实现一个,具体的思路就是如下。

![](https://img.springlearn.cn/blog/a2c1c8bbf671ff14ca696b3f3f859991.png)

看起来思路是不是很简单? 底层的API可不简单哦,记得自己看代码,建议拉下来自己走走。


### 3.5 入栈管道处理器

![](https://img.springlearn.cn/blog/3f44224aef8f9ce7a44cc43c88fa75db.png)
二进制数据经过前面的解码器,就会转换成Object对象。此时我们下一个处理器就可以直接处理这个Object对象了。此时我们可以来继承 `SimpleChannelInboundHandler`。自定义一个泛型。如下示例。我们演示下二进制数据转Java对象,并传给我们的业务处理器。

- fillProtocol 首先我们按照我们定义的规则来，生成二进制数据流。
- 然后解析成Java对象,并传给我们的处理器。

```java
  /**
   * 请求解码器负责将二进制数据转换成能处理的协议
   * 虫洞栈：https://java.springlearn.cn
   * 公众号：西魏陶渊明  ｛关注获取学习源码｝
   */
  private ByteBuf fillProtocol() throws Exception {
        ByteBuf buffer = ByteBufAllocator.DEFAULT.buffer();
        RpcRequest rpcRequest = new RpcRequest();
        //1. 获取协议类型(1个字节)
        buffer.writeByte(rpcRequest.getProtocolType());
        //2. 获取序列化类型(1个字节)
        buffer.writeByte(rpcRequest.getSerializationType());
        //3. 根据序列化类型找到数据转换器生成二进制数据
        Serializer serializer = SerializeEnum.
                ofByType(rpcRequest.getSerializationType())
                .getSerialize().newInstance();
        byte[] data = serializer.serialize(rpcRequest);
        //4. 写入报文长度(4个字节)
        buffer.writeInt(data.length);
        //5. 写入报文内容(数组)
        buffer.writeBytes(data);
        return buffer;
    }

    @Test
    @DisplayName("SimpleChannelInboundHandler自动匹配支持的Java对象")
    public void test() throws Exception {
        // 根据自定义协议生成二进制数据流
        ByteBuf byteBuf = fillProtocol();
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG),
                new ChannelInitializer<EmbeddedChannel>() {
                    @Override
                    protected void initChannel(EmbeddedChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast("a handler", new MojitoChannelDecoder("mojito"));
                        pipeline.addLast("b handler",// 自定义一个String类型的
                                new SimpleChannelInboundHandler<RpcRequest>() {
                                    @Override
                                    protected void channelRead0(ChannelHandlerContext ctx, RpcRequest msg) throws Exception {
                                        System.out.println("RpcRequest:" + msg);
                                        // 向下传播
                                        ctx.fireChannelRead(msg);
                                    }
                                });
                        pipeline.addLast("c handler", new SimpleChannelInboundHandler<Integer>() {
                            @Override
                            protected void channelRead0(ChannelHandlerContext ctx, Integer msg) throws Exception {
                                System.out.println("Integer:" + msg);
                            }
                        });
                    }
                });
        channel.writeInbound(ByteBufAllocator.DEFAULT.buffer().writeBytes(byteBuf));
    }
```

- b handler 的泛型是RpcRequest,二进制数据经过MojitoChannelDecoder将数据转换成RpcRequest对象,此时就会进到b handler。
- 而在b handler中我们继续调用方法向下传播数据。`ctx.fireChannelRead(msg)`。会发现c handler并没有执行,为什么呢? 因为SimpleChannelInboundHandler有一个特性,就是只有数据类型为自己定义的泛型的时候才会进入。

如下源码也比较简单，这个特性我们可以抄一下, 可以用到我们需要的地方。

` TypeParameterMatcher.find(this, SimpleChannelInboundHandler.class, "I");`

读取泛型类型。

```java
public abstract class SimpleChannelInboundHandler<I> extends ChannelInboundHandlerAdapter {

     private final TypeParameterMatcher matcher;
 
     protected SimpleChannelInboundHandler(boolean autoRelease) {
        matcher = TypeParameterMatcher.find(this, SimpleChannelInboundHandler.class, "I");
        this.autoRelease = autoRelease;
    }
 public boolean acceptInboundMessage(Object msg) throws Exception {
        return matcher.match(msg);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        boolean release = true;
        try {
            if (acceptInboundMessage(msg)) {
                @SuppressWarnings("unchecked")
                I imsg = (I) msg;
                channelRead0(ctx, imsg);
            } else {
                release = false;
                ctx.fireChannelRead(msg);
            }
        } finally {
            if (autoRelease && release) {
                ReferenceCountUtil.release(msg);
            }
        }
    }

}
```

好了，到这里我们的入栈流程就说完了。下面我们说出栈的流程。

### 3.6 出栈管道处理器

![](https://img.springlearn.cn/blog/c4836bafa453bfd215ee4a1bd40a404b.png)

通过前面我们对 `ChannelHandler` 的了解,如果我们要写出栈的处理器,其实就是要继承 `ChannelOutboundHandlerAdapter` 。以下面这个例子,我们写一个 `RpcResponse` 对象。

- a handler 是编码器,负责将 `RpcResponse` 对象转成二进制数据
- b handler 是出栈处理器, 而里面的Object类型的msg究竟是二进制数据呢？ 还是 `RpcResponse`呢? 这个就要看出栈执行器的位置了。

这个问题,后面在3.7就能找到答案。

```java
    @Test
    @DisplayName("出栈处理器")
    public void testOutbound() throws Exception {
        EmbeddedChannel channel = new EmbeddedChannel(new LoggingHandler(LogLevel.DEBUG),
                new ChannelInitializer<EmbeddedChannel>() {
                    @Override
                    protected void initChannel(EmbeddedChannel ch) throws Exception {
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast("a handler", new MojitoChannelEncoder("mojito"));
                        pipeline.addLast("b handler", new ChannelOutboundHandlerAdapter() {
                            @Override
                            public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
                                System.out.println("Write:" + msg);
                                super.write(ctx, msg, promise);
                            }
                        });
                    }
                });
        RpcResponse rpcResponse = new RpcResponse();
        channel.writeOutbound(rpcResponse);
    }
```

### 3.7 处理器顺序

![](https://img.springlearn.cn/blog/0cc9f9936d794711885b5a3a2c9e68ce.png)

```java
  ChannelPipeline p = ...;
  p.addLast("1", new InboundHandlerA());
  p.addLast("2", new InboundHandlerB());
  p.addLast("3", new OutboundHandlerA());
  p.addLast("4", new OutboundHandlerB());
  p.addLast("5", new InboundOutboundHandlerX());
```
- 入栈:  1 -> 2 -> 5
- 出栈:  5 -> 4 -> 3

所以由此得出,3.5 Write的地方,会打印 `RpcResponse` 对象。

好了,到这里Netty的核心API其实就学习完了,了解了这些就算入门了。下面我们看如何来组装这些API吧。

### 3.8 服务端引导类

通过前面的学习,我们已经知道在Netty 中如何将二进制数据转换成Java对象,并进行业务处理,然后在将业务数据通过出栈处理器器转换成二进制数据返回了。那么我们现在来看下如何用Netty构建一个服务端吧。
直接上代码。

```java
    /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建一个服务端")
    public void testServer() throws Exception {
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        // io 线程一个进行轮训即可
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1, new NamedThreadFactory("boss"));
        // 业务处理线程组, CPU线程数 + 1 即可: (同一个核心同一时刻只能执行一个任务,所以创建多了也没用,建议给N+1个)
        NioEventLoopGroup workGroup = new NioEventLoopGroup(
                Runtime.getRuntime().availableProcessors() + 1, new NamedThreadFactory("work"));
        serverBootstrap.group(bossGroup, workGroup)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        // 我们的管道信息信息就在这里
                        ChannelPipeline pipeline = ch.pipeline();

                    }
                }).channel(OSinfo.isLinux() ? EpollServerSocketChannel.class : NioServerSocketChannel.class);
        ChannelFuture sync = serverBootstrap.bind(8080).sync();
        sync.addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("端口绑定成功");
            } else {
                System.out.println("端口绑定失败:" + future.cause().getCause());
            }
        });
        Channel channel = sync.channel();
        // 添加一个关闭时间监听器
        channel.closeFuture().addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("服务关闭成功");
            } else {
                System.out.println("服务关闭失败:" + future.cause().getCause());
            }
        });
        channel.close();
    }
```

### 3.9 客户端引导类

这里我们为了测试,我们先构建一个服务端,然后构建一个客户端然后进行访问。我们看服务端的输出。
- 构建服务端打印请求连接和释放连接事件

```java
    /**
     * 请求解码器负责将二进制数据转换成能处理的协议
     * 虫洞栈：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     */
    @Test
    @DisplayName("构建一个服务端")
    public void testServer() throws Exception {
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        // io 线程一个进行轮训即可
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1, new NamedThreadFactory("boss"));
        // 业务处理线程组, CPU线程数 + 1 即可: (同一个核心同一时刻只能执行一个任务,所以创建多了也没用,建议给N+1个)
        NioEventLoopGroup workGroup = new NioEventLoopGroup(
                Runtime.getRuntime().availableProcessors() + 1, new NamedThreadFactory("work"));
        serverBootstrap.group(bossGroup, workGroup)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        // 设置我们的管道信息
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                Channel channel = ctx.channel();
                                SocketAddress socketAddress = channel.remoteAddress();
                                System.out.println("收到了一个链接:" + socketAddress);
                                ctx.fireChannelActive();
                            }

                            @Override
                            public void channelInactive(ChannelHandlerContext ctx) throws Exception {
                                Channel channel = ctx.channel();
                                SocketAddress socketAddress = channel.remoteAddress();
                                System.out.println(socketAddress + ":关闭连接");
                            }
                        });
                    }
                }).channel(OSinfo.isLinux() ? EpollServerSocketChannel.class : NioServerSocketChannel.class);
        ChannelFuture sync = serverBootstrap.bind(8080).sync();
        sync.addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("端口绑定成功");
            } else {
                System.out.println("端口绑定失败:" + future.cause().getCause());
            }
        });
        Channel channel = sync.channel();
        // 添加一个关闭时间监听器
        channel.closeFuture().addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("服务关闭成功");
            } else {
                System.out.println("服务关闭失败:" + future.cause().getCause());
            }
        }).sync();
        channel.close();
    }
```

- 构建客户端

```java
    @Test
    public void testClient() throws Exception {
        NioEventLoopGroup workGroup = new NioEventLoopGroup(
                Runtime.getRuntime().availableProcessors() + 1, new NamedThreadFactory("work"));
        Bootstrap clientBootstrap = new Bootstrap();
        clientBootstrap.group(workGroup);
        clientBootstrap.channel(NioSocketChannel.class);
        clientBootstrap.option(ChannelOption.TCP_NODELAY, false);
        clientBootstrap.handler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel ch) throws Exception {
                // 设置我们的管道
                ChannelPipeline pipeline = ch.pipeline();
                // 客户端要将我们发出的Java对象转换成二进制对象输入
                // 客户端要将服务端发送的二进制对象转换成Java对象
            }
        });
        ChannelFuture channelFuture = clientBootstrap.connect("127.0.0.1", 8080).sync();
        channelFuture.channel().write("HelloWord");
    }
```

服务端控制台输出:

- 端口绑定成功
- 收到了一个链接:/127.0.0.1:55732
- /127.0.0.1:55732:关闭连接

### 3.10 Netty 学习总结

好了，我们一口气吧 `Netty` 的API都学习了,知识点有点多,大家可以看着图来理解。这里学习Netty是因为我们要用Netty来构建一个网络通道。用于我们开发RPC框架，这点知识已经够用了。但是需要注意的是 `Netty` 并不仅仅只有这些知识点。Netty 为什么这么快? 吞吐量这么高? 值得我们学习的知识点还有很多。这个后面我们单独再来说,本篇文章我们就了解这么多就够用了。下面我们终于可以开始自己的Coding了。


## 四、通信层搭建

![](https://img.springlearn.cn/blog/f1c1e75211b9630f4123ad8903d8b68d.png)

- [第01篇:手写JavaRPC框架之思路分析](https://springlearn.blog.csdn.net/article/details/125901044)
- [第02篇:手写JavaRPC框架之设计思路](https://springlearn.blog.csdn.net/article/details/125903177)
- [第03篇: 手写JavaRPC框架之搞定序列化](https://springlearn.blog.csdn.net/article/details/126151001)

通过前三篇的学习及上面对Netty的学习,相信上图中关于底层通信的所有知识点都已经了解了吧。那么下面就开始编程了。来一步一步完成我们的通信层。

### 4.1 工程结构

![](https://img.springlearn.cn/blog/89d3ec5f95d4ef4642d9f32ce1616c79.png)

### 4.2 架构设计

![](https://img.springlearn.cn/blog/dd74eb95dc1ea6c3d0a5ea341f2f62cf.png)

所谓的架构其实就会对于Netty 管道中的处理逻辑和分层。

- Config API 其实就是我们的Fluent风格的API
- Business   就是我们提供给开发者用来实现业务的接口
- Model      是我们原型开发者自定义自己的数据传输模型,前提是要集成 `ProtocolHeader`
- Exchange   用于屏蔽Netty原生众多的API,通过封装只暴露我们需要感知的API
- Codec      提供自定义的解码器和编码器,同时也能支持HTTP的协议
- Serialize  底层的序列化实现

### 4.3 服务端

![](https://img.springlearn.cn/blog/364d595434aed6cd9de163930cb9f09b.png)

1. 首先我们定义出 `Server` 接口,为了尽量让职责单一。我们将配置方法和核心的能力分开，又定义了
   提供配置的 `ConfigurableServer`。 这块代码我们就是抄的Spring的ApplicationContext的设计。设计的好处是,接口隔离原则,即一个类与其他类保留最少的关系。这样说可能还不好理解。我们思考下
   Server集成了ConfigurableServer。假如说我们把所有的接口定义都放在Server中。当我们要把配置的信息,暴露给外面的时候,只能将Server给提供出去,但是Server中有那么多的非配置的方法,是不是都被外部所感知到了呢? 解决办法就是将接口细化, 给外部只提供ConfigurableServer。这样外部就看不到Server中所有的方法,就不会被困扰。

```java
  // 给外面提供的接口能力太大了,他不关心的提供出来就是困扰。
  public void customerConfig(Server server);
  // 提供的都是我想要的,一起都是刚刚好。
  public void customerConfig(ConfigurableServer confServer);
```


2. 目前我们是使用Netty通信框架进行的实现,但是为了以后可以支持其他的通信框架,我们定义了抽象模板类 `AbstractServer`。在模板类型,只定义统一的创建服务端的流程。而具体的细节,交给了抽象方法。如果说后面我们不使用Netty来,我们的改动也是最小的。

3. `NettyServer` 继承了 `AbstractServer` 实现了其定义的抽象方法,具体的负责创建服务。

代码如下,更多细节可以到下载代码学习。

```java
public interface ConfigurableServer<T extends Server<?>> {

    /**
     * 给网络通道注册二进制处理协议
     *
     * @param protocol 协议
     */
    void registryProtocol(Protocol<? extends ProtocolHeader, ? extends ProtocolHeader> protocol);

    /**
     * 注册钩子程序
     */
    void registryHooks(Runnable hookTask);

    /**
     * 协议信息
     *
     * @return Protocol
     */
    Protocol<? extends ProtocolHeader, ? extends ProtocolHeader> getProtocol();

    /**
     * 这里我们提供一个Server初始化的方法,为什么呢?
     * 目前我们的服务端是使用NettyServer,我们也支持其他的通信框架。因为可能初始化方法不一样.
     * 所以我们将具体的实现作为一个泛型。让具体的实现来自己定义自己的初始化方法
     *
     * @param initializer 初始化接口
     */
    void initializer(ServerInitializer<T> initializer);
}

public interface Server<T extends Server<?>> extends ConfigurableServer<T> {

    /**
     * 启动服务
     *
     * @param port 服务端口号
     */
    void start(int port);

    /**
     * 非阻塞启动
     *
     * @param port 端口
     */
    void startAsync(int port);

    /**
     * 关闭服务
     */
    void close();

    /**
     * 服务器端口
     *
     * @return int
     */
    int getPort();

    /**
     * 是否运行中
     *
     * @return boolean
     */
    boolean isRun();

}

/**
 * @author liuxin
 * 2022/8/10 22:16
 */
public abstract class AbstractServer<T extends Server<?>> implements Server<T> {

    private ServerInitializer<T> serverInitializer;

    private Integer port;

    private final AtomicBoolean runningState = new AtomicBoolean(false);

    private Protocol<? extends ProtocolHeader, ? extends ProtocolHeader> protocol;

    @Override
    public void registryProtocol(Protocol<? extends ProtocolHeader, ? extends ProtocolHeader> protocol) {
        this.protocol = protocol;
    }

    @Override
    public void registryHooks(Runnable hookTask) {
        ThreadHookTools.addHook(new Thread(hookTask));
    }

    @Override
    public Protocol<? extends ProtocolHeader, ? extends ProtocolHeader> getProtocol() {
        return protocol;
    }

    @Override
    public void initializer(ServerInitializer<T> initializer) {
        this.serverInitializer = initializer;
    }

    @Override
    public ServerInitializer<T> getServerInitializer() {
        return serverInitializer;
    }

    @Override
    public void start(int port) {
        checked();
        activeAndCreateServer(() -> {
            this.port = port;
            doCreateServer(port, false);
        });
    }

    private void checked() {
        if (Objects.isNull(protocol)) {
            throw new RuntimeException("Protocol不能为空,请Server#registryProtocol");
        }
        if (Objects.isNull(serverInitializer)) {
            throw new RuntimeException("Protocol不能为空,请Server#initializer");
        }
    }

    private void activeAndCreateServer(LambdaExecute execute) {
        if (isRun()) {
            throw new RuntimeException("运行中");
        }
        if (runningState.compareAndSet(false, true)) {
            try {
                execute.execute();
            } catch (Throwable t) {
                runningState.compareAndSet(true, false);
            }
        }
    }

    private void closeAndDestroyServer(LambdaExecute execute) {
        if (isRun()) {
            if (runningState.compareAndSet(true, false)) {
                execute.execute();
            }
        }
    }

    @Override
    public void startAsync(int port) {
        activeAndCreateServer(() -> {
            this.port = port;
            doCreateServer(port, true);
        });
    }

    @Override
    public void close() {
        closeAndDestroyServer(this::doDestroyServer);
    }

    @Override
    public int getPort() {
        return this.port;
    }

    @Override
    public boolean isRun() {
        return runningState.get();
    }

    public abstract void doCreateServer(int port, boolean async);

    public abstract void doDestroyServer();
}

@Slf4j
public class NettyServer extends AbstractServer<NettyServer> {

    private final ServerBootstrap serverBootstrap = new ServerBootstrap();

    private Channel serverChannel;

    private EventLoopGroup bossGroup;

    private EventLoopGroup workerGroup;

    private static final int DEFAULT_EVENT_THREADS = Math.min(Runtime.getRuntime().availableProcessors() + 1, 32);

    public ServerBootstrap getServerBootstrap() {
        return this.serverBootstrap;
    }

    @Override
    @SneakyThrows
    public void doCreateServer(int port, boolean async) {
        // 1. io线程数 = cpu * 2
        bossGroup = new NioEventLoopGroup(1, new NamedThreadFactory("mojito-boss", true));
        // 2. 业务线程数 = cpu + 1
        workerGroup = new NioEventLoopGroup(DEFAULT_EVENT_THREADS, new NamedThreadFactory("mojito-work", true));
        serverBootstrap.group(bossGroup, workerGroup)
                .childOption(ChannelOption.TCP_NODELAY, true)
                .childOption(ChannelOption.SO_KEEPALIVE, true)
                .option(ChannelOption.SO_BACKLOG, 128)
                .handler(new LoggingHandler(LogLevel.INFO))
                .channel(OSinfo.isLinux() ? EpollServerSocketChannel.class : NioServerSocketChannel.class)
                .localAddress(port).option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);
        getServerInitializer().initializer(this);
        // 3. 阻塞绑定端口
        ChannelFuture bindFuture = serverBootstrap.bind().addListener((ChannelFutureListener) channelFuture -> {
            if (channelFuture.isSuccess()) {
                log.info(Banner.print("麻烦给我的爱人来一杯Mojito,我喜欢阅读她微醺时的眼眸！", Ansi.Color.RED));
                log.info("Mojito启动成功,端口号:" + port);
            } else {
                Throwable cause = channelFuture.cause();
                throw new RuntimeException(cause);
            }
        }).sync();
        serverChannel = bindFuture.channel();
        if (async) {
            log.info("异步服务启动成功");
        } else {
            serverChannel.closeFuture().sync();
            log.info("阻塞服务启动成功");
        }
    }

    @Override
    public void doDestroyServer() {
        workerGroup.shutdownGracefully();
        bossGroup.shutdownGracefully();
        serverChannel.close();
    }
    
}

```

### 4.4 客户端


![](https://img.springlearn.cn/blog/991deadc0c04cca92bfc3f3d88d60a35.png)

服务端的设计和客户端的设计是一样的,依赖抽象不依赖细节。架构设计只是定义好流程,具体是什么框架来实现底层的通信,就交给最底层的细节。

- 客户端有几个核心的地方

1. 连接服务器
2. 发送数据(同步&异步)
3. 断线重连(**放在优化的时候讲**)
4. 异步转同步问题

```java

/**
 * @author liuxin
 * 2022/8/5 23:12
 */
public interface ConfigurableClient<REQ extends ProtocolHeader, RES extends ProtocolHeader, T extends Client<REQ, RES>> {

    /**
     * 给网络通道注册二进制处理协议
     *
     * @param protocol 协议
     */
    void registryProtocol(Protocol<REQ, RES> protocol);

    /**
     * 协议信息
     *
     * @return Protocol
     */
    Protocol<REQ, RES> getProtocol();

    /**
     * 注册钩子程序
     */
    void registryHooks(Runnable hookTask);

    /**
     * 这里我们提供一个Server初始化的方法,为什么呢?
     * 目前我们的服务端是使用NettyServer,我们也支持其他的通信框架。因为可能初始化方法不一样.
     * 所以我们将具体的实现作为一个泛型。让具体的实现来自己定义自己的初始化方法
     *
     * @param initializer 初始化接口
     */
    void initializer(ClientInitializer initializer);

    /**
     * 客户端初始化扩展
     *
     * @return ClientInitializer
     */
    ClientInitializer<Client<REQ, RES>> getClientInitializer();

}

/**
 * @author liuxin
 * 个人博客：https://java.springlearn.cn
 * 公众号：西魏陶渊明  ｛关注获取学习源码｝
 * 2022/8/5 23:12
 */
public interface Client<REQ extends ProtocolHeader, RES extends ProtocolHeader> extends ConfigurableClient<REQ, RES, Client<REQ, RES>> {


    /**
     * 建立连接
     *
     * @param host 连接地址
     * @param port 连接端口
     */
    void connect(String host, Integer port);

    /**
     * 发送消息
     *
     * @param req 请求体
     * @return 异步结果
     */
    MojitoFuture<RES> send(REQ req);

    /**
     * 关闭连接
     */
    void close();


    /**
     * 是否连接
     *
     * @return boolean
     */
    boolean isRun();

    /**
     * 是否连接
     *
     * @return boolean
     */
    boolean isConnected();


}
/**
 * @author liuxin
 * 个人博客：https://java.springlearn.cn
 * 公众号：西魏陶渊明  ｛关注获取学习源码｝
 * 2022/8/5 23:12
 */
public abstract class AbstractClient<REQ extends ProtocolHeader, RES extends ProtocolHeader> implements Client<REQ, RES> {


    /**
     * 将要连接的远程地址
     */
    private String remoteHost;

    /**
     * 将要连接的远程端口
     */
    private int remotePort;

    private Protocol<REQ, RES> protocol;

    private ClientInitializer<Client<REQ, RES>> clientInitializer;

    private final AtomicBoolean running = new AtomicBoolean(false);

    @Override
    public void connect(String host, Integer port) {
        if (!running.get()) {
            this.remoteHost = host;
            this.remotePort = port;
        }
        try {
            if (running.compareAndSet(false, true)) {
                doConnect();
            }
        } catch (Throwable t) {
            t.printStackTrace();
            running.compareAndSet(true, false);
        }
    }

    @Override
    public MojitoFuture<RES> send(REQ req) {
        return doSend(req);
    }

    @Override
    public void close() {
        doClose();
    }

    public int getRemotePort() {
        return remotePort;
    }

    public String getRemoteHost() {
        return remoteHost;
    }

    @Override
    public Protocol<REQ, RES> getProtocol() {
        return this.protocol;
    }


    @Override
    public void registryProtocol(Protocol<REQ, RES> protocol) {
        this.protocol = protocol;
    }

    @Override
    public void registryHooks(Runnable hookTask) {
        ThreadHookTools.addHook(new Thread(hookTask));
    }

    @Override
    public void initializer(ClientInitializer initializer) {
        this.clientInitializer = initializer;
    }

    @Override
    public boolean isRun() {
        return running.get();
    }

    @Override
    public ClientInitializer<Client<REQ, RES>> getClientInitializer() {
        return clientInitializer;
    }

    public abstract void doConnect();

    public abstract void doClose();

    public abstract MojitoFuture<RES> doSend(REQ req);
}

/**
 * @author liuxin
 * 个人博客：https://java.springlearn.cn
 * 公众号：西魏陶渊明  ｛关注获取学习源码｝
 * 2022/8/5 23:12
 */
@Slf4j
public class NettyClient<REQ extends ProtocolHeader, RES extends ProtocolHeader> extends AbstractClient<REQ, RES> {

    private final Bootstrap clientBootstrap = new Bootstrap();

    private final EventLoopGroup workerGroup = new NioEventLoopGroup();

    private DefaultEnhanceChannel enhanceChannel;

    @Override
    @SneakyThrows
    public void doConnect() {
        clientBootstrap.group(workerGroup);
        clientBootstrap.channel(NioSocketChannel.class);
        clientBootstrap.option(ChannelOption.TCP_NODELAY, false);
        getClientInitializer().initializer(this);
        ChannelFuture channelFuture = clientBootstrap.connect(getRemoteHost(), getRemotePort()).sync();
        enhanceChannel = DefaultEnhanceChannel.getOrAddChannel(channelFuture.channel());
    }

    public Bootstrap getClientBootstrap() {
        return clientBootstrap;
    }

    @Override
    public void doClose() {
        workerGroup.shutdownGracefully();
        enhanceChannel.disconnected();
        log.info("Client 关闭成功");
    }

    @Override
    public MojitoFuture<RES> doSend(REQ req) {
        // 这里我们也设置,断线重连,后面优化
        return getProtocol().getClientPromiseHandler().sendAsync(enhanceChannel, req);
    }

    @Override
    public boolean isConnected() {
        return Objects.nonNull(enhanceChannel) && enhanceChannel.isConnected();
    }


}

```

### 4.5 异步转同步

socket通信发送数据,什么时候回复都可以。甚至可以客户端一直发，而服务端不进行回复。而我们的RPC框架更像一问一答,发送请求后,需要立马就收到回复。每个请求都要对应一个响应,这就需要我们进行特殊的设计来完成,这样的需求。

我们的思路就是实现,Jdk的Future,并给他添加上监听器的功能。因为我们主要是学习,所以不要怕麻烦,不要怕重新造轮子。下面我们开始实现它。


```
mojito/mojito-net/src/main/java/cn/lxchinesszz/mojito/future on  master [!+?] 
➜ tree                 
.
├── MojitoFuture.java
├── Promise.java
└── listener
    ├── MojitoListener.java
    └── MojitoListeners.java

```

- 定义接口 `Promise`。承诺,这个接口一定会告诉你成功或者失败。这样的设计Js上运用是最多的。

```java
public interface Promise<V> {

    /**
     * 是否成功
     *
     * @return boolean
     */
    boolean isSuccess();

    /**
     * 设置成功表示
     *
     * @param data 数据
     */
    void setSuccess(V data);

    /**
     * 设置失败标识
     *
     * @param cause 异常
     */
    void setFailure(Throwable cause);

    /**
     * 添加监听器
     *
     * @param listener 监听器
     */
    void addListeners(MojitoListener<V> listener);
}
```

- 实现核心方法

这里需要注意的就是多线程的可见性和多线程的原子性问题以及如何实现线程等待。如果这部分不太容易理解，建议可以先多了解点关于线程安全的知识点。然后回过头在来看。

- [Java并发编程之Condition条件锁](https://springlearn.blog.csdn.net/article/details/125824854)
- [Java多线程编程之线程安全感](https://springlearn.blog.csdn.net/article/details/125824300)
- [Java并发编程之原子操作](https://springlearn.blog.csdn.net/article/details/125824392)

```java
public class MojitoFuture<V> implements Promise<V>, Future<V> {

    /**
     * volatile 多线程保证可见性
     */
    private volatile V result;
    
     /**
     * AtomicReferenceFieldUpdater 多线程保证操作的原子性
     */
    @SuppressWarnings("rawtypes")
    private static final AtomicReferenceFieldUpdater<MojitoFuture, Object> RESULT_UPDATER =
            AtomicReferenceFieldUpdater.newUpdater(MojitoFuture.class, Object.class, "result");
            
    /**
     * 当前承诺的监听器
     */
    private final List<MojitoListener<V>> listeners = new ArrayList<>();

    /**
     * 是否被撤销了
     */
    private boolean cancelled = false;

    /**
     * 并发锁
     */
    private final ReentrantLock lock = new ReentrantLock();

    /**
     * get 阻塞条件,用于完成时候唤醒get阻塞线程
     */
    private final Condition condition = lock.newCondition();

    /**
     * get超时阻塞条件,,用于完成时候唤醒get阻塞线程
     */
    private final Condition timeoutCondition = lock.newCondition();
    
    /**
     * 原子操作
     *
     * @param objResult 数据
     * @return boolean
     */
    private boolean setValue0(Object objResult) {
        if (RESULT_UPDATER.compareAndSet(this, null, objResult) ||
                RESULT_UPDATER.compareAndSet(this, EMPTY, objResult)) {
            return true;
        }
        return false;
    }

    @Override
    public boolean isSuccess() {
        return isDone() && result != EMPTY;
    }

    @Override
    public void setSuccess(V data) {
        boolean updateSuccess;
        try {
            lock.lock();
            updateSuccess = setValue0(data);
            condition.signalAll();
            timeoutCondition.signalAll();
        } finally {
            lock.unlock();
        }
        if (updateSuccess) {
            for (MojitoListener<V> listener : listeners) {
                listener.onSuccess(data);
            }
        }
    }

    @Override
    public void setFailure(Throwable cause) {
        boolean updateSuccess;
        try {
            lock.lock();
            updateSuccess = setValue0(EMPTY);
            condition.signalAll();
            timeoutCondition.signalAll();
        } finally {
            lock.unlock();
        }
        if (updateSuccess) {
            for (MojitoListener<V> listener : listeners) {
                listener.onThrowable(cause);
            }
        }
    }


    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
        this.cancelled = mayInterruptIfRunning;
        return false;
    }

    @Override
    public boolean isCancelled() {
        return cancelled;
    }

    @Override
    public boolean isDone() {
        // 只要不等于空,说明就是有结果了,不管成功或者失败
        return result != null;
    }

    @Override
    public V get() throws InterruptedException, ExecutionException {
        lock.lock();
        try {
            if (Thread.currentThread().isInterrupted()) {
                throw new InterruptedException();
            } else {
                // 如果没有完成并且没有撤销
                if (!isDone() && !isCancelled()) {
                    // 释放线程,任务在这里阻塞,等待完成时候释放.
                    condition.await();
                }
            }
        } finally {
            lock.unlock();
        }
        return isSuccess() ? result : null;
    }

    @Override
    public V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
        lock.lock();
        try {
            if (Thread.currentThread().isInterrupted()) {
                throw new InterruptedException();
            } else {
                // 如果没有完成并且没有撤销
                if (!isDone() && !isCancelled()) {
                    // 释放线程,任务在这里阻塞,等待完成时候释放.
                    boolean await = timeoutCondition.await(timeout, unit);
                    if (!await) {
                        throw new TimeoutException();
                    }
                }
            }
        } finally {
            lock.unlock();
        }
        return isSuccess() ? result : null;
    }

    @Override
    public void addListeners(MojitoListener<V> listener) {
        this.listeners.add(listener);
    }
}
```

### 4.6 Fluent API

好了,前面我们快速的学习了Netty的API,后面我们使用了Netty来实现了我们的底层通信能力。但是这里还是太复杂了,最后我们要为这些复杂的对象,设计一套简单的使用API。API的风格决定使用 `Fluent API`

>fluent-API 是一种面向对象的 API，其设计主要基于方法链。
这个概念由​Eric Evans​和​Martin Fowler​于 2005 年创建，旨在通过创建特定领域语言 ( DSL )来提高代码可读性。

在实践中，创建一个流畅的 API，`就是不需要记住接下来的步骤或方法`，一切都是那么的自然和连续,下一步的动作，就好像它是一个`选项菜单`,让我们的选择。

关键词: **自然连续**，**无需记住**


这里面主要是对Java泛型的利用,主要实现在这里,基本都是泛型,所以要好好看。建议获取源码,运行走走。

```
mojito/mojito-net/src/main/java/cn/lxchinesszz/mojito/fluent on  master [»!?] 
➜ tree               
.
├── AbstractFactory.java
├── ConfigurableFactory.java
├── Factory.java
└── Mojito.java

```

下面我们来展示,来看下这个API,是否合乎你的心意呢?

1. 服务端

```java
class MojitoTest{
    /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建服务端【阻塞方式】")
    public void server() throws Exception {
        Server<?> server = Mojito.server(RpcRequest.class, RpcResponse.class)
                // 业务层,读取请求对象,返回结果
                .businessHandler((channelContext, request) -> new RpcResponse())
                .create();
        server.start(6666);
    }
    
    /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建服务端【非阻塞方式】")
    public void serverAsync() throws Exception {
        Server<?> server = Mojito.server(RpcRequest.class, RpcResponse.class)
                // 业务层,读取请求对象,返回结果
                .businessHandler((channelContext, request) -> new RpcResponse())
                .create();
        server.startAsync(6666);
    }
}    
```

2. 客户端

支持同步和异步两种方式

```java
   /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建客户端【异步方式】")
    public void clientAsync() throws Exception {
        // 构建连接
        Client<RpcRequest, RpcResponse> client = Mojito.client(RpcRequest.class, RpcResponse.class)
                .connect("127.0.0.1", 6666);

        MojitoFuture<RpcResponse> sendFuture = client.sendAsync(new RpcRequest());
        sendFuture.addListeners(new MojitoListener<RpcResponse>() {
            @Override
            public void onSuccess(RpcResponse result) {
                System.out.println("收到结果:" + result);
            }

            @Override
            public void onThrowable(Throwable throwable) {
                System.err.println("处理失败:" + throwable.getMessage());
            }
        });
        Thread.currentThread().join();
    }

    /**
     * @author liuxin
     * 个人博客：https://java.springlearn.cn
     * 公众号：西魏陶渊明  ｛关注获取学习源码｝
     * 2022/8/11 23:12
     */
    @Test
    @DisplayName("构建客户端【同步方式】")
    public void clientSync() throws Exception{
        Client<RpcRequest, RpcResponse> client = Mojito.client(RpcRequest.class, RpcResponse.class)
                .connect("127.0.0.1", 6666);
        System.out.println(client.send(new RpcRequest()));
    }

```

3. 启动演示

当看到下面的Logo说明服务已经启动成功了。

```
 ___      ___     ______      ___  __  ___________  ______    
|"  \    /"  |   /    " \    |"  ||" \("     _   ")/    " \   
 \   \  //   |  // ____  \   ||  |||  |)__/  \\__/// ____  \  
 /\\  \/.    | /  /    ) :)  |:  ||:  |   \\_ /  /  /    ) :) 
|: \.        |(: (____/ //___|  / |.  |   |.  | (: (____/ //  
|.  \    /:  | \        //  :|_/ )/\  |\  \:  |  \        /   
|___|\__/|___|  \"_____/(_______/(__\_|_)  \__|   \"_____/   

 :: Mojito ::                                     
麻烦给我的爱人来一杯Mojito,我喜欢阅读她微醺时的眼眸！
22:53:44.652 [mojito-boss-thread-1] INFO cn.lxchinesszz.mojito.server.netty.NettyServer - Mojito启动成功,端口号:6666
22:53:44.653 [mojito-boss-thread-1] INFO io.netty.handler.logging.LoggingHandler - [id: 0x7fc4d842, L:/0:0:0:0:0:0:0:0:6666] ACTIVE
```

Fluent API 风格是自然联系的,仿佛就跟菜单一样,根本不需要去记API。一起都是那么的自然。


## 五、总结

本篇文章爆肝了11天, 因为只有晚上下班,回来才有时间来思考总结。所以进度有点慢。

文章前部分介绍 `Netty API`,后半部分介绍基于 `Netty` 来设计我们的通信层。最终通过
`Fluent API` 的风格,将复杂的代码,通过简单的API给暴露了出来。

但是做到这一步只能说是完成了需求,后面我们还要做压测和调优。

1. 是否可以使用多线程?
2. 耗时对象是否可以进行池化?
3. 序列化为什么还没有支持 `Protostuff`?
4. 各种异常场景是否都捕捉到了,给出清晰的提示?
5. 能否提供更多的扩展功能?


`mojito-net` 只能做RPC吗? 难道不能做一个简单的 `web`容器? 难道不能实现一个`mq` 吗?


😊 那么你准备好跟我一起Coding了吗?，如果喜欢麻烦点个关注。

![](https://img.springlearn.cn/blog/dcdc576db14dda19819196a4dba05a21.png)

