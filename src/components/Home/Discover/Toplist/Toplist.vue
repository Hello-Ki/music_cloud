<template>
  <div class="top_list_container">
    <el-container class="banner">
      <el-aside width="240px">
        <el-menu class="list_menu" :default-active="activePath" background-color="#f9f9f9" text-color="#000" router>
          <span class="m_span">云音乐特色榜</span>
          <el-menu-item :style="{ 'background-color': getPath(list.id) === activePath ? '#e6e6e6' : '#f9f9f9' }" :index="getPath(list.id)" v-for="list in cloudListsData" :key="list.index" @click="changePath(list.id)">
            <img class="item_img" :src="list && list.coverImgUrl" alt="" />
            <div class="item_des">
              <p class="item_title">{{ list.name }}</p>
              <p class="item_state">{{ list.updateFrequency }}</p>
            </div>
          </el-menu-item>
          <span class="m_span">全球媒体榜</span>
          <el-menu-item :style="{ 'background-color': getPath(list.id) === activePath ? '#e6e6e6' : '#f9f9f9' }" :index="getPath(list.id)" v-for="list in globalListsData" :key="list.name" @click="changePath(list.id)">
            <!-- <img class="item_img" :src="list&&list.coverImgUrl" alt=""> -->
            <div class="item_des">
              <p class="item_title">{{ list.name }}</p>
              <p class="item_state">{{ list.updateFrequency }}</p>
            </div>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="main_top">
          <img class="top_l" :src="activeList.coverImgUrl" alt="" />
          <div class="top_r">
            <h2 class="r_title">{{ activeList.name }}</h2>
            <div class="r_des">
              <span class="des_l">最近更新: {{ getUpdateTime(activeList.updateTime) }}</span>
              <span class="des_r">({{ activeList.updateFrequency }})</span>
            </div>
            <div class="r_btn">
              <el-button-group>
                <el-button type="primary" icon="el-icon-video-play">播放</el-button>
                <el-button type="primary" icon="el-icon-plus"></el-button>
              </el-button-group>
              <el-button icon="el-icon-folder-add">{{ activeListDetail.bookedCount }}</el-button>
              <el-button icon="el-icon-share">{{ activeListDetail.shareCount }}</el-button>
              <el-button icon="el-icon-download">下载</el-button>
              <el-button icon="el-icon-chat-line-square">{{ activeListDetail.commentCount }}</el-button>
            </div>
          </div>
        </div>
        <div class="main_m">
          <div class="m_box">
            <div class="box_header">
              <span class="header_t">歌曲列表</span>
              <span class="header_c">{{ activeList.trackCount }}首歌</span>
              <span class="header_p">
                播放:
                <strong class="p_strong">{{ activeListDetail.playCount }}</strong>
                次
              </span>
            </div>
            <el-table :data="activeTableInfo" stripe style="width: 100%">
              <el-table-column type="index" width="76"> </el-table-column>
              <el-table-column prop="info" label="标题" width="327">
                <template v-slot:="{ row }">
                  <i class="el-icon-video-play"></i>
                  <a :href="'#/discover/song?id=' + row.info.id" style="margin-left: 10px">{{ row.info.name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="dt" label="时长" width="91">
                <template v-slot:="{ row }">
                  <span>{{ row.dt | songTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="ar" label="歌手" width="174">
                <template v-slot:="{ row }">
                  <span v-for="(item, id) in row.ar" :key="item.index">
                    <a :href="'#/discover/artist?id=' + item.id">{{ item.name }}</a>
                    <span v-if="id !== row.ar.length - 1">/</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="m_box">
            <div class="box_header">
              <span class="header_t">评论</span>
              <span class="header_c">共{{ activeCommentData.total }}条评论</span>
            </div>
            <div class="box_add"></div>
            <div class="box_com">
              <h3 class="com_h">精彩评论</h3>
              <ul>
                <li v-for="comment in activeCommentData.comments" :key="comment.index">
                  <img class="li_l" src="" alt="" />
                  <div class="li_r">{{ comment.content }}</div>
                </li>
              </ul>
            </div>
            <div class="box_com">
              <h3 class="com_h">最新评论{{ activeCommentData.total }}</h3>
              <ul>
                <li v-for="comment in activeCommentData.hotComments" :key="comment.index">
                  <img class="li_l" src="" alt="" />
                  <div class="li_r">{{ comment.content }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Toplist',
  created() {
    this.getInfo()
    this.getActiveTracksData()
    this.getListsData()
    this.getActiveListDetail()
    this.getActiveCommentData()
  },
  data() {
    return {
      day: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      activePath: '/discover/toplist?id=19723756',
      id: '19723756',
      // 当前激活榜单
      activeList: [],
      // 云音乐列表
      cloudListsData: [],
      // 全球列表
      globalListsData: [],
      // 所有榜单数据
      listsData: [],
      // 当前榜单的所有歌曲
      activeTracksData: [],
      // 激活榜单的详情信息
      activeListDetail: {},
      // 激活榜单的评论信息
      activeCommentData: [],
      // 激活榜单的列表数据
      activeTableInfo: []
    }
  },
  methods: {
    // 根据路由获取id和activePath
    getInfo() {
      const id = this.$route.query.id
      if (id) {
        this.id = id
        this.activePath = this.getPath(id)
      }
    },
    // 根据榜单id获取激活榜单的歌曲数据
    async getActiveTracksData() {
      const { data: { code, playlist: { tracks } } } = await this.$http.get(`/playlist/detail?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取榜单歌曲列表数据失败!')
      this.activeTracksData = tracks
      this.activeTableInfo = tracks.reduce((pre, cur) => {
        const { name, id, dt, ar } = cur
        const info = { name, id }
        const table = { info, dt, ar }
        pre.push(table)
        return pre
      }, [])
      // console.log(this.activeTableInfo)
      // console.log(this.activeTracksData)
    },
    // 获取所有榜单
    async getListsData() {
      const { data: { code, list } } = await this.$http.get('/toplist')
      if (code !== 200) return this.$message.info('获取榜单数据失败!')
      this.activeList = list.find(item => item.id + '' === this.id)
      this.listsData = list
      this.cloudListsData = list.slice(0, 4)
      this.globalListsData = list.slice(4)
      // console.log(this.cloudListsData)
      // console.log(this.globalListsData)
    },
    // 获取激活榜单的详情动态
    async getActiveListDetail() {
      const { data: { code, bookedCount, shareCount, commentCount, playCount } } = await this.$http.get(`/playlist/detail/dynamic?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌单详情动态失败!')
      this.activeListDetail = { bookedCount, shareCount, commentCount, playCount }
    },
    // 获取激活歌单的评论信息
    async getActiveCommentData() {
      const { data: { code, comments, hotComments, total } } = await this.$http.get(`/comment/playlist?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌单评论数据失败!')
      this.activeCommentData = { comments, hotComments, total }
      // console.log(this.activeCommentData)
    },
    // 获取当前激活榜单的数据
    getActiveList() {
      this.activeList = this.listsData.find(item => item.id + '' === this.id)
      // console.log(this.activeList)
    },
    getPath(id) {
      return '/discover/toplist?id=' + id
    },
    changePath(id) {
      this.id = id
      this.getTracksData()
    },
    getUpdateTime(time) {
      const t = new Date(time)
      // const year = t.getFullYear()
      const month = t.getMonth() + 1
      const date = t.getDate()
      // const day = t.getDay()
      return month + '月' + date + '日'
    },
  }
}
</script>

<style lang="less" scoped>
.top_list_container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  .el-container {
    background-color: #fff;
    border: 1px solid #ccc;
    border-bottom: 0;
    box-sizing: border-box;
    .el-aside {
      background-color: #f9f9f9;
      .el-menu {
        border: none;
        .m_span {
          display: block;
          width: 100%;
          height: 28px;
          padding: 0 10px 12px 15px;
          margin-top: 40px;
          font-size: 14px;
          font-family: simsun;
          font-weight: bold;
          box-sizing: border-box;
        }
        .el-menu-item {
          box-sizing: border-box;
          .item_img {
            display: inline-block;
            vertical-align: middle;
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          .item_des {
            display: inline-block;
            vertical-align: middle;
            line-height: 56px;
            font-size: 12px;
            .item_title,
            .item_state {
              width: 170px;
              height: 15px;
              line-height: 15px;
            }
            .item_title {
              margin: 2px 0 8px;
              color: #000;
            }
            .item_state {
              color: #ccc;
            }
          }
        }
      }
    }
    /deep/.el-main {
      padding: 0;
      border-left: 1px solid #ccc;
      .main_top {
        padding: 40px;
        .top_l {
          display: inline-block;
          vertical-align: middle;
          width: 150px;
          height: 150px;
          border: 1px solid #ccc;
          padding: 3px;
          box-sizing: border-box;
        }
        .top_r {
          display: inline-block;
          vertical-align: middle;
          margin-left: 30px;
          .r_title {
            font-size: 20px;
            font-family: 'Microsoft Yahei';
          }
          .r_des {
            height: 35px;
            line-height: 35px;
            margin-bottom: 20px;
            color: #999;
            font-size: 12px;
            .des_l {
              color: #666;
              margin-right: 10px;
            }
          }
          .r_btn {
            .el-button-group {
              margin-right: 10px;
            }
            .el-button {
              line-height: 31px;
              padding: 0 4px;
            }
          }
        }
      }
      .main_m {
        padding: 0 30px 30px 40px;
        .m_box {
          .box_header {
            width: 670px;
            height: 35px;
            background-color: #fff;
            border-bottom: 2px solid #c20c0c;
            box-sizing: border-box;
            font-size: 12px;
            .header_t {
              font-size: 20px;
            }
            .header_c {
              padding: 9px 0 0 20px;
            }
            .header_p {
              float: right;
              margin-top: 5px;
              .p_strong {
                color: #c20c0c;
              }
            }
          }
          .el-table {
            font-size: 12px;
            color: #999;
            margin-bottom: 30px;
            .cell {
              color: #666;
              i,
              a {
                color: #333;
                cursor: pointer;
              }
              a {
                &:hover {
                  text-decoration: underline;
                }
              }
            }
            .el-table__cell {
              height: 30px;
              padding: 5px 0;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              .song_img {
                width: 50px;
                height: 50px;
              }
            }
          }
          .box_add {
            height: 98px;
          }
          .box_com {
            .com_h {
              height: 20px;
              line-height: 20px;
              font-size: 12px;
              border-bottom: 1px solid #cfcfcf;
            }
            ul {
              margin-bottom: 40px;
              li {
                list-style: none;
                padding: 15px 0;
                .li_l {
                  display: inline-block;
                  vertical-align: middle;
                  width: 50px;
                  height: 50px;
                }
                .li_r {
                  display: inline-block;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
