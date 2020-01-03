<template>
  <div class="share-header">
    <div class="share-header__info">
      <avatar class="avatar" src="https://p3.pstatp.com/large/pgc-image/6deea2238fa54440ac411fabc3ad2cff?/1.jpg"></avatar>
      <span class="share-header__username">Xiaotiandada</span>
      <span class="share-header__time">123123213213123</span>
      <span class="share-header__read">
        <svg-icon icon-class="eye_blod" class="icon"></svg-icon>
        121211
      </span>
    </div>
    <m-ipfs></m-ipfs>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar,
  },
}
</script>

<style lang="less" scoped>
.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px 20px;
  &__info {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 30px !important;
    height: 30px !important;
  }
  &__username {
    font-size:12px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    margin-left: 5px;
  }
  &__time {
    font-size:12px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:17px;
    margin-left: 10px;
  }
  &__read {
    font-size:12px;
    font-weight:400;
    color:rgba(178,178,178,1);
    line-height:17px;
    margin-left: 10px;
    .icon {
      font-size: 14px;
    }
  }
}
</style>