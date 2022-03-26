<template>
  <div class="recommend_container">
    <div class="header_slider">
      <swiper :options="swiperOption">
        <swiper-slide v-for="imgUrl in bannerImageList" :key="imgUrl.index">
          <div class="swiper-zoom-container">
            <img class="slide_img" :src="imgUrl" alt="" />
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <div class="main">
      <div class="main_banner">
        <hot-1></hot-1>
        <hot-2></hot-2>
        <hot-3></hot-3>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'
import 'vue-awesome-swiper/node_modules/swiper/dist/js/swiper'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Hot1 from './components/Hot1.vue'
import Hot2 from './components/Hot2.vue'
import Hot3 from './components/Hot3.vue'

export default {
  name: 'Recommend',
  components: {
    swiper,
    swiperSlide,
    Hot1,
    Hot2,
    Hot3,
  },
  created() {
    document.title = '网易云音乐'
    const loading = this.$loading.service({
      lock: true,
      text: '拼命加载中...',
      spinner: 'el-icon-loading',
      fullscreen: true,
      background: 'rgba(255, 255, 255, 0.3)',
    })
    this.getBannerList()
    // this.getSongData(1904192389)
    setTimeout(() => {
      loading.close()
    }, 1000)
  },
  data() {
    return {
      bannerImageList: [],
      swiperOption: {
        spaceBetween: 50,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }
    }
  },
  methods: {
    // 获取轮播图数据
    async getBannerList() {
      const {
        data: { code, banners },
      } = await this.$http.get('/banner')
      if (code !== 200) {
        return this.$message.info('获取轮播图数据失败!')
      }
      this.bannerImageList = banners.reduce((pre, cur) => {
        pre.push(cur.imageUrl)
        return pre
      }, [])
    }
  }
}
</script>

<style lang="less" scoped>
.recommend_container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.header_slider {
  margin: 0 auto;
  width: 100%;
  background-color: #f5f5f5;
  .swiper-container {
    width: 730px;
    .swiper-button-prev,
    .swiper-button-next {
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
.main {
  .main_banner {
    width: 729px;
    margin: 0 auto;
    padding: 20px 20px 40px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>
