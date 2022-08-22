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
title: dubbo 服务端注册流程
category: java
---

![](https://img.springlearn.cn/blog/aa3147663675b9b5692915030cf264b9.png)


## 一、启动一个服务端Provider

### 1. 定义一个接口和实现

```java
public interface UserService {
    void say(String message);
}
public class UserServiceImpl implements UserService {
    public void say(String message) {
        System.out.println("say:" + message);
    }
}
```

### 2. 本地服务注册到zk

```java
public class Tester {

    @Test
    public void providerTest() {

        //1. 服务方要把UserService方法提供给外面调用
        UserService userService = new UserServiceImpl();

        //2. 应用配置
        ApplicationConfig app = new ApplicationConfig();
        app.setName("providerTest");

        //3. 指定一个注册中心
        RegistryConfig registry = new RegistryConfig();
        registry.setAddress("zookeeper://127.0.0.1:2181");

        //4. 指定协议类型
        ProtocolConfig protocol = new ProtocolConfig();
        protocol.setName("dubbo");
        protocol.setPort(8012);
        protocol.setThreads(200);

        // 服务提供者暴露服务配置
        ServiceConfig<UserService> service = new ServiceConfig<UserService>(); // 此实例很重，封装了与注册中心的连接，请自行缓存，否则可能造成内存和连接泄漏
        service.setApplication(app);
        service.setRegistry(registry); // 多个注册中心可以用setRegistries()
        service.setProtocol(protocol); // 多个协议可以用setProtocols()
        service.setInterface(UserService.class);
        service.setRef(userService);
        service.setVersion("1.0.0");

        // 暴露及注册服务
        //dubbo://192.168.1.9:8012/code.UserService?anyhost=true&application=providerTest&dubbo=2.5.3&interface=code.UserService&methods=say&pid=46787&revision=1.0.0&side=provider&threads=200&timestamp=1597048727957&version=1.0.0
        service.export();

    }


}
```

### 3. 分析原理

**这里只是分析下大概原理,给各位童靴先带来带你感受,实际步骤后面分析源码时候再细说**

在进行分析之前我们思考一下,当我们不使用RPC框架和SpringCloud的时候,如果我们要调用其他第三方的服务时候,我们会怎么处理呢?

通过下面这中方式每次调用时候构建一个HTTP的请求。

```java
public class Tester{
    public static void sayRequest(String message){
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
            .url("http://第三方服务的接口地址?message"+message)
            .get().addHeader("Cache-Control","no-cache")
            .build();
        client.newCall(request).execute();    
    }
    public static void main(String[]args){
        sayRequest("你好")
    }
}

```

使用后我们就可以像调用本地方法一样来调用远程接口了? 那么Dubbo是如何实现的呢? 其实就是在底层帮我们做了类似于http的通信
而通过api的方式屏蔽了底层。让我们直接将调用本地方法一样调用远程方法。

#### 关键词一:通信协议

dubbo默认不是基于HTTP,而是基于dubbo自定义的协议。因为jdk自带的socket api不太友好,所以dubbo底层是使用netty类做通信的
说白了这个协议和http类似都是基于tcp协议从而进行封装,不同点就是数据格式不同。
如下我们自定义了一个协议来读取tcp连接中数据。

下面代码不是重点,重点知道协议就是,约定从tcp连接中读取数据的方式和方法。比如约定了读的第一个字节是协议类型,第二个是序列化类型,第三个是报文数据长度,第四个就是具体的报文数据。

```java
    /**
     * 主要依据:
     * 数据有
     * 协议类型(1位) + 序列化类型(1位) + 报文大小(4位) + 数据报文组成(N位)
     * *******************************************************************************
     * ----------------     -----------------   ----------------   ------------------
     * | 协议类型(1位) |   + | 序列化类型(1位) | + | 报文大小(4位) | + | 数据报文组成(N位)|
     * ----------------     -----------------   ----------------   ------------------
     * *******************************************************************************¬ 
     **/
    @Override
    public void doDecode(ChannelHandlerContext ctx, ByteBuf inByteBuf, List<Object> out) throws Exception {
        byte[] dataArr;
        //1. 不可读就关闭
        if (!inByteBuf.isReadable()) {
            Channel channel = ctx.channel();
            SocketAddress socketAddress = channel.remoteAddress();
            channel.close();
            System.err.println(">>>>>>>>>[" + socketAddress + "]客户端已主动断开连接....");
            return;
        }
        //2. 可读的数据大小
        int dataHeadSize = inByteBuf.readableBytes();
        //3. 不是完整的数据头就直接返回
        if (!isFullMessageHeader(dataHeadSize)) {
            return;
        }
        //4. 完整的数据头就开始看数据长度是否满足
        inByteBuf.markReaderIndex();
        //协议类型
        byte protocolType = inByteBuf.readByte();
        //序列化类型
        byte serializationType = inByteBuf.readByte();
        //数据长度
        int dataSize = inByteBuf.readInt();
        //5. 拆包的直接返回下次数据完整了,在处理
        if (!isFullMessage(inByteBuf, dataSize)) {
            inByteBuf.resetReaderIndex();
            System.out.println();
            System.err.println("######################数据不足已重置buffer######################");
            return;
        }
        System.out.println();
        System.err.println("######################数据完整######################");
        //6. 黏包的直接读取数据
        dataArr = new byte[dataSize];
        inByteBuf.readBytes(dataArr, 0, dataSize);
        //找到序列化器,性能有提升空间,可以序列化器可以进行池化
        SerializeEnum serializeEnum = SerializeEnum.ofByType(serializationType);
        Class<? extends Serialize> serialize = serializeEnum.getSerialize();
        //根据类型获取序列化器
        Serialize serializeNewInstance = serialize.newInstance();
        Object deserialize = serializeNewInstance.deserialize(dataArr);
        out.add(deserialize);
    }
```

#### 关键词二:封装通信


##### 服务端

1. 服务端将需要提供的接口实现方法封装起来
3. 并启动一个Netty服务
4. 同时将自己的地址注册到zk中

#####  客户端
1. 客户端通过将接口方法封装成URL
2. 去请求zk,拿到真实的provider地址
3. 具体调用时候去请求服务端的netty服务之星

![](https://img.springlearn.cn/blog/learn_1597050844000.png)




## 二、提供服务流程

这里我们只先分析dubbo的源码,后面再说dubbo整合spring的原理。

### 1. 要提供服务的对象

```java
public interface UserService {
    void say(String message);
}
public class UserServiceImpl implements UserService {
    public void say(String message) {
        System.out.println("say:" + message);
    }
}
```

### 2. 创建一个应用

```java
ApplicationConfig app = new ApplicationConfig();
app.setName("providerTest");
```

### 3. 指定注册中心

这里我们使用zookeeper作为注册中心
```java
 RegistryConfig registry = new RegistryConfig();
 registry.setAddress("zookeeper://127.0.0.1:2181");
```

### 4. 指定通信协议

```java
        ProtocolConfig protocol = new ProtocolConfig();
        protocol.setName("dubbo");
        protocol.setPort(8012);
        protocol.setThreads(200);
```

### 5. 导出服务到zk

```java
       // 服务提供者暴露服务配置
        ServiceConfig<UserService> service = new ServiceConfig<UserService>(); // 此实例很重，封装了与注册中心的连接，请自行缓存，否则可能造成内存和连接泄漏
        service.setApplication(app);
        service.setRegistry(registry); // 多个注册中心可以用setRegistries()
        service.setProtocol(protocol); // 多个协议可以用setProtocols()
        service.setInterface(UserService.class);
        service.setRef(userService);
        service.setVersion("1.0.0");

        // 暴露及注册服务
        //dubbo://192.168.1.9:8012/code.UserService?anyhost=true&application=providerTest&dubbo=2.5.3&interface=code.UserService&methods=say&pid=46787&revision=1.0.0&side=provider&threads=200&timestamp=1597048727957&version=1.0.0
        service.export();
```

当这一步进行完后,我们会在zookeeper的控制台找到自己的服务地址。

![](https://img.springlearn.cn/blog/learn_1597051466000.png)

通过url解码之后就是

`dubbo://192.168.1.9:8012/code.UserService?anyhost=true&application=providerTest&dubbo=2.5.3&interface=code.UserService&methods=say&pid=46787&revision=1.0.0&side=provider&threads=200&timestamp=1597048727957&version=1.0.0`

## 三、源码分析

### 1. 服务注册

我们在看二流程中,可以看到前面的1234创建的步骤都是在5中使用的,说明1234其实都是数据的载体,具体如何使用是在5中来使用的。而5的对象是`ServiceConfig`。所以说看源码的入口就从`ServiceConfig.export()`开始。

ServiceConfig的export最终后调用doExport();

![](https://img.springlearn.cn/blog/learn_1597051802000.png)

doExport方法会先检查然后在注册服务到Netty服务器和注册到zk

```java
    protected synchronized void doExport() {
        interfaceClass = Class.forName(interfaceName, true, Thread.currentThread()
                        .getContextClassLoader());
        //检查接口方法是否存在在接口中,这种是使用的方法级别的执行时候
        checkInterfaceAndMethods(interfaceClass, methods);
        //检查接口实例是否存在,必须存在否则无法执行反射
        checkRef();
        //检查应该配置,如果没有配置自动创建一个,应用名是dubbo.application.name的值
        checkApplication();
        //检查注册中心
        checkRegistry();
        //检查协议,默认是dubbo协议
        checkProtocol();
        appendProperties(this);
        checkStubAndMock(interfaceClass);
        if (path == null || path.length() == 0) {
            path = interfaceName;
        }
        //真正导出服务
        doExportUrls();
    }
```

这一步会将服务在本地启动一个服务,同时将服务注册到注册中心中。

```java
    private void doExportUrls() {
        List<URL> registryURLs = loadRegistries(true);
        //registry://127.0.0.1:2181/com.alibaba.dubbo.registry.RegistryService?application=providerTest&dubbo=2.5.3&pid=48656&registry=zookeeper&timestamp=1597052329640
        for (ProtocolConfig protocolConfig : protocols) {
            //核心逻辑在这里
            doExportUrlsFor1Protocol(protocolConfig, registryURLs);
        }
    }
```

根据doExportUrlsFor1Protocol的源码。我们发现dubbo中的所有模型都向Invoker来靠拢。

- 先创建一个Socket来验证下能不能连接上注册中心
- 然后根据协议信息,找到实现类。端口如果指定了就用指定的,没有指定就随机生成。默认是20880
- 获取服务版本号,首先查找MANIFEST.MF规范中的版本号。没有就用指定的版本号
- 通过反射生成Invoker对象
- 导出Invoker启动一个Netty服务DubboProtocol.openServer
- 注册到zk中RegistryProtocol.export

### 2. Netty服务接受服务

前面注册时候,我们说了在DubboProtocol中去创建服务的。那我们直接看这部分代码。


```java
public class DubboProtocol extends AbstractProtocol {
    //逻辑处理器
    private ExchangeHandler requestHandler = new ExchangeHandlerAdapter() {
        
        public Object reply(ExchangeChannel channel, Object message) throws RemotingException {
            if (message instanceof Invocation) {
                Invocation inv = (Invocation) message;
                Invoker<?> invoker = getInvoker(channel, inv);
                //如果是callback 需要处理高版本调用低版本的问题
                if (Boolean.TRUE.toString().equals(inv.getAttachments().get(IS_CALLBACK_SERVICE_INVOKE))){
                    String methodsStr = invoker.getUrl().getParameters().get("methods");
                    boolean hasMethod = false;
                    if (methodsStr == null || methodsStr.indexOf(",") == -1){
                        hasMethod = inv.getMethodName().equals(methodsStr);
                    } else {
                        String[] methods = methodsStr.split(",");
                        for (String method : methods){
                            if (inv.getMethodName().equals(method)){
                                hasMethod = true;
                                break;
                            }
                        }
                    }
                    if (!hasMethod){
                        logger.warn(new IllegalStateException("The methodName "+inv.getMethodName()+" not found in callback service interface ,invoke will be ignored. please update the api interface. url is:" + invoker.getUrl()) +" ,invocation is :"+inv );
                        return null;
                    }
                }
                RpcContext.getContext().setRemoteAddress(channel.getRemoteAddress());
                return invoker.invoke(inv);
            }
            throw new RemotingException(channel, "Unsupported request: " + message == null ? null : (message.getClass().getName() + ": " + message) + ", channel: consumer: " + channel.getRemoteAddress() + " --> provider: " + channel.getLocalAddress());
        }
    //创建服务    
    private void openServer(URL url) {
        // find server.
        String key = url.getAddress();
        //client 也可以暴露一个只有server可以调用的服务。
        boolean isServer = url.getParameter(Constants.IS_SERVER_KEY,true);
        if (isServer) {
        	ExchangeServer server = serverMap.get(key);
        	if (server == null) {
        		serverMap.put(key, createServer(url));
        	} else {
        		//server支持reset,配合override功能使用
        		server.reset(url);
        	}
        }
    }
    //创建服务
    private ExchangeServer createServer(URL url) {
        //默认开启server关闭时发送readonly事件
        url = url.addParameterIfAbsent(Constants.CHANNEL_READONLYEVENT_SENT_KEY, Boolean.TRUE.toString());
        //默认开启heartbeat
        url = url.addParameterIfAbsent(Constants.HEARTBEAT_KEY, String.valueOf(Constants.DEFAULT_HEARTBEAT));
        String str = url.getParameter(Constants.SERVER_KEY, Constants.DEFAULT_REMOTING_SERVER);

        if (str != null && str.length() > 0 && ! ExtensionLoader.getExtensionLoader(Transporter.class).hasExtension(str))
            throw new RpcException("Unsupported server type: " + str + ", url: " + url);

        url = url.addParameter(Constants.CODEC_KEY, Version.isCompatibleVersion() ? COMPATIBLE_CODEC_NAME : DubboCodec.NAME);
        ExchangeServer server;
        try {
            server = Exchangers.bind(url, requestHandler);
        } catch (RemotingException e) {
            throw new RpcException("Fail to start server(url: " + url + ") " + e.getMessage(), e);
        }
        str = url.getParameter(Constants.CLIENT_KEY);
        if (str != null && str.length() > 0) {
            Set<String> supportedTypes = ExtensionLoader.getExtensionLoader(Transporter.class).getSupportedExtensions();
            if (!supportedTypes.contains(str)) {
                throw new RpcException("Unsupported client type: " + str);
            }
        }
        return server;
    }    
}
```

我们主要看服务端要的3个方法

- ExchangeHandler逻辑处理器
- 创建服务openServer和createServer。
    - 底层实现NettyTransporter

#### ExchangeHandler#ExchangeHandler

既然我们说了底层是Netty来实现的,那么又知道Netty是通信框架。那么我们来看下服务端的处理逻辑吧。


```java
class DubboProtocol{
        private ExchangeHandler requestHandler = new ExchangeHandlerAdapter() {
        public Object reply(ExchangeChannel channel, Object message) throws RemotingException {
            if (message instanceof Invocation) {
                Invocation inv = (Invocation) message;
                Invoker<?> invoker = getInvoker(channel, inv);
                //如果是callback 需要处理高版本调用低版本的问题
                if (Boolean.TRUE.toString().equals(inv.getAttachments().get(IS_CALLBACK_SERVICE_INVOKE))){
                    String methodsStr = invoker.getUrl().getParameters().get("methods");
                    boolean hasMethod = false;
                    if (methodsStr == null || methodsStr.indexOf(",") == -1){
                        hasMethod = inv.getMethodName().equals(methodsStr);
                    } else {
                        String[] methods = methodsStr.split(",");
                        for (String method : methods){
                            if (inv.getMethodName().equals(method)){
                                hasMethod = true;
                                break;
                            }
                        }
                    }
                    if (!hasMethod){
                        logger.warn(new IllegalStateException("The methodName "+inv.getMethodName()+" not found in callback service interface ,invoke will be ignored. please update the api interface. url is:" + invoker.getUrl()) +" ,invocation is :"+inv );
                        return null;
                    }
                }
                RpcContext.getContext().setRemoteAddress(channel.getRemoteAddress());
                return invoker.invoke(inv);
            }
            throw new RemotingException(channel, "Unsupported request: " + message == null ? null : (message.getClass().getName() + ": " + message) + ", channel: consumer: " + channel.getRemoteAddress() + " --> provider: " + channel.getLocalAddress());
        }
        }
}
```

- 过滤器

**请看注释**

![](https://img.springlearn.cn/blog/learn_1597060745000.png)

### 3. 编码器和解码器

这里稍微说一点编码器,dubbo协议的编码器。


![](https://img.springlearn.cn/blog/learn_1597057272000.png)


```java
public class NettyServer extends AbstractServer implements Server {
    

    @Override
    protected void doOpen() throws Throwable {
        NettyHelper.setNettyLoggerFactory();
        ExecutorService boss = Executors.newCachedThreadPool(new NamedThreadFactory("NettyServerBoss", true));
        ExecutorService worker = Executors.newCachedThreadPool(new NamedThreadFactory("NettyServerWorker", true));
        ChannelFactory channelFactory = new NioServerSocketChannelFactory(boss, worker, getUrl().getPositiveParameter(Constants.IO_THREADS_KEY, Constants.DEFAULT_IO_THREADS));
        bootstrap = new ServerBootstrap(channelFactory);
        
        final NettyHandler nettyHandler = new NettyHandler(getUrl(), this);
        channels = nettyHandler.getChannels();
        // https://issues.jboss.org/browse/NETTY-365
        // https://issues.jboss.org/browse/NETTY-379
        // final Timer timer = new HashedWheelTimer(new NamedThreadFactory("NettyIdleTimer", true));
        bootstrap.setPipelineFactory(new ChannelPipelineFactory() {
            public ChannelPipeline getPipeline() {
                NettyCodecAdapter adapter = new NettyCodecAdapter(getCodec() ,getUrl(), NettyServer.this);
                ChannelPipeline pipeline = Channels.pipeline();
                /*int idleTimeout = getIdleTimeout();
                if (idleTimeout > 10000) {
                    pipeline.addLast("timer", new IdleStateHandler(timer, idleTimeout / 1000, 0, 0));
                }*/
                //解码器
                pipeline.addLast("decoder", adapter.getDecoder());
                //编码器
                pipeline.addLast("encoder", adapter.getEncoder());
                pipeline.addLast("handler", nettyHandler);
                return pipeline;
            }
        });
        // bind
        channel = bootstrap.bind(getBindAddress());
    }
}    
```

**NettyCodecAdapter adapter = new NettyCodecAdapter(getCodec() ,getUrl(), NettyServer.this);**


主要看这个类`Codec2`

![](https://img.springlearn.cn/blog/learn_1597057522000.png)

我们主要看服务端如何将tcp二进制数据转成dubbo里面的模型。

客户端: 数据DecodeableRpcInvocation -> 通过编码器转换成 -> 二进制数据

服务端: 二进制数据 -> 解码器 -> DecodeableRpcInvocation -> DubboProtocol#requestHandler处理


### 4. 序列化协议

java模型如何转二进制,就是序列化协议。我们所说的hession2协议就在这里用的。这里追求的是速度快,数据小。

` Serialization s = CodecSupport.getSerialization(channel.getUrl(), proto);`

![](https://img.springlearn.cn/blog/learn_1597058345000.png)


## 四、Invoker

前面说了dubbo中的模型都想Invoker靠拢。其实说白了就是反射。

### 1. 生成Invoker对象

可以看到dubbo里面已经提供了,构建方法。我们先熟悉如何使用其API。然后把这些小的知识点慢慢的串起来就好了。

```java
public class Tester {
    @Test
    public void buildInvokerTest() {
        JavassistProxyFactory factory = new JavassistProxyFactory();
        UserService userService = new UserServiceImpl();
        URL dubboUrl = URL.valueOf("test://");
        final Invoker<UserService> invoker = factory.getInvoker(userService, UserService.class, dubboUrl);
    }
```

### 2. 创建执行参数

Invoker是执行体,Invocation是执行参数


```java
public class Tester {
     public void buildInvokerTest() {
      final Invoker<UserService> invoker = factory.getInvoker(userService, UserService.class, dubboUrl);

        Invocation invocation = new Invocation() {

            public String getMethodName() {
                return "say";
            }

            public Class<?>[] getParameterTypes() {
                return new Class[]{String.class};
            }

            public Object[] getArguments() {
                return new Object[]{"hello"};
            }

            public Map<String, String> getAttachments() {
                return null;
            }

            public String getAttachment(String key) {
                return null;
            }

            public String getAttachment(String key, String defaultValue) {
                return null;
            }

            public Invoker<?> getInvoker() {
                return null;
            }
        };
        System.out.println(invoker.invoke(invocation));
      } 
}
```

### 3. 构建带有过滤器的Invoker



```java
@Test
    public void linkedInvokerTest() {
        JavassistProxyFactory factory = new JavassistProxyFactory();
        UserService userService = new UserServiceImpl();
        URL dubboUrl = URL.valueOf("test://");
        final Invoker<UserService> invoker = factory.getInvoker(userService, UserService.class, dubboUrl);
        List<Filter> filters = new ArrayList();
        Filter filter = new Filter() {
            public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
                System.out.println("-------执行过滤器-------");
                return invoker.invoke(invocation);
            }
        };
        filters.add(filter);
        Invoker<UserService> userServiceInvoker = buildInvokerChain(invoker, filters);
        userServiceInvoker.invoke(new Invocation() {
            public String getMethodName() {
                return "say";
            }

            public Class<?>[] getParameterTypes() {
                return new Class[]{String.class};
            }

            public Object[] getArguments() {
                return new Object[]{"hello 过滤器"};
            }

            public Map<String, String> getAttachments() {
                return null;
            }

            public String getAttachment(String key) {
                return null;
            }

            public String getAttachment(String key, String defaultValue) {
                return null;
            }

            public Invoker<?> getInvoker() {
                return null;
            }
        });
    }

```


## 五、总结

**知识点回顾**

- 如何将对象方法生成Invoker
- 如何将Invoker注册到注册地中心
- 如何处理客户端的请求
- 二进制数据转java数据协议
- 协议中包含的序列化知识


最后求关注,求订阅,谢谢你的阅读!

下一篇会讲,dubbo如何与Spring进行整合。


