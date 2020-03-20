<template>
  <section class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="ss-form"
    >
      <el-form-item prop="email">
        <el-input
          v-model="loginForm.email"
          :placeholder="$t('rule.loginEmailMessage')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          :placeholder="$t('rule.passwordMessage')"
          show-password
        />
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button
          type="primary"
          @click="submitLoginForm"
        >
          {{ $t('login') }}
        </el-button>
        <div class="bottom-tip">
          <span class="red">{{ $t('auth.firstLogin') }}</span>
          <a
            href="javascript:void(0);"
            @click="$emit('switch')"
          >忘记密码</a>
          <!-- <a href="javascript:void(0);" @click="$emit('switch')">{{ $t('registered') }}</a> -->
        </div>
        <!-- <span class="red">{{ $t('auth.pcLoginViewPointDetail') }}</span> -->
      </el-form-item>
    </el-form>
    <div class="oauth-box">
      <h1 class="oauth-title">
        {{ $t('auth.otherAccount') }}
      </h1>
      <div class="oauth">
        <div>
          <div
            class="oauth-bg bg-gray"
            @click="walletLogin('EOS')"
          >
            <svg-icon
              class="eos"
              icon-class="eos_login"
            />
          </div>
          EOS
        </div>
        <div class="oauth-card">
          <div
            class="oauth-bg bg-gray"
            @click="walletLogin('MetaMask')"
          >
            <svg-icon
              class="eos"
              icon-class="metamask"
            />
          </div>
          MetaMask
        </div>
        <div class="oauth-card">
          <div
            class="oauth-bg bg-blue"
            @click="walletLogin('ONT')"
          >
            <img
              src="@/assets/img/icon_logo_ont.svg"
              alt="ONT"
            >
          </div>
          ONT
        </div>
        <div class="oauth-card">
          <div
            class="oauth-bg bg-purple"
            @click="walletLogin('GitHub')"
          >
            <svg-icon
              class="github"
              icon-class="github"
            />
          </div>
          GitHub
        </div>
      </div>
      <div class="oauth">
        <div class="oauth-card">
          <div
            class="oauth-bg bg-green"
            @click="getWeixinCode"
          >
            <svg-icon
              class="github"
              icon-class="weixin"
            />
          </div>
          微信
        </div>
        <div class="oauth-card">
          <div
            class="oauth-bg bg-tg"
            @click="telegramLogin"
          >
            <svg-icon
              class="github"
              icon-class="telegram2"
            />
          </div>
          Telegram
        </div>
        <div class="oauth-card">
          <div
            class="oauth-bg bg-twitter"
            @click="walletLogin('Twitter')"
          >
            <svg-icon
              class="twitter"
              icon-class="twitter"
            />
          </div>
          Twitter
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from 'vuex'
import { idProvider } from './icon.js'
import utils from "@/utils/utils";

export default {
  name: 'LoginContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error(this.$t('rule.loginEmailMessage')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' },
          { type: 'email', message: this.$t('rule.emailMessage'), trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: this.$t('rule.passwordMessage'), trigger: 'blur' },
          { min: 8, max: 16, message: this.$t('rule.passwordLengthMessage', [8, 16]), trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    ...mapState(['userConfig']),
    ...mapGetters(['currentUserInfo'])
  },
  methods: {
    ...mapActions(['signIn', 'getMyUserData']),
    ...mapActions("metamask", ["fetchAccount", "login"]),
    telegramLogin() {
      this.$store.commit('setLoginModal', false)
      this.$router.push({ name: 'login-telegram', query: { from: 'login' } })
    },
    getWeixinCode() {
      const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase())
      if(isWeixin()) {
        this.setPathToSession('wechatFrom')
        this.$router.push({ name: 'WeixinLogin', query: { from: this.$route.name } })
      } else {
        this.$message.error('请在微信中打开此网页')
      }
    },
    setPathToSession(name) {
      if (window.sessionStorage) {
        const { pathname, search, hash } = window.location
        sessionStorage.setItem(name, pathname + search + hash)
      } else {
        console.log('don\'t support sessionStorage')
      }
    },
    async loginWithMetaMask() {
      this.loading = true;
      this.fetchAccount();
      try {
        let res = await this.login();
        this.$store.commit("setUserConfig", { idProvider: "MetaMask" });
        this.loading = false;
        this.$message.closeAll();
        this.$message.success(res);
        await this.$store.commit("setLoginModal", false);
        window.location.reload();
      } catch (error) {
        console.error(error);
        this.loading = false;
        this.$message.closeAll();
        if (error.message) {
          this.$message.error(error.message);
        } else {
          this.$message.error(error.toString());
        }
      }
    },
    async twitterLogin() {
      this.loading = true;
      try {
        const res = await this.hello('twitter').login()
        const res2 = await this.$API.twitterLogin({
          oauth_token: res.authResponse.oauth_token,
          oauth_token_secret: res.authResponse.oauth_token_secret
        });
        await this.$store.commit('setLoginModal', false)
        this.loading = false;
        await this.$store.commit('setAccessToken', res2.data)
        await this.$store.commit('setUserConfig', { idProvider: 'twitter' })
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.$message.closeAll();
        this.$message.error(error.toString());
      }
    },
    async walletLogin(type) {
      if (type === 'GitHub') {
        this.setPathToSession('githubFrom')
        this.$router.push({
          name: "login-github"
        });
        return
      } else if (type === 'MetaMask') {
        this.loginWithMetaMask();
        return
      } else if (type === "Twitter") {
        this.$message.warning('Twitter登录功能正在开发中');
        // this.twitterLogin();
        return;
      }
      await this.signInx(type)
      // this.change(false)
      this.$emit('hide')
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type })
        this.getMyUserData()
        // this.$userMsgChannel.postMessage("login")
        // window.location.reload() // 登陆完成刷新一次
        
      } catch (error) {
        try {
          await this.signIn({ idProvider: type })
        this.getMyUserData()

          // this.$userMsgChannel.postMessage("login")
          // window.location.reload() // 登陆完成刷新一次

        } catch (err) {
          console.log(err)
          this.failToast(this.$t('error.loginFail'))
        }
      }
    },
    successToast(msg) {
      this.$toast.success({
        duration: 1500,
        message: msg
      })
    },
    failToast(msg) {
      this.$toast({
        duration: 1500,
        message: msg
      })
    },
    // 登录提交
    submitLoginForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$API.login({
              username: this.loginForm.email,
              password: this.loginForm.password
            })
            if (res.code === 0) {
              this.$store.commit('setAccessToken', res.data)
              this.$store.commit('setUserConfig', { idProvider: 'Email' })
              // localStorage.setItem('idProvider', config.idProvider)
              this.successToast(this.$t('success.loginSuccess'))
              this.$emit('hide')
              this.$userMsgChannel.postMessage("login")
              window.location.reload() // 登陆完成刷新一次
            } else {
              this.failToast(this.$t('error.loginFailPasswordOrAccount'))
            }
          } catch (error) {
            this.failToast(this.$t('error.loginFail'))
          }
        } else {
          console.log(this.$t('error.loginFail'))
          return false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.bottom-tip {
  width: 100%;
  font-size: 14px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.red {
  color:#d74e5a;
}
.oauth-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  .oauth-title {
    font-size: 16px;
    color: #000000;
    margin-bottom: 10px;
    font-weight: 400;
  }
  .oauth {
    margin-top: 10px;
    .eos {
      font-size: 24px;
    }
    .github, .twitter {
      color: #fff;
      font-size: 22px;
    }
    .flexCenter();

    .oauth-card {
      margin-left: 1rem;
      .flexCenter();
      flex-direction: column;
    }
    .oauth-bg {
      cursor: pointer;
      .flexCenter();
      width: 42px;
      height: 42px;
      border-radius: 50%;
      padding: 6px;
      color: #fff;
      img {
        width: 20px;
      }
    }
  }
}
.bg-black {
  background: #000000;
}
.bg-gray {
  background: #333;
}
.bg-blue {
  background: #4d9afd;
}
.bg-purple {
  background: #882592;
}
.bg-green {
  background: #44b549;
}
.bg-tg {
  background: #0088cc;
}
.bg-twitter {
  // background: #00ACED;
  background: #b2b2b2;
}
.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}


</style>
