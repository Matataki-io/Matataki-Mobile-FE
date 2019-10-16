<template>
  <div class="card">
    <router-link class="info" :to="{ name: 'User', params: { id: card.uid } }">
      <avatar v-if="true" :src="cover(card.avatar)" size="30px" />
      <h3>{{ card.nickname || card.username }}</h3>
    </router-link>
    <div class="number">
      <span>{{ tokenAmount(card.amount) }}</span>
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
  border-top: 1px solid #ececec;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  .info {
    display: flex;
    align-items: center;
    width: 70%;
    h3 {
      margin-left: 10px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 20px;
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
