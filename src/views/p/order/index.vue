<template>
  <div class="order">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '支付订单' }"
      customize-header-bc="#fff"
    />
    <div class="img-container">
      <img src="@/assets/img/m_logo.png" alt="logo" class="logo" />
    </div>
    <!-- <p>请仔细核对订单信息，如果有误请取消后再次尝试</p> -->
    <van-cell-group>
      <van-cell title="交易账号" :value="currentUserInfo.nickname || currentUserInfo.name" />
      <van-cell title="交易类型" :value="tradeType" />
      <van-cell title="创建时间" :value="friendlyTime" />
      <van-cell title="订单编号" :value="tradeNo" value-class="longValue" />
    </van-cell-group>
    <div class="order-item">
      <el-table
        header-cell-class-name="grayHeader"
        :data="orderItems"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="品名">
        </el-table-column>
        <el-table-column
          prop="operating"
          label="操作">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="total"
          label="小计">
        </el-table-column>
      </el-table>
    </div>
    <div class="flexBox">
      <span>预期价格波动：1%
      </span>
      <div>合计：<span class="money">¥ {{cnyAmount.toFixed(2)}}</span></div>
    </div>
    <div class="flexBox">
      <div>
        <el-checkbox v-model="useBalance" @change="useBalanceChange">使用余额（¥ {{balance}}）</el-checkbox>
      </div>
      <div>抵扣：<span class="money">¥ {{deduction.toFixed(2)}}</span></div>
    </div>
    <!-- <div class="flexBox">
      <div></div>
      <div>
        应付：
        <span class="money">{{needPay}} CNY</span>
      </div>
    </div> -->
    <div class="tip">
      <p>
        <van-icon name="info-o" />
         您的交易可能由于正常的价格波动而失败，预置币格波动区间将有助于您的交易成功。交易成功后，多支付的金额会退回。
      </p>
      <p>
        <van-icon name="info-o" />
        CNY 交易金额精度大于 0.01 时会自动进位支付，多支付的金额会保留在您的CNY账户中。
      </p>
      
    </div>
    <van-submit-bar
      :price="needPay * 100"
      label="应付："
      button-text="确认支付"
      tip="请仔细核对订单信息，如果有误请取消后再次尝试"
      tip-icon="info-o"
      :loading="loading"
      @submit="onSubmit"
    />
    <!-- <template v-if="needPay > 0">
      <div v-if="isWeixin" class="wxpay-btn">
        <el-button type="primary" @click="weixinPay">
          使用微信支付
          <svg-icon icon-class="wxpay" class="wxpay-icon" />
        </el-button>
      </div>
      <QRCode v-else :pay-link="order.code_url" />
    </template>
    <div v-else class="payBtnBox">
      <el-button type="primary" @click="balancePay">确认支付</el-button>
    </div> -->
    <el-dialog
      title=""
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="qrcodeShow"
      :before-close="handleClose"
      width="300px">
      <QRCode :pay-link="payLink" />
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "@/views/order/components/Qrcode";
import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import moment from "moment";
const interval = 5000;
export default {
  name: "Order",
  data() {
    return {
      timer: null,
      tradeNo: 0,
      order: {},
      balance: 0,
      loading: false,
      useBalance: false,
      form: {
        input: '',
        inputToken: {},
        output: '',
        outputToken: {},
        base: '',
        limitValue: ''
      },
      qrcodeShow: false,
      payLink: '',
      orderItems: []
    };
  },
  components: { QRCode },
  computed: {
    ...mapGetters(["currentUserInfo"]),
    tradeType() {
      return '购买文章'
    },
    cnyAmount() {
      if (this.order.total) {
        return utils.up2points(utils.fromDecimal(this.order.total))
      } else return 0
    },
    friendlyTime() {
      return moment(this.order.create_time).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    // 是否是微信账户
    isWeixinAccount() {
      return this.currentUserInfo.idProvider === "weixin";
    },
    // 是否处于微信浏览器
    isInWeixin() {
      const isWeixin = () => /micromessenger/.test(navigator.userAgent.toLowerCase());
      return isWeixin()
    },
    // 扣除
    deduction() {
      let input = parseFloat(this.cnyAmount)
      let balance = parseFloat(this.balance);
      let result = 0;
      if (this.useBalance) {
        if (balance >= input) {
          result = input;
        } else {
          result = balance;
        }
      } else {
        result = 0;
      }
      return utils.down2points(result);
    },
    needPay() {
      // 支付金额向上取整
      let input = parseFloat(this.cnyAmount)
      let deduction = this.deduction;
      if (this.useBalance) {
        if (deduction >= input) {
          return 0;
        } else {
          return input - deduction;
        }
      } else {
        return input;
      }
    }
  },
  mounted() {
    this.getOrderData()
    this.getUserBalance()
    this.getWeixinOpenId()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    handleClose() {
      clearInterval(this.timer)
      this.qrcodeShow = false
    },
    onSubmit() {
      this.loading = true
      console.log('this.needPay', this.needPay);
      if (this.needPay > 0) {
        this.weixinPay()
      } else {
        this.balancePay()
      }
    },
    alert(message) {
      this.$dialog.alert({
        title: '温馨提示',
        message: `${message}，点击确定返回`
      }).then(() => {
        this.$router.go(-1)
      });
    },
    getOrderData() {
      const id = this.$route.params.id
      this.tradeNo = id
      this.$API.getArticleOrder(id).then(res => {
        if (res.code === 0) {
          const status = Number(res.data.status)
          if(status === 7 || status === 8) {
            this.alert('订单支付已失败')
          }
          if(status === 6 || status === 9) {
            this.alert('订单已支付')
          }
          this.order = res.data
          this.useBalance = Boolean(res.data.use_balance)
          this.orderItems = this.handleOrderItem(res.data.items)
        } else {
          this.alert('订单不存在')
        }
      })
    },
    handleOrderItem(items) {
      let result = []
      const t1 = items.orderPriceItem
      const t2 = items.orderTokenItem
      if (t1) {
        result.push({
          name: t1.symbol,
          operating: '支付',
          amount: utils.fromDecimal(t1.amount),
          total: utils.up2points(utils.fromDecimal(t1.price)) + ' CNY'
        })
      }
      if (t2) {
        result.push({
          name: t2.symbol,
          operating: '购买',
          amount: utils.fromDecimal(t2.token_amount),
          total: utils.up2points(utils.fromDecimal(t2.cny_amount)) + ' CNY',
        })
      }
      return result
    },
    // 是否使用余额修改
    useBalanceChange(v) {
      clearInterval(this.timer);
      this.$API.updateArticleOrder(this.tradeNo, { useBalance: Number(v) }).then(res => {
        if (res.code === 0) {
          // this.getOrderData()
        }
      })
    },
    // 使用余额支付
    balancePay() {
      this.$API.handleAmount0(this.tradeNo).then(res => {
        if (res.code === 0) {
          this.alert('交易成功')
        }
      })
    },
    // 使用微信支付
    weixinPay() {
      const { tradeNo } = this
      // 当前是否处于微信浏览器中
      if (this.isInWeixin) {
        let openid = ''
        if (this.isWeixinAccount) { // 微信账号直接使用JSAPI微信支付
          openid = this.currentUserInfo.name
        } else { // 不是微信账号需要先获取openid
          openid = window.localStorage.getItem('WX_OPENID')
        }
        this.$API.ArticleJsapiPay(tradeNo, openid).then(res => {
          this.weakWeixinPay(res)
        })
      } else { // 弹出NATIVE支付二维码
        this.$API.articleNativePay(tradeNo).then(res => {
          this.loading = false
          this.payLink = res.code_url
          this.qrcodeShow = true
          this.timer = setInterval(() => {
            this.getOrderStatus(this.order.trade_no)
          }, interval)
        })
      }
      const openid = this.currentUserInfo.name;
    },
    getWeixinOpenId() {
      if (!this.isInWeixin) return
      if (this.isWeixinAccount) return
      if (window.localStorage.getItem('WX_OPENID')) return
      const { code, state } = this.$route.query
      if (!code || state !== 'weixin') {
        const VUE_APP_WX_URL = process.env.VUE_APP_WX_URL
        const appid = 'wx95829b6a2307300b'
        const scope = 'snsapi_base'
        const redirectUri = `${VUE_APP_WX_URL}${this.$route.path}`
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=weixin#wechat_redirect`
      } else {
        this.$API.getWeixinOpenId(code).then(res => {
          if (res.openid) {
            window.localStorage.setItem('WX_OPENID', res.openid)
          }
        })
      }
    },
    // 唤起JS微信支付
    weakWeixinPay(order) {
      const { appId, timeStamp, nonceStr, signType, paySign } = order;
      const self = this;
      function onBridgeReady() {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId,
            timeStamp,
            nonceStr,
            package: order.package,
            signType,
            paySign
          },
          function(res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              self.alert('交易成功')
            }
          }
        );
      }
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
    // 获取用户账户余额
    getUserBalance() {
      this.$API.getCNYBalance().then(res => {
        this.balance = utils.fromDecimal(res);
      });
    },
    // 获取订单状态
    getOrderStatus(tradeNo) {
      this.$API.getArticleOrder(tradeNo).then(res => {
        if (res.code === 0) {
          const status = Number(res.data.status)
          if (status === 7 || status === 8) {
            clearInterval(this.timer);
            this.alert('交易失败，等待退款');
          }
          if (status === 6 || status === 9) {
            clearInterval(this.timer);
            this.alert('交易成功');
          }
        }
      });
    },
    successNotice(text) {
      this.$message.success({
        message: text,
        duration: 4000
      });
    },
    errorNotice(text) {
      this.$message.error({
        message: text
      });
    },
    makeOrderParams() {
      const requestParams = {
        items: []
      }
      // token未支付
      if (!this.tokenHasPaied) {
        const { output, outputToken } = this.form
        requestParams.items.push({
          tokenId: outputToken.id,
          type: 'buy_minetoken',
          amount: utils.toDecimal(output, outputToken.decimals)
        })
      }
      // 文章price未支付
      if (!this.articleHasPaied) {
        requestParams.items.push({
          signId: this.id,
          type: 'buy_post'
        })
      }
      return requestParams
    },
    createOrder() {
      const loading = this.$loading({
        lock: false,
        background: 'rgba(0, 0, 0, 0.4)'
      })
      const requestParams = this.makeOrderParams()
      this.$API.createArticleOrder(requestParams).then(res => {
        loading.close()
        if (res.code === 0) {
          this.$router.replace({ name: 'porder-id', params: {id: res.data}})
        } else {
            this.$dialog.alert({
            title: '温馨提示',
            message: '订单创建失败'
          })
        }
      })
    }
  }
};
</script>

<style lang="less">
@purple: #542de0;
.order {
  .van-submit-bar__price {
    color: @purple;
  }
  .van-button--danger {
    background-color: @purple;
    border: 0.0625rem solid @purple;
  }
  .grayHeader {
    color: #B2B2B2;
    font-weight: 400;
    padding: 6px 0;
  }
  .longValue {
    flex: 4;
  }
}
.van-dialog {
  border-radius: 10px;
}
</style>
<style scoped lang="less">
.order {
  padding-top: 45px;
  .img-container {
    width: 100%;
    background: #ffffff;
    .logo {
      padding: 16px;
      width: 300px;
    }
  }
  .bgGray {
    background: #f0f0f0;
  }
  .order-table {
    tr {
      border: 1px solid #ccc;
      color: #000;
      .order-key {
        color: #666;
        white-space: nowrap;
      }
    }
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 10px 16px;
    font-size: 14px;
  }
  .money {
    color: #542de0;
  }
  .payBtnBox {
    padding: 20px 0;
    text-align: center;
  }
  .wxpay-btn {
    text-align: center;
    padding: 20px 0;
  }
  .wxpay-icon {
    font-size: 18px;
  }
  .tip {
    padding: 16px;
    p {
      color: #bbbbbb;
      margin-bottom: 16px;
    }
  }
  .order-item {
    margin-top: 10px;
  }
}
</style>
