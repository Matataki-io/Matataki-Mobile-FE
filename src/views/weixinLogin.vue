<template>
  <div style="height: 100%;" v-loading="loading" element-loading-text="登录中..."></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'WeixinLogin',
  computed: {},
  data() {
    return {
      loading: true
    }
  },
  created() {
    const { code, state } = this.$route.query
    // if (from) sessionStorage.setItem('wechatFrom', from) // set sessionStorage
    if (!code || state !== 'weixin') {
      const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
      const appid = 'wx95829b6a2307300b'
      const scope = 'snsapi_userinfo'
      const redirectUri = `${VUE_APP_WX_URL}/login/weixin`
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
    } else {
      const from = sessionStorage.getItem('wechatFrom') || 'index'
      if (from === 'buildAccount') {
        const params = {
          platform: 'weixin',
          code: code
        }
        this.$API.accountBind(params).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('微信绑定失败')
        }).finally(() => {
          this.$router.push({ name: 'setting-account' })
        })
      } else {
        this.$API.loginWeixin(code).then(res => {
          this.$store.commit('setAccessToken', res.data)
          this.$store.commit('setUserConfig', { idProvider: 'weixin' })
          this.$router.push({ path: from })
        })
      }
    }
  }
}
</script>
