(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{774:function(t,a,s){"use strict";s.r(a);var n=s(1),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("提示")]),t._v(" "),s("p",[t._v("什么是端点? 端点就是SpringBoot通过web或者jmx的方式向外部暴露应用的信息,或者上下文的信息。SpringCloud-Admin就是根据此技术来进行实现的。他们用到的技术就是@Endpoint，而不是通过自己@GetMapping之类进行实现的。下面小编就带大家一起来学习端点的使用。学会本文后在利用前面我们讲过的autoconfigure的自动化配置后，你就可以开发更高级的SpringBoot应用(非业务系统)。本教程将带你从业务系统开发者转变为研发系统开发者。")])]),t._v(" "),s("p",[t._v("用过SpringBoot的同学可能知道，SpringBoot有很多监控端点,比如当我们引入健康监控组件")]),t._v(" "),s("div",{staticClass:"language-xml line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-xml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("dependency")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("groupId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("org.springframework.boot"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("groupId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("artifactId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("spring-boot-starter-actuator"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("artifactId")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("version")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("2.6.7"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("version")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("dependency")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br")])]),s("p",[t._v("系统就会自动暴露出许多,web端口供外部调用，获取应用的信息，或者上下文的信息。")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://img.springlearn.cn/learn_010cf865b5c13bd4a2c855dbf383a81d.jpg",alt:"image-20190308191019856",loading:"lazy"}})]),t._v(" "),s("h2",{attrs:{id:"一、如何定义端点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一、如何定义端点"}},[t._v("#")]),t._v(" 一、如何定义端点")]),t._v(" "),s("p",[t._v("可以使用"),s("code",[t._v("@Endpoint")]),t._v(","),s("code",[t._v("@WebEndpoint")]),t._v(","),s("code",[t._v("@JmxEndpoint")]),t._v(",或者"),s("code",[t._v("EndpointWebExtension")]),t._v("来实现HTTP方式的端点,可以是传统SpringMVC也可以是最新的"),s("code",[t._v("Spring WebFlux")])]),t._v(" "),s("ul",[s("li",[s("p",[s("code",[t._v("@Endpoint")]),t._v("相当于"),s("code",[t._v("@WebEndpoint")]),t._v("和"),s("code",[t._v("@JmxEndpoint")]),t._v("的整合。web和jmx方式都支持")])]),t._v(" "),s("li",[s("p",[s("code",[t._v("@WebEndpoint")]),t._v(" 只会生成web的方式的端点监控")])])]),t._v(" "),s("p",[s("img",{attrs:{src:"https://img.springlearn.cn/learn_b2c367712133b4affaf175b38eaad3cc.jpg",alt:"image-20190308190517126",loading:"lazy"}})]),t._v(" "),s("ul",[s("li",[s("code",[t._v("JmxEndpoint")]),t._v(" 只会生成Jmx的方式监控")])]),t._v(" "),s("p",[s("img",{attrs:{src:"https://img.springlearn.cn/learn_6490cd4917d5633fbbe9b205eb191dde.jpg",alt:"image-20190308183731989",loading:"lazy"}})]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Operation")]),t._v(" "),s("th",[t._v("HTTP method")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("@ReadOperation")])]),t._v(" "),s("td",[s("code",[t._v("GET")])])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("@WriteOperation")])]),t._v(" "),s("td",[s("code",[t._v("POST")])])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("@DeleteOperation")])]),t._v(" "),s("td",[s("code",[t._v("DELETE")])])])])]),t._v(" "),s("h2",{attrs:{id:"二、路径规则"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#二、路径规则"}},[t._v("#")]),t._v(" 二、路径规则")]),t._v(" "),s("p",[t._v("默认的基础路径是"),s("code",[t._v("/actuator")]),t._v(",如果一个端点配置的路径是"),s("code",[t._v("sessions")]),t._v(",那么它的全路径就是"),s("code",[t._v("/actuator/sessions")])]),t._v(" "),s("div",{staticClass:"language-java line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Component")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@WebEndpoint")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("id "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sessions"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MyHealthEndpoint")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@ReadOperation")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Info")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Selector")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" name"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Info")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("name"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"23"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br")])]),s("p",[s("code",[t._v("@Selector")]),t._v(" 的含义是让这个路径变成"),s("code",[t._v("/actuator/sessions/{name}")]),t._v(" 我们能从路径上获取一个入参。")]),t._v(" "),s("h2",{attrs:{id:"三、相关配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#三、相关配置"}},[t._v("#")]),t._v(" 三、相关配置")]),t._v(" "),s("h3",{attrs:{id:"_3-1-自定义管理端点路径"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-自定义管理端点路径"}},[t._v("#")]),t._v(" 3.1 自定义管理端点路径")]),t._v(" "),s("p",[s("code",[t._v("management.endpoints.web.base-path = /manage")])]),t._v(" "),s("p",[t._v("此配置会将"),s("code",[t._v("/actuator/sessions/{name}")]),t._v("转换成"),s("code",[t._v("/manage/sessions/{name}")])]),t._v(" "),s("h3",{attrs:{id:"_3-2-自定义管理服务器地址"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-自定义管理服务器地址"}},[t._v("#")]),t._v(" 3.2 自定义管理服务器地址")]),t._v(" "),s("p",[t._v("默认端口和应用的端口是一致的,但是也可以通过配置的方式改变端口")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("management.server.port = 8081\nmanagement.server.address = 127.0.0.1\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br")])]),s("h3",{attrs:{id:"_3-3-激活端点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-激活端点"}},[t._v("#")]),t._v(" 3.3 激活端点")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("//激活所有的端点的web方式请求\nmanagement.endpoints.web.exposure.include=*\n//关闭端点web方式\nmanagement.endpoints.web.exposure.exclude=env,beans\n//激活所有的JMX方式请求\nmanagement.endpoints.jmx.exposure.include=*\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br")])]),s("h3",{attrs:{id:"_3-4-跨域方式请求"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-跨域方式请求"}},[t._v("#")]),t._v(" 3.4 跨域方式请求")]),t._v(" "),s("div",{staticClass:"language- line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("//允许跨域的网址\nmanagement.endpoints.web.cors.allowed-origins=http://example.com\n//允许跨域的方法\nmanagement.endpoints.web.cors.allowed-methods=GET,POST\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br")])]),s("h2",{attrs:{id:"四、总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#四、总结"}},[t._v("#")]),t._v(" 四、总结")]),t._v(" "),s("p",[t._v("最后我们来总结。\n其实@WebEndpoint 就相当于"),s("code",[t._v("声明成一个@RestController")]),t._v("的控制类而请求方法分别被下面注解代替。")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("Operation")]),t._v(" "),s("th",[t._v("HTTP method")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v("@ReadOperation")])]),t._v(" "),s("td",[s("code",[t._v("GET")])])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("@WriteOperation")])]),t._v(" "),s("td",[s("code",[t._v("POST")])])]),t._v(" "),s("tr",[s("td",[s("code",[t._v("@DeleteOperation")])]),t._v(" "),s("td",[s("code",[t._v("DELETE")])])])])])])}),[],!1,null,null,null);a.default=e.exports}}]);