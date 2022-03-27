import Vue from "vue";
import {isActive} from "@theme/utils/path";

const renderLink = (h, {text, link, level}) => h("RouterLink", {
    props: {
        to: link,
        activeClass: "",
        exactActiveClass: "",
    },
    class: {
        "anchor-link": true,
        [level ? `heading${level}` : ""]: level,
    },
}, [h("div", {}, [text])]);
const renderChildren = (h, {children, route}) => h("ul", {class: "anchor-list"}, children.map((child) => {
    const active = isActive(route, `${route.path}#${child.slug}`);
    return h("li", {class: {anchor: true, active}}, [
        renderLink(h, {
            text: child.title,
            link: `${route.path}#${child.slug}`,
            level: child.level,
        }),
    ]);
}));
export default Vue.extend({
    name: "Anchor",
    functional: true,
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        bannerImg:{
            type: String,
            default: 'https://img.springlearn.cn/learn_c3d5074d94563b8297f81633f171d230.jpeg'
        }
    },
    render(h, {props, parent: {$page, $route}}) {
        return h("div", {attrs: {class: "anchor-place-holder"}}, [
            h("aside", {attrs: {id: "anchor"}}, [
                h("div", {attrs: {class: "anchor-banner"}}, [h("img", {
                    attrs: {
                        class: "anchor-banner-img",
                        src: props.bannerImg
                    }
                })]),
                h("div", {class: "anchor-wrapper"}, [
                    props.items.length
                        ? renderChildren(h, {
                            children: props.items,
                            route: $route,
                        })
                        : $page.headers
                            ? renderChildren(h, {
                                children: $page.headers,
                                route: $route,
                            })
                            : null,
                ]),
            ]),
        ]);
    },
});
//# sourceMappingURL=Anchor.js.map
