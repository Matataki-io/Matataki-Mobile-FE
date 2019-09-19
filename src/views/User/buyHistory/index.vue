<template>
  <div class="mw buy">
    <BaseHeader :pageinfo="{ title: $t('user.buyHistory') }" />
    <BasePull
      :params="params"
      :api-url="apiUrl"
      :loading-text="$t('notBuyHistory')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      @getListData="getListData"
    >
      <buyCard v-for="(item, index) in buyList" :key="index" :buy="item" />
    </BasePull>
  </div>
</template>

<script>
import buyCard from './buyCard.vue'

export default {
  name: 'BuyHistory',
  components: {
    buyCard
  },
  data() {
    return {
      buyList: [],
      params: '',
      apiUrl: 'buyHistory'
    }
  },
  created() {},
  methods: {
    getListData(res) {
      this.buyList = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.buy {
  background-color: #f7f7f7;
  min-height: 100%;
  padding-top: 45px;
}
</style>
