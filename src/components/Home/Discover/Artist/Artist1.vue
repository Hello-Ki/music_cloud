<template>
  <div class="artist1_container">
    <div class="header">
      <el-button-group>
        <el-button type="primary" icon="el-icon-video-play">播放</el-button>
        <el-button type="primary" icon="el-icon-plus"></el-button>
      </el-button-group>
      <el-button icon="el-icon-folder-add">收藏热门{{hotSongs.length}}</el-button>
      <el-select v-model="value" placeholder="请选择" :automatic-dropdown="true">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled">
        </el-option>
      </el-select>
    </div>
    <el-table :data="hotSongs" stripe style="width: 100%" :show-header="false">
      <el-table-column
        type="index"
        width="92">
      </el-table-column>
      <el-table-column
        prop="name"
        label="标题"
        width="309">
        <template v-slot:={row}>
          <i class="el-icon-video-play"></i>
          <a style="margin-left: 10px">{{ row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="dt"
        label="时长"
        width="89">
        <template v-slot:={row}>
          <span>{{row.dt | songTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="al"
        label="歌手"
        width="148">
        <template v-slot:={row}>
          <a @click="$router.push({name: 'albumDetail', params: {id: row.al.id}})">{{row.al.name}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Artist1',
  created() {
    this.id = this.$route.query.id
    this.getHotSongs()
  },
  data() {
    return {
      id: '',
      hotSongs: [],
      options: [
        {
          value: '选项一',
          label: '热门单曲',
          disabled: false
        },
        {
          value: '选项二',
          label: '作词作品',
          disabled: true
        },
        {
          value: '选项三',
          label: '作曲作品',
          disabled: true
        }
      ],
      value: '选项一'
    }
  },
  methods: {
    async getHotSongs() {
      const loading = this.$loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.3)',
      })
      const { data: { code, songs } } = await this.$http.get(`/artist/top/song?id=${this.id}`)
      if (code !== 200) return this.$message.info('获取热门歌曲列表失败!')
      this.hotSongs = songs
      // console.log(this.hotSongs)
      setTimeout(() => {
        loading.close()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.artist1_container {
  .header {
    margin: 20px 0 10px;
    .el-button-group {
      margin-right: 10px;
    }
    /deep/.el-button {
      font-size: 12px;
      line-height: 31px;
      padding: 0 4px;
    }
    /deep/.el-select {
      float: right;
      padding: 3px;
      .el-input {
        font-size: 12px;
      }
      .el-input__inner {
        width: 100px;
        height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  /deep/.el-table {
    tr {
      height: 30px;
      .cell {
        color: #666;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        a {
          cursor: pointer;
          color: #333;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .el-table__cell {
        padding: 3px 10px;
        font-size: 12px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
