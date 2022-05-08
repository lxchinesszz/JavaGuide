(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{700:function(s,t,a){"use strict";a.r(t);var n=a(1),r=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1617880083000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("p",[s._v("沉淀、分享、成长、让自己和他人都有所收货。")]),s._v(" "),a("h2",{attrs:{id:"一、前言"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、前言"}},[s._v("#")]),s._v(" 一、前言")]),s._v(" "),a("p",[s._v("本系列文章主要的目的是提高大家对代码的单测意识, 其中文章主要会分享单测过程中,常见的测试场景及这些场景的解决方案和处理思路。\n为了能使大家更好的了解单元测试,作为程序员首先从源码入手,分享JUnit的运行原理。在先了解了JUnit的原理后,再来回顾我们的问题场景, 就自然而然的从根源深处解决大家的测单痛点以及大家对单测框架不熟悉的情况。")]),s._v(" "),a("h2",{attrs:{id:"二、单测的意义"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、单测的意义"}},[s._v("#")]),s._v(" 二、单测的意义")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1617886822000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("p",[s._v("很多人说单测没有意义, 这是完全不正确的思想。相信随着码龄增加你会越发的认同这句话。据国外研究统计软件系统中最大的成本是\n维护成本,所以你能看到凡是开源的框架单测一定是非常丰富的,因为它要去迭代升级,要去向下兼容版本。如果没有单测那就是完全的黑盒。\n是好是坏听从天意,这是没有质量保证的。这点是软件系统都具有的所以说就这一点,就证明了单测的必须性。下面谈几个不写单元测试的说法。")]),s._v(" "),a("h3",{attrs:{id:"_2-1-压缩开发时间-任务延期"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-压缩开发时间-任务延期"}},[s._v("#")]),s._v(" 2.1 压缩开发时间,任务延期")]),s._v(" "),a("p",[s._v("或许说中国的国情跟国外的不一样,中国的系统或者说是业务系统更新的快,单测用完就失效。写单测会压缩开发时间,导致任务延期。从眼下看是压缩了开发的时间,但是它提高了开发的质量,一定程度上减少了系统的维护成本。其次单测并不是说要对你所有的方法进行测试, 这个要针对业务系统情况,把系统的核心业务中使用到的核心方法进行详细的单测维护即可。系统的核心逻辑是不会经常变动的,\n所以这部分的单测就是你整个单测的核心。")]),s._v(" "),a("h3",{attrs:{id:"_2-2-公司性质"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-公司性质"}},[s._v("#")]),s._v(" 2.2 公司性质")]),s._v(" "),a("p",[s._v("像一般政府的项目基本都会给到外部的公司来竞争,部分的外包公司只注重交付,不注重质量。或者说这个项目就是一个xx工程, 没有实用价值。\n只要上线就行。也不用维护。对于这种的确实现状是都不会写单元测试。(因为整个项目就是没有任何实用价值)")]),s._v(" "),a("h3",{attrs:{id:"_2-3-别人都不写-我为啥要写"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-别人都不写-我为啥要写"}},[s._v("#")]),s._v(" 2.3 别人都不写,我为啥要写")]),s._v(" "),a("p",[s._v("代码是有温度的,养成好的习惯从自己做起。好习惯会传染,需要一个"),a("Highlight",{attrs:{color:"green"}},[s._v("好的带头人")]),s._v("。团队内部成员每个人都有自己负责的功能区域。\n只要每个人针对自己的功能区域的核心计算逻辑写好单测,那么一定是好处大于坏处的。另外要写在平时,不要专门找时间来写代码。那样就容易把单测当做是任务去完成,就失去了写单测的意义。")],1),s._v(" "),a("Highlight",{attrs:{color:"red"}},[s._v("相信你所认为虽然很正确,但是做起来很傻逼的事情,一定有人在默默的坚持着。努力做一个优秀的人。")]),s._v(" "),a("h3",{attrs:{id:"_2-4-代码都测完了-要测试干嘛"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-4-代码都测完了-要测试干嘛"}},[s._v("#")]),s._v(" 2.4 代码都测完了,要测试干嘛")]),s._v(" "),a("p",[s._v("自己测完了,要测试干嘛。首先如果你有这样的想法,那么一定是因为你不了解测试的工作。测试是开发的补充,他一定不是开发的保姆。测试\n是对应用或系统的整体场景或者说功能的验证, 他不能对你代码的最小单元进行验证。所谓代码的最小单元一定是开发同学最了解的,代码的最小单元\n就是你定义的代码块,方法,技术框架。这部分测试同学是无法帮你验证的。我们这里举一个例子。")]),s._v(" "),a("p",[s._v("软件工程师好比是盖大楼的,具体每一堵墙砖头如何摆放,房间如何设计,是否关注采光这是你设计师要干的事情,而测试好比质量验收,会看你整栋\n大楼是否有倾斜,水电煤气是否可以使用。测试同学并不了解所有的细节。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1618206722000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("p",[s._v("开发和测试看到的东西不是完全一样的,越往上测试的黑盒越大。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1618051810000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("h3",{attrs:{id:"_2-5-应付覆盖率指标"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-5-应付覆盖率指标"}},[s._v("#")]),s._v(" 2.5 应付覆盖率指标")]),s._v(" "),a("p",[s._v("当然如果公司对这个有要求,一定会有应付的办法。最差的情况就是全部都是为了应付而写代码。从价值观上来看,这是不对的。从实用性上来看这是没有任何价值的。那么如何解决这个办法呢? 价值观来保证咯。那么就需要一个指标了(非硬性指标), 把数据量化展示出来,作为应用质量的一个参考的因素。\n就算你全是应付而写,也一定有一定的价值。")]),s._v(" "),a("p",[s._v("另外要说一点的是"),a("Highlight",{attrs:{color:"red"}},[s._v("单测行覆盖率高不代表应用的质量就一定高,")]),s._v("但是单测行覆盖率低一定代表着这个应用出现质量问题的可能性就越大。\n这无疑增加了业务风险和测试成本。为了减少业务风险和测试成本,希望大家提高对单测的意识。")],1),s._v(" "),a("p",[a("strong",[s._v("那么我们在上升一点总结下如何提高应用的质量呢? 请看下文")])]),s._v(" "),a("h2",{attrs:{id:"三、应用质量的看法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、应用质量的看法"}},[s._v("#")]),s._v(" 三、应用质量的看法")]),s._v(" "),a("p",[s._v("应用质量如何来衡量, 这是一个完全可以通过指标来进行衡量的。那么究竟如何指标化呢? 这里首先对应用质量进行一个拆分。")]),s._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1617889750000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("p",[s._v("可以将应用质量分为两种:")]),s._v(" "),a("ol",[a("li",[s._v("代码编程质量(编程风格)")]),s._v(" "),a("li",[s._v("业务编程质量(业务是否清晰,异常场景的考虑)")])]),s._v(" "),a("h3",{attrs:{id:"_3-1-代码编程质量"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-代码编程质量"}},[s._v("#")]),s._v(" 3.1 代码编程质量")]),s._v(" "),a("p",[s._v("代码编程质量往往只的是开发人员的编程风格,基于团队成员风格的相似度。\n也可以说是代码的可读性,可维护性,方法的复杂度,方法的执行效率。这个是最容易指标化处理的。\n基于规则引擎,进行静态代码扫描就可以扫描出。Sonar 或者 阿里规约都可以完成。\n他们都会把问题分为四个等级Blocker, Critical, Major, Minor/Trivial。")]),s._v(" "),a("h4",{attrs:{id:"_3-1-1-blocker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-1-blocker"}},[s._v("#")]),s._v(" 3.1.1  Blocker")]),s._v(" "),a("p",[s._v("即系统无法执行、崩溃或严重资源不足、应用模块无法启动或异常退出、无法测试、造成系统不稳定。")]),s._v(" "),a("h4",{attrs:{id:"_3-1-2-critical"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-2-critical"}},[s._v("#")]),s._v(" 3.1.2 Critical")]),s._v(" "),a("p",[s._v("即影响系统功能或操作，主要功能存在严重缺陷，但不会影响到系统稳定性。")]),s._v(" "),a("h4",{attrs:{id:"_3-1-3-major"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-3-major"}},[s._v("#")]),s._v(" 3.1.3 Major")]),s._v(" "),a("p",[s._v("即界面、性能缺陷、兼容性。")]),s._v(" "),a("h4",{attrs:{id:"_3-1-4-minor-trivial"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-4-minor-trivial"}},[s._v("#")]),s._v(" 3.1.4 Minor/Trivial")]),s._v(" "),a("p",[s._v("即易用性及建议性问题。")]),s._v(" "),a("Highlight",{attrs:{color:"red"}},[s._v("质量分计算")]),s._v(" "),a("div",{staticClass:"custom-block danger"},[a("p",{staticClass:"custom-block-title"},[s._v("质量分计算")]),s._v(" "),a("p",[s._v("100-(Blocker"),a("em",[s._v("100+Critical")]),s._v("10+Major*1)/(代码数/100)")]),s._v(" "),a("ul",[a("li",[s._v("Blocker 占比100%,因为是比较严重的问题")]),s._v(" "),a("li",[s._v("Critical 低于Blocker占比10%")]),s._v(" "),a("li",[s._v("Major 性能缺陷占比1%")])])]),s._v(" "),a("h3",{attrs:{id:"_2-2-业务编程质量"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-业务编程质量"}},[s._v("#")]),s._v(" 2.2 业务编程质量")]),s._v(" "),a("ul",[a("li",[s._v("对软件设计的最小单位进行正确性检测，如函数或一个类的方法。")]),s._v(" "),a("li",[s._v("系统集成测试")])]),s._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1618206722000.png",alt:"",loading:"lazy"}})]),s._v(" "),a("h4",{attrs:{id:"_2-2-1-ut由开发同学保证"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-1-ut由开发同学保证"}},[s._v("#")]),s._v(" 2.2.1 UT由开发同学保证")]),s._v(" "),a("p",[s._v("开发同学进行最小单元测试, 数据如何进行衡量呢?")]),s._v(" "),a("p",[s._v("基于Jenkins的 "),a("code",[s._v("Jcoco")]),s._v(" 插件,会统计行覆盖率，类覆盖率，复杂方法覆盖率等。输出一个\n可视化的图表。")]),s._v(" "),a("h4",{attrs:{id:"_2-2-2-it由自动化测试同学编写"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-2-it由自动化测试同学编写"}},[s._v("#")]),s._v(" 2.2.2 IT由自动化测试同学编写")]),s._v(" "),a("h2",{attrs:{id:"四、代码编程质量例子"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#四、代码编程质量例子"}},[s._v("#")]),s._v(" 四、代码编程质量例子")]),s._v(" "),a("p",[s._v("面向对象的思想写入复用性高的代码")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 姓名，家乡，大学，专业，兴趣爱好，单位职称 ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("interface")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 这是一个介绍类,负责介绍自己")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("XiaoMing")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("implements")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我叫小明"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的老家是河南南阳"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的家乡就坐落在河南南阳邓州市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"邓州市一个美丽的城市,是中国邓姓的发源地"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"邓州也是河南境内人口最多的一个县级城市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我大学是在河南大学"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v('"河南大学简称河大，是一所位于中国河南省开封市涵盖文、史、哲、经、管、\n         法、理、工、医、农、教育、艺术等'),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("12")]),s._v('个学科门类的省部共建型综合性公立大学。"'),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的专业是计算机与信息工程"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的个人爱好是写博客、打游戏、做美食、偶会也会跑跑步"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"从业xx年,目前在公司的职称是xxx"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("XiaoMing")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("implements")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceHometown")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的老家是河南南阳"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的家乡就坐落在河南南阳邓州市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"邓州市一个美丽的城市,是中国邓姓的发源地"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"邓州也是河南境内人口最多的一个县级城市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceSchool")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我大学是在河南大学"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v('"河南大学简称河大，是一所位于中国河南省开封市涵盖文、史、哲、经、管、\n         法、理、工、医、农、教育、艺术等'),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("12")]),s._v('个学科门类的省部共建型综合性公立大学。"'),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceMajor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的专业是计算机与信息工程"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("private")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceInterest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我的个人爱好是写博客、打游戏、做美食、偶会也会跑跑步"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 将任务进行拆分,拆分的维度是逻辑顺序,然后抽离出方法,抽离的维度是单一职责。")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 这样的好处是工能化,模块化,便于复用。")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"我叫小明"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceHometown")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceSchool")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceMajor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("introduceInterest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"从业xx年,目前在公司的职称是xxx"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br"),a("span",{staticClass:"line-number"},[s._v("31")]),a("br"),a("span",{staticClass:"line-number"},[s._v("32")]),a("br"),a("span",{staticClass:"line-number"},[s._v("33")]),a("br"),a("span",{staticClass:"line-number"},[s._v("34")]),a("br"),a("span",{staticClass:"line-number"},[s._v("35")]),a("br"),a("span",{staticClass:"line-number"},[s._v("36")]),a("br"),a("span",{staticClass:"line-number"},[s._v("37")]),a("br"),a("span",{staticClass:"line-number"},[s._v("38")]),a("br"),a("span",{staticClass:"line-number"},[s._v("39")]),a("br"),a("span",{staticClass:"line-number"},[s._v("40")]),a("br"),a("span",{staticClass:"line-number"},[s._v("41")]),a("br"),a("span",{staticClass:"line-number"},[s._v("42")]),a("br"),a("span",{staticClass:"line-number"},[s._v("43")]),a("br"),a("span",{staticClass:"line-number"},[s._v("44")]),a("br"),a("span",{staticClass:"line-number"},[s._v("45")]),a("br"),a("span",{staticClass:"line-number"},[s._v("46")]),a("br"),a("span",{staticClass:"line-number"},[s._v("47")]),a("br"),a("span",{staticClass:"line-number"},[s._v("48")]),a("br"),a("span",{staticClass:"line-number"},[s._v("49")]),a("br"),a("span",{staticClass:"line-number"},[s._v("50")]),a("br"),a("span",{staticClass:"line-number"},[s._v("51")]),a("br"),a("span",{staticClass:"line-number"},[s._v("52")]),a("br"),a("span",{staticClass:"line-number"},[s._v("53")]),a("br"),a("span",{staticClass:"line-number"},[s._v("54")]),a("br"),a("span",{staticClass:"line-number"},[s._v("55")]),a("br"),a("span",{staticClass:"line-number"},[s._v("56")]),a("br"),a("span",{staticClass:"line-number"},[s._v("57")]),a("br"),a("span",{staticClass:"line-number"},[s._v("58")]),a("br")])]),a("p",[s._v("有人会说了,明明很简单就搞定了,为啥多写了这么多方法。这是因为你的思维没有转变过来,简单来说就是要\n学会用面向对象的方法去写代码,不要写面向过程的代码了。如果高级点说就是代码层面上的领域驱动。\n领域驱动和面向过程最大的相同就是思想上都是要对问题进行拆分成最小粒度,已解决代码冗余重复,以方便重复组装利用\n,以达到快速简单维护的目的。")])],1)}),[],!1,null,null,null);t.default=r.exports}}]);