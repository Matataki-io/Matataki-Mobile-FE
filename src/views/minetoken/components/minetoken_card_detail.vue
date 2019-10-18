<template>
  <div class="card">
    <div class="fl jsb">
      <div class="from-to">
        <router-link class="info" :to="{ name: 'User', params: { id: card.from_uid } }">
          {{ card.from_nickname || card.from_username }}
        </router-link>
        <svg-icon icon-class="transfer" class="info-icon"></svg-icon>
        <router-link class="info" :to="{ name: 'User', params: { id: card.to_uid } }">
          {{ card.to_nickname || card.to_username }}
        </router-link>
      </div>
      <span class="amount">{{ tokenAmount(card.amount) }}</span>
    </div>
    <div class="fl jsb">
      <span class="time">{{ time }}</span>
      <!-- <span class="type">{{ type }}</span> -->
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
    decimals: {
      type: Number,
      required: true
    }
  },
  computed: {
    time() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
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
  methods: {
    cover(cover) {
      return cover ? this.$backendAPI.getImg(cover) : ''
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    }
  }
}
</script>

<style scoped lang="less">
.card {
  border-bottom: 1px solid #ececec;
  display: flex;
  flex-direction: column;
  padding: 14px 20px;
  & > div {
    margin: 6px 0;
  }
  .info {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .info-icon {
    margin: 0 10px;
    color: #000;
  }
}
.time {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
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
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
}
.symbol {
  font-size: 12px;
  font-weight: 400;
  color: rgba(178, 178, 178, 1);
  line-height: 17px;
}
.from-to {
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
