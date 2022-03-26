<template>
  <div class="artist_container">
    <div class="container_main">
      <!-- 歌手相关信息列表 -->
      <div class="header">
        <span class="header_title">{{ artist.name }}</span>
        <div class="header_cover">
          <img :src="artist.cover" alt="" />
        </div>
        <el-menu class="el-menu-demo" :default-active="activePath" mode="horizontal" background-color="#fff" text-color="#000" @select="handleSelect">
          <el-menu-item :index="item.path" v-for="item in artistInfo" :key="item.index">
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="body">
        <router-view :artist="artist"></router-view>
      </div>
    </div>
    <el-aside width="270">aside</el-aside>
  </div>
</template>

<script>
export default {
  name: 'Artist',
  created() {
    this.id = this.$route.query.id
    this.$router.push({ name: 'artist1', query: { id: this.id } })
    this.getArtistData()
  },
  data() {
    return {
      id: '',
      activePath: '',
      artistData: [],
      artist: {},
      artistInfo: [
        { id: 1, name: '热门作品', path: '' },
        { id: 2, name: '所有专辑', path: 'album' },
        { id: 3, name: '相关MV', path: 'mv' },
        { id: 4, name: '艺人介绍', path: 'desc' },
      ]
    }
  },
  methods: {
    async getArtistData() {
      const {
        data: { code, data },
      } = await this.$http.get(`/artist/detail?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌手详情信息失败!')
      this.artistData = data
      this.artist = this.artistData.artist
      console.log(this.artistData)
    },
    handleSelect(key, keyPath) {
      const params = '/discover/artist/' + key
      this.$router.push({
        path: params,
        query: { id: this.id }
      })
    }
  },
}
</script>

<style lang="less" scoped>
.artist_container {
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  box-sizing: border-box;
  .container_main {
    display: inline-block;
    vertical-align: middle;
    width: 709px;
    padding: 47px 30px 40px 39px;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    .header {
      .header_title {
        height: 34px;
        line-height: 34px;
        font-size: 24px;
      }
      .header_cover {
        position: relative;
        width: 100%;
        height: 300px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          transform: scaleY(2);
        }
      }
      .el-menu.el-menu--horizontal {
        border: none;
      }
    }
    .body {
      margin-top: 20px;
    }
  }
  .el-aside {
    display: inline-block;
    vertical-align: middle;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
  }
}
</style>
