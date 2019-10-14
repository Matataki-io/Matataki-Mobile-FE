<template>
  <div class="exchange">
    <van-field
      v-model="inputValue"
      center
      label="输入"
      type="number"
      min="0"
      placeholder="0.0(元)"
      style="margin-top: 20px;"
    >
      <van-button
        slot="button"
        size="small"
        type="info"
        @click="$store.commit('setSelectTokenModal', true)"
        >￥</van-button
      >
    </van-field>
    <van-field
      v-model="outputValue"
      center
      label="输出"
      type="number"
      min="0"
      placeholder="0.0"
      style="margin-top: 20px;"
    >
      <van-button slot="button" size="small" type="info">BAT</van-button>
    </van-field>
    <div style="text-align:center;margin-top: 20px;">
      <van-button type="primary" size="large" @click="wxpay">兑换</van-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import utils from '@/utils/utils'

export default {
  name: 'Swap',
  data() {
    return {
      inputValue: null,
      outputValue: null
    }
  },
  methods: {
    wxpay() {
      const openid = utils.getCookie('wx_openid')
      this.$backendAPI.wxpay(this.inputValue, openid).then(res => {
        // console.log(res);
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
          }
        } else {
          this.onBridgeReady(res.data)
        }
      })
    },
    onBridgeReady(params) {
      console.log('onBridgeReady params', params)
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: params.appId, //公众号名称，由商户传入
          timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, //随机串
          package: params.package,
          signType: params.signType, //微信签名方式：
          paySign: params.paySign //微信签名
        },
        function(res) {
          console.log('onBridgeReady result', res)
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped></style>
