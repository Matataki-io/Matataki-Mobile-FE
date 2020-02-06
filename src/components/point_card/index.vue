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
      <span class="card-title">{{ assetTitle }}</span>
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
      if (this.asset.amount < 0) {
        return '#d74e5a'
      } else if (this.asset.amount) {
        return '#41b37d'
      } else {
        return '#000000'
      }
    },
    assetType() {
      const { type } = this.asset
      const pointTypes = {
        read: this.$t('pointCard.read'),
        read_like: this.$t('pointCard.read_like'),
        read_dislike: this.$t('pointCard.read_dislike'),
        read_referral: this.$t('pointCard.read_referral'),
        beread: this.$t('pointCard.beread'),
        read_new: this.$t('pointCard.read_new'),
        beread_new: this.$t('pointCard.beread_new'),
        publish: this.$t('pointCard.publish'),
        publish_referral: this.$t('pointCard.publish_referral'),
        reg_inviter: this.$t('pointCard.reg_inviter'),
        reg_invitee: this.$t('pointCard.reg_invitee'),
        reg_invite_finished: this.$t('pointCard.reg_invite_finished'),
        login: this.$t('pointCard.login'),
        profile: this.$t('pointCard.profile'),
        comment_pay: this.$t('pointCard.comment_pay'),
        comment_income: this.$t('pointCard.comment_income')
      }
      return pointTypes[type]
    },
    assetTitle() {
      const { type, title } = this.asset
      // 不是邀请用户注册奖励积分
      if (type !== 'reg_inviter') {
        return title || ''
      } else {
        return '邀请用户阅读5篇文章超过30秒并评价即可获得剩余600积分'
      }
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
