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
        //     href: 'https://img.springlearn.cn/learn_41d489b6f8e99292d8d2c4ca59e10664.tailwind.min.css'
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
            description: "vuepress-theme-hope 的 demo",
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
            title: '扫描公众号,输入暗号获取密码,解锁全站文章',
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
        friendLink:[
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
        hostname: "https://vuepress-theme-hope-demo.mrhope.site",
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
                            {text: '测试专题', link: '/learn/test/'},
                        ]
                    },
                    {
                        text: 'Maven扩展',
                        items: [
                            {
                                text: '基础入门', items: [
                                    {text: 'Maven基础', link: '/learn/maven/'},
                                    {text: '自定义插件', link: '/learn/maven/自定义maven插件/'}
                                ]
                            },
                            {
                                text: '源码分析', items: [
                                    {text: 'spring-boot-maven-plugin', link: '/learn/maven/spring-boot-maven-plugin/'},
                                    {text: 'maven-resources-plugin', link: '/learn/maven/maven-resources-plugin/'},
                                    {text: 'maven-surefire-plugin', link: '/learn/maven/maven-surefire-plugin/'}
                                ]
                            },
                            {
                                text: '扩展开发', items: [
                                    {text: '编译卡点插件', link: '/learn/maven/plugin/artifact-check-maven-plugin/'},
                                ]
                            }
                        ]
                    },
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
                        ]
                    },
                    {
                        text: '实战项目',
                        items: [
                            {
                                text: '效率工具', items: [
                                    {text: 'Jmvn', link: '/learn/project/jmvn/'},
                                    {text: 'Java脚手架', link: '/learn/project/start/'},
                                    {text: 'Alfred Plugin', link: '/learn/project/alfred/'},
                                    {text: 'Tomato 新特性', link: 'https://tomato.springlearn.cn/'},
                                    {text: 'Mojito 通信组件', link: 'https://mojito.springlearn.cn/'},
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
                    {
                        text: 'Database',
                        items: [
                            {
                                text: '关系型数据库', items: [
                                    {text: 'Mysql', link: '/learn/databases/sql/'},
                                ]
                            },
                            {
                                text: 'NoSql', items: [
                                    {text: 'Redis', link: '/learn/databases/nosql/redis/'},
                                    {text: 'Mongo', link: '/learn/databases/nosql/mongo/'}
                                ]
                            },
                            {
                                text: '图数据库', items: [
                                    {text: 'Neo4J', link: '/learn/databases/map/'},
                                ]
                            }
                        ]
                    },
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
                                ]
                            },
                            {
                                text: '总结 & 复盘', items: [
                                    {text: '学会复盘', link: '/learn/other/如何学会复盘'},
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
                                    {text: 'docsify', link: '/learn/blog/docsify/'}
                                ]
                            },
                            {
                                text: '服务器选择', items: [
                                    {text: '自搭建服务', link: '/learn/chinese/'},
                                    {text: 'Vercel', link: '/language/japanese1/'}
                                ]
                            },
                            {
                                text: '域名选择', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanes2e/'}
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
                            title: "基础知识",
                            icon: "creative",
                            collapsable: false,
                            children: ['Spring循环依赖', 'AOP', 'EL', 'Endpoint监控端点扩展', 'Spring动态绑定配置', 'Web接口资源是如何保存起来的']
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
                            children: ['Mapper代理对象创建', 'Mybatis执行流程分析', 'Mybatis一级二级缓存设计', 'Mybatis缓存设计']
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
                    ]
                },
            },
        },
        markdown: {
            lineNumbers: true
        },
        footer: {
            display: true,
            content: " 只要坚持不懈，嘲笑你的人，迟早会被你笑死。",
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
