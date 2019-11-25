<template>
  <div>
    <BasePull
      :url-replace="$route.params.id + ''"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <card v-for="item in pull.list" :key="item.id" :card="item" :decimals="4"></card>
    </BasePull>
  </div>
</template>

<script>
import card from '@/components/minetoken_card/index.vue'

export default {
  components: {
    card
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 20,
          sort: this.$route.query.sort || 'amount-desc'
        },
        apiUrl: 'tokenIdBalances',
        list: []
      },
      currentPage: Number(this.$route.query.page) || 1,
      loading: false, // 加载数据
      total: 0
    }
  },
  methods: {
    getListData(res) {
      this.pull.list = res.list
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 40px;
}
</style>
