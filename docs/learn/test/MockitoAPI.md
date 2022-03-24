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
title: Mockito API
---


:::danger 注意

这里只是介绍原生的Mockito的API,针对SpringBoot应用有更简单的调用方式
:::



## 一、Mockito加载方式

Mockito可以配合JUnit使用,也可以单独使用。有两种方式来引入Mockito

### 1.1 方式:1 不依赖Spring容器

如果你的单测不依赖容器,那么使用这种方式是比较方便和简介的。但是如果
依赖容器,我们是到JUnit的原理是只要发现有一个Runner就会返回,如果这里指定了
MockitoJUnitRunner那么SpringRunner就不会被使用。

指定MockitoJUnitRunner

```java
   @RunWith(MockitoJUnitRunner.class)
   public class ExampleTest {
   
       @Mock
       private List list;
   
       @Test
       public void shouldDoSomething() {
           list.add(100);
       }
   }
```

### 1.2 方式:2 依赖容器

方式2是依赖于Spring容器的,所以要求我们在单测方法执行前来通知Mockito来处理
他的逻辑,处理他说使用的注解。JUnit4的@Before注解就是做好的加载时机,因为我们
可以这样写。

```java 
   /**
     * 将单测类中依赖Mockito的属性,进行处理。
     * 帮我们实现 Mockito.mock()
     */
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }
```

## 二、Mockito必知概念

### 2.1 完全模拟 Mock

什么是完全模拟,使用的注解就是@Mock。被Mock的对象,所有的方法都不会被
真正的执行。

### 2.2 部分模拟 Spy

部分模拟,使用的注解就是@Spy(间谍一样)。被声明的方法走Mock,没有声明的方法
还是由实例进行执行和反馈。


## 三、代码实例

这里的例子我们为了启动快速,不依赖Spring容器。直接new出来对象。
另外多说一句,其实就算依赖Spring容器,当@Before方法执行前所有的示例其实也都是已经注入好的了。

下面所有的演示围绕这个类进行

```java
public class MockitoEmp {
        public String getName() {
            return "真实的MockitoTest";
        }

        public Integer getAge() {
            return 23;
        }
    }
```
### 3.1 @Mock

手动声明

```java
MockitoEmp mock = Mockito.mock(MockitoEmp.class);
```

:::info 说明
前面说了这个是完全模拟,所有的动作都是模拟的。看下面代码颜色
标记的地方,我们只声明了getName使用Mock返回。但是当我们
调用getAge() 的时候竟然也是假数据。
:::

基于注解和@Before自动声明

```java {19,22}

public class MockitoTest {

    // 整个对象都是Mock的
    @Mock
    private MockitoEmp mock = new MockitoEmp();

    /**
     * 将单测类中依赖Mockito的属性,进行处理。
     * 帮我们实现 Mockito.mock()
     */
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testMock() {
        Mockito.doReturn("Mock数据").when(mock).getName();
        //等价于Mockito.when(mock.getName()).thenReturn("Mock数据");
        // Mock数据
        Assert.assertSame("Mock数据", mock.getName());
        // getAge() 方法没有用Mockito声明动作, 应该是多少呢?
        Assert.assertSame(0, mock.getAge());
        // 0
        System.out.println(mock.getAge());
    }
}

```

### 3.2 @Spy

手动声明

```java
MockitoEmp spy = Mockito.spy(MockitoEmp.class);
```

:::info 说明
Spy部分模拟,下面的例子和上面基本一样,唯一不一样的是我们吧 @Mock换成了@Spy。
此时getAge() 方法就不是模拟的了。
:::

基于注解和@Before自动声明

```java {21,23}

public class MockitoTest {

    // 整个对象都是Mock的
    @Mock
    private MockitoEmp mock = new MockitoEmp();

    /**
     * 将单测类中依赖Mockito的属性,进行处理。
     * 帮我们实现 Mockito.mock()
     */
    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSpy() {
        Mockito.doReturn("Mock数据").when(spy).getName();
        // Mock数据
        Assert.assertSame("Mock数据", spy.getName());
        // getAge() 方法没有用Mockito声明动作, 应该是多少呢?
        Assert.assertSame(23, spy.getAge());
        // 23
        System.out.println(spy.getAge());
    }
}

```
