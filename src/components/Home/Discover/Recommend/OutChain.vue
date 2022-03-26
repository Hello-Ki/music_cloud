<template>
  <div class="out_chain_container">
    <div class="banner">
      <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width="330" height="86" :src="'//music.163.com/outchain/player?type='+type+'&amp;id='+id+'&amp;auto=1&amp;height=66&amp;bg=e8e8e8'"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OutChain',
  data() {
    return {
      type: '',
      id: ''
    }
  },
  created() {
    this.type = this.$route.params.type
    this.id = this.$route.params.id
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.out_chain_container {
  .banner {
    width: 400px;
    height: 300px;
    margin: 0 auto;
  }
}
</style>
