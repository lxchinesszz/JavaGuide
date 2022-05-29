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
title: Maven基础入门
category: Maven
---


> Maven 翻译为"专家"、"内行"，是 Apache 下的一个纯 Java 开发的开源项目。基于项目对象模型（缩写：POM）概念，Maven利用一个中央信息片断能管理一个项目的构建、报告和文档等步骤。
Maven 是一个项目管理工具，可以对 Java 项目进行构建、依赖管理。
Maven 也可被用于构建和管理各种项目，例如 C#，Ruby，Scala 和其他语言编写的项目。Maven 曾是 Jakarta 项目的子项目，现为由 Apache 软件基金会主持的独立 Apache 项目。

## Maven 默认插件

已知 Maven 使用 plugin 来执行实际操作的，在默认情况下，Maven 会绑定以下几个插件来完成基本操作。

| plugin                 | function                                              | life cycle phase        |
| ---------------------- | ----------------------------------------------------- | ----------------------- |
| maven-clean-plugin     | 清理上一次执行创建的目标文件                          | clean                   |
| maven-resources-plugin | 处理源资源文件和测试资源文件                          | resources,testResources |
| maven-compiler-plugin  | 编译源文件和测试源文件                                | compile,testCompile     |
| maven-surefire-plugin  | 执行测试文件                                          | test                    |
| maven-jar-plugin       | 创建 jar                                              | jar                     |
| maven-install-plugin   | 安装 jar，将创建生成的 jar 拷贝到 .m2/repository 下面 | install                 |
| maven-deploy-plugin    | 发布 jar                                              | deploy                  |

如果针对各个 plugin 有特殊配置的话，需要显示指定 plugin 和 属性配置。


## Maven 生命周期

> 官网地址: http://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html

下面列出了default,clean和site生命周期的所有构建阶段，它们按照指定的时间点之前的顺序执行。

`mvn test -X` 查看debug日志

```
[DEBUG] Lifecycle clean -> [pre-clean, clean, post-clean]
[DEBUG] Lifecycle site -> [pre-site, site, post-site, site-deploy]
[DEBUG] Lifecycle default -> [validate, initialize, generate-sources, process-sources, generate-resources, process-resources, compile, process-classes, generate-test-sources, process-test-sources, generate-test-resources, process-test-resources, test-compile, process-test-classes, test, prepare-package, package, pre-integration-test, integration-test, post-integration-test, verify, install, deploy]
```

### default生命周期

| 阶段                      | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `validate`                | 验证项目是否正确并且所有必要的信息都可用。                   |
| `initialize`              | 初始化构建状态，例如设置属性或创建目录。                     |
| `generate-sources`        | 生成包含在编译中的任何源代码。                               |
| `process-sources`         | 处理源代码，例如过滤任何值。                                 |
| `generate-resources`      | 生成包含在包中的资源。                                       |
| `process-resources`       | 将资源复制并处理到目标目录中，准备打包。                     |
| `compile`                 | 编译项目的源代码。                                           |
| `process-classes`         | 对编译生成的文件进行后处理，例如对 Java 类进行字节码增强。   |
| `generate-test-sources`   | 生成任何测试源代码以包含在编译中。                           |
| `process-test-sources`    | 处理测试源代码，例如过滤任何值。                             |
| `generate-test-resources` | 创建用于测试的资源。                                         |
| `process-test-resources`  | 将资源复制并处理到测试目标目录中。                           |
| `test-compile`            | 将测试源代码编译到测试目标目录中                             |
| `process-test-classes`    | 对测试编译生成的文件进行后处理，例如对 Java 类进行字节码增强。 |
| `test`                    | 使用合适的单元测试框架运行测试。这些测试不应该要求打包或部署代码。 |
| `prepare-package`         | 在实际包装之前执行准备包装所需的任何操作。这通常会导致包的解压缩、处理版本。 |
| `package`                 | 获取编译后的代码并将其打包为其可分发格式，例如 JAR。         |
| `pre-integration-test`    | 在执行集成测试之前执行所需的操作。这可能涉及诸如设置所需环境之类的事情。 |
| `integration-test`        | 如有必要，处理并部署包到可以运行集成测试的环境中。           |
| `post-integration-test`   | 执行集成测试后执行所需的操作。这可能包括清理环境。           |
| `verify`                  | 运行任何检查以验证包裹是否有效并符合质量标准。               |
| `install`                 | 将包安装到本地存储库中，用作本地其他项目的依赖项。           |
| `deploy`                  | 在集成或发布环境中完成，将最终包复制到远程存储库以与其他开发人员和项目共享。 |

### site生命周期

| 阶段          | 描述                                     |
| :------------ | :--------------------------------------- |
| `pre-site`    | 在实际项目现场生成之前执行所需的流程     |
| `site`        | 生成项目的站点文档                       |
| `post-site`   | 执行完成站点生成和准备站点部署所需的流程 |
| `site-deploy` | 将生成的站点文档部署到指定的 Web 服务器  |


### clean生命周期

| 阶段         | 描述                             |
| :----------- | :------------------------------- |
| `pre-clean`  | 在实际项目清理之前执行所需的流程 |
| `clean`      | 删除先前构建生成的所有文件       |
| `post-clean` | 执行完成项目清理所需的流程       |
