<template>
  <div class="enter">
    <h1 class="enter_title">欢迎来到 网易云音乐</h1>
    <el-button class="enter_btn" type="info" round @click="enter">点击进入</el-button>
  </div>
</template>

<script>
export default {
  name: 'Enter',
  created() {
    document.title = '欢迎来到网易云音乐!'
  },
  methods: {
    enter () {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.enter {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: darkred;
}
.enter_title {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #e5e5e5;
  transform: translateY(-100px);
}
.enter_btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>
