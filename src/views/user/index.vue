<template>
  <userPage>
    <div class="list">
      <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <artcleCard class="list-card" v-for="item in pull.list" :key="item.id" :card="item"></artcleCard>
      <!-- <ArticleCard
        v-for="(itemChild, index) in pull.list"
        :key="index"
        :class="listtype !== 'others' && 'card-margin'"
        :article="itemChild"
        :now-index="0"
        type="article"
      /> -->
    </BasePull>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import artcleCard from '@/components/article_card/index.vue'

// import { ArticleCard } from '@/components/'

export default {
  components: {
    userPage,
    // ArticleCard,
    artcleCard
  },
  data() {
    return {
      pull: {
        params: {
          author: this.$route.params.id,
          extra: 'short_content'
        },
        apiUrl: 'homeTimeRanking',
        list: [],
        loadingText: this.$t('not'),
        autoRequestTime: 0
      }
    }
  },
  methods: {
    getListDataTab(res) {
      // console.log(res)
      this.pull.list = res.list
    }
  }
}
</script>

<style scoped lang="less">
.list {
  padding: 0 20px;
  .list-card {
    margin: 20px 0 0;
  }
}
</style>
