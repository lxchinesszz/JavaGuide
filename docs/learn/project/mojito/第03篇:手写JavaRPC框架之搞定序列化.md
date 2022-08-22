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
title: 第03篇:手写JavaRPC框架之搞定序列化
category: mojito
---



![](https://img.springlearn.cn/blog/f18e12cc1d0c57c16e6d6cb258fe746c.png)

> 天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

## 一、前言

天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！从本篇开始后面的所有章节都是实战环节,每节一个小目标,最终我们实现完整的JavaRPC的框架,然后发布maven仓库,感兴趣的同学可以下载研究。大家如果想要获取源码的话可以私信: RPC,自动回复仓库地址。

其实这些东西并没有什么难度，只要从头到尾跟着我们一起coding，其实就会发现不过如此。所以就算是新手也不要有心里负担。还是那句话: "天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄"。主要的是思想，而不是死记硬背。所以我们来主要来学习设计思想，具体的代码，收藏用的时候看下就好了。

下面我们废话就不多少，直接开始吧。


## 二、目标

### 2.1 目标介绍

RPC框架中最基础的一个功能就是通讯，而通讯的本质就是发送方将数据转换成二进制的数据流，然后通过网络管道将数据发送给服务方，服务方在通过读取管道中的二进制数据最终将数据从二进制转换成Java对象，然后供Java系统处理，处理完成后再将Java结果对象转换成二进制数据通过管道发送回去。

![](https://img.springlearn.cn/blog/70b0a4323f80010510da069e00929af9.png)

这里有两个重点，第一个是网络通信，就是图中的网路连接管道，第二个是管道中的二进制数据。本篇文章我们先研究后者，就是通过代码将Java对象转换成二进制数据。因为通信比较难，内容也较多，所以我们先易后难，难的放到下一篇文章在说。

**这里有两个术语: 序列化和反序列化**


如下实例User类，转换成二进制数据就是一个数组。这个Java对象转换二进制数据的过程叫做序列化。
而二进制数据转换成Java对象的过程叫做反序列化。

![](https://img.springlearn.cn/blog/81cf177405be228573207ef58bf95425.png)

### 2.2 两个小目标

- 第一个目标就是我们实现多种序列化的能力。
- 第二个目标是来选择一个最优的序列化方案。

为什么说要选择最优的序列化方案呢? 因为我们要适配下面这两种场景。

1. 第一种是对性能要有比较高的，这种情况就要求我们序列化和反序列的速度要足够快
2. 第二种就是对内存和空间要有比较高的，就要求我们的序列化后的数据要足够的小。

下面就开始Coding了。

## 三、设计

### 3.1 工程结构

首先我们根据上一篇文章中定义的项目分层结构，先把需要的所有层给创建出来。然后实现序列化。

```
mojito/mojito-net/src/main/java/cn/lxchinesszz/mojito on  master [!+?] 
.
├── api
├── business
├── codec
├── exception
│   ├── BusinessServerHandlerException.java
│   ├── DeserializeException.java
│   ├── HttpsTokenFileException.java
│   ├── ProtocolException.java
│   ├── RemotingException.java
│   ├── SerializeException.java
│   └── SignatureException.java
├── exchange
└── serialize
    ├── AbstractSerializer.java
    ├── Serializer.java
    └── impl
        ├── Hession2ObjectSerializer.java
        ├── HessionObjectSerializer.java
        ├── NettyCompactObjectSerializer.java
        ├── NettyObjectSerializer.java
        └── ProtostuffObjectSerializer.java

```

### 3.2 代码结构


首先我们先定义接口，为什么定义接口呢? 方便后面的扩展。
接口也非常的简单就三个方法。

![](https://img.springlearn.cn/blog/519c51c51f1ac52200ed099ec2e21bf4.png)

1. 负责将任意对象转换成二进制数组
2. 将二进制数组转成Object对象
3. 将二进制数组转换成指定的Java对象


UML图设计

![](https://img.springlearn.cn/blog/766a961a5b806a72922da75af14ca165.png)


### 3.3 实现

- ProtostuffObjectSerializer
  使用谷歌开源的序列化库,特点占用极小。

```java
public class ProtostuffObjectSerializer extends AbstractSerializer {

    /**
     * 线程数会有限制,不会无穷大的使用
     */
    private static final ThreadLocal<LinkedBuffer> BUFFER = InheritableThreadLocal.withInitial(() ->
            LinkedBuffer.allocate(LinkedBuffer.DEFAULT_BUFFER_SIZE));

    @Override
    @SuppressWarnings("unchecked")
    public byte[] doSerialize(Object dataObject) throws SerializeException {
        // // RuntimeSchema 懒加载内置缓存,所以我们不用在缓存了
        Schema<Object> schema = (Schema<Object>) RuntimeSchema.getSchema(dataObject.getClass());
        LinkedBuffer linkedBuffer = BUFFER.get();
        byte[] bytes = ProtostuffIOUtil.toByteArray(dataObject, schema, linkedBuffer);
        linkedBuffer.clear();
        return bytes;
    }

    @Override
    public Object doDeserialize(byte[] data) throws DeserializeException {
        throw new UnsupportedOperationException(getClass() + "必须指定反序列化类型");
    }

    @Override
    public <T> T deserialize(byte[] data, Class<T> dataType) throws DeserializeException {
        return schema(data, dataType);
    }

    public <T> T schema(byte[] data, Class<T> dataType) throws DeserializeException {
        try {
            Schema<T> schema = RuntimeSchema.getSchema(dataType);
            T dataTypeObj = dataType.newInstance();
            ProtostuffIOUtil.mergeFrom(data, dataTypeObj, schema);
            return dataTypeObj;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new DeserializeException(e);
        }
    }
}
```

- NettyCompactObjectSerializer
  Netty原生支持的序列化协议
```java
public class NettyCompactObjectSerializer extends AbstractSerializer {

    @Override
    public byte[] doSerialize(Object dataObject) throws SerializeException {
        try (ByteArrayOutputStream dataArr = new ByteArrayOutputStream();
             CompactObjectOutputStream oeo = new CompactObjectOutputStream(dataArr)) {
            oeo.writeObject(dataObject);
            oeo.flush();
            return dataArr.toByteArray();
        } catch (IOException e) {
            throw new SerializeException(e);
        }
    }

    @Override
    public Object doDeserialize(byte[] data) throws DeserializeException {
        Object o;
        try (CompactObjectInputStream odi = new CompactObjectInputStream(new ByteArrayInputStream(data), ClassResolvers.cacheDisabled(null))) {
            o = odi.readObject();
        } catch (ClassNotFoundException | IOException e) {
            throw new DeserializeException(e);
        }
        return o;
    }
    
    private static class CompactObjectOutputStream extends ObjectOutputStream {

        static final int TYPE_FAT_DESCRIPTOR = 0;
        static final int TYPE_THIN_DESCRIPTOR = 1;

        CompactObjectOutputStream(OutputStream out) throws IOException {
            super(out);
        }

        @Override
        protected void writeStreamHeader() throws IOException {
            writeByte(STREAM_VERSION);
        }

        @Override
        protected void writeClassDescriptor(ObjectStreamClass desc) throws IOException {
            Class<?> clazz = desc.forClass();
            if (clazz.isPrimitive() || clazz.isArray() || clazz.isInterface() ||
                    desc.getSerialVersionUID() == 0) {
                write(TYPE_FAT_DESCRIPTOR);
                super.writeClassDescriptor(desc);
            } else {
                write(TYPE_THIN_DESCRIPTOR);
                writeUTF(desc.getName());
            }
        }
    }

    /**
     * 压缩
     */
    private static class CompactObjectInputStream extends ObjectInputStream {

        static final int TYPE_FAT_DESCRIPTOR = 0;

        static final int TYPE_THIN_DESCRIPTOR = 1;

        private final ClassResolver classResolver;

        CompactObjectInputStream(InputStream in, ClassResolver classResolver) throws IOException {
            super(in);
            this.classResolver = classResolver;
        }

        @Override
        protected void readStreamHeader() throws IOException {
            int version = readByte() & 0xFF;
            if (version != STREAM_VERSION) {
                throw new StreamCorruptedException(
                        "Unsupported version: " + version);
            }
        }

        @Override
        protected ObjectStreamClass readClassDescriptor()
                throws IOException, ClassNotFoundException {
            int type = read();
            if (type < 0) {
                throw new EOFException();
            }
            switch (type) {
                case TYPE_FAT_DESCRIPTOR:
                    return super.readClassDescriptor();
                case TYPE_THIN_DESCRIPTOR:
                    String className = readUTF();
                    Class<?> clazz = classResolver.resolve(className);
                    return ObjectStreamClass.lookupAny(clazz);
                default:
                    throw new StreamCorruptedException(
                            "Unexpected class descriptor type: " + type);
            }
        }

        @Override
        protected Class<?> resolveClass(ObjectStreamClass desc) throws IOException, ClassNotFoundException {
            Class<?> clazz;
            try {
                clazz = classResolver.resolve(desc.getName());
            } catch (ClassNotFoundException ignored) {
                clazz = super.resolveClass(desc);
            }

            return clazz;
        }
    }
}

```
- HessionObjectSerializer
  基于Hession序列化协议的封装
```java
public class HessionObjectSerializer extends AbstractSerializer {

    @Override
    public byte[] doSerialize(Object dataObject) throws SerializeException {
        HessianOutput oeo = null;
        try (ByteArrayOutputStream dataArr = new ByteArrayOutputStream()) {
            oeo = new HessianOutput(dataArr);
            oeo.writeObject(dataObject);
            oeo.flush();
            return dataArr.toByteArray();
        } catch (IOException e) {
            throw new SerializeException(e);
        } finally {
            if (oeo != null) {
                try {
                    oeo.close();
                } catch (IOException e) {
                    throw new SerializeException(e);
                }
            }
        }
    }

    @Override
    public Object doDeserialize(byte[] data) throws DeserializeException {
        Object o;
        HessianInput odi = new HessianInput(new ByteArrayInputStream(data));
        try {
            o = odi.readObject();
        } catch (IOException e) {
            throw new DeserializeException(e);
        }
        return o;
    }

}

```
- Hession2ObjectSerializer
  对Hession2序列化的封装

```java
public class Hession2ObjectSerializer extends AbstractSerializer {

    @Override
    public byte[] doSerialize(Object dataObject) throws SerializeException {
        ByteArrayOutputStream dataArr = new ByteArrayOutputStream();
        Hessian2Output oeo = null;
        try {
            oeo = new Hessian2Output(dataArr);
            oeo.writeObject(dataObject);
            oeo.flush();
        } catch (IOException e) {
            throw new SerializeException(e);
        } finally {
            if (oeo != null) {
                try {
                    oeo.close();
                } catch (IOException e) {
                    throw new SerializeException(e);
                }
            }
        }
        return dataArr.toByteArray();
    }

    @Override
    public Object doDeserialize(byte[] data) throws DeserializeException {
        Object o;
        Hessian2Input odi = new Hessian2Input(new ByteArrayInputStream(data));
        try {
            o = odi.readObject();
        } catch (IOException e) {
            throw new DeserializeException(e);
        }
        return o;
    }
    
}
```

如果有优化的建议，希望多多评论，指点一二。以上代码已上传，代码较多就不这里展示。感兴趣的同学可以访问下面链接，查看代码。

[仓库实现](https://github.com/lxchinesszz/mojito/tree/master/mojito-net/src/main/java/cn/lxchinesszz/mojito/serialize)

## 四、性能分析

### 4.1 性能分析

那么以上这几种序列化协议那种速度最好呢?

首先我们先看序列化的速度对比。

使用20个线程，预热3秒，执行5秒对比下吞吐量及内存使用。这里我们只截图排名第一的实现。具体的对比数据已放在github上面，感兴趣的可以自己拉下来看下。

![](https://img.springlearn.cn/blog/c840802c5053f6f068aaca6978f16317.png)

- ProtostuffObjectSerializer 吞吐量	10,774,518 / s
- Hession2ObjectSerializer 吞吐量	3,200,559 / s
- HessionObjectSerializer 吞吐量	3,307,595 / s
- NettyCompactObjectSerializer 吞吐量	874,793 / s

从上面中的数据我们能看出Protostuff是遥遥领先,这得益于提前把数据类型,提前进行了处理并缓存，其次是友好的API涉及,可以让我们避免频繁生成堆空间。

![](https://img.springlearn.cn/blog/b120424dd518e8586c3f6cc0d2ce08cd.png)

更多详细的数据对比，可以点下面链接查看。

[详细数据](https://img.springlearn.cn/learn_05ff80a9fa21590abbf09c0608a76028.html)


### 4.2 序列化长度

前面Protostuff在性能上是遥遥领先,那么在数据压缩比例上究竟谁能胜出呢？ 相对于前面性能测试，这种大小测试是比较容易测试, 我们直接执行下面代码，查看结果。

```java
    @Test
    @DisplayName("序列化数据大小对比")
    public void test7() {
        ProtostuffObjectSerializer nettyObjectSerializer = new ProtostuffObjectSerializer();
        byte[] jay = nettyObjectSerializer.serialize(new UserSerializable("周杰伦", 42));
        ColorConsole.colorPrintln("{},序列化数据长度:{}", "Protostuff", jay.length);

        ColorConsole.colorPrintln("{},序列化数据长度:{}", "Hession2",
                new Hession2ObjectSerializer().serialize(new UserSerializable("周杰伦", 42)).length);

        ColorConsole.colorPrintln("{},序列化数据长度:{}", "Hession",
                new HessionObjectSerializer().serialize(new UserSerializable("周杰伦", 42)).length);

        ColorConsole.colorPrintln("{},序列化数据长度:{}", "NettyCompact",
                new NettyCompactObjectSerializer().serialize(new UserSerializable("周杰伦", 42)).length);
    }
```


|实现类|长度|
|:--|:--|
|ProtostuffObjectSerializer|13字节|
|Hession2ObjectSerializer|88字节|
|HessionObjectSerializer|98字节|
|NettyCompactObjectSerializer|132字节|

还是Protostuff大幅度领先,那么我们的默认序列化协议就使用了吧。是不是很简单呢?


## 五、总结
![](https://img.springlearn.cn/blog/70b0a4323f80010510da069e00929af9.png)

通过这一节的实现,我们已经可以使用序列化工具,将Java对象转换成二进制数据了，那么下一篇我们就来实现如果创建网络连接管道吧。

那么你准备好跟我一起Coding了吗?

![](https://img.springlearn.cn/blog/dcdc576db14dda19819196a4dba05a21.png)
