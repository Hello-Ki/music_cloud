<template>
  <div class="artist_category_container">
    <div class="box1">
      <div class="header">
        <span class="title">{{cateName}}</span>
      </div>
      <div class="search">
        <a :class="{s1: defaultInitialId === item.id, s2: item.id !== 0 && item.id !== -1}" v-for="(item, index) in searchLists" :key="index" @click="searchArtist(item.id)">{{item.name}}</a>
      </div>
      <ul class="list1">
        <li v-for="item in artistLists" :key="item.index">
          <img :src="item.img1v1Url" class="cover">
          <div class="mes">
            <a class="name" @click="$router.push({name: 'artist', query: {id: item.id}})">{{item.name}}</a>
            <i :class="{i1: item.accountId !== void 0}" @click="$router.push({name: 'userHome', params:{id: item.accountId}})"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="box2">
      <ul class="list2">
        <li class="li2" v-for="item in artistRemain" :key="item.index">
          <div class="mes2">
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
  name: 'ArtistCategory',
  props: ['area', 'type', 'cateName'],
  data() {
    return {
      defaultInitialId: -1,
      searchLists: [
        { name: '热门', id: -1 },
        { name: 'A', id: 'a' },
        { name: 'B', id: 'b' },
        { name: 'C', id: 'c' },
        { name: 'D', id: 'd' },
        { name: 'E', id: 'e' },
        { name: 'F', id: 'f' },
        { name: 'G', id: 'g' },
        { name: 'H', id: 'h' },
        { name: 'I', id: 'i' },
        { name: 'J', id: 'j' },
        { name: 'K', id: 'k' },
        { name: 'L', id: 'l' },
        { name: 'M', id: 'm' },
        { name: 'N', id: 'n' },
        { name: 'O', id: 'o' },
        { name: 'P', id: 'p' },
        { name: 'Q', id: 'q' },
        { name: 'R', id: 'r' },
        { name: 'S', id: 's' },
        { name: 'T', id: 't' },
        { name: 'U', id: 'u' },
        { name: 'V', id: 'v' },
        { name: 'W', id: 'w' },
        { name: 'X', id: 'x' },
        { name: 'Y', id: 'y' },
        { name: 'Z', id: 'z' },
        { name: '其它', id: 0 }
      ],
      limit: 100,
      offset: 0,
      artistLists: [],
      artistRemain: [],
    }
  },
  watch: {
    $route(to, from) {
      this.getArtistLists()
    }
  },
  created() {
    this.getArtistLists()
  },
  methods: {
    async getArtistLists() {
      const { data: { code, artists } } = await this.$http.get(`/artist/list?type=${this.type}&area=${this.area}&initial=${this.defaultInitialId}&limit=${this.limit}&offset=${this.offset}`)
      if (code !== 200) return this.$message.info('获取歌手列表数据失败!')
      this.artistLists = artists.slice(0, 10)
      this.artistRemain = artists.slice(10,)
    },
    searchArtist(id) {
      this.defaultInitialId = id
      this.getArtistLists()
    },
  }
}
</script>

<style lang="less" scoped>
.artist_category_container {
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
  .box1, .box2 {
    .header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom: 2px solid #c20c0c;
      .title {
        color: #333;
        font-size: 24px;
      }
    }
    .search {
      width: 100%;
      margin: 20px 0;
      a {
        display: inline-block;
        vertical-align: middle;
        margin: 0 2px;
        padding: 0 8px;
        line-height: 24px;
        color: #000;
        text-align: center;
        &:hover {
          text-decoration: underline;
        }
      }
      .s1 {
        color: #fff;
        background-color: #c20c0c;
        border-radius: 2px;
      }
      .s2 {
        width: 21px;
        padding: 0;
        font-size: 14px;
      }
    }
    .list1, .list2 {
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
      .li2 {
        flex: 20%;
        height: 30px;
        line-height: 23px;
        margin-bottom: 0;
        .mes2 {
          i {
            display: none;
            margin-left: 2px;
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
    .list2 {
      margin-top: 10px;
    }
  }
}
</style>
