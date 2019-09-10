<template>
  <div class="point-list">
    <div class="point-head">
      <div class="fl fl-ac fl-js">
        <span class="point-title">已邀请</span>
        <span class="point-money">{{ point.res.count }}</span>
      </div>
      <div class="fl fl-ac fl-js">
        <div class="integral-link">
          {{ referralLink }}
        </div>
        <el-button size="mini" class="integral-btn" @click="copyLink(referralLink1)"
          >复制链接</el-button
        >
      </div>
      <p class="point-des">
        每成功邀请一名好友注册可得{{ $point.regInviteFinished + $point.regInviter }}积分
        <br />
        好友发文你可以获得额外{{ $point.publishReferral }}积分
        <br />
        好友阅读获得积分你可得额外1/{{ 1 / $point.readReferralRate }}
      </p>
    </div>

    <div v-if="isLogined">
      <!-- 列表 -->
      <BasePull
        :key="index"
        :params="point.params"
        :api-url="point.apiUrl"
        :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
        :auto-request-time="point.autoRequestTime"
        :need-access-token="true"
        loading-text="无邀请"
        @getListData="getListData"
      >
        <inviteCard
          v-for="itemChild in point.list"
          :key="itemChild.create_time"
          :card="itemChild"
        ></inviteCard>
      </BasePull>
    </div>
    <div v-else class="tips">
      <p>登录查看邀请列表</p>
      <el-button size="mini" class="integral-btn btn" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import inviteCard from '@/components/invite_card/index.vue'

export default {
  components: {
    inviteCard
  },
  data() {
    return {
      point: {
        params: {},
        apiUrl: 'userInvitees',
        list: [],
        autoRequestTime: 0,
        timer: null,
        res: {
          count: 0
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    referralLink() {
      if (this.currentUserInfo && this.currentUserInfo.id)
        return `${window.location.origin}?referral=${this.currentUserInfo.id}`
      else return `${window.location.origin}`
    },
    referralLink1() {
      if (this.currentUserInfo && this.currentUserInfo.id)
        return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}?referral=${this.currentUserInfo.id}`
      else
        return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}`
    }
  },
  created() {},
  methods: {
    getListData(res) {
      this.point.res.count = res.data.data.count
      this.point.list = res.list
    },
    copyLink(text) {
      this.$copyText(text).then(
        () => {
          this.$toast({
            duration: 1500,
            message: '复制成功'
          })
        },
        () => {
          this.$toast({
            duration: 1500,
            message: '复制失败'
          })
        }
      )
    },
    login() {
      this.$store.commit('setLoginModal', true)
    }
  }
}
</script>

<style lang="less" scoped src="./point.less"></style>
