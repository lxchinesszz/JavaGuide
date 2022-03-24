import type { Context } from "@mr-hope/vuepress-types";
import type { HopeThemeConfig, HopeVuePressConfig, ResolvedHopeThemeConfig, ResolvedHopeVuePressConfig } from "../types";
export declare const resolveThemeConfig: (themeConfig: HopeThemeConfig, context: Context) => ResolvedHopeThemeConfig;
export declare const resolveVuePressConfig: (config: HopeVuePressConfig) => ResolvedHopeVuePressConfig;
