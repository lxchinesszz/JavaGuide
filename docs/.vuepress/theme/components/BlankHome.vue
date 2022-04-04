<template>
  <main class="home">
    <div>
      <MyTransition :delay="0.24">
        <Content class="theme-default-content custom"/>
      </MyTransition>
    </div>
  </main>
</template>

<script>
// 空白的标签页
export default {
  name: "BlankHome"
}
</script>

<style scoped>

</style>
