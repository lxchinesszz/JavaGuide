import Vue from "vue";
import ArticleInfo from "@theme/components/Blog/ArticleInfo.vue";
import LockIcon from "@theme/icons/LockIcon.vue";
import PresentationIcon from "@theme/icons/PresentationIcon.vue";
import StickyIcon from "@theme/icons/StickyIcon.vue";
import Yuanchuang from "@theme/icons/Yuanchuang.vue";
import ZhuanzaiIcon from "@theme/icons/ZhuanzaiIcon.vue";
import HotIcon from "@theme/icons/HotIcon.vue";
import { getPathMatchedKeys } from "@theme/utils/encrypt";
export default Vue.extend({
    name: "ArticleItem",
    components: { ArticleInfo, LockIcon, StickyIcon, PresentationIcon,Yuanchuang,HotIcon,ZhuanzaiIcon },
    props: {
        article: { type: Object, required: true },
    },
    computed: {
        isEncrypted() {
            return (getPathMatchedKeys(this.$themeConfig.encrypt, this.article.path)
                .length !== 0 || Boolean(this.article.frontmatter.password));
        },
        excerpt() {
            if (this.article.excerpt)
                return this.article.excerpt;
            return (this.article.frontmatter.description ||
                (this.$themeConfig.blog && this.$themeConfig.blog.autoExcerpt === false
                    ? ""
                    : this.article.frontmatter.summary || ""));
        },
        time() {
            const { date, time = date } = this.article.frontmatter;
            if (typeof time === "string") {
                if (time.indexOf("T") !== -1) {
                    const [dateString, temp] = time.split("T");
                    const [times] = temp.split(".");
                    return `${dateString} ${times === "00:00:00" ? "" : times}`;
                }
                return time;
            }
            return this.article.createTime || "";
        },
    },
});
//# sourceMappingURL=ArticleItem.js.map
