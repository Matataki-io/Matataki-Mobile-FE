<template>
  <div style="height: 100%;" v-loading="loading" element-loading-text="登录中..."></div>
</template>

<script>
import { getCookie, removeCookie } from '@/utils/cookie'

export default {
  name: 'LoginPage',
  computed: {},
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    const { code, from, error } = this.$route.query
    const clientID = process.env.VUE_APP_GITHUB_CLIENT_ID
    // const clientID = '750700EDFF6D3C6199CD'
    const APP_URL = process.env.VUE_APP_URL
    const scope = 'read:public_repo,read:user'
    // if (from) sessionStorage.setItem('githubFrom', from) // set sessionStorage
    // const redirectUri = `${APP_URL}/login/github${from ? '?from=' + from : ''}`
    const redirectUri = `${APP_URL}/login/github`
    // const redirectUri = `http://localhost:8080/login/github${from ? '?from=' + from : ''}`
    if (error) { // 如果是error之后
      this.$message.error('Github登录失败, 请返回重试')
      const from = sessionStorage.getItem('githubFrom') || 'index'
      // 得到的内容是 buildAccount 回绑定, 否则认为是登录走 path
      if (from === 'buildAccount') {
        this.$router.push({ name: 'setting-account' })
      } else {
        this.$router.push({ path: from })
      }
    } else if (!code) {
      // http://localhost:8080/login/github?error=redirect_uri_mismatch&error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch
      window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
    } else {
      const from = sessionStorage.getItem('githubFrom') || 'index'
      if (from === 'buildAccount') { // 调用接口
        const params = {
          platform: 'github',
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
          this.$message.error('Github绑定失败')
        }).finally(() => {
          this.$router.push({ name: 'setting-account' })
        })
      } else {
        let params = { code }
  
        // 推荐人id
        let referral = getCookie('referral')
        if (referral) Object.assign(params, { referral: referral })

        this.$API.loginGitHub(params)
          .then(res => {
            if (res.code === 0) {
              this.$store.commit('setAccessToken', res.data)
              this.$store.commit('setUserConfig', { idProvider: 'GitHub' })

              this.$router.push({ path: from })
            } else {
              this.$message.error(res.message)
              this.$router.push({ path: from })
            }
          })
          .catch(e => {
            console.log(e)
            this.$message.error('GitHub Login Error')
          })
      }
    }
  },
}
</script>

<style scoped></style>
