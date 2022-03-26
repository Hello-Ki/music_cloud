<template>
  <div class="program_container">
    <div class="container_main">
      <!-- 歌曲相关信息 -->
      <div class="header">
        <div class="header1">
          <div class="h_left">
            <img class="l_cover" :src="programDetail.coverUrl" alt="" />
          </div>
          <div class="h_right">
            <div class="r1">
              <i></i>
              <span class="title">{{ programDetail.name }}</span>
            </div>
            <div class="r2">
              <i></i>
              <a @click="$router.push({ name: 'djdetail', params: { id: radioDetail.id } })">{{ radioDetail.name }}</a>
              <span @click="star">
                <i :class="{ star: isStar }"></i>
                订阅({{ radioDetail.subCount | numFormat }})
              </span>
            </div>
          </div>
        </div>
        <div class="header2">
          <div class="r1">
            <a class="play" href="javascript:void(0);">
              <span>播放&nbsp;{{ programDetail.duration | programTime }}</span>
            </a>
            <a class="thumb" href="javascript:void(0);">
              <i></i>
              <span>({{ programDetail.likedCount }})</span>
            </a>
            <a class="comment" href="javascript:void(0);">
              <span>评论</span>
            </a>
            <a class="share" href="javascript:void(0);">
              <span>({{ programDetail.shareCount }})</span>
            </a>
            <a class="download" href="javascript:void(0);">
              <span>下载</span>
            </a>
            <a class="outlink" @click="$router.push({ name: 'outchain', params: { type: type, id: id } })">生成外链播放器</a>
          </div>
          <div class="r2">
            <a class="cate" @click="$router.push({ name: 'djradio', params: { id: programDetail.categoryId } })">{{ programDetail.categoryName }}</a>
            <span class="des">{{ radioDetail.name }}&nbsp;第{{ programDetail.serialNum }}期</span>
            <span class="create">{{ programDetail.createTime | publishTime }}&nbsp;创建</span>
            <span class="count">
              播放:&nbsp;
              <em>{{ programDetail.listenerCount }}</em>
              次
            </span>
          </div>
          <div class="r3">
            <span ref="des" class="des" :class="{des1: isShow, des2: isExpend }">介绍:&nbsp;{{ programDetail.description }}</span>
            <p class="expend" :class="{expend1: isShow}" @click="isExpend = !isExpend">
              <a href="javascript:;">{{ isExpend ? '收起' : '展开' }}</a>
              <i class="icon" :class="{ icon1: isExpend }"></i>
            </p>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="header">
          <span class="h1">评论</span>
          <span class="h2">共{{ programDetail.commentCount }}条评论</span>
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
      type: 3,
      isStar: false,
      isShow: false,
      isExpend: false,
      programDetail: {},
      radioDetail: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getProgramDetail()
  },
  methods: {
    async getProgramDetail() {
      const {
        data: {
          code,
          program: { radio: radioDetail, ...programDetail },
        },
      } = await this.$http.get(`/dj/program/detail?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取节目详情失败!')
      this.programDetail = programDetail
      this.radioDetail = radioDetail
      // console.log(this.programDetail)
      // console.log(this.radioDetail)
      await this.$nextTick()
      if (this.$refs.des.offsetHeight > 184) {
        this.isShow = true
      }
    },
    star() {
      this.isStar = !this.isStar
      this.radioDetail.subCount = this.isStar ? this.radioDetail.subCount + 1 : this.radioDetail.subCount - 1
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
      .header1 {
        .h_left,
        .h_right {
          display: inline-block;
          vertical-align: top;
        }
        .h_left {
          box-sizing: border-box;
          .l_cover {
            width: 140px;
            height: 140px;
            padding: 2px;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
        }
        .h_right {
          width: 470px;
          margin-left: 20px;
          .r1 {
            padding-top: 18px;
            line-height: 28px;
            margin-bottom: 30px;
            i,
            span {
              display: inline-block;
              vertical-align: top;
            }
            i {
              width: 72px;
              height: 24px;
              background: url('../imgs/icon2.png') 0 -75px;
            }
            span {
              width: 380px;
              margin-left: 10px;
              font-size: 20px;
            }
          }
          .r2 {
            i,
            a,
            span {
              display: inline-block;
              vertical-align: middle;
              font-size: 12px;
              color: #333;
            }
            i {
              width: 16px;
              height: 17px;
              background: url('../imgs/icon2.png') -50px -20px;
            }
            a {
              margin: 0 10px;
              font-size: 16px;
              color: #666;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
            span {
              height: 28px;
              padding: 0 5px;
              line-height: 28px;
              border: 1px solid #ccc;
              border-radius: 5px;
              text-align: center;
              cursor: pointer;
              i {
                vertical-align: middle;
                width: 14px;
                height: 14px;
                background: url('../imgs/icon2.png') -50px 0;
              }
              .star {
                background-position: -70px 0;
              }
            }
          }
        }
      }
      .header2 {
        margin-top: 20px;
        .r1 {
          margin-bottom: 40px;
          a {
            display: inline-block;
            vertical-align: middle;
            color: #333;
            font-size: 12px;
            cursor: pointer;
          }
          .play,
          .thumb,
          .comment,
          .share,
          .download {
            text-align: right;
            background-image: url('../imgs/button2.png');
            span {
              height: 30px;
              line-height: 30px;
            }
          }
          .thumb,
          .comment,
          .share,
          .download {
            position: relative;
            width: 60px;
            height: 30px;
            line-height: 30px;
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
          .play {
            position: relative;
            width: 120px;
            height: 32px;
            line-height: 32px;
            color: #fff;
            background-position: 0 -632px;
            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              right: -6px;
              width: 8px;
              height: 32px;
              background: url('../imgs/button2.png') -243px -675px;
            }
            &:hover {
              background-position: 0 -718px;
              &::after {
                content: '';
                background-position: -243px -761px;
              }
            }
          }
          .thumb {
            position: relative;
            background-position: 0 -59px;
            i {
              position: absolute;
              top: 6px;
              left: 10px;
              width: 17px;
              height: 16px;
              background: url('../imgs/button2.png') 0 -94px;
            }
            &:hover {
              background-position: 0 -141px;
            }
          }
          .comment {
            background-position: 0 -1465px;
            &:hover {
              background-position: 0 -1508px;
            }
          }
          .share {
            background-position: 0 -1225px;
            &:hover {
              background-position: 0 -1268px;
            }
          }
          .download {
            background-position: 0 -2761px;
            &:hover {
              background-position: 0 -2805px;
            }
          }
          .outlink {
            margin-left: 40px;
            color: #0c73c2;
            text-decoration: underline;
            &::before {
              content: '';
              display: inline-block;
              padding-right: 5px;
              width: 12px;
              height: 12px;
              background: url('../imgs/icon.png') -35px -865px;
            }
          }
        }
        .r2 {
          font-size: 12px;
          color: #999;
          .cate,
          .des,
          .create,
          .count {
            display: inline-block;
            vertical-align: middle;
          }
          .cate {
            padding: 2px 5px;
            margin-right: 10px;
            color: #cc0000;
            border: 1px solid #cc0000;
            cursor: pointer;
          }
          .des {
            color: #333;
            font-weight: bolder;
            font-size: 14px;
          }
          .create {
            margin: 0 20px;
          }
          .count {
            em {
              color: #c20c02;
              font-style: normal;
              font-weight: bolder;
            }
          }
        }
        .r3 {
          margin-top: 10px;
          line-height: 23px;
          color: #666;
          font-size: 12px;
          .des {
            display: block;
            height: 100%;
            overflow: hidden;
            word-wrap: break-word;
            white-space: pre-wrap;
            text-overflow: ellipsis;
          }
          .des1 {
            height: 184px;
          }
          .des2 {
            height: 100%;
          }
          .expend {
            display: none;
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
              width: 11px;
              height: 8px;
              background: url('../imgs/icon.png') -65px -520px;
            }
            .icon1 {
              background-position: -44px -520px;
            }
          }
          .expend1 {
            display: block;
          }
        }
      }
    }
    .body {
      margin-top: 40px;
      .header {
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
      }
    }
  }
}
</style>
