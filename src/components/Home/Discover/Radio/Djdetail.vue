<template>
  <div class="program_container">
    <div class="container_main">
      <!-- 歌曲相关信息 -->
      <div class="header">
        <div class="h_left">
          <img class="l_cover" :src="programDetail.picUrl" alt="" />
        </div>
        <div class="h_right">
          <div class="r1">
            <i></i>
            <span>{{ programDetail.name }}</span>
          </div>
          <div class="r2">
            <img class="i1" :src="djDetail.avatarUrl" alt="" @click="$router.push({ name: 'userHome', params: { id: djDetail.userId } })" />
            <a class="user" @click="$router.push({ name: 'userHome', params: { id: djDetail.userId } })">{{ djDetail.nickname }}</a>
            <img class="i2" :class="{ i2_1: avatarDetail }" :src="avatarDetail && avatarDetail.identityIconUrl" alt="" />
          </div>
          <div class="r3">
            <a class="star" href="javascript:void(0);">
              <span>订阅({{ programDetail.subCount | numFormat }})</span>
            </a>
            <a class="play" href="javascript:void(0);">
              <span>播放全部</span>
            </a>
            <a class="share" href="javascript:void(0);">
              <span>分享({{ programDetail.shareCount }})</span>
            </a>
          </div>
          <div class="r4">
            <a class="cate" @click="$router.push({ name: 'djradio', params: { id: programDetail.categoryId } })">{{ programDetail.category }}</a>
            <span ref="describe" class="des" :class="{ 'des-show': isExpend }">{{ programDetail.desc }}</span>
          </div>
          <div v-if="isFlow" class="expend" @click="isExpend = !isExpend">
            <a href="javascript:;">{{ isExpend ? '收起' : '展开' }}</a>
            <i class="icon" :class="{ icon1: isExpend }"></i>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="header">
          <span class="h1">节目列表</span>
          <span class="h2">共{{ programDetail.programCount }}期</span>
          <div class="h3">
            <a class="outlink" @click="$router.push({ name: 'outchain', params: { type: type, id: id } })">生成外链播放器</a>
            <a class="down" :class="{ down1: sort === 'down' }" href="javascript:;" title="降序" @click="changeSort('down')"></a>
            <a class="up" :class="{ up1: sort === 'up' }" href="javascript:;" title="升序" @click="changeSort('up')"></a>
          </div>
        </div>
        <div class="main">
          <div class="before" :class="{ b1: isShow }">
            <span>上次听到:&nbsp;</span>
            <a class="text" @click="$router.push({ name: 'program', params: { id: programDetail.lastProgramId } })">{{ programDetail.lastProgramId }}</a>
            <a class="con">继续播放</a>
            <span class="close" @click="close"></span>
          </div>
          <el-table :data="programs" style="width: 100%" header-align="center" :show-header="false" stripe>
            <el-table-column type="index" :index="indexMethod" width="50"> </el-table-column>
            <el-table-column prop="name" label="内容" width="270">
              <template v-slot:="{ row }">
                <div class="cell_box" @mouseenter="enter(row.id)" @mouseleave="leave">
                  <i class="play" :class="{ play1: row.isPlay }" @click="checkPlay(row.id)"></i>
                  <a class="name" :class="{ name1: row.isIconShow }" @click="$router.push({ name: 'program', params: { id: row.id } })">{{ row.name }}</a>
                  <span class="icon" :class="{ icon1: row.isIconShow }">
                    <i class="i1"></i>
                    <i class="i2"></i>
                    <i class="i3"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="listenerCount" label="播放量" width="80"> </el-table-column>
            <el-table-column prop="likedCount" label="点赞数" width="90"> </el-table-column>
            <el-table-column prop="createTime" label="日期" width="86"> </el-table-column>
            <el-table-column prop="duration" label="时长" width="60"> </el-table-column>
          </el-table>
          <el-pagination hide-on-single-page background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Program',
  data() {
    return {
      id: '',
      type: 4,
      isExpend: false,
      sort: 'down',
      isShow: false,
      programDetail: {},
      isFlow: false,
      djDetail: {},
      avatarDetail: {},
      total: 0,
      limit: 100,
      offset: 0,
      pageInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 100,
      },
      programs: [],
      hoverId: null,
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getProgramDetail()
    this.getPrograms()
  },
  methods: {
    async getProgramDetail() {
      const {
        data: {
          code,
          data: {
            dj: { avatarDetail, ...djDetail },
            ...programDetail
          },
        },
      } = await this.$http.get(`/dj/detail?rid=${this.id}`)
      if (code !== 200) return this.$message.info('获取节目详情失败!')
      this.programDetail = programDetail
      this.djDetail = djDetail
      this.avatarDetail = avatarDetail
      // console.log(this.programDetail)
      console.log(this.programDetail)
      await this.$nextTick()
      if (this.$refs.describe.offsetHeight > 88) {
        this.isFlow = true
      }
      // const res = await this.$http.get(`/dj/detail?rid=${this.id}`)
      // console.log(res)
    },
    async getPrograms() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      if (this.sort === 'down') {
        this.offset = 0
      } else {
        this.offset = this.total - this.pageInfo.pagenum * this.pageInfo.pagesize
      }
      const {
        data: { code, count, programs },
      } = await this.$http.get(`/dj/program?rid=${this.id}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取节目列表失败!')
      this.total = count
      const list = [...programs]
      if (this.sort === 'up') {
        this.programs.reverse()
      }
      this.programs = list.reduce((pre, cur) => {
        cur.listenerCount = '播放' + cur.listenerCount
        cur.likedCount = '赞' + cur.likedCount
        cur.createTime = this.publishTime(cur.createTime)
        cur.duration = this.durationTime(cur.duration)
        cur.isPlay = false
        cur.isIconShow = false
        pre.push(cur)
        return pre
      }, [])
      setTimeout(() => {
        loading.close()
      }, 1000)
      // console.log(this.programs)
    },
    changeSort(value) {
      this.sort = value
      this.pageInfo = {
        pagenum: 1,
        pagesize: 100,
      }
      this.offset = this.sort === 'down' ? 0 : this.total - this.pageInfo.pagenum * this.pageInfo.pagesize
      this.getPrograms()
    },
    close() {
      this.isShow = true
    },
    indexMethod(index) {
      if (this.sort === 'down') {
        return this.total - this.offset - index
      } else {
        return (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize + index + 1
      }
    },
    checkPlay(id) {
      this.programs.map((item) => {
        item.isPlay = false
        if (item.id === id) {
          item.isPlay = true
        }
      })
    },
    // 鼠标进入,宽度变小
    enter(id) {
      this.programs.map((item) => {
        item.isIconShow = false
        if (item.id === id) {
          item.isIconShow = true
        }
      })
    },
    // 鼠标移出,宽度恢复
    leave() {
      this.programs.map((item) => {
        item.isIconShow = false
      })
    },
    publishTime(time) {
      const dt = new Date(time)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    durationTime(time) {
      const dt = new Date(time)
      // 规范格式，若月份不足两位数，则用0从前面开始填充
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${mm}:${ss}`
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      if (this.sort === 'down') {
        this.limit = 100
        this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      } else {
        const offset = this.total - this.pageInfo.pagenum * this.pageInfo.pagesize
        if (offset > 0) {
          this.offset = offset
        } else {
          this.offset = 0
          this.limit = 100 + offset
        }
      }
      this.getPrograms()
    },
  },
}
</script>

<style lang="less" scoped>
.program_container {
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
      .h_left,
      .h_right {
        display: inline-block;
        vertical-align: top;
      }
      .h_left {
        .l_cover {
          width: 208px;
          height: 208px;
          padding: 2px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
      }
      .h_right {
        width: 410px;
        margin-left: 20px;
        .r1 {
          height: 32px;
          line-height: 32px;
          i,
          span {
            display: inline-block;
            vertical-align: middle;
          }
          i {
            width: 55px;
            height: 24px;
            background: url('../imgs/icon.png') 0 -1014px;
          }
          span {
            margin-left: 10px;
            font-size: 20px;
          }
        }
        .r2 {
          margin: 20px 0;
          img,
          a {
            display: inline-block;
            vertical-align: middle;
            color: #0c73c2;
            font-size: 12px;
          }
          .i1,
          .user {
            cursor: pointer;
          }
          .i1 {
            width: 35px;
            height: 35px;
            margin-right: 10px;
          }
          .user {
            &:hover {
              text-decoration: underline;
            }
          }
          .i2 {
            display: none;
            width: 13px;
            height: 13px;
          }
          .i2_1 {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .r3 {
          margin-bottom: 20px;
          .star,
          .play,
          .share {
            display: inline-block;
            vertical-align: middle;
            height: 30px;
            line-height: 30px;
            color: #333;
            font-size: 12px;
            text-align: right;
            background-image: url('../imgs/button2.png');
          }
          .play,
          .share {
            position: relative;
            width: 73px;
            margin-left: 20px;
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              right: -10px;
              width: 10px;
              height: 30px;
              background: url('../imgs/button2.png') -240px -2247px;
            }
            &:hover {
              &::after {
                content: '';
                background-position: -240px -2640px;
              }
            }
          }
          .star {
            position: relative;
            width: 95px;
            color: #fff;
            background-position: 0 -2125px;
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              right: -10px;
              width: 10px;
              height: 30px;
              background: url('../imgs/button2.png') -240px -2163px;
            }
            &:hover {
              background-position: 0 -2516px;
              &::after {
                content: '';
                background-position: -240px -2558px;
              }
            }
          }
          .play {
            width: 80px;
            background-position: 0 -2285px;
            &:hover {
              background-position: 0 -2680px;
            }
          }
          .share {
            background-position: 0 -1225px;
            &:hover {
              background-position: 0 -1268px;
            }
          }
        }
        .r4 {
          font-size: 12px;
          line-height: 20px;
          // .cate, .des {
          //   display: inline-block;
          //   vertical-align: middle;
          // }
          .cate {
            padding: 2px 5px;
            margin-right: 10px;
            color: #cc0000;
            border: 1px solid #cc0000;
            cursor: pointer;
          }
          .des {
            line-height: 22px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            // word-break: break-all;
            // word-wrap: break-word;
            // white-space: pre-wrap;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
          .des1 {
            height: 100%;
          }
          .des-show {
            display: block;
          }
        }
        .expend {
          font-size: 12px;
          text-align: right;
          cursor: pointer;
          a {
            color: #0c73c2;
            &:hover {
              text-decoration: underline;
            }
          }
          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 12px;
            height: 8px;
            background: url('../imgs/icon.png') -65px -520px;
          }
          .icon1 {
            background-position: -44px -520px;
          }
        }
      }
    }
  }
  .body {
    margin-top: 40px;
    .header {
      position: relative;
      color: #666;
      line-height: 35px;
      font-size: 12px;
      border-bottom: 2px solid #c20c02;
      .h1 {
        color: #333;
        font-size: 20px;
      }
      .h2 {
        margin-left: 20px;
      }
      .h3 {
        position: absolute;
        right: 0;
        display: inline-block;
        vertical-align: middle;
        text-align: right;
        .outlink {
          margin-right: 20px;
          color: #0c73c2;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
          &::before {
            content: '';
            display: inline-block;
            padding-right: 5px;
            width: 12px;
            height: 12px;
            background: url('../imgs/icon.png') -35px -865px;
          }
        }
        .down,
        .up {
          display: inline-block;
          vertical-align: middle;
          width: 29px;
          height: 29px;
          background: url('../imgs/cnt_radio.png') 0 0;
          &:hover {
            background-position-y: -30px;
          }
        }
        .up {
          width: 26px;
          background-position: -41px 0;
        }
        .down1,
        .up1 {
          background-position-y: -30px;
        }
      }
    }
    .main {
      .before {
        display: block;
        position: relative;
        width: 100%;
        height: 43px;
        line-height: 43px;
        color: #333;
        font-size: 12px;
        background-color: #feffdb;
        text-align: center;
        .text,
        .con,
        .close {
          cursor: pointer;
        }
        .text {
          margin: 0 10px;
          &:hover {
            text-decoration: underline;
          }
        }
        .con {
          font-size: 14px;
          color: #0c73c2;
          text-decoration: underline;
        }
        .close {
          display: inline-block;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          background: url('../imgs/cnt_radio.png') -30px -100px;
        }
      }
      .b1 {
        display: none;
      }
      /deep/.el-table {
        font-size: 12px;
        .el-table__cell {
          height: 55px;
        }
        .cell {
          position: relative;
          white-space: nowrap;
          text-overflow: ellipsis;
          .cell_box {
            position: relative;
            width: 100%;
            .play,
            .name,
            .icon {
              cursor: pointer;
            }
            .play {
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              width: 17px;
              height: 17px;
              background: url('../imgs/table.png') 0 -103px;
              &:hover {
                background-position-y: -128px;
              }
            }
            .play1 {
              background-position: -20px -128px;
            }
            .name {
              display: inline-block;
              vertical-align: middle;
              width: 190px;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              &:hover {
                text-decoration: underline;
              }
            }
            .name1 {
              width: 160px;
            }
            .icon {
              display: none;
              position: absolute;
              top: 0;
              right: 0;
              .i1,
              .i2,
              .i3 {
                display: inline-block;
                vertical-align: middle;
                padding: 0 2px;
                width: 16px;
                height: 15px;
                background-image: url('../imgs/table.png');
              }
              .i1 {
                background-position: -1px -173px;
              }
              .i2 {
                background-position: -1px -194px;
              }
              .i3 {
                background-position: -82px -173px;
              }
            }
            .icon1 {
              display: block;
            }
          }
        }
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
