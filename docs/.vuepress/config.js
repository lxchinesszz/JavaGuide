const {config} = require("vuepress-theme-hope");
const path = require("path");
module.exports = config({
    theme: path.resolve(__dirname, './theme'),
    title: "西魏陶渊明",
    description: "桃花潭水深千尺",
    author: '西魏陶渊明',
    blog: true,
    dest: "./dist",
    head: [
        [
            "script",
            {src: "https://img.springlearn.cn/learn_9957c49cd4d8fb645569586a438024db.react.production.min.js"},
        ],
        [
            "script",
            {
                src: "https://img.springlearn.cn/learn_a775a739f8300fa1057643160208e962.react-dom.production.min.js",
            },
        ],
        ["script", {src: "https://img.springlearn.cn/learn_f71f954c936a7a5bc107119f656be7a8.vue.min.js"}],
        // ["script", {src: "https://unpkg.com/element-ui/lib/index.js"}],
        // ['link', {
        //     rel: 'stylesheet',
        //     href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
        // }],
        [
            "script",
            {src: "https://img.springlearn.cn/learn_3d5c67462f6ac197a271d1e178f295e9.min.js "},
        ],
        ['link', {
            rel: 'icon',
            type: "image/x-icon",
            href: 'https://img.springlearn.cn/learn_d98f09cdad8fa38168ec59c15a508490.ico'
        }],
        // ['link', {
        //     rel: 'stylesheet',
        //     href: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
        // }],
        // ['link', {
        //     rel: 'stylesheet',
        //     href: 'https://unpkg.com/pattern.css'
        // }],
        // [
        //     "script",
        //     {
        //         src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js",
        //     },
        // ],
        [
            'script',
            {charset: 'utf-8', src: 'https://readmore.openwrite.cn/js/readmore.js'},
        ], [
            'script',
            {charset: 'utf-8', src: ' https://img.springlearn.cn/learn_eed96b41c5dfddf972e76e7922f60fc8.jquery.min.js'}
        ],
        [
            'script',
            {charset: 'utf-8', src: 'https://img.springlearn.cn/learn_d67ad5eb7554e8aed39db1a4d7948ea6.pure.mini.js'}
        ]
    ],
    locales: {
        // "/play/": {
        //     lang: "en-ZH",
        //     title: "娱乐区",
        //     // 默认是 false, 设置为 true 来启用
        //     editLinks: true,
        //     editLinkText: 'Edit this page on 娱乐区',
        // },
        "/": {
            lang: "zh-CN",
            title: "西魏陶渊明",
            // 默认是 false, 设置为 true 来启用
            editLinks: true,
            editLinkText: '编辑学习区',
            description: "天下代码一大抄，抄来抄去有提高，看你会抄不会抄。",
        },
    },
    encrypt: {
        title: 'Hello'
    },
    // 主题配置
    // https://vuepress-theme-hope.github.io/zh/config/theme/feature/
    themeConfig: {
        //主题色和深色模式设置选项配置。 'auto-switch' | 'switch' | 'auto' | 'disable'
        darkmode: 'switch',
        anchorBanner: 'https://img.springlearn.cn/learn_c3d5074d94563b8297f81633f171d230.jpeg',
        postMedia: 'https://img.springlearn.cn/blog/learn_1653269759000.png',
        breadcrumb: false,
        // 不允许变色
        themeColor: false,
        // 是否开启毒鸡汤,模式。如果开启home将不在使用tagline。而是随机获取毒鸡汤
        dujitang: false,
        // 正文上门的鸡汤，数据获取来自一言
        homeJitang: false,
        fullscreen: false,
        encrypt: {
            title: '输入1024,解锁全站文章',
            errorHint: '暗号不对,有内鬼,终止交易'
        },
        adList: [
            // {
            //     link: 'https://www.aliyun.com/minisite/goods?userCode=oab21mxz&amp;share_source=copy_link',
            //     img: 'https://img.springlearn.cn/learn_41803d11c899f1b682c70b16e7335cf5.jpg'
            // },
            {
                link: '',
                img: 'https://img.springlearn.cn/learn_9ea02e620c7d483bfa2d310c1440d3e9.png'
            }
        ],
        friendLink: [
            {
                link: 'https://bugstack.cn/',
                desc: 'bugstack 虫洞栈'
            },
            {
                link: 'https://www.toutiao.com/c/user/token/MS4wLjABAAAAUpgfl4Z-CCzEU1PqmX4f2a7OZ3RxnTpYZ5euMr_6ZE4/?#mid=1563737358895105',
                desc: '今日头条'
            },
            {
                link: 'https://blog.csdn.net/message_lx',
                desc: 'CSDN'
            }
        ],
        // 默认为 "Edit this page"
        logo: "https://img.springlearn.cn/learn_d98f09cdad8fa38168ec59c15a508490.ico",
        searchPlaceholder: '斯是陋室惟吾德馨',
        hostname: "https://java.springlearn.cn/",
        author: "西魏陶渊明",
        repo: "https://github.com/lxchinesszz/JavaGuide",
        docsBranch: "master",
        docsDir: "docs",
        editLinks: true,
        nav: [
            {text: "指南", link: "/learn/", icon: "creative"}
        ],
        sidebarDepth: 4,
        displayAllHeaders: true,
        locales: {
            // "/play/": {
            //     lang: 'en-ZH', // 将会被设置为 <html> 的 lang 属性
            //     label: '娱乐区',
            //     selectText: 'Languages',
            //     ariaLabel: 'Languages',
            //     editLinkText: 'Edit this page on GitHub',
            // },
            "/": {
                lang: 'zh-CN',
                // 多语言下拉菜单的标题
                selectText: '选择语言',
                // 编辑链接文字
                editLinks: true,
                editLinkText: '在 GitHub 上编辑此页',
                label: '学习区',
                encrypt: {
                    title: '扫描获取密码',
                    errorHint: 'TMD，难道你想白嫖?'
                },
                nav: [
                    {text: "InfoQ", link: "/learn/误入歧途/", icon: "creative"},
                    // { text: "大学生专题", link: "/learn/school/students", icon: "study" },
                    {
                        text: 'Java',
                        ariaLabel: 'Java',
                        items: [
                            {text: 'Java编程', link: '/learn/java/'},
                            // {text: 'Java八股文', link: '/learn/java2/'},
                            // {text: 'JVM', link: '/language/japanese/'},
                            {text: '分布式服务', link: '/learn/distributed/'},
                            {text: '测试专题', link: '/learn/test/'}
                        ]
                    },
                    // {
                    //     text: 'Maven扩展',
                    //     items: [
                    //         {
                    //             text: '基础入门', items: [
                    //                 {text: 'Maven基础', link: '/learn/maven/'},
                    //                 {text: '自定义插件', link: '/learn/maven/自定义maven插件/'}
                    //             ]
                    //         },
                    //         {
                    //             text: '源码分析', items: [
                    //                 {text: 'spring-boot-maven-plugin', link: '/learn/maven/spring-boot-maven-plugin/'},
                    //                 {text: 'maven-resources-plugin', link: '/learn/maven/maven-resources-plugin/'},
                    //                 {text: 'maven-surefire-plugin', link: '/learn/maven/maven-surefire-plugin/'}
                    //             ]
                    //         },
                    //         {
                    //             text: '扩展开发', items: [
                    //                 {text: '编译卡点插件', link: '/learn/maven/plugin/artifact-check-maven-plugin/'},
                    //             ]
                    //         }
                    //     ]
                    // },
                    {
                        text: '框架篇',
                        ariaLabel: 'Java',
                        items: [
                            {text: 'Spring', link: '/learn/spring/'},
                            {text: 'Mybatis', link: '/learn/mybatis/'},
                            // {text: 'Mybatis-Plus', link: '/language/jap1333anese/'},
                            // {text: 'Dubbo', link: '/language/japa222nese/'},
                            // {text: 'Job', link: '/language/japa444nese/'},
                        ]
                    },
                    {
                        text: '工具篇',
                        ariaLabel: 'tools',
                        items: [
                            {text: '反射框架', link: '/learn/tools/reflections/'},
                            {text: '字节码', link: '/learn/tools/bytecode/Javassist'},
                            {text: 'SQL解析', link: '/learn/tools/druid/'},
                            {text: 'Guava', link: '/learn/tools/guava/'},
                            {text: '池化技术', link: '/learn/tools/pool2/'},
                            {text: 'Arthas', link: '/learn/tools/arthas/'},
                            {text: 'RxJava', link: '/learn/tools/rxjava/'},
                            {text: 'Reactor', link: '/learn/tools/Reactor/'},
                            {text: 'Disruptor', link: '/learn/tools/disruptor/'},
                            {text: 'JMH基准测试', link: '/learn/tools/jmh/'},
                            {text: '内存布局', link: '/learn/tools/jol/'},
                            {text: 'APT技术', link: '/learn/tools/apt/'},
                        ]
                    },
                    {
                        text: '实战项目',
                        items: [
                            {
                                text: '效率工具', items: [
                                    {text: 'Mojito 通信组件', link: '/learn/project/mojito/'},
                                    {text: 'Jmvn', link: '/learn/project/jmvn/'},
                                    {text: 'Java脚手架', link: '/learn/project/start/'},
                                    {text: 'Alfred Plugin', link: '/learn/project/alfred/'},
                                    {text: 'Tomato 新特性', link: 'https://tomato.springlearn.cn/'},
                                    {text: 'JVM调优&问题排查', link: '/learn/project/jvm/'},
                                ]
                            }
                        ]
                    },

                    // {
                    //     text: '字节码',
                    //     items: [
                    //         {
                    //             text: '工具篇', items: [
                    //                 { text: 'Javassist', link: '/language/chinese/' },
                    //                 { text: 'Japanese', link: '/language/japanese/' }
                    //             ]
                    //         },
                    //         {
                    //             text: '扩展开发', items: [
                    //                 { text: 'Chinese', link: '/language/chinese/' },
                    //                 { text: 'Japanese', link: '/language/japanese/' }
                    //             ]
                    //         }
                    //     ]
                    // },
                    // {
                    //     text: 'Database',
                    //     items: [
                    //         {
                    //             text: '关系型数据库', items: [
                    //                 {text: 'Mysql', link: '/learn/databases/sql/'},
                    //             ]
                    //         },
                    //         {
                    //             text: 'NoSql', items: [
                    //                 {text: 'Redis', link: '/learn/databases/nosql/redis/'},
                    //                 {text: 'Mongo', link: '/learn/databases/nosql/mongo/'}
                    //             ]
                    //         },
                    //         {
                    //             text: '图数据库', items: [
                    //                 {text: 'Neo4J', link: '/learn/databases/map/'},
                    //             ]
                    //         }
                    //     ]
                    // },
                    {
                        text: '设计&规范',
                        items: [
                            {
                                text: '规范', items: [
                                    {text: 'Java代码规范全部奉上', link: '/learn/design/Java代码规范全部奉上'},
                                    {text: '中文文档写作规范', link: '/learn/design/中文文档写作规范'},
                                    {text: '年终总结汇报大纲', link: '/learn/design/年终总结汇报大纲'}
                                ]
                            },
                            {
                                text: '设计', items: [
                                    {text: '领域驱动模型的思考与认知', link: '/learn/design/领域驱动模型的思考与认知'},
                                    {text: '六大原则 & 23种设计模式', link: '/learn/design/六脉神剑'},
                                ]
                            },
                            {
                                text: '总结 & 复盘', items: [
                                    {text: '悟已往之不谏知来者其可追', link: '/learn/other/如何学会复盘'},
                                ]
                            }
                        ]
                    },
                    {
                        text: '博客搭建',
                        items: [
                            {
                                text: '博客框架', items: [
                                    {text: 'hexo', link: '/learn/blog/hexo/'},
                                    {text: 'vuepress', link: '/learn/blog/vuepress/'},
                                    {text: 'docsify', link: '/learn/blog/docsify/'},
                                    {text: '将博客搬至CSDN', link: '/learn/blog/将博客搬至CSDN/'}

                                ]
                            },
                            {
                                text: '服务器选择', items: [
                                    {text: '自搭建服务', link: '/learn/blog/aliyun/'},
                                    {text: 'Vercel', link: '/learn/blog/vercel/'}
                                ]
                            },
                            {
                                text: '域名选择', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanes2e/'}
                                ]
                            }
                        ]
                    },
                    {
                        text: '📦 供应链系统',
                        link: '/learn/scm/',
                        items: [
                            {
                                text: "入门介绍",
                                items: [
                                    {text: '白话介绍', link: '/learn/scm/introduce/白话翻译/'},
                                    {text: '系统介绍', link: '/learn/scm/introduce/系统介绍/'},
                                ]
                            },
                            {
                                text: '基础服务', items: [
                                    {text: '商货管理', link: '/learn/scm/base/商货品服务/'},
                                    {text: '仓网系统', link: '/learn/scm/base/仓服务管理/'},
                                    {text: '地址服务', link: '/learn/scm/base/全球地址库/'},
                                ]
                            },
                            {
                                text: '采购入库', items: [
                                    {text: '采购订单', link: '/learn/scm/purchase/采购订单/'},
                                    {text: '到货管理', link: '/learn/scm/purchase/到货管理/'},
                                    {text: '供货计划', link: '/learn/scm/purchase/供货计划/'},
                                    {text: '理货报告', link: '/learn/scm/purchase/理货报告/'}
                                ]
                            },
                            {
                                text: '销售出库', items: [
                                    {text: '公域拉单', link: '/learn/scm/fulfill-aggregate/公域拉单/'},
                                    {text: '私域推单', link: '/learn/scm/fulfill-aggregate/私域拉单/'},
                                    {text: '物流轨迹', link: '/learn/scm/fulfill-aggregate/物流轨迹/'},
                                    {text: '库存分层', link: '/learn/scm/fulfill-aggregate/库存分层/'}
                                ]
                            },
                            {
                                text: '财务结算', items: [
                                    {text: '财务支出', link: '/learn/scm/finance/财务支出/'},
                                    {text: '预收收入', link: '/learn/scm/finance/预收收入/'},
                                    {text: '成本控制', link: '/learn/scm/finance/成本控制/'},
                                    {text: '财报管报', link: '/learn/scm/finance/财报管报/'},
                                ]
                            }
                        ]
                    }
                ],
                sidebar: {
                    "/learn/java/": [
                        {
                            title: " 第一章 基础内容",
                            icon: "jichushuju",
                            collapsable: false,
                            children: ['Java异常体系', '函数式编程', 'JMX', 'SPI', 'hooks函数', '委派双亲之类加载器', '四大引用', 'synchronized', '分布式锁', 'HashMap']
                        },
                        {
                            title: " 第二章 多线程编程",
                            icon: "xiancheng",
                            collapsable: false,
                            children: ['线程池', '拒绝策略', '线程安全之锁操作', '线程组', '线程工厂', '线程隔离', '线程安全']
                        },
                        {
                            title: " 第三章 并发编程",
                            icon: "xiancheng",
                            collapsable: false,
                            children: ['Semaphore', 'CountDownLatch', 'CyclicBarrier', 'ReadWriteLock', '原子操作', 'Condition', 'BlockingQueue', 'Contended']
                        }
                    ],
                    "/learn/databases/sql/": [
                        {
                            title: "优化相关",
                            icon: "xiancheng",
                            collapsable: false,
                            children: ['垃圾SQL', 'explain', 'SQL优化示例', 'SQL索引性能优化', 'SQL锁机制', '海量数据模拟', 'join']
                        }
                    ],
                    "/learn/databases/nosql/redis/": [
                        {
                            title: "优化相关",
                            icon: "xiancheng",
                            collapsable: false,
                            children: ['Redis缓存穿透雪崩问题']
                        }
                    ],
                    "/learn/java2/": [
                        {
                            title: "基础能力",
                            icon: "creative",
                            collapsable: false,
                            children: [{
                                title: 'v1',
                                path: '/learn/java2/Java异常体系'
                            }, {
                                title: 'v2',
                                path: '/learn/java2/函数式编程'
                            }]
                        }
                    ],
                    "/learn/spring/": [
                        {
                            title: "Spring Core",
                            icon: "creative",
                            collapsable: false,
                            children: ['core01','core02','core03','core04','core05','core06','core07','core08']
                        },
                        {
                            title: "Spring Web",
                            icon: "creative",
                            collapsable: false,
                            children: ['core09']
                        },
                        {
                            title: "Spring Integration",
                            icon: "creative",
                            collapsable: false,
                            children: ['']
                        },
                        {
                            title: "Spring Testing",
                            icon: "creative",
                            collapsable: false,
                            children: ['']
                        },
                        {
                            title: "Spring Data Access",
                            icon: "creative",
                            collapsable: false,
                            children: ['']
                        },
                        {
                            title: "Spring 周边",
                            icon: "creative",
                            collapsable: false,
                            children: ['Spring循环依赖', 'AOP', 'EL', 'Endpoint监控端点扩展', 'Spring动态绑定配置', 'Web接口资源是如何保存起来的', 'Spring声明式事务的实现方案', 'FactoryBean接口实例化']
                        }
                    ],
                    "/learn/mybatis/": [
                        {
                            title: "源码学习",
                            icon: "creative",
                            collapsable: false,
                            children: ['环境搭建', '配置文件解析', '核心类介绍']
                        }
                        ,
                        {
                            title: "专题文章",
                            icon: "creative",
                            collapsable: false,
                            children: ['Mapper代理对象创建', 'Mybatis执行流程分析', 'Mybatis一级二级缓存设计', 'Mybatis缓存设计', '事务的实现方案', 'Spring事务整合']
                        }
                        ,
                        {
                            title: "插件扩展",
                            icon: "creative",
                            collapsable: false,
                            children: ['插件分析', "LimitPlugin", "PagePlugin", "AuthPlugin"]
                        }
                        ,
                        {
                            title: "工具类",
                            icon: "creative",
                            collapsable: false,
                            children: ['MetaObject', 'Mybatissql日志打印']
                        }
                    ],
                    "/learn/tools/guava/": [
                        {
                            title: "数据类型扩展",
                            icon: "creative",
                            collapsable: false,
                            children: [{
                                title: 'guava-map集合',
                                path: '/learn/tools/guava/guava-map'
                            }]
                        },
                        {
                            title: "工具扩展",
                            icon: "creative",
                            collapsable: false,
                            children: [{
                                title: 'guava-retry重试组件',
                                path: '/learn/tools/guava/guava-retry'
                            }, {
                                title: 'spring-retry重试组件',
                                path: '/learn/tools/guava/spring-retry'
                            },
                                {
                                    title: 'guava-cache内存缓存',
                                    path: '/learn/tools/guava/guava-cache'
                                }]
                        }
                    ],
                    "/learn/test/": [
                        {
                            title: "技术框架",
                            icon: "creative",
                            collapsable: false,
                            children: [{
                                title: '技术选型',
                                path: '/learn/test/技术选型'
                            }, {
                                title: 'JUnit API',
                                path: '/learn/test/JUnitAPI'
                            }, {
                                title: 'MockData API',
                                path: '/learn/test/MockDataAPI'
                            }, {
                                title: 'Mockito API',
                                path: '/learn/test/MockitoAPI'
                            }, {
                                title: 'SpringBoot Testing',
                                path: '/learn/test/SpringBootTesting'
                            }, {
                                title: 'Feign Mock注意事项',
                                path: '/learn/test/FeignMock'
                            }]
                        },
                        {
                            title: "源码分析",
                            icon: "kit",
                            collapsable: false,
                            children: [{
                                title: '谁在调用JUnit',
                                path: '/learn/test/谁在调用JUnit'
                            }, {
                                title: '如何知道是否依赖Spring容器',
                                path: '/learn/test/如何知道是否依赖Spring容器'
                            }, {
                                title: 'JUnit单测类属性注入',
                                path: '/learn/test/JUnit单测类属性注入'
                            }, {
                                title: '事务回滚原理',
                                path: '/learn/test/事务回滚原理'
                            }]
                        },
                        {
                            title: "场景分析",
                            icon: "changjingguanli",
                            collapsable: false,
                            children: [{
                                title: '测试成本',
                                path: '/learn/test/测试成本'
                            }, {
                                title: '启动缓慢',
                                path: '/learn/test/启动缓慢'
                            }, {
                                title: '数据隔离',
                                path: '/learn/test/数据隔离'
                            }, {
                                title: '消息验证',
                                path: '/learn/test/消息验证'
                            }, {
                                title: '异步验证',
                                path: '/learn/test/异步验证'
                            }]
                        },
                        {
                            title: "单测标准",
                            icon: "icon-standard",
                            collapsable: false,
                            children: [{
                                title: '命名规则',
                                path: '/learn/test/命名规则'
                            }, {
                                title: '使用断言',
                                path: '/learn/test/使用断言'
                            }, {
                                title: '极限测试',
                                path: '/learn/test/极限测试'
                            }, {
                                title: '测试范围',
                                path: '/learn/test/测试范围'
                            }, {
                                title: '影响范围',
                                path: '/learn/test/影响范围'
                            }, {
                                title: '单测维护',
                                path: '/learn/test/单测维护'
                            }]
                        },
                        {
                            title: "案例分享",
                            icon: "fenxiang",
                            collapsable: false,
                            children: [{
                                title: '难度指数',
                                path: '/learn/test/案例分享'
                            }]
                        },
                    ],
                    "/learn/tools/arthas/": [
                        {
                            title: "快速入门",
                            icon: "creative",
                            collapsable: false,
                            children: ['learn']
                        },
                        {
                            title: "进阶使用",
                            icon: "creative",
                            collapsable: false,
                            children: ['base-cli', 'jvm-cli', 'class-cli', 'watch-cli']
                        }
                    ],
                    "/learn/tools/pool2/": [
                        {
                            title: "推荐文章",
                            icon: "creative",
                            collapsable: false,
                            children: ['字符串常量池']
                        }
                    ],
                    "/learn/tools/reflections/": [
                        {
                            title: "推荐文章",
                            icon: "creative",
                            collapsable: false,
                            children: ['Java泛型']
                        }
                    ],
                    "/learn/project/jvm/": [
                        {
                            title: "推荐文章",
                            icon: "creative",
                            collapsable: false,
                            children: ['JVM参数配置说明', 'JVM']
                        }
                    ],
                    "/learn/project/jmvn/": [
                        {
                            title: "快速入门",
                            icon: "creative",
                            collapsable: false,
                            children: ['introduction', 'introduction-install']
                        },
                        {
                            title: "使用配置",
                            icon: "creative",
                            collapsable: false,
                            children: ['jmvn-init', 'jmvn-install', 'jmvn-export']
                        },
                        {
                            title: "插件开发",
                            icon: "creative",
                            collapsable: false,
                            children: ['jmvn-plugin']
                        }
                    ],
                    "/learn/project/alfred/": [
                        {
                            title: "自定义工作流",
                            icon: "creative",
                            collapsable: false,
                            children: ['create-alfred', 'alfred-worflow-js']
                        }
                    ],
                    "/learn/project/mojito/": [
                        {
                            title: "通信层搭建",
                            icon: "creative",
                            collapsable: false,
                            children: ['第01篇:手写JavaRPC框架之思路分析', '第02篇:手写JavaRPC框架之设计思路','第03篇:手写JavaRPC框架之搞定序列化','第04篇:手写JavaRPC框架之搞定网络通信']
                        },
                        {
                            title: "代理层搭建",
                            icon: "creative",
                            collapsable: false,
                            children: ['第05篇:手写JavaRPC框架之执行层思路']
                        },
                        {
                            title: "整合Spring",
                            icon: "creative",
                            collapsable: false,
                            children: ['']
                        }
                    ],
                    "/learn/distributed/": [
                        {
                            title: "基础知识",
                            icon: "creative",
                            collapsable: false,
                            children: [
                                '分布式注册中心',
                                '分布式负载均衡',
                                '分布式服务调用',
                                '分布式配置中心',
                                '分布式服务降级',
                                '分布式服务限流',
                                '分布式服务熔断',
                                '分布式服务网关',
                                '分布式链路追踪',
                                '分布式事务处理']
                        }
                    ],
                    "/learn/tools/": [
                        {
                            title: "工具系列",
                            icon: "creative",
                            collapsable: false,
                            children: ['reflections/', 'guava/','druid/','reactor/','pool2/','disruptor/','bytecode/']
                        }
                    ],
                    "/learn/dubbo/": [
                        {
                            title: "全局流程",
                            icon: "creative",
                            collapsable: false,
                            children: ['Dubbo源码解析之服务端Provider','Dubbo源码解析之客户端Consumer','dubbo整合spring的两种实现原理']
                        }
                    ],
                    "/learn/jobs/": [
                        {
                            title: "全局流程",
                            icon: "creative",
                            collapsable: false,
                            children: ['Elastic-Job源码解析(一)之与Spring完美整合','Elastic-Job源码解析(三)之分片定时任务执行']
                        }
                    ],
                    "/learn/electron/": [
                        {
                            title: "介绍说明",
                            icon: "creative",
                            collapsable: false,
                            children: ['图床软件示例']
                        }
                    ],

                },
            },
        },
        markdown: {
            lineNumbers: true
        },
        footer: {
            display: true,
            content: " 只要坚持不懈，嘲笑你的人，迟早会被你笑死。 <span id=\"busuanzi_container_site_pv\">本站总访问量<span id=\"busuanzi_value_site_pv\"></span>次</span> <span id=\"busuanzi_container_site_uv\">\n" +
                "  本站访客数<span id=\"busuanzi_value_site_uv\"></span>人次\n" +
                "</span>",
        },
        comment: {
            type: "waline",
            serverURL: "https://waline-fawn-six.vercel.app",
        },
        copyright: {
            status: "global",
        },
        git: {
            timezone: "Asia/Shanghai",
        },
        mdEnhance: {
            enableAll: true,
            // 支持居中
            align: true,
            codegroup: true,
            presentation: {
                plugins: [
                    "highlight",
                    "math",
                    "search",
                    "notes",
                    "zoom",
                    "anything",
                    "audio",
                    "chalkboard",
                ],
            },
        },
        pwa: {
            favicon: "https://img.springlearn.cn/learn_d98f09cdad8fa38168ec59c15a508490.ico",
            cachePic: true,
            apple: {
                icon: "/assets/icon/apple-icon-152.png",
                statusBarColor: "black",
            },
            msTile: {
                image: "/assets/icon/ms-icon-144.png",
                color: "#ffffff",
            },
            manifest: {
                icons: [
                    {
                        src: "/assets/icon/chrome-mask-512.png",
                        sizes: "512x512",
                        purpose: "maskable",
                        type: "image/png",
                    },
                    {
                        src: "/assets/icon/chrome-mask-192.png",
                        sizes: "192x192",
                        purpose: "maskable",
                        type: "image/png",
                    },
                    {
                        src: "/assets/icon/chrome-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/assets/icon/chrome-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                ],
                shortcuts: [
                    {
                        name: "Guide",
                        short_name: "Guide",
                        url: "/guide/",
                        icons: [
                            {
                                src: "/assets/icon/guide-maskable.png",
                                sizes: "192x192",
                                purpose: "maskable",
                                type: "image/png",
                            },
                            {
                                src: "/assets/icon/guide-monochrome.png",
                                sizes: "192x192",
                                purpose: "monochrome",
                                type: "image/png",
                            },
                        ],
                    },
                ],
            },
        },
        plugins: [
            [
                "active-hash",
                {
                    // your 你的选项
                    offset: 0
                },
            ],
        ],
    },
});
