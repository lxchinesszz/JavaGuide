<template>
  <div class="notice-widget">
    <div class="title">网站公告</div>
    <div style="position:relative;margin-bottom: 8px">
      <div style="margin-top: 2px">
        <a href="https://www.toutiao.com/c/user/token/MS4wLjABAAAAUpgfl4Z-CCzEU1PqmX4f2a7OZ3RxnTpYZ5euMr_6ZE4/?#mid=1563737358895105">
          <img src="https://img.springlearn.cn/0bf973bcedfd48855738cdf426e0b088.png" alt="" style="width: 40%;margin-top: 1px">
        </a>
        <p>
          每周不定时更新,总有一个适合你,做最纯粹的技术分享！！！</p>
      </div>
      <hr/>
      <div>
        <p>技术探讨QQ群:902793156(已满),本群是Java框架源码学习圈子,源码学习的问题,一起讨论一起学习,禁止广告,闲者莫入。</p>
      </div>
      <div>
        <img src="https://img.springlearn.cn/learn_9ea02e620c7d483bfa2d310c1440d3e9.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoticeWidget"
}
</script>


<style scoped lang="stylus">
.notice-widget
  background: var(--bgcolor);
  margin-bottom 8px
  padding 8px
  border-radius 8px
  box-shadow 0 1px 3px 0 var(--card-shadow-color)

  p
    font-size 0.8rem
    color var(--dark-grey);

  &:hover
    box-shadow 0 2px 6px 0 var(--card-shadow-color)

  .title
    padding 8px 0
    font-weight 400
    position relative
    border-bottom 1px solid #ebebeb;

    &::after
      position absolute
      content ""
      width 90px
      height 1px
      background var(--accent-color-l10)
      left 0
      bottom -1px
</style>

