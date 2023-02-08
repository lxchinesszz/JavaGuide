<template>
  <article class="article" vocab="https://schema.org/" typeof="Article">
<!--    <StickyIcon v-if="article.frontmatter.sticky"/>-->
    <Yuanchuang v-if="article.frontmatter.yuanchuang"/>
    <HotIcon  v-if="article.frontmatter.sticky" class="hvr-icon-wobble-vertical"/>
    <!--    <div class="labelTag" style="background:#d22429">-->
    <!--      原创-->
    <!--    </div>-->
    <div class="post">
      <div class="post-media" v-if="article.frontmatter.image"
           :style="{'background-image':'url(' + article.frontmatter.image + ')'}">
      </div>
      <div class="post-media" v-if="!article.frontmatter.image"
           :style="{'background-image':'url(' + $themeConfig.postMedia + ')','border-radius':'10px'}">
      </div>
      <div class="post-content">
        <header class="title hvr-icon-buzz-out" @click="$router.push(article.path)">
          <LockIcon v-if="isEncrypted"/>
          <PresentationIcon v-if="article.frontmatter.layout === 'Slide'"/>
          <span property="headline">{{ article.title }}</span>
          <meta
              v-if="article.frontmatter.image"
              property="image"
              :content="$withBase(article.frontmatter.image)"
          />
        </header>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="post-date">•
          {{time}}</div>
        <div v-if="excerpt" class="excerpt" v-html="excerpt"/>
      </div>
    </div>
    <hr class="hr"/>
    <ArticleInfo :article="article"/>
  </article>
</template>

<script src="./ArticleItem"/>

<style lang="stylus">
//.article:nth-child(2n+1) {
//
//}
.post {
  display flex
  flex-direction row
  .post-date{
    color: #959595;
    margin: 5px 0;
  }
  .post-media {
    overflow: hidden;
    display block
    width 60vw
    margin-right 15px
    background-size cover
    background-position center
  }

  .post-content {
    width 100vw
  }
}

.labelTag {
  position: relative;
  overflow: hidden;
  top: -45px;
  left: -97px;
  transform: rotate(-45deg);
  width: 10rem;
  height: 4rem;
  line-height: 6.2rem;
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
  //background-image url("https://img.springlearn.cn/learn_1c8815b93233372f146510910cd9738c.png")
  border-radius 6px
  text-align left
  box-shadow 0 1px 3px 0 var(--card-shadow-color)
  overflow: hidden;
  @media (max-width $MQMobileNarrow)
    border-radius 0

  //&:nth-child(2n+1)
  //  background var(--bgcolor)
  //  background-size cover;
  //  background-image url('https://img.springlearn.cn/learn_ecb1d2abbc051298aeb24e4b203331ca.png');
  //&:nth-child(3n+1)
  //  background-size cover;
  //  background-image url('https://img.springlearn.cn/learn_51bb1102ab907e7ada0f56c82ad15368.png');
  &:last-child
    margin-bottom 0

  &:hover
    box-shadow 0 2px 6px 0 var(--card-shadow-color)

  .yuanchuang
    position absolute
    top -6px
    left  0
    width 40px
    height 40px
    fill var(--accent-color)

    .yuanchuang-text
      fill var(--white)
  .sticky-icon
    position absolute
    top 5px
    right 5px
    width 30px
    height 30px
    fill var(--accent-color)

    .sticky-text
      fill var(--white)

  .title
    display inline-block
    position relative
    font-size 1.7rem
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
    color #666666;

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
