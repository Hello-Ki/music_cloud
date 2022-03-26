.<template>
  <div class="mv_detail_container">
    {{id}}
  </div>
</template>

<script>
export default {
  name: 'MvDetail',
  data() {
    return {
      id: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getMvDetail()
  },
  methods: {
    async getMvDetail() {
      const res = await this.$http.get(`/artist/mv?mvid=${this.id}`)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
