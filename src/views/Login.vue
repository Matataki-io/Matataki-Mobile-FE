/* eslint-disable */
<template>
  <div class="login"></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',
  computed: {},
  created() {
    const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
    const { protocol, host } = window.location
    const { path, query } = this.$route
    const { code, from } = query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    const scope = 'read:public_repo,read:user'
    // 判断是否来自微信
    if (isWeixin) from = 'wx'
    const redirectUri = `${protocol}//${host}${path}?from=${from}` // 範例值
    if (!code) {
      // 跳轉
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}`
    } else {
      // 如果是pc的话，需要跳转到pc端
      if (from === 'pc') {
        window.location = `${process.env.VUE_APP_PC_URL}/login?code=${code}&from=${from}`
      } else if (from === 'wx' && `${protocol}//${host}`!== process.env.VUE_APP_WX_URL) {
        // 如果是微信，且url不等于wx，就需要跳转
        window.location = `${process.env.VUE_APP_WX_URL}/login?code=${code}&from=${from}`
      } else {
        this.signIn({ code, idProvider: 'GitHub' })
          .then(() => {
            this.$backendAPI.accessToken = this.currentUserInfo.accessToken
          })
          .catch(() => {})
          .then(() => {
            this.$router.push(from)
          })
      }
    }
  },
  methods: {
    ...mapActions(['signIn'])
  }
}
</script>

<style scoped></style>
