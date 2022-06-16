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
title: Spring声明式事务的实现方案?
category: SpringBoot
---

::: tip
本篇文章是对Mybatis知识点的一个扩展,主要一起来研究下Spring是如何来管理事务的。顺便再多聊一点其他的知识点,在学习的过程中主要带着以下问题来进行有目的的学习
然后最终来回答下面这些问题。
:::

1. Mybatis是如何整合进Spring中的
   - Spring如何知道哪些接口是Mapper接口的?
   - Mapper接口是如何变成Spring Bean的？
2. Spring在哪里声明的SqlSession的实现逻辑？
3. Spring中声明式事务的实现方式是怎样的？
4. Spring中如何处理嵌套事务的？
5. Spring中事务的传播方式是如何实现的？

https://cloud.tencent.com/developer/article/1497631

## 一、如何整合进Spring中的

默认大家对Spring都比较了解了,这里只说结果。都知道接口是不能被实例化的,那么接口是如何成为Bean的呢?

## 1.1 如何知道哪些是Mybatis的接口呢?

- `@MapperScan` Spring中在配置类上加上这个注解。根据源码能看到还导入了`MapperScannerRegistrar`

```java 
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(MapperScannerRegistrar.class)
@Repeatable(MapperScans.class)
public @interface MapperScan {}

public class MapperScannerRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware {}
```

`MapperScannerRegistrar` 会在配置类解析时候拿到`MapperScan`注解信息,并解析里面的参数。生成一个 `MapperScannerConfigurer` 信息。
从源码中能看到Mybatis的很多配置信息,都会被注入到`MapperScannerConfigurer`中。

![img.png](https://img.springlearn.cn/learn_4b3a9611962ebf20587584574ecb05ec.png)

```java 
public class MapperScannerConfigurer
    implements BeanDefinitionRegistryPostProcessor, InitializingBean, ApplicationContextAware, BeanNameAware {}
```

实现自BeanDefinitionRegistryPostProcessor会前置,拿到MapperScan中的basePackage,最终通过`ClassPathMapperScanner`扫描并添加到
`BeanDefinitionRegistry`中。

![](https://img.springlearn.cn/blog/learn_1655086500000.png)

到这里这种方式就能知道哪些是Mybatis中的Mapper接口了。

还有第二种方式当发现Spring容器中没有`MapperScannerConfigurer`。会自动注入一个

![](https://img.springlearn.cn/blog/learn_1655086934000.png)

会直接指定哪些类被Mapper修饰,就将他生成Bean。
![](https://img.springlearn.cn/blog/learn_1655087073000.png)

好了，到这里就知道如何来确定那些接口是要生成Mybatis接口的了。下面看下个问题。

## 1.2 Mapper接口是如何变成Spring Bean的？

接口是不能被实例化的，但是在Spring中如何想让接口实例化就可以使用 [FactoryBean](/learn/spring/FactoryBean接口实例化/) + 动态代理的方式，实现接口类的实例化。

- 首先利用 ClassPathBeanDefinitionScanner 找到符合规则的类生成 BeanDefinition。
- 给 BeanDefinition 指定BeanClass,执行 FactoryBean 是 `MapperFactoryBean`

![](https://img.springlearn.cn/blog/learn_1655087975000.png)


## 二、Spring在哪里声明的SqlSession的实现逻辑？

通过Mybatis的学习知道SqlSession一共有2个包装类。SqlSessionManager和SqlSessionTemplate。那么SqlSession是在哪里指定用哪个的呢?
答案就在 `MapperFactoryBean`

```java 
public class MapperFactoryBean<T> extends SqlSessionDaoSupport implements FactoryBean<T> {
  private SqlSessionTemplate sqlSessionTemplate;
   
     public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
       if (this.sqlSessionTemplate == null || sqlSessionFactory != this.sqlSessionTemplate.getSqlSessionFactory()) {
         this.sqlSessionTemplate = createSqlSessionTemplate(sqlSessionFactory);
       }
     }
   
     @SuppressWarnings("WeakerAccess")
     protected SqlSessionTemplate createSqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
       return new SqlSessionTemplate(sqlSessionFactory);
     }
}
```

## 三、Spring中声明式事务的实现方式是怎样的

看了Mybatis中事务这一章节,知道如果使用了SqlSessionTemplate,那么事务的权限就外包给了Spring。那么Spring中事务怎么处理的呢?
终于进入正题了。Spring中提供两种事务的能力。

- 声明式事务
- 编程式事务

## 3.1 声明式事务

使用 `Transactional` 修饰方法，其主要实现是使用切面实现。

- `TransactionAspectSupport#invokeWithinTransaction`。拦截方法。获取事务管理器。

这里我们先来思考下,通过前面的学习知道事务的最底层实现是jdbc驱动来实现的。

![](https://img.springlearn.cn/learn_d3cd2ff5e89f6dbfffff18289043304e.png)

那么切面中要想实现，就必须保证切面中的线程执行的数据库操作，一定是同一个`SqlSession`这样才能在方法正常执行时候做commit，异常时候做rollback操作。

![](https://img.springlearn.cn/blog/learn_1655099097000.png)

那我们看下他是如何保证切面中的数据库操作一定是同一个SqlSession的吧。这部分逻辑就在 `SqlSessionTemplate` 中。

![](https://img.springlearn.cn/blog/learn_1655099774000.png)

- 获取当前线程是否已经有SqlSession了，如果有就直接使用，这样就保证在切面中的事务用的是同一个事务了。

## 3.2 编程式事务

- `TransactionTemplate#execute`

编程是事务需要实现者自己来管理事务的，Spring提供的扩展接口类是 `CallbackPreferringPlatformTransactionManager`。如果发现容器中默认的事务管理类是这个
就直接调动全局的这个事务管理方法。如果不是就自己来处理。这种设计的好处是,事务管理器既可以做关系型数据库的事务管理,也可以满足一些特定场景的事务控制(eg: 给Kafka的逻辑做一个事务管理)。

![](https://img.springlearn.cn/blog/learn_1655100730000.png)


## 四、Spring中如何处理嵌套事务的？

什么是嵌套事务,举一个伪代码的例子。下面 `saveUser` 代码中有2个Mapper。但是有几个SqlSession呢?

```java 
UserMapper userMapper;

RegistroyMapper registoryMapper;

@Transactional(rollbackFor = {Throwable.class, RuntimeException.class, ExecutionException.class})
public void save(User user){
   userMapper.save(user);
}

@Transactional(rollbackFor = {Throwable.class, RuntimeException.class, ExecutionException.class})
public void saveUser(String userName,Strign password){
   User user = registoryMapper.regis(userName,password);
   save(user);
}
```

通过上面的学习我们了解到如果是Spring来管理的事务是一个线程对应一个SqlSession。所以说上面伪代码中的两个Mapper
其实是用的同一个SqlSession,这样才能保证是在同一个事务中。核心代码逻辑就在这里 `SqlSessionUtils#getSqlSession`。
从Spring中的事务管理器中获取 `SqlSession`。是否使用同一个事务，外包给Spring容器去托管。这就给Spring提供了很多可以发挥的空间。
比如说传播机制等。

```java 
public static SqlSession getSqlSession(SqlSessionFactory sessionFactory, ExecutorType executorType,
      PersistenceExceptionTranslator exceptionTranslator) {

    notNull(sessionFactory, NO_SQL_SESSION_FACTORY_SPECIFIED);
    notNull(executorType, NO_EXECUTOR_TYPE_SPECIFIED);

    SqlSessionHolder holder = (SqlSessionHolder) TransactionSynchronizationManager.getResource(sessionFactory);

    SqlSession session = sessionHolder(executorType, holder);
    if (session != null) {
      return session;
    }

    LOGGER.debug(() -> "Creating a new SqlSession");
    session = sessionFactory.openSession(executorType);

    registerSessionHolder(sessionFactory, executorType, exceptionTranslator, session);

    return session;
  }
```

## 五、Spring中事务的传播方式是如何实现的？

| 传播方式                                  | 说明                                                         | 常用 |
|---------------------------------------| ------------------------------------------------------------ | ---- |
| TransactionDefinition.PROPAGATION_REQUIRED      | 如果存在一个事务，则支持当前事务。如果没有事务则开启         | ✅    |
| TransactionDefinition.PROPAGATION_SUPPORTS      | 如果存在一个事务，支持当前事务。如果没有事务，则非事务的执行 |      |
| TransactionDefinition.PROPAGATION_MANDATORY     | 如果已经存在一个事务，支持当前事务。如果没有一个活动的事务，则抛出异常 |      |
| TransactionDefinition.PROPAGATION_NEVER         | 总是非事务地执行，如果存在一个活动事务，则抛出异常           |      |
| TransactionDefinition.PROPAGATION_NOT_SUPPORTED | 总是非事务地执行，并挂起任何存在的事务                       |      |
| TransactionDefinition.PROPAGATION_REQUIRES_NEW  | 总是开启一个新的事务。如果一个事务已经存在，则将这个存在的事务挂起。 |      |
| TransactionDefinition.PROPAGATION_NESTED        | 如果一个活动的事务存在，则运行在一个嵌套的事务中. 如果没有活动事务则按TransactionDefinition.PROPAGATION_REQUIRED 属性执行 |      |


**思考传播机制如何实现**

首先我们先思考下传播机制是如何实现的,因为我们知道 `要保证是同一个事务,那么一定是同一个SqlSession,这样才能保证是同一个事务`。
而如果要新开事务,就要先将当前线程绑定的SqlSession等事务信息,给挂起，那么是如何进行挂起的呢? SqlSession又是如何跟线程绑定的呢?

## 5.1 SqlSession是如何跟线程绑定的呢?

通过TransactionSynchronizationManager中的ThreadLocal跟线程绑定`(new NamedThreadLocal<>("Transactional resources"))`。注意: 如果主线程下创建子线程是不能绑定上的。

```java 
private static void registerSessionHolder(SqlSessionFactory sessionFactory, ExecutorType executorType,
      PersistenceExceptionTranslator exceptionTranslator, SqlSession session) {
        SqlSessionHolder holder = new SqlSessionHolder(session, executorType, exceptionTranslator);
        TransactionSynchronizationManager.bindResource(sessionFactory, holder);
        TransactionSynchronizationManager
            .registerSynchronization(new SqlSessionSynchronization(holder, sessionFactory));
        holder.setSynchronizedWithTransaction(true);
        holder.requested();
  }
```

## 5.2 事务是如何嵌套的?

答案就在 `TransactionAspectSupport#TransactionInfo` 中。一个事务注解对应一个TransactionInfo,如果出现嵌套
就会生成一个事务链。如下图一样。

![](https://img.springlearn.cn/blog/learn_1655110242000.png)

当里层的事务处理完成后会执行清理动作,同时在将第一个的事务在进行恢复跟线程绑定。

```java 
        private void restoreThreadLocalStatus() {
			// Use stack to restore old transaction TransactionInfo.
			// Will be null if none was set.
			transactionInfoHolder.set(this.oldTransactionInfo);
		}
```

## 5.3 事务是如何挂起的?

前面知道每一个 `@Transaction` 注解会对应一个 `TransactionAspectSupport#TransactionInfo`。而事务挂起后,会先跟线程进行解绑。
然后挂起的事务 `SuspendedResourcesHolder` 会被添加在 `TransactionStatus` 中。

**挂起的数据保存在哪里**

```java 
protected final class TransactionInfo {
        // 事务管理器
		@Nullable
		private final PlatformTransactionManager transactionManager;
        // 事务信息
		@Nullable
		private final TransactionAttribute transactionAttribute;
        // 切面点
		private final String joinpointIdentification;
		// DefaultTransactionStatus
		@Nullable
		private TransactionStatus transactionStatus; 
		@Nullable
		private TransactionInfo oldTransactionInfo;
}

public class DefaultTransactionStatus extends AbstractTransactionStatus {
	@Nullable
	private final Object transaction;
	private final boolean newTransaction;
	private final boolean newSynchronization;
	private final boolean readOnly;
	private final boolean debug;
	@Nullable
	private final Object suspendedResources;
}			
```


**如何进行挂起的**

TransactionSynchronization 事务同步器，为了解决事务的传播方式

- suspend 暂定事务,将事务从当前线程上解绑
- resume  恢复事务,将事务从新恢复到当前线程上
- beforeCommit 触发提交事务，执行commit
- beforeCompletion 事务提交后
- afterCommit 提交后
- afterCompletion 完成后调用

SqlSessionSynchronization 也是跟当前线程绑定的
- 位置 `TransactionSynchronizationManager#ThreadLocal<Set<TransactionSynchronization>> synchronizations`

```java  
 // 挂起时候,将SqlSessionHolder与当前线程进行解绑
 @Override
 public void suspend() {
   if (this.holderActive) {
     LOGGER.debug(() -> "Transaction synchronization suspending SqlSession [" + this.holder.getSqlSession() + "]");
     TransactionSynchronizationManager.unbindResource(this.sessionFactory);
   }
 }

 /**
  * 恢复时候重新跟当前线程绑定
  */
 @Override
 public void resume() {
   if (this.holderActive) {
     LOGGER.debug(() -> "Transaction synchronization resuming SqlSession [" + this.holder.getSqlSession() + "]");
     TransactionSynchronizationManager.bindResource(this.sessionFactory, this.holder);
   }
 }
```


## 5.4 传播方式具体实现

下面这段代码就是事务注解的切面处理类，Spring事务的所有逻辑和扩展支持都在这里。

- `TransactionAspectSupport#invokeWithinTransaction`

**首先我们先看整体的逻辑**

1. 获取当切面上的 `@Transaction` 注解信息
2. 根据注解信息找到指定的事务管理器,如果没有执行就使用默认的
3. 生成事务信息 `TransactionInfo` 传播机制,事务挂起都在这个类上
4. 失败执行回滚&成功提交&如果是嵌套事务,从`TransactionInfo` 中将挂起的事务重新跟线程进行绑定

```java {17,30,26,32}
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
			final InvocationCallback invocation) throws Throwable {

		// If the transaction attribute is null, the method is non-transactional.
		TransactionAttributeSource tas = getTransactionAttributeSource();
		// 获取被事务注解标记的事务信息
		final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);
		// 根据事务注解上指定的事务管理器名称,去系统中获取，如果没有就拿系统中默认的事务管理器
		final PlatformTransactionManager tm = determineTransactionManager(txAttr);
		// 切面拦截点: com.alibaba.purchase.domain.replenish.impl.ReplenishDomainWriteServiceImpl.mockSave
		final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);
        // 这里只看关系型数据的的事务逻辑。CallbackPreferringPlatformTransactionManager是具有回调性质的事务管理器,多用于处理自定的事务
		if (txAttr == null || !(tm instanceof CallbackPreferringPlatformTransactionManager)) {
			// Standard transaction demarcation with getTransaction and commit/rollback calls.
			// 获取事务的信息,包含传播方式
			TransactionInfo txInfo = createTransactionIfNecessary(tm, txAttr, joinpointIdentification);
			Object retVal = null;
			try {
				// This is an around advice: Invoke the next interceptor in the chain.
				// This will normally result in a target object being invoked.
				retVal = invocation.proceedWithInvocation();
			}
			catch (Throwable ex) {
				// target invocation exception
				completeTransactionAfterThrowing(txInfo, ex);
				throw ex;
			}
			finally {
				cleanupTransactionInfo(txInfo);
			}
			commitTransactionAfterReturning(txInfo);
			return retVal;
		}
}	
```

**这里只看传播机制吧。AbstractPlatformTransactionManager#handleExistingTransaction**

- TransactionDefinition.PROPAGATION_NEVER 如果存在事务就报错
- TransactionDefinition.PROPAGATION_NOT_SUPPORTED 如果有事务,就挂起(当前事务跟线程解绑)。不使用事务进行执行。
- TransactionDefinition.PROPAGATION_REQUIRES_NEW 当前事务挂起,新开个事务。

```java 
     /**
	 * Create a TransactionStatus for an existing transaction.
	 */
	private TransactionStatus handleExistingTransaction(
			TransactionDefinition definition, Object transaction, boolean debugEnabled)
			throws TransactionException {
        // TransactionDefinition.PROPAGATION_NEVER（总是非事务地执行，如果存在一个活动事务，则抛出异常）就直接阻断报错
		if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {
			throw new IllegalTransactionStateException(
					"Existing transaction found for transaction marked with propagation 'never'");
		}
        // TransactionDefinition.PROPAGATION_NOT_SUPPORTED 总是非事务地执行，并挂起任何存在的事务
		if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NOT_SUPPORTED) {
			if (debugEnabled) {
				logger.debug("Suspending current transaction");
			}
			Object suspendedResources = suspend(transaction);
			boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
			// 数据暂存在TransactionSynchronizationManager#synchronizations同步器中
			return prepareTransactionStatus(
					definition, null, false, newSynchronization, debugEnabled, suspendedResources);
		}
        // 总是开启一个新的事务。如果一个事务已经存在，则将这个存在的事务挂起。
		if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {
			if (debugEnabled) {
				logger.debug("Suspending current transaction, creating new transaction with name [" +
						definition.getName() + "]");
			}
			SuspendedResourcesHolder suspendedResources = suspend(transaction);
			try {
				boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
				DefaultTransactionStatus status = newTransactionStatus(
						definition, transaction, true, newSynchronization, debugEnabled, suspendedResources);
				doBegin(transaction, definition);
				prepareSynchronization(status, definition);
				return status;
			}
			catch (RuntimeException | Error beginEx) {
				resumeAfterBeginException(transaction, suspendedResources, beginEx);
				throw beginEx;
			}
		}
        // 如果有事务存在，则运行在一个嵌套的事务中. 如果没有活动事务则按TransactionDefinition.PROPAGATION_REQUIRED 属性执行
		if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
			if (!isNestedTransactionAllowed()) {
				throw new NestedTransactionNotSupportedException(
						"Transaction manager does not allow nested transactions by default - " +
						"specify 'nestedTransactionAllowed' property with value 'true'");
			}
			if (debugEnabled) {
				logger.debug("Creating nested transaction with name [" + definition.getName() + "]");
			}
			if (useSavepointForNestedTransaction()) {
				// Create savepoint within existing Spring-managed transaction,
				// through the SavepointManager API implemented by TransactionStatus.
				// Usually uses JDBC 3.0 savepoints. Never activates Spring synchronization.
				DefaultTransactionStatus status =
						prepareTransactionStatus(definition, transaction, false, false, debugEnabled, null);
				// 使用当前事务,并增加当前事务的一次引用。		
				status.createAndHoldSavepoint();
				return status;
			}
			else {
				// Nested transaction through nested begin and commit/rollback calls.
				// Usually only for JTA: Spring synchronization might get activated here
				// in case of a pre-existing JTA transaction.
				// 没有新建一个事务
				boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
				DefaultTransactionStatus status = newTransactionStatus(
						definition, transaction, true, newSynchronization, debugEnabled, null);
				doBegin(transaction, definition);
				prepareSynchronization(status, definition);
				return status;
			}
		}

		// Assumably PROPAGATION_SUPPORTS or PROPAGATION_REQUIRED.
		if (debugEnabled) {
			logger.debug("Participating in existing transaction");
		}
		if (isValidateExistingTransaction()) {
			if (definition.getIsolationLevel() != TransactionDefinition.ISOLATION_DEFAULT) {
				Integer currentIsolationLevel = TransactionSynchronizationManager.getCurrentTransactionIsolationLevel();
				if (currentIsolationLevel == null || currentIsolationLevel != definition.getIsolationLevel()) {
					Constants isoConstants = DefaultTransactionDefinition.constants;
					throw new IllegalTransactionStateException("Participating transaction with definition [" +
							definition + "] specifies isolation level which is incompatible with existing transaction: " +
							(currentIsolationLevel != null ?
									isoConstants.toCode(currentIsolationLevel, DefaultTransactionDefinition.PREFIX_ISOLATION) :
									"(unknown)"));
				}
			}
			if (!definition.isReadOnly()) {
				if (TransactionSynchronizationManager.isCurrentTransactionReadOnly()) {
					throw new IllegalTransactionStateException("Participating transaction with definition [" +
							definition + "] is not marked as read-only but existing transaction is");
				}
			}
		}
		// 
		boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
		return prepareTransactionStatus(definition, transaction, false, newSynchronization, debugEnabled, null);
	}
```

## 5.5 嵌套事务如何知道是否要提交

当两个Mapper中使用的是同一个SqlSession,那么会不会第二个事务在执行后,就直接commit了呢,此时第一个事务有一次commit。导致异常呢?

解决方案在这里 `DefaultTransactionStatus`

第二个事务状态中
- newTransaction = false
- newSynchronization = false
![](https://img.springlearn.cn/blog/learn_1655202764000.png)

而下面代码中会做校验,只需要同步时候才会提交事务。

```java 
protected final void triggerBeforeCommit(DefaultTransactionStatus status) {
		if (status.isNewSynchronization()) {
			if (status.isDebug()) {
				logger.trace("Triggering beforeCommit synchronization");
			}
			TransactionSynchronizationUtils.triggerBeforeCommit(status.isReadOnly());
		}
}
```

第一个事务状态中
- newTransaction = true
- newSynchronization = true
才会真正的去执行。
![](https://img.springlearn.cn/blog/learn_1655203089000.png)



## 5.6 这样设计是否线程安全

线程安全只有在多线程环境下才会出现。那么这里一定会有多线程问题。而事务是跟线程进行绑定的,所以这里虽然有多线程但是不会有线程安全问题。

但是这里我们看源码线程绑定时候使用的ThreadLocal,所以你在线程中创建子线程或者是线程中使用线程池,这里的事务都不会共享的。
