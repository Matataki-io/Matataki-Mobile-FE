<template>
  <div class="mw help">
    <BaseHeader :pageinfo="{ title: $t('setting') }" customize-header-bc="#fff" :has-bottom-border-line="true" />
    <div class="help-block">
      <a class="help-list" href="https://www.yuque.com/matataki" target="_blank">
        <span class="help-list-title">帮助和支持</span>
        <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>
      <a
        v-for="(item, index) in helpDoc"
        :key="index"
        class="help-list"
        target="_blank"
      >
        <span class="help-list-title">{{ item.title }}</span>
        <img src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>
    </div>

    <div class="help-block" v-if="isLogined">
      <div class="help-list">
        <span class="help-list-title">{{ $t('user.transfer') }}</span>
        <span class="help-list-sub">
          <van-switch
            v-model="articleTransfer"
            size="22px"
            active-color="#542de0"
            inactive-color="#F0F0F0"
            @change="changeTransfer"
          />
        </span>
      </div>


      <router-link
        class="help-list"
        :to="{name: 'setting-account'}"
      >
        <span class="help-list-title">{{ $t('helpPage.accountSetting') }}</span>
        <img src="@/assets/img/icon_arrow.svg" alt="view" />
      </router-link>
    </div>

    <div class="help-block">
      <a
        class="help-list"
        href="https://github.com/Matataki-io/Matataki-Mobile-FE"
        target="_blank"
      >
        <span class="help-list-title">{{ $t('user.about') }}</span>
        <div class="help-list-right">
          <span class="help-list-sub">{{ $t('user.github') }}</span>
          <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
        </div>
      </a>
      <a class="help-list" href="https://www.yuque.com/matataki/matataki_version" target="_blank">
        <span class="help-list-title">{{ $t('user.updateRecord') }}</span>
        <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>
      <a class="help-list" href="https://t.me/smartsignature_io" target="_blank">
        <span class="help-list-title">{{ $t('user.tg') }}</span>
        <img class="arrow" src="@/assets/img/icon_arrow.svg" alt="view" />
      </a>
    </div>

    <div class="help-block">
      <div class="help-list">
        <span class="help-list-title">夜间模式</span>
        <span class="help-list-sub">
          <van-switch
            v-model="siteViewMode"
            size="22px"
            active-color="#542de0"
            inactive-color="#F0F0F0"
            @change="changeViewMode"
          />
        </span>
      </div>
    </div>
    <div class="help-block">
      <div class="help-list" @click="clearCache">
        <span class="help-list-title">一键清除缓存</span>
        <img src="@/assets/img/icon_arrow.svg" alt="view" />
      </div>
    </div>
    <div class="signout">
      <p class="version">-version{{ version || '1.0.0' }}-</p>
    </div>
  </div>
</template>

<script>
import store from '@/utils/store.js'
import packageConfig from '../../../package.json'
import { removeCookie, clearAllCookie } from '@/utils/cookie'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Help',
  data() {
    return {
      articleTransfer: false,
      siteViewMode: false,
      // 隐私政策与用户协议
      helpDoc: [
        {
          title: this.$t('user.userProtocol'),
          name: 'agreement'
        },
        {
          title: this.$t('user.privacyPolicy'),
          name: 'policy'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    version() {
      return packageConfig.version
    }
  },
  created() {
    this.getMyUserData()
    this.getViewMode()
  },
  methods: {
    ...mapActions(['resetAllStore']),
    getViewMode() {
      const viewMode = store.get('viewMode')
      if (viewMode && viewMode === 'night') {
        this.siteViewMode = true
      } else {
        this.siteViewMode = false
      }
    },
    async changeViewMode(value) {
      const { enable } = await import(/* webpackChunkName: "darkreader" */ 'darkreader')
      const { disable } = await import(/* webpackChunkName: "darkreader" */ 'darkreader')
      const enableDarkMode = enable
      const disableDarkMode = disable
      if (value) {
        store.set('viewMode', 'night')
        enableDarkMode({
          brightness: 100,
          contrast: 90,
          sepia: 10,
        })
      } else {
        store.set('viewMode', 'day')
        disableDarkMode()
      }
    },
    jumpTo(params) {
      if (!params.name) return
      this.$router.push(params)
    },
    // 获取用户信息 - 转让状态
    async getMyUserData() {
      if (!this.isLogined) return
      try {
        const res = await this.$API.getMyUserData()
        if (res.status === 200 && res.data.code === 0) this.articleTransfer = !!res.data.data.accept
        else console.log('获取转让状态失败')
      } catch (error) {
        console.log(`获取转让状态失败${error}`)
      }
    },
    // 改变转让状态
    async changeTransfer(status) {
      try {
        this.articleTransfer = status
        let accept = status ? 1 : 0
        const res = await this.$API.setProfile({ accept })
        if (res.code === 0)
          return this.$toast.success({ duration: 1000, message: res.message })
        else {
          this.$toast.fail({ duration: 1000, message: res.message })
          this.articleTransfer = !status
        }
      } catch (error) {
        this.articleTransfer = !status
        console.log(`转让状态错误${error}`)
        this.$toast.fail({ duration: 1000, message: this.$t('error.fail') })
      }
    },
    clearCache() {
      // 没有用vuex的signOut方法, 直接window reload了
      this.$confirm('清除浏览器缓存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'message-box__mobile'
      }).then(() => {

        // 出错后弹出框提示
        const alertDialog = () => {
          this.$alert('很抱歉，退出登录失败，点击确定刷新', '温馨提示', {
            showClose: false,
            type: 'success',
            customClass: 'message-box__mobile',
            callback: action => {
              window.location.reload()
            }
          })
        }

        // 重置all store
        this.resetAllStore()
          .then(res => {
            clearAllCookie()
            // 防止没有清除干净
            removeCookie('ACCESS_TOKEN')
            removeCookie('idProvider')
            removeCookie('referral')

            store.clearAll()

            store.clear()
            sessionStorage.clear()
            
            this.$toast.success({
              duration: 1500,
              message: '清除成功'
            })
            
            this.$router.push({ name: 'index' })

            // 通知刷新其他页面
            setTimeout(() => {
              this.$userMsgChannel.postMessage('logout')
            }, 2000)

          }).catch(err => {
            console.log(err)
            alertDialog()
          })
        
      }).catch(() => { })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
