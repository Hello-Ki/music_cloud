<template>
  <div class="friend_container">
    <div class="bar"></div>
    <header class="friend_header"></header>
  </div>
</template>

<script>
export default {
  name: 'Friend'
}
</script>

<style lang="less" scoped>
.bar {
  position: absolute;
  top: -14px;
  left: 476px;
  width: 0px;
  height: 0px;
  border: 7px solid transparent;
  border-bottom-color: #C20C0C;
}
.friend_header {
  background-color: #c20c0c;
  height: 5px;
}
</style>
