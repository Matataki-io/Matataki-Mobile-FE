<template>
  <layout>
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :now-index="0"
      :need-access-token="true"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <buy v-for="(item, index) in pull.list" :key="index" :buy="item" type="other" />
    </BasePull>
  </layout>
</template>

<script>
import layout from './layout.vue'
import buy from '@/components/buy_card/index.vue'

export default {
  components: {
    layout,
    buy
  },
  data() {
    return {
      pull: {
        params: { pagesize: 20 },
        apiUrl: 'buyHistory',
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
