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
title: maven-resources-plugin
---

> maven-resources-plugin

资源插件处理将项目资源复制到输出目录。有两种不同的资源：主要资源和测试资源。区别在于主要资源是与主要源代码相关联的资源，而测试资源与测试源代码相关联。

因此，这允许主要源代码及其单元测试的资源分离。

从 2.3 版开始，这个插件使用Maven Filtering共享组件来过滤资源。

![](https://maven.apache.org/images/maventxt_logo_200.gif)

[maven-resources-plugin官网](https://maven.apache.org/plugins/maven-resources-plugin/)


## 主要功能

- resources:resources
将主源代码的资源复制到主输出目录。
这个目标通常会自动执行，因为它默认绑定到流程资源生命周期阶段。它总是使用 project.build.resources 元素来指定资源，并且默认使用 project.build.outputDirectory 来指定复制目标。

- resources:testResources
将测试源代码的资源复制到测试输出目录。
这个目标通常会自动执行，因为它默认绑定到 process-test-resources 生命周期阶段。它总是使用 project.build.testResources 元素来指定资源，并且默认使用 project.build.testOutputDirectory 来指定复制目标。

- resources:copy-resources
将资源复制到输出目录。此目标要求您配置要复制的资源，并指定 outputDirectory。
