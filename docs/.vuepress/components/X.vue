<template>
  <div class="RedText">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "Text",
  props: {
    text: {
      type: String,
      default: '程序猿',
    }
  },
}
</script>

<style scoped>
.RedText {
  display: inline;
  border: 0;
  padding: 2px 4px;
  color: #D83B64;
  background-color: #f9f2f4;
  border-radius: 3px;
  position: relative;
  bottom: 1px;
}
</style>
