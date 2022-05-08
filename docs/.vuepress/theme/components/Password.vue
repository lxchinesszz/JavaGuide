<template>
  <div class="password divide-fuchsia-300" :class="{ expand: page || isMainPage }">
    <div class="gzhCard shadow">
      <div class="passImgDiv">
        <img class="passImg" src="https://img.springlearn.cn/learn_c3d5074d94563b8297f81633f171d230.jpeg" alt="">
      </div>
      <div class="hint" :class="{ hasTried }">
        {{ hasTried ? $themeConfig.encrypt.errorHint : passSuccess ? passSuccess : $themeConfig.encrypt.title }}
      </div>
    </div>
<!--    <div class="static" style="margin-bottom: 1rem">-->
<!--      <Deadline/>-->
<!--    </div>-->
    <div class="input">
      <input v-model="password" type="password" @keypress.enter="verify"/>
      <button @click="verify">OK</button>
    </div>
  </div>
</template>

<script src="./Password"/>

<style lang="stylus">

.shadow
  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);

.gzhCard
  margin-bottom 1rem
  border-radius 1rem

.passImgDiv
  height 20vh
  width auto
  margin-bottom 1rem

.passImg
  height 20vh
  width auto

.password
  background var(--bg-color)
  text-align center
  display flex
  flex-direction column
  margin-top $navbarHeight
  justify-content center
  align-items center

  @media (max-width $MQNarrow)
    height 90vh - $navbarMobileHeight
    margin-top $navbarMobileHeight
    padding-left $mobileSidebarWidth

  @media (max-width $MQMobile)
    padding-left 0

  &.expand
    padding-left 0 !important
    margin-top 0
    height 400px

  .hint
    //margin-bottom 20px
    font-family Arial, Helvetica, sans-serif
    font-size 22px
    line-height 2
    border-bottom-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    background: #1D976C;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #93F9B9, #1D976C);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #93F9B9, #1D976C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

&.hasTried
      color red
      font-weight 600
      animation-name shake
      animation-duration 0.5s
      animation-timing-function ease-out
      animation-fill-mode both

  .input
    width 70%
    max-width 600px
    display flex
    justify-content center

    input
      flex 1
      width calc(100% - 60px)
      padding-left 20px
      color var(--black) !important
      background var(--bgcolor) !important
      border 2px solid var(--accent-color)
      border-radius 22px 0 0 22px
      font-size 20px
      letter-spacing 0.5em
      line-height 2
      outline none

    button
      width 70px
      padding-right 10px
      background var(--accent-color)
      color var(--bgcolor)
      border-width 0
      border-radius 0 22px 22px 0
      font-size 20px
      line-height 2
      outline none

      &:hover
        background lighten($accentColor, 15%)

@keyframes shake
  0%, 100%
    transform translateX(0)

  10%
    transform translateX(-9px)

  20%
    transform translateX(8px)

  30%
    transform translateX(-7px)

  40%
    transform translateX(6px)

  50%
    transform translateX(-5px)

  60%
    transform translateX(4px)

  70%
    transform translateX(-3px)

  80%
    transform translateX(2px)

  90%
    transform translateX(-1px)
</style>
