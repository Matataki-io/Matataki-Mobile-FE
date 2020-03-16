<template>
  <router-link
    :to="{ name: 'user-id', params: { id: card.id } }"
    class="user-list"
    tag="div"
  >
    <avatar
      size="40px"
      class="avatar"
      :src="avatarSrc"
    />
    <div class="user-info">
      <p
        class="user-title search-res"
        v-html="userTitle"
      />
      <p class="user-num">
        <span>{{ $t('follow') }}: {{ card && card.follows }}</span>
        &nbsp;
        <span>{{ $t('fans') }}: {{ card && card.fans }}</span>
      </p>
      <p class="user-des">
        {{ (card && card.introduction) || $t('notProfile') }}
      </p>
    </div>
    <template v-if="!isMe(card.id)">
      <el-button
        size="mini"
        :class="!card.is_follow && 'black'"
        class="follow"
        @click.stop="followOrUnFollow"
      >
        <i
          v-if="!card.is_follow"
          class="el-icon-plus"
        />
        {{ followBtnText }}
      </el-button>
    </template>
  </router-link>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
import { xssFilter } from '@/utils/xss'

export default {
  components: {
    avatar
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    avatarSrc() {
      if (this.card.avatar) return this.$ossProcess(this.card.avatar)
      return ''
    },
    userTitle() {
      return xssFilter(this.card.nickname || this.card.username)
    },
    followBtnText() {
      return this.card.is_follow ? this.$t('following') : this.$t('follow')
    }
  },
  methods: {
    followOrUnFollow() {
      if (this.card.is_follow) {
        this.$dialog
          .confirm({
            title: this.$t('promptTitle'),
            message: this.$t('searchUserList.confirmMessage')
          })
          .then(() => {
            this.followOrUnfollowUser(this.card.id, 0)
          })
      } else {
        this.followOrUnfollowUser(this.card.id, 1)
      }
    },
    async followOrUnfollowUser(id, type) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if ( res.code === 0) {
          this.$toast.success({
            duration: 1000,
            message: `${message}${this.$t('success.success')}`
          })
          this.card.is_follow = type === 1
        } else {
          this.$toast.fail({
            duration: 1000,
            message: `${message}${this.$t('error.fail')}`
          })
        }
      } catch (error) {
        this.$toast.fail({
          duration: 1000,
          message: `${message}${this.$t('error.fail')}`
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  margin-right: 12px;
  border: 1px solid #eaeaea;
  cursor: pointer;
}
.user-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  padding: 10px 20px;
  transition: all 0.3s;
  box-sizing: border-box;
}
.user-info {
  flex: 1;
  height: 70px;
  overflow: hidden;
  margin-right: 20px;
  .user-title {
    padding: 0;
    margin: 4px 0 0;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .user-num,
  .user-des {
    padding: 0;
    margin: 2px 0;
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
  }
  .user-num {
    margin: 2px 0;
  }
}

.follow {
  &.black {
    background: #333;
    color: #fff;
    border: 1px solid #333;
  }
}
</style>
