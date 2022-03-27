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
comment: false
footer: true
icon: ability
backtotop: true
title: Vuepress
---

:::info Vuepress
Vuepress 从名字上看就知道跟Vue关系不一般,是的它是基于Vue进行开发的。Vue的官网也是使用这个框架来做的。他的好处是比较适合
专题类文章, 对Markdown语法完全支持,通知支持代码高亮,比较适合技术类文章, 但是稍微有些难度, 适合有点经验的开发同学。
:::

## 一、Vuepress

`Hexo` 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。
[hexo](https://hexo.io/zh-cn/)

## 二、像数 1, 2, 3 一样容易

这里是Vuepress原生主题,比较简单。

```
# 安装
yarn global add vuepress # 或者：npm install -g vuepress

# 新建一个 markdown 文件
echo '# Hello VuePress!' > README.md

# 开始写作
vuepress dev .

# 构建静态文件
vuepress build .
```

::: warning
注意
请确保你的 Node.js 版本 >= 8.6。
:::

## 三、主题安装

这里只推荐一个主题,本网站的主题也是使用的这个。

### 3.1 [vuepress-theme-hope](https://vuepress-theme-hope.github.io/zh/guide/get-started/install/#)

``` 
npm init vuepress-theme-hope 
```

注意目录一定要在.vuepress/config.js

```js
// .vuepress/config.js
const { config } = require("vuepress-theme-hope");

module.exports = config({
  // your config here
});
```
