<template>
  <div class="card">
    <div class="card-info">
      <span class="card-type">{{ assetType }}</span>
      <h2 class="card-pricing" :style="{ color: `${assetColor}` }">
        {{ assetAmount }}
      </h2>
    </div>
    <div class="card-info">
      <span class="card-date">{{ friendlyDate }}</span>
    </div>
    <div class="card-info">
      <span class="card-title">{{ asset.title || '' }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'AssetCard',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    friendlyDate() {
      return moment(this.asset.create_time).format('MMMDo HH:mm')
    },
    assetAmount() {
      return this.asset.amount
    },
    assetColor() {
      return '#FB6877'
    },
    assetType() {
      const { type } = this.asset
      const pointTypes = {
        read: '阅读文章奖励积分',
        read_like: '阅读文章奖励积分',
        read_dislike: '阅读文章奖励积分',
        read_referral: '被邀请者阅读文章奖励积分',
        beread: '文章被阅读奖励积分',
        read_new: '阅读新文章奖励积分',
        beread_new: '新文章被阅读奖励积分',
        publish: '发布文章奖励积分',
        publish_referral: '被邀请者发布文章奖励积分',
        reg_inviter: '邀请的用户注册奖励积分',
        reg_invitee: '被邀请注册奖励积分',
        reg_invite_finished: '邀请的用户已激活奖励积分',
        login: '回馈奖励',
        profile: '完善资料积分'
      }
      return pointTypes[type]
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  box-sizing: border-box;
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  &:nth-last-of-type(1) {
    border: none;
  }
  &-pricing {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 19px;
  }
  &-type {
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
  }
  &-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &-title {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
  }
  &-date {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
  }
}
</style>
