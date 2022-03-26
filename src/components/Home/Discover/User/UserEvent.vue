<template>
  <div class="user_event_container">
    <div class="main">
      <div class="header">
        <span>TA的动态</span>
        <span class="count">({{userEvents.size}})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserEvent',
  data() {
    return {
      id: '',
      userEvents: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUserEvents()
  },
  methods: {
    // 获取用户动态信息
    async getUserEvents() {
      const { data: { code, ...userEvents } } = await this.$http.get(`/user/event?uid=${this.id}`)
      if (code !== 200) return this.$message.info('获取用户动态失败!')
      this.userEvents = userEvents
    }
  }
}
</script>

<style lang="less" scoped>
.user_event_container {
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
