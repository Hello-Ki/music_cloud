<template>
  <div class="discover_container">
    <div class="bar"></div>
    <header class="discover_header">
      <el-menu v-model="activePath" :default-active="activePath" class="el-menu-demo" router mode="horizontal" background-color="#C20C0C" text-color="#ffffff" active-text-color="#ffffff">
        <el-menu-item :index="item.path" v-for="item in discoverNav" :key="item.index" :route="'/discover/'+item.path" background-color="#C20C0C">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </header>
    <main class="discover_main">
      <router-view></router-view>
    </main>
  </div>
</template>
<script>
export default {
  name: 'Discover',
  data () {
    return {
      activePath: '',
      discoverNav: [
        {
          id: 1,
          name: '推荐',
          path: ''
        },
        {
          id: 2,
          name: '排行榜',
          path: 'toplist'
        },
        {
          id: 3,
          name: '歌单',
          path: 'playlist'
        },
        {
          id: 4,
          name: '主播电台',
          path: 'djradio'
        },
        {
          id: 5,
          name: '歌手',
          path: 'artists'
        },
        {
          id: 6,
          name: '新碟上架',
          path: 'album'
        }
      ]
    }
  },
  created() {
    // this.$router.push({ name: 'recommend' })
  },
  methods: {
    // saveNavState (path) {
    //   window.sessionStorage.setItem('activePath', path)
    //   this.activePath = path
    //   console.log(this.activePath)
    // }
  }
}
</script>

<style lang="less" scoped>
.discover_container {
  width: 100%;
}
.bar {
  position: absolute;
  left: 300px;
  top: -12px;
  width: 0px;
  height: 0px;
  border: 6px solid transparent;
  border-bottom-color: #c20c0c;
}
.discover_header {
  height: 34px;
  width: 100%;
  padding-left: 180px;
  box-sizing: border-box;
  background-color: #c20c0c;
  .el-menu {
    height: 34px;
    width: 744px;
    margin: 0 81.5px;
    border: none;
    .el-menu-item {
      height: 34px;
      padding: 0 30px;
      span {
        display: block;
        width: 100%;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
      }
    }
  }
}
.discover_main {
  height: 100%;
  width: 980px;
  margin: 0 auto;
  background-color: #f5f5f5;
}
</style>
