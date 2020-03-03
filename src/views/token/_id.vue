<template>
  <layout v-model="tabPage" @getToken="setMinetokenToken">
    <tokenFanCoins v-if="tabPage === 0" />
    <tokenFanCoinsDetail v-if="tabPage === 1" />
    <tokenLiquidity v-if="tabPage === 2" />
    <tokenLiquidityDetail v-if="tabPage === 3" :token="minetokenToken" />
  </layout>
</template>

<script>
import layout from '@/components/token/token_layout.vue'
import tokenFanCoins from '@/components/token/token_fan_coins.vue'
import tokenFanCoinsDetail from '@/components/token/token_fan_coins_detail.vue'
import tokenLiquidity from '@/components/token/token_liquidity.vue'
import tokenLiquidityDetail from '@/components/token/token_liquidity_detail.vue'

export default {
  components: {
    layout,
    tokenFanCoins,
    tokenFanCoinsDetail,
    tokenLiquidity,
    tokenLiquidityDetail
  },
  data() {
    return {
      tabPage: Number(this.$route.query.tab) || 0,
      minetokenToken: {}
    }
  },
  methods: {
    setMinetokenToken(data) {
      this.minetokenToken = data
    }
  }
}
</script>

<style scoped>
.pagination {
  margin-top: 40px;
}
</style>
