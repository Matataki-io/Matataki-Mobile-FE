<template>
  <layout @notToken="$emit('notToken')">
    <BasePull
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
  </layout>
</template>

<script>
import layout from './tokens_manage_layout.vue'
import card from './minetoken_card_detail.vue'

export default {
  components: {
    layout,
    card
  },
  data() {
    return {
      pull: {
        params: {},
        apiUrl: 'tokenTokenLogs',
        list: []
      }
    }
  },
  methods: {
    getListData(res) {
      // console.log(res)
      this.pull.list = res.list
    }
  }
}
</script>
