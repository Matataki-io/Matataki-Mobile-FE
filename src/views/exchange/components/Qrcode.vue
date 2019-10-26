<template>
  <div class="outer">
    <canvas ref="qr" class="qrcode"></canvas>
    <p>请使用微信扫描二维码进行支付</p>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: "QRCode",
  props: {
    payLink: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {
    payLink(url) {
      this.$refs.qr.innerHTML = "";
      this.genQRCode(url);
    }
  },
  mounted() {
    this.genQRCode(this.payLink);
  },
  methods: {
    genQRCode(url) {
      if (url) {
        QRCode.toCanvas(this.$refs.qr, url, {
          width: 150,
          height: 150
        }, error => {
          if (error) console.error(error)
        })
      }
    }
  }
};
</script>

<style lang="less" scoped>
.outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.qrcode {
  background: #ffffff;
  width: 150px;
  height: 150px;
}
</style>
