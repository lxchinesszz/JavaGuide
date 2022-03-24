"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVuePressConfig = exports.resolveThemeConfig = void 0;
const vuepress_shared_1 = require("@mr-hope/vuepress-shared");
const encrypt_1 = require("./encrypt");
const locales_1 = require("./locales");
const defaultConfig = {
    base: process.env.VuePress_BASE || "/",
    temp: "./node_modules/.temp",
    locales: {},
    theme: "hope",
    themeConfig: { locales: {} },
    evergreen: true,
};
const defaultThemeConfig = {
    sidebarDepth: 2,
    iconPrefix: "icon-",
    footer: {},
    editLinks: true,
};
const resolveThemeConfig = (themeConfig, context) => {
    // merge default themeConfig
    (0, vuepress_shared_1.deepAssignReverse)(defaultThemeConfig, themeConfig);
    // inject locales
    themeConfig.locales = (0, vuepress_shared_1.getLocales)(context, locales_1.themeLocales, themeConfig.locales);
    // handle encrypt options
    if (themeConfig.encrypt)
        (0, encrypt_1.resolveEncrypt)(themeConfig.encrypt);
    return themeConfig;
};
exports.resolveThemeConfig = resolveThemeConfig;
const resolveVuePressConfig = (config) => {
    // merge default config
    (0, vuepress_shared_1.deepAssignReverse)(defaultConfig, config);
    // assign lang to locales
    for (const path in config.locales) {
        if (path !== "/" && !config.locales[path].lang)
            config.locales[path].lang = (0, vuepress_shared_1.path2Lang)(path);
    }
    return config;
};
exports.resolveVuePressConfig = resolveVuePressConfig;
//# sourceMappingURL=config.js.map