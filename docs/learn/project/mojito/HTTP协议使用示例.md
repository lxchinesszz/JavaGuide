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
title: HTTP协议使用示例
category: mojito
---

# Mojito Framework

**使用示例**: `com.hanframework.mojito.config.HttpInstallerTest`

## 一、构建一个非阻塞HTTP服务端

`Installer` 可以轻松构建HTTP服务端,只要编写 `BusinessHandler` 服务端业务处理器即可。

- startAsync 非阻塞构建
- start 阻塞构建

```java
    /**
     * 构建http服务端
     */
    @Test
    public void testHttpServer() throws Exception {

        Installer.httpServer((channel, request) -> {
            System.out.println("请求地址:" + request.getRequestURI());
            System.out.println("请求头" + request.getHeaders());
            System.out.println("请求参数:" + request.getRequestParams());
            System.out.println("请求body:" + request.getBody());
            return HttpResponseFacade.HTML("<h1>Hello</h1>");
        }).startAsync(8080);

        testHttpClient();

        okHttpClientTest();
    }
```

## 二、构建HTTP客户端

### 1. 使用第三方包构建客户端

前面说了，HTTP是基于标准的HTTP协议,所以市面上的HttpClient都是支持的。如下使用 `OkHttpClient` 构建一个GET请求。

```java
    private void okHttpClientTest() {
        OkHttpClient okHttpClient = new OkHttpClient();
        Request request = new Builder().url("http://127.0.0.1:8080").get().build();
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                // ... handle failed request
                System.out.println("发送失败");
            } else {
                String responseBody = response.body().string();
                System.out.println("OkHttpClient处理返回:" + responseBody);
            }
        } catch (IOException e) {
            // ... handle IO exception
        }
    }

```

### 2. 使用框架构建客户端
因为HTTP默认的请求类是 `HttpRequestFacade` 所以必须使用 `HttpRequestBuilder` 来进行构建请求。

- connect 建立连接
- close   关闭连接

**注意:**
http数据无状态协议,如果要保持连接要在请求头中指定。
`addHeader(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE)`

```java
    /**
     * 支持长连接
     *
     * @throws Exception 异常
     */
    private void testHttpClient() throws Exception {
        Client<HttpRequestFacade, HttpResponseFacade> httpClient = Installer.httpClient();
        httpClient.connect("127.0.0.1", 8080);
        URI uri = new URI("/user/get");
        HttpRequestBuilder httpRequestBuilder = new HttpRequestBuilder()
                .GET(uri)
                //设置长连接
                .addHeader(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
        for (int i = 0; i < 10; i++) {
            HttpRequestFacade httpRequestFacade = httpRequestBuilder.wrapBuild();
            System.out.println("request-id-request-" + i + "-" + httpRequestFacade.getId());
            MojitoFuture<HttpResponseFacade> httpResponseFacadeMojitoFuture = httpClient.sendAsync(httpRequestFacade);
            System.out.println("request-id-response-" + i + "-" + httpResponseFacadeMojitoFuture.get().getId());
        }
        httpClient.close();
    }
```
