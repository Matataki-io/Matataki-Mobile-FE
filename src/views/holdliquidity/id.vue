<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '明细' }"
      customize-header-bc="#fff"
    />
    <div class="tokens-head">
      <div class="fl jsb">
        <div class="info">
          <router-link :to="{ name: 'token-id', params: { id: tokenDetail.id } }">
            <avatar
              :src="cover"
              size="30px"
            />
          </router-link>
          <div class="user-info">
            <h3>{{ tokenDetail.symbol || '' }}</h3>
            <h4>{{ tokenDetail.name || '' }}</h4>
          </div>
        </div>
        <div class="number">
          {{ tokenAmount(tokenDetail.total_supply) || 0 }}
        </div>
      </div>
      <div class="fl jsb publish-tokens">
        <div class="username">
          创始人：{{ userDetail.nickname || userDetail.username }}
        </div>
        <router-link
          class="jump"
          :to="{ name: 'user-id', params: { id: userDetail.id } }"
        >
          <svg-icon icon-class="share" />
        </router-link>
      </div>
    </div>
    <BasePull
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      loading-text="暂无"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      :reload="reload"
      @getListData="getListData"
    >
      <card
        v-for="item in pointLog.list"
        :key="item.id"
        :card="item"
      />
    </BasePull>
    <div class="fixed-bottom">
      <!-- <el-button class="fix-button" @click="showGift">赠送</el-button> -->
      <router-link :to="{ name: 'exchange', hash: '#swap', query: { output: tokenDetail.symbol } }">
        <el-button
          class="fix-button"
          type="primary"
        >
          交易
        </el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import card from './components/tokens_detail_card.vue'
import { precision } from '@/utils/precisionConversion'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    card,
    avatar
  },
  data() {
    return {
      tokenDetail: Object.create(null),
      userDetail: Object.create(null),
      pointLog: {
        params: {
          tokenId: this.$route.params.id
        },
        apiUrl: 'liquidityLogsDetail',
        list: []
      },
      giftDialog: false,
      reload: 0,
      transferLoading: false
    }
  },
  computed: {
    cover() {
      return this.tokenDetail.logo ? this.$ossProcess(this.tokenDetail.logo) : ''
    }
  },
  methods: {
    getListData(res) {
      console.log(res)
      this.tokenDetail = res.data.data.tokenDetail
      this.userDetail = res.data.data.userDetail
      this.pointLog.list = res.list
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.tokenDetail.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },
  }
}
</script>

<style lang="less" scoped>
.tokens {
  background-color: #fff;
  padding: 45px 0 100px 0;
  min-height: 100%;
}
.tokens-head {
  padding: 20px;
  border-bottom: 1px solid #ececec;
  .info {
    display: flex;
    align-items: center;
  }
  .user-info {
    margin-left: 10px;
    h3 {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 17px;
    }
    h4 {
      font-size: 12px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 17px;
    }
  }
  .username {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .number {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .publish-tokens {
    margin-top: 10px;
  }
  .jump {
    background: rgba(241, 241, 241, 1);
    width: 20px;
    height: 20px;
    color: #b2b2b2;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.fixed-bottom {
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px 15px 20px;
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.1);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    width: 100%;
    display: block;
  }
  .fix-button {
    width: 100%;
  }
}

.gift-form {
  .tokenname {
    padding: 0;
    margin: 0;
  }
}
.gift-avatar {
  border: 1px solid #ececec;
}
.avatar-content {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -20px;
    align-items: center;
    justify-content: center;
    color: #8c8c8c;
    font-size: 20px;
  }
}
</style>
