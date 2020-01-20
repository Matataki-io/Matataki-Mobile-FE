<template>
  <van-popup v-model="sidebarShow" position="left" class="sidebar" z-index="1000">
    <div class="container">
      <template v-if="isLogined">
        <!-- 用户 -->
        <div class="account">
          <div class="top-container">
            <router-link :to="{ name: 'user-id', params: { id } }">
              <div class="avatar-container">
                <img
                  :src="avatar || '@/assets/avatar-default.svg'"
                  alt="avatar"
                  :onerror="defaultAvatar"
                />
              </div>
            </router-link>
            <router-link
              :to="{ name: 'notification', params: { provider: 'follow' } }"
              :class="{ badge: hasNewNotification }"
            >
              <svg-icon class="notification-icon" icon-class="bell" />
            </router-link>

          </div>
          <p class="account-name">
            {{ username }}
            <el-tooltip
              v-if="tokenUser"
              class="tooltip"
              effect="dark"
              content="发行了Fan票的用户"
              placement="top"
            >
              <svg-icon class="tokens" icon-class="token" />
            </el-tooltip>
          </p>

        </div>
        <!-- 关注、粉丝 -->
        <div class="follow-info">
          <router-link :to="{ name: 'user-id-follow', params: { id } }">
            <div class="follow">
              <p>{{ follows }}</p>
              <p>
                {{ $t('sidebar.follow') }}
              </p>
            </div>
          </router-link>
          <router-link :to="{ name: 'user-id-fan', params: { id } }">
            <div class="fans">
              <p>{{ fans }}</p>
              <p>
                {{ $t('sidebar.fans') }}
              </p>
            </div>
          </router-link>
        </div>
        <!-- 原创、收藏、草稿 -->
        <div class="cell-container">
          <router-link :to="{ name: 'Original', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <!-- <img src="@/assets/newimg/yuanchuang.svg" alt="article" class="left-img" /> -->
                <svg-icon icon-class="yuanchuang" class="left-img icon-feedback" />
                <span class="left-text">
                  {{ $t('sidebar.original') }}
                </span>
              </div>
              <div class="cell-right">
                <span
                  >{{ stats.articles }}
                  {{ $t('sidebar.article') }}
                </span>
              </div>
            </div>
          </router-link>
          <router-link :to="{ name: 'BookmarkList', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <!-- <img src="@/assets/newimg/bookmark.svg" alt="article" class="left-img" /> -->
                <svg-icon icon-class="bookmark" class="left-img icon-feedback" />
                <span class="left-text">
                  {{ $t('sidebar.bookmarks') }}
                </span>
              </div>
              <div class="cell-right">
                <span
                  >{{ stats.bookmarks }}
                  {{ $t('sidebar.article') }}
                </span>
              </div>
            </div>
          </router-link>

          <router-link :to="{ name: 'DraftBox', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <!-- <img src="@/assets/newimg/caogaoxiang.svg" alt="article" class="left-img" /> -->
                <svg-icon icon-class="caogaoxiang" class="left-img icon-feedback" />
                <span class="left-text">
                  {{ $t('sidebar.draft') }}
                </span>
              </div>
              <div class="cell-right">
                <span
                  >{{ stats.drafts }}
                  {{ $t('sidebar.article') }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
        <!-- Fan票 -->
        <div class="cell-container">
          <router-link :to="{ name: 'tokens' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon icon-class="tokens1" class="left-img"></svg-icon>
                <span class="left-text">
                  Fan票夹
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
          <!-- <router-link :to="{ name: 'holdliquidity' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon icon-class="liquidity" class="left-img"></svg-icon>
                <span class="left-text">
                  持有的流动金
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link> -->
          <router-link v-if="tokenUser" :to="{ name: 'minetoken' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon icon-class="minetoken1" class="left-img"></svg-icon>
                <span class="left-text">
                  管理Fan票
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
          <router-link v-else :to="{ name: 'minetoken-apply' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon icon-class="minetoken1" class="left-img"></svg-icon>
                <span class="left-text">
                  申请Fan票
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
        </div>
        <!-- 钱包、积分 -->
        <div class="cell-container">
          <!-- 钱包详情 -->
          <router-link :to="{ name: 'Asset', params: { id } }">
            <div class="cell">
              <div class="cell-left">
                <!-- <img src="@/assets/newimg/shouye-zhanghu.svg" alt="home" class="left-img" /> -->
                <svg-icon icon-class="shouye-zhanghu" class="left-img icon-feedback" />
                <span class="left-text">
                  {{ $t('sidebar.account') }}
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
          <!-- 我的积分 -->
          <!-- <router-link :to="{ name: 'point' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon class="left-img" icon-class="point1" />
                <span class="left-text">
                  {{ $t('sidebar.point') }}
                </span>
              </div>
              <div class="cell-right">
                <span>{{ stats.points || 0 }}</span>
              </div>
            </div>
          </router-link> -->
          <!-- 购买记录 -->
          <router-link :to="{ name: 'buy' }">
            <div class="cell">
              <div class="cell-left">
                <!-- <img src="@/assets/newimg/goumaijilu.svg" alt="article" class="left-img" /> -->
                <svg-icon icon-class="goumaijilu" class="left-img icon-feedback" />
                <span class="left-text">
                  {{ $t('sidebar.buy') }}
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
          <!-- 邀请记录 -->
          <router-link :to="{ name: 'invite' }">
            <div class="cell">
              <div class="cell-left">
                <svg-icon class="left-img" icon-class="box1" />
                <span class="left-text">
                  {{ $t('sidebar.invite') }}
                </span>
              </div>
              <div class="cell-right"><span></span></div>
            </div>
          </router-link>
        </div>
      
      </template>
      <template v-else>
        <div class="login-btn" href="javascript:;" @click="$store.commit('setLoginModal', true)">
          {{ $t('sidebar.login') }}
        </div>
      </template>
      <!-- 其它 -->
      <div class="cell-container">
        <!-- 使用手册 -->
        <a href="https://matataki.io/p/1060">
          <div class="cell">
            <div class="cell-left">
              <!-- <img src="@/assets/newimg/gonglue.svg" alt="article" class="left-img" /> -->
              <svg-icon icon-class="gonglue" class="left-img icon-feedback" />
              <span class="left-text">
                使用手册
              </span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
        <!-- 加入电报 -->
        <a href="https://t.me/smartsignature_io" target="_blank">
          <div class="cell">
            <div class="cell-left">
              <!-- <img src="@/assets/newimg/telegram.svg" alt="article" class="left-img" /> -->
              <svg-icon icon-class="telegram" class="left-img icon-feedback" />
              <span class="left-text">
                {{ $t('sidebar.tg') }}
              </span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
        <!-- 吐个槽 -->
        <a href="https://support.qq.com/product/98576" target="_blank">
          <div class="cell">
            <div class="cell-left">
              <svg-icon icon-class="tgc" class="left-img icon-feedback" />
              <span class="left-text">
                {{ $t('sidebar.feedback') }}
              </span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
      </div>
      <!-- 智能公告牌 -->
      <!-- <div class="cell-container">
        <a href="https://matataki.io/p/616">
          <div class="cell">
            <div class="cell-left">
              <img src="@/assets/img/icon_sidebar_sb.svg" alt="article" class="left-img" />
              <span class="left-text">
                {{ $t('sidebar.billboard') }}
              </span>
            </div>
            <div class="cell-right"><span></span></div>
          </div>
        </a>
      </div> -->
    </div>
    <div v-if="isLogined" class="fl bottom-bar">
      <router-link class="button-card" :to="{name: 'help'}">
        <div class="cell">
          <div class="cell-left center">
            <!-- <img src="@/assets/newimg/setting.svg" alt="home" class="left-img" /> -->
            <svg-icon icon-class="setting" class="left-img icon-feedback" />
            <span class="left-text">
              {{ $t('setting') }}
            </span>
          </div>
        </div>
      </router-link>
      <a class="button-card" @click="btnsignOut()">
        <div class="cell">
          <div class="cell-left center">
            <!-- <img src="@/assets/newimg/logout.svg" alt="home" class="left-img" /> -->
            <svg-icon icon-class="logout" class="left-img icon-feedback" />
            <span class="left-text">
              {{ $t('logout') }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </van-popup>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'js-cookie'
import defaultAvatar from '@/assets/avatar-default.svg'
import { getCookie } from '@/utils/cookie'

export default {
  name: 'Sidebar',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      showModal: false,
      sidebarShow: false,
      balance: 1,
      id: null,
      followed: false,
      follows: 0,
      fans: 0,
      name: '',
      email: '',
      avatar: '',
      introduction: '',
      stats: {
        accounts: 0,
        points: 0,
        referral_amount: 0,
        articles: 0,
        supports: 0,
        drafts: 0,
        bookmarks: 0
      },
      tokenUser: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'displayName', 'isLogined', 'isMe', 'hasNewNotification']),
    displayBalance() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(0, -4) : ''
    },
    displayBalanceSymbol() {
      const { balance } = this.currentUserInfo
      return balance ? balance.slice(-4) : ''
    },
    username() {
      let name = this.name
      return name.length > 16 ? name.slice(0, 16) + '...' : name
    }
  },
  watch: {
    value(val) {
      this.sidebarShow = val
    },
    sidebarShow(val) {
      this.$emit('input', val)
    },
    async isLogined(newState) {
      if (newState) {
        await this.refreshUser()
      }
    },
    currentUserInfo() {
      // 第一次会重复请求两次接口
      if (this.currentUserInfo.id) this.tokenUserId(this.currentUserInfo.id)
    },
    async $route() {
      if (this.isLogined) await this.getNotificationCounters()
    }
  },
  created() {
    if (getCookie('ACCESS_TOKEN')) this.refreshUser()
  },
  mounted() {
    // 保证切换正常显示状态
    if (this.currentUserInfo.id) this.tokenUserId(this.currentUserInfo.id)
  },
  methods: {
    ...mapActions(['signOut', 'getNotificationCounters']),
    btnsignOut() {
      this.signOut()
      this.jumpTo({ name: 'article' })
      this.$toast.success({
        duration: 1500,
        message: this.$t('success.logoutSuccess')
      })
    },
    jumpTo(params) {
      if (!params.name) return
      this.$router.push(params)
    },
    async tokenUserId(id) {
      await this.$backendAPI
        .tokenUserId(id)
        .then(res => {
          if (res.status === 200 && res.data.code === 0 && res.data.data.id > 0) {
            this.tokenUser = true
          }
        })
        .catch(err => console.log('get token user error', err))
    },
    async refreshUser() {
      const { isMe } = this
      const id = this.currentUserInfo.id
      this.id = this.currentUserInfo.id
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
        points,
        referral_amount,
        articles,
        supports,
        drafts,
        bookmarks
      }) => {
        this.email = email
        this.fans = fans
        this.follows = follows
        this.introduction = introduction
        this.followed = is_follow
        this.name = nickname || username
        this.setAvatarImage(avatar)
        this.stats = {
          accounts,
          points,
          referral_amount,
          articles,
          supports,
          drafts,
          bookmarks
        }
      }

      if (isMe(id)) {
        await this.$API
          .getMyUserData()
          .then(res => {
            if (res.code === 0) {
              setUser(res.data)
            } else {
              console.log(res.message)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
        await this.getNotificationCounters()
      }
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$API.getImg(hash)
      else this.avatar = defaultAvatar
    },
    changeInfo(status) {
      this.showModal = status
    },
    toggle() {
      // console.log(this.$i18n.locale)
      if (this.$i18n.locale === 'en') this.$i18n.locale = 'zh'
      else this.$i18n.locale = 'en'

      Cookies.set('language', this.$i18n.locale)

      this.sidebarShow = false
      // window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  width: 75%;
  max-width: 280px;
  background-color: #f1f1f1;
  overflow: hidden;
  color: #000000;
  .login-btn {
    text-align: center;
    margin: 50px 30px;
    background-color: #000;
    color: #fff;
    padding: 8px 20px;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 1px;
    min-width: 100px;
    cursor: pointer;
  }
  .container {
    height: calc(100% - 40px);
    overflow: auto;
    .account {
      padding: 20px 20px 10px;
      .top-container {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .avatar-container {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #aaa;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .setting {
        width: 20px;
        cursor: pointer;
      }
      .account-name {
        font-size: 18px;
        color: #000000;
        font-weight: 700;
        line-height: 28px;
        text-align: left;
      }
      .wallet-info {
        font-size: 14px;
        line-height: 20px;
        text-align: left;
      }
    }
    .follow-info {
      width: 100%;
      background-color: #ffffff;
      padding: 10px;
      box-sizing: border-box;
      .follow,
      .fans {
        display: inline-block;
        width: 50%;
        color: #000000;
        text-align: center;
        p:first-of-type {
          font-size: 20px;
          line-height: 28px;
          font-weight: 700;
        }
        p:last-of-type {
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
  }
  .cell-container {
    margin-top: 10px;
  }
  .cell {
    &:hover {
      background-color: #cccccc;
    }
    background-color: #ffffff;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .cell-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      &.center {
        margin: 0 auto;
      }
      .left-img {
        margin-right: 10px;
        width: 20px;
        font-size: 20px;
        color: #1f1f1f;
      }
      .left-text {
        color: #000000;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
      }
    }
    .cell-right {
      span {
        color: #b2b2b2;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
  .cell.active {
    .left-text {
      color: #542de0;
    }
  }
}
.icon-feedback {
  color: #000;
  font-size: 20px;
}
.bottom-bar {
  // bottom: 0rem;
  z-index: 9999;
  box-shadow: 0px -4px 5px #8888881a;
  position: sticky;
  overflow: hidden;
  .button-card {
    flex: 1;
  }
}
.notification-icon {
  width: 20px;
  font-size: 20px;
  color: #1f1f1f;
}
.badge {
  position: relative;
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: rgba(251, 104, 119, 1);
    position: absolute;
    z-index: 1000;
    right: 0%;
    margin-right: -3px;
    margin-top: -3px;
  }
}
</style>
