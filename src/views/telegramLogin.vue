<template>
  <div class="container" v-loading="loading">
    <TelegramLogin
      @callback="telegramLogin"
      mode="callback"
      telegram-login="matataki_bot"
      request-access="write"
      radius="6"
    />
  </div>
</template>

<script>
import TelegramLogin from '@/components/TelegramLogin'
export default {
  name: 'telegramLogin',
  components: {
    TelegramLogin
  },
  computed: {},
  data() {
    return {
      loading: false
    }
  },
  methods: {
    telegramLogin(user) {
      this.loading = true
      this.$API
        .accountBind({
          platform: 'telegram',
          telegramParams: user
        })
        .then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
          this.$router.back(-1)
        })
        .catch(err => {
          console.log(err)
          this.$message.error(`绑定失败${params.platform.toUpperCase()}`)
        })
        .finally(() => {
          this.loading = true
        })
    }
  }
}
</script>
<style lang="less">
.container {
  min-height: 100%;
  max-height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>