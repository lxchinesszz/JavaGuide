<template>
  <div>
    <p id="hitokoto"><a href="#" id="hitokoto_text">:D 获取中...</a></p>
  </div>
</template>

<script>
import {say} from "../../../public/js/yiyan";

// 首页鸡汤
export default {
  name: "HomeJitang",
  created: function () {
    // 使用一言: https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
    // axios.get('https://v1.hitokoto.cn?type=i')
    //     .then(({ data }) => {
    //       const hitokoto = document.getElementById('hitokoto_text')
    //       hitokoto.href = 'https://hitokoto.cn/?uuid=' + data.uuid
    //       hitokoto.innerText = data.hitokoto
    //     })
    //     .catch(console.error);
    // 使用毒鸡汤
    this.$nextTick(() => {
      const hitokoto = document.getElementById('hitokoto_text')
      hitokoto.href = 'https://java.springlearn.cn'
      hitokoto.innerText = say()
    })
  }
}
</script>

<style scoped>

</style>
