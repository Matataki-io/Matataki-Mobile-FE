<template>
  <div class="search">
    <van-sticky>
      <search :search-query-val="searchQueryVal" @backBtn="$router.go(-1)"></search>
      <van-dropdown-menu active-color="#542de0">
        <van-dropdown-item v-model="value1" :options="option1" @change="menuChange" />
        <van-dropdown-item v-model="value2" disabled :options="option2" />
      </van-dropdown-menu>
    </van-sticky>
    <BasePull
      loading-text="暂无内容"
      :params="articleCardData.params"
      :api-url="articleCardData.apiUrl"
      :need-access-token="true"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListData"
    >
      <template v-if="option1[value1].value !== 2">
        <ArticleCard
          v-for="item in articleCardData.articles"
          :key="item.id"
          :now-index="option1[value1].value"
          :article="item"
          :is-search-card="true"
        />
      </template>
      <template v-else>
        <searchUserList v-for="item in articleCardData.articles" :key="item.id" :card="item" />
      </template>
    </BasePull>
  </div>
</template>

<script>
import search from '@/components/search/index.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import searchUserList from '@/components/search_user_list/index.vue'

export default {
  components: {
    search,
    ArticleCard,
    searchUserList
  },
  props: {
    params: {
      type: Object,
      required: true
    },
    apiUrlPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchQueryVal: '',
      value1: 0,
      value2: 0,
      option1: [
        { text: '文章', value: 0, name: 'search' },
        { text: '商品', value: 1, name: 'search/shop' },
        { text: '作者', value: 2, name: 'search/user' }
      ],
      option2: [{ text: '默认', value: 0 }],
      articleCardData: {
        params: {},
        apiUrl: this.apiUrlPath,
        articles: [],
        isAtuoRequest: false
      }
    }
  },
  created() {
    this.setMenu()
  },
  mounted() {
    this.query()
  },
  methods: {
    setMenu() {
      if (this.$route.name === 'search') this.value1 = 0
      else if (this.$route.name === 'search/shop') this.value1 = 1
      else if (this.$route.name === 'search/user') this.value1 = 2
      else this.value1 = 0
    },
    query() {
      if (this.$route.query.q) {
        if (!this.$route.query.q.trim()) return this.$toast('搜索内容不能为空')
        this.searchQueryVal = this.$route.query.q.trim()
      }

      const params = {
        pagesize: 20,
        word: this.searchQueryVal
      }

      this.articleCardData.params = Object.assign(params, this.params)

      console.log(this.articleCardData.params)
    },
    menuChange(val) {
      let name = this.option1[val].name
      // console.log(name)
      this.$router.replace({
        name: name,
        query: {
          q: this.searchQueryVal.trim()
        }
      })
    },
    getListData(res) {
      console.log(res)
      this.articleCardData.articles = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  background-color: #fff;
  height: 100%;
}
.search-container {
  padding: 0 10px;
}
.search-input {
  width: 100%;
}
.back {
  width: 20px;
}
</style>
