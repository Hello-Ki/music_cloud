<template>
  <div class="detail_container">{{ $route.params.id }}</div>
</template>

<script>
export default {
  name: 'AlbumDetail',
  created() {
    this.id = this.$route.query.id
    this.getAlbumDetail()
  },
  data() {
    return {
      id: '',
    }
  },
  methods: {
    async getAlbumDetail() {
      const res = await this.$http.get(`/album/detail?id=${this.id}`)
      console.log(res)
    },
  },
}
</script>

<style lang="less" scoped></style>
