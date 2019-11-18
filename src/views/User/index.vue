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
        <el-button class="edit-button" size="mini">编辑资料</el-button>
      </router-link>
      <span class="fixed-right share">
        <el-button class="narrowing" size="mini" @click="shareModalShow = true">
          <svg-icon icon-class="share_new" />
          {{ $t('share') }}
        </el-button>
      </span>
    </div>

    <nav class="user-nav">
      <a href="javascript:void(0);" :class="numPage === 1 && 'active'" @click="numPage = 1">
        文章
      </a>
      <router-link :to="{ name: 'FollowList', params: { listtype: $t('follow') } }">
        {{ $t('follow') }}
      </router-link>
      <router-link :to="{ name: 'FollowList', params: { listtype: $t('fans') } }">
        {{ $t('fans') }}
      </router-link>
      <a href="javascript:void(0);" :class="numPage === 2 && 'active'" @click="numPage = 2">
        个人信息
      </a>
    </nav>

    <BasePull
      v-if="numPage === 1"
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

    <div v-if="numPage === 2" slot="list" v-loading="loading" class="information">
      <div v-if="urls.length !== 0" class="websites">
        <h3 class="inline h3">
          相关网站
        </h3>
        <div class="inline url">
          <p v-for="(item, index) in urls" :key="index">
            <a :href="item">{{ item }} </a>
          </p>
        </div>
      </div>
      <div v-if="social.length !== 0" class="social">
        <h3 class="inline h3">
          社交账号
        </h3>
        <div class="inline social">
          <div v-for="(item, index) in social" :key="index">
            <div class="social-icons">
              <socialIcon :icon="item.icon" :show-tooltip="true" :content="item.content" />
            </div>
            <a v-if="item.url" class="url-text" :href="item.url + '/' + item.content">
              {{ item.url + '/' + item.content }}
            </a>
            <span v-else class="url-text">{{ item.content }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="social.length === 0 && urls.length === 0 && loading === false"
        class="social no-data"
      >
        <p>
          暂无信息
        </p>
      </div>
    </div>

    <Share
      :share-modal-show="shareModalShow"
      :minetoken-user="{ nickname: username }"
      :page-type="1"
      @input="val => (shareModalShow = val)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ArticleCard } from '@/components/'
import tokenAvatar from './components/token_avatar.vue'

import Share from '@/components/token/token_share.vue'
import avatar from '@/components/avatar/index.vue'
import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: { ArticleCard, avatar, tokenAvatar, Share, socialIcon },
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
      },
      shareModalShow: false,
      numPage: 1,
      loading: false,
      social: [],
      socialTemplate: [
        {
          icon: 'QQ',
          type: 'qq',
          content: ''
        },
        {
          icon: 'Wechat',
          type: 'wechat',
          content: ''
        },
        {
          icon: 'Weibo',
          type: 'weibo',
          url: 'https://www.weibo.com',
          content: ''
        },
        {
          icon: 'Telegram',
          type: 'telegram',
          content: ''
        },
        {
          icon: 'Twitter',
          type: 'twitter',
          url: 'https://twitter.com',
          content: ''
        },
        {
          icon: 'Facebook',
          type: 'facebook',
          url: 'https://facebook.com',
          content: ''
        },
        {
          icon: 'Github',
          type: 'github',
          url: 'https://github.com',
          content: ''
        }
      ],
      urls: []
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
    },
    numPage() {
      if (this.numPage === 2 && this.social.length === 0 && this.urls.length === 0) {
        this.getMyUserLinks()
      }
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

        this.$wechatShare({
          title: `${nickname || username}的个人主页`,
          desc: introduction || '暂无',
          imgUrl: avatar ? this.$API.getImg(avatar) : ''
        })
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
    },
    async getMyUserLinks() {
      this.loading = true
      try {
        const { data: resLinks } = await this.$backendAPI.getUserLinks({
          id: this.$route.params.id
        })
        if (resLinks.code === 0) {
          const data = resLinks.data
          this.urls = data.websites
          data.socialAccounts.forEach(item => {
            this.socialTemplate.find(age => age.type === item.type).content = item.value
          })
          this.social = this.socialTemplate.filter(age => age.content !== '' && age.content != null)
          this.loading = false
        } else console.log('获取用户信息失败,', resLinks)
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
