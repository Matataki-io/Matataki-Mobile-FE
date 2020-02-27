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
import { sleep } from '@/common/methods'
import AuthModal from '@/components/Auth/index.vue'
import store from '@/utils/store.js'
import { getCookie } from '@/utils/cookie'

export default {
  components: {
    AuthModal
  },
  data() {
    return {
      isRouterAlive: true,
      time: null
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
  beforeCreate(){
    try {
      document.body.removeChild(document.getElementById('loading'))
    } catch (error) {
      document.body.removeChild(document.getElementById('loading'))
    }
  },
  created() {
    const { signIn, updateNotify } = this

    let accessToken = getCookie('ACCESS_TOKEN')
    let idProvider = getCookie('idProvider')

    let token = null
    // 如果有token and idProvider
    // 自动登录
    if (accessToken && idProvider) {
      try {
        accessToken = signIn({
          accessToken: accessToken,
          idProvider: idProvider
        })
        
        this.$backendAPI.accessToken = accessToken
      } catch (error) {
        accessToken = signIn({
          accessToken: accessToken,
          idProvider: idProvider
        })
        this.$backendAPI.accessToken = accessToken
      }
    }

    window.updateNotify = updateNotify
    this.getViewMode()

  },
  mounted() {
    this.removeOverflowHide()
  },
  methods: {
    ...mapActions(['signIn']),
    async getViewMode() {

      const { enable } = await import(/* webpackChunkName: "darkreader" */ 'darkreader')
      const { disable } = await import(/* webpackChunkName: "darkreader" */ 'darkreader')
      const enableDarkMode = enable
      const disableDarkMode = disable

      const viewMode = store.get('viewMode')
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
    },
    removeOverflowHide() {
      // 这段代码也是无奈之举
      // 这里的代码, 如果没有找到为什么会设置 overflow hideen, 就删除了的话, 就等着加班吧 !!!
      clearInterval(this.time)
      this.time = setInterval(() => {
        const bodyDom = document.querySelector('body')
        if (bodyDom.style.overflow) {
          const dialog = document.querySelectorAll('.el-dialog__wrapper')
          let dialogStatus = false
          // 循环 所有元素有一个不是node 说明是展开的dialog
          for (let i = 0; i < dialog.length; i++) {
            if (dialog[i].style.display !== 'none') {
              dialogStatus = true
              break
            }
          }
          // 此时body hidden 否则 auto
          if (dialogStatus) {
            bodyDom.style.overflow = 'hidden'
          } else {
            bodyDom.style.overflow = 'auto'
          }
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="less">
#app {
  /*text-align: center;*/
  margin: auto;
  height: 100%;
  max-width: 750px;
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
