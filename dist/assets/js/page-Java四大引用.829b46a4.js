(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{643:function(t,_,v){"use strict";v.r(_);var a=v(1),r=Object(a.a)({},(function(){var t=this,_=t.$createElement,v=t._self._c||_;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("p",[v("img",{attrs:{src:"https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png",alt:"",loading:"lazy"}})]),t._v(" "),v("p",[v("strong",[t._v("作者")]),t._v(": 西魏陶渊明\n"),v("strong",[t._v("博客")]),t._v(": "),v("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://blog.springlearn.cn/"),v("OutboundLink")],1)]),t._v(" "),v("div",{staticClass:"custom-block tip"},[v("p",{staticClass:"custom-block-title"},[t._v("西魏陶渊明")]),t._v(" "),v("p",[t._v("莫笑少年江湖梦，谁不少年梦江湖")])]),t._v(" "),v("h1",{attrs:{id:"一、概念"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#一、概念"}},[t._v("#")]),t._v(" 一、概念")]),t._v(" "),v("h2",{attrs:{id:"_1-强引用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-强引用"}},[t._v("#")]),t._v(" 1. 强引用")]),t._v(" "),v("p",[t._v("new 对象并指向引用变量的都是强引用,开发中大部分都是强引用。对于强引用,JVM宁愿报错"),v("code",[t._v("OutOfMemoryError")]),t._v("错误,是程序异常终止,\n也不会回收强引用来解决内存, 对这类情况,可以通过赋值强引用对象=null,从而被JVM回收。\n但是一般我们在方法中定义的强引用,会存在方法栈中,当方法运行完,退出,此时方法中的强引用也会因为引用数为0,从而被回收。")]),t._v(" "),v("h2",{attrs:{id:"_2-软引用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-软引用"}},[t._v("#")]),t._v(" 2. 软引用")]),t._v(" "),v("p",[t._v("在内存充足情况下,GC不会回收软引用对象,如果内存空间不足了,才会回收这些对象的内存。也正因为这个特性,所以软引用经常用作缓存对象使用。")]),t._v(" "),v("h2",{attrs:{id:"_3-弱引用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-弱引用"}},[t._v("#")]),t._v(" 3. 弱引用")]),t._v(" "),v("p",[t._v("任意GC都会清理掉软引用对象,弱引用是最容易记的,任何的GC动作都会将弱引用对象给回收掉。")]),t._v(" "),v("h2",{attrs:{id:"_4-虚引用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-虚引用"}},[t._v("#")]),t._v(" 4. 虚引用")]),t._v(" "),v("p",[t._v("和其他三个不一样,这个不对生命周期,有影响,而是当要回收时候,加入到Queue队列中")]),t._v(" "),v("h1",{attrs:{id:"二、在jdk中的体现"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#二、在jdk中的体现"}},[t._v("#")]),t._v(" 二、在JDK中的体现")]),t._v(" "),v("table",[v("thead",[v("tr",[v("th",[t._v("类")]),t._v(" "),v("th",[t._v("引用说明")]),t._v(" "),v("th",[t._v("用途")]),t._v(" "),v("th",[t._v("生存时间")]),t._v(" "),v("th",[t._v("被垃圾回收时间")])])]),t._v(" "),v("tbody",[v("tr",[v("td",[t._v("Object")]),t._v(" "),v("td",[t._v("默认new出来的都是强引用")]),t._v(" "),v("td",[t._v("对象正常状态")]),t._v(" "),v("td",[t._v("JVM停止或者无引用被回收")]),t._v(" "),v("td",[t._v("无任务对象使用")])]),t._v(" "),v("tr",[v("td",[t._v("SoftReference")]),t._v(" "),v("td",[t._v("软引用")]),t._v(" "),v("td",[t._v("常用作缓存")]),t._v(" "),v("td",[t._v("当内存不足时候终止")]),t._v(" "),v("td",[t._v("内存不足时候回收")])]),t._v(" "),v("tr",[v("td",[t._v("WeakReference")]),t._v(" "),v("td",[t._v("弱引用")]),t._v(" "),v("td",[t._v("常用作缓存")]),t._v(" "),v("td",[t._v("垃圾回收后终止")]),t._v(" "),v("td",[t._v("任何垃圾回收时")])]),t._v(" "),v("tr",[v("td",[t._v("PhantomReference")]),t._v(" "),v("td",[t._v("虚引用")]),t._v(" "),v("td",[t._v("用于跟踪对象是否被回收")]),t._v(" "),v("td",[t._v("垃圾回收后终止")]),t._v(" "),v("td",[t._v("任何垃圾回收时")])])])]),t._v(" "),v("p",[t._v("最后求关注,求订阅,谢谢你的阅读!")]),t._v(" "),v("p",[v("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1589360371000.png",alt:"",loading:"lazy"}})])])}),[],!1,null,null,null);_.default=r.exports}}]);