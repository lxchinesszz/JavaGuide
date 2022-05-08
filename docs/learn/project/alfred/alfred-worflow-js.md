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
footer: false
backtotop: true
title: Alfred-workflow-js
---

## 1. 基本运行


```javascript
var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var Item = AlfredNode.Item;
 
(function main() {
    actionHandler.onAction("action1", function(query) {
        // your code to handle action 1 here
    });
    actionHandler.onAction("action2", function(query) {
        // your code to handle action 2 here
    });
    
    actionHandler.onMenuItemSelected("action2", function(query, selectedTitle, selectedData) {
        // your code to handle manu item selected of action 2 here
    });
 
    AlfredNode.run();
})();

```

## 2. 日志打印

```
console.warn("action1, 参数:" + query)
```

## 3. 菜单

使用脚本当使用tab键,会进行跳转的操作。

```javascript

    //输入tab键会把上一个选中的参数翻到这里
    actionHandler.onMenuItemSelected("action1", function (query, title, data) {
        console.warn("data:" + data)
        console.warn("title:" + title)
        console.warn("query:" + query)

        var item1 = new Item({
            title: "Item 1 of " + title,
            arg: "item 1 of " + title + " which has alias ",
            subtitle: "data", // we can get data of selected item
            valid: true
        });

        var item2 = new Item({
            title: "Item 2 of " + title,
            arg: "item 2 of " + title + " which has alias ",
            subtitle: data,
            valid: true
        });

        workflow.addItem(item1);
        workflow.addItem(item2);


        var item3 = new Item({
            title: "Item 3 of " + storage.get("key1"),
            arg: "item 3 of " + title + " which has alias ",
            subtitle: data,
            valid: true
        });
        workflow.addItem(item3);

        var item4 = new Item({
            title: "Item 4 of " + storage.get("key2").name,
            arg: "item 4 of " + title + " which has alias ",
            subtitle: data,
            valid: true
        });
        workflow.addItem(item4);

        workflow.feedback();
    });
```

## 4. 使用本地缓存进行CURD

```javascript

var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var Item = AlfredNode.Item;
workflow.setName("example-alfred-workflow-using-nodejs");
//类似本地的缓存
var storage = AlfredNode.storage;



var storage = AlfredNode.storage;
storge.set("key", "value");
storage.set("key", {name: "node"}, 1000);
storage.get("key");
storage.remove("key");
storage.clear();
```

## 5. 获取Alfred-workflow中的配置

![](https://img.springlearn.cn/blog/learn_1605443439000.png)

```javascript

 //获取系统外部配置
 console.warn("系统环境变量:" + utils.envVars.get("outSetting"))
```

## 6. 异常图标

可以是图片地址，也可以是系统icns地址

(ACCOUNT, BURN, CLOCK, COLOR, EJECT, ERROR, FAVORITE, GROUP, HELP, HOME, INFO, NETWORK, NOTE, SETTINGS, SWIRL, SWITCH, SYNC, TRASH, USER, WARNING, WEB)

```

icon: AlfredNode.ICONS.INFO

icon: AlfredNode.ICONS.ERROR
```

## 7. 传递给下一个的变量

![](https://img.springlearn.cn/blog/learn_1605444141000.png)

![](https://img.springlearn.cn/blog/learn_1605444173000.png)

```
AlfredNode.utils.generateVars({arg: 'xyz', variables: {key: value}};

```

## 8. 获取mac的钥匙串

![](https://img.springlearn.cn/blog/learn_1605444750000.png)

```
 var settings = AlfredNode.settings;
        // 将账户密码添加到钥匙串
        settings.setPassword("alfred-liuxin", "password");
        // 获取mac的钥匙串中的,密码
        settings.getPassword("alfred-liuxin", function(error, password){
            console.warn("获取密码:" + password);
        });
```


## 9. 自动黏贴APP中

![](https://img.springlearn.cn/blog/learn_1605446383000.png)

