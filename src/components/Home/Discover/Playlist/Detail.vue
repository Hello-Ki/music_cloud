<template>
  <div class="detail_container">
    <div class="container_main">
      <div class="header">
        <div class="h_left">
          <img :src="playlistData.coverImgUrl" alt="">
        </div>
        <div class="h_right">
          <div class="r1">
            <i></i>
            <span>{{playlistData.name}}</span>
          </div>
          <div class="r2">
            <img :src="playlistCreator.avatarUrl" alt="">
            <a @click="$router.push({name: 'userHome', params: {id: playlistCreator.userId}})">{{playlistCreator.nickname}}</a>
            <span>{{ playlistData.createTime | publishTime }}创建</span>
          </div>
          <div class="r3">
            <el-button-group>
              <el-button type="primary" icon="el-icon-video-play">播放</el-button>
              <el-button type="primary" icon="el-icon-plus"></el-button>
            </el-button-group>
            <el-button icon="el-icon-folder-add">收藏({{playlistDynamic.bookedCount}})</el-button>
            <el-button icon="el-icon-share">分享({{playlistDynamic.shareCount}})</el-button>
            <el-button icon="el-icon-download">下载</el-button>
            <el-button icon="el-icon-chat-line-square">({{playlistDynamic.commentCount}})</el-button>
          </div>
          <div class="r4">
            <span>标签:</span>
            <el-button v-for="tag in playlistData.tags" :key="tag.index" round @click="$router.push({name: 'playlist', query: {cat: tag, order: 'hot'}})">{{tag}}</el-button>
          </div>
          <div class="r5">
            <span>介绍:&nbsp;&nbsp; {{playlistData.description}}</span>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="body_box">
          <div class="box_h">
            <span class="l1">歌曲列表</span>
            <span class="l2">{{playlistData.trackCount}}首歌</span>
            <div class="h_right">
              <i></i>
              <a @click="$router.push({name: 'outchain', params: {id: id}})">生成外链播放器</a>
              <span>
                播放:&nbsp;
                <strong>{{playlistData.playCount}}</strong>
                次
              </span>
            </div>
          </div>
          <el-table :data="playlistTracks" stripe style="width: 100%">
            <el-table-column
              type="index"
              width="74">
            </el-table-column>
            <el-table-column
              prop="name"
              label="标题"
              width="236">
              <template v-slot:={row}>
                <i class="el-icon-video-play"></i>
                <a @click="$router.push({name: 'song', params: {id: row.id}})" style="margin-left: 10px">{{ row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="dt"
              label="时长"
              width="109">
              <template v-slot:={row}>
                <span>{{row.dt | songTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ar"
              label="歌手"
              width="90">
              <template v-slot:={row}>
                <a @click="$router.push({name: 'artist', query: {id: row.ar[0].id}})">{{row.ar[0].name}}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="al"
              label="专辑"
              width="128">
              <template v-slot:={row}>
                <a @click="$router.push({name: 'albumDetail', params: {id: row.al.id}})">{{row.al.name}}</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="download">
            <p>查看更多内容,请下载客户端</p>
            <el-button type="danger" round @click="$router.push({name: 'download'})">立即下载</el-button>
          </div>
        </div>
        <div class="body_box">
          <div class="box_h">
            <span class="l1">评论</span>
            <span class="l2">共{{playlistData.commentCount}}条评论</span>
          </div>
          <div class="send">
            <img class="send_l" src="../imgs/default_avatar.jpg" alt="">
            <div class="send_r">
              <textarea class="text" name="" cols="82" rows="4" placeholder="评论"></textarea>
              <div class="r_btn"></div>
            </div>
          </div>
          <div class="hot" v-show="hotComments&&hotComments.length">
            <div class="head">精彩评论</div>
            <ul>
              <li class="comment" v-for="hotComment in hotComments" :key="hotComment.index">
                <img :src="hotComment.user.avatarUrl" alt="" class="li_l">
                <div class="li_r">
                  <div class="r_content">
                    <a @click="$router.push({name: 'userHome', params: {id: hotComment.user.userId}})">{{hotComment.user.nickname}}:</a>
                    <span>{{hotComment.content}}</span>
                  </div>
                  <div class="r_date">{{hotComment.time | commentTime}}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="new">
            <div class="head">最新评论({{total}})</div>
            <ul>
              <li class="comment" v-for="comment in comments" :key="comment.index">
                <img :src="comment.user.avatarUrl" alt="" class="li_l">
                <div class="li_r">
                  <div class="r_content">
                    <a @click="$router.push({name: 'userHome', params: {id: comment.user.userId}})">{{comment.user.nickname}}:</a>
                    <span>{{comment.content}}</span>
                  </div>
                  <div class="r_date">{{comment.time | commentTime}}</div>
                </div>
              </li>
            </ul>
            <el-pagination background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-aside width="270">aside</el-aside>
  </div>
</template>

<script>
export default {
  name: 'PlaylistDetail',
  data() {
    return {
      id: '',
      playlistData: [],
      playlistCreator: {},
      playlistDynamic: {},
      playlistTracks: [],
      comments: [],
      more: false,
      hotComments: [],
      moreHot: false,
      total: 0,
      limit: 20,
      offset: 0,
      pageInfo: {
        pagenum: 1,
        pagesize: 20
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getPlaylistData()
    this.getPlaylistDynamic()
    // this.getUserDetail()
    this.getPlaylistTracks()
    this.getPlaylistComments()
  },
  methods: {
    // 获取歌单详情
    async getPlaylistData() {
      const { data: { code, playlist } } = await this.$http.get(`/playlist/detail?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌单详情失败!')
      this.playlistData = playlist
      this.playlistCreator = playlist.creator
      document.title = this.playlistData.name + '- 歌单' + ' - 网易云音乐'
      console.log(this.playlistData)
    },
    // 获取歌单详情动态
    async getPlaylistDynamic() {
      const { data: { code, bookedCount, shareCount, commentCount } } = await this.$http.get(`/playlist/detail/dynamic?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌单详情动态失败!')
      this.playlistDynamic = { bookedCount, shareCount, commentCount }
    },
    // 获取用户详情
    async getUserDetail() {
      const res = await this.$http.get(`/user/detail?uid=${this.playlistData.userId}`)
      console.log(res)
    },
    // 获取歌单所有歌曲
    async getPlaylistTracks() {
      const { data: { code, songs } } = await this.$http.get(`/playlist/track/all?id=${this.id}&limit=10`)
      if (code !== 200) return this.$message.info('获取热门歌曲列表失败!')
      this.playlistTracks = songs
    },
    // 获取歌单评论
    async getPlaylistComments() {
      const { data: { code, comments, more, hotComments, moreHot, total } } = await this.$http.get(`/comment/playlist?id=${this.id}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取歌单评论失败!')
      this.comments = comments
      this.more = more
      this.hotComments = hotComments
      this.moreHot = moreHot
      this.total = total
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.limit
      this.getPlaylistComments()
    }
  }
}
</script>

<style lang="less" scoped>
.detail_container {
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  box-sizing: border-box;
  .container_main {
    display: inline-block;
    vertical-align: middle;
    width: 710px;
    padding: 47px 30px 40px 39px;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    .header {
      padding-bottom: 20px;
      box-sizing: border-box;
      .h_left, .h_right {
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
      }
      .h_left {
        float: left;
        width: 208px;
        img {
          width: 208px;
          height: 208px;
          padding: 3px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
      }
      .h_right {
        width: 410px;
        margin-left: 20px;
        font-size: 12px;
        box-sizing: border-box;
        .r1 {
          height: 32px;
          line-height: 32px;
          margin-bottom: 12px;
          i,
          span {
            display: inline-block;
            vertical-align: top;
          }
          i {
            width: 54px;
            height: 24px;
            background: url('../imgs/icon.png') 0 -243px;
          }
          span {
            // float: right;
            width: 346px;
            margin-left: 10px;
            font-size: 20px;
            line-height: 24px;
          }
        }
        .r2 {
          margin-bottom: 20px;
          color: #999;
          img, a, span {
            display: inline-block;
            vertical-align: middle;
          }
          img {
            width: 35px;
            height: 35px;
          }
          a {
            margin: 0 10px;
            color: #0c73c2;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .r3 {
          .el-button-group {
            margin-right: 10px;
          }
          .el-button {
            line-height: 25px;
            padding: 0 4px;
            font-size: 12px;
          }
        }
        .r4 {
          margin: 25px 0 10px;
          span {
            margin-right: 10px;
          }
          .el-button {
            line-height: 15px;
            padding: 3px 12px;
            font-size: 12px;
          }
        }
        .r5 {
          color: #666;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
      }
    }
    .body {
      .body_box {
        padding-bottom: 20px;
        .box_h {
          width: 100%;
          height: 35px;
          line-height: 35px;
          border-bottom: 2px solid #c10d0c;
          font-size: 12px;
          color: #666;
          .l1 {
            color: #333;
            font-size: 20px;
            margin-right: 20px;
          }
          .h_right {
            float: right;
            i,a {
              display: inline-block;
              vertical-align: middle;
              margin-right: 10px;
              color: #0c73c2;
              text-decoration: underline;
              cursor: pointer;
            }
            i {
              width: 12px;
              height: 12px;
              background: url('../imgs/icon.png') -35px -865px;
            }
            span {
              strong {
                color: #c10d0c;
              }
            }
          }
        }
        /deep/.el-table {
          border: 1px solid #d9d9d9;
          tr {
            height: 30px;
            th.el-table__cell {
              background-color: #f6f6f6;
            }
            .cell {
              color: #666;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              a {
                cursor: pointer;
                color: #333;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
            .el-table__cell {
              padding: 3px 10px;
              font-size: 12px;
              box-sizing: border-box;
            }
          }
        }
        .download {
          display: flex;
          height: 66px;
          margin-top: 30px;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          p {
            width: 169px;
            font-size: 13px;
          }
          .el-button {
            width: 120px;
            line-height: 5px;
            height: 30px;
            font-size: 12px;
          }
          .el-button--danger {
            background-color: #ff1d12;
          }
        }
        .send {
          padding: 20px 0;
          .send_l, .send_r {
            display: inline-block;
            vertical-align: top;
          }
          .send_l {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
          .send_r {
            .text {
              margin-right: -20px;
              padding: 5px 6px 6px;
              box-sizing: border-box;
              resize: none;
            }
          }
        }
        .hot, .new {
          .head {
            font-size: 12px;
            font-weight: bolder;
            border-bottom: 1px solid #ccc;
          }
          ul {
            margin-bottom: 20px;
            li {
              height: 82px;
              list-style: none;
              padding: 16px 0;
              border-bottom: 1px dotted #ccc;
              box-sizing: border-box;
              .li_l, .li_r {
                display: inline-block;
                vertical-align: top;
                font-size: 12px;
                box-sizing: border-box;
                .r_content {
                  margin-bottom: 20px;
                  a {
                    margin-right: 10px;
                    color: #0c73c2;
                    &:hover {
                      text-decoration: underline;
                      cursor: pointer;
                    }
                  }
                }
              }
              .li_l {
                width: 50px;
                height: 50px;
                line-height: 82px;
                margin-right: 10px;
              }
              .li_r {
                width: 550px;
              }
            }
          }
          /deep/.el-pager {
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
  }
  .el-aside {
    display: inline-block;
    vertical-align: middle;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
  }
}
</style>
