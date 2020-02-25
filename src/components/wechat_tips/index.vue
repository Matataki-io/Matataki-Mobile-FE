<template>
  <div class="wechat-tips">
    <div class="animated fadeInUp wechat-tips__head" v-if="isWeixin">
      点击微信右上角的
      <svg-icon class="more" icon-class="more"></svg-icon>
      用浏览器打开此页面吧～
      <svg-icon class="arrow" icon-class="arrow_top_right"></svg-icon>
    </div>
    <div class="animated fadeInUp other-tips__head" v-else>
      <h3>你是否正在应用内置浏览器查看本页？</h3>
      为了正常使用电报登录，请用第三方浏览器打开此页面
      <svg-icon class="arrow" icon-class="arrow_top_right"></svg-icon>
    </div>

    <img class="animated fadeInUp wechat-tips__img" src="@/assets/img/wechat_tips.png" alt="wechatTips">
    <div class="tip_bottom">
      <img class="animated fadeInUp wechat-tips__more__img" src="@/assets/img/wechat_tips_more.png" alt="wechatTipsMore">
      <p class="animated fadeInUp wechat-tips__more__text">点击 "在 浏览器 / Safari 打开"</p>
      <el-button :type="buttonDetail.type" round @click="dismiss" :disabled="isWeixin">
        {{buttonDetail.message}}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToBrowserTip',
  computed: {
    isWeixin () {
      return /micromessenger/.test(navigator.userAgent.toLowerCase())
    },
    buttonDetail() {
      if (this.isWeixin) return { type: 'warning', message: '请按照上图操作，在浏览器打开'}
      else return { type: 'primary', message: '继续Telegram登录'} 
    }
  },
  methods: {
    dismiss() {
      if (this.isWeixin) {
        this.$message.error('你还在微信浏览器里面，请切换到系统浏览器，谢谢。')
      } else {
        this.$emit('dismiss')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wechat-tips {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wechat-tips__head {
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  text-align: center;
  line-height:20px;
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .more {
    font-size: 25px;
    margin: 0 5px;
  }
  .arrow {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
  }
}
.other-tips__head {
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  text-align: center;
  line-height:20px;
  padding-top: 20px;
  // display: flex;
  align-items: center;
  justify-content: center;
  .more {
    font-size: 25px;
    margin: 0 5px;
  }
  .arrow {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
  }
}
.wechat-tips__img {
  width: 12rem;
  display: block;
  margin: 0 auto;
  animation-delay: 0.2s;
}
.wechat-tips__more__img {
  width: 260px;
  display: block;
  margin: 0 auto;
  animation-delay: 0.5s;
}
.wechat-tips__more__text {
  font-size:14px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:20px;
  margin: 18px 0;
  text-align: center;
  animation-delay: 0.7s;
}
.tip_bottom {
  margin: 0 auto;
  margin-bottom: 2rem;
}
.tip_bottom button {
  width: 100%
}
.icons i {
  font-size: 1.5rem;
}
</style>