<template>
  <nav class="nav">
    <router-link
      v-for="(item, index) in user"
      :key="index"
      :class="$route.name === item.url && 'active'"
      :to="{ name: item.url, params: { id: $route.params.id } }"
    >
      <div
        class="icon-tokens"
        :class="item.icon"
      >
        <svg-icon :icon-class="item.icon" />
      </div>
      {{ item.title }}
    </router-link>
  </nav>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    user() {
      return [
        { title: 'Fan票持仓', icon: 'minetokens_details', url: 'token-id' },
        { title: 'Fan票流水', icon: 'minetokens_detail', url: 'token-detail-id' },
        { title: '流动金持仓', icon: 'minetokens_details', url: 'token-liquidity-id' },
        { title: '流动金流水', icon: 'minetokens_detail', url: 'token-liquidity-detail-id' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  margin: 0 auto;
  padding: 0;
  display: flex;
  a {
    font-size: 18px;
    line-height: 33px;
    text-decoration: none;
    margin: 0;
    cursor: pointer;
    color: #333;
    opacity: 0.8;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:nth-child(1) {
      margin-right: 40px;
    }
    &.active {
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
    }
  }
}

.icon-tokens {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  &.minetokens_detail {
    background: #542de0;
  }
  &.minetokens_details {
    background: #f7b500;
  }
}
</style>
