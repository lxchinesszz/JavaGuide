(window.webpackJsonp=window.webpackJsonp||[]).push([[102],{599:function(a,t,l){"use strict";l.r(t);var r=l(1),e=Object(r.a)({},(function(){var a=this,t=a.$createElement,l=a._self._c||t;return l("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[l("p",[l("img",{attrs:{src:"https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[l("strong",[a._v("作者")]),a._v(": 西魏陶渊明\n"),l("strong",[a._v("博客")]),a._v(": "),l("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[a._v("https://blog.springlearn.cn/"),l("OutboundLink")],1)]),a._v(" "),l("div",{staticClass:"custom-block tip"},[l("p",{staticClass:"custom-block-title"},[a._v("西魏陶渊明")]),a._v(" "),l("p",[a._v("莫笑少年江湖梦，谁不少年梦江湖")])]),a._v(" "),l("blockquote",[l("p",[a._v("[!TIP]\nJava多线程之隔离技术ThreadLocal源码详解")])]),a._v(" "),l("h1",{attrs:{id:"java多线程之隔离技术threadlocal源码详解"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#java多线程之隔离技术threadlocal源码详解"}},[a._v("#")]),a._v(" Java多线程之隔离技术ThreadLocal源码详解")]),a._v(" "),l("p",[l("strong",[a._v("本篇文章是对ThreadLocal和InheritableThreadLocal,TransmittableThreadLocal的原理和源码进行深入分析,并举例讲解,其中前两个是JDK自带的。原理相对比较简单,其解决了单线程环境和在单线程中又创建线程(父子线程)中线程隔离的问题, TransmittableThreadLocal主要是解决,线程池中线程复用的场景。全文涉及到源码比较多阅读起来需要动脑筋思考,文章前半部分比较简单,后半部分比较困难,注意看代码注释。有不懂的可以留言。")])]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529412918151862e9151ba",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("以上是百度百科检索到的描述,相信通过上面的描述大家已经有了一个大概的了解,也相信大多数开发人员对这个类也是比较了解的,小编首先从原理开始讲解,开始吧!")]),a._v(" "),l("h2",{attrs:{id:"_1-threadlocal-的原理是什么呢"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_1-threadlocal-的原理是什么呢"}},[a._v("#")]),a._v(" 1. ThreadLocal 的原理是什么呢 ?")]),a._v(" "),l("p",[a._v("其实就相当于一个Map集合,只不过这个Map 的Key是固定的,都是当前线程。\n"),l("strong",[a._v("它能解决什么问题呢? 它存在的价值是什么呢?")])]),a._v(" "),l("ul",[l("li",[a._v("它的存在就是为了线程隔离,让每个线程都能拥有属于自己的变量空间,线程之间互相不影响,为什么这么说呢? 看下代码就明白")])]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/15294130178426b9ba68b45",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("通过上面的代码,可以发现其实ThreadLocal的set()方法就相当于\n"),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/15294130624201011b98c5d",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("之所以能起到线程隔离的作用,是因为Key就是当前的线程,所以每个线程的值都是隔离的，就像上图那样。")]),a._v(" "),l("p",[a._v("其实并不是这样简单,之所以这样讲是为了,大家理解,其实这里的核心点在getMap中,从Thread中拿到一个Map，然后把value放到这个线程的map中")]),a._v(" "),l("p",[a._v("因为每个线程都有一个自己的Map，也就是threadLocals。从而起到了线程隔离的作用")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413112969790858fd09",alt:"",loading:"lazy"}}),a._v(" "),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/15294131130928909328961",alt:"",loading:"lazy"}})]),a._v(" "),l("h2",{attrs:{id:"_2-根据jdk原理-自己实现一个类似的"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_2-根据jdk原理-自己实现一个类似的"}},[a._v("#")]),a._v(" 2. 根据JDK原理,自己实现一个类似的")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/1529413164762e67c5cae45",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("测试用例")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/152941318828671381eeadc",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("Result:")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413210711e5595823b7",alt:"",loading:"lazy"}})]),a._v(" "),l("h2",{attrs:{id:"_3-单线程隔离"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_3-单线程隔离"}},[a._v("#")]),a._v(" 3. 单线程隔离")]),a._v(" "),l("p",[a._v("什么是单线程隔离，这个是小编自己想的名字,其实是为了和父子线程区分开来，上面我们演示的都是属于在单一线程的情况下的使用。")]),a._v(" "),l("h2",{attrs:{id:"_4-父子线程隔离"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_4-父子线程隔离"}},[a._v("#")]),a._v(" 4.父子线程隔离")]),a._v(" "),l("p",[a._v("什么是父子线程,需要解释下是，当我们创建一个线程,在线程内有去运行另一个线程的时候，作为子线程，如何去拿到父线程的私有属性呢?")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/15294132718636bd88455c1",alt:"",loading:"lazy"}}),a._v(" "),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413271771989993f0f7",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[l("strong",[a._v("我们怎么能拿到父线程的属性呢?")])]),a._v(" "),l("ul",[l("li",[a._v("我们看前面标记的①,在get()时候有一个getMap(),在②有一个createMap方法\n"),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413312687008ee8dca7",alt:"",loading:"lazy"}})])]),a._v(" "),l("p",[a._v("既然我们想拿到父线程的私有变量,那我们想在线程内创建线程时候,子线程能不能拿到父线程的的私有变量呢?")]),a._v(" "),l("p",[l("strong",[a._v("答案:当然是可以的,")])]),a._v(" "),l("p",[l("strong",[a._v("我们看Thread的源码的时候，可以找到这样两个属性")])]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/152941335122800b1bf88f6",alt:"",loading:"lazy"}}),a._v("\n那么它是如何实现继承的呢？我们可以在Thread的构造初始化init方法中，找到答案\n"),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/152941349280560c1a07a41",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[l("strong",[a._v("看到这里我们分析，为什么ThreadLocal不能把父线程的私有变量传递给子线程?")])]),a._v(" "),l("ol",[l("li",[a._v("因为getMap和createMap都是对threadLocals进行操作，而threadLocals变量是不能被继承的。")])]),a._v(" "),l("p",[a._v("那么我们怎么去实现能传递呢?")]),a._v(" "),l("p",[a._v("其实JDK是为我们实现了一套的,这个类就是InheritableThreadLocal,我们看他为什么能实现呢? 在看代码前，我们先自己思考下，是不是InheritableThreadLocal操作的是可继承的字段inheritableThreadLocals呢？答案也是肯定的")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/15294135331813f5f2b77fd",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("在父线程内创建子线程的时候,子线程会在拿到父线程中的可继承的私有变量空间属性,也就是inheritableThreadLocals字段。")]),a._v(" "),l("p",[l("strong",[a._v("测试用例")])]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/152941358189410391e60ee",alt:"",loading:"lazy"}}),a._v(" "),l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413587585a39d62e8a9",alt:"",loading:"lazy"}})]),a._v(" "),l("h2",{attrs:{id:"_5-线程池线程复用隔离"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_5-线程池线程复用隔离"}},[a._v("#")]),a._v(" 5. 线程池线程复用隔离")]),a._v(" "),l("p",[a._v("在解决上面的问题后，我们来研究一个更有难度的问题,就是线程池线程复用的情况，怎么实现?")]),a._v(" "),l("p",[a._v("为什么会遇到这个问题呢? 是因为在线程池中核心线程用完，并不会直接被回收,而是返回到线程池中，既然是重新利用，")]),a._v(" "),l("p",[a._v("那么久不会重新创建线程，不会创建线程，父子之间就不会传递(如果这点没有明白,请继续看上面父子线程)。")]),a._v(" "),l("p",[a._v("那么这时父子线程关系的ThreadLocal值传递已经没有意义。")]),a._v(" "),l("p",[a._v("那么根据这个原理 ，我们继续来深入研究一波。")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/152941368203290892a2f3c",alt:"",loading:"lazy"}}),a._v(" "),l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/1529413681980c41819c3c7",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[l("strong",[a._v("解决方案是什么呢？")])]),a._v(" "),l("div",{staticClass:"language- line-numbers-mode"},[l("pre",{pre:!0,attrs:{class:"language-text"}},[l("code",[a._v("在submit的时候把父线程copy给子线程\n\n在execute的时候结束后吧线程的ThreadLocal清理，就能解决这个问题\n")])]),a._v(" "),l("div",{staticClass:"line-numbers-wrapper"},[l("span",{staticClass:"line-number"},[a._v("1")]),l("br"),l("span",{staticClass:"line-number"},[a._v("2")]),l("br"),l("span",{staticClass:"line-number"},[a._v("3")]),l("br")])]),l("p",[a._v("上面是网上搜到的答案，小编在证实上面答案的时候走了很多坑，根本没有找到清理的代码。最后小编发现,根本就没有清理的代码，而是重新赋值的形式来实现清理。")]),a._v(" "),l("p",[a._v("到底是怎么来实现的呢？我们看TransmittableThreadLocal核心代码")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/15294137835549160937407",alt:"",loading:"lazy"}})]),a._v(" "),l("ol",[l("li",[l("p",[a._v("拿到创建线程时候的备份所有线程空间 【深复制】因为浅复制会结果会被修改")])]),a._v(" "),l("li",[l("p",[a._v("在执行时候将之前的备份恢复，将最新的值返回到backup变量中")])]),a._v(" "),l("li",[l("p",[a._v("执行完成后，再将backup最新的值重新写入到TransmittableThreadLocal中")])])]),a._v(" "),l("p",[a._v("代码看起来很简洁，但是理解起来并不容易，每一步都有很多细节？我们一个一个来看")]),a._v(" "),l("ol",[l("li",[a._v("copy方法。")])]),a._v(" "),l("p",[a._v("TransmittableThreadLocal内维护了一个holder保存所有TransmittableThreadLocal实例当set时候addValue方法")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/15294137826850f0a707402",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("如果还没添加就添加，null在这里只是占位,没有其他用，因为this就包含了所有值\n"),l("img",{attrs:{src:"http://p9.pstatp.com/large/pgc-image/15294137828914b65c93dde",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("copy方法就是将holder里面维护的TransmittableThreadLocal实例和值通过深复制的形式返回，为什么是深复制,因为引用复制可能会在其他地方值被修改。")]),a._v(" "),l("ol",{attrs:{start:"2"}},[l("li",[l("p",[a._v("backupAndSetToCopied方法从copide中恢复数据，然后新值返回出去，放到backup变量中")])]),a._v(" "),l("li",[l("p",[a._v("当线程已经执行完，在调用restoreBackup方法恢复backup变量中的值。")])])]),a._v(" "),l("p",[a._v("这点理解其他优点困难，尽管小编已经很努力的讲清楚，但是可以通过下面一个例子可以将以上几种方法的用处讲清。")]),a._v(" "),l("h4",{attrs:{id:"请注意文中的注释"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#请注意文中的注释"}},[a._v("#")]),a._v(" 请注意文中的注释!")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p1.pstatp.com/large/pgc-image/152941378383811d7b64d7d",alt:"",loading:"lazy"}})]),a._v(" "),l("h3",{attrs:{id:"问题"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[a._v("#")]),a._v(" 问题")]),a._v(" "),l("p",[a._v("子线程修改变量空间值，是否会影响父线程值？")]),a._v(" "),l("p",[a._v("答案：当然影响。因为子线程获取父线程的inheritableThreadLocals时候，方法ThreadLocal.createInheritedMap(parent.inheritableThreadLocals)其实是浅复制，也就是引用复制，其主要用途是从key.childValue，就是运行ThreadLocal的继承者，重写childValue方法，从而能改变父线程的本地空间ThreadLocal")]),a._v(" "),l("p",[l("img",{attrs:{src:"http://p3.pstatp.com/large/pgc-image/1529413784125d263a0718c",alt:"",loading:"lazy"}}),a._v(" "),l("img",{attrs:{src:"http://p9.pstatp.com/large/pgc-image/15294137837064b50ac393d",alt:"",loading:"lazy"}})]),a._v(" "),l("p",[a._v("交给子类去实现了")]),a._v(" "),l("p",[a._v("总结:")]),a._v(" "),l("ul",[l("li",[l("p",[a._v("ThreadLocal 基础实现 (原理: 保存着线程中)")])]),a._v(" "),l("li",[l("p",[a._v("inheritableThreadLocals 实现了父子直接的传递 （原理: 可继承的变量空间,在Thread初始化init方法时候给子赋值）")])]),a._v(" "),l("li",[l("p",[a._v("TransmittableThreadLocal 实现线程复用 (原理: 在每次线程执行时候重新给ThreadLocal赋值)")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);