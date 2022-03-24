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
title: maven-surefire-plugin
---

> maven-surefire-plugin Surefire 插件在test构建生命周期阶段用于执行应用程序的单元测试。

![](https://maven.apache.org/images/maventxt_logo_200.gif)

[maven-surefire-plugin官网](https://maven.apache.org/surefire/maven-surefire-plugin/index.html)


## 一、介绍

如果你执行过mvn test或者执行其他maven命令时跑了测试用例，你就已经用过maven-surefire-plugin了。
maven-surefire-plugin是maven里执行测试用例的插件，不显示配置就会用默认配置。
这个插件的surefire:test命令会默认绑定maven执行的test阶段。

如果你自己声明了，那么可以指定自己的版本，并且可以配置自定义的参数。

## 二、实践

### 2.1 用法

```
 <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>3.0.0-M5</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
```

### 2.2 使用方法

`mvn test`

## 三、源码分析

### 3.1 学习目标

::: info
框架整体比较复杂，但是对于我们有学习价值的东西不多，我们没必要太深入研究。在此只提几个关键的知识点学习。
:::

1. maven-surefire-plugin的常用参数及作用
2. maven-surefire-plugin实现单测的原理

### 3.2 学习搭建环境

```xml
    <!-- 先声明插件版本 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <!-- JUnit 5 requires Surefire version 2.22.0 or higher -->
                <version>2.22.0</version>
            </plugin>
        </plugins>
    </build>
    <!-- 然后引入依赖,方便debug跟进源码-->
      <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.13.2</version>
          <scope>test</scope>
      </dependency>
      <dependency>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>3.0.0-M5</version>
      </dependency>

      <dependency>
          <groupId>org.apache.maven</groupId>
          <artifactId>maven-core</artifactId>
          <version>3.8.4</version>
      </dependency>

      <dependency>
          <groupId>org.apache.maven.surefire</groupId>
          <artifactId>surefire-junit4</artifactId>
          <version>3.0.0-M5</version>
      </dependency>

      <dependency>
          <groupId>org.apache.maven</groupId>
          <artifactId>maven-plugin-api</artifactId>
          <version>${dep.maven-api.version}</version>
      </dependency>
      <dependency>
          <groupId>org.apache.maven</groupId>
          <artifactId>maven-model</artifactId>
          <version>${dep.maven-api.version}</version>
      </dependency>
      <dependency>
          <groupId>org.apache.maven.plugin-tools</groupId>
          <artifactId>maven-plugin-annotations</artifactId>
          <version>${dep.maven-api.version}</version>
      </dependency>
      <dependency>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-plugin-plugin</artifactId>
          <version>${dep.maven-api.version}</version>
      </dependency>
```

### 3.3 找到插件入口

![](https://img.springlearn.cn/blog/learn_1645113430000.png)

前面通过学习知道Mojo是运行的核心类,而SurefirePlugin就是Mojo的子类。
由此可知,如果要学习这个 `maven-surefire-plugin`，入口就是在SurefirePlugin类。


![](https://img.springlearn.cn/blog/learn_1644857307000.png)


![](https://img.springlearn.cn/blog/learn_1645114616000.png)


## 四、 带着问题来学习


### 4.1 常用的参数都有那些

大多数为不常用的

|是否常用|参数名|使用方法|解释|
|:---|:---|:---:|:---:|
|常用|skipTests|-D,或者xml配置标签|用于跳过单测|
|常用|maven.test.skip.exec|-D,或者xml配置标签|用于跳过单测|
|常用|maven.test.skip|-D,或者xml配置标签|用于跳过单测|
|不常用|testClassesDirectory|xml配置标签|指定测试模块目录编译后目录|
|不常用|maven.test.dependency.excludes|-D,或者xml配置标签|要排除的依赖,格式:groupId:artifactId|
|不常用|maven.test.additionalClasspath|-D,或者xml配置标签|追加classpath|
|不常用|project.build.testSourceDirectory|xml配置标签|指定测试模块目录源码目录|
|不常用|excludes|xml配置|指定规则的类不需要被单测，eg: **/*Test.java|
|不常用|surefire.reportNameSuffix|-D,或者xml配置标签|test报表后缀|
|不常用|maven.test.redirectTestOutputToFile|-D,或者xml配置标签|运行的单侧输出重定向到report目录中|
|不常用|failIfNoTests|-D,或者xml配置标签|如果没有单测就报错|
|不常用|forkMode|-D,或者xml配置标签|运行模式|
|不常用|jvm|-D,或者xml配置标签|指定jvm目录,如果不指定会读取系统|
|不常用|argLine|-D,或者xml配置标签|Jvm运行参数|
|不常用|threadCount|-D,或者xml配置标签|线程数|
|不常用|forkCount|-D,或者xml配置标签|指定启用多少个vm,1.5C 以数字结尾,数字乘以cpu核心数|
|不常用|reuseForks|-D,或者xml配置标签|是否可重新使用forks进程|
|不常用|disableXmlReport|-D,或者xml配置标签|禁用xml报告|
|不常用|enableassertions|-D,或者xml配置标签|启用断言assert语句|



**forkMode 可设置值有 “never”， “once”， “always” 和 “pertest”。**

- pretest： 每一个测试创建一个新进程，为每个测试创建新的JVM是单独测试的最彻底方式，但也是最慢的，不适合hudson上持续回归。
- once：在一个进程中进行所有测试。once为默认设置，在Hudson上持续回归时建议使用默认设置。
- always：在一个进程中并行的运行脚本，Junit4.7以上版本才可以使用，surefire的版本要在2.6以上提供这个功能，


### 4.2 知识点

``` 
// 大于等于2.0.0，小于2.1.2
VersionRange range = VersionRange.createFromVersionSpec("[2.0.0,2.1.2)");
System.out.println(range.containsVersion(new DefaultArtifactVersion("1.0")));
System.out.println(range.containsVersion(new DefaultArtifactVersion("2.0.0")));
System.out.println(range.containsVersion(new DefaultArtifactVersion("2.1.1")));
System.out.println(range.containsVersion(new DefaultArtifactVersion("2.1.2")));
System.out.println("------------");
VersionRange range2 = VersionRange.createFromVersionSpec("[2.0.0-M1SN,2.1.2)");
System.out.println(range2.containsVersion(new DefaultArtifactVersion("2.1.1-M2")));
```
