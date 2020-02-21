<template>
  <div class="tg-container" v-loading="loading">
    <TelegramLogin
      @callback="login"
      :telegram-login="TELEGRAM_BOT_NAME"
      mode="callback"
      request-access="write"
      radius="6"
    />
    <p class="tips">
      使用该功能需要“科学上网”
    </p>
    <wechatTips v-if="isWeixin" class="wechat-tips"></wechatTips>
  </div>
</template>

<script>
import TelegramLogin from '@/components/TelegramLogin'
import wechatTips from '@/components/wechat_tips'
export default {
  name: 'telegramLogin',
  components: {
    TelegramLogin,
    wechatTips
  },
  data() {
    return {
      loading: false,
      // TELEGRAM_BOT_NAME: process.env.VUE_APP_TELEGRAM_BOT
    }
  },
  computed: {
    isWeixin () {
      return /micromessenger/.test(navigator.userAgent.toLowerCase())
    },
    TELEGRAM_BOT_NAME() {
      const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
      if (isWeixin()) {
        return process.env.VUE_APP_TELEGRAM_BOT_IN_WX
      } else {
        return process.env.VUE_APP_TELEGRAM_BOT
      }
    }
  },
  methods: {
    login(user) {
      const from = this.$route.query.from
      if (from === 'login') {
        this.telegramLogin(user)
      } else {
        this.telegramBinding(user)
      }
    },
    telegramLogin(user) {
      this.loading = true
      this.$API
        .telegramLogin({
          telegramParams: user,
          telegramBotName: this.TELEGRAM_BOT_NAME
        })
        .then(res => {
          this.$store.commit('setAccessToken', res.data)
          this.$store.commit('setUserConfig', { idProvider: 'telegram' })

          // 两个地方的back -1 vue里面没有想到什么好的判断上一页的办法, 暂时直接返回需要的页面
          // this.$router.back(-1)
          this.$router.push({
            name: 'article'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    telegramBinding(user) {
      this.loading = true
      this.$API
        .accountBind({
          platform: 'telegram',
          telegramParams: user,
          telegramBotName: this.TELEGRAM_BOT_NAME
        })
        .then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
          // this.$router.back(-1)
          this.$router.push({
            name: 'setting-account'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message.error(`绑定失败${params.platform.toUpperCase()}`)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="less">
.tg-container {
  min-height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding-top: 10%;
  background: #fff;
  .tips {
    font-size: 12px;
    color: #333;
    padding: 0;
    margin: 2em 0 0;
  }
}

.wechat-tips {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 9999;
}
</style>