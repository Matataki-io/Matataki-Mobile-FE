<template>
  <nav class="user-nav">
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
        { title: '文章', url: 'user-id', self: false },
        { title: '关注', url: 'user-id-follow', self: false },
        { title: '粉丝', url: 'user-id-fan', self: false },
        { title: '购买', url: 'user-id-buy', self: true },
        { title: '个人信息', url: 'user-id-info', self: false }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.user-nav {
  margin-bottom: 10px;
  padding: 0 20px;
  a {
    font-size: 14px;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    margin-right: 20px;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    &.active {
      color: #000;
    }
  }
}
</style>
