/* eslint-disable */
<template>
  <div class="login">
    支付中......
  </div>
</template>

<script>

export default {
  name: 'WeixinPay',
  computed: {},
  created() {
    /* const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
    if (!isWeixin()) {
      this.$router.push({ name: 'index' })
      return
    } */
    const { code, state } = this.$route.query
    if (!code || state !== 'weixin') {
      const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
      const appid = 'wx95829b6a2307300b'
      const scope = 'snsapi_base'
      const redirectUri = `${VUE_APP_WX_URL}${this.$route.path}`
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
    } else {
      this.$API.getWeixinOpenId(code).then(res => {
        if (res.openid) {
          this.$API.jsapiPay(this.$route.params.id, res.openid).then(res => {
            this.weakWeixinPay(res)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.login {
  text-align: center;
  margin-top: 50%;
}
</style>
