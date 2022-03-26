<template>
  <div class="signed_artist_container">
    <div class="box1">
      <div class="header">
        <span class="title">入驻歌手</span>
      </div>
      <ul class="list1">
        <li v-for="item in signedArtistList" :key="item.index">
          <img :src="item.img1v1Url" class="cover">
          <div class="mes">
            <a class="name" @click="$router.push({name: 'artist', query: {id: item.id}})">{{item.name}}</a>
            <i :class="{i1: item.accountId !== void 0}" @click="$router.push({name: 'userHome', params:{id: item.accountId}})"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignedArtist',
  data() {
    return {
      offset: 0,
      limit: 100,
      more: true,
      signedArtistList: [],
    }
  },
  created() {
    this.getSignedArtistList()
  },
  methods: {
    async getArtistList() {
      const { data: { code, ...artistData } } = await this.$http.get(`/artist/list?type=-1&area=-1&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取入驻歌手列表失败!')
      return artistData
    },
    async getSignedArtistList() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      while (this.more) {
        const { artists, more } = await this.getArtistList()
        this.more = more
        this.offset += this.limit
        const res = artists.filter(item => item.accountId !== undefined)
        this.signedArtistList = this.signedArtistList.concat(res)
      }
      setTimeout(() => {
        loading.close()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.signed_artist_container {
  width: 100%;
  a, img, i {
    cursor: pointer;
  }
  a {
    font-size: 12px;
    &:hover {
      text-decoration: underline;
    }
  }
  .box1 {
    .header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-bottom: 20px;
      border-bottom: 2px solid #c20c0c;
      .title {
        color: #333;
        font-size: 24px;
      }
    }
    .list1 {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border-bottom: 1px dotted #333;
      li {
        flex: 20%;
        margin-bottom: 30px;
        list-style: none;
        .cover {
          width: 130px;
          height: 130px;
          border: 1px solid #ddd;
          box-sizing: border-box;
        }
        .mes {
          width: 130px;
          position: relative;
          a {
            color: #000;
          }
          i {
            position: absolute;
            right: 10px;
            display: none;
          }
          .i1 {
            display: inline-block;
            vertical-align: middle;
            width: 17px;
            height: 18px;
            background: url('../imgs/icon.png') 0 -740px;
          }
        }
      }
    }
  }
}
</style>
