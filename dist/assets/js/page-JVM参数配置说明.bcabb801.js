(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{735:function(t,e,l){"use strict";l.r(e);var a=l(1),v=Object(a.a)({},(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[l("p",[l("a",{attrs:{href:"https://help.aliyun.com/document_detail/193455.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("参考地址"),l("OutboundLink")],1)]),t._v(" "),l("h2",{attrs:{id:"一、内存容量调优参数"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#一、内存容量调优参数"}},[t._v("#")]),t._v(" 一、内存容量调优参数")]),t._v(" "),l("p",[l("img",{attrs:{src:"https://img.springlearn.cn/blog/learn_1654141304000.png",alt:"",loading:"lazy"}})]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("配置参数")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("说明")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("示例")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置最大堆大小。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m")]),t._v("，设置JVM最大可用内存为3550 MB。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xms")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置JVM初始内存。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xms3550m")]),t._v("，设置JVM初始内存为3550 MB。此值建议与"),l("code",[t._v("-Xmx")]),t._v("相同，避免每次垃圾回收完成后JVM重新分配内存。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmn2g")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置年轻代大小。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmn2g")]),t._v("，设置年轻代大小为2 GB。整个JVM内存大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64 MB，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xss")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置线程的栈大小。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xss128k")]),t._v("，设置每个线程的栈大小为128 KB。"),l("strong",[t._v("说明")]),t._v(" JDK 5.0版本以后每个线程栈大小为1 MB，JDK 5.0以前版本每个线程栈大小为256 KB。请依据应用的线程所需内存大小进行调整。在相同物理内存下，减小该值可以生成更多的线程。但是操作系统对一个进程内的线程个数有一定的限制，无法无限生成，一般在3000个~5000个。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:NewRatio=n")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置年轻代和年老代的比值。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:NewRatio=4")]),t._v("，设置年轻代（包括Eden和两个Survivor区）与年老代的比值（除去持久代）。如果设置为4，那么年轻代与年老代所占比值为1:4，年轻代占整个堆栈的1/5。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:SurvivorRatio=n")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("年轻代中Eden区与两个Survivor区的比值。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:SurvivorRatio=4")]),t._v("，设置年轻代中Eden区与Survivor区的大小比值。如果设置为4，那么两个Survivor区与一个Eden区的比值为2:4，一个Survivor区占整个年轻代的1/6。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:MaxPermSize=n")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置持久代大小。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:MaxPermSize=16m")]),t._v("，设置持久代大小为16 MB。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:MaxTenuringThreshold=n")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置垃圾最大年龄。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:MaxTenuringThreshold=0")]),t._v("，设置垃圾最大年龄。如果设置为0，那么年轻代对象不经过Survivor区，直接进入年老代。对于年老代比较多的应用，提高了效率。如果将此值设置为较大值，那么年轻代对象会在Survivor区进行多次复制，增加了对象在年轻代的存活时间，增加在年轻代即被回收的概率。")])])])]),t._v(" "),l("h2",{attrs:{id:"二、gc回收调优"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#二、gc回收调优"}},[t._v("#")]),t._v(" 二、GC回收调优")]),t._v(" "),l("h2",{attrs:{id:"_2-1-吞吐量优先的gc典型配置参数"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-吞吐量优先的gc典型配置参数"}},[t._v("#")]),t._v(" 2.1 吞吐量优先的GC典型配置参数")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("配置参数")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("说明")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("示例")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseParallelGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("选择垃圾收集器为并行收集器。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20")]),t._v("，"),l("code",[t._v("-XX:+UseParallelGC")]),t._v("此配置仅对年轻代有效，即在示例配置下，年轻代使用并发收集，而年老代仍旧使用串行收集。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:ParallelGCThreads")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("配置并行收集器的线程数，即同时多少个线程一起进行垃圾回收。"),l("strong",[t._v("说明")]),t._v(" 此值建议配置与处理器数目相等。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3800m -Xms3800m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20")]),t._v("，"),l("code",[t._v("-XX:ParallelGCThreads=20")]),t._v("表示配置并行收集器的线程数为20个。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseParallelOldGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("配置年老代垃圾收集方式为并行收集。"),l("strong",[t._v("说明")]),t._v(" JDK 6.0支持对年老代并行收集。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:ParallelGCThreads=20 -XX:+UseParallelOldGC")]),t._v("，"),l("code",[t._v("-XX:+UseParallelOldGC")]),t._v("表示对年老代进行并行收集。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:MaxGCPauseMillis")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置每次年轻代垃圾回收的最长时间，如果无法满足此时间，JVM会自动调整年轻代大小，以满足此值。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100")]),t._v("，"),l("code",[t._v("-XX:MaxGCPauseMillis=100")]),t._v("设置每次年轻代垃圾回收的最长时间为100 ms。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseAdaptiveSizePolicy")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置此选项后，并行收集器自动选择年轻代区大小和相应的Survivor区比例，以达到目标系统规定的最低响应时该间或者收集频率，该值建议使用并行收集器时，并且一直打开。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseParallelGC -XX:MaxGCPauseMillis=100 -XX:+UseAdaptiveSizePolicy")])])])])]),t._v(" "),l("h2",{attrs:{id:"_2-2-响应时间优先的gc典型配置参数"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-响应时间优先的gc典型配置参数"}},[t._v("#")]),t._v(" 2.2 响应时间优先的GC典型配置参数")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("配置参数")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("说明")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("示例")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseConcMarkSweepGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置年老代为并发收集。"),l("strong",[t._v("说明")]),t._v(" 配置了"),l("code",[t._v("-XX:+UseConcMarkSweepGC")]),t._v("，建议年轻代大小使用"),l("code",[t._v("-Xmn")]),t._v("设置。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC")])])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseParNewGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("设置年轻代为并行收集。可与CMS收集同时使用。JDK 5.0以上版本，JVM根据系统配置自行设置，无需再设置此值。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:ParallelGCThreads=20 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC")])])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:CMSFullGCsBeforeCompaction")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("由于并发收集器不对内存空间进行压缩、整理，所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行多少次GC以后对内存空间进行压缩、整理。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactAtFullCollection")]),t._v("，"),l("code",[t._v("-XX:CMSFullGCsBeforeCompaction=5")]),t._v("，表示运行GC5次后对内存空间进行压缩、整理。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+UseCMSCompactAtFullCollection")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("打开对年老代的压缩。"),l("strong",[t._v("说明")]),t._v(" 该值可能会影响性能，但是可以消除碎片。")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xmx3550m -Xms3550m -Xmn2g -Xss128k -XX:+UseConcMarkSweepGC -XX:CMSFullGCsBeforeCompaction=5 -XX:+UseCMSCompactAtFullCollection")])])])])]),t._v(" "),l("h2",{attrs:{id:"三、gc辅助参数"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#三、gc辅助参数"}},[t._v("#")]),t._v(" 三、GC辅助参数")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("配置参数")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("说明")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+PrintGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("用于输出GC日志。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+PrintGCDetails")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("用于输出GC日志。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+PrintGCTimeStamps")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("用于输出GC时间戳（JVM启动到当前日期的总时长的时间戳形式）。示例如下："),l("code",[t._v("0.855: [GC (Allocation Failure) [PSYoungGen: 33280K->5118K(38400K)] 33280K->5663K(125952K), 0.0067629 secs] [Times: user=0.01 sys=0.01, real=0.00 secs]")])])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+PrintGCDateStamps")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("用于输出GC时间戳（日期形式）。示例如下："),l("code",[t._v("2022-01-27T16:22:20.885+0800: 0.299: [GC pause (G1 Evacuation Pause) (young), 0.0036685 secs]")])])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-XX:+PrintHeapAtGC")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("在进行GC前后打印出堆的信息。")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[l("code",[t._v("-Xloggc:../logs/gc.log")])]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("日志文件的输出路径。")])])])])])}),[],!1,null,null,null);e.default=v.exports}}]);