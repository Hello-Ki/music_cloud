<template>
  <div class="user_fans_container">
    <div class="main">
      <div class="header">
        <span>关注</span>
        <span class="count">({{userFans.size}})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFans',
  data() {
    return {
      id: '',
      userFans: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUserFansData()
  },
  methods: {
    async getUserFansData() {
      const { data: { code, ...userFans } } = await this.$http.get(`/user/followeds?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户粉丝数据失败!')
      this.userFans = userFans
      console.log(this.userFans)
    }
  }
}
</script>

<style lang="less" scoped>
.user_fans_container {
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
