<template>
  <div class="dj_recommend_container">
    <div class="header">
      <span class="title">推荐节目</span>
      <span class="h1">({{}})</span>
    </div>
    <el-table :data="recommendPrograms" style="width: 100%" header-align="center" :show-header="false" stripe>
      <el-table-column prop="name" label="内容" width="400">
        <template v-slot:="{ row }">
          <div class="cell_box" @mouseenter="enter(row.id)" @mouseleave="leave">
            <div class="cover">
              <img :src="row.coverUrl">
              <i class="play" :class="{ play1: row.isPlay }" @click="checkPlay(row.id)"></i>
            </div>
            <a class="name" @click="$router.push({ name: 'program', params: { id: row.id } })">{{ row.name }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="dj" label="品牌" width="166">
        <template v-slot:={row}>
          <a class="brand" @click="$router.push({name: 'djdetail', params: {id: row.dj.userId}})">{{row.dj.brand}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="listenerCount" label="播放量" width="90">
        <template v-slot:={row}>
          <span>播放{{row.listenerCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="likedCount" label="点赞数" width="126">
        <template v-slot:={row}>
          <span>赞{{row.likedCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="radio" label="标签类别" width="115">
        <template v-slot:={row}>
          <a class="cate" @click="$router.push({name: 'category', params: {id: row.radio.categoryId}})">{{row.radio.category}}</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination hide-on-single-page background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination> -->
  </div>
</template>

<script>
export default {
  name: 'Djrecommend',
  data() {
    return {
      more: true,
      recommendPrograms: [],
    }
  },
  created() {
    this.getRecommendPrograms()
  },
  methods: {
    async getRecommendProgramData() {
      const { data: { code, ...programData } } = await this.$http.get('/program/recommend')
      if (code !== 200) return this.$message.info('获取推荐节目数据失败!')
      console.log(programData, 111)
      return programData
    },
    async getRecommendPrograms() {
      while (this.more) {
        const { more, programs } = await this.getRecommendProgramData()
        console.log(more, programs)
        this.more = more
        this.recommendPrograms = programs.reduce((pre, cur) => {
          cur.isPlay = false
          pre.push(cur)
          return pre
        }, [])
      }
      console.log(this.recommendPrograms, 222)
    },
    enter(id) {
      this.recommendPrograms.map(item => {
        item.isPlay = false
        if (item.id === id) {
          item.isPlay = true
        }
      })
    },
    leave() {
      this.recommendPrograms.map(item => {
        item.isPlay = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dj_recommend_container {
  height: 100%;
  padding: 40px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  color: #999;
  font-size: 12px;
  .header {
    width: 100%;
    height: 42px;
    line-height: 42px;
    border-bottom: 2px solid #c20c0c;
    .title {
      line-height: 42px;
      color: #333;
      font-size: 24px;
    }
    .h1 {
      margin: 13px 0 0 10px;
    }
  }
  /deep/.el-table {
    .cell {
      font-size: 12px;
      color: #999;
      a, img {
        cursor: pointer;
      }
      a {
        font-size: 12px;
        &:hover {
          text-decoration: underline;
        }
      }
      .cell_box {
        .cover, .name {
          display: inline-block;
          vertical-align: middle;
        }
        .cover {
          position: relative;
          img {
            width: 40px;
            height: 40px;
          }
          .play {
            display: none;
            position: absolute;
            top: 30%;
            left: 30%;
            // transform: translate(-50% -50%);
            width: 17px;
            height: 17px;
            background: url('../imgs/iconall.png') 0 -60px;
          }
          .play1 {
            display: block;
          }
        }
        .name {
          margin-left: 10px;
          width: 304px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .brand {
        display: block;
        width: 166px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .cate {
        display: block;
        width: 62px;
        height: 18px;
        line-height: 18px;
        padding: 0 6px;
        border: 1px solid #ccc;
        text-align: center;
        &:hover {
          text-decoration: none;
          color: #666;
          border-color: #666;
        }
      }
    }
  }
}
</style>
