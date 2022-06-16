import Vue from "vue";
import MyTransition from "@theme/components/MyTransition.vue";
import NavLink from "@theme/components/Navbar/NavLink.vue";
import HomeJitang from "@theme/components/Home/HomeJitang.vue"
import HomeAnimation from "@theme/components/Home/HomeAnimation.vue"
import {say} from "../../public/js/yiyan";
import {navigate} from "@theme/utils/navigate";

export default Vue.extend({
    name: "Home",
    components: {MyTransition, NavLink, HomeJitang, HomeAnimation},
    computed: {
        actionLinks() {
            const {action} = this.$frontmatter;
            if (Array.isArray(action))
                return action;
            return [action];
        },
    },
    data: function () {
        return {
            djt: ''
        }
    }
    ,
    created: function () {
        this.$nextTick(() => {
            this.djt = say();
        })
    },
    methods: {
        navigate(link) {
            navigate(link, this.$router, this.$route);
        }
    },
});
//# sourceMappingURL=Home.js.map
