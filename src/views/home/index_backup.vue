<template>
  <div class="home mw">
    <bannerMatataki :class="!isShowSlide && 'margin'" />
    <!-- 首页头部 -->
    <home-head :now-index="nowIndex" @login="showSidebar = true" />

    <!-- 首页内容 -->
    <div class="home-content">
      <!-- 首页内容导航 -->
      <home-nav
        :nav-menu="content.navMenu"
        :active-index="content.activeIndex"
        @toggleNavMenu="toggleNavMenu"
      />

      <!-- 推荐内容 -->
      <homeSlide
        v-show="isShowSlide"
        :recommend="content.recommend"
        :slide-index="0"
        :now-index="nowIndex"
      />

      <!-- 标题 -->
      <div class="now-title" :class="!isShowSlide && 'nav-hide'">
        {{ contentTitle }}
        <Poptip class="filter" placement="bottom-end">
          <div class="filter-header">
            <img class="filter-icon" src="@/assets/img/filter.svg" />过滤
          </div>
          <div slot="content">
            <CheckboxGroup v-model="checkedFilter" @on-change="handleCheckedFilterChanged">
              <div style="margin-bottom: 8px"><Checkbox label="1" :disabled="checkedFilter.length === 1 && filter === 1"><span style="margin-left: 4px">免费</span></Checkbox></div>
              <div style="margin-bottom: 8px"><Checkbox label="2" :disabled="checkedFilter.length === 1 && filter === 2"><span style="margin-left: 4px">持票可见</span></Checkbox></div>
              <div><Checkbox label="4" :disabled="checkedFilter.length === 1 && filter === 4"><span style="margin-left: 4px">付费可见</span></Checkbox></div>
            </CheckboxGroup>
          </div>
      </Poptip>
      </div>

      <!-- 列表 -->
      <BasePull
        v-for="(itemList, indexList) in content.navMenu"
        v-show="content.activeIndex === indexList"
        :key="indexList"
        :params="itemList.params"
        :api-url="itemList.apiUrl"
        :active-index="content.activeIndex"
        :now-index="indexList"
        :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
        :auto-request-time="itemList.autoRequestTime"
        :need-access-token="true"
        @getListData="getListData"
      >
        <template v-if="!itemList.loading">
          <!-- 骨架占位 -->
          <ContentLoader
            v-for="itemLoader in [0, 1]"
            :key="itemLoader"
            :height="80"
            :speed="2"
            primary-color="#f3f3f3"
            secondary-color="#ecebeb"
          >
            <rect x="20" y="20" rx="4" ry="4" width="120" height="60" />
            <rect x="150" y="20" rx="0" ry="0" width="235" height="30" />
            <rect x="150" y="60" rx="0" ry="0" width="235" height="20" />
          </ContentLoader>
        </template>
        <template v-else>
          <ArticleCard
            v-for="itemArticle in itemList.articles"
            :key="itemArticle.id"
            :now-index="nowIndex"
            type="article"
            :article="itemArticle"
          />
        </template>
        <p
          v-if="itemList.articles.length === 0 && itemList.loading"
          style="font-size: 14px;
              text-align: center;
              margin-top: 20px;"
        >
          {{ $t('notContent') }}
        </p>
      </BasePull>
    </div>

    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
import homeHead from './components/homeHead.vue'
import homeNav from './components/homeNav.vue'
import homeSlide from './components/homeSlide.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import { ArticleCard } from '@/components/'
// import banner from '@/components/banner/index.vue'
import bannerMatataki from '@/components/banner/banner_matataki.vue'

import debounce from 'lodash/debounce'

export default {
  name: 'Home',
  components: {
    homeHead,
    homeNav,
    homeSlide,
    ArticleCard,
    ContentLoader,
    Sidebar,
    bannerMatataki
    // banner,
  },
  data() {
    return {
      showSidebar: false,
      nowIndex: 0,
      // 防止数据嵌套太多 把内容提取出来
      content: {
        navMenu: [
          {
            label: this.$t('home.articleNavHot'),
            title: this.$t('home.articleNavHotTitle'),
            params: {
              channel: 1
            },
            apiUrl: 'homeScoreRanking',
            articles: [],
            autoRequestTime: 0,
            loading: false
          },
          {
            label: this.$t('home.articleNavNow'),
            title: this.$t('home.articleNavNowTitle'),
            params: {
              channel: 1
            },
            apiUrl: 'homeTimeRanking',
            articles: [],
            autoRequestTime: 0,
            loading: false
          },
          {
            label: this.$t('home.articleNavFollow'),
            title: this.$t('home.articleNavFollowTitle'),
            params: {
              channel: 1
            },
            apiUrl: 'followedPosts',
            articles: [],
            autoRequestTime: 0,
            loading: false
          }
        ],
        activeIndex: 0,
        recommend: {
          title: this.$t('home.articleNavRecommend'),
          list: []
        }
      },
      checkedFilter: ['1', '2', '4']
    }
  },
  computed: {
    // 内容标题
    contentTitle() {
      const index = this.content.activeIndex
      return this.content.navMenu[index].title
    },
    // 是否显示推荐文章或者商品
    isShowSlide() {
      return this.content.activeIndex === 0
    },
    isHaveArticle() {
      const index = this.content.activeIndex
      const status = this.content.navMenu[index].articles.length
      // console.log(status)
      return status
    },
    filter() {
      let result = 0
      for (const item of this.checkedFilter) {
        result |= Number(item)
      }
      return result
    }
  },
  watch: {
    '$i18n.locale'() {
      // console.log(this.$i18n.locale)
      this.setContent()
    }
  },
  created() {
    this.initNav()
    this.postsRecommend(1)
    // this.postsRecommend(2)
  },
  mounted() {},
  methods: {
    initNav() {
      if (!this.$route.params) return
      if (this.$route.params.nav === 0) this.nowIndex = 0
      else if (this.$route.params.nav === 1) this.nowIndex = 1
      else this.nowIndex = 0
    },
    increaseTime(type, i) {
      // 如果自动刷新的时间为0 并且 内容长度为0 刷新一次组件
      if (type === 'headNav') {
        // head 的导航切换
        const index = this.content.activeIndex // 当前的聚焦索引
        const navMenuData = this.content.navMenu[index] // 当前聚焦索引的数据
        if (navMenuData.autoRequestTime === 0 && navMenuData.articles.length === 0)
          this.content.navMenu[index].autoRequestTime += Date.now()
      } else if (type === 'nemuNav') {
        // 内容的导航
        const navMenuData = this.content.navMenu[i] // 当前聚焦索引的数据
        if (navMenuData.autoRequestTime === 0 && navMenuData.articles.length === 0)
          this.content.navMenu[i].autoRequestTime += Date.now()
      }
    },
    toggleNavMenu(i) {
      this.content.navMenu[i].params = {
        channel: this.content.navMenu[i].params.channel,
        filter: this.filter
      }

      this.content.activeIndex = i
      this.increaseTime('nemuNav', i)
    },

    // 获取文章列表数据
    getListData(res) {
      // console.log(this.nowIndex, res.index);
      this.content.navMenu[res.index].loading = true
      this.content.navMenu[res.index].articles = res.list
    },
    // 获取推荐文章或者商品
    async postsRecommend(channel) {
      await this.$backendAPI
        .postsRecommend(channel)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.content.recommend.list = res.data.data
          } else console.log('获取推荐失败')
        })
        .catch(err => {
          console.log(err)
        })
    },
    setContent() {
      this.content.navMenu[0].label = this.$t('home.articleNavHot')
      this.content.navMenu[0].title = this.$t('home.articleNavHotTitle')

      this.content.navMenu[1].label = this.$t('home.articleNavNow')
      this.content.navMenu[1].title = this.$t('home.articleNavNowTitle')

      this.content.navMenu[2].label = this.$t('home.articleNavFollow')
      this.content.navMenu[2].title = this.$t('home.articleNavFollowTitle')

      this.content.recommend.title = this.$t('home.articleNavRecommend')
    },
    handleCheckedFilterChanged(value) {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(function () {
      let { params } = this.content.navMenu[this.content.activeIndex]

      // This wastes me a lot of time!!!

      this.content.navMenu[this.content.activeIndex].params = {
        channel: params.channel,
        filter: this.filter
      }
    }, 500)
  }
}
</script>

<style scoped lang="less" src="./index.less"></style>

<style lang="less" scoped>
.margin {
  margin-top: 60px;
}

.filter {
  float: right;

  &-header {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  &-icon {
    width: 24px;
    height: 24px;
    margin: 4px 4px 4px 0;
  }
}
</style>
