<template>
  <userPage>
    <template>
      <div class="buy-tab">
        <router-link
          :to="{ name: 'user-id-buy', params: { id: $route.params.id } }"
          :class="$route.name === 'user-id-buy' && 'active'"
        >
          文章
        </router-link>
        <router-link
          :to="{ name: 'user-id-buy-other', params: { id: $route.params.id } }"
          :class="$route.name === 'user-id-buy-other' && 'active'"
        >
          其他
        </router-link>
      </div>
      <slot />
    </template>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'

export default {
  components: {
    userPage
  }
}
</script>

<style lang="less" scoped>
.buy-tab {
  width: 200px;
  margin: 10px auto 0;
  border-radius: 6px;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  a {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: #000;
    background: #fff;
    padding: 5px 0;
    flex: 1;
    text-align: center;
    transition: all 0.3s;
    &.active {
      background: #000;
      color: #fff;
    }
  }
}
</style>
