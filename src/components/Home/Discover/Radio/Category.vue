<template>
  <div class="category_container">
    <div class="box">
      <div class="header">
        <span class="title">优秀新电台</span>
      </div>
      <div class="body1">
        <ul>
          <li v-for="item in newRadioData" :key="item.index">
            <img class="cover" :src="item.picUrl" @click="$router.push({ name: 'djdetail', params: { id: item.id } })" />
            <a class="name" @click="$router.push({ name: 'djdetail', params: { id: item.id } })">{{ item.name }}</a>
            <span class="des">{{ item.rcmdtext }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="box">
      <div class="header">
        <span class="title">电台排行榜</span>
        <div class="tab">
          <a class="up" :class="{ up1: isUp }" @click="upRadio">上升最快</a>
          <span class="line"></span>
          <a class="hot" :class="{ hot1: !isUp }" @click="hotRadio">最热电台</a>
        </div>
      </div>
      <div class="body2">
        <ul :class="{ lists1: isUp }">
          <li v-for="item in topList" :key="item.index">
            <img class="cover" :src="item.picUrl" @click="$router.push({ name: 'djdetail', params: { id: item.id } })" />
            <div class="right">
              <div class="name">
                <a @click="$router.push({ name: 'djdetail', params: { id: item.id } })">{{ item.name }}</a>
              </div>
              <div class="user">
                <i></i>
                <a @click="$router.push({ name: 'userHome', params: { id: item.dj.userId } })">{{ item.dj.nickname }}</a>
              </div>
              <div class="num">
                <span class="s1">共{{ item.programCount }}期</span>
                <span class="s2">订阅{{ item.subCount }}次</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <el-pagination :class="{ p1: total === 0 }" background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: ['routerId'],
  data() {
    return {
      // id: this.routerId,
      isUp: true,
      topList: [],
      total: 0,
      limit: 32,
      offset: 0,
      pageInfo: {
        pagenum: 1,
        pagesize: 32,
      },
      newRadioData: [],
      hotRadioData: [],
    }
  },
  created() {
    // this.id = this.$route.params.id
    // 创建组件时向父组件发送id值
    this.$emit('routerChange', this.$route.params.id)
    this.getNewRadioData()
    // this.getUpRadioData()
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      // 路由变化时, 向父组件发送id值
      this.$emit('routerChange', to.params.id)
      this.getNewRadioData()
    },
  },
  methods: {
    // 获取优秀新电台数据
    async getNewRadioData() {
      // 获取子组件的数据
      const {
        data: { code, djRadios },
      } = await this.$http.get(`/dj/recommend/type?type=${this.routerId}`)
      if (code !== 200) return this.$message.info('获取电台详情数据失败!')
      this.newRadioData = djRadios
      console.log(this.newRadioData)
    },
    // 获取上升最快电台数据
    async getUpRadioData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      console.log(this.routerId, 'up')
      this.topList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      setTimeout(() => {
        loading.close()
      })
    },
    // 获取最热电台数据
    async getHotRadioData() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const {
        data: { code, count: total, djRadios: hotRadioData },
      } = await this.$http.get(`/dj/radio/hot?cateId=${this.routerId}`)
      // const { data: { code, count: total, djRadios: hotRadioData } } = await this.$http.get(`/dj/radio/hot?cateId=${this.routerId}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取最热电台数据失败!')
      this.total = total
      this.topList = hotRadioData
      setTimeout(() => {
        loading.close()
      })
      console.log(this.topList)
    },
    upRadio() {
      this.isUp = true
      this.getUpRadioData()
    },
    hotRadio() {
      this.isUp = false
      this.getHotRadioData()
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pagesize
      this.getHotRadioData()
    },
  },
}
</script>

<style lang="less" scoped>
.category_container {
  background-color: #fff;
  .box {
    width: 100%;
    a {
      font-size: 12px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    img {
      cursor: pointer;
    }
    .header {
      height: 42px;
      line-height: 42px;
      margin-top: 10px;
      border-bottom: 2px solid #c20c0c;
      box-sizing: border-box;
      .title {
        height: 42px;
        color: #333;
        font-size: 24px;
      }
      .tab {
        float: right;
        .line {
          display: inline-block;
          vertical-align: middle;
          margin: 0 10px;
          width: 1px;
          height: 15px;
          background-color: #c7c7c7;
        }
        .up1,
        .hot1 {
          color: #c20c0c;
        }
      }
    }
    .body1 {
      ul {
        li {
          display: inline-block;
          vertical-align: middle;
          list-style: none;
          width: 150px;
          height: 203px;
          margin: 20px 0 0 37px;
          color: #666;
          font-size: 12px;
          &:nth-child(1),
          &:nth-child(6n) {
            margin-left: 0;
          }
          .cover {
            width: 150px;
            height: 150px;
          }
          .name {
            color: #333;
            font-size: 14px;
            margin: 5px 0;
          }
          .name,
          .des {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .body2 {
      ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 435px;
          height: 161px;
          padding: 20px 0;
          border-bottom: 1px solid #ddd;
          box-sizing: border-box;
          list-style: none;
          .cover {
            width: 120px;
            height: 120px;
          }
          .right {
            display: inline-block;
            vertical-align: top;
            width: 295px;
            margin-left: 20px;
            .name {
              height: 64px;
              line-height: 64px;
              a {
                display: block;
                font-size: 18px;
                font-weight: bolder;
              }
            }
            .user {
              i {
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                width: 14px;
                height: 14px;
                background: url('../imgs/icon.png') -50px -300px;
              }
            }
            .num {
              margin: 10px 0;
              color: #999;
              font-size: 12px;
              .s1 {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .lists1 {
        display: none;
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
    .p1 {
      display: none;
    }
  }
}
</style>
