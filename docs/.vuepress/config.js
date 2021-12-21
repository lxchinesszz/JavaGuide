const {config} = require("vuepress-theme-hope");
const path = require("path");
module.exports = config({
    theme: path.resolve(__dirname, './theme'),
    title: "Springlearn",
    description: "桃花潭水深千尺",
    author: '西魏陶渊明',
    dest: "./dist",
    head: [
        [
            "script",
            {src: "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"},
        ],
        [
            "script",
            {
                src: "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
            },
        ],
        ["script", {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"}],
        [
            "script",
            {src: "https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js"},
        ],
    ],
    locales: {
        "/play/": {
            lang: "en-ZH",
            title: "娱乐区",
            // 默认是 false, 设置为 true 来启用
            editLinks: true,
            editLinkText: 'Edit this page on 娱乐区',
        },
        "/": {
            lang: "zh-CN",
            title: "学习区",
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
        darkmode: 'disable',
        // 不允许变色
        themeColor: false,
        encrypt: {
            title: 'Hello'
        },
        // 默认为 "Edit this page"
        logo: "/logo.svg",
        searchPlaceholder: '斯是陋室惟吾德馨',
        hostname: "https://vuepress-theme-hope-demo.mrhope.site",
        author: "西魏陶渊明",
        repo: "https://github.com/vuepress-theme-hope/vuepress-theme-hope",
        editLinks: true,
        nav: [
            {text: "指南", link: "/siteload", icon: "creative"}
        ],
        sidebarDepth: 4,
        displayAllHeaders: true,
        locales: {
            "/play/": {
                lang: 'en-ZH', // 将会被设置为 <html> 的 lang 属性
                label: '娱乐区',
                selectText: 'Languages',
                ariaLabel: 'Languages',
                editLinkText: 'Edit this page on GitHub',
            },
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
                    {text: "网站地图", link: "/siteload", icon: "creative"},
                    {text: "大学生专题", link: "/learn/school/students", icon: "study"},
                    {
                        text: 'Java',
                        ariaLabel: 'Java',
                        items: [
                            {text: 'Java基础', link: '/language/chinese/'},
                            {text: 'Java中级', link: '/language/japanese/'},
                            {text: 'Java高级', link: '/language/japanese/'},
                            {text: 'JVM', link: '/language/japanese/'},
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
                                    {text: '编译卡点插件', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            }
                        ]
                    },
                    {
                        text: '字节码',
                        items: [
                            {
                                text: '源码分析', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '扩展开发', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            }
                        ]
                    },
                    {
                        text: '字节码',
                        items: [
                            {
                                text: '源码分析', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '扩展开发', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            }
                        ]
                    }, {
                        text: 'Database',
                        items: [
                            {
                                text: '关系型数据库', items: [
                                    {text: 'Mysql', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: 'NoSql', items: [
                                    {text: 'Redis', link: '/language/chinese/'},
                                    {text: 'Mongo', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '图数据库', items: [
                                    {text: 'Neo4J', link: '/language/chinese/'},
                                    {text: 'JanuasGraph', link: '/language/japanese/'}
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
                                ]
                            },
                            {
                                text: '设计', items: [
                                    {text: '领域驱动模型的思考与认知', link: '/learn/design/领域驱动模型的思考与认知'},
                                ]
                            }
                        ]
                    },
                    {
                        text: '博客搭建',
                        items: [
                            {
                                text: '博客框架', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '服务器选择', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            },
                            {
                                text: '域名部署', items: [
                                    {text: 'Chinese', link: '/language/chinese/'},
                                    {text: 'Japanese', link: '/language/japanese/'}
                                ]
                            }
                        ]
                    }
                ],
                sidebar: {
                    "/zh/": [
                        "",
                        "home",
                        "slides",
                        "layout",
                        {
                            title: "如何使用",
                            icon: "creative",
                            prefix: "guide/",
                            children: ["", "page", "markdown", "disable", "encrypt"],
                        },
                    ],
                    "/learn/other/": [
                        {
                            title: "基础能力",
                            icon: "creative",
                            children: ['java-watch-file', 'bug','程序猿到底有没有必要买一台阿里云服务器','重剑无锋大巧不工']
                        }
                    ],
                    "/learn/design/": [
                        {
                            title: "推荐",
                            icon: "creative",
                            children: ['/learn/other/java-watch-file', '/learn/other/bug']
                        }
                    ],
                },
            },
        },
        markdown: {
            lineNumbers: true
        },
        blog: {
            intro: "/intro/",
            sidebarDisplay: "mobile",
            links: {
                Zhihu: "https://zhihu.com",
                Baidu: "https://baidu.com",
                Github: "https://github.com",
            },
        },
        footer: {
            display: true,
            content: "默认页脚",
        },
        comment: {
            type: "waline",
            serverURL: "https://vuepress-theme-hope-comment.vercel.app",
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
            favicon: "/favicon.ico",
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
    },
});
