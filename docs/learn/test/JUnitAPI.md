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
title: JUnit API
---


:::tip
只打印的单测是没有意义的,正确使用单测工具, 提高单测质量。
:::



## 一、常用注解

### 1.1 @Before & @After

单测类中每个单测方法执行都会触发这两个方法

```java 
    @Before
    public void before() {
        System.out.println("before");
    }

    @After
    public void after() {
        System.out.println("after");
    }
```

### 1.2 @BeforeClass & @AfterClass

区别与上一个,不管单测类中有几个单测方法,都只会执行一次

要用静态修饰

```java 
    @BeforeClass
    public static void beforeClass() {
        System.out.println("beforeClass");
    }

    @AfterClass
    public static void afterClass() {
        System.out.println("afterClass");
    }
```

:::info 代码实例

针对上面说的两个注解演示一下

- beforeClass
- before
- testOne
- after
- before
- testTwo
- after
- afterClass
  :::

---
```java
public class JUnitTest {

    @BeforeClass
    public static void beforeClass() {
        System.out.println("beforeClass");
    }

    @Before
    public void before() {
        System.out.println("before");
    }

    @Test
    public void testOne() {
        System.out.println("testOne");
    }

    @Test
    public void testTwo() {
        System.out.println("testTwo");
    }

    @AfterClass
    public static void afterClass() {
        System.out.println("afterClass");
    }

    @After
    public void after() {
        System.out.println("after");
    }
}

```

### 1.3 @Timed

被修饰的方法会加上一个时间限制,如果超过了指定的时间范围,就算单侧代码执行成功
了也被认为是失败。(注意该方法依赖于SpringBoot容器)

@Timed

```java
    @Test
    @Timed(millis = 2000)
    public void testTimeout() {
        System.out.println("testOne");
    }
```

### 1.4 @Repeat

指定当前单测方法被执行的次数,如果被该注解修饰
将会被重复执行。(注意该方法依赖于SpringBoot容器)

@Repeat

```java
    @Test
    @Repeat(3)
    public void testOne() {
        System.out.println("testOne");
    }
```

## 二、断言API

断言的好处在于程序帮忙判断单测结果。不需要人工在接入验证数据。JUnit的口号就是

`keep the bar green to keep the code clean。`

一个不用观察输出就知道代码有没有问题的高效单元测试工具。

```
import org.hamcrest.Matchers;
import org.hamcrest.core.AllOf;
import org.hamcrest.core.AnyOf;
```

### 2.1 Matchers

Matchers
```java
        // 是否相等
        Assert.assertThat(2, Matchers.is(2));
        // 2 小于等于2
        Assert.assertThat(2,Matchers.lessThanOrEqualTo(2));
        Map<String,String> map = new HashMap<>();
        map.put("name","jay");
        // map 中是否包含key为name的元素
        Assert.assertThat(map,Matchers.hasKey("name"));
        // map 中是否包含value为jay的元素
        Assert.assertThat(map,Matchers.hasValue("jay"));
        // map 中是否包含name等于jay的元素
        Assert.assertThat(map,Matchers.hasEntry("name","jay"));
```
### 2.2 AllOf
全部满足

```java
   // 2 小于4同时也小于3
   Assert.assertThat(2, AllOf.allOf(Matchers.lessThan(4), Matchers.lessThan(3)));
```
### 2.3 AnyOf

任意满足

```java
   // 2 大于1小于3
   Assert.assertThat(2, AnyOf.anyOf(Matchers.greaterThan(1), Matchers.lessThan(3)));
```

## 三、结果验证

### 3.1 空值验证

```java
    @Test
    public void test() {
        Object o = new Object();
        // 非空验证
        Assert.assertNotNull(o);
        // 空值验证
        Assert.assertNull(null);
    }    
```

### 3.2 逻辑验证

```java
    import static org.hamcrest.MatcherAssert.*;
    import static org.hamcrest.CoreMatchers.*;
    public calss Test{
        @Test
        public void test() {
            //测试变量是否大于指定值
            ArrivalNoticeOrderDO ao = new ArrivalNoticeOrderDO();
            ao.setId(12L);
            //测试所有条件必须成立
            assertThat(ao.getId(), allOf(is(12L)));
            //测试只要有一个条件成立
            assertThat(ao.getId(), anyOf(is(50), is(12L)));
            //测试变量值等于指定值
            assertThat(ao.getId(), is(12L));
        }
    }
```

### 3.3 异常验证

```java
    /**
     * 预期异常
     */
    @Test(expected = NullPointerException.class)
    public void testError(){
        Object o = null;
        System.out.println(o.toString());
    }
```


## 四、快速创建

建议使用 `Idea` 自动创建, 不要手动创建。


