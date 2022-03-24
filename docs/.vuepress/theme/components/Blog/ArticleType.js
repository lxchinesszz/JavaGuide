import Vue from "vue";
import { navigate } from "@theme/utils/navigate";
export default Vue.extend({
    name: "ArticleType",
    computed: {
        types() {
            const locales = this.$themeLocaleConfig.blog;
            return [
                { text: locales.allText, path: "/article/" },
                { text: locales.star, path: "/star/" },
                { text: locales.slides, path: "/slide/" },
                { text: locales.encrypt, path: "/encrypt/" },
            ];
        },
    },
    methods: {
        navigate(path) {
            navigate(path, this.$router, this.$route);
        },
    },
});
//# sourceMappingURL=ArticleType.js.map