<template>
  <div class="download_container">
    <div class="bar"></div>
    <header class="download_header"></header>
  </div>
</template>

<script>
export default {
  name: 'Download'
}
</script>

<style lang="less" scoped>
.bar {
  position: absolute;
  top: -14px;
  left: 716px;
  width: 0px;
  height: 0px;
  border: 7px solid transparent;
  border-bottom-color: #C20C0C;
}
.download_header {
  background-color: #c20c0c;
  height: 5px;
}
</style>
