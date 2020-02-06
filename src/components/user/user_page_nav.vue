<template>
  <nav class="user-nav fl">
    <router-link
      v-for="(item, index) in navList"
      :key="index"
      :class="$route.name === item.url && 'active'"
      :to="{ name: item.url, params: { id: $route.params.id } }"
    >
      {{ item.title }}
    </router-link>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isMe']),
    navList() {
      const isMe = this.isMe(this.$route.params.id)
      if (isMe) return this.user
      else return this.user.filter(i => !i.self)
    },
    user() {
      return [
        // self 只有自己才能看
        { title: '创作', url: 'user-id', self: false },
        { title: '分享', url: 'user-id-share', self: false },
        { title: '关注', url: 'user-id-follow', self: false },
        { title: '粉丝', url: 'user-id-fan', self: false },
        { title: '信息', url: 'user-id-info', self: false }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.user-nav {
  margin-bottom: 10px;
  padding: 0 20px;
  text-align: center;
  a {
    flex: 1;
    margin-right: 0px;
    font-size: 14px;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    &.active {
      color: #000;
    }
  }
}
</style>
