<template>
  <div class="main_hot3">
    <div class="hot3_header">
      <a class="hot3_left" href="#/discover/playlist">榜单</a>
      <a class="hot3_r" href="#/discover/playlist">更多</a>
    </div>
    <div class="hot3_body">
      <dl class="hot3_dl" :class="{ hot3_dl1: index === 2 }" v-for="(list, index) in topListData" :key="index">
        <dt class="hot3_dt">
          <div class="dt_top">
            <div class="top_l">
              <img class="top_cover" :src="list.coverImgUrl" alt="" />
            </div>
            <div class="top_r">
              <a class="r_a" :href="'#/discover/toplist?id=' + list.id">
                <h3 class="a_title">{{ list.name }}</h3>
              </a>
              <div class="r_btn">
                <a class="btn_play" href="javascript:;"></a>
                <a class="btn_add" href="javascript:;"></a>
              </div>
            </div>
          </div>
        </dt>
        <dd class="hot3_dd">
          <ol>
            <li v-for="(item, index) in list.songs" :key="index">
              <span class="li_span">{{ index + 1 }}</span>
              <a class="li_n" :href="'#/discover/song?id=' + item.id" :title="item.name">{{ item.name }}</a>
              <div class="li_r">
                <a class="r_p" href="" title="播放"></a>
                <a class="r_a" href="" title="添加到播放列表"></a>
                <a class="r_c" href="" title="收藏"></a>
              </div>
            </li>
          </ol>
          <div class="dd_bot">
            <a :href="'#/discover/toplist?id=' + list.id">查看全部></a>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hot3',
  created() {
    this.getTopList()
  },
  data() {
    return {
      topListData: [],
      // topListTable: {},
    }
  },
  methods: {
    // 获取推荐页的榜单数据
    async getTopList() {
      const {
        data: { code, list },
      } = await this.$http.get('/toplist')
      if (code !== 200) return this.$message.info('获取榜单数据失败!')
      // 获取榜单的列表信息
      // list.slice(0, 3).map(async (item, index) => {
      //   //   获取榜单列表中所有歌曲的id
      //   const songs = await this.getTopListTable(item.id)
      //   // this.topListData.push({ ...cur1, songs })
      //   this.$set(this.topListData, index, { ...item, songs })
      // })
      const lists = list.slice(0, 3)
      const promises = lists.map((i) => this.getTopListTable(i.id))
      const res = await Promise.all(promises)
      this.topListData = lists.map((item, index) => ({ ...item, songs: res[index] }))
    },
    // 根据获取到的推荐页榜单数据 找到榜单所对应的id 从而获取相应榜单的列表信息
    async getTopListTable(value) {
      const {
        data: { code, songs },
      } = await this.$http.get(`/playlist/track/all?id=${value}&limit=10`)
      if (code !== 200) return this.$message.info('获取榜单列表歌曲id失败!')
      return songs
    },
    // 根据榜单列表中歌曲的id 获取歌曲的详情信息
    async getSongData(value) {
      const {
        data: { code, songs },
      } = await this.$http.get(`/song/detail?ids=${value}`)
      if (code !== 200) return this.$message.info('获取榜单列表的歌曲详情信息失败!')
      return songs[0].al
    },
  },
}
</script>

<style lang="less" scoped>
.main_hot3 {
  height: 527px;
  .hot3_header {
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
    .hot3_left {
      float: left;
      display: block;
      height: 28px;
      color: #333;
      font-size: 20px;
      padding: 0 10px 0 34px;
      box-sizing: border-box;
    }
    .hot3_r {
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
  .hot3_body {
    .hot3_dl {
      float: left;
      width: 228px;
      border: 1px solid #ccc;
      border-right: 0;
      box-sizing: border-box;
      .hot3_dt {
        list-style: none;
        .dt_top {
          width: 100%;
          height: 120px;
          padding: 20px 0 0 19px;
          background-color: #f4f4f4;
          box-sizing: border-box;
          .top_l {
            float: left;
            width: 80px;
            height: 80px;
            .top_cover {
              width: 100%;
              height: 100%;
            }
          }
          .top_r {
            float: left;
            margin: 6px 0 0 10px;
            .r_a {
              display: block;
              color: #333;
              .a_title {
                font-size: 14px;
              }
              &:hover {
                content: '';
                text-decoration: underline;
              }
            }
            .r_btn {
              margin-top: 10px;
              .btn_play,
              .btn_add {
                float: left;
                display: block;
                width: 22px;
                height: 22px;
                margin-right: 10px;
              }
              .btn_play {
                background: url('../../imgs/index.png') no-repeat -267px -205px;
              }
              .btn_add {
                background: url('../../imgs/index.png') no-repeat -299px -205px;
              }
            }
          }
        }
      }
      .hot3_dd {
        font-size: 12px;
        ol {
          li {
            height: 32px;
            width: 100%;
            line-height: 32px;
            background-color: #f4f4f4;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            list-style: none;
            .li_span {
              display: inline-block;
              width: 35px;
              height: 100%;
              margin-left: 10px;
              color: #666;
              font-size: 16px;
              text-align: center;
              vertical-align: middle;
            }
            .li_n {
              display: inline-block;
              vertical-align: middle;
              width: 170px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #000;
              &:hover {
                text-decoration: underline;
              }
            }
            .li_r {
              float: right;
              display: none;
              width: 80px;
              height: 32px;
              margin-right: 5px;
              a {
                display: inline-block;
                width: 17px;
                height: 17px;
                vertical-align: middle;
                margin: 5px;
                z-index: 9999px;
              }
              .r_p {
                background: url('../../imgs/index.png') no-repeat -267px -268px;
              }
              .r_a {
                background: url('../../imgs/icon.png') no-repeat 0 -699px;
              }
              .r_c {
                background: url('../../imgs/index.png') no-repeat -296px -269px;
              }
            }
            &:nth-child(2n) {
              background-color: #e8e8e8;
            }
            &:nth-child(-n + 3) {
              span {
                color: #c10d0c;
              }
            }
            &:hover {
              content: '';
              .li_n {
                width: 100px;
              }
              .li_r {
                display: block;
              }
            }
          }
        }
        .dd_bot {
          height: 32px;
          line-height: 32px;
          text-align: right;
          margin-right: 10px;
          a {
            color: #000;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    .hot3_dl1 {
      width: 228px;
      border-right: 1px solid #ccc;
    }
  }
}
</style>
