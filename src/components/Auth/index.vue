<template>
  <Modal
    v-model="showModal"
    footer-hide
    class-name="modalCenter signupModal"
  >
    <section v-show="step === 1" class="auth-main">
      <div class="auth-title-container">
        <span :class="['auth-title', {'active':isLogin}]" @click="isLogin=true">登录</span>
        <span :class="['auth-title', {'active':!isLogin}]" @click="isLogin=false">注册</span>
      </div>
      <div class="loginRegister">
        <Login v-show="isLogin" @switch="isLogin = false" @hide="showModal = false"/>
        <Register v-show="!isLogin" @switch="isLogin = true"/>
      </div>
    </section>
    <Wallet v-show="step === 2" />
    <div class="footer-arrow" @click="step === 1 ? (step = 2) : (step = 1)">
      <div v-if="step === 2" class="arrow">
        <van-icon name="arrow-left" />
      </div>
      <span>{{ step === 1 ? '查看支持的钱包' : '返回登录' }}</span>
      <div v-if="step === 1" class="arrow">
        <van-icon name="arrow" />
      </div>
    </div>
  </Modal>
</template>

<script>
/* eslint-disable */
import Login from './login'
import Register from './register'
import Wallet from './wallet'

export default {
  name: 'AuthModal',
  components: {
    Wallet,
    Login,
    Register
  },
  data() {
    return {
      isLogin: true,
      step: 1,
      showModal: false,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showModal(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.showModal = val
    }
  }
}
</script>

<style src="./auth.less" lang="less" scoped>
</style>
<style lang="less">
.ss-form {
  input {
    background: #F1F1F1;
  }
}
.ss-btn {
  button {
    width: 100%;
    background-color: #000000;
    border-color: #000000;
    &:hover, &:active, &:focus {
      background-color: #333333;
      border-color: #333333;
    }
  }
}
</style>
