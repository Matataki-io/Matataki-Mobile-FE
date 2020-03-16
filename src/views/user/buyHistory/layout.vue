<template>
  <div class="container">
    <BaseHeader :pageinfo="{ title: $t('sidebar.buy') }" />
    <div class="buy-tab">
      <router-link
        :to="{ name: 'buy' }"
        :class="$route.name === 'buy' && 'active'"
        replace
      >
        文章
      </router-link>
      <router-link
        :to="{ name: 'buy-other' }"
        :class="$route.name === 'buy-other' && 'active'"
        replace
      >
        其他
      </router-link>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="less" scoped>
.container {
  background-color: #f7f7f7;
  min-height: 100%;
  padding-top: 45px;
}
.buy-tab {
  width: 200px;
  margin: 10px auto 10px;
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
