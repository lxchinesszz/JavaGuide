<template>
  <div class="blogger-info" vocab="https://schema.org/" typeof="Person">
    <div
      class="blogger"
      :class="{ hasIntro }"
      :[hintAttr]="hasIntro ? locales.intro : ''"
      :data-balloon-pos="hasIntro ? 'down' : ''"
      role="navigation"
      @click="jumpIntro"
    >
<!--      <Logo></Logo>-->
      <img
        v-if="bloggerAvatar"
        class="avatar hvr-float-shadow"
        :class="{ round: blogConfig.roundAvatar !== false }"
        property="image"
        alt="Blogger Avatar"
        :src="$withBase(bloggerAvatar)"
      />
      <div
        v-if="bloggerName"
        class="name"
        property="name"
        v-text="bloggerName"
      />
      <meta
        v-if="hasIntro"
        property="url"
        :content="$withBase(blogConfig.intro)"
      />
    </div>
    <div class="num-wrapper">
      <div @click="navigate('/article/')">
        <div class="num">{{ articleNumber }}</div>
        <div>{{ locales.article }}</div>
      </div>
      <div @click="navigate('/category/')">
        <div class="num">{{ $category.list.length }}</div>
        <div>{{ locales.category }}</div>
      </div>
      <div @click="navigate('/tag/')">
        <div class="num">{{ $tag.list.length }}</div>
        <div>{{ locales.tag }}</div>
      </div>
      <div @click="navigate('/timeline/')">
        <div class="num">{{ $timelineItems.length }}</div>
        <div>{{ locales.timeline }}</div>
      </div>
    </div>
    <MediaLinks />
  </div>
</template>

<script src="./BloggerInfo" />

<style lang="stylus">
//.avatar:hover
//  transform: scale(1.24);
//  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
.blogger-info
  .page &
    background var(--bgcolor)

  .blogger
    padding 8px 0
    text-align center

    &.hasIntro
      cursor pointer

    .avatar
      width 128px
      height 128px
      margin 0 auto

      &.round
        border-radius 50%

    .name
      margin 16px auto
      font-size 22px
      color: #404245;
      font-weight: 600;

  .num-wrapper
    display flex
    margin 0 auto 16px
    width 80%

    > div
      width 25%
      text-align center
      font-size 13px
      cursor pointer

      &:hover
        color var(--accent-color)

      .num
        position relative
        margin-bottom 8px
        font-weight 600
        font-size 20px
</style>
