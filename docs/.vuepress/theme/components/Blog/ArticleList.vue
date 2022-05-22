<template>
  <div id="article-list" class="article-wrapper">
    <EmptyIcon v-if="!articles.length" class="empty" />
    <ArticleBannerSwiper class="articleBannerSwiper"/>
    <MyTransition
      v-for="(article, index) in articles"
      :key="article.path"
      :delay="index * 0.04"
    >
      <ArticleItem :article="article" />
    </MyTransition>

    <Pagination
      v-model="currentPage"
      :per-page="articlePerPage"
      :total="articleList.length"
    />
  </div>
</template>

<script src="./ArticleList" />

<style lang="stylus">
.articleBannerSwiper
  width 100%
  text-align center
  margin-bottom 0.8rem
  @media (max-width $MQMobile)
    display none
.article-wrapper
  margin-top -0.5rem - $navbarHeight
  padding-top: $navbarHeight + 0.5rem
  text-align center

  @media (max-width $MQMobile)
    margin-top -0.5rem - $navbarMobileHeight
    padding-top: $navbarMobileHeight + 0.5rem

  .empty
    max-width 560px
    margin 0 auto
    text-align center
</style>
