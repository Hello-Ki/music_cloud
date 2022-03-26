<template>
  <div class="artist4_container">
    <ul class="describe">
      <li :class="{'li1': id === 0}" v-for="(item, id) in artistIntro" :key="item.index">
        <i :class="{'li1_i': id === 0}"></i>
        <h2 class="d_h">{{item.ti}}</h2>
        <p class="d_p">{{item.txt}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Artist4',
  props: ['artist'],
  created() {
    this.id = this.$route.query.id
    this.getArtistDesc()
  },
  watch: {
    artist(val) {
      console.log(val)
    },
  },
  data() {
    return {
      id: '',
      artistIntro: [],
    }
  },
  methods: {
    async getArtistDesc() {
      const {
        data: { code, briefDesc, introduction },
      } = await this.$http.get(`/artist/desc?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取歌手简介数据失败!')
      this.artistIntro = introduction.filter(item => item.ti !== '')
      const res = {}
      res.ti = this.artist.name + '简介'
      res.txt = briefDesc
      this.artistIntro.unshift(res)
      // console.log(this.artistIntro)
      // const res = await this.$http.get(`/artist/desc?id=${this.id}`)
      // console.log(res)
    },
  },
}
</script>

<style lang="less" scoped>
.artist4_container {
  .describe {
    li {
      list-style: none;
      .d_h {
        margin-bottom: 8px;
        font-size: 14px;
      }
      .d_p {
        color: #666;
        font-size: 12px;
        line-height: 25px;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
    .li1 {
      .li1_i {
        display: inline-block;
        vertical-align: middle;
        width: 3px;
        height: 15.5px;
        line-height: 14px;
        background-color: #c10d0c;
        margin-right: 7px;
      }
      .d_h {
        display: inline-block;
      }
      .d_p {
        text-indent: 2em;
      }
    }
  }
}
</style>
