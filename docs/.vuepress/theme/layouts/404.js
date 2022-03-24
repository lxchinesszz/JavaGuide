import Vue from "vue";
import Common from "@theme/components/Common.vue";
import Page404Icon from "@theme/icons/Page404Icon.vue";
export default Vue.extend({
    name: "NotFound",
    components: {
        Common,
        Page404Icon,
    },
    computed: {
        locales() {
            return this.$themeLocaleConfig.error404;
        },
        msg() {
            return this.locales.hint[Math.floor(Math.random() * this.locales.hint.length)];
        },
    },
    methods: {
        back() {
            window.history.go(-1);
        },
    },
});
//# sourceMappingURL=404.js.map