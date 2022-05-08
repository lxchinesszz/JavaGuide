<template>
  <div>
    <div>
      <img  id="yiyan"
          src="http://s.cn.bing.net/th?id=OHR.SvalbardSun_ZH-CN6108396467_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"/>
    </div>
    <p><em>每日一图</em></p>
  </div>
</template>

<script>
import axios from 'axios'
import Djt from './Djt.vue'

export default {
  name: "PageImageBanner",
  components: {Djt},
  created: function () {
    axios.get('https://api.no0a.cn/api/bing/0')
        .then(({data}) => {
          console.log("每日一图:", data.bing.url)
          const hitokoto = document.getElementById('yiyan')
          hitokoto.src = data.bing.url
        }).catch(console.error);
  }
}
</script>

<style scoped>

</style>
