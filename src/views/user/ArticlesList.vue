<template>
  <div>
    <!-- tabs.less -->
    <div class="tabs">
      <div
        v-for="(item, index) in tabsData"
        :key="index"
        class="tabs-item"
        :class="activeIndex === index && 'active'"
        @click="toggleTabs(index)"
      >
        {{ item.label }}
      </div>
    </div>
    <BasePull
      v-for="(item, index) in tabsData"
      v-show="activeIndex === index"
      :key="index"
      :params="item.params"
      :api-url="item.apiUrl"
      :need-access-token="needAccessToken"
      :active-index="activeIndex"
      :now-index="index"
      :auto-request-time="item.autoRequestTime"
      :loading-text="item.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :show-no-more-icon="listtype !== 'others'"
      @getListData="getListDataTab"
    >
      <!-- 暂时处理  by xiaotian -->
      <!-- 下次功能调整重构 -->
      <template v-if="listtype === 'bookmark' && activeIndex === 1">
        <router-link
          v-for="(itemChild, indexChild) in item.articles"
          :key="indexChild"
          class="card-bookmark"
          :to="{name: 'share-id', params: {id: itemChild.id}}"
        >
          <p>{{ itemChild.short_content }}</p>
          <div>
            <span>
              <svg-icon
                class="icon"
                icon-class="eye"
              />{{ itemChild.read }}
            </span>
            <span>
              <svg-icon
                class="icon"
                icon-class="like_thin"
              />{{ itemChild.likes }}
            </span>
          </div>
        </router-link>
      </template>
      <div
        v-else
        class="list"
      >
        <artcleCard
          v-for="itemChild in item.articles"
          :key="itemChild.id"
          class="list-card"
          :card="itemChild"
        />
      </div>
    </BasePull>
  </div>
</template>

<script>
import artcleCard from '@/components/article_card/index.vue'

export default {
  name: 'ArticlesList',
  components: {
    artcleCard
  },
  props: {
    listtype: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    isOtherUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabsData: [],
      activeIndex: 0,
      needAccessToken: false
    }
  },
  computed: {},
  created() {
    const { id, listtype } = this
    if (listtype === 'others') {
      this.tabsData = [
        {
          label: this.$t('user.original'),
          params: { author: id },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: this.$t('notOriginal'),
          autoRequestTime: 0
        },
        {
          label: this.$t('user.support'),
          params: { user: id },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: this.$t('notSupport'),
          autoRequestTime: 0
        }
      ]
    } else if (listtype === 'original') {
      this.tabsData = [
        {
          label: this.$t('user.article'),
          params: { author: id, channel: 1 },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: this.$t('notArticle'),
          autoRequestTime: 0
        },
        {
          label: this.$t('user.shop'),
          params: { author: id, channel: 2 },
          apiUrl: 'homeTimeRanking',
          articles: [],
          loadingText: this.$t('notShop'),
          autoRequestTime: 0
        }
      ]
    } else if (listtype === 'reward') {
      this.tabsData = [
        {
          label: this.$t('user.article'),
          params: { user: id, channel: 1 },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: this.$t('notArticle'),
          autoRequestTime: 0
        },
        {
          label: this.$t('user.shop'),
          params: { user: id, channel: 2 },
          apiUrl: 'userArticlesSupportedList',
          articles: [],
          loadingText: this.$t('notShop'),
          autoRequestTime: 0
        }
      ]
    } else if (listtype === 'bookmark') {
      this.tabsData = [
        {
          label: this.$t('user.article'),
          params: {
            channel_id: 1
          },
          apiUrl: 'userBookmarks',
          articles: [],
          loadingText: this.$t('notArticle'),
          autoRequestTime: 0
        },
        {
          label: '分享',
          params: {
            channel_id: 3
          },
          apiUrl: 'userBookmarks',
          articles: [],
          loadingText: this.$t('notArticle'),
          autoRequestTime: 0
        }
      ]
      this.needAccessToken = true
    }
  },
  methods: {
    toggleTabs(i) {
      this.activeIndex = i

      // 判断是否自动刷新请求数据
      if (this.tabsData[i].autoRequestTime === 0 && this.tabsData[i].articles.length === 0)
        this.tabsData[i].autoRequestTime = Date.now()
    },
    getListDataTab({ index, list }) {
      this.tabsData[index].articles = list
    }
  }
}
</script>

<style lang="less" scoped>
.card-margin {
  margin: 0 0 10px 0;
}
.list {
  padding: 0 20px;
  .list-card {
    margin: 20px 0 0;
  }
}
.card-bookmark {
  padding: 20px;
  background-color: #fff;
  display: block;
  margin: 0 0 10px;
  border-radius: 3px;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  p {
    color: #333;
    font-size: 14px;
    font-weight: bold;
    word-break: break-all;
    white-space: pre-wrap;
  }
  div {
    margin-top: 10px;
    span {
      color: #949494;
      font-size: 14px;
      margin-right: 8px;
    }
    .icon {
      margin-right: 2px;
    }
  }
}
</style>
