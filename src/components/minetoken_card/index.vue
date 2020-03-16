<template>
  <div class="card">
    <router-link
      class="info"
      :to="{ name: 'user-id', params: { id: card.uid } }"
    >
      <avatar
        v-if="true"
        class="avatar"
        :src="cover(card.avatar)"
      />
      <h3>{{ card.nickname || card.username }}</h3>
    </router-link>
    <div class="number">
      <span>{{ tokenAmount(card.amount) }} ({{ percentage(card.amount, card.total_supply) }})</span>
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
    },
    decimals: {
      type: Number,
      required: true
    }
  },
  methods: {
    cover(cover) {
      return cover ? this.$ossProcess(cover, {h: 60}) : ''
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
    percentage(amount, total) {
      if (total <= 0) {
        return '0%'
      }

      return (amount / total).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })
    }
  }
}
</script>

<style scoped lang="less">
.card {
  border-bottom: 1px solid #ececec;
  display: flex;
  align-items: center;
  padding: 14px 20px;
  .avatar {
    width: 30px !important;
    height: 30px !important;
    flex: 0 0 30px;
  }
  .info {
    display: flex;
    align-items: center;
    width: 70%;
    overflow: hidden;
    h3 {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .number {
    width: 30%;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
}
</style>
