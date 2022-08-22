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
sidebarDepth: 3
title: apache-commons 池化技术
password: 123
---

:::info 羽化而登仙，池化而提效
本篇文章我们的研究专题是池化技术, 其实所谓池化可以简单理解为缓存。将那些创建比较耗时的对象,缓存起来,放到一个池子里。
比如数据库连接池，线程池，字符串常量池。这个技术常用于框架类设计。本文教你基于Apache-commons-pool2快速实现一个常量池的设计。
:::


## 一、Pool2 四大件

![](https://img.springlearn.cn/blog/learn_1651339646000.png)


### 1.1 新建资源

![](https://img.springlearn.cn/blog/learn_1651340254000.png)


### 1.2 回收资源

![](https://img.springlearn.cn/blog/learn_1651340687000.png)

## 二、数据库连接池实战

我们利用Common Pool2工具 可以使用很少的代码就实现了池化的能力。

## 2.2 构建连接工厂

可以看到核心方法非常少，开发者只用实现很少方法即可

1. makeObject 创建资源
2. activateObject 资源被激活时候调用
3. passivateObject 资源在回收时候调用
4. validateObject 当配置了资源检查时候会在创建和回收时候调用
5. destroyObject 资源在销毁时候调用

```java  
public class PooledConnectFactory implements PooledObjectFactory<Connection> {


    /**
     * 数据库连接
     */
    private final String url;

    /**
     * 用户名
     */
    private final String userName;

    /**
     * 数据密码
     */
    private final String password;

    public PooledConnectFactory(String url, String userName, String password) {
        this.url = url;
        this.userName = userName;
        this.password = password;
    }

    /**
     * 对象被激活后，会进行调用
     *
     * @param pooledObject a {@code PooledObject} wrapping the instance to be activated
     */
    @Override
    public void activateObject(PooledObject<Connection> pooledObject) throws Exception {
    }

    /**
     * 销毁数据库连接
     *
     * @param pooledObject a {@code PooledObject} wrapping the instance to be destroyed
     * @throws Exception 异常
     */
    @Override
    public void destroyObject(PooledObject<Connection> pooledObject) throws Exception {
        Connection connection = pooledObject.getObject();
        connection.close();
    }

    /**
     * 创建一个数据库连接
     *
     * @return 数据库连接的池对象包装
     * @throws Exception 异常
     */
    @Override
    public PooledObject<Connection> makeObject() throws Exception {
        Connection connection = DriverManager.getConnection(this.url, this.userName, this.password);
        return new DefaultPooledObject<>(connection);
    }

    /**
     * 回收资源时候进行调用
     * @param pooledObject a {@code PooledObject} wrapping the instance to be passivated
     *
     * @throws Exception
     */
    @Override
    public void passivateObject(PooledObject<Connection> pooledObject) throws Exception {

    }

    @Override
    @SneakyThrows
    public boolean validateObject(PooledObject<Connection> pooledObject) {
        Connection connection = pooledObject.getObject();
        // 如果连接关闭说明已经失效就返回false告诉池子,已经失效,会自动移除
        return !connection.isClosed();
    }
}
```

## 2.3 连接池演示

```java 
    @Test
    @DisplayName("验证回收对象")
    public void testReturn()throws Exception{
        // 1. 构建一个数据连接池化工厂
        String dbUrl = "jdbc:mysql://127.0.0.1:3306/test";
        String user = "root";
        String pass = "123456";
        PooledConnectFactory pooledConnectFactory = new PooledConnectFactory(dbUrl, user, pass);

        // 2. 给池子添加支持的配置信息
        GenericObjectPoolConfig<Connection> config = new GenericObjectPoolConfig<Connection>();
        // 2.1 最大池化对象数量
        config.setMaxTotal(5);
        // 2.2 最大空闲池化对象数量
        config.setMaxIdle(2);
        // 2.3 最小空闲池化对象数量
        config.setMinIdle(2);
        // 2.4 间隔多久检查一次池化对象状态,驱逐空闲对象,检查最小空闲数量小于就创建
        config.setTimeBetweenEvictionRuns(Duration.ofSeconds(5));
        // 2.5 阻塞就报错
        config.setBlockWhenExhausted(true);
        // 2.6 最大等待时长超过5秒就报错,如果不配置一直进行等待
        config.setMaxWait(Duration.ofSeconds(5));
        // 2.7 是否开启jmx监控,默认开启
        config.setJmxEnabled(true);
        // 2.8 一定要符合命名规则,否则无效
        config.setJmxNameBase("org.apache.commons.pool2:type=MysqlConnObjectPool,name=ConnectJmxNameBase");
        // 生成数据库连接池
        // 连接池配置最大5个连接setMaxTotal(5),但是获取6次,那么有一次获取不到就会阻塞setBlockWhenExhausted(true),
        // 当等待了10秒setMaxWait(Duration.ofSeconds(10))还是获取不到。就直接报错
        try (GenericObjectPool<Connection> connPool = new GenericObjectPool<>(pooledConnectFactory, config)) {
            for (int i = 1; i <= 7; i++) {
                Connection connection = connPool.borrowObject();
                Statement statement = connection.createStatement();
                ResultSet show_tables = statement.executeQuery("show tables");
                printRows("Connect-" + i + ">", show_tables);
                connPool.returnObject(connection);
            }
        }
    }
```

甚至还能配置支持jmx管理。非常的简单和方便。

![](https://img.springlearn.cn/blog/learn_1651342753000.png)
