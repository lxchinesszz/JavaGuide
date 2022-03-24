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
title: MockData API
---


`JMockData` 是一款国人开发用来生成模拟数据的工具



## 基础类型

| 描述         | 类型                                                         |
| ------------ | ------------------------------------------------------------ |
| 基础类型     | `byte` `boolean` `char` `short` `int` `long` `float` `double` |
| 包装类型包装 | `Byte` `Boolean` `Character` `Short` `Integer` `Long` `Float` `Double` |
| 常用类型     | `BigDecimal` `BigInteger` `Date` `LocalDateTime` `LocalDate` `LocalTime` `java.sql.Timestamp` `String` `Enum` |
| 多维数组     | 以上所有类型的多维数组 如：`int[]` `int[][]` `int[][][]` .... etc. |

```java 
//基本类型模拟
int intNum = JMockData.mock(int.class);
int[] intArray = JMockData.mock(int[].class);
Integer integer = JMockData.mock(Integer.class);
Integer[] integerArray = JMockData.mock(Integer[].class);
//常用类型模拟
BigDecimal bigDecimal = JMockData.mock(BigDecimal.class);
BigInteger bigInteger = JMockData.mock(BigInteger.class);
Date date = JMockData.mock(Date.class);
String str = JMockData.mock(String.class);
```

## JAVA对象

模拟bean，被模拟的数据最好是plain bean，通过反射给属性赋值。

```java 
public class User {

    private String name;

    private int age;

    private long cardId;
    
}  
```

```java 
    @Test
    public void test() {
        User mock = JMockData.mock(User.class);
        // User{name='jrq2b', age=9338, cardId=2850}
        System.out.println(mock);
    }  
```

## 容器类型

```java 
@Test
//******注意TypeReference要加{}才能模拟******
public void testTypeRefrence() {
  //模拟基础类型，不建议使用这种方式，参考基础类型章节直接模拟。
  Integer integerNum = JMockData.mock(new TypeReference<Integer>(){});
  Integer[] integerArray = JMockData.mock(new TypeReference<Integer[]>(){});
  //模拟集合
  List<Integer> integerList = JMockData.mock(new TypeReference<List<Integer>>(){});
  //模拟数组集合
  List<Integer[]> integerArrayList = JMockData.mock(new TypeReference<List<Integer[]>>(){});
  //模拟集合数组
  List<Integer>[] integerListArray = JMockData.mock(new TypeReference<List<Integer>[]>(){});
  //模拟集合实体
  List<BasicBean> basicBeanList = JMockData.mock(new TypeReference<List<BasicBean>>(){});
  //各种组合忽略。。。。map同理。下面模拟一个不知道什么类型的map
  Map<List<Map<Integer, String[][]>>, Map<Set<String>, Double[]>> some = JMockData.mock(new TypeReference<Map<List<Map<Integer, String[][]>>, Map<Set<String>, Double[]>>>(){});
}
```

## 范围配置

前面说了可以模拟各种数据,不同类型的数据都允许指定一个范围。
如下

```java 
System.out.println(
JMockData.mock(Date.class,MockConfig.newInstance()
.dateRange("2018-11-20", "2018-11-30")));
```

```java title="允许指定模拟数据的范围或者是排除"
        MockConfig mockConfig = new MockConfig()
                // 全局配置
                .globalConfig()
                .setEnabledStatic(false)
                .setEnabledPrivate(false)
                .setEnabledPublic(false)
                .setEnabledProtected(false)
                .sizeRange(1, 1)
                .charSeed((char) 97, (char) 98)
                .byteRange((byte) 0, Byte.MAX_VALUE)
                .shortRange((short) 0, Short.MAX_VALUE)
                // 某些字段（名等于integerNum的字段、包含float的字段、double开头的字段）配置
                .subConfig("integerNum", "*float*", "double*")
                .intRange(10, 11)
                .floatRange(1.22f, 1.50f)
                .doubleRange(1.50, 1.99)
                .longRange(12, 13)
                .dateRange("2018-11-20", "2018-11-30")
                .stringSeed("SAVED", "REJECT", "APPROVED")
                .sizeRange(1, 1)
                // 全局配置
                .globalConfig()
                // 排除所有包含list/set/map字符的字段。表达式不区分大小写。
                .excludes("*List*", "*Set*", "*Map*");
```
