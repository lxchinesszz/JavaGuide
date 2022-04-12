<template>
  <div class="custom-block tip"><p class="custom-block-title">真正的猛士,每天干一碗毒鸡汤!</p>
    <p id="yiyan">问世间钱为何物，只叫人生死相许。！😄</p></div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Djt",
  props: {
    text: {
      type: String,
      default: '程序猿',
    }
  },
  created: function (){
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
