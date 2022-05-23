<template>
  <div class="ad-info">
    <div class="title">赏善罚恶令</div>
    <div style="position:relative;margin-bottom: 8px">
      <a :href="ad.link" v-for="ad in adList">
        <img :src="ad.img" style="width: 100%">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Advertising",
  computed: {
    adList() {
      return this.$themeConfig.adList || [];
    },
  }
}
</script>

<style scoped lang="stylus">
.ad-info
  background: var(--bgcolor);
  margin-bottom 8px
  padding 8px
  border-radius 8px
  box-shadow 0 1px 3px 0 var(--card-shadow-color)
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
