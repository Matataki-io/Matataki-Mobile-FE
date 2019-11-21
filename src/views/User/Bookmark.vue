<template>
  <userPage>
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :now-index="index"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :need-access-token="true"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <ArticleCard
        v-for="(item, i) in pull.list"
        :key="i"
        :class="listtype !== 'others' && 'card-margin'"
        :article="item"
        type="article"
      />
    </BasePull>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import ArticleCard from '@/components/ArticleCard.vue'

export default {
  components: {
    userPage,
    ArticleCard
  },
  data() {
    return {
      pull: {
        params: { uid: this.$route.params.id, pagesize: 20 },
        apiUrl: 'userBookmarks',
        list: [],
        loadingText: this.$t('not'),
        autoRequestTime: 0
      }
    }
  },
  methods: {
    getListDataTab(res) {
      this.pull.list = res.list
    }
  }
}
</script>

<style scoped lang="less"></style>
