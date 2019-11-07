/* eslint-disable */
<template>
  <div class="login">
    登录中......
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'WeixinLogin',
  computed: {},
  created() {
    const { code, state } = this.$route.query
    const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
    const appid = 'wx95829b6a2307300b'
    const scope = 'snsapi_userinfo'
    const redirectUri = `${VUE_APP_WX_URL}/login/weixin`
    if (!code || state !== 'weixin') {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid${appid}=&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
    } else {
      this.$API.loginWeixin(code).then(res => {
        this.$store.commit('setAccessToken', res.data)
        this.$store.commit('setUserConfig', { idProvider: 'weixin' })
        this.$router.push({ name: 'index' })
      })
    }
  }
}
</script>

<style scoped></style>
