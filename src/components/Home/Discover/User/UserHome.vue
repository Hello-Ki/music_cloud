<template>
  <div class="user_home_container">
    <div class="main">
      <div class="radio">
        <div class="header">
          <span>{{userInfo.nickname}}创建的电台</span>
        </div>
        <el-table :data="userRadios" style="width: 100%" header-align="center" :show-header="false" stripe>
          <el-table-column prop="name" label="名称" width="680">
            <template v-slot:={row}>
              <img :src="row.picUrl" @click="$router.push({name: 'djdetail', params: {id: row.id}})">
              <a @click="$router.push({name: 'djdetail', params: {id: row.id}})">{{row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="subCount" label="订阅数" width="215">
            <template v-slot:={row}>
              <span>订阅{{row.subCount}}次</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="playlist">
        <div class="header">
          <span class="title">{{userInfo.nickname}}创建的歌单</span>
          <span>({{userCreatePlaylist.length}})</span>
        </div>
        <ul class="list">
          <li v-for="item in userCreatePlaylist" :key="item.index">
            <div class="cover" @click="$router.push({name: 'playlistDetail', params: {id: item.id}})">
              <img :src="item.coverImgUrl">
              <span class="mask">
                <i class="i1"></i>
                <span>{{item.playCount}}</span>
                <a class="i2" href="javascript:;"></a>
              </span>
            </div>
            <a class="des" @click="$router.push({name: 'playlistDetail', params: {id: item.id}})">{{item.name}}</a>
          </li>
        </ul>
      </div>
      <div class="playlist">
        <div class="header">
          <span class="title">{{userInfo.nickname}}创建的歌单</span>
          <span>({{userCollectPlaylist.length}})</span>
        </div>
        <ul class="list">
          <li v-for="item in userCollectPlaylist" :key="item.index">
            <div class="cover" @click="$router.push({name: 'playlistDetail', params: {id: item.id}})">
              <img :src="item.coverImgUrl">
              <span class="mask">
                <i class="i1"></i>
                <span>{{item.playCount | numFormat}}</span>
                <a class="i2" href="javascript:;"></a>
              </span>
            </div>
            <a class="des" @click="$router.push({name: 'playlistDetail', params: {id: item.id}})">{{item.name}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="http://ip.ws.126.net/ipquery"></script>
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>

<script>
export default {
  name: 'UserHome',
  props: ['userInfo'],
  data() {
    return {
      id: '',
      userRadios: [],
      userCreatePlaylist: [],
      userCollectPlaylist: [],
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUserPlaylistData()
    this.getUserRadio()
  },
  methods: {
    // 获取用户创建的电台
    async getUserRadio() {
      const { data: { code, djRadios } } = await this.$http.get(`/user/audio?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户创建的电台信息失败!')
      this.userRadios = djRadios
    },
    // 获取用户创建的歌单
    async getUserPlaylistData() {
      const { data: { code, playlist } } = await this.$http.get(`/user/playlist?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户歌单数据失败!')
      const list = playlist
      this.userCreatePlaylist = list.filter(item => item.ordered === false)
      this.userCollectPlaylist = list.filter(item => item.ordered === true)
    },
  }
}
</script>

<style lang="less" scoped>
.user_home_container {
  width: 100%;
  background-color: #fff;
  .main {
    .radio, .playlist {
      color: #666;
      .header {
        height: 35px;
        border-bottom: 2px solid #c20c0c;
        margin: 0;
        span {
          font-size: 20px;
        }
      }
      img, a {
        cursor: pointer;
        vertical-align: middle;
      }
      a {
        margin-left: 10px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .radio {
      margin-bottom: 20px;
      /deep/.el-table {
        color: #666;
        font-size: 12px;
        border: 1px solid #ccc;
        border-top: 0;
        .cell {
          height: 50px;
          line-height: 50px;
        }
        img {
          width: 50px;
          height: 50px;
        }
        a {
          color: #333;
        }
      }
    }
    .playlist {
      .header {
        color: #333;
        .title {
          &::after {
            content: '';
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            background: url('../imgs/black-r-icon@3x.png');
          }
        }
      }
      .list {
        width: 100%;
        margin-top: 20px;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        li {
          width: 180px;
          height: 195px;
          color: #000;
          font-size: 14px;
          list-style: none;
          .cover {
            position: relative;
            width: 140px;
            height: 140px;
            margin-bottom: 5px;
            img {
            width: 100%;
            height: 100%;
            }
            .mask {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 30px;
              line-height: 30px;
              color: #ddd;
              background-color: #666;
              font-size: 12px;
              border: 1px solid #333;
              border-left: 0;
              border-right: 0;
              box-sizing: border-box;
              .i1, .i2 {
                display: inline-block;
                vertical-align: middle;
              }
              .i1 {
                width: 14px;
                height: 11px;
                margin-left: 10px;
                background: url('../imgs/iconall.png') 0 -24px;
              }
              span {
                margin-left: 5px;
              }
              .i2 {
                width: 16px;
                height: 17px;
                position: absolute;
                bottom: 5px;
                right: 5px;
                background: url('../imgs/iconall.png');
                &:hover {
                  background-position: 0 -60px;
                }
              }
            }
          }
          .des {
            display: inline-block;
            margin-left: 0;
            width: 140px;
            color: #000;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow-wrap: normal;
          }
          &:nth-child(5n) {
          margin-right: -40px;
          }
        }
      }
    }
  }
}
</style>
