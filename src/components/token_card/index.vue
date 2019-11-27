<template>
  <div class="fl card">
    <router-link :to="{ name: 'token-id', params: { id: card.id } }">
      <avatar :src="cover" size="30px" />
    </router-link>
    <div class="cards-content">
      <div class="fl">
        <router-link class="card-title" :to="{ name: 'token-id', params: { id: card.id } }">
          <h2 class="card-info-symbol">
            {{ card.symbol || '暂无' }}
          </h2>
        </router-link>
        <router-link class="fl ac" :to="{ name: 'user-id', params: { id: card.uid } }">
          <span class="card-username">
            {{ name }}
            <i class="el-icon-arrow-right"></i>
          </span>
        </router-link>
      </div>
      <div @click="$router.push({ path: '/token/' + card.id })">
        <p class="card-info-name">
          {{ card.name || '暂无' }}
        </p>
        <p class="card-info-name">
          {{ card.brief || '暂无' }}
        </p>
      </div>
      <div class="card-info-data">
        <div class="card-info-data-column">
          <p class="card-info-data-amount">
            {{ card.unit_price || 0 }}
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
            {{ card.exchange_amount || 0 }}
          </p>
          <p class="card-info-name">
            24h 成交量（个)
          </p>
        </div>
      </div>
    </div>
  </div>
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
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    },
    coverUser() {
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    },
    name() {
      let name = this.card.nickname || this.card.username
      return name.length > 12 ? name.slice(0, 12) + '...' : name
    },
    tokenAmount(amount) {
      const tokenamount = Math.abs(precision(this.card.liquidity || 0, 'CNY', this.card.decimals))
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
  }
  &-column {
    float: left;
    width: 33%;
  }
}
</style>
