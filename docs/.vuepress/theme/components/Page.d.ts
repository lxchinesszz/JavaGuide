import Anchor from "@theme/components/Anchor.vue";
import type { PageInfoProps } from "@mr-hope/vuepress-plugin-components";
import type { PageHeader } from "@mr-hope/vuepress-types";
import type { SidebarItem } from "@theme/utils/sidebar";
declare const _default: import("vue/types/vue").ExtendedVue<{
    encryptPasswordConfig: Record<string, string>;
} & {
    checkPathPassword(password: string): void;
} & {
    pathEncryptMatchKeys: string[];
    isPathEncrypted: boolean;
} & Record<never, any> & {
    encryptOptions: import("../types").EncryptOptions;
} & Anchor, {
    password: string;
}, unknown, {
    pagePassword: string;
    pageDescrypted: boolean;
    pageInfoProps: PageInfoProps;
}, {
    sidebarItems: SidebarItem[];
    headers: PageHeader[];
}>;
export default _default;
