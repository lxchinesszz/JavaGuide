import ArticleIcon from "@theme/icons/ArticleIcon.vue";
import CategoryIcon from "@mr-hope/vuepress-plugin-components/lib/client/pageinfo/icons/CategoryIcon.vue";
import TagIcon from "@mr-hope/vuepress-plugin-components/lib/client/pageinfo/icons/TagIcon.vue";
import TimeIcon from "@mr-hope/vuepress-plugin-components/lib/client/pageinfo/icons/TimeIcon.vue";
import CategoryList from "@theme/components/Blog/CategoryList.vue";
import MyTransition from "@theme/components/MyTransition.vue";
import TagList from "@theme/components/Blog/TagList.vue";
import TimelineList from "@theme/components/Blog/TimelineList.vue";
import { filterArticle } from "@theme/utils/article";
import { starMixin } from "@theme/mixins/star";
export default starMixin.extend({
    name: "BlogInfo",
    components: {
        ArticleIcon,
        CategoryIcon,
        CategoryList,
        MyTransition,
        TagIcon,
        TagList,
        TimeIcon,
        TimelineList,
    },
    data: () => ({
        active: "category",
    }),
    computed: {
        locales() {
            return this.$themeLocaleConfig.blog;
        },
        articleNumber() {
            return filterArticle(this.$site.pages).length;
        },
    },
    methods: {
        setActive(name) {
            this.active = name;
        },
        navigate(path) {
            if (this.$route.path !== path)
                void this.$router.push(path);
        },
    },
});
//# sourceMappingURL=BlogInfoList.js.map