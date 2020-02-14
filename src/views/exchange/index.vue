<template>
  <div class="main exchange">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: 'Fan票交易所' }"
      customize-header-bc="#fff"
    />
    <div class="outer-container">
      <img class="ma-banner" src="@/assets/img/exchange-banner.png" alt="banner" />
      <div class="p-w">
        <el-tabs type="border-card" v-model="tab" @tab-click="tabClick">
          <el-tab-pane label="交易" name="#swap">
            <Swap />
          </el-tab-pane>
          <!-- <el-tab-pane label="赠送">
            <div style="color: white;text-align: center;">
              <a href="/tokens">跳转到我的Fan票页面</a>
            </div>
          </el-tab-pane>-->
          <el-tab-pane label="流动金池" name="#pool">
            <Pool />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swap from './components/swap.vue'
import Pool from './components/pool.vue'
import store from '@/utils/store.js'

export default {
  components: {
    Swap,
    Pool
  },
  data() {
    return {
      tab: '#swap'
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {},
  mounted() {
    this.handleRoute()
    this.$nextTick(() => {
      this.checkLogin()
    })
  },
  methods: {
    handleRoute() {
      const hashArr = ['#swap', '#pool']
      const hash = this.$route.hash
      console.log('hash:', hash)
      if (hashArr.includes(hash)) this.tab = hash
      else this.tab = '#swap'
    },
    tabClick(e) {
      this.$router.replace({ 
        hash: e.name,
        query: this.$route.query
      })
    },
    onClickLeft() {
      this.$router.push({ name: 'index' })
    },
    getWeixinCode() {
      const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
      // 微信逻辑处理
      if (isWeixin()) {
        const { code, state } = this.$route.query
        const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
        const appid = 'wx95829b6a2307300b'
        const scope = 'snsapi_base'
        const redirectUri = `${VUE_APP_WX_URL}/exchange`
        if (!code || state !== 'weixin') {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
        } else {
          this.$API.getWeixinOpenId(code).then(res => {
            store.set('WX_OPENID', res.openid)
          })
        }
      }
    },
    checkLogin() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
    }
  }
}
</script>
<style lang="less">
@import './var.less';
.exchange {
  .el-tabs--border-card {
    border: none;
    box-shadow: none;
  }
  .el-tabs--border-card > .el-tabs__header {
    background-color: @bg-color;
    border: none;
  }
  .el-tabs__content {
    background: @bg-color;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: white;
    background-color: #542de0;
  }
  .el-tabs__nav {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 2.5rem;
    background-color: @bg-color;
    flex-flow: row nowrap;
    border-radius: 3rem;
    width: 200px;
  }
  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
  .el-tabs__item {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    height: 2.5rem;
    cursor: pointer;
    color: #542de0;
    font-size: 1rem;
    box-sizing: border-box;
    flex-flow: row nowrap;
    border-width: 1px;
    border-style: solid;
    border-color: #542de0;
    border-image: initial;
    flex: 1 0 auto;
    outline: none;
    text-decoration: none;
    &:first-child {
      border-top-left-radius: @borderRadius6;
      border-bottom-left-radius: @borderRadius6;
    }
    &:last-child {
      border-top-right-radius: @borderRadius6;
      border-bottom-right-radius: @borderRadius6;
    }
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    border-color: #542de0;
    color: #542de0;
    width: 100px;
  }
}
</style>
<style lang="less" scoped>
@import './var.less';
.main {
  min-height: 100%;
  background: @bg-color;
}
.outer-container {
  width: 100%;
  margin: auto;
  position: relative;
  padding-top: 45px;
  .ma-banner {
    width: 100%;
  }
}
.p-w {
  width: 100%;
  margin: 20px auto 0 auto;
}
</style>
