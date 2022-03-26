<template>
  <div class="playlist_container">
    <div class="playlist_main">
      <div class="main_header">
        <span :title="tags" class="header_title">{{ tags }}</span>
        <el-button class="header_select" @click="changeShow">选择分类<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      </div>
      <div class="category_box1" :class="{ category_box: isShow }">
        <div class="box_i"></div>
        <div class="box_header">
          <el-button @click="handleTagChange" class="body_btn">全部风格</el-button>
        </div>
        <div class="box_body">
          <dl :class="`body_dl${id}`" v-for="(option, id) in options" :key="id">
            <dt class="body_dt">
              <i :class="`icon${id}`">{{ option }}</i>
            </dt>
            <dd class="body_dd">
              <span v-for="(cate, index) in categoryData[id]" :key="index">
                <a class="dd_cate" :style="{ 'background-color': tags === cate ? '#A7A7A7' : '#fff' }" @click="$router.push({ name: 'playlist', query: { cat: cate } })">{{ cate }}</a>
                <span v-if="index !== categoryData[id].length - 1" class="line">|</span>
              </span>
            </dd>
          </dl>
        </div>
      </div>
      <ul class="main_body">
        <li class="list_li" v-for="list in playlistData" :key="list.index">
          <div class="li_cover">
            <img class="cover_img" :src="list.coverImgUrl" alt="" :title="list.name" />
          </div>
          <p class="li_dec">
            <a class="dec_a" @click="$router.push({name: 'playlistDetail', params: {id: list.id}})">{{ list.name }}</a>
          </p>
          <p class="li_cre">
            <span class="cre_span">by </span>
            <a class="cre_a" @click="$router.push({name: 'userHome', params: {id: list.userId}})">{{ list.creator.nickname }}</a>
            <i></i>
          </p>
        </li>
      </ul>
      <el-pagination background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <div class="playlist_footer"></div>
  </div>
</template>
<script>
export default {
  name: 'Playlist',
  data() {
    return {
      tags: '',
      limit: 35,
      offset: 0,
      isShow: false,
      total: 0,
      // 分页信息
      pageInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 35,
      },
      playlistData: [],
      options: [],
      categoryData: {},
    }
  },
  computed: {},
  watch: {
    // 监听路由变化
    $route: {
      handler: function (val, oldVal) {
        this.playlistData = []
        // 判断cat是否改变
        if (this.tags !== val.query.cat) {
          this.isShow = false
          this.pageInfo = {
            pagenum: 1,
            pagesize: 35,
          }
          this.tags = val.query.cat
          this.getPlaylistData()
          this.$router.push({ name: val.name, query: { cat: val.query.cat } })
        }
        // 判断limit是否改变
        if (val.query.limit && this.limit !== val.query.limit) {
          this.limit = val.query.limit
          // 根据limit修改分页信息
          this.pageInfo = {
            pagenum: Math.ceil(this.offset / this.limit),
            pagesize: this.limit - 0
          }
          this.$router.push({ name: val.name, query: { order: 'hot', cat: val.query.cat, limit: this.limit, offset: this.offset } })
        }
        // 判断offset是否改变
        if (val.query.offset && this.offset !== val.query.offset) {
          this.offset = val.query.offset
          // 根据offset修改分页信息
          this.pageInfo = {
            pagenum: Math.ceil(this.offset / this.limit),
            pagesize: this.limit - 0
          }
          this.getPlaylistData()
          this.$router.push({ name: val.name, query: { order: 'hot', cat: val.query.cat, limit: this.limit, offset: this.offset } })
        }
      },
    },
    offset: {
      handler: function(val, oldVal) {
        this.$router.push({ name: 'playlist', query: { order: 'hot', cat: this.tags, limit: this.limit, offset: val } })
      },
      deep: true
    }
  },
  created() {
    this.tags = this.$route.query.cat || '全部'
    this.offset = this.$route.query.offset || (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
    this.limit = this.$route.query.limit || this.pageInfo.pagesize
    this.getPlaylistData()
    this.getCategoryData()
    // this.getHotList()
  },
  methods: {
    // 获取分类数据
    async getCategoryData() {
      const {
        data: { categories, sub, code },
      } = await this.$http.get('/playlist/catlist')
      if (code !== 200) return this.$message.info('获取歌单分类数据失败!')
      this.options = JSON.parse(JSON.stringify(categories))
      this.categoryData = sub.reduce((pre, cur) => {
        if (!pre[cur.category]) {
          pre[cur.category] = []
        }
        pre[cur.category].push(cur.name)
        return pre
      }, {})
    },
    // 判断分类tags,获取指定歌单
    async getPlaylistData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const {
        data: { code, playlists, total },
      } = await this.$http.get(`/top/playlist?order=hot&cat=${this.tags}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取列表数据失败!')
      this.playlistData = playlists
      console.log(this.playlistData)
      this.total = total
      setTimeout(() => {
        loading.close()
      })
      // const params = this.tags === '全部' ? '' : this.tags
      // this.$router.push({name: 'playlist', query: { cat: this.tags}})
    },
    changeShow() {
      this.isShow = !this.isShow
    },
    // 切换标签,重新请求数据
    handleTagChange() {
      this.playlistData = []
      this.getPlaylistData()
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      this.getPlaylistData()
    },
    async getRelatedList() {
      const res = await this.$http.get('/playlist/detail/?id=5001')
      console.log(res)
    },
    async getHotList() {
      const res = await this.$http.get('/top/playlist')
      console.log(res)
    },
  },
}
</script>
<style scoped lang="less">
.playlist_container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.playlist_main {
  padding: 40px;
  background-color: #fff;
  box-sizing: border-box;
  .main_header {
    width: 900px;
    height: 42px;
    background-color: #fff;
    border-bottom: 2px solid #c20c0c;
    box-sizing: border-box;
    .header_title {
      line-height: 32px;
      font-size: 24px;
      color: #333;
    }
    .header_select {
      width: 91px;
      height: 31px;
      padding: 0px;
      margin: 2px 0 0 12px;
      color: #52a0f3;
      font-size: 12px;
      border: 1px solid #eee;
    }
    .header_select:hover {
      color: rgb(51, 51, 51);
      background-color: #fff;
      border: 1px solid #ccc;
    }
  }
  .category_box1 {
    display: none;
  }
  .category_box {
    display: block;
    position: absolute;
    left: 150px;
    width: 720px;
    margin-top: 5px;
    background-color: #fff;
    box-shadow: 0 4px 8px 2px rgba(100, 100, 100, 0.4);
    .box_i {
      position: absolute;
      top: -8px;
      left: 122px;
      width: 24px;
      height: 12px;
      background: url('../imgs/iconall.png') no-repeat -48px -3px;
    }
    .box_header {
      width: 700px;
      height: 38px;
      padding: 20px 0 0 10px;
      .body_btn {
        width: 75px;
        height: 26px;
        line-height: 26px;
        padding: 0px;
        margin: 2px 0 10px 12px;
        color: #52a0f3;
        font-size: 12px;
        border: 1px solid #eee;
        &:hover {
          color: rgb(51, 51, 51);
          background-color: #fff;
          border: 1px solid #ccc;
        }
      }
    }
    .box_body {
      width: 700px;
      .body_dl0 {
        border-top: 1px solid #ccc;
      }
      dl {
        margin: 0;
        .body_dt {
          float: left;
          display: inline;
          margin: 0 -100px 0 26px;
          padding-top: 15px;
          width: 71px;
          font-size: 12px;
          i {
            display: inline-block;
            width: 100%;
            height: 24px;
            line-height: 24px;
            text-align: center;
            font-style: normal;
            font-weight: bold;
            vertical-align: middle;
          }
          .icon0::before {
            display: inline-block;
            content: '';
            width: 24px;
            height: 24px;
            padding-right: 10px;
            background: url('../imgs/icon.png') no-repeat -20px -734px;
            vertical-align: middle;
          }
          .icon1::before {
            display: inline-block;
            content: '';
            width: 20px;
            height: 20px;
            padding-right: 10px;
            background: url('../imgs/icon.png') no-repeat -1px -63px;
            vertical-align: middle;
          }
          .icon2::before {
            display: inline-block;
            content: '';
            width: 24px;
            height: 24px;
            padding-right: 10px;
            background: url('../imgs/icon.png') no-repeat 0px -88px;
            vertical-align: middle;
          }
          .icon3::before {
            display: inline-block;
            content: '';
            width: 22px;
            height: 22px;
            padding-right: 10px;
            background: url('../imgs/icon.png') no-repeat 0px -118px;
            vertical-align: middle;
          }
          .icon4::before {
            display: inline-block;
            content: '';
            width: 20px;
            height: 20px;
            padding-right: 10px;
            background: url('../imgs/icon.png') no-repeat 0px -142px;
            vertical-align: middle;
          }
        }
        .body_dd {
          display: block;
          margin-left: 96px;
          padding: 16px 15px 0 15px;
          line-height: 24px;
          font-size: 12px;
          border-left: 1px solid #ccc;
          .dd_cate {
            color: #333;
            cursor: pointer;
          }
          .dd_cate:hover {
            text-decoration: underline;
          }
          .line {
            margin: 0 8px 0 10px;
            color: #d8d8d8;
          }
        }
        &:nth-child(5) {
          dd {
            padding: 16px 15px 25px;
          }
        }
      }
    }
  }
  .main_body {
    margin-top: 30px;
    .list_li {
      display: inline-block;
      width: 140px;
      height: 188px;
      line-height: 1.4;
      padding: 0 0 30px 50px;
      list-style: none;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .li_cover {
        width: 140px;
        height: 140px;
        .cover_img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &:nth-child(1),
      &:nth-child(5n + 1) {
        padding-left: 0;
      }
      .li_dec {
        margin-top: 10px;
        .dec_a {
          display: inline-block;
          width: 100%;
          color: #000;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow-wrap: normal;
        }
      }
      .li_cre {
        color: #aaa;
        .cre_a {
          color: #666;
        }
      }
      .dec_a,
      .cre_a {
        cursor: pointer;
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
</style>
