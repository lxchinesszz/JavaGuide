(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{692:function(a,t,s){"use strict";s.r(t);var n=s(1),e=Object(n.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("p",[s("img",{attrs:{src:"https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png",alt:"",loading:"lazy"}})]),a._v(" "),s("p",[s("strong",[a._v("作者")]),a._v(": 西魏陶渊明\n"),s("strong",[a._v("博客")]),a._v(": "),s("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[a._v("https://blog.springlearn.cn/"),s("OutboundLink")],1)]),a._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[a._v("西魏陶渊明")]),a._v(" "),s("p",[a._v("莫笑少年江湖梦，谁不少年梦江湖")])]),a._v(" "),s("blockquote",[s("p",[a._v("Java8所有的新特性基本基于函数式编程的思想，函数式编程给Java带来了注入了新鲜的活力。\n函数式编程其实并不是很难，小编在学习函数式编程时候刚开始一头雾水，最后仔细观察就发现了其中的小窍门，读了本篇文章如果还没有掌握，就算我输了")])]),a._v(" "),s("h1",{attrs:{id:"函数式编程"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#函数式编程"}},[a._v("#")]),a._v(" 函数式编程")]),a._v(" "),s("h2",{attrs:{id:"一、lambda表达式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一、lambda表达式"}},[a._v("#")]),a._v(" 一、Lambda表达式")]),a._v(" "),s("p",[s("strong",[a._v("注意")]),a._v(": 以下方法都可以使用表达式来进行缩写")]),a._v(" "),s("p",[a._v("我们来看Java中如何来定义一个方法")]),a._v(" "),s("h3",{attrs:{id:"_1-语法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-语法"}},[a._v("#")]),a._v(" 1. 语法")]),a._v(" "),s("p",[s("code",[a._v("()->{}")])]),a._v(" "),s("p",[a._v("其中小括号里面可以放入参，大括号就是方法体，里面也允许有返回值。")]),a._v(" "),s("p",[s("strong",[a._v("当方法体中只有返回值而没有其他语句时候，大括号和 "),s("code",[a._v("return")]),a._v(" 关键字都可以省略不写。")])]),a._v(" "),s("h3",{attrs:{id:"_2-方法引用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-方法引用"}},[a._v("#")]),a._v(" 2. 方法引用")]),a._v(" "),s("p",[s("em",[a._v("只要用.引用不报错的，都可以将.换成:")])]),a._v(" "),s("table",[s("thead",[s("tr",[s("th",[a._v("类型")]),a._v(" "),s("th",[a._v("语法")])])]),a._v(" "),s("tbody",[s("tr",[s("td",[a._v("1、引用静态方法")]),a._v(" "),s("td",[a._v("ClassName::staticMethodName")])]),a._v(" "),s("tr",[s("td",[a._v("2、引用构造函数")]),a._v(" "),s("td",[a._v("ClassName::new")])]),a._v(" "),s("tr",[s("td",[a._v("3、引用特定类型的实例方法")]),a._v(" "),s("td",[a._v("ClassName::instanceMethodName")])]),a._v(" "),s("tr",[s("td",[a._v("4、引用特定对象的实例方法")]),a._v(" "),s("td",[a._v("objectName::instanceMethodName")])])])]),a._v(" "),s("h2",{attrs:{id:"二、java8新增函数式接口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#二、java8新增函数式接口"}},[a._v("#")]),a._v(" 二、Java8新增函数式接口")]),a._v(" "),s("h3",{attrs:{id:"_1-predicate接口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-predicate接口"}},[a._v("#")]),a._v(" 1. Predicate接口")]),a._v(" "),s("p",[a._v("Predicate 接口只有一个参数，返回boolean类型。该接口包含多种默认方法来将Predicate组合成其他复杂的逻辑（比如：与，或，非）")]),a._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("Predicate<String> predicate = (s) -> s.length() > 0;\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br")])]),s("p",[a._v("根据前面的语法我们知道小括号里面可以放入参，大括号里面放出参，当大括号里面只有返回值时候，大括号和 "),s("code",[a._v("return")]),a._v(" 关键字也可以省略。如上。")]),a._v(" "),s("h3",{attrs:{id:"_2-function-接口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-function-接口"}},[a._v("#")]),a._v(" 2. Function 接口")]),a._v(" "),s("p",[a._v("Function 接口有一个参数并且返回一个结果，并附带了一些可以和其他函数组合的默认方法（compose, andThen）：")]),a._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("Function<Integer, Integer> function = (x) -> 2 * x;\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br")])]),s("p",[a._v("同理，这个接口有一个入参和出参，如果返回体重不包含其他逻辑，只有一个返回值，大括号和 "),s("code",[a._v("return")]),a._v(" 关键字也可以省略。如上。")]),a._v(" "),s("h3",{attrs:{id:"_3-supplier-接口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-supplier-接口"}},[a._v("#")]),a._v(" 3. Supplier 接口")]),a._v(" "),s("p",[a._v("Supplier 接口返回一个任意范型的值，和Function接口不同的是该接口没有任何参数")]),a._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("public class Main{\n    public static void main(String[] args) {\n        //构造方法\n        Supplier<Main> supplier = () -> new Main();\n        Supplier<Main> mainSupplier = Main::new;\n        Supplier<Main> mainSupplier1 = Main::staticMethod;\n    }\n    private static Main staticMethod() {\n        return new Main();\n    }\n}\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br"),s("span",{staticClass:"line-number"},[a._v("7")]),s("br"),s("span",{staticClass:"line-number"},[a._v("8")]),s("br"),s("span",{staticClass:"line-number"},[a._v("9")]),s("br"),s("span",{staticClass:"line-number"},[a._v("10")]),s("br"),s("span",{staticClass:"line-number"},[a._v("11")]),s("br")])]),s("p",[a._v("因为没有入参，所以小括号里面什么都不用写。当遇到这种情况，同样可以用上面其他两种来替换")]),a._v(" "),s("h3",{attrs:{id:"_4-consumer-接口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-consumer-接口"}},[a._v("#")]),a._v(" 4. Consumer 接口")]),a._v(" "),s("p",[a._v("Consumer 是一个只有入参，但是无出参的接口。")]),a._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v('public class Main {\n    public static void main(String[] args) {\n        List<String> dataList = Arrays.asList("1", "2");\n\n        //特定类的静态方法\n        dataList.forEach(Main::staticMethod);\n        dataList.forEach((x) -> System.out.println(x));\n        dataList.forEach(System.out::println);\n\n    }\n    private static void staticMethod(String name) {\n        System.out.println("对象静态方法引用:" + name);\n    }\n}\n')])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br"),s("span",{staticClass:"line-number"},[a._v("7")]),s("br"),s("span",{staticClass:"line-number"},[a._v("8")]),s("br"),s("span",{staticClass:"line-number"},[a._v("9")]),s("br"),s("span",{staticClass:"line-number"},[a._v("10")]),s("br"),s("span",{staticClass:"line-number"},[a._v("11")]),s("br"),s("span",{staticClass:"line-number"},[a._v("12")]),s("br"),s("span",{staticClass:"line-number"},[a._v("13")]),s("br"),s("span",{staticClass:"line-number"},[a._v("14")]),s("br")])]),s("h2",{attrs:{id:"三、快速记忆"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#三、快速记忆"}},[a._v("#")]),a._v(" 三、快速记忆")]),a._v(" "),s("p",[a._v("虽然新增的函数式接口并不多，但是想要一次性死记住，还是有一点点的难度。小编的学习方式是\n理解这记忆。")]),a._v(" "),s("table",[s("thead",[s("tr",[s("th",[a._v("类型")]),a._v(" "),s("th",[a._v("简记")])])]),a._v(" "),s("tbody",[s("tr",[s("td",[a._v("1、Predicate")]),a._v(" "),s("td",[a._v("条件类型")])]),a._v(" "),s("tr",[s("td",[a._v("2、Supplier")]),a._v(" "),s("td",[a._v("无入参，有出参")])]),a._v(" "),s("tr",[s("td",[a._v("3、Function")]),a._v(" "),s("td",[a._v("有入参，有出参")])]),a._v(" "),s("tr",[s("td",[a._v("4、Consumer")]),a._v(" "),s("td",[a._v("有入参，无出参")])])])]),a._v(" "),s("p",[a._v("最后求关注,求订阅,谢谢你的阅读!")]),a._v(" "),s("p",[s("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589360371000.png",alt:"",loading:"lazy"}})])])}),[],!1,null,null,null);t.default=e.exports}}]);