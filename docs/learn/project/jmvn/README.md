---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: true
footer: true
backtotop: true
title: 基于命令行的Java脚手架
---

::: tip jmvn

现阶段SpringBoot + Maven多模块是构建Java后台项目的标准格式，但是Maven多模块和成熟的Java项目结构搭建起来也是比较费力的。
对于一个老鸟来说可能需要5分钟,但是对于一个小白或者是非专业认识,可能需要更长的时间。
这里提供一个命令行交互式的构建工具，希望能解决这种简单重复的工作。
jmvn就是为了解决这问题诞生的, 一个快速构建Maven多模块应用的构建工具 [![](https://img.shields.io/badge/-jmvn-green?style=for-the-badge&logo=appveyor)](https://github.com/lxchinesszz/mvn-cli
)
它不仅能提供快速构建项目的能力，同时也能快速的安装数据模型生成Java对象,同时也可能快速导出数据库表结构信息，生成表结构文档。
:::


## 背景 & 目标

目标打造一个简单好用的 Java 服务脚手架工具，让任何没有开发经验的同学都能快速构建一个可以运行的项目

工具围绕几个方面进行开发, 力求在以下方面提高开发的工作效率, 同时同过脚手架的方式从一开始就统一下项目结构和模型。

- 深度定制 (定制公司标准的项目结构)
- 快速构建标准的Maven多模块服务
- 支持数据库模型快速安装 (一次配置终生使用, 多快好省)
- 数据库模型文档一键导出 (每次表结构变更, 快速导出最新表文档)

## 一、介绍 | Introduce

快速构建支持SpringBoot的Maven多模块应用,启动及快速打包部署

- 支持Maven多模块构建、
- 数据库模型安装、
- 数据库模型导出),
- 统一项目规范,
- 提高工作效率,
- 可进行深度定制。


## 二、快速安装 | Fast installation

## 2.1 Node环境安装

:::: code-group

::: code-group-item Window

```
https://nodejs.org/dist/v14.15.5/node-v14.15.5-x64.msi
```

:::

::: code-group-item Mac:active

```
https://nodejs.org/dist/v15.9.0/node-v15.9.0.pkg
```

:::

::::


## 2.2 安装

```
➜ npm i jmvn -g
```

## 三、功能介绍

## 3.1 快速构建 | To quickly build

![](https://img.springlearn.cn/blog/learn_1650116393000.png)

### 3.1.1 命令行构建项目 | Command line build

```
ℹ Build:shop/shop-web/src/main/java/com/github/shop/web/
ℹ Build:shop/shop-web/src/main/resources/
ℹ Build:shop/shop-web/src/main/java/com/github/shop/web/
ℹ MavenHooks webPath:shop/shop-web/src/main/java/com/github/shop/web/
✔ Build: Add SpringBoot Config:shop/shop-web/src/main/resources/application.yml
ℹ Build:shop/shop-service/src/main/java/com/github/shop/service/
ℹ Build:shop/shop-service/src/main/resources/
ℹ Build:shop/shop-service/src/main/java/com/github/shop/service/
ℹ MavenHooks servicePath:shop/shop-service/src/main/java/com/github/shop/service/
ℹ Build:shop/shop-domain/src/main/java/com/github/shop/domain/
ℹ Build:shop/shop-domain/src/main/resources/
ℹ Build:shop/shop-domain/src/main/java/com/github/shop/domain/
ℹ MavenHooks domainPath:shop/shop-domain/src/main/java/com/github/shop/domain/
ℹ Build:shop/shop-dal/src/main/java/com/github/shop/dal/
ℹ Build:shop/shop-dal/src/main/resources/
ℹ Build:shop/shop-dal/src/main/java/com/github/shop/dal/
ℹ MavenHooks dalPath:shop/shop-dal/src/main/java/com/github/shop/dal/
ℹ Build:shop/shop-integration/src/main/java/com/github/shop/integration/
ℹ Build:shop/shop-integration/src/main/resources/
ℹ Build:shop/shop-integration/src/main/java/com/github/shop/integration/
ℹ MavenHooks integrationPath:shop/shop-integration/src/main/java/com/github/shop/integration/
ℹ Build:shop/shop-config/src/main/java/com/github/shop/config/
ℹ Build:shop/shop-config/src/main/resources/
ℹ Build:shop/shop-config/src/main/java/com/github/shop/config/
ℹ MavenHooks configPath:shop/shop-config/src/main/java/com/github/shop/config/
ℹ Build:shop/shop-common/src/main/java/com/github/shop/common/
ℹ Build:shop/shop-common/src/main/resources/
ℹ Build:shop/shop-common/src/main/java/com/github/shop/common/
ℹ MavenHooks commonPath:shop/shop-common/src/main/java/com/github/shop/common/
✔ GitIgnore before
   __  ____   ___  __    _______   ____
  /  |/  / | / / |/ /___/ ___/ /  /  _/
 / /|_/ /| |/ /    /___/ /__/ /___/ /
/_/  /_/ |___/_/|_/    \___/____/___/  Application shop Build Success

✔ 🚀 JMVN CLI v1.0.6
┌────────┬────────┬──────────┬────────────────┬──────────────────────────────────────┬────────┐
│ 项目名 │ 作者   │ 项目版本 │ SpringBoot版本 │ 描述                                 │ 端口号 │
├────────┼────────┼──────────┼────────────────┼──────────────────────────────────────┼────────┤
│ shop   │ 周杰伦 │ 1.0.0    │ 0.5.1-RELEASE  │ 一个基于SpringBoot的商城项目后台服务 │ 10086  │
└────────┴────────┴──────────┴────────────────┴──────────────────────────────────────┴────────┘
✔ GitIgnore invoke
✔ GitIgnore after
```

## 3.2 安装数据库库模型 | Install the database library model

### 3.2.1 配置安装信息 | Configure installation information#

- 配置项目开发数据库地址
- 配置模型命名规则及安装目录

```json
{
  "dbConfig": {
    "host": "10.*.*.121",
    "user": "o*test",
    "password": "9G****RZ",
    "database": "***"
  },
  "models": [
    {
      "suffix": "DO",
      "tableName": [
        "w_order",
        "w_push_order"
      ],
      "path": "scm-dao/src/main/java/com/idanchuang/scm/dao/entity/Do"
    }
  ]
}
```

### 3.2.2 执行命令 | Execute the command

![](https://img.springlearn.cn/blog/learn_1650116518000.png)

```
➜ jmvn
JMVN CLI v1.0.6
Usage: jmvn [options] [command]

快速构建支持SpringBoot的Maven多模块应用

Options:
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  init                 创建一个新的Maven多模块项目
  install|i [options]  安装数据模型
  export [options]     导出数据模型 (支持命令行模式 & 交互模式)
  help [command]       display help for command
```

## 3.3 导出数据模型文档 | Export data model documents

为了方便我们写技术文档, 支持直接导出成 markdown 格式文档。

![](https://img.springlearn.cn/blog/learn_1650116581000.png)


## 四、发布记录 | Release record

**1.0.1**

构建服务
支持注册命令

**1.0.2**

代码精简及优化
版本检测及升级

**1.0.3**

fix端口号映射问题

**1.0.4**

优化版本检测,在网络差场景的用户体验

## 五、定制 | Custom


为了达到深度定制的能力, 你所看到的一切都是可配置的。在模块每一层创建的同时也提供了钩子方法。允许你在钩子节点去做定制开发 。
**[MavenHooks.js](https://github.com/lxchinesszz/mvn-cli/blob/master/action/MavenHooks.js)**

欢迎感兴趣的小伙伴一起参与开发, 🚀 `call me！`

微信: `lxchinesszz`
邮箱: `lxchinesszz@163.com`

## 六、扩展知识 | Expand the knowledge


[代码命名规范参考建议](/learn/design/Java代码规范全部奉上/)

项目结构设计支持配置, 在配置前请确定你的编程方法论和价值观。以下文档仅供参考。也是当前工具所保持的价值观。

## 6.1 分层命名 | Hierarchical naming

![](https://img.springlearn.cn/blog/learn_1650116968000.png)
明确业务分层架构，定义领取模型, 编程不迷茫

![](https://img.springlearn.cn/blog/learn_1650116958000.png)


## 6.2 数据模型规范 | Data model specification
![](https://img.springlearn.cn/blog/learn_1650117078000.png)
迪米特法则: 不要和陌生人说话,数据模型之间保持最少的了解 迪米特法则: 不要和陌生人说话,数据模型之间保持最少的了

![](https://img.springlearn.cn/blog/learn_1650117093000.png)

## 七、插件开发 | Plug-in development

脚手架工具会将在每个 Maven Module 创建过程中去发出不同对应的事件, 插件开发者可以不同的事件类型来开发插件。

## 7.1 事件类型 | The event type


| 事件类型     | 事件说明     | 环境信息                                   |
| ------------ | ------------ | ------------------------------------------ |
| BUILD_BEFORE | 构建前触发 | - |
| BUILD_WEB | 构建web层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_SERVICE | 构建service层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_DOMAIN | 构建domain层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_DAL | 构建dal层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_INTEGRATION | 构建integration层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_CONFIG | 构建config层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_COMMON | 构建common通用层触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_COMPLETE | 构建完成触发 | { "namespace":Array[7], "config":Object, "dbConfig":Object, "models":Array[1], "projectConfig":Object } |
| BUILD_JAVA_RESOURCE | 构建java资源文件时候触发 | { projectConfig: Object, currentPath: '' } |
| BUILD_JAVA_WEB_RESOURCE | 构建java, Web资源文件时候触发 | { projectConfig: Object, currentPath: '' } |

## 7.2 插件生命周期函数 | Life cycle function

![](https://img.springlearn.cn/blog/learn_1650117675000.png)


## 7.3 插件开发示例 | The sample


### 7.3.1 创建目录 | Create a directory


`plugins` 目录下创建插件子目录


### 7.3.2 实现插件生命周期函数 | Write a function


插件支持before、invoke、error、after。插件的核心逻辑在invoke，可以直接实现该方法即可。


所有的声明周期函数都有且只有一个入参，但是不同事件入参信息是不一样的，可以参考 7.1 事件类型, 参数说明。


```javascript
// 方式1: 仅仅实现核心逻辑,不关注生命周期函数
new Plugin('GitIgnore', 'GitIgnore创建', PluginEventType.BUILD_COMPLETE, new GitAction().createGitIgnoreFile);

// 方式2: 通过方法重写方式实现,生命周期方法
let plugin2 = new Plugin('GitIgnore', 'GitIgnore创建', PluginEventType.BUILD_COMPLETE);

plugin2.before = function(envConfig){
	console.log('插件before')
}

plugin2.after  = function(envConfig){
	console.log('插件before')
}
```


### 7.3.3 注册开发好的插件 | To register the plugin


`plugins.Install.js`  进行注册
```javascript
/**
 * 定义插件
 *
 * before->invoke->success->after
 * error异常捕捉执行
 * @param name 插件名称
 * @param desc 插件说明
 * @param type 插件类型
 * @param action 插件核心逻辑
 * @constructor
 */
function Plugin(name, desc, type, action) {}

// 注册一个git忽略文件插件,接受maven构建完成事件
Plugins.register(new Plugin('GitIgnore', 'GitIgnore创建', PluginEventType.BUILD_COMPLETE, new GitAction().createGitIgnoreFile))
```


### 7.3.4 完整的参数入参 | Parameters for details


- 项目名称 `tests` 为例
```json
{
    "namespace":[
        {
            "type":"web",
            "path":"tests/tests-web/src/main/java/com/idanchuang/tests/web/",
            "packagePath":"com/idanchuang/tests/web"
        },
        {
            "type":"service",
            "path":"tests/tests-service/src/main/java/com/idanchuang/tests/service/",
            "packagePath":"com/idanchuang/tests/service"
        },
        {
            "type":"domain",
            "path":"tests/tests-domain/src/main/java/com/idanchuang/tests/domain/",
            "packagePath":"com/idanchuang/tests/domain"
        },
        {
            "type":"dal",
            "path":"tests/tests-dal/src/main/java/com/idanchuang/tests/dal/",
            "packagePath":"com/idanchuang/tests/dal"
        },
        {
            "type":"integration",
            "path":"tests/tests-integration/src/main/java/com/idanchuang/tests/integration/",
            "packagePath":"com/idanchuang/tests/integration"
        },
        {
            "type":"config",
            "path":"tests/tests-config/src/main/java/com/idanchuang/tests/config/",
            "packagePath":"com/idanchuang/tests/config"
        },
        {
            "type":"common",
            "path":"tests/tests-common/src/main/java/com/idanchuang/tests/common/",
            "packagePath":"com/idanchuang/tests/common"
        }
    ],
    "config":{
        "_projectName":"tests",
        "_web":"web",
        "_biz":"service",
        "_domain":"domain",
        "_dal":"dal",
        "_integration":"integration",
        "_config":"config",
        "_common":"common",
        "_groupId":"com.idanchuang",
        "_projectVersion":"1.0.0",
        "_projectDescription":"description",
        "_springBootVersion":"0.5.1-RELEASE"
    },
    "projectConfig":{
        "projectName":"tests",
        "web":"web",
        "biz":"service",
        "domain":"domain",
        "dal":"dal",
        "integration":"integration",
        "config":"config",
        "common":"common",
        "groupId":"com.idanchuang",
        "projectVersion":"1.0.0",
        "mavenSurefireJavaVersion":"1.8",
        "projectDescription":"description",
        "springBootVersion":"0.5.1-RELEASE",
        "port":"8081",
        "projectAuthor":"mvn-cli",
        "modelFlag":true
    }
}
```


## 7.4 插件测试 | Plug-in Test

配置完成即可进行 `debug`


![](https://img.springlearn.cn/blog/learn_1650117812000.png)
