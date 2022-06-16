(window.webpackJsonp=window.webpackJsonp||[]).push([[127],{704:function(s,a,t){"use strict";t.r(a);var n=t(1),r=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[s._v("jmvn export 数据模型导出")]),s._v(" "),t("p",[t("code",[s._v("jmvn")]),s._v(" 另一个好用的功能就是数据导出，这个功能的主要用处是，在写技术方案时候将数据模型输出到文档中。支持markdown语法。")])]),s._v(" "),t("h2",{attrs:{id:"自动读取配置进行导出"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#自动读取配置进行导出"}},[s._v("#")]),s._v(" 自动读取配置进行导出")]),s._v(" "),t("p",[s._v("如果你已经在配置文件中了dbConfig相关信息，则会自动读取配置信息。你只需要输入要导出的表名即可。")]),s._v(" "),t("div",{staticClass:"language-json line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"namespace"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"config"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"dbConfig"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"host"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"10.80.20.8"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"user"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"abm_dev"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"password"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"pOj*4Z%^izKy0o23o8aH"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[s._v('"database"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"pms_dev"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br")])]),t("h2",{attrs:{id:"根据命令提示完成导出"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#根据命令提示完成导出"}},[s._v("#")]),s._v(" 根据命令提示完成导出")]),s._v(" "),t("p",[s._v("如果你没有在配置文件中添加dbConfig相关信息，请根据命令提示来进行完成导出。")]),s._v(" "),t("p",[t("img",{attrs:{src:"https://img.springlearn.cn/learn_53218775085b88f319e37ca3811c5cd7.gif",alt:"",loading:"lazy"}})]),s._v(" "),t("h2",{attrs:{id:"纯命令方式导出"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#纯命令方式导出"}},[s._v("#")]),s._v(" 纯命令方式导出")]),s._v(" "),t("p",[s._v("如果你在配置文件中已经添加了dbConfig相关信息，但是又不想使用这个进行导出。则可以在命令后添加 "),t("code",[s._v("-c")]),s._v(" 以强制使用输入参数来进行导出。")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("jmvn export -c -m -h 10.80.20.8 -u abm_dev -p 'pOj*4Z%^izKy0o23o8aH' -t replenish_order -db pms_dev\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("h3",{attrs:{id:"查看导出帮助文档"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#查看导出帮助文档"}},[s._v("#")]),s._v(" 查看导出帮助文档")]),s._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("➜ jmvn help export                                                                                   \nJMVN CLI v1.0.6\nUsage: jmvn export [options]\n\n导出数据模型 (支持命令行模式 & 交互模式)\n\nOptions:\n  -c, --commanded [String]  命令行模式运行\n  -m, --markdown [String]   导出markdown格式\n  -h, --host [String]       数据库[host]\n  -u, --user [String]       数据库登陆用户\n  -p, --password [String]   登陆密码(明文请注意安全)\n  -t, --tables [String]     要导出的表模型(支持,分隔)\n  -db, --database [String]  指定要导出的库\n  --help                    display help for command\n\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br")])])])}),[],!1,null,null,null);a.default=r.exports}}]);