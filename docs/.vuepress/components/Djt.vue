<template>
  <div class="custom-block tip"><p class="custom-block-title">真正的猛士,每天干一碗毒鸡汤!</p>
    <p id="yiyan123">问世间钱为何物，只叫人生死相许。！😄</p></div>
</template>

<script>
import {say} from "../public/js/yiyan";

export default {
  name: "Djt",
  props: {
    text: {
      type: String,
      default: '程序猿',
    }
  },
  created: function () {
    this.$nextTick(() => {
      let hitokoto = document.getElementById('yiyan123')
      hitokoto.href = 'https://java.springlearn.cn'
      hitokoto.innerText = say();
    })
  }
}
</script>

<style scoped>

</style>
