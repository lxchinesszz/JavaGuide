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
password: 111
backtotop: true
title: 第11篇:Mybatis查询限制插件设计
category: Mybatis
---
<PageBanner/>

## 一、实现目标

目标: 针对Mysql数据库实现动态修改sql的能力，增加上limit的查询限制。

## 二、知识扩展

首先下了解下有那些的分页技术。

## 2.1 物理分页

所谓物理分页是数据库直接提供了分页的预发, 如mysql的limit,oracle的rownum,好处是效率高;不好的地方就是不同数据库有不同的语法。

## 2.2 逻辑分页

逻辑分页利用游标分页，好处是所有数据库都统一，坏处就是效率低。

## 二、实现分析

首先我们先易后难,先说逻辑分页。

## 2.1 逻辑分页

首先我们看下Mybatis中当执行查询时候的代码,当返回是list时候。会走到executeForMany方法中。
该方法主要判断是否需要进行逻辑分页。代码不难,看就完了。
```java 
public class MapperMethod {
    public Object execute(SqlSession sqlSession, Object[] args) {
        ....
        case SELECT:
        if (method.returnsVoid() && method.hasResultHandler()) {
          executeWithResultHandler(sqlSession, args);
          result = null;
        } else if (method.returnsMany()) {
          result = executeForMany(sqlSession, args);
        }  
        ...
    }
    
    private <E> Object executeForMany(SqlSession sqlSession, Object[] args) {
        List<E> result;
        // 参数解析
        Object param = method.convertArgsToSqlCommandParam(args);
        // 判断是否逻辑分页了。
        if (method.hasRowBounds()) {
          RowBounds rowBounds = method.extractRowBounds(args);
          result = sqlSession.selectList(command.getName(), param, rowBounds);
        } else {
          result = sqlSession.selectList(command.getName(), param);
        }
        ....   
    }
}
```
hasRowBounds 可以判断当前的方法是否要走逻辑分页。
MethodSignature#hasRowBounds的逻辑也比较简单,就是判断方法入参中是否包含了RowBounds,如下代码。

```java 
public class MethodSignature{
    public MethodSignature(Configuration configuration, Class<?> mapperInterface, Method method) {
      this.rowBoundsIndex = getUniqueParamIndex(method, RowBounds.class);
      this.resultHandlerIndex = getUniqueParamIndex(method, ResultHandler.class);
      this.paramNameResolver = new ParamNameResolver(configuration, method);
    }
    private Integer getUniqueParamIndex(Method method, Class<?> paramType) {
      Integer index = null;
      final Class<?>[] argTypes = method.getParameterTypes();
      for (int i = 0; i < argTypes.length; i++) {
        if (paramType.isAssignableFrom(argTypes[i])) {
          if (index == null) {
            index = i;
          } else {
            throw new BindingException(method.getName() + " cannot have multiple " + paramType.getSimpleName() + " parameters");
          }
        }
      }
      return index;
    }
    public boolean hasRowBounds() {
      return rowBoundsIndex != null;
    }
}    
```

如果方法入参中有RowBounds则会逻辑分页,如果没有指定则使用默认RowBounds即不限制数量。说不限制其实也限制了，
就是Integer.MAX_VALUE 😂

```java  
public class DefaultSqlSession implements SqlSession {
  @Override
  public <E> List<E> selectList(String statement, Object parameter) {
    return this.selectList(statement, parameter, RowBounds.DEFAULT);
  }
}  

public class RowBounds {

  public static final int NO_ROW_OFFSET = 0;
  public static final int NO_ROW_LIMIT = Integer.MAX_VALUE;
  public static final RowBounds DEFAULT = new RowBounds();

  private final int offset;
  private final int limit;

  public RowBounds() {
    this.offset = NO_ROW_OFFSET;
    this.limit = NO_ROW_LIMIT;
  }
} 
```

那么逻辑分页的处理游标的地方在哪里呢? 因为前面我们已经对Mybatis的所有执行流程分析过了,所以这个时候我们应该有自己的思考了。
应该是在jdbc执行后 处理返回数据的时候，那么应该就是在DefaultResultSetHandler中。直接看源码吧。

- line(4-16) 用于处理偏移量, 如从第四页开始,则执行next跳过前三行。
- line(17-19) 处理限制数量，如最大查询5行，如果返回值中大于5就返回false就不在添加数据。
- line(25) 填过偏移量
- line(26) 判断limit

```java {4-16,17-19,25,26}

public class DefaultResultSetHandler implements ResultSetHandler {
 
  private void skipRows(ResultSet rs, RowBounds rowBounds) throws SQLException {
    if (rs.getType() != ResultSet.TYPE_FORWARD_ONLY) {
      if (rowBounds.getOffset() != RowBounds.NO_ROW_OFFSET) {
        rs.absolute(rowBounds.getOffset());
      }
    } else {
      for (int i = 0; i < rowBounds.getOffset(); i++) {
        if (!rs.next()) {
          break;
        }
      }
    }
  }
  private boolean shouldProcessMoreRows(ResultContext<?> context, RowBounds rowBounds) {
    return !context.isStopped() && context.getResultCount() < rowBounds.getLimit();
  }
  
  private void handleRowValuesForSimpleResultMap(ResultSetWrapper rsw, ResultMap resultMap, ResultHandler<?> resultHandler, RowBounds rowBounds, ResultMapping parentMapping)
      throws SQLException {
    DefaultResultContext<Object> resultContext = new DefaultResultContext<>();
    ResultSet resultSet = rsw.getResultSet();
    skipRows(resultSet, rowBounds);
    while (shouldProcessMoreRows(resultContext, rowBounds) && !resultSet.isClosed() && resultSet.next()) {
      ResultMap discriminatedResultMap = resolveDiscriminatedResultMap(resultSet, resultMap, null);
      Object rowValue = getRowValue(rsw, discriminatedResultMap, null);
      storeObject(resultHandler, resultContext, rowValue, parentMapping, resultSet);
    }
  }
}  
```

好了，知道了这些我们就开始分析我们要如何使用插件了吧。对就是拦截ResultSetHandler,利用反射的方法,将默认的
RowBounds添加limit限制。

```java 
    /**
     * 那我们就拦截处理结果.
     * 启用反射修改默认的RowBounds limit属性
     */
    @Intercepts(@Signature(type = ResultSetHandler.class, method = "handleResultSets", args = {Statement.class}))
    public static class DefaultRowBoundsHandler implements Interceptor {

        @Override
        public Object intercept(Invocation invocation) throws Throwable {
            Object target = invocation.getTarget();
            Field rowBounds = target.getClass().getDeclaredField("rowBounds");
            rowBounds.setAccessible(true);
            RowBounds originRowBounds = (RowBounds) rowBounds.get(target);
            // 如果是默认的则替换下
            if (originRowBounds.equals(RowBounds.DEFAULT)) {
                MetaObject metaObject = MetaObject.forObject(originRowBounds, new DefaultObjectFactory(), new DefaultObjectWrapperFactory(), new DefaultReflectorFactory());
                metaObject.setValue("limit", 2);
            }
            return invocation.proceed();
        }
    }
    @Test
    public void limitAddRowBounds(){
        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example01/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();
        // 添加上我们的拦截器
        configuration.addInterceptor(new DefaultRowBoundsHandler());
        // 参数: autoCommit,从名字上看就是是否自动提交事务
        SqlSession sqlSession = sqlSessionFactory.openSession(false);
        // 获取Mapper
        TUserMapper mapper = configuration.getMapperRegistry().getMapper(TUserMapper.class, sqlSession);
        // 如果自己加了RowBounds，则不自动加limit
        RowBounds rowBounds = new RowBounds(0, 3);
        List<TUser> users1 = mapper.selectRowBounds(rowBounds);
        System.out.println(users1.size());
        // 如果不加显示,默认limit = 2
        List<TUser> users = mapper.selectAll();
        System.out.println(users.size());
    }
```

好了，到这里逻辑分页已经搞定了。注意奥,这里只拦截了 `ResultSetHandler#handleResultSets` 其他两个没有拦截。
注意奥这里只是一个思路，其实解决还有几种方法，我们要学会举一反三，比如我们也可以拦截 `Executor#query` 直接修改入参中的RowBounds参数。

## 2.2 物理分页

物理分页就是给sql添加上参数。那么sql信息都在哪里呢? 就在下图中。

![](https://img.springlearn.cn/blog/learn_1649779778000.png)

那么我们如何能修改参数呢? 当然就是从下面两个类中利用反射来给sql增加上limit了。那么我们在哪里拦截呢?

首先确定拦截地方,首先上面两个类。RawSqlSource(占位符)、DynamicSqlSource(变量符)。都属于MappedStatement的内部属性，只要我们能
拿到MappedStatement就可以了。

![](https://img.springlearn.cn/blog/learn_1649782868000.png)

其中Executor中就可以。那么我们开始操作吧。

- line(14) RawSqlSource 占位符是最好处理的,内部属性就是StaticSqlSource,而StaticSqlSource中的sql是现成的直接造就行了。
- line(26) DynamicSqlSource 变量符,稍微有点难搞,因为你不能直接拿到sql,所以我们只能去重写它。如下。
- line(48-63) 从DynamicContext拿到原生sql然后,跟上面一样。

```java {14,26,48-63}
    /**
     * 那我们就拦截处理结果.
     * 启用反射修改默认的RowBounds limit属性
     */
    @Intercepts(@Signature(type = Executor.class, method = "query",
            args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}))
    public static class PhysicalHandler implements Interceptor {

        @Override
        public Object intercept(Invocation invocation) throws Throwable {
            Object[] args = invocation.getArgs();
            MappedStatement ms = (MappedStatement) args[0];
            SqlSource sqlSource = ms.getSqlSource();
            if (sqlSource instanceof RawSqlSource) {
                MetaObject rawSqlSource = ms.getConfiguration().newMetaObject((RawSqlSource) sqlSource);
                Object staticSqlSource = rawSqlSource.getValue("sqlSource");
                MetaObject metaObject = ms.getConfiguration().newMetaObject(staticSqlSource);
                String sql = (String) metaObject.getValue("sql");
                if (sql.indexOf("limit") <= 0) {
                    String limitSql = sql + " limit 2";
                    System.out.println(limitSql);
                    metaObject.setValue("sql", limitSql);
                }
            }
            // 如果是动态sql,则需要解析
            if (sqlSource instanceof DynamicSqlSource) {
                MetaObject metaObject = ms.getConfiguration().newMetaObject(ms);
                LimitDynamicSqlSource limitDynamicSqlSource = new LimitDynamicSqlSource((DynamicSqlSource) sqlSource);
                metaObject.setValue("sqlSource", limitDynamicSqlSource);
            }
            return invocation.proceed();
        }
    }

    public static class LimitDynamicSqlSource implements SqlSource {

        private final Configuration configuration;

        private final SqlNode rootSqlNode;
        
        public LimitDynamicSqlSource(DynamicSqlSource dynamicSqlSource) {
            MetaObject metaObject = MetaObject.forObject(dynamicSqlSource, new DefaultObjectFactory(), new DefaultObjectWrapperFactory(), new DefaultReflectorFactory());
            this.configuration = (Configuration) metaObject.getValue("configuration");
            this.rootSqlNode = (SqlNode) metaObject.getValue("rootSqlNode");
        }

        @Override
        public BoundSql getBoundSql(Object parameterObject) {
            DynamicContext context = new DynamicContext(configuration, parameterObject);
            rootSqlNode.apply(context);
            SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
            Class<?> parameterType = parameterObject == null ? Object.class : parameterObject.getClass();
            String sql = context.getSql();
            String limitSql = sql;
            // 给原生sql增加limit
            if (sql.indexOf("limit") <= 0) {
                limitSql = sql + " limit 2";
                System.out.println(limitSql);
            }
            SqlSource sqlSource = sqlSourceParser.parse(limitSql, parameterType, context.getBindings());
            BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
            context.getBindings().forEach(boundSql::setAdditionalParameter);
            return boundSql;
        }
    }
```


好了我们直接来验证下吧。


```java 
    /**
     * 物理分页
     * 就是拼装sql
     */
    @Test
    public void physicalLimit() {
        // 读取配置信息(为什么路径前不用加/,因为是相对路径。maven编译后的资源文件和class文件都是在一个包下,所以不用加/就是当前包目录)
        InputStream mapperInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("example01/mybatisConfig.xml");
        // 生成SqlSession工厂,SqlSession从名字上看就是,跟数据库交互的会话信息,负责将sql提交到数据库进行执行
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(mapperInputStream, "development");
        // 获取Mybatis配置信息
        Configuration configuration = sqlSessionFactory.getConfiguration();
        // 添加上我们的拦截器
        configuration.addInterceptor(new PhysicalHandler());
        // 参数: autoCommit,从名字上看就是是否自动提交事务
        SqlSession sqlSession = sqlSessionFactory.openSession(false);
        // 获取Mapper
        TUserMapper mapper = configuration.getMapperRegistry().getMapper(TUserMapper.class, sqlSession);
        List<TUser> users = mapper.selectAll();
        System.out.println(users.size());
    }
```

好了，到这里我们就实现了动态修改sql了。重要的是思路, 思路决定出路。要学会举一反三。本篇所有的代码示例都在

`com.test.plugin.LimitPluginTest`
