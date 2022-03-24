---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: Feign Mock注意事项
---


## 一、Feign接口模拟

以下两种API的用法会导致你Feign类型推断不出来,建议使用最后一种

```java title="建议使用最后一种"
        Mockito.when(arrivalOrderFeignClient.listArrivalNoticeBatch(new PmsArrivalNoticeBatchQueryDTO())).thenReturn(JsonResult.success(result));
        Mockito.doReturn(JsonResult.success(result)).when(arrivalOrderFeignClient).listArrivalNoticeBatch(Mockito.any());
```

## 二、Mapper接口要使用Mock

对于Service层的数据测试,Mapper类使用@MockBean。保证数据都是模拟的。

对于Dal层数据测试,Mapper使用真实的示例信息。
