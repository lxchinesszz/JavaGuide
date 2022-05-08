(window.webpackJsonp=window.webpackJsonp||[]).push([[143],{647:function(s,a,t){"use strict";t.r(a);var e=t(1),n=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1608963968000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("p",[t("strong",[s._v("作者")]),s._v(": 西魏陶渊明\n"),t("strong",[s._v("博客")]),s._v(": "),t("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://blog.springlearn.cn/"),t("OutboundLink")],1)]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("西魏陶渊明")]),s._v(" "),t("p",[s._v("莫笑少年江湖梦，谁不少年梦江湖")])]),s._v(" "),t("h1",{attrs:{id:"线程安全"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#线程安全"}},[s._v("#")]),s._v(" 线程安全")]),s._v(" "),t("blockquote",[t("p",[s._v("所谓发生线程安全其实是有一个前提条件,即当有多线程时候才会设计到线程安全,单线程是不存在线程安全的问题的。且只有在有状态对象中才会发生。")])]),s._v(" "),t("h2",{attrs:{id:"_1-什么叫有状态对象"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-什么叫有状态对象"}},[s._v("#")]),s._v(" 1. 什么叫有状态对象?")]),s._v(" "),t("h3",{attrs:{id:"_1-1-无状态对象"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-无状态对象"}},[s._v("#")]),s._v(" 1.1 无状态对象")]),s._v(" "),t("div",{staticClass:"language-java line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Home")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("say")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" message"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" message"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br")])]),t("h3",{attrs:{id:"_1-2-有状态对象"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-有状态对象"}},[s._v("#")]),s._v(" 1.2 有状态对象")]),s._v(" "),t("div",{staticClass:"language-java line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Home")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//实例变量")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" age "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("say")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" message"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" message "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("age"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("++")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])]),t("p",[s._v("为什么说无状态对象不会发生线程安全,线程对公共变量（实例变量，类变量）进行操作才会发生线程安全问题，而方法中变量是保存在每个线程的私有栈中的,所以不存在线程安全问题")]),s._v(" "),t("h2",{attrs:{id:"_2-什么时候要保证线程安全"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-什么时候要保证线程安全"}},[s._v("#")]),s._v(" 2. 什么时候要保证线程安全？")]),s._v(" "),t("ol",[t("li",[s._v("当变量属于实例,该实例被多线程操作")]),s._v(" "),t("li",[s._v("当多线程会影响到执行结果时候,需要保证线程安全")]),s._v(" "),t("li",[s._v("当变量属于共享属性时候需要保证线程安全,而方法内变量属于每个\n线程的空间,则不需要。")])]),s._v(" "),t("h2",{attrs:{id:"_3-如何保证线程安全"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-如何保证线程安全"}},[s._v("#")]),s._v(" 3. 如何保证线程安全？")]),s._v(" "),t("ol",[t("li",[s._v("原子性 lock操作,Syn...")]),s._v(" "),t("li",[s._v("可见性 volatile")]),s._v(" "),t("li",[s._v("顺序性 防止被重排序")])]),s._v(" "),t("h2",{attrs:{id:"_3-1-原子性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-原子性"}},[s._v("#")]),s._v(" 3.1 原子性")]),s._v(" "),t("p",[s._v("原子是世界上的最小单位，具有不可分割性。比如 a=0；（a非long和double类型） 这个操作是不可分割的，那么我们说这个操作时原子操作。再比如：a++； 这个操作实际是a = a + 1；是可分割的，所以他不是一个原子操作。非原子操作都会存在线程安全问题，需要我们使用同步技术（sychronized）来让它变成一个原子操作。")]),s._v(" "),t("h2",{attrs:{id:"_3-2-可见性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-可见性"}},[s._v("#")]),s._v(" 3.2 可见性")]),s._v(" "),t("p",[s._v("可见性，是指线程之间的可见性，一个线程修改的状态对另一个线程是可见的。也就是一个线程修改的结果。另一个线程马上就能看到。比如：用volatile修饰的变量，就会具有可见性。volatile修饰的变量不允许线程内部缓存和重排序，即直接修改内存。所以对其他线程是可见的。")]),s._v(" "),t("ul",[t("li",[s._v("volatile 本质是在告诉jvm当前变量在寄存器中的值是不确定的,需要从主存中读取,")]),s._v(" "),t("li",[s._v("synchronized 则是锁定当前变量,只有当前线程可以访问该变量,其他线程被阻塞住.")])]),s._v(" "),t("h2",{attrs:{id:"_3-3-那么什么时候用可见性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-那么什么时候用可见性"}},[s._v("#")]),s._v(" 3.3 那么什么时候用可见性？")]),s._v(" "),t("p",[s._v("当多线程并不直接进行原子性操作的时候，可以用 volatile 修饰,这样可以保证每个线程读取的都是最新的")]),s._v(" "),t("h2",{attrs:{id:"_3-4-什么时候用原子性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-什么时候用原子性"}},[s._v("#")]),s._v(" 3.4 什么时候用原子性?")]),s._v(" "),t("p",[s._v("当涉及到多个线程对同一个数据进行操作的时候，为了保证在同一刻只有一个操作，就用 synchronized 修饰加锁🔐")]),s._v(" "),t("h2",{attrs:{id:"_4-servlet线程安全问题思考"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-servlet线程安全问题思考"}},[s._v("#")]),s._v(" 4. Servlet线程安全问题思考")]),s._v(" "),t("p",[s._v("Servlet本身是无状态的，一个无状态的Servlet是绝对线程安全的，无状态对象设计也是解决线程安全问题的一种有效手段。")]),s._v(" "),t("p",[s._v("所以，servlet是否线程安全是由它的实现来决定的，如果它内部的属性或方法会被多个线程改变，它就是线程不安全的，反之，就是线程安全的。")]),s._v(" "),t("p",[s._v("在一个无状态的情况下，是不存在线程安全问题的，即使存在那也是跟它的实现类相关")]),s._v(" "),t("p",[s._v("在Servlet中避免使用实例变量是保证Servlet线程安全的最佳选择。")])])}),[],!1,null,null,null);a.default=n.exports}}]);