<template>
  <div>
    <p><strong>作者: 西魏陶渊明</strong></p>
    <p><em>博客: https://springlearn.cn</em></p>
    <Djt/>
  </div>
</template>

<script>
import axios from 'axios'
import Djt from './Djt.vue'

export default {
  name: "PageBanner",
  components: {Djt},
  created: function () {
    axios.get('https://service-etyft6el-1257000250.sh.apigw.tencentcs.com/release/dujitang')
        .then(({data}) => {
          const hitokoto = document.getElementById('yiyan')
          hitokoto.href = 'https://java.springlearn.cn'
          hitokoto.innerText = data
        }).catch(console.error);
  }
}
</script>

<style scoped>

</style>
