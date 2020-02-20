<template>
  <div class="wechat-tips">
    <div class="animated fadeInUp wechat-tips__head">
      点击微信右上角的
      <svg-icon class="more" icon-class="more"></svg-icon>
      用浏览器打开此页面吧～
      <svg-icon class="arrow" icon-class="arrow_top_right"></svg-icon>
    </div>

    <img class="animated fadeInUp wechat-tips__img" src="@/assets/img/wechat_tips.png" alt="wechatTips">
    <div>
      <img class="animated fadeInUp wechat-tips__more__img" src="@/assets/img/wechat_tips_more.png" alt="wechatTipsMore">
      <p class="animated fadeInUp wechat-tips__more__text">点击“在浏览器打开”</p>
    </div>
  </div>
</template>

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
.wechat-tips__img {
  width: 256px;
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
</style>