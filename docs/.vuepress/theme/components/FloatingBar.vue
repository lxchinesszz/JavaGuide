<template>
  <div id="floatBar">
    <ul>
      <li>
        <span class="iconfont user"></span>
        <p>公众号</p>
      </li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
// 浮动栏
export default {
  name: "FloatingBar"
}
</script>

<style scoped>
#floatBar {
  width: 85px;
  background-color: #d93a3a;
  position: fixed;
  right: 20px;
  border-bottom: 20px;
}

#floatBar ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

#floatBar ul li {
  border: 1px solid blue;
  width: 85px;
  height: 85px;
  background-color: #fff;
}

#floatBar ul li:last-child {
  margin-top: 20px;
}
</style>
