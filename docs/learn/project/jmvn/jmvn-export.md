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
title: 数据模型导出
---

::: tip jmvn export 数据模型导出
`jmvn` 另一个好用的功能就是数据导出，这个功能的主要用处是，在写技术方案时候将数据模型输出到文档中。支持markdown语法。
:::


## 自动读取配置进行导出

如果你已经在配置文件中了dbConfig相关信息，则会自动读取配置信息。你只需要输入要导出的表名即可。

```json
{
  "namespace": [
  ],
  "config": {},
  "dbConfig": {
    "host": "10.80.20.8",
    "user": "abm_dev",
    "password": "pOj*4Z%^izKy0o23o8aH",
    "database": "pms_dev"
  }
}
```

## 根据命令提示完成导出

如果你没有在配置文件中添加dbConfig相关信息，请根据命令提示来进行完成导出。

![](https://img.springlearn.cn/learn_53218775085b88f319e37ca3811c5cd7.gif)

## 纯命令方式导出

如果你在配置文件中已经添加了dbConfig相关信息，但是又不想使用这个进行导出。则可以在命令后添加 `-c` 以强制使用输入参数来进行导出。

``` 
jmvn export -c -m -h 10.80.20.8 -u abm_dev -p 'pOj*4Z%^izKy0o23o8aH' -t replenish_order -db pms_dev
```

### 查看导出帮助文档

``` 
➜ jmvn help export                                                                                   
JMVN CLI v1.0.6
Usage: jmvn export [options]

导出数据模型 (支持命令行模式 & 交互模式)

Options:
  -c, --commanded [String]  命令行模式运行
  -m, --markdown [String]   导出markdown格式
  -h, --host [String]       数据库[host]
  -u, --user [String]       数据库登陆用户
  -p, --password [String]   登陆密码(明文请注意安全)
  -t, --tables [String]     要导出的表模型(支持,分隔)
  -db, --database [String]  指定要导出的库
  --help                    display help for command

```
