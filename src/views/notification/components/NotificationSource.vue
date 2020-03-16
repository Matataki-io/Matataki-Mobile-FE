<template>
  <div class="soruce-avatar">
    <router-link
      :to="{name: route, params: {id}}"
      :title="name"
      target="_blank"
    >
      <avatar
        :src="avatarUrl"
        class="avatar"
        size="30px"
      />
    </router-link>
  </div>
</template>
<script>
import avatar from '@/components/avatar/index.vue'
export default {
  name: 'NotificationSource',
  components: { avatar },
  props: {
    avatar: { type: String },
    name: { type: String, default: '' },
    route: { type: String, required: true },
    id: { type: Number, required: true }
  },
  computed: {
    avatarUrl() {
      return this.$ossProcess(this.avatar)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
