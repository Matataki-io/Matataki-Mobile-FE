<template>
  <section v-show="!isLogin" class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="ss-form">
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          type=""
          :placeholder="$t('rule.loginEmailMessage')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          :placeholder="$t('rule.setPassword')"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input
          v-model="registerForm.repassword"
          type="password"
          :placeholder="$t('rule.setPasswordAgain')"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="smscode">
        <div class="code-contaniner">
          <el-input
            v-model="registerForm.smscode"
            :placeholder="$t('rule.emailCode')"
            autocomplete="off"
          ></el-input>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!!timer || loading"
            @click="sendCode"
            >{{ timer ? `${count}S` : $t('auth.getEmailCode') }}</el-button
          >
        </div>
      </el-form-item>
      <el-form-item class="ss-btn">
        <el-button type="primary" @click="submitRegisterForm">{{ $t('registered') }}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
/* eslint-disable */
const TIME_COUNT = 60
import utils from "@/utils/utils";
export default {
  name: 'RegisterContent',
  data() {
    const checkEmail = async (rule, value, callback) => {
      if (value === '') {
        return callback(new Error(this.$t('rule.loginEmailMessage')))
      } else {
        const res = await this.$backendAPI.verifyEmail(value)
        if (res.data.data) {
          callback(new Error(this.$t('rule.emailHasBeenRegistered')))
        } else {
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('rule.inputPasswordAgain')))
      } else if (value !== this.registerForm.password) {
        callback(new Error(this.$t('rule.twiceInputPasswordInconsistent')))
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('rule.emailCode')))
      }


      if (!Number.isInteger(Number(value))) {
        callback(new Error(this.$t('rule.inputNumber')))
      } else if (value.toString().length !== 6) {
        callback(new Error(this.$t('rule.inputLengthNumber')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      count: '',
      timer: null,
      isDisabled: false,
      registerForm: {
        email: '',
        password: '',
        repassword: '',
        smscode: ''
      },
      registerRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' },
          { type: 'email', message: this.$t('rule.emailMessage'), trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: this.$t('rule.passwordMessage'), trigger: 'blur' },
          { min: 8, max: 16, message: this.$t('rule.passwordLengthMessage', [8, 16]), trigger: 'blur' }
        ],
        repassword: { validator: validatePass2, trigger: 'blur' },
        smscode: { validator: checkCode, trigger: 'blur' }
      },
    }
  },
  methods: {
    registerInitGT(cb) {
      this.$backendAPI.registerGT().then(response => {
        const res = response.data
        window.initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          gt: res.gt,
          challenge: res.challenge,
          offline: !res.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: res.new_captcha, // 用于宕机时表示是新验证码的宕机
          product: "bind", // 产品形式，包括：float，popup
          width: "300px"
          // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
        }, (captchaObj) => {
          this.captchaObj = captchaObj;
          captchaObj.onReady(() => {
            captchaObj.verify();
          }).onSuccess(() => {
            const result = captchaObj.getValidate();
            if (!result) {
              this.$message.error(this.$t('rule.pleaseDoneRule'))
            } else {
              cb(result);
            }
            // this.validateGT(result, captchaObj);
          });
        });
      })
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
    confirmSendCode(gt) {
      this.$backendAPI.getCaptcha(this.registerForm.email, {
        geetest_challenge: gt.geetest_challenge,
        geetest_validate: gt.geetest_validate,
        geetest_seccode: gt.geetest_seccode
      }).then(res => {
        if (res.data.code === 0) {
          this.countDown()
          this.successToast(this.$t('success.codeSendSuccess'))
        } else {
          this.failToast(this.$t('error.codeSendFail'))
        }
      })
    },
    sendCode() {
      this.$refs.registerForm.validateField('email', async (error) => {
        if (error) {
          console.error('sendCode error', error)
        } else {
          this.registerInitGT(this.confirmSendCode)
        }
      })
    },
    // 倒计时函数
    countDown() {
      if (!this.timer) {
        this.count = TIME_COUNT
        this.text = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.text = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 注册提交
    async submitRegisterForm() {
      await this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          let params = {
            email: this.registerForm.email,
            captcha: this.registerForm.smscode,
            password: this.registerForm.password
          }
          // 检查是否有邀请id
          let referral = utils.getCookie('referral')
          if (referral) Object.assign(params, { referral: referral })

          try {
            this.loading = true
            const res = await this.$backendAPI.register(params)
            console.log(res)
            if (res.status === 200 && res.data.code === 0) {
              this.successToast(this.$t('success.registeredSuccess'))
              this.$emit('switch')
            } else {
              this.failToast(res.data.message)
            }
            this.loading = false
          } catch (error) {
            this.failToast(this.$t('error.registeredFail'))
            this.loading = false
          }
        } else {
          console.log(this.$t('error.fail'))
          return false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.register {
  .code-contaniner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      margin-left: 10px;
      text-align: center;
    }
  }
}
</style>
