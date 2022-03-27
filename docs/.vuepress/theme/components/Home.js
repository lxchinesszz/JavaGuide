import Vue from "vue";
import axios from 'axios';
import MyTransition from "@theme/components/MyTransition.vue";
import NavLink from "@theme/components/Navbar/NavLink.vue";
import HomeJitang from "@theme/components/Home/HomeJitang.vue"
import HomeAnimation from "@theme/components/Home/HomeAnimation.vue"

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
        let _this = this;
        axios.get('https://service-etyft6el-1257000250.sh.apigw.tencentcs.com/release/dujitang')
            .then(({data}) => {
                _this.djt = data
            }).catch(console.error);
    },
    methods: {
        navigate(link) {
            navigate(link, this.$router, this.$route);
        }
    },
});
//# sourceMappingURL=Home.js.map
