<template>
  <div class="point-task">
    <div class="task-block">
      <div class="task-list">
        <span class="task-title">{{ $t('point.title') }}</span>
        <span class="task-money">{{ pointStatus.amount || 0 }}</span>
      </div>
    </div>
    <!-- 如果没有设置资料积分 回馈积分 隐藏所有 -->
    <div v-if="!pointStatus.profile || !pointStatus.login" class="task-block padding">
      <!-- 隐藏资料积分 -->
      <div v-if="!pointStatus.profile">
        <div class="flex margin-b-10">
          <span class="task-title">
            {{ $t('point.completeProfile') }}
          </span>
          <el-button size="mini" class="integral-btn" @click="profile">
            <svg-icon class="box" icon-class="box" />
            {{ $t('point.receive') }}
          </el-button>
        </div>
        <p class="task-des pdes">
          {{ $t('point.uploadAvatar', [$point.profile]) }}
        </p>
      </div>
      <!-- 隐藏资料积分的占位高度 -->
      <div v-if="!pointStatus.profile" class="empty-line"></div>
      <!-- 隐藏回馈积分 -->
      <div v-if="!pointStatus.login">
        <div class="flex margin-b-10">
          <span class="task-title">
            {{ $t('point.feedback') }}
          </span>
          <el-button size="mini" class="integral-btn" @click="feedback">
            <svg-icon class="box" icon-class="box" />
            {{ $t('point.receive') }}
          </el-button>
        </div>
        <p class="task-des pdes">
          {{ $t('point.oldUser', [$point.loginOld]) }}
          <br />
          {{ $t('point.newUser', [$point.loginNew]) }}
        </p>
      </div>
    </div>
    <div class="task-block padding">
      <span class="task-title">
        {{ $t('point.invite') }}
      </span>
      <div class="flex">
        <div class="integral-link">
          {{ referralLink }}
        </div>
        <el-button size="mini" class="integral-btn" @click="copyLink(referralLink1)">
          {{ $t('point.copyLink') }}
        </el-button>
      </div>
      <p class="task-des pdes">
        {{ $t('point.inviteDes1', [$point.regInviteFinished + $point.regInviter]) }}
        <br />
        {{ $t('point.inviteDes2', [$point.publishReferral]) }}
        <br />
        {{ $t('point.inviteDes3', [1 / $point.readReferralRate]) }}
      </p>
    </div>
    <div class="task-block padding">
      <div class="task-progress">
        <span class="task-title">
          {{ $t('point.dailyPublishPoint') }}
        </span>
        <span class="task-des">
          {{ $t('point.dailyPublishPointDes', [$point.publishDailyMax]) }}
        </span>
        <div class="integral-progress">
          <el-progress
            class="progress"
            color="#542DE0"
            :percentage="pointStatusPostNum"
            :show-text="false"
            :stroke-width="10"
          />
          <span>{{ pointStatusPost }}</span>
        </div>
      </div>
      <div class="task-progress">
        <span class="task-title">
          {{ $t('point.dailyReadPoint') }}
        </span>
        <span class="task-des">
          {{ $t('point.dailyReadPointDes', [$point.readDailyMax]) }}
        </span>
        <div class="integral-progress">
          <el-progress
            class="progress"
            color="#542DE0"
            :percentage="pointStatusReadNum"
            :show-text="false"
            :stroke-width="10"
          />
          <span>{{ pointStatusRead }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pointStatus: Object.create(null)
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    referralLink() {
      if (this.currentUserInfo && this.currentUserInfo.id)
        return `${window.location.origin}?referral=${this.currentUserInfo.id}`
      else return `${window.location.origin}`
    },
    referralLink1() {
      if (this.currentUserInfo && this.currentUserInfo.id)
        return `${this.$t('referral')}${window.location.origin}?referral=${this.currentUserInfo.id}`
      else return `${this.$t('referral')}${window.location.origin}`
    },
    pointStatusPost() {
      if (this.pointStatus.publish)
        return this.pointStatus.publish.today + '/' + this.pointStatus.publish.max
      else return `0/${this.$point.publishDailyMax}`
    },
    pointStatusRead() {
      if (this.pointStatus.publish)
        return this.pointStatus.read.today + '/' + this.pointStatus.read.max
      else return `0/${this.$point.readDailyMax}`
    },
    pointStatusPostNum() {
      if (this.pointStatus.publish) return this.pointStatus.publish.today / 3
      else return 0
    },
    pointStatusReadNum() {
      if (this.pointStatus.read) return this.pointStatus.read.today
      else return 0
    }
  },
  watch: {
    isLogined(newState) {
      // 因为 移动端 钱包登陆不会刷新 监听是否登陆
      if (newState) this.getUserPointStatus()
    }
  },
  created() {},
  mounted() {
    // 默认查询一次
    this.getUserPointStatus()
  },
  methods: {
    // 防抖防止不必要的调用
    getUserPointStatus: debounce(async function() {
      await this.$backendAPI
        .userPointStatus()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) this.pointStatus = res.data.data
          else console.log(res.message)
        })
        .catch(err => console.log(err))
    }, 1000),
    isLoginFunc() {
      if (!this.isLogined) {
        this.$toast({
          duration: 1500,
          message: this.$t('error.pleaseLogin')
        })
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    profile() {
      if (!this.isLoginFunc()) return
      // console.log('领取资料设置积分')
      this.$backendAPI
        .userClaimTaskPoint({
          type: 'profile'
        })
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.$toast({
              duration: 1500,
              message: this.$t('point.receiveSuccess')
            })
            this.getUserPointStatus()
          } else
            this.$toast({
              duration: 1500,
              message: res.data.message
            })
        })
        .catch(err => {
          console.log(this.$t('point.receiveProfileFail'), err)
          this.$toast({
            duration: 1500,
            message: this.$t('point.receiveFail')
          })
        })
    },
    feedback() {
      if (!this.isLoginFunc()) return
      // console.log('领取老用户回馈积分')
      this.$backendAPI
        .userClaimTaskPoint({
          type: 'login'
        })
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.$toast({
              duration: 1500,
              message: this.$t('point.receiveSuccess')
            })
            this.getUserPointStatus()
          } else
            this.$toast({
              duration: 1500,
              message: res.data.message
            })
        })
        .catch(err => {
          console.log(this.$t('point.receiveFeedbackFail'), err)
          this.$toast({
            duration: 1500,
            message: this.$t('point.receiveFail')
          })
        })
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
    }
  }
}
</script>

<style lang="less" scoped src="./task.less"></style>
