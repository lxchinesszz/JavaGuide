(window.webpackJsonp=window.webpackJsonp||[]).push([[163],{657:function(a,s,n){"use strict";n.r(s);var t=n(1),r=Object(t.a)({},(function(){var a=this,s=a.$createElement,n=a._self._c||s;return n("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589361031000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[n("strong",[a._v("作者")]),a._v(": 西魏陶渊明\n"),n("strong",[a._v("博客")]),a._v(": "),n("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[a._v("https://blog.springlearn.cn/"),n("OutboundLink")],1)]),a._v(" "),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[a._v("西魏陶渊明")]),a._v(" "),n("p",[a._v("莫笑少年江湖梦，谁不少年梦江湖")])]),a._v(" "),n("p",[n("strong",[a._v("原子特性: 原子是最小的粒子,不可再分")])]),a._v(" "),n("p",[a._v("这并不是一个化学课,而是巧妙的借用了化学上的一个概念,即原子是最小的粒子,不可再分;原子操作也是不能再分的操作;\n为了能把这个讲明白,下文基本都是大白话,其实Java本来并不是很难,而是总有一些人喜欢把简单的概念给复杂化。小编不喜欢\n那种说辞,所以尽量简单易懂。如有问题,欢迎提出问题。共同交流进步,最后谢谢你的阅读。")]),a._v(" "),n("hr"),a._v(" "),n("h1",{attrs:{id:"举例说明原子操作重要性"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#举例说明原子操作重要性"}},[a._v("#")]),a._v(" 举例说明原子操作重要性")]),a._v(" "),n("p",[a._v("在很多场景中我们需要我们的操作是原子特性的,如果我们写的程序都是单线程的,其实我们没必要考虑原子操作。但是假如\n我们写多线程操作,或者是在Web服务中来更新对象属性,那么就必须要来考虑原子操作问题了。")]),a._v(" "),n("p",[a._v("举一个🌰例子A:")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v("int a = 1;\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br")])]),n("p",[a._v("可以看到程序对变量 "),n("code",[a._v("a")]),a._v(" 操作,其实是有多个步骤进行的。在单线程环境下基本不会发生任何问题\n"),n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589372995000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[a._v("举一个🌰例子B(单线程操作):")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('public class Tester {\n\n    private static Integer a = 1;\n\n    private static AtomicInteger aa = new AtomicInteger(1);\n\n    private static void restore() {\n        a = 1;\n        aa = new AtomicInteger(1);\n    }\n\n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++) {\n            test("第" + i + "次");\n            restore();\n        }\n    }\n\n    private static void test(String str) {\n        for (int i = 1; i <= 1000; i++) {\n            new Thread(() -> a = a + 1).start();\n            new Thread(() -> aa.addAndGet(1)).start();\n        }\n        System.out.print(str + "常规操作a=" + a);\n        System.out.println(" <===> "+str+"原子操作操作aa=" + aa);\n    }\n}\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br"),n("span",{staticClass:"line-number"},[a._v("17")]),n("br"),n("span",{staticClass:"line-number"},[a._v("18")]),n("br"),n("span",{staticClass:"line-number"},[a._v("19")]),n("br"),n("span",{staticClass:"line-number"},[a._v("20")]),n("br"),n("span",{staticClass:"line-number"},[a._v("21")]),n("br"),n("span",{staticClass:"line-number"},[a._v("22")]),n("br"),n("span",{staticClass:"line-number"},[a._v("23")]),n("br"),n("span",{staticClass:"line-number"},[a._v("24")]),n("br"),n("span",{staticClass:"line-number"},[a._v("25")]),n("br"),n("span",{staticClass:"line-number"},[a._v("26")]),n("br"),n("span",{staticClass:"line-number"},[a._v("27")]),n("br")])]),n("p",[a._v("规律:")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v("        /**\n         * i              i+1\n         * 1: a = 1 + 1 = 2\n         * 2: a = 2 + 1 = 3\n         * 3: a = 3 + 1 = 4\n         * 4: a = 4 + 1 = 5\n         * 5: a = 5 + 1 = 6\n         * 6: a = 6 + 1 = 7\n         * 7: a = 7 + 1 = 8\n         * 8: a = 8 + 1 = 9\n         * 9: a = 9 + 1 = 10\n         * 10:a = 10 + 1 = 11\n         */\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br")])]),n("p",[a._v("如上面代码变量a是基本类型,变量aa是原子类型,正常情况对a或者aa进行1000次操作结果都应该是\n"),n("code",[a._v("1001")]),a._v("。正常情况我们可以理解是单线程操作。结果也是没有问题的。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589380382000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[a._v("举一个🌰例子C(多线程操作):")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v('public class Tester {\n\n    private static Integer a = 1;\n\n    private static AtomicInteger aa = new AtomicInteger(1);\n\n    private static void restore() {\n        a = 1;\n        aa = new AtomicInteger(1);\n    }\n\n    public static void main(String[] args) throws Exception {\n        for (int i = 0; i < 10; i++) {\n            test("第" + i + "次");\n            restore();\n        }\n    }\n\n    private static void test(String str) throws Exception {\n        for (int i = 1; i <= 100; i++) {\n            new Thread(() -> a = a + 1).start();\n            new Thread(() -> a = a + 1).start();\n\n            new Thread(() -> aa.addAndGet(1)).start();\n            new Thread(() -> aa.addAndGet(1)).start();\n            Thread.sleep(1);\n        }\n        System.out.print(str + "常规操作a=" + a);\n        System.out.println(" <===> " + str + "原子操作操作aa=" + aa);\n    }\n    \n}\n\n')])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br"),n("span",{staticClass:"line-number"},[a._v("14")]),n("br"),n("span",{staticClass:"line-number"},[a._v("15")]),n("br"),n("span",{staticClass:"line-number"},[a._v("16")]),n("br"),n("span",{staticClass:"line-number"},[a._v("17")]),n("br"),n("span",{staticClass:"line-number"},[a._v("18")]),n("br"),n("span",{staticClass:"line-number"},[a._v("19")]),n("br"),n("span",{staticClass:"line-number"},[a._v("20")]),n("br"),n("span",{staticClass:"line-number"},[a._v("21")]),n("br"),n("span",{staticClass:"line-number"},[a._v("22")]),n("br"),n("span",{staticClass:"line-number"},[a._v("23")]),n("br"),n("span",{staticClass:"line-number"},[a._v("24")]),n("br"),n("span",{staticClass:"line-number"},[a._v("25")]),n("br"),n("span",{staticClass:"line-number"},[a._v("26")]),n("br"),n("span",{staticClass:"line-number"},[a._v("27")]),n("br"),n("span",{staticClass:"line-number"},[a._v("28")]),n("br"),n("span",{staticClass:"line-number"},[a._v("29")]),n("br"),n("span",{staticClass:"line-number"},[a._v("30")]),n("br"),n("span",{staticClass:"line-number"},[a._v("31")]),n("br"),n("span",{staticClass:"line-number"},[a._v("32")]),n("br"),n("span",{staticClass:"line-number"},[a._v("33")]),n("br")])]),n("p",[a._v("规律:")]),a._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[a._v("    /**\n     * i          2 * i + 1\n     * 1: a = 1 + 1 + 1 = 3\n     * 2: a = 3 + 1 + 1 = 5\n     * 3: a = 5 + 1 + 1 = 7\n     * 4: a = 7 + 1 + 1 = 9\n     * 5:                 11\n     * 6:                 13\n     * 7:                 15\n     * 8:                 17\n     * 9:                 19\n     * 10:                21\n     */\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br"),n("span",{staticClass:"line-number"},[a._v("12")]),n("br"),n("span",{staticClass:"line-number"},[a._v("13")]),n("br")])]),n("p",[a._v("多线程环境下操作会不会有问题呢? 出现了问题。我们看到使用常规操作的a变量出现了数据不一致情况。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589375176000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[a._v("实际上当循环的次数越多,出现错误的几率就越大,如下我们循环了1000次。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589375386000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("h1",{attrs:{id:"问题分析"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#问题分析"}},[a._v("#")]),a._v(" 问题分析")]),a._v(" "),n("p",[a._v("我们思考为什么基本类型进行多线程操作时候会出现这种情况呢? 其实问题答案最开始已经说了。 我们通过这张图\n就可以找到原因。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589372995000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[a._v("对变量的每次操作其实都有3个步骤")]),a._v(" "),n("ol",[n("li",[a._v("读取变量值")]),a._v(" "),n("li",[a._v("变量值操作")]),a._v(" "),n("li",[a._v("变量重新赋值。")])]),a._v(" "),n("p",[a._v("我们模拟一下错误的原因。")]),a._v(" "),n("p",[a._v("当A线程读取a=1,并对1+1。但是还未对变量重新赋值a=2的时候，\nB线程也读取了A还未赋值的变量,此时变量还是1,那么B线程因为读取了还未更新的数据,所以也做1+1的操作。然后B对a\n重新赋值了此时a=2,是B赋值的。这个时候A因为已经执行完了前两个步骤,最后也重新赋值了a=2。")]),a._v(" "),n("p",[a._v("这样数据就更新丢了。这就是因为数据更新不是原子性从而导致的问题。")]),a._v(" "),n("p",[a._v("因为数据更新丢了,所以出现了。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589380830000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("h1",{attrs:{id:"如何解决这种问题"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#如何解决这种问题"}},[a._v("#")]),a._v(" 如何解决这种问题")]),a._v(" "),n("p",[a._v("如何解决这种问题,其实很简单只要我们保证我们的操作是原子操作即可,简单来说就是将更新的三个步骤合并成一个步骤即可,在Java中JDK已经为我们提供了很多的\n原子操作每一个基本类型都对应一个原子操作。")]),a._v(" "),n("h2",{attrs:{id:"原子基础类"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原子基础类"}},[a._v("#")]),a._v(" 原子基础类")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589378016000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[n("strong",[a._v("原子基础类API")])]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589378409000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("h2",{attrs:{id:"原子数组类"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原子数组类"}},[a._v("#")]),a._v(" 原子数组类")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589378718000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[n("strong",[a._v("原子更新数组API")])]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589378583000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("h2",{attrs:{id:"原子引用类"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原子引用类"}},[a._v("#")]),a._v(" 原子引用类")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589379304000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[n("strong",[a._v("注意:")])]),a._v(" "),n("p",[a._v("想要原子的更新字段，需要两个步骤：")]),a._v(" "),n("p",[a._v("1.每次使用的时候必须使用静态方法newUpdater()创建一个更新器，并且需要设置想要更新的类和属性")]),a._v(" "),n("p",[a._v("2.更新类的字段（属性）必须使用public volatile修饰符")]),a._v(" "),n("h1",{attrs:{id:"最后我们看一下原子操作的原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#最后我们看一下原子操作的原理"}},[a._v("#")]),a._v(" 最后我们看一下原子操作的原理")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589379629000.png",alt:"",loading:"lazy"}})]),a._v(" "),n("p",[a._v("最后求关注,求订阅,谢谢你的阅读!")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589360371000.png",alt:"",loading:"lazy"}})])])}),[],!1,null,null,null);s.default=r.exports}}]);