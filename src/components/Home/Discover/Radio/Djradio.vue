<template>
  <div class="djradio_container">
    <div class="radio_top">
      <span class="turn_left" @click="left"></span>
      <ul class="banner">
        <li v-for="cate in radioCateData.slice((index-1)*18, 18)" :key="cate.id" @click="activeRouter(cate.id)">
          <a class="a_box" :class="{'a_box1': id===cate.id}">
            <i class="i1" :class="{'i2': id===cate.id}" :style="{background:'url('+cate.picWebUrl+')'}"></i>
            <a class="a_title">{{cate.name}}</a>
          </a>
        </li>
      </ul>
      <span class="turn_right" @click="right"></span>
      <ul class="point">
        <li v-for="(item, id) in num" :key="item.index" @click="changeIndex(id)">
          <span :class="{'p1': id === index-1}"></span>
        </li>
      </ul>
    </div>
    <div class="radio_main">
      <router-view :routerId="id" @routerChange="changeActiveId"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Djradio',
  data() {
    return {
      num: 0,
      index: 1,
      id: '',
      radioCateData: [],
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getRadioBanner()
    if (!this.id) {
      this.$router.push({ name: 'radio' })
    } else {
      this.$router.push({ name: 'category', params: { id: this.id } })
    }
    // this.getRecommendRadio()
  },
  watch: {
    $route(to, from) {
      this.id = to.params.id || ''
    }
  },
  methods: {
    async getRadioBanner() {
      const { data: { code, categories } } = await this.$http.get('/dj/catelist')
      if (code !== 200) return this.$message.info('获取电台分类数据失败!')
      this.radioCateData = categories
      this.num = Math.ceil(this.radioCateData.length / 18)
      // console.log(this.radioCateData)
    },
    async getRecommendRadio() {
      const { data: { code, djRadios } } = await this.$http.get('/dj/recommend')
      if (code !== 200) return this.$message.info('获取推荐电台数据失败!')
      console.log(djRadios)
    },
    left() {
      if (this.index > 1) {
        this.index -= 1
      }
    },
    right() {
      if (this.index < this.num) {
        this.index += 1
      }
    },
    activeRouter(id) {
      this.$router.push({ name: 'category', params: { id: id } })
      // window.location.reload()
      this.id = id
    },
    changeIndex(id) {
      this.index = id + 1
    },
    changeActiveId(event) {
      this.id = parseInt(event)
    }
  }
}
</script>

<style lang="less" scoped>
.djradio_container {
  width: 100%;
  height: 100%;
  padding: 40px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-sizing: border-box;
  .radio_top {
    position: relative;
    width: 100%;
    height: 194px;
    margin-bottom: 20px;
    box-sizing: border-box;
    .banner {
      height: 100%;
      overflow: hidden;
      li {
        float: left;
        width: 70px;
        height: 70px;
        margin: 0 0 25px 32px;
        list-style: none;
        cursor: pointer;
        &:nth-child(1), &:nth-child(10n) {
          margin-left: 0;
        }
        .a_box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .i1 {
            display: block;
            width: 48px;
            height: 48px;
          }
          a {
            display: block;
            color: #888;
            font-size: 12px;
          }
          &:hover {
            border-radius: 5px;
            background-color: rgba(240, 240, 240, .6);
          }
        }
        .a_box1 {
          border: 2px solid rgb(230, 0 , 0);
          border-radius: 5px;
          .i2 {
            background-position-x: -48px !important;
          }
          .a_title {
            color: rgb(230, 0 , 0);
          }
          &:hover {
            background-color: #fff;
          }
        }
      }
    }
    .turn_left, .turn_right {
      position: absolute;
      top: 50%;
      display: block;
      width: 10px;
      height: 20px;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .turn_left {
      left: -15px;
      background: url('../imgs/radio_slide.png') -4px -35px;
    }
    .turn_right {
      right: -15px;
      background: url('../imgs/radio_slide.png') -35px -35px;
    }
    .point {
      position: absolute;
      left: 50%;
      height: 10px;
      transform: translateX(-50%);
      li {
        float: left;
        width: 20px;
        height: 20px;
        list-style: none;
        cursor: pointer;
        span {
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 7px;
          background-color: rgba(100, 100, 100, .4);
        }
        .p1 {
          background-color: rgba(180, 0, 0, .8);
        }
      }
    }
  }
  .radio_main {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
