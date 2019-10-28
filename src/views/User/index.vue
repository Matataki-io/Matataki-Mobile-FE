/* eslint-disable no-shadow */
<template>
  <div class="user mw">
    <!-- 他人 -->
    <BaseHeader
      :pageinfo="{ title: '个人主页' }"
      :scroll-toggle-bc="'#fff'"
      :is-scroll-emit="true"
      :scroll-show-right="true"
      @scrollToggleStatus="status => (scrollStatus = status)"
    >
      <div v-if="!isMe(id)" slot="right">
        <template v-if="!followed">
          <span class="follow-button dark" @click="followOrUnfollowUser({ id, type: 1 })">
            <svg-icon icon-class="add" />
            {{ $t('follow') }}</span
          >
        </template>
        <template v-else>
          <span class="follow-button" @click="followOrUnfollowUser({ id, type: 0 })">{{
            $t('following')
          }}</span>
        </template>
      </div>
    </BaseHeader>

    <div class="user-head">
      <img class="user-banner" src="@/assets/img/user_banner.png" alt="banner" />
      <div class="fl ac jc token-avatar">
        <avatar class="user-avatar" :src="avatar"></avatar>

        <img
          v-if="tokenUser"
          class="token-link"
          src="@/assets/img/token_link.png"
          alt="token-link"
        />
        <tokenAvatar v-if="tokenUser" :token="tokenData" />
      </div>
      <p class="name">
        {{ username }}
        <el-tooltip
          v-if="tokenUser"
          class="tooltip"
          effect="dark"
          content="发币用户"
          placement="top"
        >
          <svg-icon class="tokens" icon-class="token" />
        </el-tooltip>
      </p>

      <p class="introduction">{{ $t('profile') }}：{{ introduction || $t('not') }}</p>
      <p class="user-status">
        <router-link :to="{ name: 'FollowList', params: { listtype: $t('follow') } }">
          <span class="status-number">{{ follows }}</span>
          <span class="status-key">{{ $t('follow') }}</span>
        </router-link>
        <router-link :to="{ name: 'FollowList', params: { listtype: $t('fans') } }">
          <span class="status-number">{{ fans }}</span>
          <span class="status-key">{{ $t('fans') }}</span>
        </router-link>
      </p>

      <div v-if="!isMe(id)" class="fixed-right follow">
        <template v-if="!scrollStatus">
          <transition name="fade">
            <span
              v-if="!followed"
              class="follow-button dark"
              @click="followOrUnfollowUser({ id, type: 1 })"
            >
              <svg-icon icon-class="add" />
              {{ $t('follow') }}</span
            >
            <span v-else class="follow-button" @click="followOrUnfollowUser({ id, type: 0 })">
              {{ $t('following') }}</span
            >
          </transition>
        </template>
      </div>
      <router-link v-else :to="{ name: 'setting' }" class="fixed-right edit">
        <el-button size="mini">编辑资料</el-button>
      </router-link>
      <router-link :to="{ name: 'exchange' }" class="fixed-right exchange">
        <el-button type="primary" size="mini">交易粉丝币</el-button>
      </router-link>
    </div>

    <nav class="user-nav">
      <a href="javascript:void(0);" class="active">文章</a>
      <router-link :to="{ name: 'FollowList', params: { listtype: $t('follow') } }">
        {{ $t('follow') }}
      </router-link>
      <router-link :to="{ name: 'FollowList', params: { listtype: $t('fans') } }">
        {{ $t('fans') }}
      </router-link>
    </nav>

    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :now-index="index"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <ArticleCard
        v-for="(itemChild, index) in pull.list"
        :key="index"
        :class="listtype !== 'others' && 'card-margin'"
        :article="itemChild"
        :now-index="0"
        type="article"
      />
    </BasePull>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ArticleCard } from '@/components/'
import tokenAvatar from './components/token_avatar'

import avatar from '@/components/avatar/index.vue'

export default {
  components: { ArticleCard, avatar, tokenAvatar },
  data() {
    return {
      id: this.$route.params.id,
      followed: false,
      follows: 0,
      fans: 0,
      name: '',
      email: '',
      avatar: '',
      introduction: '',
      stats: {
        accounts: 0,
        articles: 0,
        supports: 0,
        drafts: 0
      },
      scrollStatus: false, // 根据滚动状态判断是否显示按钮
      tokenUser: false,
      tokenData: Object.create(null),
      pull: {
        params: { author: this.$route.params.id },
        apiUrl: 'homeTimeRanking',
        list: [],
        loadingText: this.$t('not'),
        autoRequestTime: 0
      }
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'displayName', 'isLogined', 'isMe']),
    username() {
      return this.name.length < 12 ? this.name : this.name.slice(0, 12) + '...'
    }
  },
  watch: {
    isLogined() {
      this.refreshUser()
    }
  },
  created() {
    this.refreshUser()
  },
  mounted() {
    this.tokenUserId(this.$route.params.id)
  },
  methods: {
    jumpTo(params) {
      this.$router.push(params)
    },
    async refreshUser() {
      const { isMe, id } = this
      const setUser = ({
        avatar,
        email,
        fans,
        follows,
        is_follow,
        nickname,
        introduction,
        username,
        accounts,
        articles,
        supports,
        drafts
      }) => {
        this.email = email
        this.fans = fans
        this.follows = follows
        this.introduction = introduction
        this.followed = is_follow
        this.name = nickname || username
        this.setAvatarImage(avatar)
        this.stats = { accounts, articles, supports, drafts }
      }

      const {
        data: { data }
      } = await (isMe(id) ? this.$backendAPI.getMyUserData() : this.$backendAPI.getUser({ id }))
      // console.debug(data);
      setUser(data)
    },
    async followOrUnfollowUser({ id, type }) {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
      try {
        if (type === 1) await this.$backendAPI.follow({ id })
        else await this.$backendAPI.unfollow({ id })
        this.$toast.success({ duration: 1000, message: `${message}${this.$t('success.success')}` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}${this.$t('error.fail')}` })
        this.$store.commit('setLoginModal', this.$errorHandling.isNoToken(error))
      }
      this.refreshUser()
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$backendAPI.getAvatarImage(hash)
    },
    async tokenUserId(id) {
      await this.$backendAPI
        .tokenUserId(id)
        .then(res => {
          if (res.status === 200 && res.data.code === 0 && res.data.data.id > 0) {
            this.tokenUser = true
            this.tokenData = res.data.data
          }
        })
        .catch(err => console.log('get token user error', err))
    },
    getListDataTab(res) {
      // console.log(res)
      this.pull.list = res.list
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
