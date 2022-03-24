"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginConfig = void 0;
const path_1 = require("path");
const clean_url_1 = require("./clean-url");
const chunk_rename_1 = require("./chunk-rename");
const resolveAddThisOptions = (themeConfig) => {
    const { addThis } = themeConfig;
    return typeof addThis === "string" ? { pubid: addThis } : false;
};
const resolveCommentOptions = (themeConfig) => {
    return themeConfig.comment === false
        ? false
        : Object.assign({ type: "disable" }, (themeConfig.comment || null));
};
const resolveComponentsOptions = (themeConfig) => (Object.assign(Object.assign({}, (themeConfig.components || null)), { backToTop: themeConfig.backToTop !== false, backToTopThreshold: typeof themeConfig.backToTop === "number" ? themeConfig.backToTop : 300, breadcrumb: true, badge: true, pageinfo: true, pagination: true, screenFull: true }));
const resolveCopyCodeOptions = (themeConfig) => themeConfig.copyCode === false ? false : themeConfig.copyCode || {};
const resolveFeedOptions = (themeConfig) => {
    var _a;
    return themeConfig.feed === false
        ? false
        : Object.assign(Object.assign({ hostname: themeConfig.hostname || "" }, themeConfig.feed), { channel: Object.assign({ author: themeConfig.author ? { name: themeConfig.author } : undefined, copyright: themeConfig.footer.copyright || "" }, (((_a = themeConfig.feed) === null || _a === void 0 ? void 0 : _a.channel) || null)) });
};
const resolveMarkdownEnhanceOptions = (themeConfig) => (Object.assign({ container: true }, (themeConfig.mdEnhance || {})));
const resolvePhotoSwipeOptions = (themeConfig) => themeConfig.photoSwipe === false ? false : themeConfig.photoSwipe || {};
const resolvePwaOptions = (themeConfig) => themeConfig.pwa === false ? false : themeConfig.pwa || {};
const resolveSeoOptions = (themeConfig) => themeConfig.seo === false
    ? false
    : Object.assign({ author: themeConfig.author }, themeConfig.seo);
const resolveSitemapOptions = (themeConfig) => themeConfig.sitemap === false
    ? false
    : Object.assign({ hostname: themeConfig.hostname || "" }, themeConfig.sitemap);
const resolveSmmothScrollOptions = (themeConfig) => themeConfig.smoothScroll === false
    ? false
    : typeof themeConfig.smoothScroll === "number"
        ? { delay: themeConfig.smoothScroll }
        : Object.assign({ delay: 500 }, (themeConfig.smoothScroll || {}));
const getPluginConfig = (themeConfig) => {
    // set author for comment plugin
    if (themeConfig.comment && themeConfig.author)
        themeConfig.comment.author = themeConfig.author;
    return [
        ["@mr-hope/comment", resolveCommentOptions(themeConfig)],
        ["@mr-hope/components", resolveComponentsOptions(themeConfig)],
        ["@mr-hope/feed", resolveFeedOptions(themeConfig)],
        ["@mr-hope/git", themeConfig.git],
        ["@mr-hope/pwa", resolvePwaOptions(themeConfig)],
        ["@mr-hope/seo", resolveSeoOptions(themeConfig)],
        ["@mr-hope/sitemap", resolveSitemapOptions(themeConfig)],
        ["@mr-hope/smooth-scroll", resolveSmmothScrollOptions(themeConfig)],
        [
            "@vuepress/blog",
            themeConfig.blog === false
                ? false
                : {
                    frontmatters: [
                        {
                            id: "tag",
                            keys: ["tag", "tags"],
                            path: "/tag/",
                            layout: "Blog",
                            scopeLayout: "Blog",
                        },
                        {
                            id: "category",
                            keys: ["category", "categories"],
                            path: "/category/",
                            layout: "Blog",
                            scopeLayout: "Blog",
                        },
                    ],
                },
        ],
        ["@vuepress/last-updated", false],
        "@vuepress/nprogress",
        [
            "@vuepress/search",
            {
                searchMaxSuggestions: themeConfig.searchMaxSuggestions || 10,
            },
        ],
        ["active-hash", themeConfig.activeHash],
        ["add-this", resolveAddThisOptions(themeConfig)],
        [
            "copyright",
            typeof themeConfig.copyright === "object"
                ? Object.assign({ minLength: 100, disable: themeConfig.copyright.status === "local", clipboardComponent: (0, path_1.resolve)(__dirname, "../components/Clipboard.vue") }, themeConfig.copyright) : false,
        ],
        ["md-enhance", resolveMarkdownEnhanceOptions(themeConfig)],
        ["@mr-hope/copy-code", resolveCopyCodeOptions(themeConfig)],
        ["photo-swipe", resolvePhotoSwipeOptions(themeConfig)],
        [
            "typescript",
            themeConfig.typescript
                ? {
                    tsLoaderOptions: typeof themeConfig.typescript === "object"
                        ? themeConfig.typescript
                        : {},
                }
                : false,
        ],
        [
            clean_url_1.cleanUrlPlugin,
            themeConfig.cleanUrl === false
                ? false
                : themeConfig.cleanUrl || { normalSuffix: "/" },
        ],
        [
            chunk_rename_1.chunkRenamePlugin,
            themeConfig.chunkRename === false ? false : themeConfig.chunkRename,
        ],
    ];
};
exports.getPluginConfig = getPluginConfig;
//# sourceMappingURL=plugins.js.map