<template>
  <div class="account">
    <BaseHeader
      :pageinfo="{ title: $t('sidebar.account') }"
      :has-bottom-border-line="true"
    />
    <accountNav />
    <div class="account-head">
      <p>待提现</p>
      <div class="fl jsb">
        <span>￥{{ playerincome }}</span>
        <div>
          <el-button
            size="mini"
            disabled
          >
            提现
          </el-button>
          <el-button
            size="mini"
            @click="giftDialogShow = true"
          >
            转账
          </el-button>
        </div>
      </div>
    </div>

    <div class="account-list">
      <BasePull
        :params="pull.params"
        :api-url="pull.apiUrl"
        :loading-text="$t('not')"
        :is-obj="{ type: 'newObject', key: 'data', keys: 'logs' }"
        :need-access-token="true"
        :auto-request-time="0"
        @getListData="getListData"
      >
        <card
          v-for="(item, index) in pull.list"
          :key="index"
          :card="item"
        />
      </BasePull>
    </div>
    <giftDialog
      v-model="giftDialogShow"
      :balance="playerincome"
    />
  </div>
</template>

<script>
import card from './components/card.vue'
import giftDialog from './components/giftDialog.vue'
import { precision } from '@/utils/precisionConversion'
import accountNav from '@/components/account_nav/index.vue'

export default {
  components: {
    card,
    giftDialog,
    accountNav
  },
  data() {
    return {
      cny: Object.create(null),
      pull: {
        params: {
          symbol: 'CNY'
        },
        apiUrl: 'assetList',
        list: []
      },
      giftDialogShow: false
    }
  },
  computed: {
    playerincome() {
      if (this.cny.balance) {
        const tokenamount = precision(this.cny.balance, 'CNY', 4)
        return Number(this.$publishMethods.formatDecimal(tokenamount, 4))
      } else {
        return 0
      }

    },
  },
  methods: {
    getListData(res) {
      // console.log(res)
      this.cny = res.data.data
      this.pull.list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.account {
  padding-top: 45px;
  min-height: 100%;
  background-color: #fff;
}

.account-head {
  background-color: #fff;
  padding: 20px;
  border-bottom: 1px solid #ececec;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  span {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 28px;
  }
}
.account-list {
  border-top: 10px solid #f7f7f7;
}
</style>
