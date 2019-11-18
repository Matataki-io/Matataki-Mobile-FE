<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '持有的粉丝通证' }"
      customize-header-bc="#fff"
    />
    <BasePull
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <card v-for="item in pointLog.list" :key="item.id" :card="item"></card>
    </BasePull>
  </div>
</template>

<script>
import card from './components/tokens_card.vue'

export default {
  components: {
    card
  },
  data() {
    return {
      pointLog: {
        params: {},
        apiUrl: 'tokenTokenList',
        list: []
      }
    }
  },
  methods: {
    getListData(res) {
      // console.log(res)
      this.pointLog.list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.tokens {
  background-color: #fff;
  padding-top: 45px;
  min-height: 100%;
}
</style>
