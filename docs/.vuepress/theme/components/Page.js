import Anchor from "@theme/components/Anchor.vue";
import MyTransition from "@theme/components/MyTransition.vue";
import PageInfo from "@mr-hope/vuepress-plugin-components/lib/client/PageInfo.vue";
import PageMeta from "@theme/components/PageMeta.vue";
import PageNav from "@theme/components/PageNav.vue";
import Password from "@theme/components/Password.vue";
import { pathEncryptMixin } from "@theme/mixins/pathEncrypt";
export default pathEncryptMixin.extend({
    name: "Page",
    components: {
        Anchor,
        MyTransition,
        PageInfo,
        PageMeta,
        PageNav,
        Password,
    },
    props: {
        sidebarItems: {
            type: Array,
            default: () => [],
        },
        headers: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        password: "",
    }),
    computed: {
        pagePassword() {
            const { password } = this.$frontmatter;
            return typeof password === "number"
                ? password.toString()
                : typeof password === "string"
                    ? password
                    : "";
        },
        pageDescrypted() {
            return this.password === this.pagePassword;
        },
        pageInfoProps() {
            return {
                titleIcon: true,
                titleIconPrefix: this.$themeConfig.iconPrefix,
                items: this.$themeConfig.pageInfo,
                categoryPath: "/category/$category/",
                tagPath: "/tag/$tag/",
                defaultAuthor: this.$themeConfig.author || "",
            };
        },
    },
});
//# sourceMappingURL=Page.js.map