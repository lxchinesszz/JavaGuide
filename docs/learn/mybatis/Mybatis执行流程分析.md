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
comment: true
footer: true
password: 111
backtotop: true
title: 第05篇:Mybatis的SQL执行流程分析
category: Mybatis
---

<PageBanner/>


## 一、前言

前面我们知道了Mybatis是如何进行代理的, 但是最终 `PlainMethodInvoker` 中是如何将参数转组装成Sql,并执行处理Sql返回值的地方还都没看到。本篇我们就带着如下三个问题开始我们的探索吧。

![](https://img.springlearn.cn/blog/learn_1649427915000.png)

本篇内容因为涉及跟jdbc的知识,如果对这部分内容有点遗忘,请先[JDBC知识复习](../mybatis/环境搭建/#_2-2-1-jdbc驱动)，另本篇内容知识点较多,目录较复杂,建议根据文字结合
代码在实践的过程中一起学习。最好也可以自己debug一下。会收获更大。做好准备现在发车。

![](https://img.springlearn.cn/blog/learn_1649428750000.png)

## 二、流程分析

## 2.1 Sql是如何组装参数的?

![](https://img.springlearn.cn/blog/learn_1649428892000.png)

在组装参数之前我们先来提一个小问题,sql的类型是如何判断的。sql类型有增删该查。
除了查询会有结果集外，其他三种都是返回更新行数。他们对应的处理逻辑也是不一样的。
我们要先弄清这个问题。

### 2.1.1 sql类型如何判断?

我们知道sql的类型是可以通过关键字来判断的,如select/update/delete/insert。那么在Mybatis中哪里能输入sql呢?
一种有2种方式。

1. 在Mapper.xml中直接编写sql，如下示例。

```xml 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="orm.example.dal.mapper.TUserMapper">
    <delete id="deleteByPrimaryKey" parameterType="java.lang.String">
        delete from T_USER
        where token_id = #{tokenId,jdbcType=CHAR}
    </delete>
    <insert id="insert" parameterType="orm.example.dal.model.TUser">
        insert into T_USER (token_id, uid, name)
        values (#{tokenId,jdbcType=CHAR}, #{uid,jdbcType=INTEGER}, #{name,jdbcType=CHAR})
    </insert>
    <update id="updateByPrimaryKey" parameterType="orm.example.dal.model.TUser">
        update T_USER
        set uid = #{uid,jdbcType=INTEGER},
        name = #{name,jdbcType=CHAR}
        where token_id = #{tokenId,jdbcType=CHAR}
    </update>
    <select id="selectAll" resultMap="BaseResultMap">
        select token_id, uid, name
        from T_USER
    </select>

</mapper>
```
2. 在Mapper类中使用注解编写sql

```java 
public interface TUserMapper {
    @Select("select * from t_user where id = #{id}")
    TUser selectById(Long id);
}    
```
这些sql信息都保存在 MappedStatement。在PlainMethodInvoker通过SqlCommand进行调用。

- line(9) 最终通过type = ms.getSqlCommandType() 获取sql的类型

```java {9}
SqlCommand sqlCommand = new SqlCommand(config, mapperInterface, method);

// 构造参数中找MappedStatement
public SqlCommand(Configuration configuration, Class<?> mapperInterface, Method method) {
      final String methodName = method.getName();
      final Class<?> declaringClass = method.getDeclaringClass();
      MappedStatement ms = resolveMappedStatement(mapperInterface, methodName, declaringClass,
          configuration);
      type = ms.getSqlCommandType();
}          
// 寻找方法是接口全路径名.方法名
private MappedStatement resolveMappedStatement(){
    String statementId = mapperInterface.getName() + "." + methodName;
    configuration.hasStatement(statementId)
}
```
 
那么MappedStatement中的SqlCommandType是如何获取的呢?

### 2.1.1.1 xml文件方式

解析xml标签来实现

XMLMapperBuilder#parseStatementNode

- line(11) 通过标签来映射成指定的类型SqlCommandType

```xml {11}
public class XMLStatementBuilder extends BaseBuilder {
 public void parseStatementNode() {
    String id = context.getStringAttribute("id");
    String databaseId = context.getStringAttribute("databaseId");

    if (!databaseIdMatchesCurrent(id, databaseId, this.requiredDatabaseId)) {
      return;
    }

    String nodeName = context.getNode().getNodeName();
    SqlCommandType sqlCommandType = SqlCommandType.valueOf(nodeName.toUpperCase(Locale.ENGLISH));
  }
}  
public enum SqlCommandType {
  UNKNOWN, INSERT, UPDATE, DELETE, SELECT, FLUSH
}    
```

### 2.1.1.2 注解方式

一定是解析注解方法 AnnotationWrapper。将不同的注解解析成SqlCommandType。如下伪代码。通过解析方法上的注解,判断注解类型,来确定sql的类型。
MapperAnnotationBuilder#getAnnotationWrapper(method, true, statementAnnotationTypes)

```java 
private class AnnotationWrapper {
    private final Annotation annotation;
    private final String databaseId;
    private final SqlCommandType sqlCommandType;

    AnnotationWrapper(Annotation annotation) {
      super();
      this.annotation = annotation;
      if (annotation instanceof Select) {
        databaseId = ((Select) annotation).databaseId();
        sqlCommandType = SqlCommandType.SELECT;
      } else if (annotation instanceof Update) {
        databaseId = ((Update) annotation).databaseId();
        sqlCommandType = SqlCommandType.UPDATE;
      } else if (annotation instanceof Insert) {
        databaseId = ((Insert) annotation).databaseId();
        sqlCommandType = SqlCommandType.INSERT;
      } else if (annotation instanceof Delete) {
        databaseId = ((Delete) annotation).databaseId();
        sqlCommandType = SqlCommandType.DELETE;
      } else if (annotation instanceof SelectProvider) {
        databaseId = ((SelectProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.SELECT;
      } else if (annotation instanceof UpdateProvider) {
        databaseId = ((UpdateProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.UPDATE;
      } else if (annotation instanceof InsertProvider) {
        databaseId = ((InsertProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.INSERT;
      } else if (annotation instanceof DeleteProvider) {
        databaseId = ((DeleteProvider) annotation).databaseId();
        sqlCommandType = SqlCommandType.DELETE;
      } else {
        sqlCommandType = SqlCommandType.UNKNOWN;
        if (annotation instanceof Options) {
          databaseId = ((Options) annotation).databaseId();
        } else if (annotation instanceof SelectKey) {
          databaseId = ((SelectKey) annotation).databaseId();
        } else {
          databaseId = "";
        }
      }
    }

    Annotation getAnnotation() {
      return annotation;
    }

    SqlCommandType getSqlCommandType() {
      return sqlCommandType;
    }
}    

```

到这里我们知道了sql类型是如何区分出来的，既然能区分出来，就知道如何去执行sql了。
是不是很简单? 当然看的话很简单，但是如何让你自己来找，你能找到吗? 所以建议在阅读的时候
要自己去源码中找找。

### 2.1.2 sql参数如何组装?

在mybatis中有两种处理sql参数的地方,第一种是`#{}` 占位符，第二种是`${}` 变量符。这两种都是处理参数的方式。那说到这里,不得不提的就是sql注入的黑客技术。
sql注入就是就是利用了变量符。将我们原来的sql进行恶意的修改。举一个例子。下面根据用户id和用户密码查询用户信息。

`select * from t_user as u where u.pass = ${user_pass} and u.id = ${user_id}`

那么如何在不知道密码只有用户id的情况下查询到用户信息呢? 我们只需要将sql转换成下面这样即可。

`select * from t_user as u where u.pass = '' or 1 = 1 and u.id = ${user_id}`

那mybatis允许我们这样做吗? 允许，如果我们使用的是 `${}` 变量符,那么mybatis只是将参数和变量符进行替换。你输入的参数可能也会被当成sql去执行了。如下代码示例。

```java 
public interface T4UserMapper {
    /**
     * 获取用户信息
     *
     * @param uid     用户id
     * @param tokenId token
     * @return TUser
     */
    @Select("select * from t_user where token_id = ${token_id} and uid = ${uid}")
    TUser queryUserById(@Param("uid") Long uid, @Param("token_id") String tokenId);
}
public class Test{
    @Test
    public void sql(){
        // 读取配置信息
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();
        SqlSession sqlSession = sqlSessionFactory.openSession(false);
        // debug
        T4UserMapper mapper = configuration.getMapper(T4UserMapper.class, sqlSession);
        // 模拟sql注入
        System.out.println(mapper.queryUserById(37L,"0 or 1 = 1"));
    }
}    

Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@62ddbd7e]
==>  Preparing: select * from t_user where token_id = 0 or 1 = 1 and uid = 37
==> Parameters: 
<==    Columns: uid, name, token_id
<==        Row: 37, 无天, 60
<==      Total: 1
TUser(tokenId=null, uid=37, name=无天)
```


要想避免这样的问题,我们只需要将`${}` 变量符,都替换成`#{}` 占位符就好了。那么Mybatis只会将你的参数当做是参数处理，不会当做是sql执行。如下代码示例。
```java 
public interface T4UserMapper {
    /**
     * 获取用户信息
     *
     * @param uid     用户id
     * @param tokenId token
     * @return TUser
     */
    @Select("select * from t_user where token_id = #{token_id} and uid = #{uid}")
    TUser queryUserById(@Param("uid") Long uid, @Param("token_id") String tokenId);
}
public class Test{
    @Test
    public void sql(){
        // 读取配置信息
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();
        SqlSession sqlSession = sqlSessionFactory.openSession(false);
        // debug
        T4UserMapper mapper = configuration.getMapper(T4UserMapper.class, sqlSession);
        // 模拟sql注入 => null
        System.out.println(mapper.queryUserById(37L,"0 or 1 = 1"));
    }
}  

Created connection 798981583.
Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@2f9f7dcf]
==>  Preparing: select * from t_user where token_id = ? and uid = ?
==> Parameters: 0 or 1 = 1(String), 37(Long)
<==      Total: 0
null
```

以上演示代码可以在 `com.test.example05.SqlParseTest`中找到。那么无论是变量符还是占位符，其实都是sql组装,下面我们正式开始学习。

==同样我们先提两个问题==

![](https://img.springlearn.cn/blog/learn_1649510242000.png)

### 2.1.2.1 方法参数如何来解析

![](https://img.springlearn.cn/blog/learn_1649510559000.png)

关键代码就在MapperMethod的execute的入参 Object [] args;
关于参数的处理都在这里处理了。MethodSignature#convertArgsToSqlCommandParam。

```java 
public class MapperMethod {
  public Object execute(SqlSession sqlSession, Object[] args) {
    Object result;
    switch (command.getType()) {
      case INSERT: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.insert(command.getName(), param));
        break;
      }
      case UPDATE: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.update(command.getName(), param));
        break;
      }
      case DELETE: {
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.delete(command.getName(), param));
        break;
      }
    ....  
    return result;
  }
}
```

```java 
public Object convertArgsToSqlCommandParam(Object[] args) {
    return paramNameResolver.getNamedParams(args);
}
```

参数会被解析成什么样呢? 关键代码就在这里。

```java 
 public Object getNamedParams(Object[] args) {
    final int paramCount = names.size();
    // 没有参数直接返回
    if (args == null || paramCount == 0) {
      return null;
    } else if (!hasParamAnnotation && paramCount == 1) {
      // 没有注解只有一个参数
      Object value = args[names.firstKey()];
      return wrapToMapIfCollection(value, useActualParamName ? names.get(0) : null);
    } else {
      final Map<String, Object> param = new ParamMap<>();
      int i = 0;
      // names key = 参数下标 value = @Param里面的值
      for (Map.Entry<Integer, String> entry : names.entrySet()) {
        // key = @Param里面的值,value = args[index] 真实数据
        param.put(entry.getValue(), args[entry.getKey()]);
        // 生成param1,参数
        final String genericParamName = GENERIC_NAME_PREFIX + (i + 1);
        // ensure not to overwrite parameter named with @Param
        if (!names.containsValue(genericParamName)) {
          param.put(genericParamName, args[entry.getKey()]);
        }
        i++;
      }
      return param;
    }
  }
```

我们直接说结论,如果方法签名中使用了@Param注解结论,则占位符中的参数名就是注解的值。如果没有注解在就是arg+参数的位置.

`com.test.example04.MethodSignatureTest`

|参数类型|方法签名|参数值|结果|
|:--|:--|:--|:--|
|解析单参数不带@Param|TUser queryUserByName(String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{"孙悟空"})|孙悟空|
|解析单参数带@Param|TUser queryUserById(@Param("userId") Long id)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L})|{userId=1, param1=1}|
|解析多参数不带@Param|TUser queryUserByTokenId(Long tokenId,String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L, "孙悟空"})|{arg0=1, arg1=孙悟空, param1=1, param2=孙悟空}|
|解析多参数带@Param|TUser queryUserByTokenId(@Param("tokenId") Long tokenId, @Param("name") String name)|methodSignature.convertArgsToSqlCommandParam(new Object[]{1L, "孙悟空"})|{tokenId=1, name=孙悟空, param1=1, param2=孙悟空}|

如果项目编译中设置了编译后保存参数名，那么可以获取代码中编写的参数名。

![](https://img.springlearn.cn/blog/learn_1649512062000.png)

好了到这里我们知道方法的参数最终都会被Mybatis重新解析,解析后的结果可以看以上的表格。主要就是为拼装参数提前准备数据。下面我们看sql信息最终是如何最终组装的吧。


### 2.1.2.2 方法参数组装

![](https://img.springlearn.cn/blog/learn_1649512620000.png)

这里我们思考一下，变量符应该是动态sql,在调用jdbc时候应该是下面的例子。

```java 
 PreparedStatement preparedStatement = connection.prepareStatement("select * from t_user where token_id = 0 or 1 = 1 and uid = 37");
```

那么我们就寻找哪里有这样的代码。

![](https://img.springlearn.cn/blog/learn_1649514573000.png)

PreparedStatementHandler#instantiateStatement.

```java 
@Override
  protected Statement instantiateStatement(Connection connection) throws SQLException {
    String sql = boundSql.getSql();
    if (mappedStatement.getKeyGenerator() instanceof Jdbc3KeyGenerator) {
      String[] keyColumnNames = mappedStatement.getKeyColumns();
      if (keyColumnNames == null) {
        return connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
      } else {
        return connection.prepareStatement(sql, keyColumnNames);
      }
    } else if (mappedStatement.getResultSetType() == ResultSetType.DEFAULT) {
      return connection.prepareStatement(sql);
    } else {
      return connection.prepareStatement(sql, mappedStatement.getResultSetType().getValue(), ResultSet.CONCUR_READ_ONLY);
    }
  }
```
关键的代码就在这里静态sql,直接从MappedStatement#getBoundSql(Object parameterObject)#getSql()获取组装后的代码。

![](https://img.springlearn.cn/blog/learn_1649514858000.png)

```java 
  @Override
  public <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) throws SQLException {
    Statement stmt = null;
    try {
      Configuration configuration = ms.getConfiguration();
      StatementHandler handler = configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
      stmt = prepareStatement(handler, ms.getStatementLog());
      return handler.query(stmt, resultHandler);
    } finally {
      closeStatement(stmt);
    }
  }
  
  // 这里parameterObject就是前面对方法参数的解析返回值。通过mappedStatement.getBoundSql(parameterObject)组装静态sql
  protected PreparedStatementHandler(Executor executor, MappedStatement mappedStatement, Object parameterObject, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {
    this.configuration = mappedStatement.getConfiguration();
    this.executor = executor;
    this.mappedStatement = mappedStatement;
    this.rowBounds = rowBounds;

    this.typeHandlerRegistry = configuration.getTypeHandlerRegistry();
    this.objectFactory = configuration.getObjectFactory();
    if (boundSql == null) { // issue #435, get the key before calculating the statement
      generateKeys(parameterObject);
      boundSql = mappedStatement.getBoundSql(parameterObject);
    }

    this.boundSql = boundSql;
    this.parameterHandler = configuration.newParameterHandler(mappedStatement, parameterObject, boundSql);
    this.resultSetHandler = configuration.newResultSetHandler(executor, mappedStatement, rowBounds, parameterHandler, resultHandler, boundSql);
  }
```

好了，到这里我们就知道静态sql是哪里组装的了。关键点就在BoundSql这个类是如何构建的。我们以注解方式举例。

在构建MappedStatement的时候,MapperBuilderAssistant#parse会解析Mapper类所有的方法,获取方法上的注解,生成Sql的信息。
判断sql类型,如果是${}变量符,Sql资源就是DynamicSqlSource动态Sql。如果是#{}占位符就是RawSqlSource会将占位符替换成`?`,同时生成ParameterMapping信息
用于方法执行时候使用PreparedStatement去set参数信息。

![](https://img.springlearn.cn/blog/learn_1649520231000.png)

下面我们以示例中的代码来看下BoundSql中究竟有什么信息。

![](https://img.springlearn.cn/blog/learn_1649520894000.png)

那么对于第一种DynamicSqlSource动态sql,参数信息是如何组装的呢?

```java 
public class DynamicSqlSource implements SqlSource {

  private final Configuration configuration;
  private final SqlNode rootSqlNode;

  public DynamicSqlSource(Configuration configuration, SqlNode rootSqlNode) {
    this.configuration = configuration;
    this.rootSqlNode = rootSqlNode;
  }

  @Override
  public BoundSql getBoundSql(Object parameterObject) {
    DynamicContext context = new DynamicContext(configuration, parameterObject);
    // 处理sql中如果有<if><where><Trim>等自带标签的情况,同时处理将变量符提供换成真正的参数。
    rootSqlNode.apply(context);
    // 当执行完上面的流程变量符就被替换成真正的参数了。下面在看是否同时也包含了#{}占位符,如果包含就替换成?
    // 在调换成?的同时新增一个ParameterMapping对象
    SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
    Class<?> parameterType = parameterObject == null ? Object.class : parameterObject.getClass();
    SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());
    BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
    context.getBindings().forEach(boundSql::setAdditionalParameter);
    return boundSql;
  }

}
```

核心的方法就是变量符替换,下面直接将核心的代码展示出来。

```java 
    @Test
    public void dynamicSql() throws Exception {
        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();
        // 生成动态Sql
        TextSqlNode textSqlNode = new TextSqlNode("select * from t_user where token_id = ${token_id} and uid = ${uid}");
        DynamicSqlSource dynamicSqlSource = new DynamicSqlSource(configuration, textSqlNode);

        // 装参数
        MapperMethod.ParamMap<Object> paramMap = new MapperMethod.ParamMap<Object>();
        paramMap.put("uid",37L);
        paramMap.put("token_id","0 or 1 = 1");
        BoundSql boundSql = dynamicSqlSource.getBoundSql(paramMap);
        System.out.println(boundSql.getSql());
    }
    
    @Test
    public void dynamicSql2(){
        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();

        // 装参数
        MapperMethod.ParamMap<Object> paramMap = new MapperMethod.ParamMap<Object>();
        paramMap.put("uid",37L);
        paramMap.put("token_id","0 or 1 = 1");
        DynamicContext context = new DynamicContext(configuration, paramMap);

        // 生成动态Sql
        TextSqlNode textSqlNode = new TextSqlNode("select * from t_user where token_id = ${token_id} and uid = ${uid}");
        textSqlNode.apply(context);
        System.out.println(context.getSql());
    }
```

好了，我们知道动态sql其实就是${}，变量符号替换。
下面我们看静态sql是如何处理占位符的吧。

![](https://img.springlearn.cn/blog/learn_1649523284000.png)

前面我们说了静态sql,在初始化时候就会将占位符替换成? 同时生成一个ParameterMapping对象,然后在执行sql时候通过PreparedStatement进行set参数信息。
那么我们先看占位符如何替换成?的吧。实现逻辑其实就在RawSqlSource的构造方法中。

- line(1-5) 在Mybatis初始化时候,会生成RawSqlSource。在构造中去调换占位符
- line(8-19) 占位符替换的实现方式,最终生成StaticSqlSource
- line(22-28) 占位符返回?的同时,生成一个ParameterMapping对象

```java {1-5,8-19,22-28}
public RawSqlSource(Configuration configuration, String sql, Class<?> parameterType) {
    SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
    Class<?> clazz = parameterType == null ? Object.class : parameterType;
    sqlSource = sqlSourceParser.parse(sql, clazz, new HashMap<>());
}
  
// sql = select * from t_user where token_id = #{token_id} and uid = #{uid}
public SqlSource parse(String originalSql, Class<?> parameterType, Map<String, Object> additionalParameters) {
    ParameterMappingTokenHandler handler = new ParameterMappingTokenHandler(configuration, parameterType, additionalParameters);
    // 对
    GenericTokenParser parser = new GenericTokenParser("#{", "}", handler);
    String sql;
    if (configuration.isShrinkWhitespacesInSql()) {
      sql = parser.parse(removeExtraWhitespaces(originalSql));
    } else {
      sql = parser.parse(originalSql);
    }
    return new StaticSqlSource(configuration, sql, handler.getParameterMappings());
  }
 
 // 会将占位符号#{token_id}替换成 ？同时生成一个ParameterMapping对象。
 private static class ParameterMappingTokenHandler extends BaseBuilder implements TokenHandler {
    // content = token_id
    @Override
    public String handleToken(String content) {
      parameterMappings.add(buildParameterMapping(content));
      return "?";
    }
 }  
```

到这里占位符的解析已经很清楚了。BoundSql中的数据我们也知道了，我们直接看参数组装的逻辑吧。

![](https://img.springlearn.cn/blog/learn_1649524815000.png)

1. 从boundSql中获取占位符信息。
2. 根据占位符获取参数信息
3. 根据参数类型确定使用那个TypeHandler，如果都没有指定就用UnknownTypeHandler
4. UnknownTypeHandler会根据参数的类型，从默认配置中找到要用的类型,如果是Long类型就是PreparedStatement#setLong，如果是String类型就是PreparedStatement#setString

```java 
public class DefaultParameterHandler implements ParameterHandler {
  @Override
  public void setParameters(PreparedStatement ps) {
    ErrorContext.instance().activity("setting parameters").object(mappedStatement.getParameterMap().getId());
    List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
    if (parameterMappings != null) {
      for (int i = 0; i < parameterMappings.size(); i++) {
        ParameterMapping parameterMapping = parameterMappings.get(i);
        if (parameterMapping.getMode() != ParameterMode.OUT) {
          Object value;
          String propertyName = parameterMapping.getProperty();
          if (boundSql.hasAdditionalParameter(propertyName)) { // issue #448 ask first for additional params
            value = boundSql.getAdditionalParameter(propertyName);
          } else if (parameterObject == null) {
            value = null;
          } else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
            value = parameterObject;
          } else {
            MetaObject metaObject = configuration.newMetaObject(parameterObject);
            value = metaObject.getValue(propertyName);
          }
          TypeHandler typeHandler = parameterMapping.getTypeHandler();
          JdbcType jdbcType = parameterMapping.getJdbcType();
          if (value == null && jdbcType == null) {
            jdbcType = configuration.getJdbcTypeForNull();
          }
          try {
            typeHandler.setParameter(ps, i + 1, value, jdbcType);
          } catch (TypeException | SQLException e) {
            throw new TypeException("Could not set parameters for mapping: " + parameterMapping + ". Cause: " + e, e);
          }
        }
      }
    }
  }

}

```

好了到这里我们就搞清楚Mybatis中的参数是如何组装的了。 以及Jdbc是如何执行sql的了。
这部分内容比较复杂，仅仅通过看是看不明白的，建议根据文中的代码自己走一边。加深理解。

下面我们看Mybatis是如何处理返回值的吧。


## 2.2 Sql结果集是如何转换方法返回值的?

我们重新回到PreparedStatementHandler中跟数据库打交道的地方,当PreparedStatement#execute发送sql给数据库后,最终处理结果集的类是
ResultHandler，下面我们就围绕这个类做分析。

```java 
  @Override
  public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {
    PreparedStatement ps = (PreparedStatement) statement;
    ps.execute();
    return resultSetHandler.handleResultSets(ps);
  }
```

ResultSetHandler,我们看接口定义,处理结果集就在这里了。我们再来看实现。

```java 
public interface ResultSetHandler {

  <E> List<E> handleResultSets(Statement stmt) throws SQLException;

  <E> Cursor<E> handleCursorResultSets(Statement stmt) throws SQLException;

  void handleOutputParameters(CallableStatement cs) throws SQLException;

}
```

默认的实现DefaultResultSetHandler。Mybatis实现较为复杂，我们一开始可能看不懂。我们先用原生的jdbc来自己实现一边。
然后脑子里有一个思路，然后在根据思路来看DefaultResultSetHandler的实现吧。

### 2.2.1 JDBC提供的结果处理API

思路是statement执行完后会返回结果集ResultSet。
结果集包含了返回的数据及这些数据对应的字段信息。
然后拿到这些字段信息分别从结果集中获取数据。下面的代码如果明白了，我们就去看Mybatis中的源码

```java 
    @Test
    public void resultMetaData() throws Exception {
        String dbUrl = "jdbc:mysql://127.0.0.1:3306/test";
        String user = "root";
        String pass = "123456";
        // 1. 获取数据库连接
        Connection connection = DriverManager.getConnection(dbUrl, user, pass);
        Statement statement = connection.createStatement();
        // 2. 执行sql语句获取结果集
        ResultSet resultSet = statement.executeQuery("select uid,name,token_id as tokenId from T_User");
        // 3. 从结果集中，获取数据库返回的数据列名
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();
        // 所有的列名
        List<String> columnNames = new ArrayList<>();
        // 列名对应的java类型
        Map<String, Class<?>> column2JavaTypeAsMap = new HashMap<>();
        for (int i = 1; i <= columnCount; i++) {
            System.out.println("字段:" + metaData.getColumnName(i) + "是否自增:" + metaData.isAutoIncrement(i));
            System.out.println("字段名:" + metaData.getColumnName(i));
            System.out.println("字段别名:" + metaData.getColumnLabel(i));
            System.out.println("MySql字段类型:" + metaData.getColumnTypeName(i));
            // Java 类的完全限定名称
            System.out.println("Java字段类型:" + metaData.getColumnClassName(i));
            // 获取指定列的指定列大小。
            System.out.println("字段长度:" + metaData.getPrecision(i));
            System.out.println("字段保留小数位:" + metaData.getScale(i));
            System.out.println("字段属于的表名:" + metaData.getTableName(i));
            System.out.println("是否可为空:" + metaData.isNullable(i));
            // 这里使用别名,如果没有别名的情况,别名跟字段名是一样的。
            columnNames.add(metaData.getColumnLabel(i));
            column2JavaTypeAsMap.put(metaData.getColumnLabel(i), Class.forName(metaData.getColumnClassName(i)));
        }
        int row = 1;
        while (resultSet.next()) {
            System.out.println("----------第" + row + "行数据开始----------");
            for (String columnName : columnNames) {
                Object columnValue = getValue(columnName, resultSet, column2JavaTypeAsMap);
                System.out.println("列:" + columnName + ":value:" + columnValue);
            }
            System.out.println("----------第" + row + "行数据结束----------");
            row++;
        }
        resultSet.close();
        statement.close();
        connection.close();
    }

    /**
     * 根据不同的字段类型,调用不同的方法获取数据
     *
     * @param columnName           列名
     * @param resultSet            集合集
     * @param column2JavaTypeAsMap 字段对应的Java类型
     * @return 结果值
     * @throws Exception 未知异常
     */
    public Object getValue(String columnName, ResultSet resultSet, Map<String, Class<?>> column2JavaTypeAsMap) throws Exception {
        Class<?> column2JavaType = column2JavaTypeAsMap.get(columnName);
        Object value = null;
        if (column2JavaType.equals(Integer.class)) {
            value = resultSet.getInt(columnName);
        } else if (column2JavaType.equals(String.class)) {
            value = resultSet.getString(columnName);
        }
        return value;
    }
    
字段:uid是否自增:true
字段名:uid
字段别名:uid
MySql字段类型:INT
Java字段类型:java.lang.Integer
字段长度:11
字段保留小数位:0
字段属于的表名:t_user
是否可为空:0
字段:name是否自增:false
字段名:name
字段别名:name
MySql字段类型:CHAR
Java字段类型:java.lang.String
字段长度:32
字段保留小数位:0
字段属于的表名:t_user
是否可为空:1
字段:token_id是否自增:false
字段名:token_id
字段别名:tokenId
MySql字段类型:CHAR
Java字段类型:java.lang.String
字段长度:64
字段保留小数位:0
字段属于的表名:t_user
是否可为空:0
----------第1行数据开始----------
列:uid:value:37
列:name:value:无天
列:tokenId:value:60
----------第1行数据结束----------
----------第2行数据开始----------
列:uid:value:9846
列:name:value:斗战胜佛
列:tokenId:value:80
----------第2行数据结束----------
----------第3行数据开始----------
列:uid:value:9847
列:name:value:净坛使者
列:tokenId:value:90
----------第3行数据结束----------
----------第4行数据开始----------
列:uid:value:9848
列:name:value:无量功德佛祖
列:tokenId:value:100
----------第4行数据结束----------
```

ResultSetMetaData 方法是比较重要的，这里把他常用的api方法及解释以表格形式列举一下。
当我们拿到返回的列名，就可以直接根据列名来返回数据了。

|方法|含义|示例|
|:--|:--|:--|
|ResultSetMetaData#getColumnName|获取数据库字段名|name|
|ResultSetMetaData#getColumnLabel|查询语句中字段别名,如果没有保持跟字段名一致|user_id as userId,这里就是userId|
|ResultSetMetaData#getColumnTypeName|返回Sql字段类型|INT、CHAR|
|ResultSetMetaData#getColumnClassName|返回Java字段类型的完整限定名|java.lang.String、java.lang.Integer|
|ResultSetMetaData#getPrecision|获取定义的字段长度|int(11),返回11|
|ResultSetMetaData#getScale|获取字段定义的保留小数位|-|
|ResultSetMetaData#getTableName|字段对应的表|-|
|ResultSetMetaData#isNullable|字段是否可以为空|-|
|ResultSetMetaData#isAutoIncrement|是否数据库自增字段|-|
|ResultSetMetaData#isAutoIncrement|是否数据库自增字段|-|

### 2.2.2 Mybatis获取结果集

思考下结果集可能是什么?

1. 场景一: 可能返回的是List
```java 
    @Select("select * from t_user")
    List<TUser> queryAllUsers();
```
2. 场景二: 可能返回的是单个对象

```java 
    @Select("select * from t_user where uid = #{uid}")
    TUser queryUserByPlaceholderId(@Param("uid") Long uid);
```
3. 场景三: 更新语句返回结果集是条数。

```java 
    @Update("update t_user set name = #{name}")
    int updateName(@Param("uid") Long uid, @Param("name") String name);
```
4. 场景四: 更新语句返回boolean
```java 
    @Update("update t_user set name = #{name} where uid = #{uid}")
    boolean updateNameById(@Param("uid") Long uid, @Param("name") String name);
```

分别来分析。

### 场景一:

```java 
public class MapperMethod {
    private final MethodSignature method;
    public Object execute(SqlSession sqlSession, Object[] args) {
        Object result;
        switch (command.getType()) {
          case SELECT:
            if (method.returnsVoid() && method.hasResultHandler()) {
              executeWithResultHandler(sqlSession, args);
              result = null;
            } else if (method.returnsMany()) {
              result = executeForMany(sqlSession, args);
            } else if (method.returnsMap()) {
              result = executeForMap(sqlSession, args);
            } else if (method.returnsCursor()) {
              result = executeForCursor(sqlSession, args);
            } else {
              Object param = method.convertArgsToSqlCommandParam(args);
              result = sqlSession.selectOne(command.getName(), param);
              if (method.returnsOptional()
                  && (result == null || !method.getReturnType().equals(result.getClass()))) {
                result = Optional.ofNullable(result);
              }
            }
            break;
          case FLUSH:
            result = sqlSession.flushStatements();
            break;
          default:
            throw new BindingException("Unknown execution method for: " + command.getName());
        }
        if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
          throw new BindingException("Mapper method '" + command.getName()
              + " attempted to return null from a method with a primitive return type (" + method.getReturnType() + ").");
        }
        return result;
      }
}
```

可以看到这里对于方法的返回值判断是根据MethodSignature,MethodSignature不仅提供了对参数的解析,同时也是对方法的分析。
包括判断方法的返回值，我们看它的内部属性。

```java 
 public static class MethodSignature {
    // 是否返回集合
    private final boolean returnsMany;
    // 是否返回是map结构
    private final boolean returnsMap;
    // 是否没有返回值
    private final boolean returnsVoid;
    // 是否返回的是游标
    private final boolean returnsCursor;
    // 是否返回的是Optional对象
    private final boolean returnsOptional;
    // 返回值类型
    private final Class<?> returnType;
    // 返回map结构使用的key字段
    private final String mapKey;
    // 如果入参是ResultHandler 记录器下标
    private final Integer resultHandlerIndex;
    // 如果参数是RowBounds，记录其下标
    private final Integer rowBoundsIndex;
    // 参数处理
    private final ParamNameResolver paramNameResolver;
    
  }  
```

如果发现是返回List。则MethodSignature#returnsMany=true。直接调用SqlSession#selectList

```java 
private <E> Object executeForMany(SqlSession sqlSession, Object[] args) {
    List<E> result;
    Object param = method.convertArgsToSqlCommandParam(args);
    // 方法中是否包含逻辑分页参数RowBounds
    if (method.hasRowBounds()) {
      // 如果有就获取逻辑分页参数
      RowBounds rowBounds = method.extractRowBounds(args);
      // 执行sql
      result = sqlSession.selectList(command.getName(), param, rowBounds);
    } else {
      result = sqlSession.selectList(command.getName(), param);
    }
    // issue #510 Collections & arrays support
    if (!method.getReturnType().isAssignableFrom(result.getClass())) {
      if (method.getReturnType().isArray()) {
        return convertToArray(result);
      } else {
        return convertToDeclaredCollection(sqlSession.getConfiguration(), result);
      }
    }
    return result;
  }
```

最终在DefaultResultSetHandler#handleResultSets处理返回值。下面的代码看了先不要害怕,其实
思路跟我们用jdbc来处理是一样的。第一要拿到返回的数据信息。第二要将返回的数据信息包装成方法的返回值。
只不过Mybatis将上面的两个能力,都提供成了对应的接口。其中数据的返回集就是ResultSetWrapper,从返回集中获取数据是TypeHandler。
而将数据库返回的行数据，转换成方法的返回值就要用到ResultMap。

```java 
  @Override
  public List<Object> handleResultSets(Statement stmt) throws SQLException {
    ErrorContext.instance().activity("handling results").object(mappedStatement.getId());

    final List<Object> multipleResults = new ArrayList<>();

    int resultSetCount = 0;
    // 读取返回的数据信息(jdbcType,javaType,列名和别名)
    ResultSetWrapper rsw = getFirstResultSet(stmt);
    // Mapper签名中找到返回集应该信息
    List<ResultMap> resultMaps = mappedStatement.getResultMaps();
    int resultMapCount = resultMaps.size();
    // 做个校验,如果sql执行后没有任何返回信息，但是Mapper签名中却指定了返回映射信息。则会报错告警 A query was run and no Result Maps were found for the Mapped Statement
    validateResultMapsCount(rsw, resultMapCount);
    while (rsw != null && resultMapCount > resultSetCount) {
      ResultMap resultMap = resultMaps.get(resultSetCount);
      // 处理返回集
      handleResultSet(rsw, resultMap, multipleResults, null);
      rsw = getNextResultSet(stmt);
      cleanUpAfterHandlingResultSet();
      resultSetCount++;
    }

    String[] resultSets = mappedStatement.getResultSets();
    if (resultSets != null) {
      while (rsw != null && resultSetCount < resultSets.length) {
        ResultMapping parentMapping = nextResultMaps.get(resultSets[resultSetCount]);
        if (parentMapping != null) {
          String nestedResultMapId = parentMapping.getNestedResultMapId();
          ResultMap resultMap = configuration.getResultMap(nestedResultMapId);
          handleResultSet(rsw, resultMap, null, parentMapping);
        }
        rsw = getNextResultSet(stmt);
        cleanUpAfterHandlingResultSet();
        resultSetCount++;
      }
    }

    return collapseSingleResultList(multipleResults);
  }
```

下面我们看这几个关键类。ResultSetWrapper。这个的源码是不是有点想我们前面自己写的原生jdbc的方法了?
拿到返回的列名和对应的java类型。

```java 
 public ResultSetWrapper(ResultSet rs, Configuration configuration) throws SQLException {
    super();
    this.typeHandlerRegistry = configuration.getTypeHandlerRegistry();
    this.resultSet = rs;
    final ResultSetMetaData metaData = rs.getMetaData();
    final int columnCount = metaData.getColumnCount();
    for (int i = 1; i <= columnCount; i++) {
      columnNames.add(configuration.isUseColumnLabel() ? metaData.getColumnLabel(i) : metaData.getColumnName(i));
      jdbcTypes.add(JdbcType.forCode(metaData.getColumnType(i)));
      classNames.add(metaData.getColumnClassName(i));
    }
  }
```

TypeHandler 是从jdbc中获取数据的接口，这个功能就跟前面我们用原生API实现时候的getValue方法类似。
主要是根据数据的类型，来确定是调用ResultSet#getString还是调用ResultSet#getInt等方法。

```java 
public interface TypeHandler<T> {

  void setParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException;

  T getResult(ResultSet rs, String columnName) throws SQLException;

  T getResult(CallableStatement cs, int columnIndex) throws SQLException;
}
```

ResultMap 是返回数据对应的Java对象。会在生成MappedStatement时候构建完成。如果是在xml中定义了就是 `<resultMap/>` 标签,如果没有就是
根据返回类自动生成一个resultMap。可以看到这个类属性其实跟他的标签是一样的。

```java 
public class ResultMap {
  private Configuration configuration;

  // 如果配置了<resultMap id="BaseResultMap" ，就是类全路径名+BaseResultMap。如果没有就是类名加方法名+Inline
  private String id;
  private Class<?> type;
  private List<ResultMapping> resultMappings;
  private List<ResultMapping> idResultMappings;
  private List<ResultMapping> constructorResultMappings;
  private List<ResultMapping> propertyResultMappings;
  private Set<String> mappedColumns;
  private Set<String> mappedProperties;
  private Discriminator discriminator;
  private boolean hasNestedResultMaps;
  private boolean hasNestedQueries;
  private Boolean autoMapping;
}
```

ResultMap的标签功能比较强大,我们深入研究下。举一个例子。

```java 
/**
 * 一个学校，一个校长，多个学生
 * name,headMaster(id,name),users()
 * 2022/4/10 22:07
 */
@Data
public class School {

    private Long id;

    private String name;

    private SchoolHeadMaster schoolHeadMaster;

    private List<Student> students;

}
@Data
public class SchoolHeadMaster {

    private Long id;

    private String name;
}

@Data
public class Student {

    private Long id;

    private String name;
}
```

配置文件如下

```xml 
<mapper namespace="orm.example.dal.mapper.SchoolMapper">
    <resultMap id="BaseResultMap" type="orm.example.dal.model.TUser">
        <id column="token_id" jdbcType="CHAR" property="tokenId"/>
        <result column="uid" jdbcType="INTEGER" property="uid"/>
        <result column="name" jdbcType="CHAR" property="name"/>
    </resultMap>

    <resultMap id="schoolResultMap" type="orm.example.dal.model.School">
        <result column="schoolId" jdbcType="CHAR" property="id"/>
        <result column="schoolName" jdbcType="CHAR" property="name"/>
        <!--        学校校长跟学校关系1对1-->
        <association property="schoolHeadMaster" javaType="orm.example.dal.model.SchoolHeadMaster">
            <id column="hmId" property="id"/>
            <result column="schoolHeadName" jdbcType="CHAR" property="name"/>
        </association>
        <!--        学生关系是1对n-->
        <collection property="students" javaType="list" ofType="orm.example.dal.model.Student">
            <id column="studentId" property="id"/>
            <result column="studentName" jdbcType="CHAR" property="name"/>
        </collection>
    </resultMap>


    <select id="selectSchool" resultMap="schoolResultMap">
        select school.id as 'schoolId', school.name as 'schoolName', hm.id as 'hmId', hm.name as 'schoolHeadName', s.name as 'studentName', s.id as 'studentId'
        from school
                 left join head_master hm on hm.id = school.head_master_id
                 left join student s on school.id = s.school_id
    </select>
</mapper>
```

执行数据验证 `com.test.example05.ResultMapTest#parseResultMap`

- line(11-22) 获取MappedStatement观察复杂对象ResultMap是什么样。

![](https://img.springlearn.cn/blog/learn_1649604916000.png)

- line(25-26) 观察mybatis如何填充数据。

```java {11-22,25-26}
    @Test
    public void parseResultMap() {
        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig-ResultMap.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();

        // 只要看这个复杂对象如何映射。
        MappedStatement selectSchool = configuration.getMappedStatement("orm.example.dal.mapper.SchoolMapper.selectSchool");
        ResultMap resultMap = selectSchool.getResultMaps().get(0);
        // 确定是一个复杂对象，规则是XMLMapperBuilder#processNestedResultMappings,只要发现查询语句对象的结果中有以下标签"association", "collection", "case"。就是复杂sql
        System.out.println("是否复杂对象:" + resultMap.hasNestedResultMaps());
        List<ResultMapping> propertyResultMappings = resultMap.getPropertyResultMappings();
        for (ResultMapping propertyResultMapping : propertyResultMappings) {
            // 1. 属性:id,db列名:schoolId,JavaType:class java.lang.Long
            // 2. 属性:name,db列名:schoolName,JavaType:class java.lang.String
            // 3. 属性:schoolHeadMaster,db列名:null,JavaType:class orm.example.dal.model.SchoolHeadMaster,映射NestedResultMapId
            // 4. 属性:students,db列名:null,JavaType:interface java.util.List,映射NestedResultMapId
            printResultMapping(propertyResultMapping, configuration);
        }

        // [School(id=1, name=西天小学, schoolHeadMaster=SchoolHeadMaster(id=1, name=如来), students=[Student(id=1, name=孙悟空), Student(id=2, name=猪八戒), Student(id=3, name=唐三藏)])]
        List<School> schools = configuration.getMapper(SchoolMapper.class, sqlSessionFactory.openSession(false)).selectSchool();
        System.out.println(schools);
    }

    private static void printResultMapping(ResultMapping propertyResultMapping, Configuration configuration) {
        String property = propertyResultMapping.getProperty();
        System.out.println("属性:" + property + ",db列名:" + propertyResultMapping.getColumn() + ",JavaType:" + propertyResultMapping.getJavaType() + ",映射NestedResultMapId:" + propertyResultMapping.getNestedResultMapId());
        String nestedResultMapId = propertyResultMapping.getNestedResultMapId();
        // 如果不等于空,说明是复杂对象。从配置文件中获取复杂属性的映射集合
        if (Objects.nonNull(nestedResultMapId)) {
            ResultMap nestedResultMap = configuration.getResultMap(nestedResultMapId);
            System.out.println(nestedResultMap.getType());
            System.out.println("是否复杂对象:" + nestedResultMap.hasNestedResultMaps());
            List<ResultMapping> propertyResultMappings = nestedResultMap.getPropertyResultMappings();
            for (ResultMapping resultMapping : propertyResultMappings) {
                printResultMapping(resultMapping, configuration);
            }
        }
    }
```

下面我们就看如何填充数据了。同样我们直接手撸代码。

| schoolId | schoolName | hmId | schoolHeadName | studentName | studentId |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 西天小学 | 1 | 如来 | 孙悟空 | 1 |
| 1 | 西天小学 | 1 | 如来 | 猪八戒 | 2 |
| 1 | 西天小学 | 1 | 如来 | 唐三藏 | 3 |
| 2 | 湖畔大学 | 2 | 马云 | 马化腾 | 4 |
| 2 | 湖畔大学 | 2 | 马云 | 谢霆锋 | 5 |
| 2 | 湖畔大学 | 2 | 马云 | 张学友 | 6 |

Mybatis中处理返回值，分一下基础。简单对象和复杂对象这里我们直接用复杂对象距离。
可以看到School中有2个基本属性和1个对象属性还有一个集合属性。

看这个图。

![](https://img.springlearn.cn/blog/learn_1649604916000.png)

这部分示例代码在 `com.test.example05.ResultMapTest#handlerResultSet`

- line(26) 首先我们要获取数据库返回列信息
- line(30) 一行一行读取数据，每次执行ResultSet#next就是下一行
- line(41) 因为我们School中有一个是集合属性,需要将多行数据转换成一行。此时我们执行完getRowValue
  会生成一个数据。但是这个数据不能直接就用, 还需要将第二行的数据也赋值到第一行的返回值中,这是我们就将
  第一行的数据返回值,带进去。
- line(41) 我们如何知道这6行数据如何合并。规则: 简单对象进行拼接，School中简单对象是id,和name。
- line(44) getRowValue中的每个方法都要注意看
- line(93-99) 主要处理是否需要合并行，合并行的时候直接填充数据接口。而不是合并则缓存中查不到数据，就重新生成一个结果。
- line(104) 判断ResultMap是否是一个复杂对象,这里School是一个复杂对象,因为不仅有一个HeadMaster还有一个List的学生集合。
- line(109) 第一次进去这里会有4个对象,id，name,schoolHeadMaster,students
- line(115-118) 对于School中的id和name都会在这几行被执行了。可以看到根据javaType找到了TypeHandler，然后TypeHandler负责取值。
- line(141) 对于schoolHeadMaster这个属性,是复杂对象,School中的Java类型是SchoolHeadMaster和他对应的ResultMap中的类型是一样的，
            则递归去获取数据,因为SchoolHeadMaster中也是都简单类型的id和name,所以最终也会在line(115-118)被执行了。
- line(125-138) School中的students，java类型是List,ResultMap中类型是Student，所以要先从第一行的数据去获取这个属性
  看List是否被实例化了，如果没有就实例化。然后执行add操作给list中数据追加值。


主要这里我们使用了MetaObject这个工具,是一个包装方法。不详细介绍了，如果还不清楚请跳转

[第03篇:Mybatis核心类详细介绍](http://localhost:8080/learn/mybatis/%E6%A0%B8%E5%BF%83%E7%B1%BB%E4%BB%8B%E7%BB%8D/#_1-5-objectwrapperfactory-%E5%AF%B9%E8%B1%A1%E5%8C%85%E8%A3%85%E5%B7%A5%E5%8E%82)
```java {26}
    @Test
    public void handlerResultSet() throws Exception {

        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example05/mybatisConfig-ResultMap.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();

        // 只要看这个复杂对象如何映射。
        MappedStatement selectSchool = configuration.getMappedStatement("orm.example.dal.mapper.SchoolMapper.selectSchool");
        ResultMap resultMap = selectSchool.getResultMaps().get(0);

        PreparedStatement preparedStatement = execute("select school.id   as 'schoolId',\n" +
                "       school.name as 'schoolName',\n" +
                "       hm.id       as 'hmId',\n" +
                "       hm.name     as 'schoolHeadName',\n" +
                "       s.name      as 'studentName',\n" +
                "       s.id        as 'studentId'\n" +
                "from school\n" +
                "         left join head_master hm on hm.id = school.head_master_id\n" +
                "         left join student s on school.id = s.school_id");
        // 2. 执行sql语句获取结果集
        preparedStatement.execute();
        ResultSetWrapper firstResultSet = getFirstResultSet(preparedStatement, configuration);
        ResultSet resultSet = firstResultSet.getResultSet();
        Map<String, Object> one2ManyAsMap = new HashMap<>();
        // 3. 处理结果转换,一行一行读取数据
        while (resultSet.next()) {
            // 3.1 用于判断多行数据是否要合并 规则: 简单对象属性，如果一样则可以合并。
            // 如: 下面数据返回值是 List<School> schools；School（Long id,String name,SchoolHeadMaster schoolHeadMaster,List<Student> students）
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (1, '西天小学', 1, '如来', '孙悟空', 1);
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (1, '西天小学', 1, '如来', '猪八戒', 2);
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (1, '西天小学', 1, '如来', '唐三藏', 3);
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (2, '湖畔大学', 2, '马云', '马化腾', 4);
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (2, '湖畔大学', 2, '马云', '谢霆锋', 5);
            //INSERT INTO MY_TABLE(schoolId, schoolName, hmId, schoolHeadName, studentName, studentId) VALUES (2, '湖畔大学', 2, '马云', '张学友', 6);
            // 我们如何知道这6行数据如何合并。规则: 简单对象进行拼接，School中简单对象是id,和name。
            // 所以这里构建的缓存key就是 id + name。相同就不新建返回值,而是对返回值二次赋值
            String cacheKey = getCacheKey(resultMap, resultSet, configuration);
            Object parentObject = one2ManyAsMap.get(cacheKey);
            // 3.2 开始填充数据
            parentObject = getRowValue(resultMap, firstResultSet, configuration, parentObject);
            one2ManyAsMap.put(cacheKey, parentObject);
        }
        for (Object value : one2ManyAsMap.values()) {
            System.out.println(value);
        }
    }

    private PreparedStatement execute(String sql) throws Exception {
        String dbUrl = "jdbc:mysql://127.0.0.1:3306/test";
        String user = "root";
        String pass = "123456";
        // 1. 获取数据库连接
        Connection connection = DriverManager.getConnection(dbUrl, user, pass);
        return connection.prepareStatement(sql);
    }

    private ResultSetWrapper getFirstResultSet(Statement stmt, Configuration configuration) throws SQLException {
        ResultSet rs = stmt.getResultSet();
        while (rs == null) {
            if (stmt.getMoreResults()) {
                rs = stmt.getResultSet();
            } else {
                if (stmt.getUpdateCount() == -1) {
                    break;
                }
            }
        }
        return rs != null ? new ResultSetWrapper(rs, configuration) : null;
    }

    private static String getCacheKey(ResultMap resultMap, ResultSet resultSet, Configuration configuration) throws Exception {
        StringBuffer sb = new StringBuffer();
        sb.append(resultMap.getId());
        List<ResultMapping> propertyResultMappings = resultMap.getPropertyResultMappings();
        for (ResultMapping propertyResultMapping : propertyResultMappings) {
            if (propertyResultMapping.isSimple()) {
                Class<?> javaType = propertyResultMapping.getJavaType();
                TypeHandler<?> typeHandler = configuration.getTypeHandlerRegistry().getTypeHandler(javaType);
                sb.append(propertyResultMapping.getProperty());
                Object propertyValue = typeHandler.getResult(resultSet, propertyResultMapping.getColumn());
                sb.append(propertyValue);
            }
        }
        return sb.toString();
    }

    private static Object getRowValue(ResultMap resultMap, ResultSetWrapper firstResultSet, Configuration configuration, Object rowValue) throws Exception {
        // 获取返回值的实体类
        Object returnValue = null;
        // 如果不等于空说明是处理合并,那么不构建新对象,只在合并的对象上重新赋值。
        if (Objects.nonNull(rowValue)) {
            returnValue = rowValue;
        } else {
            // 等于空说明是第一次进入,直接构建返回值示例。
            returnValue = configuration.getObjectFactory().create(resultMap.getType());
        }
        // 下面对实例方法进行赋值，利用工具类MetaObject包装提供统一的赋属性方法
        MetaObject metaObject = configuration.newMetaObject(returnValue);
        // 判断是否是嵌套对象
        boolean nestedFlag = resultMap.hasNestedResultMaps();
        ResultSet resultSet = firstResultSet.getResultSet();
        // 判断是否简单对象
        if (nestedFlag) {
            // 非简单对象,说明需要判断属性各自需要的映射对象
            List<ResultMapping> propertyResultMappings = resultMap.getPropertyResultMappings();
            for (ResultMapping propertyResultMapping : propertyResultMappings) {
                Class<?> javaType = propertyResultMapping.getJavaType();
                String nestedResultMapId = propertyResultMapping.getNestedResultMapId();
                Object propertyValue;
                // 是空说明,当前属性是基本属性
                if (Objects.isNull(nestedResultMapId)) {
                    // 获取当前属性的Java类型,从配置中获取该类型,读取ResultSet要使用的方法。eg:StringTypeHandler 使用ResultSet#getString
                    TypeHandler<?> typeHandler = configuration.getTypeHandlerRegistry().getTypeHandler(javaType);
                    propertyValue = typeHandler.getResult(resultSet, propertyResultMapping.getColumn());
                } else {
                    // 不等于空说明是嵌套对象,从配置中读取嵌套对象的映射信息
                    ResultMap nestedResultMap = configuration.getResultMap(nestedResultMapId);
                    // 嵌套对象的java类型。eg: School(students),这里的Java类型就是Student
                    Class<?> nestedJavaType = nestedResultMap.getType();
                    // 若果是list方式,外面的javaType=list，里面是真实java对象
                    if (!javaType.equals(nestedJavaType) && Collection.class.isAssignableFrom(javaType)) {
                        propertyValue = getRowValue(nestedResultMap, firstResultSet, configuration, null);
                        MetaObject parentMetaObject = configuration.newMetaObject(returnValue);
                        // 获取父对象School 获取students的List
                        Object collect = parentMetaObject.getValue(propertyResultMapping.getProperty());
                        if (Objects.isNull(collect)) {
                            // 如果是null，则将list实例化
                            collect = configuration.getObjectFactory().create(javaType);
                            parentMetaObject.setValue(propertyResultMapping.getProperty(), collect);
                        }
                        // 给list中添加信息
                        MetaObject metaCollectObject = configuration.newMetaObject(collect);
                        metaCollectObject.add(propertyValue);
                        propertyValue = collect;
                    } else {
                        // 简单对象
                        propertyValue = getRowValue(nestedResultMap, firstResultSet, configuration, null);
                    }
                }
                metaObject.setValue(propertyResultMapping.getProperty(), propertyValue);
            }
        } else {
            List<ResultMapping> propertyResultMappings = resultMap.getPropertyResultMappings();
            for (ResultMapping propertyResultMapping : propertyResultMappings) {
                Class<?> javaType = propertyResultMapping.getJavaType();
                TypeHandler<?> typeHandler = configuration.getTypeHandlerRegistry().getTypeHandler(javaType);
                Object propertyValue = typeHandler.getResult(resultSet, propertyResultMapping.getColumn());
                metaObject.setValue(propertyResultMapping.getProperty(), propertyValue);
            }
        }
        return returnValue;
    }
```

好了到这里对于场景1中，返回list中的数据就处理好了。

````java 
  private <E> Object executeForMany(SqlSession sqlSession, Object[] args) {
    List<E> result;
    Object param = method.convertArgsToSqlCommandParam(args);
    if (method.hasRowBounds()) {
      RowBounds rowBounds = method.extractRowBounds(args);
      result = sqlSession.selectList(command.getName(), param, rowBounds);
    } else {
      result = sqlSession.selectList(command.getName(), param);
    }
    // issue #510 Collections & arrays support
    if (!method.getReturnType().isAssignableFrom(result.getClass())) {
      if (method.getReturnType().isArray()) {
        return convertToArray(result);
      } else {
        return convertToDeclaredCollection(sqlSession.getConfiguration(), result);
      }
    }
    return result;
  }
````


### 场景二:

如果是单个对象,在基于场景一的返回值上加一个判断,如果结果只要1个就只取第一个。
如果是多个，则报错。

```java 
  public <T> T selectOne(String statement, Object parameter) {
    // Popular vote was to return null on 0 results and throw exception on too many.
    List<T> list = this.selectList(statement, parameter);
    if (list.size() == 1) {
      return list.get(0);
    } else if (list.size() > 1) {
      throw new TooManyResultsException("Expected one result (or null) to be returned by selectOne(), but found: " + list.size());
    } else {
      return null;
    }
  }
```

### 场景三:

更新语句直接 Statement#getUpdateCount 获取更新数量

```java 
  public int update(Statement statement) throws SQLException {
    PreparedStatement ps = (PreparedStatement) statement;
    ps.execute();
    int rows = ps.getUpdateCount();
    Object parameterObject = boundSql.getParameterObject();
    KeyGenerator keyGenerator = mappedStatement.getKeyGenerator();
    keyGenerator.processAfter(executor, mappedStatement, ps, parameterObject);
    return rows;
  }
```

### 场景四:

排除查询,其他语句返回都是int类型的更新成数量。那么假如方法是boolean类型，或者Long和Void呢

```java 
public class MapperMethod {
  private Object rowCountResult(int rowCount) {
    final Object result;
    if (method.returnsVoid()) {
      result = null;
    } else if (Integer.class.equals(method.getReturnType()) || Integer.TYPE.equals(method.getReturnType())) {
      result = rowCount;
    } else if (Long.class.equals(method.getReturnType()) || Long.TYPE.equals(method.getReturnType())) {
      result = (long) rowCount;
    } else if (Boolean.class.equals(method.getReturnType()) || Boolean.TYPE.equals(method.getReturnType())) {
      result = rowCount > 0;
    } else {
      throw new BindingException("Mapper method '" + command.getName() + "' has an unsupported return type: " + method.getReturnType());
    }
    return result;
  }
}  
```
