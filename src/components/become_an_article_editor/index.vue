<template>
  <div
    v-if="(isTokenArticle || isPriceArticle) && !isProduct"
    v-loading="lockLoading"
    class="lock"
  >
    <div class="lock-left">
      <img
        v-if="!(hasPaied && hasPaiedRead)"
        class="lock-img"
        src="@/assets/img/lock.png"
        alt="lock"
      >
      <img
        v-else
        class="lock-img"
        src="@/assets/img/unlock.png"
        alt="lock"
      >
    </div>
    <div class="lock-info">
      <h3 class="lock-info-title">
        {{ !(hasPaied && hasPaiedRead) ? `${unlockText}编辑权限` : `已${unlockText}编辑权限` }}
      </h3>
      <h5 class="lock-info-subtitle">
        {{ !(hasPaied && hasPaiedRead) ? '您需要达成以下解锁条件' : '您已达成以下解锁条件' }}
        <el-tooltip
          class="item"
          effect="dark"
          content="满足全部条件后即可编辑文章。"
          placement="top"
        >
          <svg-icon
            icon-class="anser"
            class="prompt-svg left-8px"
          />
        </el-tooltip>
      </h5>
      <p
        v-if="!isMe(article.uid)"
        class="lock-info-des"
      >
        <ul>
          <li
            v-if="isTollRead"
            class="fl"
          >
            <div class="fl price">
              阅读权限
              <svg-icon
                icon-class="view"
                class="avatar"
              />
            </div>
            <el-tooltip
              effect="dark"
              content="此文设有阅读限制，如果需要编辑必须获得阅读权限"
              placement="top"
            >
              <svg-icon
                icon-class="anser"
                class="prompt-svg"
              />
            </el-tooltip>
          </li>
          <li
            v-if="isPriceArticle"
            class="fl"
          >
            <div class="fl price">
              支付 {{ getArticlePrice }}
              <svg-icon
                icon-class="currency"
                class="avatar"
              />
              CNY
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              content="支付解锁的文章可在“购买记录”中永久查看。"
              placement="top"
            >
              <svg-icon
                icon-class="anser"
                class="prompt-svg"
              />
            </el-tooltip>
          </li>
          <li v-if="isTokenArticle">
            <div class="fl price">
              持有 {{ needTokenAmount }}
              <router-link
                :to="{name: 'token-id', params:{ id:needTokenId }}"
                target="_blank"
                class="fl"
              >
                <avatar
                  :size="'18px'"
                  :src="needTokenLogo"
                  class="avatar"
                /> 
                {{ needTokenSymbol }}（{{ needTokenName }}）
              </router-link>
            </div>
            <!-- 不显示 - 号 -->
            <p>{{ !tokenHasPaied ? '还需持有' : '已持有' }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }} {{ needTokenSymbol }}</p>
          </li>
        </ul>
      </p>
      <p
        v-else
        class="lock-info-des"
      >
        自己发布的文章
      </p>
      <div
        v-if="!hasPaied"
        class="lock-bottom"
      >
        <span class="lock-bottom-total">总计约{{ totalCny }}CNY</span>
        <el-button
          type="primary"
          size="small"
          @click="wxpayEdit"
        >
          一键{{ unlockText }}
        </el-button>
      </div>
      <div
        v-else
        class="lock-bottom"
      >
        <span
          v-if="!hasPaiedRead"
          class="lock-bottom-total"
        >此文设有阅读限制，如果需要编辑必须获得阅读权限</span>
        <el-button
          type="primary"
          size="small"
          :disabled="!hasPaiedRead"
          @click="edit"
        >
          编辑文章
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar/index.vue'
import { precision } from '@/utils/precisionConversion'
import utils from '@/utils/utils'

export default {
  name: 'ArticleCard',
  components: {
    avatar
  },
  props: {
    // 文章数据
    article: {
      type: Object,
      required: true
    },
    // 是否已解锁（购买）编辑权限
    hasPaied: {
      type: Boolean,
      default: false
    },
    // 是否已解锁（购买）编辑权限
    tokenHasPaied: {
      type: Boolean,
      default: false
    },
    differenceToken: {
      type: String,
      default: '0'
    },
    form: {
      type: Object,
      required: true
    },
    inputAmountError: {
      type: String,
      default: ''
    },
    lockLoading: {
      type: Boolean,
      default: false
    },
    // 是收费文章
    isTollRead: {
      type: Boolean,
      default: false
    },
    // 已解锁阅读权限
    hasPaiedRead: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      isProduct: false,
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    unlockText() {
      if (this.isPriceArticle) {
        return '购买'
      }
      return '解锁'
    },
    // 是否是持通证文章
    isTokenArticle() {
      return (this.article.editTokens && this.article.editTokens.length !== 0)
    },
    // 是否是付费文章
    isPriceArticle() {
      return (this.article.editPrices && this.article.editPrices.length !== 0)
    },
    // 价格
    getArticlePrice() {
      if (this.isPriceArticle && this.article.editPrices[0]) {
        const ad = this.article.editPrices[0]
        return this.$utils.fromDecimal(ad.price)
      } else {
        return 0
      }
    },
    // 需要多少Fan票
    needTokenAmount() {
      if (this.article.editTokens.length !== 0) {
        return precision(this.article.editTokens[0].amount, 'CNY', this.article.editTokens[0].decimals)
      } else return 0
    },
    // Fan票ID
    needTokenId() {
      if (this.article.editTokens.length !== 0) {
        return this.article.editTokens[0].id
      } else return -1
    },
    // 需要多少Fan票代号
    needTokenSymbol() {
      if (this.article.editTokens.length !== 0) {
        return this.article.editTokens[0].symbol
      } else return ''
    },
    // 需要多少Fan票名称
    needTokenName() {
      if (this.article.editTokens.length !== 0) {
        return this.article.editTokens[0].name
      } else return ''
    },
    // 需要多少Fan票LOGO
    needTokenLogo() {
      if (this.article.editTokens.length !== 0) {
        return this.$ossProcess(this.article.editTokens[0].logo)
      } else return ''
    },
    // 总价
    totalCny() {
      let result = 0
      if (this.isTokenArticle) {
        result += parseFloat(this.form.input || 0)
      }
      return utils.up2points(result + this.getArticlePrice)
    }
  },
  methods: {
    // 购买编辑权限
    wxpayEdit() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      if (this.inputAmountError) {
        this.$message.error(this.inputAmountError)
        return
      }
      this.$store.dispatch('order/createOrder', {
        ...this.form,
        type: 'buy_token_output',
        needToken: this.isTokenArticle && !this.tokenHasPaied,
        // needPrice: this.isPriceArticle && !this.priceHasPaied,
        signId: this.article.id
      })
    },
    edit() {
      if(this.article && this.article.hash) {
        this.$router.push({
          name: 'publish-type-id',
          params: { type: 'edit', id: this.article.id },
          query: { hash: this.article.hash }
        })
      }
      else this.$message.error('无法获取文章Hash')
    }
  }
}
</script>

<style lang="less" scoped>

.lock {
  display: flex;
  &-left {
    align-self: flex-start;
    margin-right: 10px;
  }
  .lock-img {
    width: 20px;
  }
  &-info {
    width: 100%;
    &-title {
      font-size: 20px;
      color: #000000;
      padding: 0;
      margin: 0;
    }
    &-subtitle {
      font-size: 14px;
      color: #B2B2B2;
      padding: 0;
      margin: 0;
      font-weight: 400;
    }
  }
  &-info-des {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color:rgba(178,178,178,1);
    }
    a {
      color: #542DE0;
    }
    .price {
      flex: 1;
      flex-flow: row wrap;
    }
  }
  .lock-pay-text {
    white-space: nowrap;
  }
  &-bottom {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #DBDBDB;
    margin-top: 10px;
    padding-top: 10px;
    &-total {
      font-size: 14px;
      color: #B2B2B2;
      margin-right: 20px;
      display: flex;
      align-items: center;
    }
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 0 0;
    width: 100%;
    li {
      margin-bottom: 10px;
    }
  }
  .help-icon {
    color:#DBDBDB;
  }

}

.lock {
  width: 90%;
  margin: 10px auto;
  background: #fff;
  border-radius: 4px;
  padding: 20px 20px 10px 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #DBDBDB;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    width: 100%;
    height: 10px;
    background: #EBE6FF;
  }
}

.avatar {
  bottom: -1px;
  position: relative;
  margin: 0 5px;
  width: 16px;
  height: 16px;
}

.prompt-svg {
  position: relative;
  bottom: -1px;
  width: 16px;
  height: 16px;
  &.left-8px{
    margin-left: 8px;
  }
}
</style>
