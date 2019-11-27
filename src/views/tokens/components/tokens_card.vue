<template>
  <router-link class="card" :to="{ name: 'tokensId', params: { id: card.token_id } }">
    <div class="info">
      <avatar :src="cover(card.logo)" size="30px" />
      <div class="user-info">
        <h3>{{ card.symbol }}</h3>
        <h4>{{ card.name }}</h4>
      </div>
    </div>
    <div class="number">
      <span>{{ tokenAmount(card.amount) }}</span>
      <i class="el-icon-arrow-right icon"></i>
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
  methods: {
    cover(cover) {
      return cover ? this.$backendAPI.getImg(cover) : ''
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.card.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    }
  }
}
</script>

<style scoped lang="less">
.card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ececec;
}
.info {
  flex: 1;
  display: flex;
  align-items: center;
}
.user-info {
  margin-left: 10px;
  h3 {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 17px;
  }
  h4 {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
  }
}
.number {
  span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
    margin-right: 4px;
  }
  .icon {
    font-size: 16px;
    color: #b2b2b2;
  }
}
</style>
