<template>
  <div class="song_container">
    <div class="container_main">
      <!-- 歌曲相关信息 -->
      <div class="header">
        <div class="h_left">
          <div class="l_cover">
            <img :src="songAlbum.picUrl" alt="" />
            <span class="mask"></span>
          </div>
          <div class="l_play">
            <i></i>
            <!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 :src="playUrl">生成外链播放器</iframe> -->
            <a @click="$router.push({name: 'outchain', params: {type: type, id: id}})">生成外链播放器</a>
            <!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="330" height="86" :src="'//music.163.com/outchain/player?type=2&amp;id='+id+'&amp;auto=1&amp;height=66&amp;bg=e8e8e8'"></iframe> -->
          </div>
        </div>
        <div class="h_right">
          <div class="r1">
            <i></i>
            <span>{{ songName }}</span>
          </div>
          <div class="r2">
            <p>
              <span>歌手:</span>
              <a @click="$router.push({ name: 'artist', query: { id: songArtist.id } })">{{ songArtist.name }}</a>
            </p>
            <p>
              <span>所属专辑:</span>
              <a @click="$router.push({ name: 'albumDetail', params: { id: songAlbum.id } })">{{ songAlbum.name }}</a>
            </p>
          </div>
          <div class="r3">
            <el-button-group>
              <el-button type="primary" icon="el-icon-video-play">播放</el-button>
              <el-button type="primary" icon="el-icon-plus"></el-button>
            </el-button-group>
            <el-button icon="el-icon-folder-add">收藏</el-button>
            <el-button icon="el-icon-share">分享</el-button>
            <el-button icon="el-icon-download">下载</el-button>
            <el-button icon="el-icon-chat-line-square">{{ songComments.total }}</el-button>
          </div>
          <div class="r4">
            <p :class="{p1: lyricStatus.isExpend}">{{songLyric}}</p>
            <a :class="{a1: lyricStatus.isExpend}" href="javascript:;" @click="changeStatus">{{lyricStatus.desc}}</a>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="box_h">
          <span class="l1">评论</span>
          <span class="l2">共{{total}}条评论</span>
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
            <li class="comment" v-for="comment in songComments" :key="comment.index">
              <img :src="comment.user.avatarUrl" alt="" class="li_l">
              <div class="li_r">
                <div class="r_content">
                  <a @click="$router.push({name: 'user', params: {id: comment.user.userId}})">{{comment.user.nickname}}:</a>
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
    <el-aside width="270">aside</el-aside>
  </div>
</template>

<script>
export default {
  name: 'Song',
  data() {
    return {
      id: '',
      type: 2,
      playUrl: '',
      songName: '',
      songAlbum: {},
      songArtist: {},
      songLyric: '',
      lyricStatus: {
        isExpend: false,
        desc: '展开'
      },
      hotComments: [],
      songComments: [],
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
    this.id = this.$route.query.id
    this.getSongData()
    this.getSongUrl()
    this.getSongLyric()
    this.getSongComments()
  },
  methods: {
    // 获取歌曲详细信息
    async getSongData() {
      const {
        data: { code, songs },
      } = await this.$http.get(`/song/detail?ids=${this.id}`)
      if (code !== 200) return this.$message.info('获取榜单列表的歌曲详情信息失败!')
      this.songName = songs[0].name
      this.songAlbum = songs[0].al
      this.songArtist = songs[0].ar[0]
      this.pop = songs[0].pop
      // const res = await this.$http.get(`/song/detail?ids=${this.id}`)
      // console.log(res)
    },
    // 获取歌曲URL
    async getSongUrl() {
      const {
        data: { code, data },
      } = await this.$http.get(`/song/url?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取音乐URL数据失败!')
      this.playUrl = data[0].url
      // console.log(this.playUrl)
    },
    // 获取歌曲歌词
    async getSongLyric() {
      const { data: { code, lrc } } = await this.$http.get(`/lyric?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌曲歌词失败!')
      this.songLyric = lrc.lyric.replace(/[\d]/g, '').replace(/(\[:.])/g, '')
    },
    // 获取歌曲评论
    async getSongComments() {
      const {
        data: { code, hotComments, comments, total },
      } = await this.$http.get(`/comment/music?id=${this.id}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取歌曲评论信息失败!')
      this.hotComments = hotComments
      this.songComments = comments
      this.total = total
    },
    changeStatus() {
      this.lyricStatus.isExpend = !this.lyricStatus.isExpend
      this.lyricStatus.desc = this.lyricStatus.desc === '收起' ? '展开' : '收起'
    },
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.offset = (this.pageInfo.pagenum - 1) * this.pageInfo.pagesize
      this.getSongComments()
    }
  },
}
</script>

<style lang="less" scoped>
.song_container {
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
      .h_left, .h_right {
        display: inline-block;
        vertical-align: top;
      }
      .h_left {
        box-sizing: border-box;
        .l_cover {
          position: relative;
          width: 206px;
          height: 205px;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 130px;
            height: 130px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
          }
          .mask {
            display: block;
            width: 100%;
            height: 100%;
            background-color: #242424;
            border-radius: 50%;
          }
        }
        .l_play {
          margin: 20px 0 0 46px;
          font-size: 12px;
          i,
          a {
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
        }
      }
      .h_right {
        width: 414px;
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
            background: url('../imgs/icon.png') 0 -463px;
          }
          span {
            margin-left: 10px;
            font-size: 20px;
          }
        }
        .r2 {
          p {
            margin: 10px 0;
            span,
            a {
              display: inline-block;
              vertical-align: middle;
              font-size: 12px;
              color: #999;
            }
            a {
              margin-left: 10px;
              color: #0c73c2;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .r3 {
          margin-bottom: 40px;
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
          font-size: 12px;
          p {
            height: 300px;
            overflow: hidden;
            line-height: 20px;
            word-wrap: break-word;
            white-space: pre-wrap;
          }
          p1 {
            height: auto;
          }
          a {
            color: #0c73c2;
            &:hover {
              content: '';
              text-decoration: underline;
            }
            &::after {
              content: '';
              display: inline-block;
              width: 12px;
              height: 10px;
              background: url('../imgs/icon2.png') -40px -358px;
              transform: rotate(90deg);
            }
          }
          .p1 {
            height: 100%;
          }
          .a1 {
            &::after {
              content: '';
              transform: rotate(270deg);
            }
          }
        }
      }
    }
    .body {
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
                span {
                  line-height: 20px;
                  word-wrap: break-word;
                  white-space: pre-wrap;
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
              width: 555px;
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
  .el-aside {
    display: inline-block;
    vertical-align: middle;
    padding: 20px 40px 40px 30px;
    box-sizing: border-box;
  }
}
</style>
