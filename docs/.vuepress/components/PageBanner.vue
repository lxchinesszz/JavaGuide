<template>
  <div>
    <p><strong>作者: 西魏陶渊明</strong></p>
    <p><em>博客: https://springlearn.cn</em></p>
    <Djt/>
  </div>
</template>

<script>
import Djt from './Djt.vue'
import {say} from "../public/js/yiyan";

export default {
  name: "PageBanner",
  components: {Djt},
  created: function () {
    this.$nextTick(() => {
      const hitokoto = document.getElementById('yiyan')
      hitokoto.href = 'https://java.springlearn.cn'
      hitokoto.innerText = say()
    })
  }
}
</script>

<style scoped>

</style>
