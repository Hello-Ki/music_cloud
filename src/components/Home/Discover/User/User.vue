<template>
  <div class="user_container">
    <div class="header">
      <div class="h_left">
        <img :src="userProfile.avatarUrl" alt="">
      </div>
      <div class="h_right">
        <div class="r1">
          <span class="span1">{{userProfile.nickname}}</span>
          <span class="span2"></span>
          <i class="i1">
            <strong>{{userLevel}}</strong>
          </i>
          <span class="span3">
            <i class="g1" v-if="userProfile.gender === 1"></i>
            <i class="g2" v-else></i>
          </span>
          <el-button icon="el-icon-message">发私信</el-button>
          <el-button type="primary" icon="el-icon-plus">关注</el-button>
          <a class="art" @click="$router.push({name: 'artist', query:{id: userProfile.artistId}})">查看歌手页</a>
        </div>
        <div class="r2">
          <p class="logo1" :class="{logo1_1: allAuthTypes1.des == ''}">
            <i></i>
            <span class="desc">{{allAuthTypes1.desc}}</span>
            <span class="tag" v-for="tag in allAuthTypes1.tags" :key="tag.index">{{tag}}</span>
          </p>
          <p class="logo2" :class="{logo2_1: allAuthTypes2.length == 0}">
            <i></i>
            <span class="desc" v-for="item in allAuthTypes2" :key="item.index">{{item.desc}}&nbsp;</span>
          </p>
        </div>
        <div class="r3">
          <a class="event" @click="$router.push({name: 'userEvent', params:{id: id}})">
            <span class="top">{{userProfile.eventCount}}</span>
            <span class="bot">动态</span>
          </a>
          <span class="line"></span>
          <a class="follows" @click="$router.push({name: 'userFollows', params:{id: id}})">
            <span class="top">{{userProfile.follows}}</span>
            <span class="bot">关注</span>
          </a>
          <span class="line"></span>
          <a class="fans" @click="$router.push({name: 'userFans', params:{id: id}})">
            <span class="top">{{userProfile.followeds}}</span>
            <span class="bot">粉丝</span>
          </a>
        </div>
        <div class="r4" :class="{r4_1: !userProfile.signature}">个人介绍:&nbsp;{{userProfile.signature}}</div>
        <div class="r5" :class="{r5_1: userAddress==''}">所在地区:&nbsp;{{userAddress}}</div>
        <div class="r6" :class="{r6_1: !userProfile.avatarDetail}">
          <span>社交网络:</span>
        </div>
      </div>
    </div>
    <div class="main">
      <router-view :userInfo="userProfile"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      id: '',
      userLevel: 0,
      userAddress: '',
      userProfile: {},
      allAuthTypes1: [],
      allAuthTypes2: [],
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUserDetail()
    this.$router.push({ name: 'userHome', params: { id: this.id } })
  },
  methods: {
    // 获取用户详情信息
    async getUserDetail() {
      const { data: { code, level, profile: { province, city, ...userProfile } } } = await this.$http.get(`/user/detail?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户详情信息失败!')
      this.userLevel = level
      const target1 = this.$province.find(item => item.code === province + '')
      if (target1) {
        this.userAddress = target1.name
        const target2 = target1.children.find((item) => item.code === city)
        if (target2) {
          this.userAddress += target2.name
        }
      }
      this.userProfile = userProfile
      const all = this.userProfile.allAuthTypes || []
      this.allAuthTypes1 = this.userProfile.mainAuthType || []
      this.allAuthTypes2 = all.length > 1 ? all.slice(1) : []
      document.title = this.userProfile.nickname + ' - 用户 - 网易云音乐'
    }
  }
}
</script>

<style lang="less" scoped>
.user_container {
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 40px;
  box-sizing: border-box;
  .header {
    margin-bottom: 43px;
    .h_left, .h_right {
      display: inline-block;
      vertical-align: top;
    }
    .h_left {
      margin-right: 30px;
      img {
        width: 188px;
        height: 188px;
        padding: 2px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }
    }
    .h_right {
      width: 670px;
      .r1, .r2, .r3, .r4, .r5, .r6 {
        width: 100%;
        margin-bottom: 10px;
        font-size: 12px;
        color: #666;
      }
      .r1 {
        position: relative;
        .span1, .span2, .i1, .span3, .el-button, .art {
          display: inline-block;
          vertical-align: middle;
        }
        .span1 {
          font-size: 22px;
        }
        .i1 {
          position: relative;
          width: 40px;
          height: 19px;
          margin: 0 10px;
          background: url('../imgs/icon2.png') -135px -190px;
          strong {
            position: absolute;
            top: 2px;
            right: 2px;
            color: #e03a24;
            font-size: 15px;
          }
          &::after {
            position: absolute;
            top: 0;
            right: -11px;
            content: '';
            width: 12px;
            height: 19px;
            background: url('../imgs/icon2.png') -188px -190px;
          }
        }
        .span3 {
          width: 20px;
          height: 20px;
          margin: 0 10px;
          .g1, .g2 {
            display: block;
            width: 100%;
            height: 100%
          }
          .g1 {
            background: url('../imgs/icon.png') -41px -57px;
          }
          .g2 {
            background: url('../imgs/icon.png') -41px -27px;
          }
        }
        .el-button {
          padding: 2px 10px;
          height: 30px;
          font-size: 12px;
        }
        .art {
          position: absolute;
          right: 0;
          padding: 6px 15px;
          color: #333;
          text-align: center;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 3px;
          cursor: pointer;
          &:hover {
            background-color: #fff;
            border-color: #ddd;
          }
        }
      }
      .r2 {
        .logo1 {
          &::before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 68px;
            height: 20px;
            background: url('../imgs/icon2.png') -150px -480px;
          }
        }
        .logo2 {
          margin-bottom: 10px;
          &::before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 68px;
            height: 20px;
            background: url('../imgs/icon2.png') -74px -480px;
          }
        }
        .logo1, .logo2 {
          span {
            margin: 0 5px;
          }
          .desc {
            font-size: 14px;
            color: #666;
          }
          .tag {
            padding: 0 2px;
            font-size: 12px;
            color: rgba(0, 0, 0, .4);
            border: 1px solid #aaa;
            border-radius: 2px;
          }
        }
      }
      .r3 {
        margin-bottom: 15px;
        border-top: 1px solid #ddd;
        .event, .follows, .fans, .line {
          display: inline-block;
          vertical-align: middle;
          margin-top: 10px;
          height: 42px;
        }
        .event, .follows, .fans {
          padding-right: 40px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
          .top, .bot {
            display: block;
          }
          .top {
            font-size: 24px;
          }
          &:hover {
            color: #0c73c2;
          }
        }
        .follows, .fans {
          padding-left: 20px;
        }
        .line {
          width: 1px;
          background-color: #ccc;
        }
      }
      .r4 {
        clear: left;
        line-height: 20px;
      }
      .logo1_1, .logo2_1, .r4_1, .r5_1, .r6_1, .logo_1 {
        display: none;
      }
    }
  }
}
</style>
