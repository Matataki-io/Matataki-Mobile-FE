<template>
  <userPage>
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :now-index="index"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <ArticleCard
        v-for="(itemChild, index) in pull.list"
        :key="index"
        :class="listtype !== 'others' && 'card-margin'"
        :article="itemChild"
        :now-index="0"
        type="article"
      />
    </BasePull>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import { ArticleCard } from '@/components/'

export default {
  components: {
    userPage,
    ArticleCard
  },
  data() {
    return {
      pull: {
        params: { author: this.$route.params.id },
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

<style scoped lang="less"></style>
