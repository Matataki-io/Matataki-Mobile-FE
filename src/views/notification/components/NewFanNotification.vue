<template>
  <div>
    <NotificationSource :avatar="avatar" :id="source" :name="message" route="user-id" />
    <div class="message">
      <p><b>{{ message }}</b> {{ $t('notification.followed_you') }}</p>
      <NotificationTime :timestamp="timestamp" />
    </div>
    <div class="action">
      <span class="follow-button" :class="{ dark }" :disabled="!dark" @click.stop="follow" size="small">
        <svg-icon v-if="followAction" class="icon" icon-class="add" />
        {{ actionText }}
      </span>
    </div>
  </div>
</template>
<script>
import NotificationSource from './NotificationSource'
import NotificationTime from './NotificationTime'
export default {
  name: 'NewFanNotification',
  components: { NotificationSource, NotificationTime },
  props: {
    avatar: { type: String },
    source: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    message: { type: String, default: 'Anonymous' },
    actions: { type: Array, default: () => [] }
  },
  data() {
    return {
      followed: false
    }
  },
  computed: {
    followAction() {
      return !this.followed && this.actions[0] && this.actions[0].emit
    },
    dark() {
      return this.followAction && !this.followed
    },
    actionText() {
      return this.followAction ? this.$t('follow') : this.$t('following')
    }
  },
  methods: {
    async follow() {
      try {
        const res = await this.$API.follow(this.source)
        if (res.code === 0) {
          this.followed = true
          this.$message.success(`${this.actionText}${this.$t('success.success')}`)
        } else {
          this.$message.error(`${this.actionText}${this.$t('error.fail')}`)
        }
      } catch (error) {
        this.$message.error(`${this.actionText}${this.$t('error.fail')}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.follow-button {
  display: block;
  border-radius: 6px;
  color: #000;
  border: 1px solid #000;
  flex: 0 0 63px;
  width: 63px;
  padding: 4px 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 17px;
  box-sizing: border-box;
  cursor: pointer;
  &.dark {
    background: #000;
    color: #fff;
  }
}
</style>
