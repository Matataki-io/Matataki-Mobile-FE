<template>
  <div class="fl ac search-container">
    <van-icon
      class="back"
      name="arrow-left"
      size="20px"
      @click="$emit('backBtn')"
    />
    <van-search
      v-model="searchVal"
      class="search-input"
      :placeholder="$t('search.placeholder')"
      show-action
      shape="round"
      @search="onSearch"
    >
      <div
        slot="action"
        @click="onSearch"
      >
        {{ $t('search.btn') }}
      </div>
    </van-search>
  </div>
</template>

<script>
export default {
  props: {
    // 搜索内容
    searchQueryVal: {
      type: String,
      default: ''
    },
    searchType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchVal: this.searchQueryVal
    }
  },
  watch: {
    searchQueryVal(val) {
      this.searchVal = val
    }
  },
  methods: {
    onSearch() {
      if (!this.searchVal.trim()) return this.$toast(this.$t('warning.searchContent'))
      this.search()
    },
    search() {
      const names = ['sharehall', 'token']
      const type = names.indexOf(this.$route.name) + 1

      const query = {}
      if (this.searchType) query.type = this.searchType
      else if (type)  query.type = type
      query.q = this.searchVal.trim()

      this.$router[this.$route.name === 'search' ? 'replace' : 'push']({
        name: 'search',
        query
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding: 0 10px;
  background: #fff;
}
.search-input {
  width: 100%;
}
.back {
  width: 20px;
}
</style>
