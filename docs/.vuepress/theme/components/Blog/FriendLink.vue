<template>
  <div class="ad-info">
    <div class="title">江湖豪杰</div>
    <div
        style="position:relative;margin-bottom: 8px;
        padding: 8px; display: flex;flex-direction: row;justify-content: flex-start">
      <div v-for="ad in adList" style="margin: 2px 2px">
        <a :href="ad.link" class="friendLinkWrapper" style="text-decoration: none">
          <span>{{ ad.desc }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FriendLink",
  computed: {
    adList() {
      return this.$themeConfig.friendLink || [];
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

  .friendLinkWrapper
    text-decoration: none;
    color: var(--dark-grey);
    font: normal normal 400 14px / 1 FontAwesome;
</style>
