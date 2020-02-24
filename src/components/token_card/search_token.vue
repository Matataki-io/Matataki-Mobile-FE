<template>
  <router-link :to="{name: 'token-id', params: { id: card.id }}" class="fl token-card" tag="div">
    <div>
      <avatar :src="cover" size="40px" />
    </div>
    <div class="card-info">
      <h2 class="search-res" v-html="card.symbol" />
      <p class="search-res" v-html="card.name" />
      <p class="search-res" v-html="card.brief" />
    </div>
  </router-link>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
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
      return this.card.logo ? this.$ossProcess(this.card.logo, {h: 90}) : ''
    }
  }
}
</script>

<style scoped lang="less">
.token-card {
  width: 100%;
  background: @white;
  cursor: pointer;
  .card-info {
    -webkit-box-flex: 1;
    flex: 1;
    margin-left: 10px;
    h2 {
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: #000;
      line-height: 16px;
      padding: 0;
      margin: 0;
    }
    P {
      font-size: 12px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 16px;
      padding: 0;
      margin: 4px 0 0 0;
    }
  }
}

.search-res em {
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}
</style>
