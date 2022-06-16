(window.webpackJsonp=window.webpackJsonp||[]).push([[111],{768:function(s,n,t){"use strict";t.r(n);var a=t(1),e=Object(a.a)({},(function(){var s=this,n=s.$createElement,t=s._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("Djt"),s._v(" "),t("p",[t("strong",[s._v("本篇课程不来虚的,上来就是干活,现在发车。小编通过代码案例及比喻,带你一窥究竟。")])]),s._v(" "),t("h2",{attrs:{id:"为什么会有常量池的概念"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#为什么会有常量池的概念"}},[s._v("#")]),s._v(" 为什么会有常量池的概念?")]),s._v(" "),t("p",[s._v("不知道小伙伴们是否有思考过这个问题? 没有思考也无所谓,小编在这里类比一下,大家就会清晰了。\n什么是池? 我们听的最多的池,应该是数据库连接池. 为什么会有数据库连接池,其实就是为了节省资源,提高性能,防止重复创建连接,避免占用内存和网络资源。")]),s._v(" "),t("p",[s._v("常量池其实就是跟数据库连接池的目的都是一样的。那么他是如何实现的呢? 因为常量池是JVM的概念，源码我们也不好看,所以我们还以连接池来类比,请看下文。")]),s._v(" "),t("h2",{attrs:{id:"池化的目标就是缓存和管理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#池化的目标就是缓存和管理"}},[s._v("#")]),s._v(" 池化的目标就是缓存和管理")]),s._v(" "),t("p",[s._v("稍微提一点池化的概念,其实就是对资源做一个包装,在包装层来加一些对这个资源的属性信息,比如使用次数,最后操作时间,最长生命周期一样。然后通过后台线程对资源包装层的扫描,来对真实资源的做一个管理。Google的Guava的Cache就是这么做的,我们自己也可以利用 "),t("code",[s._v("common-pool2")]),s._v(" 工具包自己来做,或者说池化。")]),s._v(" "),t("h2",{attrs:{id:"jvm常量池就相当于一个缓存"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#jvm常量池就相当于一个缓存"}},[s._v("#")]),s._v(" JVM常量池就相当于一个缓存")]),s._v(" "),t("p",[s._v("常量就是不会改变的信息,那么既然是不会改变的信息,系统中只存在一份,就可以了。存在多份也是浪费内存资源。然而在Java中只要是new的信息都会在堆上开辟一个新的空间,为了解决这个问题,JVM中才出现了字符串常量池的概念。但是只有直接用"),t("code",[s._v('""')]),s._v("修饰的字符,才会被加入到常量池中,当再次用"),t("code",[s._v('""')]),s._v("创建的时候,会首先从常量池中去获取。")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v('String s1 = "1";\nString s2 = "1";\n//true\nSystem.out.print(s1==s2); \nString s3 = new String("1");\nString s4 = new String("1");\n//false\nSystem.out.print(s3==s4); \n')])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br")])]),t("p",[s._v("我们可以把常量池理解为一个Map<String,String>做的缓存容器。只不过这个缓存机制是有JVM使用C语言写的。我们看不到而已。")]),s._v(" "),t("h2",{attrs:{id:"string-intern-的使用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#string-intern-的使用"}},[s._v("#")]),s._v(" String.intern()的使用")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1567773914000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("p",[t("code",[s._v("new")]),s._v(" 出来的 "),t("code",[s._v("String")]),s._v(" 类型是否也能使用常量池呢? 当然可以,就是通过 "),t("code",[s._v("intern")]),s._v(" 方法\n这个方法的意思就是先到缓存中(也就是常量池中)查询当前对象是否存在,存在就返回常量池中地址,不存在就加入常量池。我们可以用一段伪代码来解释一波。")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v('        //双引号直接放入常量池\n        String s1 = "1";\n        String s2 = new String("1");\n        //false\n        System.out.println(s1 == s2);\n        //先到常量池中查询是否有”1“,存在就将常量池中对象返回,不存在就放到常量池中(此时常量池中存在s1)\n        //于是就将s1的值重新复制给s3,所以s1 == s3\n        String s3 = new String("1").intern();\n        //true\n        System.out.println(s1 == s3);\n')])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br")])])],1)}),[],!1,null,null,null);n.default=e.exports}}]);