---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: true
contributor: false
editLink: true
updateTime: true
prev: true
next: true
comment: true
footer: true
backtotop: true
title: 第05篇:SpEL强大的表达式语言
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)


## 一、概述

Spring 表达式语言（简称“SpEL”）是一种强大的表达式语言，支持在运行时查询和操作对象图。语言语法类似于 Unified EL，但提供了额外的功能，最值得注意的是方法调用和基本的字符串模板功能。

虽然还有其他几种可用的 Java 表达式语言——OGNL、MVEL 和 JBoss EL 等等

但创建 Spring 表达式语言的目的是为 Spring 社区提供一种可在所有产品中使用的受良好支持的表达式语言。它的语言特性由 Spring 产品组合中的项目需求驱动。


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

## 3.1 ExpressionParser

![](https://img.springlearn.cn/blog/dc2b1cd43cf0f44fcb70b678f794317c.png)

表达式解析器接口，包含了(Expression) parseExpression(String), (Expression) parseExpression(String, ParserContext)两个接口方法。

```java
public interface ExpressionParser {

	/**
   * 解析表达式字符串并返回一个可用于重复评估的表达式对象。
	 */
	Expression parseExpression(String expressionString) throws ParseException;

	/**
   * 解析表达式字符串并返回一个可用于重复评估的表达式对象。
   * context -- 用于影响此表达式解析例程的上下文（可选)
	 */
	Expression parseExpression(String expressionString, ParserContext context) throws ParseException;

}
```

## 3.2 ParserContext

解析器上下文接口，主要是对解析器Token的抽象类，包含3个方法：getExpressionPrefix,getExpressionSuffix和isTemplate，就是表示表达式从什么符号开始什么符号结束，是否是作为模板（包含字面量和表达式）解析。

```java
public interface ParserContext {

	/**
	 * 被解析的表达式是否是模板
	 */
	boolean isTemplate();

	/**
	 * 对于模板表达式，返回标识字符串中表达式块开始的前缀。例如：“${”
	 */
	String getExpressionPrefix();

	/**
	 * 对于模板表达式，返回标识字符串中表达式块结尾的前缀。例如： ”}”
	 */
	String getExpressionSuffix();

}
```


## 3.3 Expression

表达式的抽象，是经过解析后的字符串表达式的形式表示。通过expressionInstance.getValue方法，可以获取表示式的值。也可以通过调用getValue(EvaluationContext)，从评估（evaluation)上下文中获取表达式对于当前上下文的值

```java
public interface Expression {

	/**
   * 返回用于创建此表达式的原始字符串（未修改）
	 */
	String getExpressionString();

	/**
   * 在默认的标准上下文中计算这个表达式。
	 */
	@Nullable
	Object getValue() throws EvaluationException;

	/**
   * 在默认上下文中计算表达式。如果评估的结果与预期的结果类型不匹配，则将返回异常。
	 */
	@Nullable
	<T> T getValue(@Nullable Class<T> desiredResultType) throws EvaluationException;

	/**
   * 针对指定的根对象评估此表达式。
	 */
	@Nullable
	Object getValue(Object rootObject) throws EvaluationException;

	/**
   * 针对指定的根对象评估此表达式。结果与预期的结果类型不匹配，则将返回异常。
	 */
	@Nullable
	<T> T getValue(Object rootObject, @Nullable Class<T> desiredResultType) throws EvaluationException;

	/**
   * 在提供的上下文中评估此表达式并返回评估结果。
	 */
	@Nullable
	Object getValue(EvaluationContext context) throws EvaluationException;

	/**
   * 在提供的上下文中评估此表达式并返回评估结果。但提供的根上下文会覆盖,默认的上下文
	 */
	@Nullable
	Object getValue(EvaluationContext context, Object rootObject) throws EvaluationException;

	/**
   * 在指定的上下文中评估表达式，该上下文可以解析对属性、方法、类型等的引用。评估结果的类型应为特定类，如果不是且无法转换为该类，将引发异常类型
	 */
	@Nullable
	<T> T getValue(EvaluationContext context, @Nullable Class<T> desiredResultType) throws EvaluationException;

	/**
   * 在指定的上下文中评估表达式，该上下文可以解析对属性、方法、类型等的引用。评估结果的类型应为特定类，如果不是且无法转换为该类，将引发异常类型。提供的根对象覆盖在提供的上下文中指定的任何默认值。
	 */
	@Nullable
	<T> T getValue(EvaluationContext context, Object rootObject, @Nullable Class<T> desiredResultType)
			throws EvaluationException;

	/**
   * 返回可以使用默认上下文传递给setValue方法的最通用类型。
	 */
	@Nullable
	Class<?> getValueType() throws EvaluationException;

	/**
   * 根据根对象,获取表达式的类型
	 */
	@Nullable
	Class<?> getValueType(Object rootObject) throws EvaluationException;

	/**
   * 根据上下文,获取表达式的类型
	 */
	@Nullable
	Class<?> getValueType(EvaluationContext context) throws EvaluationException;

	/**
   * 根据上下文,获取表达式的类型,root对象会覆盖上下文
	 */
	@Nullable
	Class<?> getValueType(EvaluationContext context, Object rootObject) throws EvaluationException;

}
```

## 3.4 EvaluationContext

EvaluationContext在评估表达式以解析属性、方法或字段并帮助执行类型转换时，使用该接口。Spring 提供了两种实现。

- SimpleEvaluationContext：针对不需要完整范围的 SpEL 语言语法且应受到有意义限制的表达式类别，公开了基本 SpEL 语言功能和配置选项的子集。示例包括但不限于数据绑定表达式和基于属性的过滤器。
- StandardEvaluationContext：公开全套 SpEL 语言功能和配置选项。您可以使用它来指定默认根对象并配置每个可用的评估相关策略。

SimpleEvaluationContext旨在仅支持 SpEL 语言语法的一个子集。它不包括 Java 类型引用、构造函数和 bean 引用。它还要求您明确选择对表达式中的属性和方法的支持级别。默认情况下，create()静态工厂方法只允许对属性进行读取访问。您还可以获得构建器来配置所需的确切支持级别


如下示例。
```java
    // 字符串表达式
    String exp = "Hello , #{ #username }";
    // 表达式解析器
    ExpressionParser parser = new SpelExpressionParser();
    // 表达式上下文
    EvaluationContext context = new StandardEvaluationContext();
    context.setVariable("username", "纹银三百两");
    // 解析
    Expression expression = parser.parseExpression(exp, new TemplateParserContext());
    // Hello , 纹银三百两
    System.out.println(expression.getValue(context, String.class));
```

## 3.5 SpelParserConfiguration

可以使用解析器配置对象 ( org.springframework.expression.spel.SpelParserConfiguration) 来配置 SpEL 表达式解析器。配置对象控制一些表达式组件的行为。例如，如果您对数组或集合进行索引，并且指定索引处的元素是null，SpEL可以自动创建元素。这在使用由属性引用链组成的表达式时很有用。

```java
class Demo {
    public List<String> list;
}

// Turn on:
// - 空引用,自动初始化
// - 如果是集合,自动扩容
SpelParserConfiguration config = new SpelParserConfiguration(true, true);

ExpressionParser parser = new SpelExpressionParser(config);

Expression expression = parser.parseExpression("list[3]");

Demo demo = new Demo();

Object o = expression.getValue(demo);
```

## 四、案例运用

## 4.1 文字表达

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
    // Hello , 纹银三百两
    System.out.println(expression.getValue(context, String.class));
    
    // Hello World!
    Expression exp = parser.parseExpression("'Hello World'.concat('!')"); 
    String message = (String) exp.getValue();

    Expression exp2 = parser.parseExpression("'Hello World'.bytes"); 
    byte[] bytes = (byte[]) exp2.getValue();
    
    // invokes 'getBytes().length'
    Expression exp = parser.parseExpression("'Hello World'.bytes.length"); 
    int length = (Integer) exp.getValue();
    
  
    Expression exp = parser.parseExpression("new String('hello world').toUpperCase()"); 
    String message = exp.getValue(String.class);
  }

```


## 4.2 关系运算符

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
## 4.3 逻辑运算符

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

## 4.4 算术运算符

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

## 4.5 三元运算符

您可以使用三元运算符在表达式内执行 if-then-else 条件逻辑。以下清单显示了一个最小示例：

```java
String falseString = parser.parseExpression(
        "false ? 'trueExp' : 'falseExp'").getValue(String.class);
```
在这种情况下，布尔值false会返回字符串 value 'falseExp'。一个更现实的例子如下：

```java

public class SpringElTest {

    public String name;

    public boolean isMember(String name) {
        return true;
    }
    @Test
    public void test() throws Exception {
        SpringElTest root = new SpringElTest();
        SpelExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext(root);
        // 可以注册方法,注意如果是注册的方法要 #isMember(#queryName)而不是isMember(#queryName)
//        context.registerFunction("isMember", isMember);
        context.setVariable("queryName", "周杰伦");

        // 绑定属性
        EvaluationContext setContext = SimpleEvaluationContext.forReadWriteDataBinding().build();
        parser.parseExpression("name").setValue(setContext, root, "许嵩");

        String expression = "isMember(#queryName)? #queryName + ' is a member of the ' " +
                "+ name + ' Society' : #queryName + ' is not a member of the ' + name + ' Society'";
        String queryResultString = parser.parseExpression(expression)
                .getValue(context, String.class);
        // 周杰伦 is a member of the 许嵩 Society
        System.out.println(queryResultString);
    }
}

```

## 4.6 使用变量

```java
Inventor tesla = new Inventor("Nikola Tesla", "Serbian");

EvaluationContext context = SimpleEvaluationContext.forReadWriteDataBinding().build();
context.setVariable("newName", "Mike Tesla");

parser.parseExpression("name = #newName").getValue(context, tesla);
System.out.println(tesla.getName())  // "Mike Tesla"
```

## 五、集合操作

选择是一种强大的表达式语言功能，可让您通过从其条目中进行选择将源集合转换为另一个集合。

选择使用.?[selectionExpression]. 它过滤集合并返回一个包含原始元素子集的新集合。例如，选择可以让我们轻松获得塞尔维亚发明人的列表，如下例所示：

## 5.1 集合过滤

```java
// create an array of integers
List<Integer> primes = new ArrayList<Integer>();
primes.addAll(Arrays.asList(2,3,5,7,11,13,17));

// create parser and set variable 'primes' as the array of integers
ExpressionParser parser = new SpelExpressionParser();
EvaluationContext context = SimpleEvaluationContext.forReadOnlyDataAccess();
context.setVariable("primes", primes);

// all prime numbers > 10 from the list (using selection ?{...})
// evaluates to [11, 13, 17]
List<Integer> primesGreaterThanTen = (List<Integer>) parser.parseExpression(
        "#primes.?[#this>10]").getValue(context);
```

## 5.2 集合映射

类似与map操作，语法是.![projectionExpression]

```java
// returns ['Smiljan', 'Idvor' ]
List placesOfBirth = (List)parser.parseExpression("members.![placeOfBirth.city]");
```

## 六、操作类

## 6.1 类类型

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

## 6.2 自定义函数

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

## 6.3 类属性

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

指定模板 `%{ }`，默认是 `#{}`

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

## 8.1 背景

假设人员注册信息(姓名、年龄、性别），自定义其中规则，如下：

李家好汉（李姓，男，且满18岁）
豆蔻少女（13-15岁，女性）

## 8.2 实现

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

## 九、容器内使用

## 9.1 注释配置

```java
public class FieldValueTestBean {

    @Value("#{ systemProperties['user.region'] }")
    private String defaultLocale;

    public void setDefaultLocale(String defaultLocale) {
        this.defaultLocale = defaultLocale;
    }

    public String getDefaultLocale() {
        return this.defaultLocale;
    }
}

public class PropertyValueTestBean {

    private String defaultLocale;

    @Value("#{ systemProperties['user.region'] }")
    public void setDefaultLocale(String defaultLocale) {
        this.defaultLocale = defaultLocale;
    }

    public String getDefaultLocale() {
        return this.defaultLocale;
    }
}
```

## 9.2 自动装配

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;
    private String defaultLocale;

    @Autowired
    public void configure(MovieFinder movieFinder,
            @Value("#{ systemProperties['user.region'] }") String defaultLocale) {
        this.movieFinder = movieFinder;
        this.defaultLocale = defaultLocale;
    }

    // ...
}

public class MovieRecommender {

    private String defaultLocale;

    private CustomerPreferenceDao customerPreferenceDao;

    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao,
            @Value("#{systemProperties['user.country']}") String defaultLocale) {
        this.customerPreferenceDao = customerPreferenceDao;
        this.defaultLocale = defaultLocale;
    }

    // ...
}
```

## 十、总结

Spring EL表达式，作为JAVA的内置语言，十分强大。主要可以用来做表达式解析，或者规则链路，且可以操作函数方法；从而达到一种动态的链路规则解析效果。

![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)



