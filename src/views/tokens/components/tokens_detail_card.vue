<template>
  <!-- <router-link class="card" :to="{ name: 'tokensId', params: { id: card.token_id } }">
    <div class="info">
      <avatar v-if="card.logo" :src="cover(card.logo)" size="30px" />
      <div class="user-info">
        <h3>{{ card.symbol }}</h3>
        <h4>{{ card.name }}</h4>
      </div>
    </div>
    <div class="number">
      <span>{{ tokenAmount(card.amount) }}枚</span>
      <i class="el-icon-arrow-right icon"></i>
    </div>
  </router-link> -->
  <div class="card">
    <div class="fl jsb">
      <span class="type">{{ type }}</span>
      <span class="money">{{ amount }}</span>
    </div>
    <div class="fl jsb">
      <span class="time">{{ time }}</span>
      <span class="symbol">{{ card.symbol }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'

export default {
  components: {},
  props: {
    card: {
      type: Object,
      required: true
    },
  },
  created() {
    console.log(this.card)
  },
  computed: {
    time() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
    },
    amount() {
      const tokenamount = precision(this.card.amount, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    type() {
      const { type } = this.card
      const typeList = {
        mint: '增发',
        transfer: '赠送',
        exchange_purchase: '交易所内购买',
        exchange_addliquidity: '交易所添加流动性',
        exchange_removeliquidity: '交易所删除流动性'
      }
      return typeList[type] || '其他'
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  padding: 10px 20px;
  border-bottom: 1px solid #ececec;
  &>div {
    margin: 6px 0;
  }
}
.type {
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:20px;
}
.money {
  font-size:14px;
  font-weight:500;
  color:rgba(251,104,119,1);
  line-height:20px;
}
.time {
  font-size:12px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:17px;
}
.symbol {
  font-size:12px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:17px;
}
</style>
