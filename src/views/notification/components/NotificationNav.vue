<template>
  <nav class="fl">
    <template v-for="(item, index) in navList">
      <router-link
        v-if="item.enabled"
        :key="index"
        :to="{ name: 'notification', params: { provider: item.name} }"
      >
        {{ item.text }}
      </router-link>
      <a
        v-else
        :key="index"
        class="unavailable"
        href="javascript:"
      >{{ item.text }}</a>
    </template>
  </nav>
</template>

<script>

export default {
  name: 'NotificationNav',
  props: {
    navList: { type: Array, default: () => [] }
  }
}
</script>

<style lang="less" scoped>
nav {
  margin-top: 45px;
  background: #fff;
  padding: 14px 0;
  /deep/ .router-link-active{
    font-weight: bold;
  }
  a {
    flex: 0.5;
    margin-right: 0px;
    font-size: 14px;
    line-height: 20px;
    color: #000;
    text-align: center;
    &.unavailable {
      color: rgba(178, 178, 178, 1);
    }
  }
}
</style>
