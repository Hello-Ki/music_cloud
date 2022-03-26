<template>
  <div class="dj_rank_container">
    <div class="header">
      <span class="title">节目排行榜</span>
      <span class="h1">最近更新:&nbsp;{{updateTime | publishTime}}</span>
    </div>
    <el-table :data="topLists" style="width: 100%" header-align="center" :show-header="false" stripe>
      <el-table-column prop="index" width="50">
        <template v-slot:={row}>
          <div class="rank">
            <span class="i1" :class="{i1_1: row.index < 3}">{{indexMethod(row.index)}}</span>
            <span class="i2">
              <i :class="{icon1: row.num === 0, icon2: row.num > 0, icon3: row.num < 0, icon4: row.lastRank === -1}"></i>
              <span :class="{s1: row.num === 0, s2: row.num > 0, s3: row.num < 0, s4: row.lastRank === -1}">{{Math.abs(row.num)}}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="program.name" label="内容" width="368">
        <template v-slot:="{ row }">
          <div class="cell_box" @mouseenter="enter(row.program.id )" @mouseleave="leave">
            <span class="cover">
              <span class="mask" :class="{mask1: row.isShow}"></span>
              <img :src="row.program.coverUrl">
            </span>
            <a class="name" @click="$router.push({ name: 'program', params: { id: row.program.id } })">{{ row.program.name }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="program.radio.name" label="名称" width="180">
        <template v-slot:={row}>
          <a class="dj" @click="$router.push({name: 'djdetail', params: {id: row.program.radio.id}})">{{row.program.radio.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="program.radio.category" label="标签" width="140">
        <template v-slot:={row}>
          <a class="tag" @click="$router.push({name: 'category', params: {id: row.program.categoryId}})">{{row.program.radio.category}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="160">
        <template v-slot:={row}>
          <div class="box">
            <span class="score" :style="{width: calWidth(row.score)}"></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination hide-on-single-page background layout="prev, pager, next" :page-size="pageInfo.pagesize" :total="total" @current-change="handleCurrentChange"></el-pagination> -->
  </div>
</template>

<script>
export default {
  name: 'Djrank',
  data() {
    return {
      updateTime: '',
      maxScore: 1,
      topLists: []
    }
  },
  created() {
    this.getTopLists()
  },
  methods: {
    async getTopLists() {
      const { data: { code, toplist, updateTime } } = await this.$http.get('/dj/program/toplist')
      if (code !== 200) return this.$message('获取节目列表数据失败!')
      this.updateTime = updateTime
      const list = toplist
      this.topLists = list.reduce((pre, cur, index) => {
        cur.isShow = false
        cur.index = index + 1
        cur.num = cur.rank - cur.lastRank
        pre.push(cur)
        return pre
      }, [])
      this.maxScore = this.topLists[0].score
      console.log(this.topLists)
    },
    indexMethod(index) {
      if (index < 10) return '0' + index
      return index
    },
    enter(id) {
      this.topLists.map(item => {
        item.isShow = false
        if (item.program.id === id) {
          item.isShow = true
        }
      })
    },
    leave() {
      this.topLists.map(item => { item.isShow = false })
    },
    calWidth(score) {
      return Math.round(score / this.maxScore * 10000) / 100 + '%'
    }
  }
}
</script>

<style lang="less" scoped>
.dj_rank_container {
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
    .cover, a {
      cursor: pointer;
    }
    a {
      &:hover {
        text-decoration: underline;
      }
    }
    .cell {
      font-size: 12px;
      .rank {
        .i1, .i2 {
          display: block;
        }
        .i1 {
          color: #ccc;
          font-size: 16px;
        }
        .i1_1 {
          color: #da4545;
        }
        .i2 {
          .icon1, .icon2, .icon3, .icon4 {
            display: inline-block;
            vertical-align: middle;
            margin-right: 2px;
            background-image: url('../imgs/icon.png');
          }
          // num=0
          .icon1 {
            width: 5px;
            height: 2px;
            background-position: -74px -276px;
          }
          .icon2, .icon3 {
            width: 6px;
            height: 6px;
          }
          // num > 0
          .icon2 {
            background-position: -74px -304px;
          }
          // num < 0
          .icon3 {
            background-position: -74px -324px;
          }
          // new
          .icon4 {
            width: 16px;
            height: 5px;
            background-position: -67px -289px;
          }
          .s1 {
            color: #999;
          }
          .s2 {
            color: #ba2226;
          }
          .s3 {
            color: #4abbeb;
          }
          .s4 {
            display: none;
          }
        }
      }
      .cell_box {
        .cover, .name {
          display: inline-block;
          vertical-align: middle;
        }
        .cover {
          position: relative;
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            height: 100%;
          }
          .mask {
            display: none;
          }
          .mask1 {
            display: block;
            position: absolute;
            top: 28%;
            left: 28%;
            width: 20px;
            height: 20px;
            background: url('../imgs/iconall.png') -1px -86px;
          }
        }
        .name {
          margin-left: 10px;
          width: 298px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .dj {
        color: #666;
      }
      .tag {
        padding: 0 6px;
        color: #999;
        border: 1px solid #ccc;
        &:hover {
          color: #666;
          border-color: #666;
          text-decoration: none;
        }
      }
      .box {
        width: 128px;
        height: 10px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #ddd;
        .score {
          display: block;
          height: 100%;
          border-radius: 10px;
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
