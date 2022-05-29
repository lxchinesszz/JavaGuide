---
breadcrumb: false
navbar: true
sidebar: auto
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: 编译卡点插件
password: 111
icon: zuanshi
category: Maven
---

<Pwd/>

小编问一个问题,你们依赖的项目在发布线上环境时候,依赖中是否还会有快照版本呢?
如果有，那你就危险了,因为是快照版本,随时都可以进行覆盖,如果覆盖了之前的版本。很有可能你的项目有很大的风险。
举一个例子,项目A组使用了项目B组提供的一个依赖。开发时候因为都是使用快照包。但是上线B向A提供了一个RELEASE包。
但是A项目组上线时候,忘记使用RELEASE包了。代码运行也完全没问题。
但是突然有一天项目B组将之前的快照包给覆盖了,并且删除了里面的一些代码。这个时候项目A的项目,可能就启动不起来了。
因为他依赖的快照包被覆盖了。


那么如何解决上面的问题呢? 本篇我们就利用我们之前学的知识来开发一个,版本检查的工具。在每次项目编译的时候去进行检查。

通过不同环境，执行不同的参数来对依赖版本进行校验。


## 一、开发思路

思路比较简单,在maven 打包时候,通过添加参数的方式,对打包的依赖进行正则分析。当发现有被匹配到的版本。就收集起来。
最后进行阻断,不允许打包通过。

## 二、开始开发

## 2.1 声明一个Mojo插件

本文我们都基于Maven3进行插件开发。使用注解方式进行声明。

```java 
@Mojo(name = "versionCheck", defaultPhase = LifecyclePhase.PACKAGE, threadSafe = true, requiresDependencyCollection = ResolutionScope.TEST)
@Execute(phase = LifecyclePhase.PACKAGE)
public class ArtifactVersionCheckMojo extends AbstractMojo {

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
    
    }
}

```

## 2.2 添加拦截规则

拦击规则我们让用户自己进行配置。

```java 
    @Parameter(property = "versionCheckRegular")
    private String[] assertDependencyRegular;
```

用户可以通过set方式注入

```xml 
              <plugin>
                <groupId>com.github.lxchinesszz</groupId>
                <artifactId>learn-maven-plugin</artifactId>
                <version>1.0.1-SNAPSHOT</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>versionCheck</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    // 使用标签就行配置
                    <assertDependencyRegular>
                        <param>.*SNAPSHOT</param>
                    </assertDependencyRegular>
                </configuration>
            </plugin>
```

同时也可以使用-D在命令行进行操作。

`mvn package -DversionCheckRegular=.*SNAPSHOT`

## 2.3 依赖分析

这里为了避免你的maven版本过低建议你指定版本。

```xml
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-core</artifactId>
            <version>3.8.5</version>
        </dependency>
```

我们使用分析工具. DependencyGraphBuilder

```java 
    ProjectBuildingRequest buildingRequest = new DefaultProjectBuildingRequest(session.getProjectBuildingRequest());
    buildingRequest.setProject(project);
    DependencyNode rootNode = dependencyGraphBuilder.buildDependencyGraph(buildingRequest, new ScopeArtifactFilter("test"));
```


## 三、使用演示

## 3.1 安装插件

```xml 
    <build>
        <plugins>
            <plugin>
                <groupId>com.github.lxchinesszz</groupId>
                <artifactId>learn-maven-plugin</artifactId>
                <version>1.0.1-SNAPSHOT</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>versionCheck</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <assertDependencyRegular>
                        <param>.*SNAPSHOT</param>
                    </assertDependencyRegular>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

## 3.2 执行打包命令

- 因为我们绑定的是package所以我们直接执行插件

`mvn com.github.lxchinesszz:learn-maven-plugin:1.0.1-SNAPSHOT:versionCheck`

- 或者我们直接执行打包命令,同样会触发插件执行

`mvn package -DversionCheckRegular=.*SNAPSHOT`


![](https://img.springlearn.cn/blog/learn_1651591415000.png)


