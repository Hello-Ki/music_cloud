<template>
  <div class="album_container">
    <!-- 热门新碟标题 -->
    <div class="header">
      <span class="header_l">热门新碟</span>
    </div>
    <!-- 热门新碟列表 -->
    <div class="body">
      <ul>
        <li class="list_li" v-for="list in newAlbumData" :key="list.index">
          <div class="li_cover" @click="$router.push({ name: 'albumDetail', query: { id: list.id } })">
            <img class="cover_img" :src="list.picUrl" alt="" :title="list.name" />
          </div>
          <p class="li_dec">
            <a class="dec_a" @click="$router.push({ name: 'albumDetail', params: { id: list.id } })">{{ list.name }}</a>
          </p>
          <p class="li_cre">
            <a class="cre_a" :href="'#/discover/artist?id=' + list.artists[0].id">{{ list.artists[0].name }}</a>
          </p>
        </li>
      </ul>
    </div>
    <!-- 全部新碟标题 -->
    <div class="header">
      <span class="header_l">全部新碟</span>
      <ul class="l_ul">
        <!-- 点击标签,重新获取数据 -->
        <li class="l_li" v-for="(value, key) in areaList" :key="key" @click="changeArea(key)">
          <a :href="'#/discover/album/?area=' + key">{{ value }}</a>
        </li>
      </ul>
    </div>
    <!-- 全部新碟列表 -->
    <div class="body">
      <ul>
        <li class="list_li" v-for="list in albumsList" :key="list.index">
          <div class="li_cover">
            <img class="cover_img" src="http://p5.itc.cn/images01/20200922/327590168a5d4390ac1603b9f69790e7.png" alt="" :title="list.name" />
          </div>
          <p class="li_dec">
            <a class="dec_a" @click="$router.push({ name: 'albumDetail', params: { id: list.id } })">{{ list.name }}</a>
          </p>
          <p class="li_cre">
            <a class="cre_a" :href="'#/discover/artist/' + list.artists[0].id">{{ list.artists[0].name }}</a>
          </p>
        </li>
      </ul>
      <!-- 页码 -->
      <el-pagination background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  name: 'Album',
  created() {
    this.getNewAlbumData()
    this.getAlbumsList()
  },
  data() {
    return {
      area: 'ALL',
      total: 0,
      limit: 35,
      offset: 0,
      // 分页信息
      pageInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 35,
      },
      // 热门新碟
      newAlbumData: [],
      // 全部新碟
      albumsList: [],
      // 新碟类型
      areaList: { ALL: '全部', ZH: '华语', EA: '欧美', KR: '韩国', JP: '日本' },
    }
  },
  methods: {
    // 获取热门新碟数据
    async getNewAlbumData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const {
        data: { code, albums },
      } = await this.$http.get('/album/newest')
      if (code !== 200) {
        return this.$message.info('获取热门新碟数据失败!')
      }
      this.newAlbumData = albums.slice(0, 10)
      setTimeout(() => {
        loading.close()
      }, 1000)
      // console.log(this.newAlbumData)
    },
    // 获取全部新碟数据
    async getAlbumsList() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const {
        data: { code, albums, total },
      } = await this.$http.get(`/album/new?area=${this.area}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取全部新碟列表失败!')
      this.albumsList = albums
      this.total = total
      setTimeout(() => {
        loading.close()
        // console.log(this.albumsList)
      }, 1000)
    },
    // 切换新碟类型,并重置页码信息
    changeArea(key) {
      this.area = key
      this.pageInfo = {
        pagenum: 1,
        pagesize: 35,
      }
      this.offset = 0
      this.getAlbumsList()
    },
    // 切换页码,重新计算offset,并更新路由
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      this.getAlbumsList()
      this.$router.push({ name: 'album', query: { area: this.area, index: newPage } })
    },
  },
}
</script>

<style lang="less" scoped>
.album_container {
  width: 100%;
  padding: 40px;
  background-color: #fff;
  .header {
    position: relative;
    width: 900px;
    height: 35px;
    border-bottom: 2px solid #c10d0c;
    margin-bottom: 20px;
    .header_l {
      float: left;
      display: block;
      height: 28px;
      color: #333;
      font-size: 20px;
      box-sizing: border-box;
    }
    .l_ul {
      float: left;
      margin: 7px 0 0 20px;
      display: flex;
      .l_li {
        list-style: none;
        font-size: 12px;
        padding: 0 10px;
        position: relative;
        text-align: center;
        cursor: pointer;
        a {
          color: #666;
        }
        &:nth-child(n + 2)::before {
          content: ' ';
          position: absolute;
          width: 1px;
          height: 13.5px;
          background-color: #ccc;
          top: 50%;
          left: -1px;
          transform: translateY(-50%);
        }
      }
    }
  }
  .body {
    // padding-top: 30px;
    ul {
      margin-left: -42px;
      .list_li {
        display: inline-block;
        width: 186px;
        height: 208px;
        line-height: 1.4;
        padding: 0 0 30px 42px;
        list-style: none;
        font-size: 12px;
        vertical-align: middle;
        box-sizing: border-box;
        .li_cover {
          width: 140px;
          height: 140px;
          cursor: pointer;
          .cover_img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .li_dec {
          .dec_a {
            width: 100%;
            margin-top: 5px;
            color: #000;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .li_cre {
          .cre_a {
            color: #666;
          }
        }
        .li_dec,
        .li_cre {
          width: 130px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .dec_a,
        .cre_a {
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    /deep/.is-background {
      width: 900px;
      height: 26px;
      margin: 20px 0;
      box-sizing: border-box;
      .el-pager li,
      .btn-prev,
      .btn-next {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
      }
      .el-pager {
        li {
          background-color: #fff;
          border: 1px solid #eee;
          box-sizing: border-box;
        }
        li:not(.disabled).active {
          background-color: rgb(162, 22, 27);
          color: #fff;
        }
      }
    }
  }
}
</style>
