<template>
  <div class="fl ac search-container">
    <van-icon class="back" name="arrow-left" size="20px" @click="$emit('backBtn')" />
    <van-search
      v-model="searchVal"
      class="search-input"
      :placeholder="$t('search.placeholder')"
      show-action
      shape="round"
      @search="onSearch"
      @input="autoSearch"
      id="searchBox"
    >
      <div slot="action" @click="onSearch">{{ $t('search.btn') }}</div>
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
    mounted() {
      document.getElementById('searchBox').focus();
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
      const name = this.$route.name
      this.$router.push({
        name: name === 'search/shop' || name === 'search/user' ? name : 'search',
        query: {
          q: this.searchVal.trim()
        }
      })
    },
    autoSearch() {
      this._.debounce(() => {
        if (!this.searchVal.trim()) return;
        this.search();
      }, 1000)();
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
