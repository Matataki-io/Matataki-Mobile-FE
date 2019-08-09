<template>
  <section class="login">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="ss-form">
      <el-form-item prop="email">
        <el-input v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button type="primary" @click="submitLoginForm">登录</el-button>
        <div class="bottom-tip">
          <a href="javascript:void(0);">忘记密码</a> | <a href="javascript:void(0);" @click="$emit('switch')">注册</a>
        </div>
      </el-form-item>
    </el-form>
    <div class="oauth-box">
      <h1 class="oauth-title">第三方账号登录</h1>
      <div class="oauth">
        <div class="oauth-bg bg-gray" @click="walletLogin('EOS')">
          <img src="@/assets/newimg/eos_icon.svg" alt="EOS">
        </div>
        <div class="oauth-bg bg-blue" @click="walletLogin('ONT')">
          <img src="@/assets/img/icon_logo_ont.svg" alt="ONT">
        </div>
        <div class="oauth-bg bg-purple" @click="walletLogin('GitHub')">
          <img src="@/assets/img/github.png" alt="github">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from 'vuex'
import { idProvider } from './icon.js'

export default {
  name: 'LoginContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入邮箱地址'))
      } else {
        const res = await this.$backendAPI.verifyEmail(value)
        if (res.data.data) {
          callback()
        } else {
          callback(new Error('邮箱尚未注册'))
        }
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
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['userConfig']),
    ...mapGetters(['currentUserInfo'])
  },
  methods: {
    ...mapActions(['signIn']),
    async walletLogin(type) {
      if (type === 'GitHub') {
        this.$router.push({ name: 'Login' })
        return
      }
      await this.signInx(type)
      this.change(false)
    },
    async signInx(type) {
      try {
        await this.signIn({ idProvider: type })
        this.$backendAPI.accessToken = this.currentUserInfo.accessToken
      } catch (error) {
        try {
          await this.signIn({ idProvider: type })
          this.$backendAPI.accessToken = this.currentUserInfo.accessToken
        } catch (err) {
          console.log(err)
          this.failToast('登陆失败')
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
      this.$toast.fail({
        duration: 1500,
        message: msg
      })
    },
    // 登录提交
    submitLoginForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$backendAPI.login({
              username: this.loginForm.email,
              password: this.loginForm.password
            })
            if (res.data.code === 0) {
              this.$store.commit('setAccessToken', res.data.data)
              this.$store.commit('setUserConfig', { idProvider: 'email' })
              this.successToast('登录成功')
              this.$emit('hide')
            } else {
              this.failToast(`登录失败，${res.data.message}`)
            }
          } catch (error) {
            this.failToast('登录失败，请联系管理员')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bottom-tip {
  font-size: 14px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
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
    margin-bottom: 20px;
    font-weight: 400;
  }
  .oauth {
    .flexCenter();
    .oauth-bg {
      cursor: pointer;
      .flexCenter();
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 6px;
      img {
        width: 20px;
      }
      +.oauth-bg {
        margin-left: 30px;
      }
    }
  }
}
.bg-black {
  background: #000000;
}
.bg-gray {
  background: #333333;
}
.bg-blue {
  background: #4d9afd;
}
.bg-purple {
  background: #882592;
}

.flexCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
