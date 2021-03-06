import MediaLinks from "@theme/components/MediaLinks.vue";
import { timelineMixin } from "@theme/mixins/timeline";
import { filterArticle } from "@theme/utils/article";
import { navigate } from "@theme/utils/navigate";
import Logo from  "@theme/components/Logo.vue";
export default timelineMixin.extend({
    name: "BloggerInfo",
    components: { MediaLinks,Logo },
    computed: {
        blogConfig() {
            return this.$themeConfig.blog || {};
        },
        bloggerName() {
            return (this.blogConfig.name ||
                this.$themeConfig.author ||
                this.$siteTitle ||
                "");
        },
        bloggerAvatar() {
            return this.blogConfig.avatar || this.$themeConfig.logo || "";
        },
        hasIntro() {
            return Boolean(this.blogConfig.intro);
        },
        hintAttr() {
            return this.hasIntro ? "aria-label" : "";
        },
        locales() {
            return this.$themeLocaleConfig.blog;
        },
        articleNumber() {
            return filterArticle(this.$site.pages).length;
        },
    },
    methods: {
        navigate(url) {
            navigate(url, this.$router, this.$route);
        },
        jumpIntro() {
            if (this.hasIntro)
                navigate(this.blogConfig.intro, this.$router, this.$route);
        },
    },
});
//# sourceMappingURL=BloggerInfo.js.map
