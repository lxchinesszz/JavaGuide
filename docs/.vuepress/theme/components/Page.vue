<template>
  <main class="page">
    <MyTransition>
      <BreadCrumb
          :key="$route.path"
          :show="$themeConfig.breadcrumb !== false"
          :icon="$themeConfig.breadcrumbIcon !== false"
          :icon-prefix="$themeConfig.iconPrefix"
      />
    </MyTransition>

    <slot name="top"/>

    <MyTransition :delay="0.04">
      <PageInfo :key="$route.path" v-bind="pageInfoProps"/>
    </MyTransition>

    <MyTransition v-if="pagePassword && !pass" :delay="0.08">
      <Password ref="passwordRef"
                :key="$route.path"
                :page="true"
                @password-verify="checkPassword"
      />
    </MyTransition>

    <MyTransition v-else-if="isPathEncrypted" :delay="0.08">
      <Password
          :key="$route.path"
          :page="true"
          @password-verify="checkPassword"
      />
    </MyTransition>

    <template v-else>
      <MyTransition :delay="0.12">
        <Anchor :key="$route.path" :bannerImg="$themeConfig.anchorBanner"/>
      </MyTransition>

      <slot v-if="!pagePassword || pageDescrypted" name="content-top"/>

      <MyTransition v-show="!pagePassword || pass" :delay="0.08">
        <div>
          <Content :key="$route.path" class="theme-default-content"/>
          <!--          默认不填noPageCopyright:true 不显示-->
          <FooterBanner class="theme-default-content" v-show="!$page.frontmatter.noPageCopyright" style="margin-top: 12px"></FooterBanner>
        </div>
      </MyTransition>
      <slot v-if="!pagePassword || pageDescrypted" name="content-bottom"/>

      <MyTransition :delay="0.12">
        <PageMeta :key="$route.path"/>
      </MyTransition>

      <MyTransition :delay="0.14">
        <PageNav :key="$route.path" v-bind="{ sidebarItems }"/>
      </MyTransition>

      <MyTransition :delay="0.16">
        <CommentService v-if="$themeConfig.comment" :key="$route.path"/>
      </MyTransition>
    </template>

    <slot name="bottom"/>
  </main>
</template>

<script src="./Page"/>

<style lang="stylus">
//.page::before
//  background url("https://scm.springlearn.cn/img/package-6.png");
//  content "";
//  top -30px
//  position absolute;
//  bottom 0
//  left 0
//  right 0

//.theme-default-content
//  background: var(--bgcolor);
//  border-radius: 6px;
//  box-shadow: 0 1px 3px 0 var(--card-shadow-color);

.page
  display block
  box-sizing border-box
  min-height 100vh
  padding-left $sidebarWidth
  padding-bottom 2rem
  background var(--bgcolor)

  @media (max-width $MQMobile)
    min-height 100vh

  // narrow desktop / iPad
  @media (max-width $MQNarrow)
    padding-left $mobileSidebarWidth

  // wide mobile
  @media (max-width $MQMobile)
    padding-left 0

  @media (min-width $MQMobile)
    .theme-container:not(.has-sidebar) &
      padding-left 0

  @media (min-width $MQWide)
    .has-anchor &:not(.blog)
      padding-right 16rem
</style>
