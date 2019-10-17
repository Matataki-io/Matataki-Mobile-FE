<template>
  <div class="main exchange">
    <van-nav-bar title="粉丝币交易所" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="outer-container">
      <img class="ma-banner" src="@/assets/img/exchange-banner.png" alt="banner" />
      <div class="p-w">
        <el-tabs type="border-card">
          <el-tab-pane label="交易">
            <Swap />
          </el-tab-pane>
          <!-- <el-tab-pane label="赠送">
            <div style="color: white;text-align: center;">
              <a href="/tokens">跳转到我的粉丝币页面</a>
            </div>
          </el-tab-pane>-->
          <el-tab-pane label="流动金池">
            <Pool />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swap from './components/Swap'
import Pool from './components/Pool'

export default {
  components: {
    Swap,
    Pool
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.checkLogin()
    })
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: 'index' })
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
    background-color: @purpleDark;
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
    color: @purpleDark;
    font-size: 1rem;
    box-sizing: border-box;
    flex-flow: row nowrap;
    border-width: 1px;
    border-style: solid;
    border-color: @purpleDark;
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
    border-color: @purpleDark;
    color: @purpleDark;
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
  .ma-banner {
    width: 100%;
  }
}
.p-w {
  width: 100%;
  margin: 20px auto 0 auto;
}
</style>
