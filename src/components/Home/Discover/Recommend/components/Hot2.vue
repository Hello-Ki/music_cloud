<template>
  <div class="main_hot2">
    <div class="hot2_header">
      <a class="hot2_left" href="#/discover/playlist">新碟上架</a>
      <a class="hot2_r" href="#/discover/playlist">更多</a>
    </div>
    <div class="hot2_body">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="album in newAlbumData" :key="album.index">
          <!-- <img class="hot2_img" :src="album.blurPicUrl" alt="" /> -->
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="hot2_footer"></div>
  </div>
</template>

<script>
export default {
  name: 'Hot2',
  created() {
    this.getNewAlbum()
  },
  data() {
    return {
      newAlbumData: []
    }
  },
  methods: {
    // 获取新碟上架列表
    async getNewAlbum() {
      const {
        data: { code, albums },
      } = await this.$http.get('/album/newest')
      if (code !== 200) {
        return this.$message.info('获取新碟上架列表数据失败!')
      }
      this.newAlbumData = albums
      // console.log(this.newAlbumData)
    }
  }
}
</script>

<style lang="less" scoped>
.main_hot2 {
  .hot2_header {
    position: relative;
    float: left;
    width: 689px;
    height: 35px;
    border-bottom: 2px solid #c10d0c;
    margin-bottom: 20px;
    &::before {
      position: absolute;
      top: 20%;
      left: 10px;
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      background: url('../../imgs/index.png') no-repeat -235px -164px;
    }
    .hot2_left {
      float: left;
      display: block;
      height: 28px;
      color: #333;
      font-size: 20px;
      padding: 0 10px 0 34px;
      box-sizing: border-box;
    }
    .hot2_r {
      float: right;
      color: #666;
      line-height: 30px;
      font-size: 12px;
      &::after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 4px;
        background: url('../../imgs/index.png') no-repeat -0px -240px;
      }
    }
  }
  .hot2_body {
    .el-carousel {
      display: block;
      width: 600px;
      padding: 5px;
      border: 1px solid #ccc;
    }
    .el-carousel__item {
      .hot2_img {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 180px;
      }
    }
  }
  .hot2_footer {
    height: 30px;
  }
}
</style>
