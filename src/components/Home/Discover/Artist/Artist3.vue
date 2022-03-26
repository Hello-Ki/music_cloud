<template>
  <div class="artist3_container">
    <ul>
        <li class="list_li" v-for="list in mvData" :key="list.index">
          <div class="li_cover">
            <img class="cover_img" :src="list.imgurl" alt="" :title="list.name" />
          </div>
          <p class="li_dec">
            <a class="dec_a" @click="$router.push({ name: 'mvDetail', params: { id: list.id } })">{{ list.name }}</a>
          </p>
        </li>
      </ul>
      <!-- 页码 -->
      <el-pagination background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'MV',
  props: ['artist'],
  data() {
    return {
      id: '',
      limit: 12,
      offset: 0,
      total: 0,
      pageInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 12,
      },
      mvData: []
    }
  },
  watch: {
    artist(val) {
      console.log(val)
    }
  },
  created() {
    this.id = this.$route.query.id
    this.total = this.artist.mvSize
    // console.log(this.artist)
    this.getMvData()
  },
  methods: {
    async getMvData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const { data: { code, mvs } } = await this.$http.get(`/artist/mv?id=${this.id}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取MV数据失败!')
      this.mvData = mvs
      // console.log(this.mvData)
      setTimeout(() => {
        loading.close()
      }, 1000)
      // const res = await this.$http.get(`/artist/mv?id=${this.id}`)
      // console.log(res)
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      this.getMvData()
    }
  },
}
</script>
<style scoped lang="less">
.artist3_container {
  ul {
    margin-left: -28px;
    .list_li {
      display: inline-block;
      width: 166px;
      height: 170px;
      line-height: 1.4;
      padding: 0 0 30px 29px;
      list-style: none;
      font-size: 12px;
      vertical-align: middle;
      box-sizing: border-box;
      .li_cover {
        width: 137px;
        height: 103px;
        cursor: pointer;
        .cover_img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .li_dec {
        width: 130px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 8px 0 3px;
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
