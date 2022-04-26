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
title: 插件开发
---

::: tip jmvn instll 数据安装
`jmvn` 一个好用的功能就是支持数据安装，这个功能是我比较喜欢的。因为在项目
中开发过程中，经常会出现,表结构进行变更，可能是增加些表注释，增加个字段。这个时候就要同步来
修改数据模型。是比较繁琐的。当你尝试过 `jmvn install` 功能后，这个问题就能彻底解决了。
只需要运行 `jmvn install` 命令，数据模型就会同步更改。
:::




## 配置如下

在你的项目 `.jmvn.json` 中添加如下。`jmvn` 会读取 `dbConfig` 中数据库的配置。
写入到 `models` 中指定的目录 `path`。

```json 
{
  "namespace": [
  ],
  "config": {},
  "dbConfig": {
    "host": "10.*.*.8",
    "user": "root",
    "password": "123456",
    "database": "test"
  },
  "models": [
    {
      "suffix": "DO",
      "tableName": [
        "user",
        "user_detail"
      ],
      "path": "example-dal/src/main/java/com/example/dal/entity"
    }
  ]
}
```

你可以在models中使用suffix添加Java文件的后缀名。
eg: user表，最终写成java文件为 UserDO
