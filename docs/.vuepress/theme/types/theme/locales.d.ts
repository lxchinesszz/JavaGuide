import { ConvertLocaleConfig } from "@mr-hope/vuepress-shared";
import { AlgoliaOption } from "@mr-hope/vuepress-types";
import { HopeNavBarConfig, HopeSideBarConfig } from "./extends";
import { HopeFooterConfig } from "./layout";

export interface HopeThemeLocaleData {
  /** 当前语言代码 */
  lang: string;
  /** 多语言下拉菜单的标题 */
  selectText: string;
  /** 该语言在下拉菜单中的标签 */
  label: string;
  /** 辅助标签 */
  ariaLabel?: string;

  /** 页面信息 */
  meta: {
    /** 贡献者文字 */
    contributor: string;
    /** 编辑链接文字 */
    editLink: string;
    /** 该语言下的更新时间文字 */
    updateTime: string;
  };
  /** 主题色配置 */
  themeColor: {
    /** 颜色提示文字 */
    themeColor: string;
    /** 主题模式提示文字 */
    themeMode: string;
  };
  /** 加密 */
  encrypt: {
    title: string;
    errorHint: string;
  };
  /** 404错误页 */
  error404: {
    /** 错误提示语 */
    hint: string[];
    /** 返回主页文字 */
    home: string;
    /** 返回上一页文字 */
    back: string;
  };
  /** 博客设置 */
  blog: {
    /** 文章文字 */
    article: string;
    /** 文章列表文字 */
    articleList: string;
    /** 分类文字 */
    category: string;
    /** 标签文字 */
    tag: string;
    /** 时间轴文字 */
    timeline: string;
    /** 时间轴显示文字 */
    timelineText: string;
    /** 全部文字 */
    allText: string;
    /** 个人介绍 */
    intro: string;
    /** 搜藏文字 */
    star: string;
    /** 幻灯片 */
    slides: string;
    /** 加密 */
    encrypt: string;
  };
}

export type HopeThemeLocaleConfig = ConvertLocaleConfig<HopeThemeLocaleData>;

/** vuepress-theme-hope 多语言配置 */
export interface HopeThemeLocalesConfig extends Partial<HopeThemeLocaleData> {
  /** 当前语言下的标题 */
  title?: string;
  /** 当前语言下的描述 */
  description?: string;
  /** 导航栏链接 */
  nav?: HopeNavBarConfig;
  /** 侧边栏配置 */
  sidebar?: HopeSideBarConfig;
  /** 当前语言的 algolia 设置 */
  algolia?: AlgoliaOption;
  /** 页脚设置 */
  footer?: HopeFooterConfig;
}
