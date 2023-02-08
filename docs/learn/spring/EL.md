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
title: Spring EL表达式使用指南
category: Spring Framework
---

![](https://img.springlearn.cn/blog/learn_1610710891000.png)

<Djt/>

> 好久没有发现这么好的文章了,今天逛头条发现了一篇好文章,在这里转载一下
> 大家可以学习一下,文章原文地址见参考。希望支持原作者,在头条点一个关注。

## 一、概述

Spring表达式语言全称为“Spring Expression Language”，缩写为“SpEL”。是一个支持查询，并在运行时操纵一个对象图功能、是一门强大的表达式语言。SpEL是单独模块，只依赖于core模块，可以被独立使用、运行。


**参考文章**

[SpringEpel](https://docs.spring.io/spring-integration/docs/5.3.0.RELEASE/reference/html/spel.html#spel)

[玩转SpEL](https://www.toutiao.com/i6911604368844292620/)
## 二、作用

### 2.1 基本表达式

字面量表达式、关系，逻辑与算数运算表达式、字符串连接及截取表达式、三目运算、正则表达式、括号优先级表达式；

### 2.2 类相关表达式

类类型表达式、类实例化、instanceof表达式、变量定义及引用、赋值表达式、自定义函数、对象属性存取及安全导航表达式、对象方法调用、Bean引用；

### 2.3 集合相关表达式

内联List、内联数组、集合，字典访问、列表，字典，数组修改、集合投影、集合选择；不支持多维内联数组初始化；不支持内联字典定义；

### 2.4 其他表达式

模板表达式。

## 三、主要类

### 3.1 ExpressionParser

表达式解析器接口，包含了(Expression) parseExpression(String), (Expression) parseExpression(String, ParserContext)两个接口方法

### 3.2 ParserContext

解析器上下文接口，主要是对解析器Token的抽象类，包含3个方法：getExpressionPrefix,getExpressionSuffix和isTemplate，就是表示表达式从什么符号开始什么符号结束，是否是作为模板（包含字面量和表达式）解析。


### 3.3 Expression

表达式的抽象，是经过解析后的字符串表达式的形式表示。通过expressionInstance.getValue方法，可以获取表示式的值。也可以通过调用getValue(EvaluationContext)，从评估（evaluation)上下文中获取表达式对于当前上下文的值


### 3.4 EvaluationContext

估值上下文接口，只有一个setter方法：`setVariable(String, Object)`，通过调用该方法，可以为evaluation提供上下文变量

## 四、案例运用

### 4.1 基础的Hello

```
@Test
public void baseTest() {
// 字符串表达式
    String exp = "Hello , #{ #username }";
    // 表达式解析器
    ExpressionParser parser = new SpelExpressionParser();
    // 表达式上下文
    EvaluationContext context = new StandardEvaluationContext();
    context.setVariable("username", "纹银三百两");
    // 解析
    Expression expression = parser.parseExpression(exp, new TemplateParserContext());
    System.out.println(expression.getValue(context, String.class));
  }

```
基础结果：
```
Hello , 纹银三百两
```


### 4.2 关系运算符

```
//true
boolean trueValue1 = parser.parseExpression("2 == 2").getValue(Boolean.class);
//false
boolean falseValue1 = parser.parseExpression("2 < -5.0").getValue(Boolean.class);
//true
boolean trueValue2 = parser.parseExpression("'black' < 'block'").getValue(Boolean.class);
//false，字符xyz是否为int类型
boolean falseValue2 = parser.parseExpression("'xyz' instanceof T(int)").getValue(Boolean.class);
//true，正则是否匹配
boolean trueValue3 =parser.parseExpression("'5.00' matches '^-?\\d+(\\.\\d{2})?$'").getValue(Boolean.class);
//false
boolean falseValue3=parser.parseExpression("'5.0067' matches '^-?\\d+(\\.\\d{2})?$'").getValue(Boolean.class);
```
### 4.3 逻辑运算符

```
// -- AND 与运算 --
//false 
boolean falseValue4 = parser.parseExpression("true and false").getValue(Boolean.class);
 // -- OR 或运算--
//true
boolean trueValue5 = parser.parseExpression("true or false").getValue(Boolean.class);
//false
boolean falseValue5 = parser.parseExpression("!true").getValue(Boolean.class);
```

### 4.4 算术运算符

```
// Addition
int two = parser.parseExpression("1 + 1").getValue(Integer.class); // 2
String testString =
parser.parseExpression("'test' + ' ' + 'string'").getValue(String.class); // 'test string'
// Subtraction
int four = parser.parseExpression("1 - -3").getValue(Integer.class); // 4
double d = parser.parseExpression("1000.00 - 1e4").getValue(Double.class); // -9000
// Multiplication
int six = parser.parseExpression("-2 * -3").getValue(Integer.class); // 6
double twentyFour = parser.parseExpression("2.0 * 3e0 * 4").getValue(Double.class); // 24.0
// Division
int minusTwo = parser.parseExpression("6 / -3").getValue(Integer.class); // -2
double one = parser.parseExpression("8.0 / 4e0 / 2").getValue(Double.class); // 1.0
// Modulus
int three = parser.parseExpression("7 % 4").getValue(Integer.class); // 3
int one = parser.parseExpression("8 / 5 % 2").getValue(Integer.class); // 1
// Operator precedence
int minusTwentyOne = parser.parseExpression("1+2-3*8").getValue(Integer.class); // -21
```

## 五、组合使用

```
@Test
  public void expressionTest() {
    String exp = "1 between {1, 2} and 1>2";
    ExpressionParser parser = new SpelExpressionParser();
    Expression expression = parser.parseExpression(exp);
    //false
    System.out.println(expression.getValue(boolean.class));
  }
```

## 六、操作类

### 6.1 类类型

```
@Test
public void classTypeTest() {
    ExpressionParser parser = new SpelExpressionParser();
    //java.lang包类访问
    Class<String> result1 = parser.parseExpression("T(String)").getValue(Class.class);
    //class java.lang.String
    System.out.println(result1);

    //其他包类访问
    String expression2 = "T(spel.SpElTest)";
    Class<SpElTest> value = parser.parseExpression(expression2).getValue(Class.class);
    //true
    System.out.println(value == SpElTest.class);

    //类静态字段访问
    int result3 = parser.parseExpression("T(Integer).MAX_VALUE").getValue(int.class);
    //true
    System.out.println(result3 == Integer.MAX_VALUE);

    //类静态方法调用
    int result4 = parser.parseExpression("T(Integer).parseInt('1')").getValue(int.class);
    //1
    System.out.println(result4);
  }
```

### 6.2 自定义函数

```
/**
   * 两数之和
   */
public static Integer add(Integer x, Integer y) {
    return x + y;
  }

@Test
public void functionTest() throws NoSuchMethodException {
    // 表达式
    String exp = "#{ #add(4,5)}";
    // 表达式上下文
    StandardEvaluationContext context = new StandardEvaluationContext();
    Method add = SpElTest.class.getDeclaredMethod("add", Integer.class, Integer.class);
    context.registerFunction("add", add);
    // 表达式解析器
    ExpressionParser parser = new SpelExpressionParser();
    // 解析
    Expression expression = parser.parseExpression(exp, new TemplateParserContext());
    // 9
    System.out.println(expression.getValue(context, Integer.class));
  }
```

### 6.3 类属性

```
 @Test
  public void assignTest() {
    String exp = "username: #{#user.username},age: #{#user.age}";
    StandardEvaluationContext context = new StandardEvaluationContext();
    Person person = new Person()
        .setUsername("纹银三百两")
        .setAge(23);
    context.setVariable("user", person);
    ExpressionParser parser = new SpelExpressionParser();
    Expression expression = parser.parseExpression(exp, new TemplateParserContext());
    //username: 纹银三百两,age: 23
    System.out.println(expression.getValue(context, String.class));
  }
```

## 七、模板表达式

指定模板 `%{ }`

```
@Test
public void templateTest() {
    SpelExpressionParser parser = new SpelExpressionParser();
    ParserContext context = new TemplateParserContext("%{", "}");
    Expression expression = parser.parseExpression("你好:%{#name},正在学习:%{#lesson}，加油、奋斗！！！", context);
    EvaluationContext evaluationContext = new StandardEvaluationContext();
    evaluationContext.setVariable("name", "纹银三百两");
    evaluationContext.setVariable("lesson", "spring高手系列。");
    String value = expression.getValue(evaluationContext, String.class);
    //你好:纹银三百两,正在学习:spring高手系列。加油、奋斗！！！
    System.out.println(value);
  }
```

## 八、规则引擎

### 8.1 背景

假设人员注册信息(姓名、年龄、性别），自定义其中规则，如下：

李家好汉（李姓，男，且满18岁）
豆蔻少女（13-15岁，女性）

### 8.2 实现

```
@Test
  public void ruleTest() {
    Person person1 = new Person().setUsername("小龙女").setAge(14).setSex(1);
    checkRule(FastJsonUtil.parseMap(JSON.toJSONString(person1)));
    Person person2 = new Person().setUsername("张三").setAge(18).setSex(0);
    checkRule(FastJsonUtil.parseMap(JSON.toJSONString(person2)));
    Person person3 = new Person().setUsername("李四").setAge(20).setSex(0);
    checkRule(FastJsonUtil.parseMap(JSON.toJSONString(person3)));

  }

  /**
   * 规则check
   *
   * @param exp 参数map
   */
  private static void checkRule(Map<String, Object> exp) {
    ExpressionParser parser = new SpelExpressionParser();
    //规则容器
    Map<String, String> ruleMap = Maps.newHashMap();
    String rule1 = "( #username.contains({'李'}) and  #age > 18 and #sex == 0 )";
    ruleMap.put("李家好汉", rule1);
    String rule2 = "( #age between {13,15} and #sex == 1 )";
    ruleMap.put("豆蔻少女", rule2);
    EvaluationContext spElContext = getSpElContext(exp);
    ruleMap.keySet().forEach(key -> {
      String ruleV = ruleMap.get(key);
      Boolean isPass = parser.parseExpression(ruleV).getValue(spElContext, Boolean.class);
      if (Objects.nonNull(isPass) && isPass) {
        System.out.println("username:【" + exp.get("username") + "】,命中规则:【" + key+"】");
      }

    });
  }

  /**
   * 解析表达式需要的上下文，透传请求参数
   *
   * @param param 参数
   * @return 返回结果
   */
  private static EvaluationContext getSpElContext(Map<String, Object> param) {
    StandardEvaluationContext evaluationContext = new StandardEvaluationContext();
    for (Entry<String, Object> entry : param.entrySet()) {
      if (entry.getValue() != null) {
        evaluationContext.setVariable(entry.getKey(), entry.getValue());
      }
    }
    return evaluationContext;
  }
```

**结果：**

```
username:【小龙女】,命中规则:【豆蔻少女】
username:【李四】,命中规则:【李家好汉】
```

## 九、总结

Spring EL表达式，作为JAVA的内置语言，十分强大。主要可以用来做表达式解析，或者规则链路，且可以操作函数方法；从而达到一种动态的链路规则解析效果。

