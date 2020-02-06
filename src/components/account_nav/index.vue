<template>
  <div class="sort-nav">
    <a :class="$route.name === 'accountCny' && 'active'" @click="router('accountCny')">
      我的余额
    </a>
    <a :class="$route.name === 'point' && 'active'" @click="router('point')">
      积分详情
    </a>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    router(name) {
      this.$router.replace({
        name
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sort-nav {
  padding: 12px 60px;
  text-align: center;
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  a {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #b2b2b2;
    line-height: 20px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    &.active {
      color: #000;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        background: #542de0;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 1px;
        z-index: 0;
      }
    }
  }
}
</style>
