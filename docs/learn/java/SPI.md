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
title: SPI服务发现机制
category: Java进阶
---

![](https://img.springlearn.cn/blog/learn_1590160192000.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

## 一、什么是SPI

SPI ，全称为 Service Provider Interface，是一种服务发现机制。JDK中的SPI是通过在ClassPath路径下的META-INF/services文件夹查找扩展文件,自动加载文件里所定义的类。

在小编的理解来,觉得它更是一种思想。即找到服务的接口, 美其名曰: 服务发现机制思想。很多开源框架都有借用这种思想，比如dubbo、jdbc。



## 二、SPI在JDK中如何使用

SPI在JDK中,我们可以使用 `ServiceLoader` 类进行使用。
![](https://img.springlearn.cn/blog/learn_1590225886000.png)



### 1. 前提准备

```
public interface SpiService {
    String say();
}
```

两个实现类

```
public class ASpiServiceImpl implements SpiService {
    static {
        System.out.println("static init a");
    }

    {
        System.out.println("init a");
    }

    @Override
    public String say() {
        return "A";
    }
}
```

```
public class BSpiServiceImpl implements SpiService {
    static {
        System.out.println("static init b");
    }

    {
        System.out.println("init b");
    }
    @Override
    public String say() {
        return "B";
    }
}
```

### 2. 进行配置

在resources中创建META-INF/services目录

![](https://img.springlearn.cn/blog/learn_1590225980000.png)

```
│  └── resources
│      └── META-INF
│          └── services
│              └── com.github.easylog.spi.SpiService
```

com.github.easylog.spi.SpiService文件内容

```
com.github.easylog.spi.impl.ASpiServiceImpl
com.github.easylog.spi.impl.BSpiServiceImpl
```

### 3. 使用

通过ServiceLoader类我们可以加载到所有配置的实现类,并对实现类进行处理。需要注意一点的是，看4使用注意。

![](https://img.springlearn.cn/blog/learn_1590226089000.png)

```
public class SpiTester {
    public static void main(String[] args) {
        ServiceLoader<SpiService> spiServices = ServiceLoader.load(SpiService.class);
        Iterator<SpiService> iterator = spiServices.iterator();
        while (iterator.hasNext()) {
            SpiService next = iterator.next();
            System.out.println(next.say());
        }
    }
}
```

### 4. 使用注意

可以看下小编前面声明的两个实现类,都定义了静态代码块和非静态代码块。正常情况当这个字节码被加载,就会执行静态代码块里面的内容，但是实际运行时候却没有执行, 其实是有原因的。

![](https://img.springlearn.cn/blog/learn_1590223793000.png)

可以看到第二个参数是false。即加载时候不进行初始化。



## 三、Dubbo中服务发现思想

服务发现这种思想的特点是: 代码不是硬编码的方式,而是可配置的。只要将要支持的实现类放到指定配置文件下面,就会自动被加载起来了。然后代码中只关心使用即可。我们可以利用这种思想来实现, 框架的扩展,比如前面说了。Dubbo会利用SPI的思想进行，加载用户自定义的过滤器。

这种思想特别适合做服务扩展。现在大多数开源框架中都会使用到这种思想。

### 1. 定义过滤器

![](https://img.springlearn.cn/blog/learn_1590226192000.png)

```
@Activate(group = { Constants.PROVIDER })
public class ProviderHelloFilter implements Filter {
  
    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        System.out.pringln("hello ok!");
        return invoker.invoke(invocation);
    }

}
```

### 2. 添加配置文件

`META-INF/dubbo/Interal/com.alibaba.dubbo.rpc.Filter`

默认支持的过滤器

![](https://img.springlearn.cn/blog/learn_1590224576000.png)

利用SPI原理,我们自定义一个过滤器

![](https://img.springlearn.cn/blog/learn_1590224824000.png)

### 3. 使用

其实API跟JDK中使用ServiceLoader的方式,非常类同。唯一不同的是Dubbo中是使用ExtensionLoader。因为dubbo中做了一些特殊的增强处理。比如在配置文件中支持自定义一个别名key。如上图hello就是key。通过getExtension("hello")就能获取指定的实现类。

![](https://img.springlearn.cn/blog/learn_1590226285000.png)

```
public class SpiTester {
    public static void main(String[] args) throws Exception{
        ExtensionLoader<Filter> filterExtensionLoader = ExtensionLoader.getExtensionLoader(Filter.class);
        Set<String> supportedExtensions = filterExtensionLoader.getSupportedExtensions();
        System.out.println(supportedExtensions);
        //[accesslog, activelimit, cache...]
        Filter hello = filterExtensionLoader.getExtension("hello");
        //com.github.easylog.spi.ProviderHelloFilter@299a06ac
        System.out.println(hello);
    }
    
}
```



**那么这种思想你学会了吗? **

![](https://i04piccdn.sogoucdn.com/96a6f7554ee28b9c)



最后求关注,求订阅,谢谢你的阅读!


![](https://img.springlearn.cn/blog/learn_1589360371000.png)
