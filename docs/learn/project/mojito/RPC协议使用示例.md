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
title: RPC协议使用示例
category: mojito
---

Welcome to the mojito wiki!
# RPC协议使用示例


**使用示例**: `com.hanframework.mojito.config.Installer2Test`

## 一、构件一个RPC协议的服务端

`Installer` 可以轻松构建服务端,只要编写 `BusinessHandler` 服务端业务处理器即可。

- startAsync 非阻塞构建
- start 阻塞构建

```java

   @Test
    public void serverTest() throws Exception {
        Installer.server(RpcUserRequest.class, RpcUserResponse.class)
                //这里接受客户端的请求,并返回一个相应
                .serverHandler((channel, rpcRequest) -> new RpcUserResponse("服务端返回: " + rpcRequest.message))
                .create()
                .startAsync(12306);
    }
```

## 二、构建HTTP客户端

同样使用 `Installer` 快速构建客户端

```java
    public void clientTest() throws Exception {
        Client<RpcUserRequest, RpcUserResponse> client = Installer.client(RpcUserRequest.class, RpcUserResponse.class)
                .connect("127.0.0.1", 12306);
        MojitoFuture<RpcUserResponse> mojitoFuture = client.sendAsync(new RpcUserRequest("关注微信公众号:程序猿升级课"));
        System.out.println("返回结果:" + mojitoFuture.get());
    }
```
