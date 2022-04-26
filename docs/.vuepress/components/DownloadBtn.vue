<template>
  <div>
    <a :href="url" style="text-decoration: none">
      <button class="button">
        <div class="icon">
          <svg viewBox="0 0 14 15">
            <line x1="5" y1="13" x2="5" y2="1"></line>
            <polyline id="tick" points="1 9.5 5 13.5 13 5.5"></polyline>
            <polyline id="normal" points="1 9.5 5 13.5 9 9.5"></polyline>
          </svg>
          <div>
            <svg viewBox="0 0 24 24"></svg>
          </div>
        </div>
        <ul>
          <!--          <li>Node</li>-->
          <li>{{ text }}</li>
        </ul>
      </button>
    </a>
  </div>
</template>

<script>
export default {
  name: "DownloadBtn",
  props: {
    url: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: 'Download',
    }
  },
}
</script>

<style scoped>
a:visited {
  text-decoration: none;
}

.button {
  --background: #31448e;
  --text: #fff;
  --icon: #fff;
  --icon-success: #16BF78;
  display: flex;
  outline: none;
  border: 0;
  padding: 0 22px 0 16px;
  min-width: 147px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 9px;
  background: var(--background);
  transition: transform 0.2s;
}

.button:active {
  transform: scale(0.95);
}

.button ul {
  margin: 0;
  padding: 13px 0;
  list-style: none;
  text-align: center;
  position: relative;
  backface-visibility: hidden;
  font-size: 16px;
  font-weight: 500;
  line-height: 25px;
  color: var(--text);
}

.button ul li:not(:first-child) {
  top: var(--t, 13px);
  left: 0;
  position: absolute;
}

.button ul li:nth-child(2) {
  --t: 64px;
}

.button ul li:nth-child(3) {
  --t: 115px;
}

.button .icon {
  width: 24px;
  height: 24px;
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin: 14px 10px 0 0;
  transform: translateY(calc(var(--y, 0) * 1px));
}

.button .icon svg {
  width: var(--w, 14px);
  height: var(--h, 15px);
  display: block;
  fill: none;
  stroke: var(--s, var(--icon));
  stroke-width: var(--sw, 2);
  stroke-linejoin: round;
  stroke-linecap: round;
}

.button .icon > svg,
.button .icon div {
  left: var(--l, 7px);
  top: var(--t, 2px);
  position: absolute;
}

.button .icon > svg {
  transform: translateY(calc(var(--y, 0) * 1px));
}

.button .icon > svg polyline,
.button .icon > svg line {
  stroke-dasharray: var(--a, 12px);
  stroke-dashoffset: var(--o, 0);
  stroke: var(--s, var(--icon));
  transition: stroke-dashoffset var(--d, 0.15s), stroke 0.4s;
}

.button .icon > svg polyline {
  --d: .25s;
  --a: 17px;
  --o: 5.5px;
}

.button .icon div {
  --w: 24px;
  --h: 24px;
  --l: 0;
  --t: 8px;
  --sw: 1.5;
}

.button.loading ul {
  animation: text 1750ms linear forwards 100ms;
}

.button.loading.complete .icon svg line {
  --o: 12px;
}

.button.loading.complete .icon svg polyline {
  --o: 0;
  --s: var(--icon-success);
}

@keyframes text {
  18%, 82% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(-200%);
  }
}

html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: inherit;
}

*:before, *:after {
  box-sizing: inherit;
}

body {
  min-height: 100vh;
  display: flex;
  font-family: "Roboto", Arial;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #F6F8FF;
}

body .dribbble {
  position: fixed;
  display: block;
  right: 20px;
  bottom: 20px;
}

body .dribbble img {
  display: block;
  height: 28px;
}

body .twitter {
  position: fixed;
  display: block;
  right: 64px;
  bottom: 14px;
}

body .twitter svg {
  width: 32px;
  height: 32px;
  fill: #1da1f2;
}
</style>
