<template>
  <div id="app">
    <navigation v-if="isRouterAlive">
      <router-view />
    </navigation>
    <BackTop v-if="!isPublishPage" :right="20" :bottom="70" :height="40">
      <img class="backtop" src="@/assets/img/icon_back_top.svg" alt="backtop" />
    </BackTop>
    <AuthModal v-model="loginModalShow" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapActions, mapGetters } from 'vuex'
import { accessTokenAPI } from '@/api'
import { sleep } from '@/common/methods'
import AuthModal from '@/components/Auth/index.vue'
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from 'darkreader'

export default {
  components: {
    AuthModal
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    loginModalShow: {
      get() {
        return this.$store.state.loginModalShow
      },
      set(v) {
        this.$store.commit('setLoginModal', v)
      }
    },
    isPublishPage() {
      // 如果是发布页面隐藏小火箭
      return this.$route.name === 'Publish' || this.$route.name === 'exchange'
    }
  },
  watch: {
    currentUserInfo: {
      handler(newVal, oldVal) {
        // console.debug(this.$backendAPI.accessToken.toString().includes('Promise'));
        if (
          this.$backendAPI.accessToken &&
          this.$backendAPI.accessToken.toString().includes('Promise')
        )
          return
        this.$backendAPI.accessToken = newVal.accessToken
        // console.debug('watch $backendAPI.accessToken :', this.$backendAPI.accessToken)
      },
      deep: true
    }
  },
  created() {
    const { signIn, updateNotify } = this

    let accessToken = null
    // 根据本地存储的状态来自动登陆。失败之后再重试一次
    const data = {
      accessToken: accessTokenAPI.get(),
      idProvider: Cookies.get('idProvider')
    }
    if (data.idProvider && data.accessToken) {
      // console.log('sign in form localStorage')
      try {
        accessToken = signIn(data)
      } catch (error) {
        accessToken = signIn(data)
      }
    }
    this.$backendAPI.accessToken = accessToken
    // console.debug('$backendAPI.accessToken :', this.$backendAPI.accessToken)

    window.updateNotify = updateNotify
    this.getViewMode()
  },
  mounted() {},
  methods: {
    ...mapActions(['signIn']),
    getViewMode() {
      const viewMode = localStorage.getItem('viewMode')
      if (viewMode && viewMode === 'night') {
        enableDarkMode({
          brightness: 100,
          contrast: 90,
          sepia: 10,
        })
      } else {
        disableDarkMode()
      }
    },
    updateNotify(desc) {
      const btnCommonStyle = {
        type: 'default',
        size: 'large',
        style: 'margin: 0px 5px;'
      }
      this.$Message.info({
        render: h =>
          h('span', [
            desc,
            h(
              'Button',
              {
                attrs: {
                  // icon: 'ios-refresh',
                  ...btnCommonStyle
                },
                on: {
                  click: () => window.location.reload()
                }
              },
              '立即刷新'
            )
          ]),
        duration: 0
      })
    },
    async reload() {
      this.isRouterAlive = false
      await this.$nextTick()
      await sleep(800)
      this.isRouterAlive = true
    }
  }
}
</script>

<style scoped lang="less">
#app {
  /*text-align: center;*/
  margin: auto;
  height: 100%;
}

.backtop {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.ivu-back-top-show {
  animation: slideInUp 300ms ease-in-out both;
}
</style>
