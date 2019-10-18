<template>
  <div class="card">
    <div class="card-time">
      <span class="time">{{ time }}</span>
    </div>
    <div class="fl jsb">
      <span class="type">{{ type }}</span>
      <span class="amount" :style="{ color: `${color}` }">{{ amount }}</span>
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
    }
  },
  computed: {
    time() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
    },
    amount() {
      const type = {
        recharge: '+',
        transfer_out: '',
        transfer_in: '+'
      }

      const tokenamount = precision(this.card.amount, 'CNY', 4)
      return type[this.card.type] + this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    color() {
      const type = {
        recharge: '#FB6877',
        transfer_out: '#44D7B6',
        transfer_in: '#FB6877'
      }
      return type[this.card.type] || '#FB6877'
    },
    type() {
      const { type } = this.card
      const typeList = {
        recharge: '充值',
        transfer_out: '转出资产',
        transfer_in: '转入资产'
      }
      return typeList[type] || '其他'
    }
  },
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  border-top: 1px solid #ececec;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
}

.card-time {
  text-align: right;
  margin-bottom: 10px;
}

.type {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
}
.amount {
  font-size: 14px;
  font-weight: 500;
  color: rgba(251, 104, 119, 1);
  line-height: 20px;
}
</style>
