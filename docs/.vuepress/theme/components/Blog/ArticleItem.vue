<template>
  <article class="article" vocab="https://schema.org/" typeof="Article">
    <StickyIcon v-if="article.frontmatter.sticky" />
    <div class="labelTag" style="background:#d22429">
      原创
    </div>
    <header class="title" @click="$router.push(article.path)">
      <LockIcon v-if="isEncrypted" />
      <PresentationIcon v-if="article.frontmatter.layout === 'Slide'" />
      <span property="headline">{{ article.title }}</span>
      <meta
        v-if="article.frontmatter.image"
        property="image"
        :content="$withBase(article.frontmatter.image)"
      />
    </header>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="excerpt" class="excerpt" v-html="excerpt" />
    <hr class="hr" />
    <ArticleInfo :article="article" />
  </article>
</template>

<script src="./ArticleItem" />

<style lang="stylus">
.labelTag {
  position: relative;
  overflow: hidden;
  top: -29px;
  left: -81px;
  transform: rotate(-45deg);
  width: 10rem;
  height: 4rem;
  line-height: 5.8rem;
  text-align: center;
  text-transform: uppercase;
  transform-origin: center;
  background: #ef085b;
  color: white;
  font-weight: 700;
  font-size: 12.432px;
}
.article
  position relative
  box-sizing border-box
  width 100%
  margin 0 auto 20px
  padding 16px 20px
  background var(--bgcolor)
  border-radius 6px
  text-align left
  box-shadow 0 1px 3px 0 var(--card-shadow-color)
  overflow: hidden;

  @media (max-width $MQMobileNarrow)
    border-radius 0

  &:last-child
    margin-bottom 0

  &:hover
    box-shadow 0 2px 6px 0 var(--card-shadow-color)

  .sticky-icon
    position absolute
    top 0
    right 0
    width 40px
    height 40px
    fill var(--accent-color)

    .sticky-text
      fill var(--white)

  .title
    display inline-block
    position relative
    font-size 1.28rem
    line-height 36px

    &::after
      content ''
      position absolute
      width 100%
      height 2px
      bottom 0
      left 0
      background var(--accent-color)
      visibility hidden
      transform scaleX(0)
      transition transform 0.3s ease-in-out

    &:hover
      cursor pointer

      &::after
        visibility visible
        transform scaleX(1)

    .lock-icon, .presentation-icon
      position relative
      bottom -0.125em
      display inline-block
      vertical-align baseline
      width 20px
      height 20px
      color var(--accent-color)

  .excerpt
    overflow hidden
    line-height 1.7

    h1
      display none

      & + p
        margin-top 0.5em

    p
      &:first-child
        margin-top 0.5em

      &:last-child
        margin-bottom 0.5em

    // code block fix
    pre
      line-height 1.4
      padding 1.25rem 1.5rem
      margin 0.85rem 0

    // line number fix
    .line-numbers-mode
      pre
        padding-left ($lineNumbersWrapperWidth + 1) rem

    // hide code demo
    .code-demo-wrapper
      display none
</style>
