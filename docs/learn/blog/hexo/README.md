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
title: Hexo
---


:::info
Hexo的风格个人感觉类似于QQ空间,属于自己的私人领地。文章比较琐碎,不太适合专题类、系列类的文档,其次是对Markdown的支持比较一般,
部分主体支持代码高亮等功能。
好处是简单,小编的第一个博客空间就是基于Hexo。目前也在维护中。
:::

[https://blog.springlearn.cn/](https://blog.springlearn.cn/)

## 一、[Hexo](https://hexo.io/zh-cn/)


[![](https://img.shields.io/badge/Hexo-%E7%A4%BA%E4%BE%8B-green)](https://blog.springlearn.cn/)


`Hexo` 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

## 二、安装

### 2.1 安装前提

安装 Hexo 相当简单，只需要先安装下列应用程序即可：

- Node.js (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
- Git
- npm

### 2.2 安装

首先利用 `npm` 下载 

```bash
npm install -g hexo-cli;

mdkir myblog;

cd myblog;

hexo init;
```


## 三、使用

`hexo` 的命令非常简单，小编用了很多年，基本上只有2个。你知道是哪两个吗? 

### 3.1 new 新建文章

`$ hexo new [layout] <title>`

- layout 是博客布局，基本不会用
- title 就是博客的名字

### 3.2 generate 文章编译

生成静态文件。

`$ hexo generate`

该命令可以简写为：

`$ hexo g`

### 3.3 server 本地运行

启动服务器,本地运行

`$ hexo server`

### 3.4 deploy 远程部署

部署远程

`$ hexo deploy`

该命令可以简写为：

`$ hexo d`

### 3.5 clean 清理缓存

`$ hexo clean`

清除缓存文件 (db.json) 和已生成的静态文件 (public)。

在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。

### 3.6 version

`$ hexo version`

显示 Hexo 版本。


## 四、部署

`hexo` 的配置文件都在根目录下的 `_config.yml` 文件下。如果要部署远程，非常简单。

```yml
deploy:
    type: git
    repo:
#      可以使用github    
#      github: https://github.com/lxchinesszz/lxchinesszz.github.io.git
      coding: https://e.coding.net/lxchinesszz/lxchinesszz.git
    branch: master
```


- 1. 这里需要注意，如果使用github部署, 仓库的名字是有讲究的。名字要跟github的账户名前缀一直。
`lxchinesszz.github.io`
- 2. 打开设置要配置一下域名，如果不配置域名默认就是 `https://lxchinesszz.github.io/`

![](https://img.springlearn.cn/blog/learn_1640502249000.png)

### 4.1 本地部署

`hexo s`

### 4.2 远程部署

`hexo g -d` 

或者是

`hexo g`  + `hexo d`

