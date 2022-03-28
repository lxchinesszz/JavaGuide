import Anchor from "@theme/components/Anchor.vue";
import MyTransition from "@theme/components/MyTransition.vue";
import PageInfo from "@mr-hope/vuepress-plugin-components/lib/client/PageInfo.vue";
import PageMeta from "@theme/components/PageMeta.vue";
import PageNav from "@theme/components/PageNav.vue";
import Password from "@theme/components/Password.vue";
import FooterBanner from "@theme/components/FooterBanner.vue";
import {pathEncryptMixin} from "@theme/mixins/pathEncrypt";
import axios from 'axios';
import Cookies from 'js-cookie';

export default pathEncryptMixin.extend({
    name: "Page",
    components: {
        Anchor,
        MyTransition,
        PageInfo,
        PageMeta,
        PageNav,
        Password,
        FooterBanner
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
        pass: false
    }),
    methods: {
        checkPassword(password) {
            this.pass = false
            axios.get(`https://api.springlearn.cn/user/${password}`).then((res) => {
                console.log("获取openId", JSON.stringify(res))
                if (res.data.code === 0) {
                    if (res.data.data) {
                        let openId = res.data.data.openId;
                        Cookies.set("password", password)
                        axios.post(`https://api.springlearn.cn/user/validation?openId=${openId}&veryCode=${password}`).then((res) => {
                            console.log(`数据1:${JSON.stringify(res)}`)
                            if (res.data.code === 0) {
                                this.pass = res.data.data
                                console.log(`this.$refs.passwordRef:`, this.$refs.passwordRef)
                                this.$refs.passwordRef.hasTried = false
                                this.$refs.passwordRef.passSuccess = '暗号正确，接头成功'
                                void Vue.nextTick().then(() => {
                                });
                            } else {
                                console.log("失败")
                                this.$refs.passwordRef.hasTried = true
                            }
                        })
                    } else {
                        this.$refs.passwordRef.hasTried = true
                    }
                }
            }).catch((err) => {
                console.log(err)
                console.log("失败")
                this.$refs.passwordRef.hasTried = true
            })
            console.log("密码", password)
        }
    },
    computed: {
        pagePassword() {
            const {password} = this.$frontmatter;
            return typeof password === "number"
                ? password.toString()
                : typeof password === "string"
                    ? password
                    : "";
        },
        pageDescrypted() {
            // 从网络中获取信息
            console.log("----------")
            console.log("密码", this.password)
            return false;
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
