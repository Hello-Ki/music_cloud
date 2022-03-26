<template>
  <div class="my_container">
    <div class="bar"></div>
    <header class="my_header"></header>
  </div>
</template>

<script>
export default {
  name: 'My'
}
</script>

<style lang="less" scoped>
.bar {
  position: absolute;
  top: -14px;
  left: 396px;
  width: 0px;
  height: 0px;
  border: 7px solid transparent;
  border-bottom-color: #C20C0C;
}
.my_header {
  background-color: #c20c0c;
  height: 5px;
}
</style>
