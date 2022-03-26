<template>
  <div class="artists_container">
    <el-container>
      <el-aside style="width: 200px">
        <el-menu :default-active="activePath" @select="changeActivePath" active-text-color="#c20c0c" route>
          <el-submenu index="1">
            <template slot="title">
              <span>推荐</span>
            </template>
            <el-menu-item index="">推荐歌手</el-menu-item>
            <el-menu-item index="signed">入驻歌手</el-menu-item>
          </el-submenu>
          <template>
            <el-submenu :index="item.id+''" v-for="(item, index) in areas" :key="index">
              <template slot="title">
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="getArtistPath(index+1, index1+1)" v-for="(item1, index1) in types" :key="index1">{{item.name}}{{item1.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view :type="activeType" :area="activeArea" :cateName="activeName"></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'Artists',
  data() {
    return {
      types: [
        { name: '男歌手', id: 1 },
        { name: '女歌手', id: 2 },
        { name: '组合/乐队', id: 3 }
      ],
      areas: [
        { name: '华语', id: 7 },
        { name: '欧美', id: 96 },
        { name: '日本', id: 8 },
        { name: '韩国', id: 16 },
        { name: '其它', id: 0 },
      ],
      activeType: '',
      activeArea: '',
      activeName: '',
      activePath: '',
    }
  },
  created() {
    this.$router.push({ path: '/discover/artists/' + this.activePath })
  },
  methods: {
    findKey(value, obj) {
      return obj.find(item => item.id + '' === value).name
    },
    getArtistPath(path1, path2) {
      return `cat?id=${path1 + '00' + path2}`
    },
    changeActivePath(key, keyPath) {
      const res = key.search(/cat\?id/)
      if (res !== -1) {
        this.activeArea = keyPath[0]
        this.activeType = keyPath[1].slice(-1)
        this.activeName = this.findKey(this.activeArea, this.areas) + this.findKey(this.activeType, this.types)
      }
      this.$router.push({ path: '/discover/artists/' + key })
    },
  }
}
</script>

<style lang="less" scoped>
.artists_container {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  .el-container {
    /deep/.el-aside {
      height: 100%;
      background-color: #f9f9f9;
      .el-menu {
        padding-top: 40px;
        .el-submenu {
          .el-submenu__title {
            font-size: 16px;
            font-weight: bolder;
          }
          .el-menu-item {
            font-size: 12px;
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
    .el-main {
      padding: 40px;
      background-color: #fff;
    }
  }
}
</style>
