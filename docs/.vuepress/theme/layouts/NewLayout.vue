<template>
  <Common :sidebar="$frontmatter.blog !== true">
    <template #navbar-start>
      <slot name="navbar-start">
        <NavbarStart />
        <Content slot-key="navbar-start" />
      </slot>
    </template>

    <template #navbar-center>
      <slot name="navbar-center">
        <NavbarCenter />
        <Content slot-key="navbar-center" />
      </slot>
    </template>

    <template #navbar-end>
      <slot name="navbar-end">
        <NavbarEnd />
        <Content slot-key="navbar-end" />
      </slot>
    </template>

    <template #sidebar-top>
      <slot name="sidebar-top">
        <SidebarTop />
        <Content slot-key="sidebar-top" />
      </slot>
    </template>

    <template #sidebar-center>
      <slot name="sidebar-center">
        <SidebarCenter />
        <Content slot-key="sidebar-center" />
      </slot>
    </template>

    <template #sidebar-bottom>
      <slot name="sidebar-bottom">
        <SidebarBottom />
        <Content slot-key="sidebar-bottom" />
      </slot>
    </template>

    <template #default="slotProps">
      <BlogHome v-if="$frontmatter.blog && $themeConfig.blog !== false" />

      <Home v-else-if="$frontmatter.home" />
      <BlankHome v-else-if="$frontmatter.blankHome" />

      <Page
          v-else
          :headers="slotProps.headers"
          :sidebar-items="slotProps.sidebarItems"
      >
        <template #top>
          <slot name="page-top">
            <PageTop />
            <Content slot-key="page-top" />
          </slot>
        </template>

        <template #content-top>
          <slot name="content-top">
            <ContentTop />
            <Content slot-key="content-top" />
          </slot>
        </template>

        <template #content-bottom>
          <slot name="content-bottom">
            <ContentBottom />
            <Content slot-key="content-bottom" />
          </slot>
        </template>

        <template #bottom>
          <slot name="page-bottom">
            <PageBottom />
            <Content slot-key="page-bottom" />
          </slot>
        </template>
      </Page>
    </template>
  </Common>
</template>

<script>
import Vue from "vue";
import BlogInfo from "@BlogInfo";
import BlogHome from "@BlogHome";
import ContentBottom from "@ContentBottom";
import ContentTop from "@ContentTop";
import NavbarStart from "@NavbarStart";
import NavbarCenter from "@NavbarCenter";
import NavbarEnd from "@NavbarEnd";
import PageBottom from "@PageBottom";
import PageTop from "@PageTop";
import SidebarBottom from "@SidebarBottom";
import SidebarCenter from "@SidebarCenter";
import SidebarTop from "@SidebarTop";
import Common from "@theme/components/Common.vue";
import Home from "@theme/components/Home.vue";
import BlankHome from "@theme/components/BlankHome.vue";
import Page from "@theme/components/Page.vue";
export default Vue.extend({
  name: "NewLayout",
  components: {
    BlogInfo,
    BlogHome,
    Common,
    ContentBottom,
    ContentTop,
    Home,
    BlankHome,
    NavbarCenter,
    NavbarEnd,
    NavbarStart,
    Page,
    PageBottom,
    PageTop,
    SidebarBottom,
    SidebarCenter,
    SidebarTop
  },
});
//# sourceMappingURL=Layout.js.map
</script>

<style scoped>

</style>
