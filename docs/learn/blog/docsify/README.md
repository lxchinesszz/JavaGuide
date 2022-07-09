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
title: Docsify
---

## 一、docsify

`docsify` 可以快速帮你生成文档网站。不同于 GitBook、Hexo 的地方是它不会生成静态的 .html 文件，所有转换工作都是在运行时。如果你想要开始使用它，只需要创建一个 index.html 就可以开始编写文档并直接部署在 GitHub Pages。
[docsify](https://docsify.js.org/#/zh-cn/)

[https://ddd.springlearn.cn/](https://ddd.springlearn.cn/)

## 二、安装


### 2.1 安装

首先利用 `npm` 下载 

```bash
npm i docsify-cli -g

# 初始化项目
docsify init ./docs

# 本地预览
docsify serve docs
```


## 三、使用

大家可以参考我的项目实现

### 3.1 导航栏配置

![](https://img.springlearn.cn/blog/learn_1656224450000.png)

- [`docusaurus.config.js`](https://github.com/lxchinesszz/ddd-website/blob/master/docusaurus.config.js)


### 3.2 编写文章

文章基于Markdown格式,只要会使用Markdown就可以了。

就这么简单,搭建可以直接拉去我的项目,进行调整即可。更多的定制化可以直接参考官方文档。
