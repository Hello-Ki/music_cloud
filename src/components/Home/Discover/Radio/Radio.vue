<template>
  <div class="radio_container">
    <div class="box">
      <div class="box_left">
        <div class="header">
          <span class="title">推荐节目</span>
          <a @click="$router.push({name: 'djRecommend'})">更多></a>
        </div>
        <ul class="program">
          <li v-for="item in recommendPrograms" :key="item.index">
            <img class="li_l" :src="item.coverUrl" alt="">
            <div class="li_r">
              <a class="des" @click="$router.push({name: 'program', params: {id: item.id}})">{{item.name}}</a>
              <p class="cre" @click="$router.push({name: 'djdetail', params: {id: item.radio.id}})">{{item.radio.name}}</p>
            </div>
            <a class="tag" href="">{{item.radio.category}}</a>
          </li>
        </ul>
      </div>
      <div class="box_right">
        <div class="header">
          <span class="title">节目排行榜</span>
          <a @click="$router.push({name: 'djRank'})">更多></a>
        </div>
        <ul class="program">
          <li v-for="item in topLists" :key="item.index">
            <div class="b1">
            <span class="i1" :class="{i1_1: item.index < 3}">{{indexMethod(item.index)}}</span>
            <span class="i2">
              <i :class="{icon1: item.num === 0, icon2: item.num > 0, icon3: item.num < 0, icon4: item.lastRank === -1}"></i>
              <span :class="{s1: item.num === 0, s2: item.num > 0, s3: item.num < 0, s4: item.lastRank === -1}">{{Math.abs(item.num)}}</span>
            </span>
          </div>
            <div class="b2" @mouseenter="enter(item.program.id )" @mouseleave="leave">
              <div class="cover">
                <span class="mask" :class="{mask1: item.isShow}"></span>
                <img :src="item.program.coverUrl">
              </div>
              <div class="des">
                <a class="name" @click="$router.push({ name: 'program', params: { id: item.program.id } })">{{ item.program.name }}</a>
                <a class="dj" @click="$router.push({name: 'djdetail', params: {id: item.program.radio.id}})">{{item.program.radio.name}}</a>
              </div>
            </div>
            <div class="b3">
              <span class="score" :style="{width: calWidth(item.score)}"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  data() {
    return {
      recommendPrograms: [],
      maxScore: 1,
      topLists: [],
      excludeHotRadios: [],
    }
  },
  created() {
    this.getRecommendProgram()
    this.getTopLists()
    // this.getExcludeHotRadios()
  },
  methods: {
    // 获取推荐节目
    async getRecommendProgram() {
      const { data: { code, programs } } = await this.$http.get('/program/recommend')
      if (code !== 200) return this.$message.info('获取推荐节目数据失败!')
      const lists = programs
      this.recommendPrograms = lists.reduce((pre, cur, index) => {
        cur.isShow = false
        cur.index = index + 1
        cur.num = cur.rank - cur.lastRank
        pre.push(cur)
        return pre
      }, [])
      this.maxScore = this.recommendPrograms[0].score
      // console.log(this.recommendPrograms)
    },
    // 获取节目排行榜
    async getTopLists() {
      const { data: { code, toplist, updateTime } } = await this.$http.get('/dj/program/toplist?limit=10')
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
      // console.log(this.topLists)
    },
    // 获取非热门类型电台
    async getExcludeHotRadios() {
      const res = await this.$http.get('/dj/category/excludehot')
      console.log(res)
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
.radio_container {
  width: 100%;
  a {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .box {
    display: flex;
    flex-direction: item;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .box_left, .box_right {
      width: 426px;
      font-size: 12px;
      color: #999;
      .header {
        display: block;
        width: 100%;
        height: 42px;
        line-height: 42px;
        border-bottom: 2px solid #c20c0c;
        .title {
          color: #333;
          font-size: 24px;
        }
        a {
          float: right;
        }
      }
      .program {
        width: 100%;
        border: 1px solid #ddd;
        border-top: none;
        box-sizing: border-box;
        li {
          list-style: none;
          padding: 10px 0 10px 20px;
          .li_l, .li_r, .tag {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
          }
          .li_l {
            width: 40px;
            height: 40px;
          }
          .li_r {
            margin-left: 10px;
            .des, .cre {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .des, .cre {
              &:hover {
                text-decoration: underline;
              }
            }
            .des {
              margin: 5px 0;
              display: block;
              width: 228px;
              color: #333;
            }
            .cre {
              width: 254px;
            }
          }
          .tag {
            width: 60px;
            height: 16px;
            color: #ccc;
            text-align: center;
            border: 1px solid #999;
            &:hover {
              color: #bbb;
              border-color: #666;
              text-decoration: none;
            }
          }
          &:hover {
            background-color: rgba(240, 240, 240, .6);
          }
          .b1, .b2, .b3 {
            display: inline-block;
            vertical-align: middle;
            height: 100%;
          }
          .b1 {
            width: 30px;
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
          .b2 {
            width: 248px;
            .cover, .des {
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
                cursor: pointer;
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
            .des {
              margin-left: 10px;
              width: 198px;
              .name, .dj {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .name {
                margin-bottom: 10px;
                color: #333;
              }
            }
          }
          .b3 {
            width: 108px;
            height: 8px;
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
  }
}
</style>
