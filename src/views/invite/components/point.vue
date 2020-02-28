<template>
  <div class="point-list">
    <div class="point-head">
      <div class="fl fl-ac fl-js">
        <span class="point-title">{{ $t('invite.invited') }}</span>
        <span class="point-money">{{ point.res.count }}</span>
      </div>
      <div class="fl fl-ac fl-js">
        <div class="integral-link">
          {{ referralLink }}
        </div>
        <el-button size="mini" class="integral-btn" @click="copyLink(referralLink1)">
          {{ $t('invite.copyLink') }}</el-button
        >
      </div>
      <p class="point-des">
        {{ $t('invite.des1', [$point.regInviteFinished + $point.regInviter]) }}
        <br />
        {{ $t('invite.des2', [$point.publishReferral]) }}
        <br />
        {{ $t('invite.des3', [1 / $point.readReferralRate]) }}
      </p>
      <br />
      <p class="point-des">
        {{ $t('invite.des4', [$point.readNew, $point.regInviteFinished]) }}
      </p>
    </div>

    <div v-if="isLogined">
      <!-- 列表 -->
      <BasePull
        :key="0"
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
      <p>
        {{ $t('invite.loginViewList') }}
      </p>
      <el-button size="mini" class="integral-btn btn" @click="login">
        {{ $t('login') }}
      </el-button>
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
        return `${this.$t('referral')}${window.location.origin}?referral=${this.currentUserInfo.id}`
      else return `${this.$t('referral')}${window.location.origin}`
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
            message: this.$t('success.copy')
          })
        },
        () => {
          this.$toast({
            duration: 1500,
            message: this.$t('error.copy')
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
