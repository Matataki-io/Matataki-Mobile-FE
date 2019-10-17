<template>
  <div v-if="isPublishCoins" class="coins-publish">
    <div class="block-border">
      <div class="fl ac coins-head">
        <div class="fl ac">
          <avatar v-if="tokenCover" :src="tokenCover" size="30px" style="margin-right: 10px;" />
          <h1>
            {{ tokenDetailData.token.symbol }}
            ({{ tokenDetailData.token.name }})
          </h1>
        </div>
        <!-- <el-tooltip effect="dark" content="如何管理你的粉丝币?" placement="top-start">
        <svg-icon
          class="help-icon"
          icon-class="help"
        />
      </el-tooltip> -->
        <!-- <a class="help-link" target="_blank" href="">如何管理你的粉丝币?</a> -->
      </div>

      <div class="coins-info">
        <div class="info-block">
          <div class="info-data">
            <p class="info-data-number">{{ totalAmount }}<sub>枚</sub></p>
            <p class="info-data-title">
              发行总量
            </p>
          </div>
          <div class="info-data">
            <p class="info-data-number">{{ tokenReserve }}<sub>枚</sub></p>
            <p class="info-data-title">
              流通量
            </p>
          </div>
          <div class="info-data">
            <p class="info-data-number">{{ cnyReserve }}<sub>元</sub></p>
            <p class="info-data-title">
              资金池
            </p>
          </div>
          <div class="info-data">
            <p class="info-data-number">{{ balance }}<sub>枚</sub></p>
            <p class="info-data-title">
              我的持仓总量
            </p>
          </div>
          <div class="info-data">
            <p class="info-data-number">{{ nowPrice }}<sub>元</sub></p>
            <p class="info-data-title">
              现价
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="minetoken-card">
      <div class="minetoken-tab">
        <router-link :to="{ name: 'minetoken' }" :class="$route.name === 'minetoken' && 'active'">
          持仓详情
        </router-link>
        <router-link
          :to="{ name: 'minetokenDetail' }"
          :class="$route.name === 'minetokenDetail' && 'active'"
        >
          流水明细
        </router-link>
      </div>
      <div v-if="$route.name === 'minetoken'" class="minetoken-head">
        <div class="minetoken-title">持仓者</div>
        <div class="minetoken-number">持仓量</div>
      </div>
      <slot></slot>
    </div>

    <div class="fixed-bottom">
      <el-button class="fix-button" @click="addCoins">增发</el-button>
      <router-link :to="{ name: 'exchange' }">
        <el-button class="fix-button" type="primary">交易</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
// import card from './minetoken_card.vue'
import avatar from '@/components/avatar/index.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
// import { testDecimal } from '@/utils/reg'

export default {
  components: {
    avatar
    // card
  },
  props: {
    listType: {
      // 持仓 明细 details detail
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPublishCoins: false,
      tokenDetailData: Object.create(null)
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    totalAmount() {
      if (this.tokenDetailData.token) {
        const tokenamount = precision(
          this.tokenDetailData.token.total_supply,
          'CNY',
          this.tokenDetailData.token.decimals
        )
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    },
    tokenReserve() {
      if (this.tokenDetailData.exchange) {
        const tokenamount = precision(
          this.tokenDetailData.exchange.token_reserve,
          'CNY',
          this.tokenDetailData.token.decimals
        )
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    },
    cnyReserve() {
      if (this.tokenDetailData.exchange) {
        const tokenamount = precision(
          this.tokenDetailData.exchange.cny_reserve,
          'CNY',
          this.tokenDetailData.token.decimals
        )
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    },
    balance() {
      if (this.tokenDetailData.token) {
        const tokenamount = precision(
          this.tokenDetailData.token.balance,
          'CNY',
          this.tokenDetailData.token.decimals
        )
        return this.$publishMethods.formatDecimal(tokenamount, 4)
      } else return 0
    },
    nowPrice() {
      if (this.tokenDetailData.exchange) {
        const price =
          this.tokenDetailData.exchange.cny_reserve / this.tokenDetailData.exchange.token_reserve
        const formatDecimal = this.$publishMethods.formatDecimal(price, 2)
        return isNaN(formatDecimal) ? 0 : Number(formatDecimal) < 0.01 ? '<0.01' : formatDecimal
      } else return 0
    },
    tokenCover() {
      if (this.tokenDetailData.token) {
        const logo = this.tokenDetailData.token.logo
        return logo ? this.$backendAPI.getImg(logo) : ''
      } else return ''
    }
  },
  created() {
    this.tokenDetail()
    // 根据token判断是否有币 如果有显示当前页面并且调用list
    // 否则修改界面显示
  },
  mounted() {},
  methods: {
    async tokenDetail() {
      await this.$backendAPI.tokenDetail().then(res => {
        if (res.status === 200 && res.data.code === 0) {
          if (res.data.data.token) {
            this.isPublishCoins = true
            this.tokenDetailData = res.data.data
          } else {
            this.$emit('notToken')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    async minetokenMint(amount) {
      const data = {
        amount: toPrecision(amount, 'CNY', this.tokenDetailData.token.decimals)
      }
      await this.$backendAPI.minetokenMint(data).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.tokenDetail()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    addCoins() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.$prompt('增发数量(总量最多发行一亿)', '提示', {
        inputPattern: /^\d{0,9}$/,
        inputErrorMessage: '请输入数字(总量最多发行一亿)',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'mimetokens-prompt'
      }).then(({ value }) => {
        if (Number(value) + Number(this.totalAmount) > 100000000)
          return this.$message.warning('发行总量不能超过一亿')
        if (Number(value) > 0) this.minetokenMint(Number(value))
      })
    },
    createTime(time) {
      return moment(time).format('MMMDo HH:mm')
    },
    getListData(res) {
      // console.log(res)
      this.pointLog.list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.coins-publish {
  // padding: 10px;\
}
.block-border {
  background-color: #fff;
  // border-bottom: 1px solid #ececec;
}
.coins-head {
  padding: 20px 20px 10px;
  h1 {
    padding: 0;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .help-icon {
    color: rgba(219, 219, 219, 1);
    margin-left: 10px;
    margin-right: 10px;
  }
  .help-link {
    font-size: 14px;
    color: rgba(178, 178, 178, 1);
    line-height: 20px;
    text-decoration: underline;
  }
}

.coins-info {
  border-bottom: 1px solid #ececec;
  padding: 0 0 20px;
}
.info-line {
  width: 1px;
  height: 40px;
  background: #dbdbdb;
  margin: 0 40px;
}
.info-block {
  display: flex;
  flex-wrap: wrap;
  .info-data {
    text-align: center;
    flex: 0 0 33.33%;
    margin: 5px 0;
    &-number {
      font-size: 20px;
      font-weight: bold;
      color: rgba(84, 45, 224, 1);
      line-height: 28px;
      padding: 0;
      margin: 0;
      sub {
        bottom: 0;
        font-size: 70%;
      }
    }
    &-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 1);
      line-height: 20px;
      padding: 0;
      margin: 0;
    }
  }
}
.info-btn {
  margin-left: 40px;
  .info-button {
    margin: 4px 0;
  }
}

.minetoken-card {
  background: #fff;
  padding: 0 0 130px 0;
}
.minetoken-tab {
  padding: 14px 0;
  text-align: center;
  border-bottom: 1px solid #ececec;
  a {
    font-size: 14px;
    font-weight: 500;
    color: #b2b2b2;
    line-height: 20px;
    margin: 0 20px;
    &.active {
      color: #000;
    }
  }
}

.minetoken-head {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 20px;
  padding: 14px 20px;
  .minetoken-title {
    width: 70%;
  }
  .minetoken-number {
    width: 30%;
    text-align: center;
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
  height: 130px;
  .fix-button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>

<style>
.mimetokens-prompt {
  width: 90%;
}
</style>
