<template>
  <div class="home-fixed home-head mw">
    <div
      v-if="isLogined"
      class="home-head-avatar"
      @click="$emit('login')"
    >
      <img
        :src="avatar"
        alt="avatar"
        :onerror="defaultAvatar"
      >
    </div>
    <a
      v-else
      href="javascript:void(0);"
      class="home-head-notlogin"
      @click="$emit('login')"
    >
      {{ $t('login') }}
    </a>

    <div class="home-head-nav">
      <router-link
        v-for="(item, index) in navList"
        :key="index"
        :class="item.urlList.includes($route.name) && 'active'"
        :to="{ name: item.name }"
      >
        <span>
          {{ item.title }}
        </span>
      </router-link>
    </div>
    <div class="fl ac">
      <svg-icon
        class="search-icon"
        icon-class="search"
        @click="showSearch = true"
      />
      <img
        class="home-head-create"
        src="@/assets/img/icon_home_create.svg"
        alt="create"
        @click="writeP"
      >
    </div>
    <search
      :show-search="showSearch"
      @showSearchStatus="showSearch = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import search from './search.vue'

export default {
  name: 'HomeHead',
  components: {
    search
  },
  props: {},
  data() {
    return {
      avatar: '',
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      showSearch: false
    }
  },
  computed: {
    navList() {
      return [
        {
          title: this.$t('home.home'),
          name: 'home',
          urlList: ['home']
        },
        {
          title: this.$t('home.creation'),
          name: 'article',
          urlList: ['article', 'article-token', 'article-follow']
        },
        {
          title: this.$t('home.share'),
          name: 'sharehall',
          urlList: ['sharehall']
        },
        // {
        //   title: this.$t('home.navShop'),
        //   name: 'shop',
        //   urlList: ['shop']
        // },
        {
          title: this.$t('home.fanTicket'),
          name: 'token',
          urlList: ['token']
        }
      ]
    },
    ...mapGetters(['currentUserInfo', 'isLogined'])
  },
  watch: {
    isLogined(newState) {
      if (newState) {
        this.refreshUser()
      }
    }
  },
  created() {
    if (this.isLogined) {
      // console.log('isLogined', this.isLogined)
      this.refreshUser()
    }
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    writeP() {
      if (this.isLogined)
        this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
      else this.$store.commit('setLoginModal', true)
    },
    async refreshUser() {
      const res = await this.getCurrentUser()
      if (res && res.avatar) {
        if (res.avatar) this.avatar = this.$ossProcess(res.avatar, {h: 60})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99;
}
.home-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f1f1;
  padding: 10px;
  background-color: #fff;
  box-sizing: border-box;
  &-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-notlogin {
    font-size: 10px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 2px;
    padding: 4px 8px;
    background: #000;
    border-radius: 6px;
  }
  &-nav {
    a {
      font-size: 1rem;
      color: rgba(178, 178, 178, 1);
      margin: 0 4px;
      position: relative;
      text-align: center;
      display: inline-block;
      transition: all 0.18s ease-in-out;
      span {
        z-index: 2;
        position: relative;
      }
      &.active {
        font-weight: bold;
        z-index: 1;
        color: rgba(0, 0, 0, 1);
      }
      &.active::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0px;
        right: 0px;
        display: block;
        height: 4px;
        background-color: #542de0;
      }
    }
  }

  &-create {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}

.search-icon {
  color: #000;
  cursor: pointer;
  font-size: 20px;
  margin-right: 16px;
}

.notice-btn {
  cursor: pointer;
  font-size: 14px;
  color: #b2b2b2;
  margin: 0 0.25rem;
}
</style>

<style lang="less">
.notice {
  width: 90%;
  h3 {
    padding: 0;
    margin: 12px 0 8px 0;
  }
  p {
    padding: 0;
    margin: 6px 0;
    font-size: 14px;
    line-height: 1.3;
  }
}
</style>
