<template>
  <div class="fl ac search-container">
    <van-icon class="back" name="arrow-left" size="20px" @click="$emit('backBtn')" />
    <van-search
      v-model="searchVal"
      class="search-input"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
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
      if (!this.searchVal.trim()) return this.$toast('搜索内容不能为空')
      this.search()
    },
    search() {
      const name = this.$route.name
      this.$router.push({
        name: name === 'search/shop' || name === 'search/user' ? name : 'search',
        query: {
          q: this.searchVal.trim()
        }
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
