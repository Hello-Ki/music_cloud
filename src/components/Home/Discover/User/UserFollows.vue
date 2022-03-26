<template>
  <div class="user_follows_container">
    <div class="main">
      <div class="header">
        <span>关注</span>
        <span class="count">({{userFollows.touchCount}})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFollows',
  data() {
    return {
      id: '',
      userFollows: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUserFollows()
  },
  methods: {
    async getUserFollows() {
      const { data: { code, ...userFollows } } = await this.$http.get(`/user/follows?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户关注数据失败!')
      this.userFollows = userFollows
    }
  }
}
</script>

<style lang="less" scoped>
.user_follows_container {
  width: 100%;
  .main {
    .header {
      width: 100%;
      height: 35px;
      font-size: 20px;
      color: #666;
      border-bottom: 2px solid #c20c0c;
      box-sizing: border-box;
      .count {
        margin-left: 10px;
      }
    }
  }
}
</style>
