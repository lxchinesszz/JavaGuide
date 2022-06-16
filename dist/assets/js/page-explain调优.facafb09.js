(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{608:function(t,e,a){"use strict";a.r(e);var r=a(1),s=Object(r.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/learn_c87a079fcea0d7893b03d4d57478bca7.png",alt:"",loading:"lazy"}})]),t._v(" "),a("p",[a("strong",[t._v("作者")]),t._v(": 西魏陶渊明\n"),a("strong",[t._v("博客")]),t._v(": "),a("a",{attrs:{href:"https://blog.springlearn.cn/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://blog.springlearn.cn/"),a("OutboundLink")],1)]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("西魏陶渊明")]),t._v(" "),a("p",[t._v("莫笑少年江湖梦，谁不少年梦江湖")])]),t._v(" "),a("blockquote",[a("p",[t._v("这篇文章主要讲 explain 如何使用，还有 explain 各种参数概念，之后会讲优化")])]),t._v(" "),a("h1",{attrs:{id:"一、explain-用法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、explain-用法"}},[t._v("#")]),t._v(" 一、Explain 用法")]),t._v(" "),a("p",[t._v("explain模拟Mysql优化器是如何执行SQL查询语句的，从而知道Mysql是如何处理你的SQL语句的。分析你的查询语句或是表结构的性能瓶颈。")]),t._v(" "),a("p",[a("strong",[t._v("语法")]),t._v("："),a("code",[t._v("Explain + SQL 语句;")])]),t._v(" "),a("p",[t._v("如："),a("code",[t._v("Explain select * from user;")]),t._v(" 会生成如下 SQL 分析结果，下面详细对每个字段进行详解")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351159000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h2",{attrs:{id:"_1-id"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-id"}},[t._v("#")]),t._v(" 1. id")]),t._v(" "),a("p",[t._v("是一组数字，代表多个表之间的查询顺序，或者包含子句查询语句中的顺序，id 总共分为三种情况，依次详解")]),t._v(" "),a("h3",{attrs:{id:"id相同"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#id相同"}},[t._v("#")]),t._v(" id相同")]),t._v(" "),a("p",[t._v("id相同，执行顺序由上至下\n"),a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351240000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"id不同"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#id不同"}},[t._v("#")]),t._v(" id不同")]),t._v(" "),a("p",[t._v("id 不同，如果是子查询，id 号会递增，id 值越大优先级越高，越先被执行")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351303000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"id相同和不同"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#id相同和不同"}},[t._v("#")]),t._v(" id相同和不同")]),t._v(" "),a("p",[t._v("id 相同和不同的情况同时存在")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351331000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h2",{attrs:{id:"_2-select-type"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-select-type"}},[t._v("#")]),t._v(" 2. select_type")]),t._v(" "),a("p",[t._v("select_type 包含以下几种值")]),t._v(" "),a("p",[a("code",[t._v("simple")]),t._v("、"),a("code",[t._v("primary")]),t._v("、"),a("code",[t._v("subquery")]),t._v("、"),a("code",[t._v("derived")]),t._v("、"),a("code",[t._v("union")]),t._v("、"),a("code",[t._v("union result")])]),t._v(" "),a("h3",{attrs:{id:"simple"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#simple"}},[t._v("#")]),t._v(" simple")]),t._v(" "),a("p",[t._v("简单的 "),a("code",[t._v("select")]),t._v(" 查询，查询中不包含子查询或者 "),a("code",[t._v("union")]),t._v(" 查询")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351522000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"primary"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#primary"}},[t._v("#")]),t._v(" primary")]),t._v(" "),a("p",[t._v("如果 SQL 语句中包含任何子查询，那么子查询的最外层会被标记为 "),a("code",[t._v("primary")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351575000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"subquery"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#subquery"}},[t._v("#")]),t._v(" subquery")]),t._v(" "),a("p",[t._v("在 "),a("code",[t._v("select")]),t._v(" 或者 "),a("code",[t._v("where")]),t._v(" 里包含了子查询，那么子查询就会被标记为 "),a("code",[t._v("subQquery")]),t._v("，同三.二同时出现")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351651000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"derived"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#derived"}},[t._v("#")]),t._v(" derived")]),t._v(" "),a("p",[t._v("在 "),a("code",[t._v("from")]),t._v(" 中包含的一个子查询，会被标记为衍生查询，会把查询结果放到一个临时表中")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351720000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"union-union-result"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#union-union-result"}},[t._v("#")]),t._v(" union / union result")]),t._v(" "),a("p",[t._v("如果有两个 "),a("code",[t._v("select")]),t._v(" 查询语句，他们之间用 "),a("code",[t._v("union")]),t._v(" 连起来查询，那么第二个 "),a("code",[t._v("select")]),t._v(" 会被标记为 "),a("code",[t._v("union")]),t._v("，"),a("code",[t._v("union")]),t._v(" 的结果被标记为 "),a("code",[t._v("union result")]),t._v("。它的 id 是为 null 的")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596351779000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h2",{attrs:{id:"_3-table"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-table"}},[t._v("#")]),t._v(" 3. table")]),t._v(" "),a("p",[t._v("表示这一行的数据是哪张表的数据")]),t._v(" "),a("h2",{attrs:{id:"_4-type"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-type"}},[t._v("#")]),t._v(" 4. type")]),t._v(" "),a("p",[t._v("type 是代表 MySQL 使用了哪种索引类型，不同的索引类型的查询效率也是不一样的，type 大致有以下种类。\n越往上性能越高。")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("Type类型")]),t._v(" "),a("th",[t._v("说明")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("system")]),t._v(" "),a("td",[t._v("表中只有一行记录，system 是 const 的特例，几乎不会出现这种情况，可以忽略不计")])]),t._v(" "),a("tr",[a("td",[t._v("const")]),t._v(" "),a("td",[t._v("必须是用主键索引或者唯一索引放到 where 条件中查询")])]),t._v(" "),a("tr",[a("td",[t._v("eq_ref")]),t._v(" "),a("td",[t._v("多表查询中,索引查出来的数据都是唯一的（不能是多个,也不能是0个），常见于唯一索引和主键索引")])]),t._v(" "),a("tr",[a("td",[t._v("ref")]),t._v(" "),a("td",[t._v("不是主键索引，也不是唯一索引，就是普通的索引，可能会返回多个符合条件的行。")])]),t._v(" "),a("tr",[a("td",[t._v("range")]),t._v(" "),a("td",[t._v("体现在对某个索引进行区间范围检索，一般出现在 where 条件中的 between、and、<、>、in 等范围查找中。")])]),t._v(" "),a("tr",[a("td",[t._v("index")]),t._v(" "),a("td",[t._v("将所有的索引树都遍历一遍，查找到符合条件的行。索引文件比数据文件还是要小很多，所以比不用索引全表扫描还是要快很多。")])]),t._v(" "),a("tr",[a("td",[t._v("all")]),t._v(" "),a("td",[t._v("没用到索引，单纯的将表数据全部都遍历一遍，查找到符合条件的数据")])])])]),t._v(" "),a("h2",{attrs:{id:"_5-possible-keys"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-possible-keys"}},[t._v("#")]),t._v(" 5. possible_keys")]),t._v(" "),a("p",[t._v("此次查询中涉及字段上若存在索引，则会被列出来，表示可能会用到的索引，但并不是实际上一定会用到的索引")]),t._v(" "),a("h2",{attrs:{id:"_6-key"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6-key"}},[t._v("#")]),t._v(" 6. key")]),t._v(" "),a("p",[t._v("此次查询中实际上用到的索引")]),t._v(" "),a("h2",{attrs:{id:"_7-key-len"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_7-key-len"}},[t._v("#")]),t._v(" 7. key_len")]),t._v(" "),a("p",[t._v("表示索引中使用的字节数，通过该属性可以知道在查询中使用的索引长度，注意：这个长度是最大可能长度，并非实际使用长度，在不损失精确性的情况下，长度越短查询效率越高")]),t._v(" "),a("h2",{attrs:{id:"_8-ref"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_8-ref"}},[t._v("#")]),t._v(" 8. ref")]),t._v(" "),a("p",[t._v("显示关联的字段。如果使用常数等值查询，则显示 const，如果是连接查询，则会显示关联的字段。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596352252000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("ul",[a("li",[t._v("tb_emp 表为非唯一性索引扫描，实际使用的索引列为 idx_name，由于 tb_emp.name='rose'为一个常量，所以 ref=const。")]),t._v(" "),a("li",[t._v("tb_dept 为唯一索引扫描，从 sql 语句可以看出，实际使用了 PRIMARY 主键索引，ref=db01.tb_emp.deptid 表示关联了 db01 数据库中 tb_emp 表的 deptid 字段。")])]),t._v(" "),a("h2",{attrs:{id:"_9-rows"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_9-rows"}},[t._v("#")]),t._v(" 9. rows")]),t._v(" "),a("p",[t._v("根据表信息统计以及索引的使用情况，大致估算说要找到所需记录需要读取的行数，rows 越小越好")]),t._v(" "),a("h2",{attrs:{id:"_10-extra"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-extra"}},[t._v("#")]),t._v(" 10. extra")]),t._v(" "),a("p",[t._v("不适合在其他列显示出来，但在优化时十分重要的信息")]),t._v(" "),a("h3",{attrs:{id:"using-filesort-重点优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-filesort-重点优化"}},[t._v("#")]),t._v(" using  fileSort（重点优化）")]),t._v(" "),a("p",[t._v('俗称 " 文件排序 " ，在数据量大的时候几乎是“九死一生”，在 order by 或者在 group by 排序的过程中，order by 的字段不是索引字段，或者 select 查询字段存在不是索引字段，或者 select 查询字段都是索引字段，但是 order by 字段和 select 索引字段的顺序不一致，都会导致 fileSort')]),t._v(" "),a("p",[t._v("如果where后面的查询和order by的索引，不是一个值。就会出现fileSort。")]),t._v(" "),a("p",[t._v("复合索引,夸界,也会出现fileSort。")]),t._v(" "),a("p",[t._v("优化建议: where 什么就order by 什么。 或者 where和order by 按照复合索引顺序，不要跨列或者无序使用\n"),a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596352476000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"using-temporary-重点优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-temporary-重点优化"}},[t._v("#")]),t._v(" using temporary（重点优化）")]),t._v(" "),a("p",[t._v("使用了临时表保存中间结果，常见于 order by 和 group by 中。")]),t._v(" "),a("p",[t._v("优化建议: 查询哪些列就用哪些列来order by。 能不用创建临时表就不要创建。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596352573000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"using-index-重点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-index-重点"}},[t._v("#")]),t._v(" USING index（重点）")]),t._v(" "),a("p",[t._v("索引覆盖,就是当前sql查询不用读取原文件,只用读取索引。因为查询的列就是索引列")]),t._v(" "),a("p",[t._v("表示相应的 select 操作中使用了覆盖索引（Coveing Index）,避免访问了表的数据行，效率不错！如果同时出现 using where，表明索引被用来执行索引键值的查找；如果没有同时出现 using where，表面索引用来读取数据而非执行查找动作。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1596352650000.png",alt:"",loading:"lazy"}})]),t._v(" "),a("h3",{attrs:{id:"using-where"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-where"}},[t._v("#")]),t._v(" Using where")]),t._v(" "),a("p",[t._v("跟using index相反，要回表去查询。")]),t._v(" "),a("p",[t._v("表明使用了 where 过滤")]),t._v(" "),a("h3",{attrs:{id:"using-join-buffer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#using-join-buffer"}},[t._v("#")]),t._v(" Using join buffer")]),t._v(" "),a("p",[t._v("使用了连接缓存")]),t._v(" "),a("h3",{attrs:{id:"impossible-where"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#impossible-where"}},[t._v("#")]),t._v(" impossible where")]),t._v(" "),a("p",[t._v("where 子语句的值总是 false，不能用来获取任何数据。出现这个就要检查sql。")]),t._v(" "),a("p",[t._v("eg: select a from test where a = 1 and a = 2。  a肯定不可能即1又是2")]),t._v(" "),a("h3",{attrs:{id:"select-tables-optimized-away"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#select-tables-optimized-away"}},[t._v("#")]),t._v(" select tables optimized away")]),t._v(" "),a("p",[t._v("在没有 GROUPBY 子句的情况下，基于索引优化 MIN/MAX 操作或者 对于 MyISAM 存储引擎优化 COUNT(*)操作，不必等到执行阶段再进行计算， 查询执行计划生成的阶段即完成优化。")]),t._v(" "),a("h3",{attrs:{id:"distinct"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#distinct"}},[t._v("#")]),t._v(" distinct")]),t._v(" "),a("p",[t._v("优化 distinct，在找到第一匹配的元组后即停止找同样值的工作")])])}),[],!1,null,null,null);e.default=s.exports}}]);