<template>
  <div class="exchange">
    <van-nav-bar
      title="uniswap"
      left-text="返回"
      right-text="登录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-tabs v-model="activeName">
      <van-tab title="兑换" name="swap">
        <Swap></Swap>
      </van-tab>
      <van-tab title="发送" name="send">
        <Send></Send>
      </van-tab>
      <van-tab title="资金池" name="pool">
        <Pool></Pool>
      </van-tab>
    </van-tabs>
    <SelectToken v-model="selectTokenShow"/>
  </div>
</template>

<script>
import Pool from './components/pool'
import Send from './components/send'
import Swap from './components/swap'
import SelectToken from './components/SelectToken'
import utils from "@/utils/utils";
export default {
  name: "Exchange",
  components: {
    Pool,
    Send,
    Swap,
    SelectToken
  },
  data() {
    return {
    };
  },
  computed: {
    selectTokenShow: {
      get() {
        return this.$store.state.selectTokenShow
      },
      set(v) {
        this.$store.commit('setSelectTokenModal', v)
      }
    },
  },
  created() {
    const code = this.$route.query.code;
    this.$backendAPI.wxlogin(code).then(res => {
      if (res.data.openid) {
        utils.setCookie('wx_openid', res.data.openid, 1/12) // 设置两个小时过期
      }
    });
  }
};
</script>

<style lang="less" scoped>
</style>
