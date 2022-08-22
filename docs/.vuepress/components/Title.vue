<template>
  <div class="root">
    <div class="title">
      {{ title }}
    </div>
    <div class="subTitle">
      {{ subTitle }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Title",
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    subTitle: {
      type: String,
      default: '天下代码一大抄,抄来抄去有提高。'
    }
  }
}
</script>

<style scoped>

.root {
  display: flex;
  flex-direction: row;
  align-items: end;
  margin: 20px 0;
}

.title {
  font-weight: 500;
  line-height: 1.25;
  font-size: 1.35rem;
  letter-spacing: .5px;
  text-transform: uppercase;
  padding-bottom: 0;
}


/*大于900*/
@media screen and (min-width: 900px) {
  .subTitle {
    height: 100%;
    font-size: 15px;
    font-weight: normal;
    margin-left: 10px;
    opacity: 0.85;
    padding-bottom: 3px;
    color: #34495e;
  }
}

/*小于900*/
@media screen and (max-width: 900px) {
  .subTitle {
    display: none;
  }
}
</style>
