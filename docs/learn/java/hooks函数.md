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
title: JVM钩子hooks函数
category: Java进阶
---


![](https://img.springlearn.cn/blog/learn_1589383784000.png)

**作者**: 西魏陶渊明
**博客**: [https://blog.springlearn.cn/](https://blog.springlearn.cn/)

::: tip 西魏陶渊明
莫笑少年江湖梦，谁不少年梦江湖
:::

什么是钩子函数,在学习钩子函数之前,小编先提一个问题。

**请问在Spring中,如果JVM异常终止,Spring是如何保证会释放掉占用的资源,比如说数据库连接等资源呢?**


钩子函数非常简单,简单到小编只用摘抄一段Spring代码即可。走你,现在开始。


# 问题

`Spring` 容器中 `Bean` 在什么时候执行销毁方法? 

我们知道在Spring中定义销毁方法有两种方式

1. 实现 `DisposableBean` 的 `destroy` 方法。
2. 使用 `@PreDestroy` 注解修饰方法

```
@Component
public class DataCollectBean implements DisposableBean {

    /**
     * 第一种方法实现 DisposableBean#destroy方法
     *
     * @throws Exception 异常
     */
    @Override
    public void destroy() throws Exception {
        System.err.println("执行销毁方法");
    }

    /**
     * 第二种方法使用PreDestroy注解声明销毁方法
     */
    @PreDestroy
    public void customerDestroy() {
        System.err.println("执行自定义销毁方法");
    }


}

```


## 那么在什么时候执行销毁方法?

![](https://img.springlearn.cn/blog/learn_1589471346000.png)

1. 主动执行销毁bean

```
    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(DemoApplication.class, args);
        DataCollectBean bean = run.getBean(DataCollectBean.class);
        //1. 主动销毁bean
        run.getBeanFactory().destroyBean(bean);
    }
```

2. JVM关闭时候自动执行销毁方法。

这里就要用到钩子函数了, `Spring` 的钩子函数在 `AbstractApplicationContext#shutdownHook属性`

如果我们是SpringBoot项目我们看到在SpringApplication启动时候会注册一个钩子函数

![](https://img.springlearn.cn/blog/learn_1589473259000.png)

# 如何定义钩子函数?

简直太简单了，没有任何学习成本。一行代码就能搞定。

```
public class HooksTester {
    public static void main(String[] args) {
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("钩子函数执行");
            }
        }));
        //当主动关闭应用
        while (true);
    }
}
```

![](https://img.springlearn.cn/blog/learn_1589471574000.png)
# 触发钩子函数的场景

只要不是机器断电，强制kill -9 强制杀进程，都会触发。

![](https://img.springlearn.cn/blog/learn_1589473502000.png)
    
# 钩子函数能做什么？

![](https://img.springlearn.cn/blog/learn_1589383970000.png)

正如上图所示优雅停机,在项目将要关闭时候,主动释放程序占用的资源信息,释放db连接池的连接等其他占用的资源信息。
如果我们是 `Spring` 项目其实我们不用自己定义钩子函数,我们只要使用Spring提供给我们的销毁方法即可。因为
Spring定义的钩子函数中会去执行, `DisposableBean.destory()` 和被 `PreDestroy` 修饰的方法。

我们看下源码

![](https://img.springlearn.cn/blog/learn_1589472185000.png)

```
protected void doClose() {
		// Check whether an actual close attempt is necessary...
		if (this.active.get() && this.closed.compareAndSet(false, true)) {
			if (logger.isDebugEnabled()) {
				logger.debug("Closing " + this);
			}

			LiveBeansView.unregisterApplicationContext(this);

			try {
				// Publish shutdown event.
				publishEvent(new ContextClosedEvent(this));
			}
			catch (Throwable ex) {
				logger.warn("Exception thrown from ApplicationListener handling ContextClosedEvent", ex);
			}

			// Stop all Lifecycle beans, to avoid delays during individual destruction.
			if (this.lifecycleProcessor != null) {
				try {
					this.lifecycleProcessor.onClose();
				}
				catch (Throwable ex) {
					logger.warn("Exception thrown from LifecycleProcessor on context close", ex);
				}
			}

			// Destroy all cached singletons in the context's BeanFactory.
			destroyBeans();

			// Close the state of this context itself.
			closeBeanFactory();

			// Let subclasses do some final clean-up if they wish...
			onClose();

			// Reset local application listeners to pre-refresh state.
			if (this.earlyApplicationListeners != null) {
				this.applicationListeners.clear();
				this.applicationListeners.addAll(this.earlyApplicationListeners);
			}

			// Switch to inactive.
			this.active.set(false);
		}
	}
```

可以看到：doClose()方法会执行bean的destroy()，也会执行SmartLifeCycle的stop()方法，我们就可以通过重写这些方法来实现对象的关闭，生命周期的管理，实现平滑shutdown


![](https://i03piccdn.sogoucdn.com/7eac32473373b70a)

最后求关注,求订阅,谢谢你的阅读!


![](https://img.springlearn.cn/blog/learn_1589360371000.png)
