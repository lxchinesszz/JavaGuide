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
title: SpringBoot脚手架【web版本】
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)


[Gitbub](https://github.com/lxchinesszz/pangu-plus)

## 前言

### 背景

现状1:  乱   同部门项目结构定义各自为战, 没有一个标准化的项目结构
现状2: 繁    项目定义没有技术难度，且都是这种重复工作劳动, 感觉繁不胜繁

“删繁就简三秋树，领异标新二月花。”  删繁就简，开辟新路

### 价值
提高生产效率  & 统一标准规范 & 基于标准规范提供通用能力 & 提高影响力

![](https://img.springlearn.cn/blog/8a43d49b4e8c81c73d781ba427d23179.png)

## 一、Spring的设计思路

### 1.1 自动装箱
只需要引入<groupId>io.spring.initializr</groupId>相关配置，就具备的脚手架的能力。看起来挺简单的。
但是, 等等。Spring只提供单一模块的脚手架应用, 这显然不服务我们实际生产的项目结构。要深度定制化开发才能符合我们项目生产结构。
既然如此我们为啥还要用Spring的框架呢? 两个原因。
1. Spring脚手架提供了一个标准的api, 没办法,先入为主，除非美国说要制裁我们。
2. Spring的模板的操作提供了面向对象的编程方式，比如我们修改Maven的POM和依赖的信息, 都有面向对象的API方式调用。


## 二、 一个实际的构建流程是什么样的?

https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=2.5.2.RELEASE&baseDir=demo&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.demo&packaging=jar&javaVersion=11&dependencies=session

依赖中只引入了一个Session。

### 2.1 构建的原信息来自哪里

先回答问题,来自于application.yml。这里你可以配置要支持的java版本, Language类型等等
简单点你在页面看到的都是配置的。



### 2.2 Spring如何接受到信息
Spring提供了一个抽象接口, 和一个限定反省类。`ProjectRequest ` 。 没错你想的没错，页面看到的配置信息都在ProjectRequest 有对应的字段来接受。

```
public abstract class ProjectGenerationController<R extends ProjectRequest>{}
```
实现抽象类，然后注册成一个Bean。 那么就会自动的替换了系统本来已经提供的默认实现。实现原理就是@ConditionalOnMissingBean

### 2.3 配置信息如何最终被解析

前面的请求最中会被转发到 ProjectGenerationInvoker 来代为处理，简单来说就是我们的业务Service。
关键类来了，请注意:  ProjectDescription。
这个类会被全局使用, 包含了项目创建的所有信息,包括依赖信息等。那这个时候问题就来了，前端关于依赖只传了一个session, 我们是如何知道这个session所对应的groupId等坐标信息的呢? 看这里
ProjectRequestToDescriptionConverter, 废话不多数，直接看代码。主要观察注释。自己思考。

```  
// 一个请求信息, 一个metadata，这一看就是所有的配置信息
public void convert(ProjectRequest request, MutableProjectDescription description, InitializrMetadata metadata) {
   validate(request, metadata);
   Version platformVersion = getPlatformVersion(request, metadata);
   // 根据请求信息去搜索依赖，根据id->session 就找到 这个session所对应的坐标。
   List<Dependency> resolvedDependencies = getResolvedDependencies(request, platformVersion, metadata);
   validateDependencyRange(platformVersion, resolvedDependencies);

   description.setApplicationName(request.getApplicationName());
   description.setArtifactId(request.getArtifactId());
   ...
   resolvedDependencies.forEach((dependency) -> description.addDependency(dependency.getId(),
         MetadataBuildItemMapper.toDependency(dependency)));
}
```

### 2.4 如果构建Maven的模块呢?

`ProjectAssetGenerator<T> projectAssetGenerator`。经过重重的信息添加, 最终到这里了，这里是我们要进行二次开发的严重地区。

####  2.4.1 先看下原始代码

这里会构建一个单一的模块信息, 这里大家有没有发现点什么?

- ProjectDescription 怎么变成了一个Bean ？
- ProjectContributor 也是一个Bean？
- 系统提供了那些ProjectContributor，都是干什么的? 后面我们要基于这个扩展

```
  public Path generate(ProjectGenerationContext context) throws IOException {
      ProjectDescription description = context.getBean(ProjectDescription.class);
      Path projectRoot = resolveProjectDirectoryFactory(context).createProjectDirectory(description);
      Path projectDirectory = initializerProjectDirectory(projectRoot, description);
      List<ProjectContributor> contributors = context.getBeanProvider(ProjectContributor.class).orderedStream()
      .collect(Collectors.toList());
      for (ProjectContributor contributor : contributors) {
      contributor.contribute(projectDirectory);
      }
      return projectRoot;
  }

```

问题解答:

1. ProjectDescription 怎么变成了一个Bean
   Spring会基于每次的请求,生成ProjectDescription。同时将其注册成为一个Bean。(可以自己去找)
2. ProjectContributor 也是一个Bean？
   ProjectContributor是提供的一个扩展点, 只有一个方法就是一个目录文件, 由上代码可知,这个目录就是项目目录。 Eg: ascm目录。 (所以如果我们要扩展这里就不能在用根目录了)

`void contribute(Path projectRoot) throws IOException;`

3. 系统提供了那些ProjectContributor。
1. MainSourceCodeCustomizer 看名字就是生成Spring引导类的扩展
2. TestSourceCodeProjectContributor  看名字就是生成Spring测试引导类的扩展
3. WebFoldersContributor 看名字就是生成web相关目录, 如果发现依赖中有web就...
4. ApplicationPropertiesContributor 看名字就是生成配置文件
5. HelpDocumentProjectContributor 看名字就是生成帮助文档
6. MavenBuildProjectContributor 看名字好像看不出来，其实就是生成pom文件
7. MavenWrapperContributor 看名字好像也看不出来，其实就是生成mvnw.cmd 这个没用的东西
8. GitIgnoreContributor  看名字 就是生成忽略的目录

不展开了，代码非常简单。（这句话你别信, 流程很简单，但是细节很丰富, 字越少事越大）

```
// 流程代码, 可以看到就是实现了MainSourceCodeCustomizer。就是填充启动类代码的代码。
class ServletInitializerContributor implements
      MainSourceCodeCustomizer<TypeDeclaration, CompilationUnit<TypeDeclaration>, SourceCode<TypeDeclaration, CompilationUnit<TypeDeclaration>>> {

 
   @Override
   public void customize(SourceCode<TypeDeclaration, CompilationUnit<TypeDeclaration>> sourceCode) {
      CompilationUnit<TypeDeclaration> compilationUnit = sourceCode.createCompilationUnit(this.packageName,
            "ServletInitializer");
      TypeDeclaration servletInitializer = compilationUnit.createTypeDeclaration("ServletInitializer");
      servletInitializer.extend(this.initializerClassName);
      customizeServletInitializer(servletInitializer);
   }

   @SuppressWarnings("unchecked")
   private void customizeServletInitializer(TypeDeclaration servletInitializer) {
      List<ServletInitializerCustomizer<?>> customizers = this.servletInitializerCustomizers.orderedStream()
            .collect(Collectors.toList());
      LambdaSafe.callbacks(ServletInitializerCustomizer.class, customizers, servletInitializer)
            .invoke((customizer) -> customizer.customize(servletInitializer));
   }

}
```

细节代码，可以看到是面向对象的编程方式。我们不需要使用模板来自己写了。

```
@Bean
ServletInitializerCustomizer<JavaTypeDeclaration> javaServletInitializerCustomizer(
      ProjectDescription description) {
   return (typeDeclaration) -> {
      typeDeclaration.modifiers(Modifier.PUBLIC);
      JavaMethodDeclaration configure = JavaMethodDeclaration.method("configure")
            .modifiers(Modifier.PROTECTED)
            .returning("org.springframework.boot.builder.SpringApplicationBuilder")
            .parameters(new Parameter("org.springframework.boot.builder.SpringApplicationBuilder",
                  "application"))
            .body(new JavaReturnStatement(new JavaMethodInvocation("application", "sources",
                  description.getApplicationName() + ".class")));
      configure.annotate(Annotation.name("java.lang.Override"));
      typeDeclaration.addMethodDeclaration(configure);
   };
}
```

但是从中我们学习到的知识是，对于多模块核心模块我们会使用到

- MainSourceCodeCustomizer 看名字就是生成Spring引导类的扩展
- TestSourceCodeProjectContributor  看名字就是生成Spring测试引导类的扩展
- WebFoldersContributor 看名字就是生成web相关目录, 如果发现依赖中有web就...
- ApplicationPropertiesContributor 看名字就是生成配置文件
  对于父目录
- HelpDocumentProjectContributor 这里要替换成我们自己的模板要进行二次开发
- MavenBuildProjectContributor 二次开发，不能用系统提供的Maven信息., 因为系统提供的是单模块的pom
- MavenWrapperContributor 感觉没啥用
- GitIgnoreContributor  改动比较小，不改也没关系

#### 2.4.2 改动后的代码，支持多模块

MavenModuleFactory 将单一模块转换成多模块，并为每个模块生成一个执行方法。
其实就是将原来的代码, 封装到每个Module里面，然后填充上自己的扩展信息。

```  
public Path generate(ProjectGenerationContext context) throws IOException {
    ProjectDescription description = context.getBean(ProjectDescription.class);
    Path projectRoot = resolveProjectDirectoryFactory(context).createProjectDirectory(description);
    // 1. 先创建项目根目录
    Path projectDirectory = initializerProjectDirectory(projectRoot, description);
    // 2. 构建依赖关系
    MavenModuleFactory mavenModuleFactory = new MavenModuleFactory(context, projectDirectory);
    List<ModuleGeneratorExecute> modules = mavenModuleFactory.getModule();
    for (ModuleGeneratorExecute module : modules) {
        module.generator();
    }
    return projectRoot;
}
```

抽象出多模块的实体。

![](https://img.springlearn.cn/blog/45de2b1a0567e0f3a5c6aa872544a773.png)

Module和Module是关联关系, 所以看到Module和AbstractModuleTemplate直接由一个组合的虚线关系。

![](https://img.springlearn.cn/blog/3df53e4f6f20506c089010a357dc17ac.png)

### 2.5 文件生成

到这里文件已经生成了，已经在服务端生成了一个具有Maven结构的项目。但这个时候他是在服务起的
某个随机的目录下面的，就需要在将其转换成二进制数据, 传给前端。到此流程结束。

## 三、二次开发提供的扩展点

### 3.1 为某个模块定制POM信息。
将用户选择的的依赖信息, 转移到具体某个Module上。具体要转移什么由你决定。

```  
public interface MavenModuleBuildCustomizer {

    /**
     * 初始时候,moduleMavenBuild是没有任何信息的,需要开发者
     * 自定义的将parentMavenBuild的信息,同步到parentMavenBuild
     *
     * @param parentMavenBuild 全局的maven配置信息
     * @param moduleMavenBuild 每个module配置
     */
    void customize(MavenBuild parentMavenBuild, MavenBuild moduleMavenBuild);
}
```
### 3.2 为某个模块创建目录

可以参考 `MainSourceCodeCustomizer ` 的实现方案，如果用面向对象的方式生成代码，也可以参照
GitIgnoreContributor的方式, 直接通过模板文件来生成文件。

```  
public interface ProjectContributor extends Ordered {

   /**
    * Contribute additional resources to the project in the specified root directory.
    * @param projectRoot the root directory of the project
    * @throws IOException if contributing a resource failed
    */
   void contribute(Path projectRoot) throws IOException;

   @Override
   default int getOrder() {
      return 0;
   }

}
```

## 四、前端定制

![](https://img.springlearn.cn/blog/49e9c4466a948891f6bc24d1909ce05d.png)


### 4.1 原数据信息
- Spring的版本信息和依赖等相关信息, 可以通过配置方式来解决
- 代码配置，供应链可以共建,  需要自己去开发需要往每个模块要写的内容。

## 五、扩展点

对Module进行扩展,可以往Module的pom文件中添加信息
![](https://img.springlearn.cn/blog/26ea572ed526229b3c14b73f6ffc7343.png)
对Module进行扩展,可以向指定的包中添加信息

![](https://img.springlearn.cn/blog/f44e44f2678ec2e5745996ee8691b794.png)
