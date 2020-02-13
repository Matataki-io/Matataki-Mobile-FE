<template>
  <div v-if="tokenUser" class="token-card-bg">
    <router-link :to="{name: 'token-id', params: { id: tokenData.id }}" class="fl token-card" tag="div">
      <div>
        <avatar :src="cover" size="60px" />
      </div>
      <div class="card-info">
        <div class="fl">
          <h2>
            {{ tokenData.symbol }}
          </h2>
          <router-link :to="{name: 'user-id', params: { id: currentUserInfo.id }}" class="card-username">
            {{ name }}
            <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        <p>
          {{ tokenData.name }}
        </p>
        <p>
          {{ tokenData.brief }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import avatar from '@/components/avatar/index.vue'
export default {
  components: {
    avatar
  },
  data() {
    return {
      tokenData: {},
      tokenUser: false,
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    cover() {
      return this.tokenData.logo ? this.$ossProcess(this.tokenData.logo, {h: 90}) : ''
    },
    name() {
      let name = (this.currentUserInfo.nickname || this.currentUserInfo.username) || ''
      return name.length > 12 ? name.slice(0, 12) + '...' : name
    }
  },
  watch: {
    isLogined(newState) {
      if (newState) this.tokenUserId()
    }
  },
  created() {
    if (this.isLogined) this.tokenUserId()
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    async tokenUserId() {
      await this.$API
        .tokenUserId(this.currentUserInfo.id)
        .then(res => {
          if (res.code === 0 && res.data.id > 0) {
            this.tokenUser = true
            this.tokenData = res.data
          }
        })
        .catch(err => console.log('get token user error', err))
    }
  }
}
</script>

<style scoped lang="less">
.token-card-bg {
  background-color: #f7f7f7;
  padding-bottom: 10px;
}
.token-card {
  width: 100%;
  padding: 20px;
  background: @white;
  cursor: pointer;
  .card-info {
    -webkit-box-flex: 1;
    flex: 1;
    margin-left: 10px;
    h2 {
      flex: 1;
      font-size: 16px;
      font-weight: 400;
      color: #000;
      line-height: 28px;
      padding: 0;
      margin: 0;
    }
    P {
      font-size: 12px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 20px;
      padding: 0;
      margin: 4px 0 0 0;
    }
    .card-username {
      margin-left: 6px;
      font-size: 12px;
      font-weight: 400;
      color: #000;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
  }
}
</style>
