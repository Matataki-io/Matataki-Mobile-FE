<template>
  <div class="banner-container mw">
    <div class="banner">
      <div class="banner-logo">
        <img class="logo" src="@/assets/img/index/logo.png" alt="logo" />
      </div>
      <div class="banner-data">
        <!-- <div class="data">
          <p class="data-title">
            {{ $t('home.bannerUser') }}
          </p>
          <p class="data-num">
            {{ postsStats.users }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerArticles') }}
          </p>
          <p class="data-num">
            {{ postsStats.articles }}
          </p>
        </div> -->
        <div class="data">
          <p class="data-title">
            {{ $t('home.bannerPoint') }}
          </p>
          <p class="data-num">
            {{ postsStats.points }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            {{ $t('point.title') }}
          </p>
          <p class="data-num">
            {{ pointStatus.amount || 0 }}
          </p>
        </div>
      </div>
      <div class="invite">
        <el-button @click="share" type="primary" size="mini" class="invite-button">
          邀请有奖
        </el-button>
      </div>
    </div>  
    <Share
      :share-modal-show="shareModalShow"
      :minetoken-user="{ nickname: 123 }"
      :page-type="2"
      @input="val => (shareModalShow = val)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import Share from '@/components/token/token_share.vue'

export default {
  components: { Share },
  data() {
    return {
      postsStats: {
        users: 0,
        articles: 0,
        points: 0
      },
      pointStatus: Object.create(null),
      shareModalShow: false
    }
  },
  computed: {
  ...mapGetters(['isLogined'])
  },
  mounted() {
    this.getPostsStats()
    this.getUserPointStatus()
  },
  methods: {
    getPostsStats() {
      this.$backendAPI
        .postsStats()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) this.postsStats = res.data.data
        })
        .catch(err => console.log(`${err}`))
    },
    // 防抖防止不必要的调用
    getUserPointStatus: debounce(async function () {
      // 没登录的情况
      if (!this.isLogined) {
        this.pointStatus = { amount: 6666 }
        return
      }
      // 获取数据
      await this.$backendAPI.userPointStatus()
        .then(res => {
          // console.log('个人统计数据：', res)
          if (res.data.code === 0) this.pointStatus = res.data.data
          else console.log(res.data.message)
        })
        .catch(err => console.log('获取个人统计数据失败', err))
    }, 1000),
    share() {
      if (this.isLogined) {
        this.shareModalShow = true
      } else {
        this.$store.commit('setLoginModal', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.banner-container {
  padding: 0 20px;
  box-sizing: border-box;
}
.banner {
  margin-top: 5px;
  margin-bottom: 20px;
  height: 67px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #DBDBDB;
}

.banner-logo {
  display: flex;
  flex-direction: column;
  align-items: self-end;
  .logo {
    width: 40px;
  }
}

.banner-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 2px;
  box-sizing: border-box;
  &-title {
    color: rgba(178, 178, 178, 1);
    padding: 0;
    margin: 0;
    font-size: 10px;
    font-weight: 400;
    line-height: 14px;
  }
  &-num {
    font-size: 20px;
    font-weight: bold;
    color: #542de0;
    padding: 0;
    margin: 0;
    word-break: break-all;
    line-height: 1.3;
  }
}
.invite{
  margin-right: 4px;
  margin-left: 20px;
  .invite-button {
    border-radius: 96px;
  }
}

// .banner-more {
//   font-size: 14px;
//   margin: 8px 0 0;
//   text-decoration: underline;
//   color: #542de0;
// }
</style>
