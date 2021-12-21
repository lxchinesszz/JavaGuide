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
title: Java代码规范全部奉上
---

![](https://img.springlearn.cn/blog/learn_1598165820000.png)

>写代码就像写文章, 好的代码就像好的文章,结构严谨,构思清晰。写代码就像写文章, 一不留神就成流水账，为避免这种情况作为软件开发工程师，重要的是设计而不是实现。


**在一个团队中,由于不同经验的开发导致编程风格可能会出现非常混乱的情况,从而导致开发成本上升。难以维护。所以代码规范就显得异常重要了。**

本篇文章就是给出编程命名的建议,仅供参考,但是其目的是为了统一规范,提高编程能力,降低开发成本,减少代码维护成本。

契约精神: 做到有法可依，有章可循。

## 一、类命名

### 1. 抽象类

适用的设计模式为模板模式。抽象是自下往上的设计。由具体实现推断出抽象方法。建议以Abstract开头。

| 建议 | 示例 |
| ----------------------- | --------------- |
| Abstract 或者 Base 开头 | BaseUserService、AbstractUserService |


### 2. 枚举类

- 枚举是由JVM来保证的单例。可以用来做单例类。
- 枚举类常用作值判断,不建议每次进行循环判断得到实例。建议由内部维护一个map类型,当做cache。此方法建议放在static静态代码块中实现

| 建议 | 示例 |
| ------------- | ---------- |
| Enum 作为后缀 | GenderEnum |


```
public enum ProtocolEnum {

    /**
     * ECHO协议
     */
    ECHO(1, null),

    /**
     * mojito协议
     */
    MOJITO(2, MojitoProtocol.class);

    private byte type;

    private Class<? extends Protocol> protocol;

    private static Map<Byte, ProtocolEnum> cache = new HashMap<>();

    static {
        for (ProtocolEnum protocolEnum : values()) {
            cache.put(protocolEnum.type, protocolEnum);
        }
    }

    public static ProtocolEnum byType(byte type) {
        return cache.get(type);
    }
}    
```
### 3. 工具类

工具类常为无状态对象,无状态对象都是线程安全对象,建议使用 `final` 修饰。



工具类中避免出现业务属性, 如果出现业务属性,抽象出领域层

| 建议 | 示例 |
| ------------- | ---------- |
| Utils作为后缀 | StringUtils |


### 4. 异常类

建议保持异常链。

| 建议 | 示例 |
| ------------- | ---------- |
| Exception结尾 | RuntimeException |


### 5. 接口实现类

众所周知

| 建议 | 示例 |
| ------------- | ---------- |
| 接口名+ Impl | UserServiceImpl |


### 6. 设计模式相关类


| 建议 | 示例 |
| ------------- | ---------- |
| Builder，Factory等 | 当使用到设计模式时，需要使用对应的设计模式作为后缀，如ThreadFactory |

![](https://img.springlearn.cn/27c9d5187cd283f8d160ec1ed2b5ac89.jpg)

### 7. 处理特定功能的

其主要的目的是代码可重复使用。

| 建议 | 示例 |
| ------------- | ---------- |
| Handler，Predicate, Validator | 表示处理器，校验器，断言，这些类工厂还有配套的方法名如handle，predicate，validate |


### 8. 测试类


| 建议 | 示例 |
| ------------- | ---------- |
| Test结尾 | UserServiceTest， 表示用来测试UserService类的 |


### 9. 领域模型载体

| 建议 | 示例 |
| ------------- | ---------- |
| DTO/*Request | 数据传输对象                  |
| BO           | 业务对象                      |
| VO           | 数据展示对象,用于承载页面数据 |
| DO           | 数据持久化对象                |



## 二、方法命名

参考于网络。

### 1. 布尔判断方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **位置** | **单词** | **意义**                                                     | **例**        |
| -------- | -------- | ------------------------------------------------------------ | ------------- |
| Prefix   | is       | 对象是否符合期待的状态                                       | isValid       |
| Prefix   | can      | 对象**能否执行**所期待的动作                                 | canRemove     |
| Prefix   | should   | 调用方执行某个命令或方法是**好还是不好**,**应不应该**，或者说**推荐还是不推荐** | shouldMigrate |
| Prefix   | has      | 对象**是否持有**所期待的数据和属性                           | hasObservers  |
| Prefix   | needs    | 调用方**是否需要**执行某个命令或方法                         | needsMigrate  |



### 2. 检查的方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **单词** | **意义**                                             | **例**         |
| -------- | ---------------------------------------------------- | -------------- |
| ensure   | 检查是否为期待的状态，不是则抛出异常或返回error code | ensureCapacity |
| validate | 检查是否为正确的状态，不是则抛出异常或返回error code | validateInputs |



### 3. 按需求才执行的方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **位置** | **单词**  | **意义**                                  | **例**                 |
| -------- | --------- | ----------------------------------------- | ---------------------- |
| Suffix   | IfNeeded  | 需要的时候执行，不需要的时候什么都不做    | drawIfNeeded           |
| Prefix   | might     | 同上                                      | mightCreate            |
| Prefix   | try       | 尝试执行，失败时抛出异常或是返回errorcode | tryCreate              |
| Suffix   | OrDefault | 尝试执行，失败时返回默认值                | getOrDefault           |
| Suffix   | OrElse    | 尝试执行、失败时返回实际参数中指定的值    | getOrElse              |
| Prefix   | force     | 强制尝试执行。error抛出异常或是返回值     | forceCreate, forceStop |



### 4. 异步相关方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **位置**        | **单词**     | **意义**                                     | **例**                |
| --------------- | ------------ | -------------------------------------------- | --------------------- |
| Prefix          | blocking     | 线程阻塞方法                                 | blockingGetUser       |
| Suffix          | InBackground | 执行在后台的线程                             | doInBackground        |
| Suffix          | Async        | 异步方法                                     | sendAsync             |
| Suffix          | Sync         | 对应已有异步方法的同步方法                   | sendSync              |
| Prefix or Alone | schedule     | Job和Task放入队列                            | schedule, scheduleJob |
| Prefix or Alone | post         | 同上                                         | postJob               |
| Prefix or Alone | execute      | 执行异步方法（注：我一般拿这个做同步方法名） | execute, executeTask  |
| Prefix or Alone | start        | 同上                                         | start, startJob       |
| Prefix or Alone | cancel       | 停止异步方法                                 | cancel, cancelJob     |
| Prefix or Alone | stop         | 同上                                         | stop, stopJob         |



### 5. 回调方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **位置** | **单词** | **意义**                   | **例**       |
| -------- | -------- | -------------------------- | ------------ |
| Prefix   | on       | 事件发生时执行             | onCompleted  |
| Prefix   | before   | 事件发生前执行             | beforeUpdate |
| Prefix   | pre      | 同上                       | preUpdate    |
| Prefix   | will     | 同上                       | willUpdate   |
| Prefix   | after    | 事件发生后执行             | afterUpdate  |
| Prefix   | post     | 同上                       | postUpdate   |
| Prefix   | did      | 同上                       | didUpdate    |
| Prefix   | should   | 确认事件是否可以发生时执行 | shouldUpdate |

### 6. 操作对象生命周期的方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **单词**   | **意义**                       | **例**          |
| ---------- | ------------------------------ | --------------- |
| initialize | 初始化。也可作为延迟初始化使用 | initialize      |
| pause      | 暂停                           | onPause ，pause |
| stop       | 停止                           | onStop，stop    |
| abandon    | 销毁的替代                     | abandon         |
| destroy    | 同上                           | destroy         |
| dispose    | 同上                           | dispose         |



### 7. 与集合操作相关的方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **单词** | **意义**                     | **例**     |
| -------- | ---------------------------- | ---------- |
| contains | 是否持有与指定对象相同的对象 | contains   |
| add      | 添加                         | addJob     |
| append   | 添加                         | appendJob  |
| insert   | 插入到下标n                  | insertJob  |
| put      | 添加与key对应的元素          | putJob     |
| remove   | 移除元素                     | removeJob  |
| enqueue  | 添加到队列的最末位           | enqueueJob |
| dequeue  | 从队列中头部取出并移除       | dequeueJob |
| push     | 添加到栈头                   | pushJob    |
| pop      | 从栈头取出并移除             | popJob     |
| peek     | 从栈头取出但不移除           | peekJob    |
| find     | 寻找符合条件的某物           | findById   |



### 8. 数据增删改查相关的方法

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **单词** | **意义**                               | **例**        |
| -------- | -------------------------------------- | ------------- |
| create   | 新创建                                 | createAccount |
| new      | 新创建                                 | newAccount    |
| from     | 从既有的某物新建，或是从其他的数据新建 | fromConfig    |
| to       | 转换                                   | toString      |
| update   | 更新既有某物                           | updateAccount |
| load     | 读取                                   | loadAccount   |
| fetch    | 远程读取                               | fetchAccount  |
| delete   | 删除                                   | deleteAccount |
| remove   | 删除                                   | removeAccount |
| save     | 保存                                   | saveAccount   |
| store    | 保存                                   | storeAccount  |
| commit   | 保存                                   | commitChange  |
| apply    | 保存或应用                             | applyChange   |
| clear    | 清除数据或是恢复到初始状态             | clearAll      |
| reset    | 清除数据或是恢复到初始状态             | resetAll      |

### 9. 成对出现的动词

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| **单词**       | **意义**          |
| -------------- | ----------------- |
| get获取        | set 设置          |
| add 增加       | remove 删除       |
| create 创建    | destory 移除      |
| start 启动     | stop 停止         |
| open 打开      | close 关闭        |
| read 读取      | write 写入        |
| load 载入      | save 保存         |
| create 创建    | destroy 销毁      |
| begin 开始     | end 结束          |
| backup 备份    | restore 恢复      |
| import 导入    | export 导出       |
| split 分割     | merge 合并        |
| inject 注入    | extract 提取      |
| attach 附着    | detach 脱离       |
| bind 绑定      | separate 分离     |
| view 查看      | browse 浏览       |
| edit 编辑      | modify 修改       |
| select 选取    | mark 标记         |
| copy 复制      | paste 粘贴        |
| undo 撤销      | redo 重做         |
| insert 插入    | delete 移除       |
| add 加入       | append 添加       |
| clean 清理     | clear 清除        |
| index 索引     | sort 排序         |
| find 查找      | search 搜索       |
| increase 增加  | decrease 减少     |
| play 播放      | pause 暂停        |
| launch 启动    | run 运行          |
| compile 编译   | execute 执行      |
| debug 调试     | trace 跟踪        |
| observe 观察   | listen 监听       |
| build 构建     | publish 发布      |
| input 输入     | output 输出       |
| encode 编码    | decode 解码       |
| encrypt 加密   | decrypt 解密      |
| compress 压缩  | decompress 解压缩 |
| pack 打包      | unpack 解包       |
| parse 解析     | emit 生成         |
| connect 连接   | disconnect 断开   |
| send 发送      | receive 接收      |
| download 下载  | upload 上传       |
| refresh 刷新   | synchronize 同步  |
| update 更新    | revert 复原       |
| lock 锁定      | unlock 解锁       |
| check out 签出 | check in 签入     |
| submit 提交    | commit 交付       |
| push 推        | pull 拉           |
| expand 展开    | collapse 折叠     |
| begin 起始     | end 结束          |
| start 开始     | finish 完成       |
| enter 进入     | exit 退出         |
| abort 放弃     | quit 离开         |
| obsolete 废弃  | depreciate 废旧   |
| collect 收集   | aggregate 聚集    |

### 10. 获取必须的参数

| getRequiredProperty | 获取必须的参数,否则报错,该方法一般都要抛出异常          |
| ------------------- | ------------------------------------------------------- |
| getProperty         | 非必须参数,可以返回null，不报错，调用方自行判断处理逻辑 |

### 11. 获取数据并对数据进行某种处理

注：Prefix-前缀，Suffix-后缀，Alone-单独使用

| 位置   | 单词         | 意义                                                     | 例子                |
| ------ | ------------ | -------------------------------------------------------- | ------------------- |
| Prefix | resolve      | 解决某些问题,比如对文本占位符进行填充,并获取到填充后的值 | resolvePlaceholders |
| Suffix | Placeholders | 占位符相关命名                                           | resolvePlaceholders |

## 三、方法编程建议

### 1. 方法复杂度

凡是逻辑判断语句均为复杂度。当一个方法中出现了大于等于10个复杂度。建议根据

方法实现进行业务抽离。两个建议点(1. 方法单一职责 2. 方法可重复利用 3. 是否能用策略模式或者命令模式)


### 2.方法长度及宽度

长度: 方法的长度建议控制在80-120行以内。满足一屏可以放下。
宽度: 当方法超过3个及以上入参,建议使用对象封装(对象容易后期扩展,且不会出现眼花缭乱现象)


### 3.关注方法优化编辑器提示

减少出现黄色警告⚠️, 最好不要出现警告。编辑器的警告都是优化点,需要在编程时候考虑进去。

eg: 性能优化、命名不规范、重复代码

![img](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/21643544635/2678603850/7fbfc8ab-22ca-4f92-be04-31c4d1b704e3.png)

### 4.方法重复代码

贫血模型的标志性问题

重复代码编辑器会提出警告,此种现象,强烈建议不要出现





### 5. 方法注释

注释是必须要做的(先写注释在做实现)，重在设计。

代码是公司财产, 要对自己对公司对后人负责,先写注释再做实现。





## 四、项目依赖模型



### 1. 领域设计的认识

领域划分,用另外一个词形容也非常的合适,就是业务模块化。所有能力都进行能力化抽象,形成模块,形成领域。 当遇到新的业务逻辑,底层的数据结构和数据关系肯定也是一样的。那么就可以像堆积木一样,根据这些模块快速的组装成新的业务逻辑。快速的实现业务的迭代和升级。

关于这个问题,需要结合自己的业务系统来进行抽象和设计。



设计核心: 用面向对象的设计思想对业务进行解耦来做到领域划分。

### 2. 层次划分

#### 基础层(外部调用,db操作)

注意: 基础层只做适配不做业务

- db操作以dao结尾
- 外部调用以Client(Http协议)/Instruction(Rpc协议)
    - 改层仅仅做数据适配,不做业务处理。

#### 领域层(偏向领域的业务逻辑)

以Manager

#### 业务层(对领域层的业务编排)

以Service结尾

#### 外观层(可以提供能力,可以提供视图)。

以Resource、Facade结尾



有一个完善的领域层,可以方便快速便捷的对业务进行扩展。与其对立的就是贫血模型。没有领域层只有业务层,业务逻辑都堆积在业务层。典型的面向过程设计。



![img](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/21643544635/2678603850/8be6e99c-f5e9-4a8a-bce4-85f5aa3717e7.png)

### 3. 层次依赖模型

maven多模块应用和单模块应用通用。

一定要控制项目的依赖情况。

①service只能出现领域层的依赖, 领域层只能存在dao层和第三方服务层。

②各个层代码不能平行调用(出现平行调用逻辑,要抽象出领域层来封装)。



![img](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/a/21643544635/2678603850/c08a058d-8c81-45c4-bdc4-82d666a304f7.png)

具体代码体现就是

- 以Service命名的类,里面只能存在Manager
- 以Manager命名的类,里面只能存在Dao和Client(Http协议)/Instruction(Rpc协议)封装的第三方调用
- 以Dao命名的类是对数据库的操作
- 以Client(Http协议)/Instruction(Rpc协议)命名的类,作为适配层与第三方API进行交互封装



## 五、设计模式六大原则



代码编程时候要向以下这6大原则,进行向其靠拢。



### 1. 开闭原则

一个软件实体如类、模块和函数应该对扩展开放，对修改关闭。



**代码设计建议**

用抽象构建框架，用实现扩展细节因为抽象灵活性好，适应性广，只要抽象的合理，可以基本保持软件架构的稳定。



### 2. 单一职责

不要存在多于一个导致类变更的原因通俗的说，即一个类只负责一项职责。



**代码设计建议**

在具体方法编写或者类编写时候,类编写时候业务要单一,方法编写时候实现要单一

反例:

UserService 类中提供了获取商品信息的接口

setUserName(String name)方法的时候,对name的值进行了二次处理。



### 3. **里氏替换原则**

所有引用基类的地方必须能透明地使用其子类的对象。



**代码设计建议**

面向接口编程, 子类能透明替换父类。



### 4. **依赖倒置原则**

高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。



**代码设计建议**

要根据接口或者抽象去设计,不要依赖于细节,eg.项目中要换数据库,不用重新写底层的数据库代码. 就是使用了hibernate一样,替换方言就好了,因为hibernate是根据接口设计的,不同数据库有不同的实现,可以直接使用. eg2: 我生病了要去买药,如果A药铺,没有我就用B药铺买. 因为他们都是药铺,都有一样的功能,可以友好的替换



### **5. 接口隔离原则**

客户端不应该依赖它不需要的接口；一个类对另一个类的依赖应该建立在最小的接口上。



**代码设计建议**

保持最小的责任。

eg: 接口ConfigurableApplicationContext实现了Lifecycle和Closeable接口。他们其中每个里面定义的接口都很少,为什么不定义到一起呢?

首先第一责任清晰单一,第二做到接口隔离。



当某一个方法只用到生命周期的方法,那么方法就可以写成。

public void stop(Lifecycle lifecycle); 调用时候用->public void stop(new ConfigurableApplicationContext());

public void close(Closeable closeable); 调用时候用->public void close(new ConfigurableApplicationContext());



stop里面的实现就只能调用Lifecycle里面的方法,而不能调用ConfigurableApplicationContext里面的方法。从而来达到接口隔离原则



### 6. **迪米特法则**

一个对象应该对其他对象保持最少的了解。



**代码设计建议**

减少类与类之间的关系,接口隔离也可以做到。



## 六、版本迭代

master分支版本后缀 ${大版本号}.${0进位}.${迭代版本号}.RELEASE

test分支版本号 ${大版本号}.${0进位}.${迭代版本号}.SNAPSHOP



迭代版本可追踪，避免出现jar包覆盖无法追踪



迭代版本升级,必须升级迭代版本号。避免出现jar包覆盖无法追踪



### 1. 大版本定义

APP1.0  APP2.0 APP3.0



### 2. 迭代版本号

APP1.0.1  APP1.0版本的第一个迭代

APP1.1.0  APP1.0版本的第十个迭代

APP2.0.2  APP2.0版本的第二个迭代

APP2.1.0  APP2.0版本的第十个迭代





## 七、代码格式化

统一格式化模板,解决多人共同开发场景,代码格式化导致的git提交冲突问题






最后求关注,求订阅,谢谢你的阅读!


![](https://img.springlearn.cn/blog/learn_1589360371000.png)
