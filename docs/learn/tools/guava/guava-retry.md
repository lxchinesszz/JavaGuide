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
title: Guava-retry重试组件
---

## 一、简介

:::info Guava-retry
Guava 是一组来自 Google 的核心 Java 库，其中包括新的集合类型（例如 multimap 和 multiset）、不可变集合、图形库以及用于并发、I/O、散列、缓存、原语、字符串等的实用程序！它广泛用于 Google
内部的大多数 Java 项目，也被许多其他公司广泛使用。


API 非常的简单，我们可以非常轻松的使用，来封装成我们业务中自己的组件。
:::

## 二、依赖

```xml 
    <dependency>
        <groupId>com.github.rholder</groupId>
        <artifactId>guava-retrying</artifactId>
        <version>2.0.0</version>
    </dependency>
```

## 三、使用

### 3.1 指定异常

配置如果发生了 `Exception` 异常进行重试

```java {3}
    Retryer<User> retry = RetryerBuilder.<User>newBuilder()
                //发生ConnectException异常时重试
                .retryIfExceptionOfType(Exception.class)
                //重试的等待策略 初始等待1s，每次递增1s。如：第一次1s，第二次2s，第三次3s，以此类推...
                .withWaitStrategy(WaitStrategies.incrementingWait(1, TimeUnit.SECONDS, 1, TimeUnit.SECONDS))
                //重试3次后停止
                .withStopStrategy(StopStrategies.stopAfterAttempt(3)).build();
```

### 3.2 重试策略

WaitStrategy 重试策略

```java {5}
    Retryer<User> retry = RetryerBuilder.<User>newBuilder()
                //发生ConnectException异常时重试
                .retryIfExceptionOfType(Exception.class)
                //重试的等待策略 初始等待1s，每次递增1s。如：第一次1s，第二次2s，第三次3s，以此类推...
                .withWaitStrategy(WaitStrategies.incrementingWait(1, TimeUnit.SECONDS, 1, TimeUnit.SECONDS))
                //重试3次后停止
                .withStopStrategy(StopStrategies.stopAfterAttempt(3)).build();
```

| 策略             | 使用方法                                                     | 说明                                                         |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 固定策略         | WaitStrategies.fixedWait(10,TimeUnit.SECONDS)                | 每10秒执行一次                                               |
| 随机策略         | WaitStrategies.randomWait(100,TimeUnit.SECONDS)              | 0 到 100秒之间随机执行一次                                   |
| 随机策略         | WaitStrategies.randomWait(10,TimeUnit.SECONDS,20,TimeUnit.SECONDS) | 10 到 20秒之间随机执行一次                                   |
| 递增策略         | WaitStrategies.incrementingWait(1, TimeUnit.SECONDS, 1, TimeUnit.SECONDS) | 初始等待1s，每次递增1s。如：第一次1s，第二次2s，第三次3s，以此类推... |
| 异常策略         | WaitStrategies.exceptionWait(...)                            | 不同的异常返回不同的重试时间                                 |
| 斐波那契数列策略 | WaitStrategies.fibonacciWait(...)                            | 1、1、2、3、5、8、13、21类推                                 |

### 3.3 重试监听器

Attempt 代表每次执行动作，可以获取执行次数，打印执行日志

```java {7}
 Retryer<User> retry = RetryerBuilder.<User>newBuilder()
                //发生ConnectException异常时重试
                .retryIfExceptionOfType(Exception.class)
                //重试的等待策略 初始等待1s，每次递增1s。如：第一次1s，第二次2s，第三次3s，以此类推...
                .withWaitStrategy(WaitStrategies.incrementingWait(1, TimeUnit.SECONDS, 1, TimeUnit.SECONDS))
                //重试监听器
                .withRetryListener(new RetryListener() {
                    @Override
                    public <V> void onRetry(Attempt<V> attempt) {
                        System.out.println("重试次数:" + attempt.getAttemptNumber());
                        System.out.println("异常:" + attempt.getExceptionCause());
                        System.out.println("返回值:"+attempt.get());
                    }
                })
                //重试3次后停止
                .withStopStrategy(StopStrategies.stopAfterAttempt(10)).build();
```

### 3.4 停止策略

StopStrategy 一般常用的就是重试多少次

```java {7}
 Retryer<User> retry = RetryerBuilder.<User>newBuilder()
                //发生ConnectException异常时重试
                .retryIfExceptionOfType(Exception.class)
                //重试的等待策略 初始等待1s，每次递增1s。如：第一次1s，第二次2s，第三次3s，以此类推...
                .withWaitStrategy(WaitStrategies.incrementingWait(1, TimeUnit.SECONDS, 1, TimeUnit.SECONDS))
                //重试3次后停止
                .withStopStrategy(StopStrategies.stopAfterAttempt(10)).build();
```

- StopAfterDelayStrategy ：设定一个最长允许的执行时间；比如设定最长执行10s，无论任务执行次数，只要重试的时候超出了最长时间，则任务终止，并返回重试异常RetryException；
- NeverStopStrategy ：不停止，用于需要一直轮训直到返回期望结果的情况；
- StopAfterAttemptStrategy ：设定最大重试次数，如果超出最大重试次数则停止重试，并返回重试异常；

