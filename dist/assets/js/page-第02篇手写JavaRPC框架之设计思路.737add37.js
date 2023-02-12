(window.webpackJsonp=window.webpackJsonp||[]).push([[172],{742:function(t,s,a){"use strict";a.r(s);var n=a(1),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[a("img",{attrs:{src:"https://img-blog.csdnimg.cn/img_convert/9f4a43fd785d69552fbe2f0463b3bd72.png",alt:"",loading:"lazy"}})]),t._v(" "),a("blockquote",[a("p",[t._v("天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img-blog.csdnimg.cn/img_convert/10e3b1ba78ed2cd6afb33928df91a52f.gif",alt:"",loading:"lazy"}})]),t._v(" "),a("h2",{attrs:{id:"一、前言"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、前言"}},[t._v("#")]),t._v(" 一、前言")]),t._v(" "),a("p",[t._v('隔壁老李又在喷我了: "完犊子了，小编这绝对是为了骗粉丝，而水的一篇文章，到了第二篇竟然还没有开始写代码，又是一篇纯概念文章"。')]),t._v(" "),a("p",[a("strong",[t._v("我也想写代码，但是在没有讲清楚思路之前，一定不要上来就蛮干")]),t._v("，不然就毫无设计可言了。小编向各位观众老爷保证，下一篇文章绝对上代码。")]),t._v(" "),a("p",[t._v("本篇文章非常重要，这是我们本系列文章中的重中之重，本篇文章的主要内容就是设计我们自己的通信协议及架构，可以这样说如果没有了本篇文章的内容，就不可能实现RPC。因为RPC的最基本要求就是能实现远程通信。本篇文章是讲述通信层的设计思路，下一篇就是实战的编写。(ps: 其实下一篇比较好写，因为代码我早就写完了嘻嘻，而这一篇竟然酝酿了一周还写的...不忍直视)")]),t._v(" "),a("h2",{attrs:{id:"二、目标"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、目标"}},[t._v("#")]),t._v(" 二、目标")]),t._v(" "),a("p",[t._v("本篇文章主要会围绕以下三方面展开叙述，希望在通读全篇后，大家都能在脑子中形成对这三个方面的认识，因为下面的三个方面是通信层搭建的主要指导思想。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/84baeb78cd51f010734381a55106c4d5.png",alt:"",loading:"lazy"}})]),t._v(" "),a("ol",[a("li",[t._v("设计我们自己的通信协议")]),t._v(" "),a("li",[t._v("确定我们的通信层的架构")]),t._v(" "),a("li",[t._v("确定我们的工程结构")])]),t._v(" "),a("h3",{attrs:{id:"_2-1-为什么我们要设计自己的通信协议呢"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-为什么我们要设计自己的通信协议呢"}},[t._v("#")]),t._v(" 2.1 为什么我们要设计自己的通信协议呢?")]),t._v(" "),a("p",[t._v("上一篇我们也说了，实现RPC可以基于http也可以基于tcp。他们各有各的好处，如果是基于http其实我们的挑战就相对比较小一些，因为实现http的协议已经是在太多了，我们只用通过代理进行层层封装即可，而我们之所以要自己实现通信协议就是。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/93db862c16863e2929f8f3fdef2f4fbf.png",alt:"",loading:"lazy"}}),t._v("\n作为Java程序猿还是要对底层通信协议的具体实现有点了解的。如果不了解的话也没关系，你只要知道他是二进制数据就可以了。"),a("strong",[t._v("我们一步一步通过代码编写将二进制数据转换成我们Java语言能够认识的数据就好了")]),t._v("。如果这个过程你学会了，那么一通百通，http如何实现的其实大概也能知道猜到一点。")]),t._v(" "),a("h3",{attrs:{id:"_2-2-为什么要讲通信层的架构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-为什么要讲通信层的架构"}},[t._v("#")]),t._v(" 2.2 为什么要讲通信层的架构？")]),t._v(" "),a("p",[a("strong",[t._v("怎么理解架构？")])]),t._v(" "),a("p",[t._v("作为一个有经验的开发者，都会清楚，我们写代码就如同写文章。好的代码一定是思路清晰的，思路清晰的代码耦合性一定是很少的。我们举一个例子，最近大环境不好，大厂裁员较多，很多小伙伴都要面试吧，就举一个面试的问题，通过这个例子来解释下什么是架构。")]),t._v(" "),a("ul",[a("li",[t._v("面试官说: 同学做一下自我介绍吧。")])]),t._v(" "),a("p",[t._v("首先我们不能懵啊，如果懵了就说明没有头绪了，这样就容易讲乱，没有头绪在开发过程中的体现就是代码写的杂乱。比如你在介绍家乡的时候突然穿插了一下爱好，而在讲爱好的时候，又穿插的讲了一下家乡。这样就会导致主题不分明，听者会感觉会乱。所以这里我们就需要 "),a("strong",[t._v("单一职责")]),t._v("。首先定义清楚你的讲话的结构，然后每个结构点就一个职责。")]),t._v(" "),a("p",[t._v("如下我们设计的面试架构是这些点:")]),t._v(" "),a("p",[t._v("姓名，家乡，大学，专业，兴趣爱好，单位职称 .")]),t._v(" "),a("p",[t._v("下面我们只用实现每个点的内容(主题清晰)，最终将他组装成完成的自我介绍回答;")]),t._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 姓名，家乡，大学，专业，兴趣爱好，单位职称 ")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("interface")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 这是一个介绍类,负责介绍自己")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("XiaoMing")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将任务进行拆分,拆分的维度是逻辑顺序,然后抽离出方法,抽离的维度是单一职责。")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 这样的好处是工能化,模块化,便于复用。")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduce")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我叫小明"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 主题介绍家乡")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceHometown")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 主题介绍学校")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceSchool")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 主题介绍专业")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceMajor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 主题介绍兴趣爱好")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceInterest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"从业xx年,目前在公司的职称是xxx"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n     \n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceHometown")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我的老家是河南南阳"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我的家乡就坐落在河南南阳邓州市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"邓州市一个美丽的城市,是中国邓姓的发源地"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"邓州也是河南境内人口最多的一个县级城市"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceSchool")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我大学是在河南大学"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v('"河南大学简称河大，是一所位于中国河南省开封市涵盖文、史、哲、经、管、\n         法、理、工、医、农、教育、艺术等'),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("12")]),t._v('个学科门类的省部共建型综合性公立大学。"'),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceMajor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我的专业是计算机与信息工程"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n     \n     "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("introduceInterest")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n         "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"我的个人爱好是写博客、打游戏、做美食、偶会也会跑跑步"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n     "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br"),a("span",{staticClass:"line-number"},[t._v("19")]),a("br"),a("span",{staticClass:"line-number"},[t._v("20")]),a("br"),a("span",{staticClass:"line-number"},[t._v("21")]),a("br"),a("span",{staticClass:"line-number"},[t._v("22")]),a("br"),a("span",{staticClass:"line-number"},[t._v("23")]),a("br"),a("span",{staticClass:"line-number"},[t._v("24")]),a("br"),a("span",{staticClass:"line-number"},[t._v("25")]),a("br"),a("span",{staticClass:"line-number"},[t._v("26")]),a("br"),a("span",{staticClass:"line-number"},[t._v("27")]),a("br"),a("span",{staticClass:"line-number"},[t._v("28")]),a("br"),a("span",{staticClass:"line-number"},[t._v("29")]),a("br"),a("span",{staticClass:"line-number"},[t._v("30")]),a("br"),a("span",{staticClass:"line-number"},[t._v("31")]),a("br"),a("span",{staticClass:"line-number"},[t._v("32")]),a("br"),a("span",{staticClass:"line-number"},[t._v("33")]),a("br"),a("span",{staticClass:"line-number"},[t._v("34")]),a("br"),a("span",{staticClass:"line-number"},[t._v("35")]),a("br"),a("span",{staticClass:"line-number"},[t._v("36")]),a("br"),a("span",{staticClass:"line-number"},[t._v("37")]),a("br"),a("span",{staticClass:"line-number"},[t._v("38")]),a("br"),a("span",{staticClass:"line-number"},[t._v("39")]),a("br"),a("span",{staticClass:"line-number"},[t._v("40")]),a("br"),a("span",{staticClass:"line-number"},[t._v("41")]),a("br"),a("span",{staticClass:"line-number"},[t._v("42")]),a("br"),a("span",{staticClass:"line-number"},[t._v("43")]),a("br")])]),a("p",[t._v("有没有发现单一职责的设计，会很大程度提高我们的代码利用率呢? 我们要的就是这个效果，所以我们再开始编码之前，最好提前定义清楚我们的架构是怎么样的。")]),t._v(" "),a("p",[t._v("上面的例子，不知道小编有没有给大家解释清楚，但是总归我们的目的，是要在设计的时候就要"),a("strong",[t._v("明确责任划分，尽可能的单一职责")]),t._v("。尽可能的解耦。")]),t._v(" "),a("blockquote",[a("p",[t._v("要想设计一个好的框架，首先一定要有一个好的架构设计。这一点我们可以直接参考dubbo的设计架构。")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img-blog.csdnimg.cn/396bb113af4142e68e5ec42641d3ee7d.png",alt:"在这里插入图片描述",loading:"lazy"}}),t._v("\n上半部分不用看，我们只用看通信层就好了。")]),t._v(" "),a("ul",[a("li",[t._v("serialize 序列化层，负责将二进制数据转成Java认识的数据类型")]),t._v(" "),a("li",[t._v("transport 传输层，负责发送和接受数据")]),t._v(" "),a("li",[t._v("exchange 转换成，通信层和业务逻辑层转换的地方。")]),t._v(" "),a("li",[t._v("protocol 协议层，告诉serialize用什么协议来encode和decode数据的")])]),t._v(" "),a("p",[t._v("所以说，"),a("strong",[t._v("天下代码一大抄，抄来抄去有提高，就看你会抄不会抄了")]),t._v("。\n我们的设计就主要参考dubbo来了。")]),t._v(" "),a("h3",{attrs:{id:"_2-3-工程结构设计"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-3-工程结构设计"}},[t._v("#")]),t._v(" 2.3 工程结构设计")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/752095b0de45bc72e7b12a88ec4d48e8.png",alt:"",loading:"lazy"}})]),t._v(" "),a("p",[t._v("目前市面上的框架基本上都是自己来定制通信层，而通信层基本也不会单独的提供出去。但是本系列小编希望是通信层和业务能分开。通信层可以做RPC也可以利用通信层去实现消息队列或者是web容器。所以因为这个设计，就要求我们的项目能单独的去发布。所以我们整体的项目结构是由三个部分组成的，如下。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/e48f78a0091a911b5c8aecec3d528541.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h2",{attrs:{id:"三、核心知识点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、核心知识点"}},[t._v("#")]),t._v(" 三、核心知识点")]),t._v(" "),a("h3",{attrs:{id:"_3-1-通信层协议定义"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-通信层协议定义"}},[t._v("#")]),t._v(" 3.1 通信层协议定义")]),t._v(" "),a("p",[a("strong",[t._v("什么是协议呢?")])]),t._v(" "),a("p",[t._v("其实就是规则，我们按照什么样的方式将二进制数据转换成Java对象。")]),t._v(" "),a("p",[t._v("如下图，我们的一条数据会分为4个部分")]),t._v(" "),a("ol",[a("li",[t._v("第一部分占用一个字节是协议标记，用来标记是http协议还是自定义协议。")]),t._v(" "),a("li",[t._v("第二部分占用一个字节是序列化标记，用来确定我们的真实报文使用什么来进行序列化和反序列化。")]),t._v(" "),a("li",[t._v("第三部分占用四个字节，用来表示数据的字节长度，确定真实报文的长度。")]),t._v(" "),a("li",[t._v("第四部分长度不固定，是真实的传输数据。最终会通过第二部分将这些二进制数据转换成Java对象。")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/18634a291755ae51cd4e6ef64b0a8ac8.png",alt:"",loading:"lazy"}}),t._v("\n以上就是我们定义的数据解析协议，通过上面的规则将二进制数据，转换成Java对象。")]),t._v(" "),a("p",[a("strong",[t._v("读到这里你有没有一点收获呢?")])]),t._v(" "),a("p",[t._v("有没有发现，其实协议的概念，其实很简单，就是一个规则或者说是约定。能让彼此都互相认识的一个约定。")]),t._v(" "),a("p",[t._v("在本系列中，我们会自定义一个协议，同时也会兼容支持http协议。如果感兴趣，就跟着小编一起coding吧。")]),t._v(" "),a("h3",{attrs:{id:"_3-2-通信层架构设计"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-通信层架构设计"}},[t._v("#")]),t._v(" 3.2 通信层架构设计")]),t._v(" "),a("p",[t._v("前面说了，我们是站在巨人的肩膀上的，根据dubbo的设计思路和我们的目标，我们也来画一张图。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1600333949000.png",alt:"在这里插入图片描述",loading:"lazy"}}),t._v("\n我们的最终架构如上图。")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("包")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("作用")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("serialize")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("序列化协议层,包含了多种序列化协议")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("codec")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("数据解码器和编码器的具体实现层")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("exchange")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("API交换层,业务层API和通信层API交换数据的地方，负责将业务数据转换成二进制数据发送，也负责将二进制数据转换成业务数据返回")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("model")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("基础数据模型")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("business")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("提供给开发者用来实现业务的api")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("api")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("Fluent 风格的api, 这种风格的好处是不需要记住接下来的步骤和方法")])])])]),t._v(" "),a("h3",{attrs:{id:"_3-3-工程结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-工程结构"}},[t._v("#")]),t._v(" 3.3 工程结构")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/752095b0de45bc72e7b12a88ec4d48e8.png",alt:"",loading:"lazy"}})]),t._v(" "),a("p",[t._v("为了符合前面我们定的目标，所以我们要有一个大的工程。")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("项目名")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("职责")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("mojito-net")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("底层通信模块")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("mojito-rpc")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("rpc模块")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("mojito-spring-boot-starter")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("springboot自动化配置")])])])]),t._v(" "),a("p",[t._v("由此我们的项目诞生了。下一篇我们就开始手撸代码吧。")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v(".\n├── README.md\n├── mojito-net\n│   ├── pom.xml\n│   └── src\n│       ├── main\n│       │   ├── java\n│       │   └── resources\n│       └── test\n│           └── java\n├── mojito-rpc\n│   ├── pom.xml\n│   └── src\n│       ├── main\n│       │   ├── java\n│       │   └── resources\n│       └── test\n│           └── java\n├── mojito-spring-boot-starter\n│   ├── pom.xml\n│   └── src\n│       ├── main\n│       │   ├── java\n│       │   └── resources\n│       └── test\n│           └── java\n└── pom.xml\n\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br"),a("span",{staticClass:"line-number"},[t._v("15")]),a("br"),a("span",{staticClass:"line-number"},[t._v("16")]),a("br"),a("span",{staticClass:"line-number"},[t._v("17")]),a("br"),a("span",{staticClass:"line-number"},[t._v("18")]),a("br"),a("span",{staticClass:"line-number"},[t._v("19")]),a("br"),a("span",{staticClass:"line-number"},[t._v("20")]),a("br"),a("span",{staticClass:"line-number"},[t._v("21")]),a("br"),a("span",{staticClass:"line-number"},[t._v("22")]),a("br"),a("span",{staticClass:"line-number"},[t._v("23")]),a("br"),a("span",{staticClass:"line-number"},[t._v("24")]),a("br"),a("span",{staticClass:"line-number"},[t._v("25")]),a("br"),a("span",{staticClass:"line-number"},[t._v("26")]),a("br"),a("span",{staticClass:"line-number"},[t._v("27")]),a("br"),a("span",{staticClass:"line-number"},[t._v("28")]),a("br")])])])}),[],!1,null,null,null);s.default=e.exports}}]);