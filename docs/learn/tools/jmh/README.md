---
breadcrumb: false
navbar: true
sidebar: auto
pageInfo: true
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
sidebarDepth: 3
title: JMH基准测试
password: 123
icon: zuanshi
---

[参考链接](https://www.zhihu.com/question/276455629/answer/1259967560)

[官方文档](http://openjdk.java.net/projects/code-tools/jmh/)

[性能调优必备利器之 JMH](https://www.bbsmax.com/A/qVdeEr01dP/)

## 一、JMH

JMH即Java Microbenchmark Harness，是Java用来做基准测试的一个工具，该工具由OpenJDK提供并维护，测试结果可信度高。

基准测试Benchmark是测量、评估软件性能指标的一种测试，对某个特定目标场景的某项性能指标进行定量的和可对比的测试。

## 1.1 为什么要用JMH

if 快还是 switch 快？HashMap 的初始化 size 要不要指定，指定之后性能可以提高多少？各种序列化方法哪个耗时更短？

无论出自何种原因需要进行性能评估，量化指标总是必要的。

在大部分场合，简单地回答谁快谁慢是远远不够的，如何将程序`性能量化`呢？

这就需要我们的主角 JMH 登场了！

## 二、前期准备

## 2.1 引入依赖
```xml 
<dependencies>
    <dependency>
        <groupId>org.openjdk.jmh</groupId>
        <artifactId>jmh-core</artifactId>
        <version>1.23</version>
    </dependency>
 
    <dependency>
        <groupId>org.openjdk.jmh</groupId>
        <artifactId>jmh-generator-annprocess</artifactId>
        <version>1.23</version>
    </dependency>
</dependencies>
```

## 2.2 安装插件

[jmh-java-microbenchmark-harness](https://plugins.jetbrains.com/plugin/7529-jmh-java-microbenchmark-harness)

![](https://img.springlearn.cn/blog/learn_1653405994000.png)

当安装插件后,只要被`@Benchmark`就会认为是一个test方法,出现执行按钮
![](https://img.springlearn.cn/blog/learn_1653405953000.png)

当然也可以不安装插件,如下代码也会进行输出

```java 
    public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
                .include(BenchmarkTest.class.getSimpleName())
                .resultFormat(ResultFormatType.JSON)
                .build();
        new Runner(opt).run();
    }
```

## 三、使用说明

在正式使用前,先介绍下JMH基准测试中可以使用的注解。

![](https://img.springlearn.cn/blog/learn_1653716179000.png)

## 3.1 @BenchmarkMode

用来配置 Mode 选项，可用于类或者方法上，这个注解的 value 是一个数组，可以把几种 Mode 集合在一起执行，如：@BenchmarkMode({Mode.SampleTime, Mode.AverageTime})，还可以设置为 Mode.All，即全部执行一遍。

1. Throughput：整体吞吐量，每秒执行了多少次调用，单位为 ops/time
2. AverageTime：用的平均时间，每次操作的平均时间，单位为 time/op
3. SampleTime：随机取样，最后输出取样结果的分布
4. SingleShotTime：只运行一次，往往同时把 Warmup 次数设为 0，用于测试冷启动时的性能
5. All：上面的所有模式都执行一次


## 3.2 @State

通过 State 可以指定一个对象的作用范围，JMH 根据 scope 来进行实例化和共享操作。@State 可以被继承使用，如果父类定义了该注解，子类则无需定义。由于 JMH 允许多线程同时执行测试，不同的选项含义如下

1. Scope.Benchmark：所有测试线程共享一个实例，测试有状态实例在多线程共享下的性能
2. Scope.Group：同一个线程在同一个 group 里共享实例
3. Scope.Thread：默认的 State，每个测试线程分配一个实例

## 3.3 @OutputTimeUnit

为统计结果的时间单位，可用于类或者方法注解


## 3.4 @Warmup
预热所需要配置的一些基本测试参数，可用于类或者方法上。一般前几次进行程序测试的时候都会比较慢，所以要让程序进行几轮预热，保证测试的准确性。参数如下所示：

1. iterations：预热的次数
2. time：每次预热的时间
3. timeUnit：时间的单位，默认秒
4. batchSize：批处理大小，每次操作调用几次方法

为什么需要预热？
>因为 JVM 的 JIT 机制的存在，如果某个函数被调用多次之后，JVM 会尝试将其编译为机器码，从而提高执行速度，所以为了让 benchmark 的结果更加接近真实情况就需要进行预热。

## 3.5 @Measurement

实际调用方法所需要配置的一些基本测试参数，可用于类或者方法上，参数和 @Warmup 相同。

1. iterations：执行的次数
2. time：每次执行时间
3. timeUnit：时间的单位，默认秒
4. batchSize：批处理大小，每次操作调用几次方法

## 3.6 @Threads

配置同时起多少个线程执行，默认值世 Runtime.getRuntime().availableProcessors()

## 3.7 @Fork

进行 fork 的次数，可用于类或者方法上。如果 fork 数是 2 的话，则 JMH 会 fork 出两个进程来进行测试。

## 3.8 @Param

指定某项参数的多种情况，特别适合用来测试一个函数在不同的参数输入的情况下的性能，只能作用在字段上，使用该注解必须定义 @State 注解。

## 四、场景案例

- [可视化分析平台](https://jmh.morethan.io/)
- [JMH Visual Chart](http://deepoove.com/jmh-visual-chart/)

## 4.1 for循环性能

循环100w次,并输出。预热2次,执行2次,2个线程,1个进程,统计结果单位毫秒。

![](https://img.springlearn.cn/blog/learn_1653717279000.png)

|方法|平均耗时|
|:--:|:--:|
|普通for循环|7898ms|
|增强for循环|8078ms|
|迭代器|8314ms|
|Stream循环|9085ms|

```java 

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.results.format.ResultFormatType;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@Warmup(iterations = 2)
@Measurement(iterations = 2)
@Threads(2)
@Fork(1)
@State(Scope.Thread)
public class ForBenchmarkTest {

    private static List<Integer> integers;

    static {
        integers = generate(1000000);
    }

    private static List<Integer> generate(Integer max) {2
        List<Integer> result = new ArrayList<>(max);
        for (int i = 0; i < max; i++) {
            result.add(i);
        }
        return result;
    }

    @Benchmark
    public void forTest() {
        for (int i = 0; i < integers.size(); i++) {
            System.out.println(integers.get(i));
        }
    }

    @Benchmark
    public void forEachTest() {
        for (Integer integer : integers) {
            System.out.println(integer);
        }
    }

    @Benchmark
    public void iteratorTest() {
        Iterator<Integer> iterator = integers.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }

    @Benchmark
    public void streamForEachTest() {
        integers.forEach(System.out::println);
    }

    public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
                .include(ForBenchmarkTest.class.getSimpleName())
                .resultFormat(ResultFormatType.JSON)
                .build();
        new Runner(opt).run();
    }
}

```


## 4.2 反射性能

![](https://img.springlearn.cn/blog/learn_1653719819000.png)

通过上面数据可以得到。反射缺失很耗时。开启安全检查比不开启耗时, 如果反射在加上缓存,会比较好一点。

- metaClass1k 是1k次操作，反射+缓存
- metaClass1w 是1w次操作，反射+缓存
- test1k 是1k次正常操作
- test1w 是1w次正常操作
- testReflection1k 是1k次操作，反射
- testReflection1w 是1w次操作，反射
- testReflectionAccessible1k 是1k次操作，反射，关闭安全检查
- testReflectionAccessible1k 是1w次操作，反射，关闭安全检查

```java 
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.SECONDS)
@Warmup(iterations = 5, time = 1)
@Measurement(iterations = 10, time = 1)
@Threads(2)
@Fork(1)
@State(Scope.Thread)
public class ReflectionBenchmarkTest {

    private static class Mode {
        private Integer age;

        public void setAge(Integer age) {
            this.age = age;
        }
    }

    @Benchmark
    public void test1k() {
        Mode mode = new Mode();
        Loops.loop(1000, mode::setAge);
    }

    @Benchmark
    public void testReflection1k() {
        Mode mode = new Mode();
        Loops.loop(1000, i -> {
            Method setAge = null;
            try {
                setAge = mode.getClass().getMethod("setAge", Integer.class);
                setAge.invoke(mode, i);
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Benchmark
    public void testReflectionAccessible1k() {
        Mode mode = new Mode();
        Loops.loop(1000, i -> {
            Method setAge = null;
            try {
                setAge = mode.getClass().getMethod("setAge", Integer.class);
                setAge.setAccessible(true);
                setAge.invoke(mode, i);
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Benchmark
    public void test1w() {
        Mode mode = new Mode();
        Loops.loop(10000, mode::setAge);
    }

    @Benchmark
    public void testReflection1w() {
        Mode mode = new Mode();
        Loops.loop(10000, i -> {
            Method setAge = null;
            try {
                setAge = mode.getClass().getMethod("setAge", Integer.class);
                setAge.invoke(mode, i);
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Benchmark
    public void testReflectionAccessible1w() {
        Mode mode = new Mode();
        Loops.loop(10000, i -> {
            Method setAge = null;
            try {
                setAge = mode.getClass().getMethod("setAge", Integer.class);
                setAge.setAccessible(true);
                setAge.invoke(mode, i);
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Benchmark
    public void metaClass1k() {
        MetaClass metaClass = MetaClass.forClass(Mode.class, new DefaultReflectorFactory());
        Mode mode = new Mode();
        Loops.loop(10000, i -> {
            try {
                Invoker setAge = metaClass.getSetInvoker("age");
                setAge.invoke(mode, new Object[]{i});
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Benchmark
    public void metaClass1w() {
        MetaClass metaClass = MetaClass.forClass(Mode.class, new DefaultReflectorFactory());
        Mode mode = new Mode();
        Loops.loop(10000, i -> {
            try {
                Invoker setAge = metaClass.getSetInvoker("age");
                setAge.invoke(mode, new Object[]{i});
            } catch (Throwable e) {
                throw new RuntimeException(e);
            }
        });
    }


    public static void main(String[] args) throws Exception {
        Options opt = new OptionsBuilder()
                .include(ReflectionBenchmarkTest.class.getSimpleName())
                .resultFormat(ResultFormatType.JSON)
                .build();
        new Runner(opt).run();
    }
}

```
