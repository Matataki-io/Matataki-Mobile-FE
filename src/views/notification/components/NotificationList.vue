<template>
  <div class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
    <div class="card" v-for="(notification, index) in notifications" :key="index">
      <!-- Possible an eslint issue: https://github.com/vuejs/eslint-plugin-vue/issues/869 Remove next workaround if resolved -->
      <!-- eslint-disable-next-line vue/require-component-is -->
      <component
        v-bind:is="COMPONENTS[notification.kind]"
        :avatar="notification.avatar"
        :source="notification.source"
        :timestamp="notification.timestamp"
        :message="notification.message"
        :actions="notification.actions"
      />
    </div>
  </div>
</template>
<script>
import NewFanNotification from './NewFanNotification.vue'
import API from '@/api/notification'
const COMPONENTS = {
  follow: NewFanNotification.name
  // ADD MORE NOTIFICATION
}
export default {
  name: 'NotificationList',
  /* eslint-disable vue/no-unused-components */
  components: { NewFanNotification },
  data() {
    return {
      COMPONENTS,
      page: 1,
      notifications: []
    }
  },
  props: {
    provider: { type: String, required: true }
  },
  methods: {
    async load () {
      const res = await API.fetchNotifications(this.provider, this.page)
      if (Array.isArray(res.data) && res.data.length) {
        this.notifications.push(...res.data)
        if (this.page === 1) {
          await API.readNotifications(this.provider)
        }
        this.page++
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .card{
    height: 58px;
    padding: 14px;
    margin: 2px 0;
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    position: relative;
    box-shadow: 0px 1px 0px 0px rgba(219,219,219,1);
    /deep/ .soruce-avatar{
      position: absolute;
      top: 14px;
      left: 20px;
    }
    /deep/ .message{
      margin: 0 0 0 60px;
      font-size: 12px;
      color: #B2B2B2;
      p{
        margin: 0;
        line-height: 17px;
      }
      b{
        color: #000;
        margin-right: 5px;
      }
      time{
        font-size: 10px;
        line-height: 14px;
      }
    }
    /deep/ .action{
      position: absolute;
      top: 16px;
      right: 20px;
    }
  }
</style>
