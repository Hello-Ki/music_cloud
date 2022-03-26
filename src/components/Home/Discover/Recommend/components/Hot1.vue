<template>
  <div class="main_hot1">
    <div class="hot1_header">
      <a class="hot1_left" href="#/discover/playlist">热门推荐</a>
      <ul class="hot1_ul">
        <li v-for="item in hotTags" :key="item.index" @click="$router.push({ name: 'playlist', query: { cat: item.name } })" class="hot1_li">
          {{ item.name }}
        </li>
      </ul>
      <a class="hot1_r" href="#/discover/playlist">更多</a>
    </div>
    <ul class="hot1_body">
      <li class="list_li" v-for="list in hotListData" :key="list.index">
        <div class="li_cover">
          <img class="cover_img" :src="list.picUrl" alt="" :title="list.name" />
        </div>
        <p class="li_dec">
          <a class="dec_a" @click="$router.push({name: 'playlistDetail', params: {id: list.id}})">{{ list.name }}</a>
        </p>
      </li>
    </ul>
    <div class="hot1_footer"></div>
  </div>
</template>

<script>
export default {
  name: 'Hot1',
  data() {
    return {
      hotTags: [],
      hotListData: []
    }
  },
  created() {
    this.getHotTags()
    this.getHotList()
  },
  methods: {
    // 获取热门推荐词条
    async getHotTags() {
      const {
        data: { tags, code },
      } = await this.$http.get('/playlist/hot')
      if (code !== 200) return this.$message.error('获取热门推荐词条数据失败！')
      this.hotTags = tags.slice(0, 5)
    },
    // 获取热门歌单
    async getHotList() {
      const {
        data: { code, result },
      } = await this.$http.get('/personalized?limit=8')
      if (code !== 200) {
        return this.$message.info('获取热门歌单数据失败!')
      }
      this.hotListData = result
      // console.log(this.hotListData)
    }
  }
}
</script>

<style lang="less" scoped>
.main_hot1 {
  .hot1_header {
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
    .hot1_left {
      float: left;
      display: block;
      height: 28px;
      color: #333;
      font-size: 20px;
      padding: 0 10px 0 34px;
      box-sizing: border-box;
    }
    .hot1_ul {
      float: left;
      margin: 7px 0 0 20px;
      display: flex;
      .hot1_li {
        list-style: none;
        font-size: 12px;
        color: #666;
        padding: 0 10px;
        position: relative;
        text-align: center;
        cursor: pointer;
        &:nth-child(n + 2)::before {
          content: ' ';
          position: absolute;
          width: 1px;
          height: 13.5px;
          background-color: #ccc;
          top: 50%;
          left: -1px;
          transform: translateY(-50%);
        }
      }
    }
    .hot1_r {
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
  .hot1_body {
    padding-top: 30px;
    .list_li {
      display: inline-block;
      width: 140px;
      height: 188px;
      line-height: 1.4;
      padding: 0 0 30px 42px;
      list-style: none;
      font-size: 12px;
      vertical-align: middle;
      .li_cover {
        width: 140px;
        height: 140px;
        .cover_img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &:nth-child(1),
      &:nth-child(5) {
        padding-left: 0;
      }
      .li_dec {
        .dec_a {
          display: inline-block;
          width: 100%;
          margin-top: 5px;
          color: #000;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .li_cre {
        color: #aaa;
        .cre_a {
          color: #666;
        }
      }
      .dec_a,
      .cre_a {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .hot1_footer {
    height: 30px;
  }
}
</style>
