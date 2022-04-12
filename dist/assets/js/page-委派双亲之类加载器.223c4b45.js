(window.webpackJsonp=window.webpackJsonp||[]).push([[85],{621:function(s,a,t){"use strict";t.r(a);var r=t(1),n=Object(r.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589811713000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("p",[t("strong",[s._v("作者")]),s._v(": 西魏陶渊明\n"),t("strong",[s._v("博客")]),s._v(": "),t("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://blog.springlearn.cn/"),t("OutboundLink")],1)]),s._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("西魏陶渊明")]),s._v(" "),t("p",[s._v("莫笑少年江湖梦，谁不少年梦江湖")])]),s._v(" "),t("ul",[t("li",[s._v("BootStrap ClassLoader：称为启动类加载器，是Java类加载层次中最顶层的类加载器，负责加载JDK中的核心类库，如：rt.jar、resources.jar、charsets.jar等，可通过如下程序获得该类加载器从哪些地方加载了相关的jar或class文件：")]),s._v(" "),t("li",[s._v("Extension ClassLoader：称为扩展类加载器，负责加载Java的扩展类库，默认加载JAVA_HOME/jre/lib/ext/目下的所有jar。")]),s._v(" "),t("li",[s._v("App ClassLoader：称为系统类加载器，负责加载应用程序classpath目录下的所有jar和class文件。")])]),s._v(" "),t("h2",{attrs:{id:"一、类加载器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、类加载器"}},[s._v("#")]),s._v(" 一、类加载器")]),s._v(" "),t("p",[s._v("类的加载在JVM的外部实现。对于任意的一个类，都必须由加载它的类加载器和这个类本身共同确立其在Java虚拟机中的唯一性。JVM提供中类加载器。")]),s._v(" "),t("h2",{attrs:{id:"二、启动类加载器-bootstrap-classloader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、启动类加载器-bootstrap-classloader"}},[s._v("#")]),s._v(" 二、启动类加载器（Bootstrap ClassLoader）")]),s._v(" "),t("p",[s._v("负责加载 JAVA_HOME\\lib 目录中的，或通过-Xbootclasspath 参数指定路径中的，且被 虚拟机认可（按文件名识别，如 rt.jar）的类。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589811324000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("h2",{attrs:{id:"三、扩展类加载器-extension-classloader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#三、扩展类加载器-extension-classloader"}},[s._v("#")]),s._v(" 三、扩展类加载器(Extension ClassLoader)")]),s._v(" "),t("p",[s._v("负责加载 JAVA_HOME\\lib\\ext 目录中的，或通过 java.ext.dirs 系统变量指定路径中的类 库。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589811366000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("h2",{attrs:{id:"四、应用程序类加载器-application-classloader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#四、应用程序类加载器-application-classloader"}},[s._v("#")]),s._v(" 四、应用程序类加载器(Application ClassLoader)")]),s._v(" "),t("p",[s._v("负责加载用户路径（classpath）上的类库。 JVM 通过双亲委派模型进行类的加载，当然我们也可以通过继承 java.lang.ClassLoader 实现自定义的类加载器。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589811400000.png",alt:"",loading:"lazy"}})]),s._v(" "),t("h2",{attrs:{id:"五、原理解释"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#五、原理解释"}},[s._v("#")]),s._v(" 五、原理解释")]),s._v(" "),t("p",[s._v("ClassLoader使用的是双亲委托模型来搜索类的，每个ClassLoader实例都有一个父类加载器的引用（不是继承的关系，是一个包含的关系），虚拟机内置的类加载器（Bootstrap ClassLoader）本身没有父类加载器，但可以用作其它ClassLoader实例的的父类加载器。当一个ClassLoader实例需要加载某个类时，它会试图亲自搜索某个类之前，先把这个任务委托给它的父类加载器，这个过程是由上至下依次检查的，首先由最顶层的类加载器Bootstrap ClassLoader试图加载，如果没加载到，则把任务转交给Extension ClassLoader试图加载，如果也没加载到，则转交给App ClassLoader 进行加载，如果它也没有加载得到的话，则返回给委托的发起者，由它到指定的文件系统或网络等URL中加载该类。如果它们都没有加载到这个类时，则抛出ClassNotFoundException异常。否则将这个找到的类生成一个类的定义，并将它加载到内存当中，最后返回这个类在内存中的Class实例对象。")]),s._v(" "),t("h2",{attrs:{id:"六、为什么要使用双亲委托这种模型呢"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#六、为什么要使用双亲委托这种模型呢"}},[s._v("#")]),s._v(" 六、为什么要使用双亲委托这种模型呢？")]),s._v(" "),t("p",[s._v("因为这样可以避免重复加载，当父亲已经加载了该类的时候，就没有必要子ClassLoader再加载一次。考虑到安全因素，我们试想一下，如果不使用这种委托模式，那我们就可以随时使用自定义的String来动态替代java核心api中定义的类型，这样会存在非常大的安全隐患，而双亲委托的方式，就可以避免这种情况，因为String已经在启动时就被引导类加载器（Bootstrcp ClassLoader）加载，所以用户自定义的ClassLoader永远也无法加载一个自己写的String，除非你改变JDK中ClassLoader搜索类的默认算法。")]),s._v(" "),t("h2",{attrs:{id:"七、但是jvm在搜索类的时候-又是如何判定两个class是相同的呢"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#七、但是jvm在搜索类的时候-又是如何判定两个class是相同的呢"}},[s._v("#")]),s._v(" 七、但是JVM在搜索类的时候，又是如何判定两个class是相同的呢？")]),s._v(" "),t("p",[s._v("JVM在判定两个class是否相同时，不仅要判断两个类名是否相同，而且要判断是否由同一个类加载器实例加载的。只有两者同时满足的情况下，JVM才认为这两个class是相同的。就算两个class是同一份class字节码，如果被两个不同的ClassLoader实例所加载，JVM也会认为它们是两个不同class。")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v(" /**\n         * rt目录:\n         * 加载rt.jar的类加载器\n         */\n        ClassLoader rtClassLoader = StringBuffer.class.getClassLoader();\n        System.out.println(rtClassLoader);\n\n        /**\n         * lib/ext扩展包\n         * sun.misc.Launcher$ExtClassLoader@67b6d4ae\n         */\n        ClassLoader extClassLoader = EventID.class.getClassLoader();\n        System.out.println(extClassLoader);\n\n        /**\n         * 当前应用加载器\n         * sun.misc.Launcher$AppClassLoader@33909752\n         */\n        ClassLoader classLoader = BaseSyntaxTest.class.getClassLoader();\n        System.out.println(classLoader);\n\n        /**\n         * sun.misc.Launcher$AppClassLoader@33909752\n         */\n        ClassLoader currentClassLoader = Thread.currentThread().getContextClassLoader();\n        System.out.println(currentClassLoader);\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br")])]),t("p",[s._v("最后求关注,求订阅,谢谢你的阅读!")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589360371000.png",alt:"",loading:"lazy"}})])])}),[],!1,null,null,null);a.default=n.exports}}]);