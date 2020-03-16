<template>
  <userByTab>
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :now-index="index"
      :need-access-token="true"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <buy
        v-for="(item, index) in pull.list"
        :key="index"
        :buy="item"
        type="other"
      />
    </BasePull>
  </userByTab>
</template>

<script>
import userByTab from '@/components/user/user_buy_tab.vue'
import buy from '@/components/buy_card/index.vue'

export default {
  components: {
    userByTab,
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
