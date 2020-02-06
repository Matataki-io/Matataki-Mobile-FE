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
      <!-- <artcleCard class="list-card" v-for="item in pull.list" :key="item.id" :card="item"></artcleCard> -->
      <shareCard class="list-card" v-for="(item, index) in pull.list" :key="index" :card="item" @refClick="pushShare"></shareCard>
    </BasePull>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import artcleCard from '@/components/article_card/index.vue'
import shareCard from '@/components/share_card/index.vue'

// import { ArticleCard } from '@/components/'

export default {
  components: {
    userPage,
    // artcleCard
    shareCard
  },
  data() {
    return {
      pull: {
        params: {
          author: this.$route.params.id,
        },
        apiUrl: 'share',
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
    },
    removeShareLink(i) {
      this.pull.list.splice(i, 1)
    },
    pushShare(card) {
      // 优化体验, 大厅取这个key
      sessionStorage.setItem('shareRef', card.id)
      this.$router.push({ name: 'sharehall' })
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
// .list-card {
//   margin-top: 20px;
//   &:nth-child(1) {
//     margin-top: 0;
//   }
// }
</style>
