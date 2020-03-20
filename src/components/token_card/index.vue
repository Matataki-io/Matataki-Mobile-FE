<template>
  <router-link
    :to="{ name: 'token-id', params: { id: card.id } }"
    class="fl card"
  >
    <avatar
      :src="cover"
      size="30px"
    />
    <div class="cards-content">
      <div class="fl">
        <router-link
          class="card-title"
          :to="{ name: 'token-id', params: { id: card.id } }"
        >
          <h2 class="card-info-symbol">
            {{ card.symbol || '暂无' }}
          </h2>
        </router-link>
        <router-link
          class="fl ac"
          :to="{ name: 'user-id', params: { id: card.uid } }"
        >
          <span class="card-username">
            {{ name }}
            <i class="el-icon-arrow-right" />
          </span>
        </router-link>
      </div>
      <div @click="$router.push({ path: '/token/' + card.id })">
        <p class="card-info-name">
          {{ card.name || '暂无' }}
        </p>
        <p class="card-info-name brief">
          {{ card.brief || '暂无' }}
        </p>
      </div>
      <div class="card-info-data">
        <div class="card-info-data-column">
          <p class="card-info-data-amount">
            {{ unitPrice }}
          </p>
          <p class="card-info-name">
            单价（CNY)
          </p>
        </div>
        <div class="card-info-data-column">
          <p class="card-info-data-amount">
            {{ tokenAmount }}
          </p>
          <p class="card-info-name">
            流动金（CNY)
          </p>
        </div>
        <div class="card-info-data-column">
          <p class="card-info-data-amount">
            {{ exchangeAmount || 0 }}
          </p>
          <p class="card-info-name">
            24h 成交额（CNY)
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>
import avatar from '@/components/avatar/index.vue'

import { precision } from '@/utils/precisionConversion'

export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    cover() {
      return this.card.logo ? this.$ossProcess(this.card.logo) : ''
    },
    coverUser() {
      return this.card.logo ? this.$ossProcess(this.card.logo) : ''
    },
    name() {
      let name = this.card.nickname || this.card.username
      return name.length > 12 ? name.slice(0, 12) + '...' : name
    },
    unitPrice() {
      const amount = this.card.amount || 0
      const liquidity = this.card.liquidity || 0

      if (amount === 0) return 0

      return (liquidity / amount).toFixed(this.card.decimals)
    },
    tokenAmount() {
      const tokenamount = Math.abs(precision(this.card.liquidity || 0, 'CNY', this.card.decimals))
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    exchangeAmount() {
      const tokenamount = Math.abs(precision(this.card.exchange_amount || 0, 'CNY', this.card.decimals))
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  padding: 14px 20px;
  border-bottom: 1px solid #dbdbdb;
  // &:nth-last-child(1) {
  //   border-bottom: 1px solid #dbdbdb;
  // }
}
.cards-content {
  flex: 1;
  margin-left: 10px;
  position: relative;
}

.card-info {
  &-symbol {
    font-size: 12px;
    font-weight: 400;
    color: #000;
    line-height: 28px;
    padding: 0;
    margin: 0;
  }
  &-name {
    font-size: 12px;
    font-weight: 400;
    color: #b2b2b2;
    line-height: 1.5;
    padding: 0;
    margin: 4px 0 0 0;
    &.brief {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.card-username {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #000;
  line-height: 20px;
}
.card-user-icon {
  display: flex;
  flex: 1;
  align-items: flex-end;
}
.card-title {
  flex: 1;
}

.card-info-data {
  margin-top: 6px;

  &-amount {
    font-size: 14px;
    color: #b2b2b2;
  }
  &-column {
    float: left;
    width: 33%;
  }
}
</style>
