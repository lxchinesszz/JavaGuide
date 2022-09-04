<template>
  <div class="root">
    <div class="info" v-for="(item,index) in infoList" :key="index">
      <div class="info-img">
        <img :src="item.img" alt="">
      </div>
      <div class="info-desc">
        <span style="color: #34495e;font-weight: bold;height: 36px;">
                  <a :href="item.link">
                            《{{ item.title }}》
                  </a>
        </span>
        <span style="color: #5d5c5c;font-size: 90%">
    {{ item.desc }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeriesList",
  data: function () {
    return {
      infoList: [
        {
          link: '/learn/spring',
          img: 'https://img.springlearn.cn/blog/1c861b137fedd470229042b05bc85d97.png',
          title: 'Spring专题系列',
          desc: 'spring 是 java 开发者,永远绕不开的结。是非常值得开发者来学习的,面对如此庞大的框架, 我们的学习一定要找到一个切入点, 这样学习效率才会更高。'
        },
        {
          link: '/learn/mybatis',
          img: 'https://img.springlearn.cn/blog/learn_1649514858000.png',
          title: 'Mybatis专题系列',
          desc: 'ORM映射框架,我们学习mybatis这一个就够了,万变不离其宗,主要是思想。当学习完这个系列, 你将不仅仅会用他来写业务代码, 更可以进行二次开发和扩展。'
        },
        {
          link: '/learn/tools',
          img: 'https://img.springlearn.cn/blog/e010189ef21411b8ce92f06342f65dd3.png',
          title: 'Java必会工具系列',
          desc: '工欲善其事必先利其器,本系列中所列举的工具框架,在你日后的业务开发中,或是在框架轮子的开发中,都一定会发挥作用。'
        },
        {
          link: '/learn/dubbo',
          img: 'https://img.springlearn.cn/blog/learn_1597068628000.png',
          title: 'Dubbo源码学习系列',
          desc: 'dubbo 是一款Java RPC框架, 我们可以从中窥视到网络通信的魅力。当复杂的dubbo 都学会了，还会害怕，SpringCloud生态吗? 轻松拿捏他。'
        },
        {
          link: '/learn/project/jvm/',
          img: 'https://img.springlearn.cn/blog/learn_1654183539000.png',
          title: 'Jvm调优系列',
          desc: '大促调优,大促压测,jvm调优如果还不会,怎么敢称为Java高级工程师呢? 你距离高级工程师可能只差这篇文章和大促的实战的经验。'
        },
        {
          link: '/learn/jobs/',
          img: 'https://img.springlearn.cn/blog/bc0392fd430c6ed9465a5b2400ef5288.png',
          title: 'Elastic-job源码系列',
          desc: ' 分布式定时任务,我们学着一个就够用了,还是那句话思路决定出路。elastic都会了,xxljob你还会害怕吗?'
        }
      ]
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

/*小于900*/
@media screen and (max-width: 900px) {
  .info {
    width: 98%;
    height: 150px;
    padding: 10px;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 var(--card-shadow-color);
    transition: all 0.3s;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    margin-bottom: 10px;
  }
}

/* 大于900显示*/
@media screen and (min-width: 900px) {
  .info {
    width: 47%;
    height: 150px;
    padding: 10px;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 var(--card-shadow-color);
    transition: all 0.3s;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    margin-bottom: 10px;
  }
}


.info-img {
  display: flex;
  flex: 1;
}

.info-desc {
  display: flex;
  flex-direction: column;
  letter-spacing: -0.2px;
  line-height: 23px;
  flex: 2;
  padding-left: 1rem;
}

.info:hover {
  box-shadow: 1px 10px 10px 0px var(--card-shadow-color);
  transform: scale(1);
}
</style>
