<template>
  <div class="artist2_container">
    <ul>
        <li class="list_li" v-for="list in albumsList" :key="list.index">
          <div class="li_cover">
            <img class="cover_img" :src="list.picUrl" alt="" :title="list.name" />
          </div>
          <p class="li_dec">
            <a class="dec_a" @click="$router.push({ name: 'albumDetail', params: { id: list.id } })">{{ list.name }}</a>
          </p>
          <p class="li_cre">{{list.publishTime | albumTime}}</p>
        </li>
      </ul>
      <!-- 页码 -->
      <el-pagination background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Artist2',
  props: ['artist'],
  created() {
    this.id = this.$route.query.id
    this.total = this.artist.albumSize
    this.getAlbumData()
  },
  watch: {
    artist(val) {
      console.log(this.artist)
    }
  },
  data() {
    return {
      id: '',
      total: 0,
      limit: 12,
      offset: 0,
      // 分页信息
      pageInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 12,
      },
      albumsList: []
    }
  },
  methods: {
    async getAlbumData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const { data: { code, hotAlbums } } = await this.$http.get(`/artist/album?id=${this.id}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取唱片数据失败!')
      this.albumsList = hotAlbums
      // console.log(this.albumsList)
      setTimeout(() => {
        loading.close()
      }, 1000)
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      this.getMvData()
    }
  }
}
</script>

<style lang="less" scoped>
.artist2_container {
  ul {
    margin-left: -18px;
    .list_li {
      display: inline-block;
      width: 163px;
      height: 205px;
      line-height: 1.4;
      padding: 0 0 30px 18px;
      list-style: none;
      font-size: 12px;
      vertical-align: middle;
      box-sizing: border-box;
      .li_cover {
        width: 145px;
        height: 120px;
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
          color: #000;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .li_cre {
        color: #666;
      }
      .li_dec,
      .li_cre {
        width: 70px;
        margin-top: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
</style>
