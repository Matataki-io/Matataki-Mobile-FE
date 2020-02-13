<template>
  <div class="search">
    <van-sticky>
      <div :class="showShadow && 'shadow'">
        <search :search-query-val="searchQueryVal" @backBtn="$router.go(-1)"></search>
        <div class="type-tabs">
          <router-link v-for="(tag, index) in option1" :key="index" :to="{name: tag.name, query: {q: $route.query.q}}" :class="$route.name === tag.name && 'active'">
            {{ tag.text }}
            <span>
              {{ tag.numResults > 99 ? '99+' : tag.numResults }}
            </span>
          </router-link>
        </div>
      </div>
    </van-sticky>
    <BasePull
      :loading-text="$t('notContent')"
      :params="articleCardData.params"
      :api-url="articleCardData.apiUrl"
      :need-access-token="true"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListData"
    >
      <template v-if="option1[value1].value !== 2">
        <artcleCard v-for="item in articleCardData.articles" :key="item.id" :card="item" class="list-card" />
      </template>
      <template v-else>
        <searchUserList v-for="item in articleCardData.articles" :key="item.id" :card="item" />
      </template>
    </BasePull>
  </div>
</template>

<script>
import search from '@/components/search/index.vue'
import artcleCard from '@/components/article_card/index.vue'
import searchUserList from '@/components/search_user_list/index.vue'
import throttle from 'lodash/throttle'

export default {
  components: {
    search,
    artcleCard,
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
        { text: this.$t('search.optionText11'), value: 0, name: 'search', numResults: 1222 },
        { text: this.$t('search.optionText12'), value: 1, name: 'search/shop', numResults: 46 },
        { text: this.$t('search.optionText13'), value: 2, name: 'search/user', numResults: 7 },
        { text: this.$t('search.optionText14'), value: 2, name: 'search/user', numResults: 7 }
      ],
      articleCardData: {
        params: {},
        apiUrl: this.apiUrlPath,
        articles: [],
        isAtuoRequest: false
      },
      showShadow: false,
      scrollEvent: null
    }
  },
  created() {
    this.setMenu()
  },
  mounted() {
    this.query()
    this.scrollEvent = throttle(this.scrollTop, 300)
    window.addEventListener('scroll', this.scrollEvent)
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollEvent)
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
        if (!this.$route.query.q.trim()) return this.$toast(this.$t('warning.searchContent'))
        this.searchQueryVal = this.$route.query.q.trim()
      }

      const params = {
        pagesize: 20,
        word: this.searchQueryVal
      }

      this.articleCardData.params = Object.assign(params, this.params)

      // console.log(this.articleCardData.params)
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
      // console.log(res)
      this.articleCardData.articles = res.list
    },
    /** 滚动后展开按钮 */
    scrollTop() {
      try {
        const scroll = document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset
        this.showShadow = scroll > 50
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  background-color: #fff;
  height: 100%;
  // overflow: auto;
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
.shadow {
  box-shadow: 0 0 30px 0 rgba(0,0,0,.15);
  transition: all 600ms;
}
.type-tabs {
  display: flex;
  background-color: #fff;
  width: 100%;
  height: 44px;
  border-top: 1px solid #ebedf0;
  padding: 0 20px;
  align-items: center;
  a {
    color: rgba(178, 178, 178, 1);
    font-size: 16px;
    font-weight: 400;
    line-height: 40px;
    margin-right: 5px;
    flex: 1;
    max-width: 76px;
    &.active {
      color: #000;
      font-weight: 600;
    }
    span {
      display: inline-block;
      color: #B2B2B2;
      font-size:14px;
      font-weight:400;
      line-height:16px;
    }
  }
}

.list-card {
  padding: 0 20px;
  margin: 20px 0 0;
}
</style>
