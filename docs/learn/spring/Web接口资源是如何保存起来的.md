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
title: Web接口资源是如何保存起来的?
category: SpringBoot
---


## 前言

在我们使用 `SpringBoot` 开发中,我们定义一接口是下面这样的

```
@RestController
public class UserController{
    
    @GetMapping( name = "/getUserName")
    public String getUserName(){
        return "Hello World";
    }
}
```

这时候我们思考一个问题,我们在浏览器上只输入了一个URL地址,怎么就能访问到这个接口的呢？于是乎就引出了
今天我们要讨论的话题。Spring中的Web接口资源是如何保存起来的?


## 一、Spring中的Web接口资源是如何保存起来的?

在我们学习之前我们可以先自己来进行思考一下。处理逻辑是什么样的？

- Spring容器解析 `@RequestMapping` 注解。当然这个注解又派生了其他的注解比如。

```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.POST)
public @interface PostMapping {}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.PUT)
public @interface PutMapping {}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.GET)
public @interface GetMapping {}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.DELETE)
public @interface DeleteMapping {}
```

- 我们猜测Spring源码中一定会对`@RestController` 和 `@Controller`标记的类,里面的每个
  Method进行处理,判断是否包含了上面的注解。注解那么多Spring肯定不会这样一个一个去处理。我们可以看到
  上面的注解都使用了`@AliasFor`注解。其中奥妙就在这里。看下面例子代码。
- 我们猜测Spring肯定对这些Method判断是否有`@RequestMapping`有注解。

### 1. @AliasFor使用

```
@RestController
public class PostController {

    @ApiOperation(value = "查询Bbs所有文章")
    @PostMapping(value = "/query/bbs/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public Result<PostAllResponse> queryBbsPostAll(@RequestBody PostAllSelectRequest postAllSelectRequest) {
        return postBiz.queryBbsPostAll(postAllSelectRequest);
    }

    public static void main(String[] args) {
        Method queryBbsPostAll = ClassUtils.getMethod(PostController.class, "queryBbsPostAll",PostAllSelectRequest.class);
        PostMapping annotation = AnnotationUtils.findAnnotation(queryBbsPostAll, PostMapping.class);
        ///query/bbs/posts
        System.out.println(StringUtils.arrayToCommaDelimitedString(annotation.value()));
        //application/json
        System.out.println(StringUtils.arrayToCommaDelimitedString(annotation.produces()));
        //是否包含RequestMapping: true
        System.out.println("是否包含RequestMapping: "+AnnotatedElementUtils.hasAnnotation(queryBbsPostAll,RequestMapping.class));

        RequestMapping mergedAnnotation = AnnotatedElementUtils.getMergedAnnotation(queryBbsPostAll, RequestMapping.class);
        ///query/bbs/posts
        System.out.println(StringUtils.arrayToCommaDelimitedString(mergedAnnotation.value()));
    }
}

```

可以看到只要使用下面代码就能把被`@PostMapping`等等的注解都涵盖了。

```
System.out.println("是否包含RequestMapping: "+AnnotatedElementUtils.hasAnnotation(queryBbsPostAll,RequestMapping.class));
RequestMapping mergedAnnotation = AnnotatedElementUtils.getMergedAnnotation(queryBbsPostAll, RequestMapping.class);
```

### 2. 解析请求Method

`AbstractHandlerMethodMapping` 实现 `InitializingBean`。在当前 `Bean`初始化时候会执行

`afterPropertiesSet -> initHandlerMethods`

从这里开始解析Web资源类的信息。请小伙伴们看下面的截图,截图中源码已经把类名也截上了,方便小伙伴们自己在根据截图看一遍源码。

```
public abstract class AbstractHandlerMethodMapping<T> extends AbstractHandlerMapping implements InitializingBean {

    @Override
    public void afterPropertiesSet() {
        initHandlerMethods();
    }
    
    /**
	 * Scan beans in the ApplicationContext, detect and register handler methods.
	 * @see #getCandidateBeanNames()
	 * @see #processCandidateBean
	 * @see #handlerMethodsInitialized
	 */
    protected void initHandlerMethods() {
        for (String beanName : getCandidateBeanNames()) {
            if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
                processCandidateBean(beanName);
            }
        }
        handlerMethodsInitialized(getHandlerMethods());
    }
}
```

**RequestMappingHandlerMapping解析Method上的RequestMapping信息**

![](https://img.springlearn.cn/blog/learn_1596563456000.png)

isHandler 方法判断是否是web资源类。 当一个类被标记了 `@Controller 或者@RequestMapping`。 注意 `@RestController` 是`@Controller`的派生类。所以这里只用判断 `@Controller 或者@RequestMapping`就行了。

![](https://img.springlearn.cn/blog/learn_1596563605000.png)

detectHandlerMethods方法就是真正开始解析Method的逻辑。通过解析Method上的 `@RequestMapping`或者其他派生的注解。生成请求信息。
注意这个请求信息里面也是有很多逻辑的不过不是本篇讨论的重点,就不说了。稍微提一下。根据规则来匹配url逻辑就在这里面。

![](https://img.springlearn.cn/blog/learn_1596563872000.png)

这里我们能看到源码里拿到了Method并拿到了执行这个Method的实例Bean。在这里封装成了HandlerMethod并注册到了MappingRegistry中。
![](https://img.springlearn.cn/blog/learn_1596564039000.png)

在注册的过程中把RequestMapping中的路径信息同事也放到一个urlLookup中。key是url,value是Mapping信息。
![](https://img.springlearn.cn/blog/learn_1596564246000.png)

到这里其实我们就把本篇的议题就说明清楚了。下面我们在看下SpringWeb是如何将http请求信息路由到具体的HandlerMethod的吧。

### 3. 最后串一下流程

看了前面的截图,我们知道Spring是如何把这些Web资源信息给保存起来的了。然后就看是`DispatcherServlet`的逻辑了。

首先`DispatcherServlet` 是一个Servlet。Servlet相信大家都都知道就不重点说原理。 我们直接看
`doService` -> `doDispatch` 方法

![](https://img.springlearn.cn/blog/learn_1596564523000.png)

根据请求路径,找到从Mapping信息,然后根据Mapping信息匹配到具体的HandlerMethod。 ok本篇内容就到这里。谢谢大家。
![](https://img.springlearn.cn/blog/learn_1596565589000.png)
![](https://img.springlearn.cn/blog/learn_1596564759000.png)
