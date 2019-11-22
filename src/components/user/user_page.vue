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
          content="发行了粉丝通证的用户"
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
    <!--
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
    </nav> -->
    <userPageNav />
    <slot></slot>

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
import tokenAvatar from './token_avatar.vue'
import userPageNav from './user_page_nav.vue'

import Share from '@/components/token/token_share.vue'
import avatar from '@/components/avatar/index.vue'

export default {
  components: { userPageNav, avatar, tokenAvatar, Share },
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
      shareModalShow: false
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
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  background-color: #fff;
  min-height: 100%;
  padding-top: 45px;
}

.max-width-overflow {
  max-width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
}

.user-head {
  padding: 0 0 20px;
  position: relative;
  text-align: center;
  .token-avatar {
    transform: translate(-50%, 0);
    margin-left: 50%;
    margin-top: -35px;
    margin-bottom: 10px;
  }
  .token-link {
    width: 26px;
    height: 10px;
    margin: 0 10px;
  }
  .user-avatar {
    width: 60px !important;
    height: 60px !important;
    flex: 0 0 60px;
    box-sizing: border-box;
    position: relative;
    // margin-top: -30px;
    border: 4px solid #fff;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
    display: inline-block;
    color: rgba(0, 0, 0, 1);
    // margin-top: 10px;
    margin: 0;
    padding: 0;
    text-align: center;
    line-height: 1;
    position: relative;
    .tooltip {
      position: absolute;
      right: -24px;
    }
  }
  .introduction {
    .max-width-overflow();
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 1.5;
    margin-top: 5px;
    padding: 0;
    text-align: center;
  }
  .user-status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-decoration: none;
      margin: 0 20px;
      padding: 0;
      .status-number {
        font-size: 20px;
        font-weight: bolder;
        color: #542de0;
        line-height: 28px;
      }
      .status-key {
        font-size: 12px;
        font-weight: 400;
        color: #000;
        line-height: 17px;
      }
    }
  }
}

.follow-button {
  display: block;
  border-radius: 6px;
  color: #000;
  border: 1px solid #000;
  flex: 0 0 63px;
  width: 63px;
  padding: 4px 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 17px;
  box-sizing: border-box;
  cursor: pointer;
  &.dark {
    background: #000;
    color: #fff;
  }
}

.fixed-right {
  position: absolute;
  right: 10px;
  &.edit,
  &.follow {
    .edit-button {
      bottom: 64px;
      padding-left: 7px;
      padding-right: 6px;
      border-radius: 0.375rem;
    }
    bottom: 64px;
  }
  &.share {
    .narrowing {
      padding-left: 11px;
      padding-right: 11px;
      border-radius: 0.375rem;
    }
    bottom: 25px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.user-banner {
  width: 100%;
  // height: 124px;
}

.no-data {
  text-align: center;
  p {
    margin-top: 40px;
    font-size: 14px;
    color: rgba(178, 178, 178, 1);
  }
}
</style>
