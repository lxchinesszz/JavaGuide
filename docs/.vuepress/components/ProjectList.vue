<template>
  <div class="root">
    <div class="card" v-for="(item,index) in projectList" :key="index">
        <div class="card-img" :style="'background-image: url('+ item.img +')'">
        </div>

      <div class="card-desc">
        <div class="card-desc-title">
          <a :href="item.link">
            {{ item.title }}
          </a>
        </div>
        <div class="card-desc-desc">
          {{ item.desc }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectList",
  data: function () {
    return {
      projectList: [{
        img: 'https://img.springlearn.cn/blog/8d93a4aaf770ccc367e4bcc40513ff1b.png',
        link: '/learn/project/mojito',
        title: '手撸Java RPC框架系列 ',
        desc: '跟着小编从通信层开始, 从0到1的实现一个Java RPC框架, 并发布到Maven全球仓库上。顺便再申请个Idea免费的证书。'
      },
        {
          img: 'https://img.springlearn.cn/blog/100752e5c6b141909d729e1bc6beda6c.png',
          link: '/learn/project/jmvn/',
          title: 'SpringBoot脚手架【命令行版本】',
          desc: '一款使用 node js 来实现的，纯命令行风格的 SpringBoot 脚手架工具,简直是碉堡了💥,极客必用系列。'
        },
        {
          img: 'https://img.springlearn.cn/blog/3b384399150b25b8f71c4b7b75a1ca3e.png',
          link: '',
          title: 'SpringBoot脚手架【web版本】 ',
          desc: 'SpringBoot 国产脚手架,支持企业级定制,同时支持 intellij idea 的 spring 扩展。'
        },
        {
          img: 'https://img.springlearn.cn/blog/c54c185f6ffb2237d16ea3803102225c.png',
          link: '/learn/electron/',
          title: '我开源了我的图床客户端 ',
          desc: '写了五六年博客,我最终还是把我的图床客户端给开源了,分享给更多热爱技术方向的👬🏻兄弟们。'
        }]
    }
  }
}
</script>

<style scoped>

.root {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1px;
}

/* 大于900显示*/
@media screen and (min-width: 900px) {
  .card {
    display: flex;
    width: 32%;
    height: 250px;
    flex-direction: column;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 var(--card-shadow-color);
    margin-bottom: 10px;
  }

}

/*小于900*/
@media screen and (max-width: 900px) {
  .card {
    display: flex;
    width: 100%;
    height: 250px;
    flex-direction: column;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 var(--card-shadow-color);
    margin-bottom: 10px;
  }

}

.card-img {
  flex: 2;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("https://img.springlearn.cn/blog/8d93a4aaf770ccc367e4bcc40513ff1b.png");
}

.card-desc {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.card-desc-title {
  font-size: 15px;
  letter-spacing: -0.2px;
  margin-bottom: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  line-height: 18px;
  color: #34495e;
}

.card-desc-desc {
  font-size: 85%;
  margin-top: 5px;
  letter-spacing: -0.2px;
  margin-bottom: 0;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  color: #888;
  height: 36px;
  line-height: 18px;
}

.card:hover {
  box-shadow: 1px 10px 10px 0px var(--card-shadow-color);
  transform: scale(1);
}
</style>
