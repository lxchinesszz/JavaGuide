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
title: SpringBoot Testing
---

![](https://img.springlearn.cn/blog/learn_1618140868000.png)

前面我们对Mockito的用法有了一个了解,这里告诉大家一个好消息,SpringBoot已经帮我们继承了
这些框架,而且提供了更加简单好用的API。


## 一、Mockito加载方式

前面我们说了两种加载方式 `MockitoJUnitRunner` 和 ` MockitoAnnotations.initMocks(this);`
这些在SpringBoot中都不需要了。

所以这一段就是废话, 不用在看了。但是相信你已经看完了。

## 二、Mockito必知概念

这些概念,参考Mockito章节,概念统统保留。

### 2.1 完全模拟 MockBean

只需要将@Mock 换成 @MockBean即可

### 2.2 部分模拟 SpyBean

只需要将@Spy 换成 @MockBean即可。主要这里有一个小坑。
如果是Feign接口,使用@SpyBean会报错。提示final class不能被代理。

原因是SpringBoot依赖的Mockito版本太古老了,是2.23.4。从Mockito2.7.6
开始已经解决了这个问题, 我们可以通过引入下面依赖解决。

```xml
 <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-inline</artifactId>
    <version>3.3.3</version>
</dependency>
```

解决方案就是帮我们新增了一个配置,启动Mockit的插件来生成代理。
大概原理就是及不实用JDK代理,也不是Cglib代理。
`DefaultMockitoPlugins` & `InlineByteBuddyMockMaker`
![](https://img.springlearn.cn/blog/learn_1617877205000.png)


## 三、代码实例


### 3.1 @MockBean 完全模拟

没有被声明的方法返回值,对象类型返回null,基本类型是返回默认类型。

@MockBean完全模拟

```java


public class TradeShopIntegrationImplTest extends BaseApplicationTest {

    @Autowired
    private TradeShopIntegration shopBrandIntegration;

    @MockBean
    private BrandServiceApi brandService;
    
    @MockBean
    private GoodsStockApi goodsStockApi;
    
    @Test
    public void testGetAllBrands() {
        Mockito.doReturn(JsonResult.failure("fail")).when(goodsStockApi).getSkuList(Mockito.any());
        // 底层调用的是goodsStockApi.getSkuList()
        List<GoodsBaseMsgDTO> goodsBaseMsgDTOS = shopBrandIntegration.queryAllSku();
        // 因为前面声明了返回fail。所以这里没有数据返回。
        JsonConsoleUtils.println(goodsBaseMsgDTOS);
        // 这里因为使用的是Mock完全模拟,所以尽管前面没有声明返回值,就默认返回null
        List<OutBrandDTO> allBrands = shopBrandIntegration.getAllBrands();
        JsonConsoleUtils.println(allBrands);
    }
    
}    
```

### 3.1 @SpyBean 部分模拟

没有被声明的方法返回值,走原来逻辑。

@SpyBean部分模拟

```java {22}


public class TradeShopIntegrationImplTest extends BaseApplicationTest {

    @Autowired
    private TradeShopIntegration shopBrandIntegration;

    @MockBean
    private BrandServiceApi brandService;
    
    @MockBean
    private GoodsStockApi goodsStockApi;
    
    @Test
    public void testGetAllBrands() {
        Mockito.doReturn(JsonResult.failure("fail")).when(goodsStockApi).getSkuList(Mockito.any());
        // 底层调用的是goodsStockApi.getSkuList()
        List<GoodsBaseMsgDTO> goodsBaseMsgDTOS = shopBrandIntegration.queryAllSku();
        // 因为前面声明了返回fail。所以这里没有数据返回。
        JsonConsoleUtils.println(goodsBaseMsgDTOS);
        // 这里跟上面的区别就是,如果没有声明返回值,就走原来的方法。
        List<OutBrandDTO> allBrands = shopBrandIntegration.getAllBrands();
        JsonConsoleUtils.println(allBrands);
    }
    
}    
```
