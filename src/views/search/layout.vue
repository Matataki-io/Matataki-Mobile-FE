<template>
  <div class="search">
    <van-sticky>
      <div :class="showShadow && 'shadow'">
        <search :search-query-val="searchQueryVal" @backBtn="$router.go(-1)"></search>
        <div class="type-tabs">
          <p v-for="(tag, index) in tagList" :key="index" @click="toggleType(index)" :class="searchType === index && 'active'">
            {{ tag }}
            <span>
              {{ articleCardData[index].count > 99 ? '99+' : articleCardData[index].count }}
            </span>
          </p>
        </div>
      </div>
    </van-sticky>
    <BasePull
      :loading-text="$t('notContent')"
      :params="articleCardData[searchType].params"
      :api-url="articleCardData[searchType].apiUrl"
      :need-access-token="true"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListData"
    >
      <template v-if="searchType === 0">
        <artcleCard v-for="item in articleCardData[0].articles" :key="item.id" :card="item" class="list-card" />
      </template>
      <template v-else-if="searchType === 1">
        <artcleCard v-for="item in articleCardData[1].articles" :key="item.id" :card="item" class="list-card" />
      </template>
      <template v-else-if="searchType === 2">
        <artcleCard v-for="item in articleCardData[2].articles" :key="item.id" :card="item" class="list-card" />
      </template>
      <template v-else-if="searchType === 3">
        <searchUserList v-for="item in articleCardData[3].articles" :key="item.id" :card="item" />
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
      tagList: [
        this.$t('search.optionText11'),
        this.$t('search.optionText12'),
        this.$t('search.optionText13'),
        this.$t('search.optionText14')
      ],
      articleCardData: [
        {
          params: {
            channel: 1,
            type: 'post'
          },
          apiUrl: 'searchArticleList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        },
        {
          params: {},
          apiUrl: 'searchShareList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        },
        {
          params: {},
          apiUrl: 'searchTokenList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        },
        {
          params: {},
          apiUrl: 'searchUserList',
          articles: [],
          count: 0,
          isAtuoRequest: false
        }
      ],
      showShadow: false,
      scrollEvent: null,
      searchType: Number(this.$route.query.type) || 0
    }
  },
  created() {
    this.setMenu()
    this.query()
    console.log('我被重新调用了！')
  },
  mounted() {
    this.getOtherResults()
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

      this.articleCardData[this.searchType].params = Object.assign(params, this.articleCardData[this.searchType].params)

      // console.log(this.articleCardData.params)
    },
    // menuChange(val) {
    //   let name = this.option1[val].name
    //   // console.log(name)
    //   this.$router.replace({
    //     name: name,
    //     query: {
    //       q: this.searchQueryVal.trim()
    //     }
    //   })
    // },

    /** 切换搜索条目 */
    toggleType(type) {
      this.searchType = type

      let { origin } = window.location
      const url = `${origin}/search?type=${type}&q=${this.searchQueryVal.trim()}`
      history.replaceState({}, '', url)

    },
    getListData(res) {
      console.log(res)
      this.articleCardData[this.searchType].articles = res.list
      this.articleCardData[this.searchType].count = res.data.data.count || 0
    },
    /** 监听滚动状态（用于显示阴影） */
    scrollTop() {
      try {
        const scroll = document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset
        this.showShadow = scroll > 50
      } catch (error) {
        console.log(error)
      }
    },
    getOtherResults() {
      const otherRoutings = this.articleCardData.filter((value, index) => index !== this.searchType)
      for (let i = 0; i < otherRoutings.length; i++) {
        this.getSearchDate(otherRoutings[i])
      }
    },
    async getSearchDate(otherRouting) {
      otherRouting.params.page = 1
      otherRouting.params.pagesize = 9
      otherRouting.params.word = this.searchQueryVal
      const getDataFail = message => message ? console.error(message) : console.error('获取数据失败')

      // 获取数据
      try {
        const res = await this.$API.getBackendData({ url: otherRouting.apiUrl, params: otherRouting.params }, false)
        // console.log('结果：', otherRouting.apiUrl, res)
        if (res.code === 0) {
          otherRouting.articles = res.data.list
          otherRouting.count = res.data.count
        } else getDataFail(res.message)
      } catch (error) { getDataFail() }
    },
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
  p {
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
