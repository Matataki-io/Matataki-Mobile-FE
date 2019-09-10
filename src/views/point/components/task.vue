<template>
  <div class="point-task">
    <div class="task-block">
      <div class="task-list">
        <span class="task-title">我的积分</span>
        <span class="task-money">{{ pointStatus.amount || 0 }}</span>
      </div>
    </div>
    <!-- 如果没有设置资料积分 回馈积分 隐藏所有 -->
    <div v-if="!pointStatus.profile || !pointStatus.login" class="task-block padding">
      <!-- 隐藏资料积分 -->
      <div v-if="!pointStatus.profile">
        <div class="flex margin-b-10">
          <span class="task-title">完善个人资料</span>
          <el-button size="mini" class="integral-btn" @click="profile">
            <svg-icon class="box" icon-class="box" /> 领取</el-button
          >
        </div>
        <p class="task-des pdes">前往设置页上传头像+设置昵称即可领取{{ $point.profile }}积分</p>
      </div>
      <!-- 隐藏资料积分的占位高度 -->
      <div v-if="!pointStatus.profile" class="empty-line"></div>
      <!-- 隐藏回馈积分 -->
      <div v-if="!pointStatus.login">
        <div class="flex margin-b-10">
          <span class="task-title">用户回馈</span>
          <el-button size="mini" class="integral-btn" @click="feedback">
            <svg-icon class="box" icon-class="box" /> 领取</el-button
          >
        </div>
        <p class="task-des pdes">
          感谢8月30日前注册的老用户支持，点击领取{{ $point.loginOld }}积分
          <br />
          新用户点击领取{{ $point.loginNew }}积分
        </p>
      </div>
    </div>
    <div class="task-block padding">
      <span class="task-title">邀请好友有奖</span>
      <div class="flex">
        <div class="integral-link">
          {{ referralLink }}
        </div>
        <el-button size="mini" class="integral-btn" @click="copyLink(referralLink1)"
          >复制链接</el-button
        >
      </div>
      <p class="task-des pdes">
        每成功邀请一名好友注册可得{{ $point.regInviteFinished + $point.regInviter }}积分
        <br />
        好友发文你可以获得额外{{ $point.publishReferral }}积分
        <br />
        好友阅读获得积分你可得额外1/{{ 1 / $point.readReferralRate }}
      </p>
    </div>
    <div class="task-block padding">
      <div class="task-progress">
        <span class="task-title">每日发文奖励</span>
        <span class="task-des">每日发文最高可得{{ $point.publishDailyMax }}积分奖励</span>
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
        <span class="task-title">每日阅读奖励</span>
        <span class="task-des"> 每日阅读评价文章最高可得{{ $point.readDailyMax }}积分奖励</span>
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
        return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}?referral=${this.currentUserInfo.id}`
      else
        return `瞬MATATAKI，永久存储和版权记录的内容平台。行业领先的去中心化应用，创作者的安全港湾。注册登入即可领取额外500积分。${window.location.origin}`
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
          message: '请先登录'
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
              message: '领取成功'
            })
            this.getUserPointStatus()
          } else
            this.$toast({
              duration: 1500,
              message: res.data.message
            })
        })
        .catch(err => {
          console.log('领取设置资料积分失败', err)
          this.$toast({
            duration: 1500,
            message: `领取失败`
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
              message: '领取成功'
            })
            this.getUserPointStatus()
          } else
            this.$toast({
              duration: 1500,
              message: res.data.message
            })
        })
        .catch(err => {
          console.log('领取老用户回馈积分失败', err)
          this.$toast({
            duration: 1500,
            message: '领取失败'
          })
        })
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
    }
  }
}
</script>

<style lang="less" scoped src="./task.less"></style>
