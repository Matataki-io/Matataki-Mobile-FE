<template>
  <div class="buy-card">
    <div class="buy-flex">
      <h2 class="token-title">快捷购买</h2>
      <span class="center"><span class="ellipsis">{{ currentPoolSize.token_amount|| 0 }}</span> {{ token.symbol }} <svg-icon icon-class="exchange"/></span>
    </div>
    <el-input
      placeholder="输入购买数量"
      @input="inputChange"
      v-on:keypress.native="isNumber"
      v-model="form.output">
      <span slot="suffix" class="el-input__icon suffix-text">= {{ form.input || 0 }} CNY</span>
    </el-input>
    <div class="btns">
      <el-button class="btn1" @click="pay" :disabled="payBtnDisabled && isLogined">立即支付</el-button>
      <router-link class="link1" :to="{name: 'exchange', hash: '#swap', query: { output: token.symbol }}">
        <el-button class="btn2" type="primary">交易粉丝通证</el-button>        
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import { CNY } from '@/views/exchange/components/consts.js'
export default {
  props: {
    token: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      type: 'buy_token_output',
      priceSlippage: 0.01,
      currentPoolSize: {},
      payBtnDisabled: true
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    limitValue() {
      const { input, output } = this.form
      if (!this.$utils.isNull(input)) {
        return (parseFloat(input) / (1 - this.priceSlippage)).toFixed(4)
      }
      return 0
    }
  },
  watch: {
    token(val) {
      if (val) {
        this.form.outputToken = val
        if (val.id) this.getCurrentPoolSize(val.id)
      }
    }
  },
  mounted() {
  },
  methods: {
    // 构造参数
    makeOrderParams() {
      const { input, inputToken, output, outputToken } = this.form
      const limitValue = this.limitValue
      const type = this.type
      let requestParams = {
        total: this.$utils.toDecimal(input, outputToken.decimals), // 单位yuan
        title: `购买${outputToken.symbol}`,
        type, // type类型见typeOptions：add，buy_token_input，buy_token_output
        token_id: outputToken.id,
        token_amount: this.$utils.toDecimal(output, outputToken.decimals),
        limit_value: this.$utils.toDecimal(limitValue, outputToken.decimals),
        decimals: outputToken.decimals,
        pay_cny_amount: this.$utils.toDecimal(input) // this.needPay
      }
      return requestParams
    },
    createOrder() {
      const loading = this.$loading({
        lock: false,
        text: "订单创建中...",
        background: "rgba(0, 0, 0, 0.4)"
      });
      const requestParams = this.makeOrderParams()
      this.$API
        .createOrder(requestParams)
        .then(res => {
          loading.close()
          if (res.code === 0) {
            this.$router.push({ name: 'order-id', params: {id: res.data}})
          } else {
             this.$dialog.alert({
              title: '温馨提示',
              message: '订单创建失败'
            })
          }
        })
    },
    pay() {
      if (this.isLogined) {
        if (this.$utils.isNull(this.form.output)) {
          this.$message.error('请先输入购买数量')
        } else {
          this.createOrder()
        }
      } else {
        this.$store.commit('setLoginModal', true)
      }
    },
    inputChange: debounce(function (e) {
      this.getInputAmount(0, this.token.id, this.form.output)
    }, 500),
    getInputAmount(inputTokenId = 0, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = this.$utils.toDecimal(outputAmount, deciaml)
      this.payBtnDisabled = true
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then((res) => {
        this.payBtnDisabled = false
        if (res.code === 0) {
          // rmb向上取整
          if (parseFloat(res.data) >= 100) {
            this.form.input = parseFloat(this.$utils.formatCNY(res.data, deciaml)).toFixed(2)
          } else if (!this.$utils.isNull(this.form.output)) {
            this.form.input = 0.01
          } else {
            this.form.input = ''
          }
        } else {
          this.$message.error(res.message)
          this.form.input = ''
        }
      })
    },
    getCurrentPoolSize(tokenId) {
      this.$API.getCurrentPoolSize(tokenId).then(res => {
        if (res.code === 0) {
          this.currentPoolSize = {
            cny_amount: this.$utils.fromDecimal(res.data.cny_amount, 4),
            token_amount: this.$utils.fromDecimal(res.data.token_amount, 4),
            total_supply: this.$utils.fromDecimal(res.data.total_supply, 4)
          }
        }
      })
    },
    isNumber(event) {
      if (!/\d/.test(event.key) && event.key !== '.') {
        return event.preventDefault()
      }
    }
  }
}
</script>

<style scoped lang="less">
@purpleDark: #542DE0;
@white: #fff;
@black: #000;
@br10: 10px;
.suffix-text {
  color: @purpleDark;
}
.buy-card {
  background: #fff;
  padding: 14px 20px;
  // border-radius: 10px;
  margin: 10px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}
.token-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  line-height: 33px;
  padding: 0;
  margin: 0;
}
.buy-flex {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 20px;
}
.center {
  line-height: 33px;
  height: 33px;
  font-size: 14px;
}
.btns {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-top: 20px;
  .btn1, .link1 {
    width: 45%;
  }
  .btn1 {
    margin-right: 10%;
  }
  .btn2 {
    width: 100%;
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="less">
@purpleDark: #542DE0;
.buy-card {
  .btn1 {
    border-color: @purpleDark;
    color: @purpleDark;
  }
}
</style>
