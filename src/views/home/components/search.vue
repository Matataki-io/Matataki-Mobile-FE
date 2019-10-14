<template>
  <div class="search" :class="showSearchStatus && 'show'">
    <search class="search-border" @backBtn="backBtn"></search>
    <h3 class="search-title">{{ $t('search.hot') }}</h3>
    <ul class="search-recommend">
      <li v-for="(item, index) in searchRecommendList" :key="index">
        <router-link :to="{ name: 'search', query: { q: item.word } }">{{ item.word }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import search from '@/components/search/index.vue'

export default {
  components: {
    search
  },
  props: {
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchRecommendList: [],
      showSearchStatus: this.showSearch
    }
  },
  watch: {
    showSearch(newVal) {
      this.showSearchStatus = this.showSearch
      // if (newVal) {
      //   document.querySelector('body').style.overflow = 'hidden'
      // } else {
      //   document.querySelector('body').style.overflow = ''
      // }
    }
  },
  beforeDestroy() {
    // document.querySelector('body').style.overflow = ''
  },
  mounted() {
    this.getRecommend()
  },
  methods: {
    onSearch(val) {
      // console.log(val)
    },
    // 获得推荐
    async getRecommend() {
      await this.$backendAPI
        .searchRecommend({ area: 1 })
        .then(res => {
          if (res.status === 200 && res.data.code === 0) this.searchRecommendList = res.data.data
          else console.log(this.$t('error.getSearchRecommend'))
        })
        .catch(err => {
          console.log(this.$t('error.getSearchRecommend'), err)
        })
    },
    backBtn() {
      this.showSearch = false
      this.$emit('showSearchStatus')
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 99;
  transform: translate(100%, 0);
  transition: transform 0.3s;
  &.show {
    transform: translate(0, 0);
  }
}
.search-border {
  border-bottom: 1px solid #eaeaea;
}
.search-title {
  font-size: 18px;
  margin: 10px 10px 0;
  letter-spacing: 0;
  color: #333;
}
.search-recommend {
  padding: 0;
  margin: 0;
  display: flex;
  li {
    min-width: 40px;
    text-align: center;
    background: #e6e6e6;
    border-radius: 20px;
    padding: 4px 10px;
    margin: 10px;
    a {
      font-size: 14px;
      color: #5a5a5a;
      cursor: pointer;
    }
  }
}
</style>
