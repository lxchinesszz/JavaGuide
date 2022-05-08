import Vue from "vue";
import Cookies from 'js-cookie'
import Deadline from './Deadine.vue'

export default Vue.extend({
    name: "Password",
    props: {
        page: {type: Boolean, default: false},
    },
    data: () => ({
        password: "",
        hasTried: false,
        passSuccess: null
    }),
    components: {Deadline},
    computed: {
        isMainPage() {
            return this.$frontmatter.home === true;
        },
        encrypt() {
            return this.$themeLocaleConfig.encrypt;
        }
    },
    methods: {
        verify() {
            this.hasTried = false;
            // eslint-disable-next-line vue/require-explicit-emits
            this.$emit("password-verify", this.password);
            void Vue.nextTick().then(() => {
            });
        },
    },
    created: function () {
        console.log("password:", Cookies.get("password"));
        if (Cookies.get("password")) {
            this.password = Cookies.get("password");
            this.verify();
        }
    }
});
//# sourceMappingURL=Password.js.map
