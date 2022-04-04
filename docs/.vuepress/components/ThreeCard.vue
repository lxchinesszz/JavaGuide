<template>
  <div class="card-container">
    <div class="card">
      <h3>{{ title }}</h3><br>
      <p>{{ content }}</p>
      <div class="layers">
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
        <div class="layer"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 3D卡片
 */
export default {
  name: "ThreeCard",
  props: {
    title: {
      type: String,
      default: "一日一句毒鸡汤"
    },
    content: {
      type: String,
      default: "我尝试着做一个有趣的人，后来却跑偏了，成了一个逗逼。"
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

* {
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Raleway, sans-serif;
  display: flex;
  align-items: center;
  min-height: 100vh;
  background-color: #ddd;
}

.card-container {
  perspective: 50em;
}

.card-container:nth-child(2) {
  --bi: repeating-linear-gradient(30deg, #111 0 0.25em, #333 0 1em);
}

.card-container:nth-child(1) {
  --bi: linear-gradient(#555 5em, #0000 3em), linear-gradient(60deg, #880E4F, #1A237E);
}

.card {
  position: relative;
  width: 320px;
  padding: 3em;
  color: #fff;
  transform: rotateY(30deg) rotateX(15deg);
  transform-style: preserve-3d;
  transition: transform 1s;
}

.card:hover {
  transform: rotateY(-30deg) rotateX(-15deg);
}

.layers {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  z-index: -1;
}

.layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 1em;
  background-image: var(--bi);
  transform: translateZ(var(--tz));
  box-shadow: 0 0 0.5em #000d inset;
}

.layer:nth-child(1) {
  --tz: 0px;
}

.layer:nth-child(2) {
  --tz: -4px;
}

.layer:nth-child(3) {
  --tz: -8px;
}

.layer:nth-child(4) {
  --tz: -12px;
}

.layer:nth-child(5) {
  --tz: -16px;
}

.layer:nth-child(6) {
  --tz: -20px;
}

.layer:nth-child(7) {
  --tz: -24px;
}

.layer:nth-child(8) {
  --tz: -28px;
}

.layer:nth-child(9) {
  --tz: -32px;
}

.layer:nth-child(10) {
  --tz: -36px;
}

.layer:last-child {
  box-shadow: 0 0 0.5em #000d inset, 0 0 5px #000;
}
</style>
