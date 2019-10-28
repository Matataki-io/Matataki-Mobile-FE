<template>
  <div class="article" @click.stop="opr = false">
    <BaseHeader
      :pageinfo="{ title: article.channel_id === 2 ? $t('p.articleTitle') : $t('p.shopTitle') }"
    >
      <div v-if="isMe(article.uid)" slot="right" class="more" @click.stop="opr = !opr">
        <img src="@/assets/more.svg" alt="more" />
        <transition name="fade" mode="out-in">
          <div v-show="opr" class="dropdown">
            <div
              class="dropdown-item"
              @click="
                $router.push({
                  name: 'Publish',
                  params: { id: article.id },
                  query: { from: 'edit', hash: article.hash }
                })
              "
            >
              {{ $t('edit') }}
            </div>
            <div class="dropdown-item" @click="transferModal = true">
              {{ $t('transfer') }}
            </div>
            <div class="dropdown-item" @click="delArticleButton">
              {{ $t('delete') }}
            </div>
          </div>
        </transition>
      </div>
      <!-- 文章攻略 暂时隐藏 -->
      <!-- <div slot="info" class="information" @click="infoModa = true">
        <img src="@/assets/newimg/gonglue_innovationbar.svg" alt="information" />
        <span>攻略</span>
      </div> -->
    </BaseHeader>

    <ContentLoader v-if="articleLoading" class="content-loader" :height="300">
      <circle cx="36" cy="24" r="12" />
      <rect x="54" y="14" rx="0" ry="0" width="64" height="10" />
      <rect x="54" y="26" rx="0" ry="0" width="30" height="8" />
      <rect x="27" y="46" rx="0" ry="0" width="334" height="240" />
    </ContentLoader>
    <template v-else>
      <img v-if="cover" v-lazy="cover" :src="cover" alt="" class="top-image" />
      <header class="ta_header">
        <h1>{{ article.title }}</h1>
        <div class="userinfo-container">
          <div class="avatar-info">
            <router-link :to="{ name: 'User', params: { id: article.uid } }">
              <avatar :src="articleAvatar" class="avatar" />
            </router-link>
            <div class="avatar-right">
              <router-link class="author" :to="{ name: 'User', params: { id: article.uid } }">
                {{ article.nickname || article.author }}
              </router-link>
              <p class="other">
                {{ $t('p.publishFrom') }}
                {{ articleCreateTimeComputed }}
                <svg-icon icon-class="view" class="avatar-read" />
                {{ article.read || 0 }}
                {{ $t('read') }}
              </p>
            </div>
          </div>
          <template v-if="!isMe(article.uid)">
            <template v-if="!followed">
              <div class="follow-btn" @click="followOrUnfollowUser({ id: article.uid, type: 1 })">
                <van-icon name="plus" />
                {{ $t('follow') }}
              </div>
            </template>
            <template v-else>
              <span class="follow-btn" @click="followOrUnfollowUser({ id: article.uid, type: 0 })">
                {{ $t('unFollow') }}
              </span>
            </template>
          </template>
        </div>
      </header>
      <ipfs :is-hide="tokenArticle" :hash="article.hash"></ipfs>

      <mavon-editor v-show="false" style="display: none;" />
      <div class="markdown-body" v-html="compiledMarkdown"></div>
      <statement v-if="isTokenArticle" :article="article"></statement>

      <!-- 解锁按钮 -->
      <div v-if="tokenArticle" class="lock">
        <el-divider v-if="!isTokenArticle">
          <i class="el-icon-lock lock-icon" />
        </el-divider>

        <div class="lock-info fl ac jsb">
          <div class="fl ac">
            <img v-if="!isTokenArticle" class="lock-img" src="@/assets/img/lock.png" alt="lock" />
            <img v-else class="lock-img" src="@/assets/img/unlock.png" alt="lock" />
            <div>
              <h3 class="lock-info-title">
                {{ !isTokenArticle ? '解锁全文的条件' : '已解锁全文' }}
                <el-tooltip class="item" effect="dark" placement="top-start">
                  <div slot="content">
                    阅读本文需要先持有特定数量的粉丝币，<br />满足本文的阅读条件后刷新页面即可阅读全文。
                  </div>
                  <svg-icon class="help-icon" icon-class="help" />
                </el-tooltip>
              </h3>
              <p v-if="!isMe(article.uid)" class="lock-info-des">
                持有{{ needTokenAmount }}枚以上的{{ needTokenSymbol }}粉丝币
                <br />
                <!-- 不显示 - 号 -->
                <span
                  >{{ !isTokenArticle ? '还差' : '目前拥有'
                  }}{{ isLogined ? differenceToken.slice(1) : needTokenAmount }}枚{{
                    needTokenSymbol
                  }}
                </span>
              </p>
              <p v-else class="lock-info-des">
                自己发布的文章
              </p>
            </div>
          </div>
          <div class="exchangeBtns">
            <el-button
              v-if="!isTokenArticle"
              class="wxpayBtn"
              plain
              :disabled="payBtnDisabled"
              type="primary"
              size="mini"
              @click="wxpay"
            >
              微信支付
            </el-button>
            <router-link :to="{ name: 'exchange' }">
              <el-button size="mini" type="primary">
                获取粉丝币
              </el-button>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="article.tags !== undefined && article.tags.length !== 0" class="tag-review">
        <tag-card
          v-for="(item, index) in article.tags"
          :key="index"
          :tag-card="item"
          :tag-mode="false"
        />
      </div>
    </template>
    <router-link :to="{ name: 'BuyHistory' }">
      <div v-if="article.is_buy" class="buy-alert">
        {{ $t('p.buyHistory') }}
      </div>
    </router-link>

    <!-- 内容居中 -->
    <div class="article-container">
      <!-- 评论内容 -->
      <commentInput
        v-if="article.channel_id !== 2"
        :article="article"
        @doneComment="commentRequest = Date.now()"
      />
      <!-- <CommentList :class="!isProduct && 'has-comment-input'" :comment-request="commentRequest" :sign-id="article.id" :type="article.channel_id" /> -->
      <!--<div class="product" v-if="article.product">
        <div class="product-list" v-for="(item, index) in article.product" :key="index">
          <span>《{{item.title}}》&#45;&#45;key: {{item.digital_copy}}</span>
          <img
            src="@/assets/img/icon_copy.svg"
            class="copy-product-info"
            alt="hash"
            @click="copyText('《' + item.title + '》&#45;&#45;key:'+ item.digital_copy)">
        </div>
      </div>-->
      <CommentsList
        class="comments"
        :sign-id="signId"
        :is-request="isRequest"
        :type="article.channel_id"
        :comment-request="commentRequest"
        @stopAutoRequest="status => (isRequest = status)"
      />
    </div>

    <div class="empty-line"></div>

    <footer v-if="article.channel_id === 2" class="footer">
      <div class="footer-block footer-info">
        <div class="amount">
          <Dropdown trigger="click" @on-click="toggleAmount">
            <div>
              <div
                :class="totalSupportedAmount.showName === 'eos' ? 'eos' : 'ont'"
                class="amount-img"
              ></div>
              <span class="footer-number" :class="{ 'text-yellow': article.channel_id === 2 }">{{
                totalSupportedAmount.show
              }}</span
              >&nbsp;
              <Icon type="ios-arrow-up" />
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="eos" class="amount-icon">
                <img src="@/assets/img/icon_eos_article.svg" alt="eos" />
                {{ totalSupportedAmount.eos }}
              </DropdownItem>
              <DropdownItem name="ont" class="amount-icon">
                <img src="@/assets/img/icon_ont_article.svg" alt="ont" />
                {{ totalSupportedAmount.ont }}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div class="amount-text">
            {{ article.channel_id === 2 ? $t('p.totalRevenue') : $t('p.totalInvestment') }}
          </div>
        </div>
        <div v-if="article.channel_id !== 2" class="fission">
          <div>
            <div class="amount-img fission"></div>
            <span class="footer-number">{{ getDisplayedFissionFactor }}</span>
          </div>
          <div class="amount-text">{{ $t('p.fissionCoefficient') }}</div>
        </div>
      </div>
      <div class="footer-block footer-btn">
        <button
          v-if="isSupported === -1"
          class="button-support bg-yellow border-yellow"
          @click="b4support"
        >
          {{ $t('p.investment') }}<img src="@/assets/newimg/touzi.svg" />
        </button>
        <button v-if="isSupported === 0" class="button-support bg-yellow border-yellow" disabled>
          {{ $t('p.investing') }}
        </button>
        <button
          v-else-if="isSupported === 1"
          class="button-support bg-yellow border-yellow"
          @click="invest"
        >
          {{ $t('p.investment') }}
          <img src="@/assets/newimg/touzi.svg" />
        </button>
        <button
          v-else-if="isSupported === 2"
          class="button-support bg-yellow border-yellow"
          disabled
        >
          {{ $t('p.invested') }}
        </button>

        <button
          v-if="isSupported === -1"
          class="button-support bg-yellow border-yellow"
          @click="b4support"
        >
          {{ $t('p.buy') }}
          <img src="@/assets/newimg/goumai.svg" />
        </button>
        <button
          v-else-if="isSupported === 0"
          class="button-support bg-yellow border-yellow"
          disabled
        >
          {{ $t('p.buying') }}
          <img src="@/assets/newimg/goumai.svg" />
        </button>
        <button
          v-else
          class="button-support bg-yellow border-yellow"
          :disabled="product.stock === 0"
          @click="buyButton"
        >
          {{ product.stock === 0 ? $t('p.soldOut') : $t('p.buy') }}
          <img src="@/assets/newimg/goumai.svg" />
        </button>
        <button class="button-share border-yellow text-yellow" @click="widgetModal = true">
          {{ $t('share') }}
          <img src="@/assets/newimg/share2.svg" />
        </button>
      </div>
      <!-- <button class="button-share" @click="widgetModal = true">
          分享1<img src="@/assets/newimg/share.svg" />
        </button> -->
    </footer>
    <ArticleFooter
      v-else
      ref="articleFooter"
      class="footer flex-right"
      :article="article"
      :token="ssToken"
      @share="widgetModal = true"
    />

    <van-dialog
      v-model="supportModal"
      :title="$t('p.investment')"
      show-cancel-button
      class="ffff"
      :before-close="support"
      :close-on-click-overlay="true"
      @cancel="supportModal = false"
    >
      <van-field
        v-model="comment"
        type="textarea"
        :placeholder="$t('p.buyPlaceholder')"
        rows="4"
        autosize
      />
      <van-field v-model="amount" :placeholder="displayPlaceholder" @input="handleChange(amount)" />
    </van-dialog>

    <van-popup v-model="buyProductModal" class="buy-product-modal">
      <h1 class="title">{{ $t('p.buyShop') }}</h1>
      <div class="info-container">
        <img :src="cover" alt="cover" class="cover" />
        <div class="info-inner">
          <div class="product-price">
            <span class="ont-price">
              <img src="@/assets/newimg/ont2.svg" alt="ont" />
              <span>{{ product.ontPrice }}</span>
            </span>
            <span class="eos-price">
              <img src="@/assets/newimg/eos2.svg" alt="eos" />
              <span>{{ product.eosPrice }}</span>
            </span>
          </div>
          <div class="product-amount">
            <span>
              {{ $t('p.amount') }}
            </span>
            <van-stepper v-model="productNumber" disabled />
          </div>
        </div>
      </div>
      <van-field
        v-model="comment"
        type="textarea"
        :placeholder="$t('p.buyPlaceholder')"
        rows="4"
        autosize
        class="comment-container"
      />
      <div class="buy-container">
        <span class="storage">
          {{ $t('p.remainingStock', [product.stock]) }}
        </span>
        <div class="buy-btn" @click="buyProduct">
          {{ $t('p.buy') }}
        </div>
      </div>
    </van-popup>

    <van-popup v-model="investProductModal" class="buy-product-modal">
      <h1 class="title">{{ investTitle }}</h1>
      <div class="invest-info">
        <div class="info-item">
          <span class="info-number">{{ getDisplayedFissionFactor }}</span>
          <span class="info-subtitle">
            {{ $t('p.fissionCoefficient') }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.fission_rate }}</span>
          <span class="info-subtitle">
            {{ $t('p.fissionRebate') }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-number percent">{{ article.referral_rate }}</span>
          <span class="info-subtitle">
            {{ $t('p.recommendedRebate') }}
          </span>
        </div>
      </div>
      <van-field
        v-model="amount"
        :placeholder="displayPlaceholder"
        class="comment-container"
        @input="handleChange(amount)"
      />
      <van-field
        v-model="comment"
        type="textarea"
        :placeholder="$t('p.recommendedRebate')"
        rows="4"
        autosize
        class="comment-container"
      />
      <div class="invest-container">
        <div class="invest-btn" @click="investProduct">
          {{ $t('p.investment') }}
        </div>
      </div>
    </van-popup>

    <van-popup v-model="buySuccessModal" class="buy-product-modal">
      <h1 class="title">
        {{ $t('p.buyDone') }}
      </h1>
      <p class="tip">
        {{ $t('p.buyDoneDes') }}
      </p>
      <div class="invest-container">
        <router-link :to="{ name: 'BuyHistory' }">
          <div class="invest-btn">
            {{ $t('p.view') }}
          </div>
        </router-link>
      </div>
    </van-popup>

    <!-- 文章 Info -->
    <!-- 文章攻略 -->
    <!-- <ArticleInfo
      :info-moda="infoModa"
      :channel="article.channel_id"
      @changeInfo="status => (infoModa = status)"
    /> -->
    <Widget
      :id="article.id"
      :widget-modal="widgetModal"
      :get-clipboard="getClipboard"
      :invite="currentUserInfo.id"
      :share-info="{
        title: article.title,
        avatar: articleAvatar,
        name: article.nickname || article.author,
        time: articleCreateTimeComputed,
        content: compiledMarkdown,
        shareLink: getShareLink,
        cover
      }"
      @changeWidgetModal="status => (widgetModal = status)"
    />
    <article-transfer
      :transfer-modal="transferModal"
      :article-id="article.id"
      :from="'article'"
      @changeTransferModal="status => (transferModal = status)"
    />
    <OrderModal
      v-model="showOrderModal"
      :form="{ ...form, type: 'buy_token_output', limitValue }"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
import { ContentLoader } from 'vue-content-loader'
import wx from 'weixin-js-sdk'
import { xssFilter } from '@/common/xss'
// import { sleep, isNDaysAgo } from '@/common/methods'
import { isNDaysAgo } from '@/common/methods'
import { ontAddressVerify } from '@/common/reg'
import { precision } from '@/utils/precisionConversion'

import CommentsList from './CommentsList.vue'
import ipfs from './ipfs.vue'
import statement from './statement.vue'
// import ArticleInfo from './ArticleInfo.vue'
import Widget from './Widget/index.vue'
import articleTransfer from '@/components/articleTransfer/index.vue'
import tagCard from '@/components/tagCard/index.vue'
import ArticleFooter from '@/components/ArticleFooter.vue'
import commentInput from '@/components/article_comment'
import OrderModal from '../exchange/components/OrderModal'
import { CNY } from '../exchange/components/consts.js'
import utils from '@/utils/utils'
import avatar from '@/components/avatar/index.vue'

console.log(466, 'dev', wx)
// MarkdownIt 实例
const markdownIt = mavonEditor.getMarkdownIt()

const RewardStatus = {
  // 0=加载中,1=未打赏 2=已打赏, -1未登录
  NOT_LOGGINED: -1,
  LOADING: 0,
  NOT_REWARD_YET: 1,
  REWARDED: 2
}

export default {
  name: 'P',
  components: {
    CommentsList,
    // ArticleInfo,
    ContentLoader,
    mavonEditor,
    Widget,
    tagCard,
    articleTransfer,
    ipfs,
    statement,
    ArticleFooter,
    commentInput,
    OrderModal,
    avatar
  },
  data() {
    return {
      id: this.$route.params.id,
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      investTitle: this.$t('p.investArticle'),
      followed: false,
      productNumber: 1,
      buySuccessModal: false,
      investProductModal: false,
      buyProductModal: false,
      post: {
        author: '',
        title: '',
        content: ''
      },
      article: {
        author: '',
        createTime: '',
        fission_factor: 0,
        id: null
      },
      articleAvatar: '',
      amount: '',
      comment: '',
      totalSupportedAmount: {
        show: 0, // 用于默认数据显示
        showName: 'eos', // 用于默认数据显示
        eos: 0,
        ont: 0
      },
      product: {
        eosPrice: 0,
        ontPrice: 0,
        stock: 0
      },
      supportModal: false,
      opr: false,
      // infoModa: false, // 文章攻略
      isRequest: false,
      articleLoading: true, // 文章加载状态
      isOriginal: false,
      widgetModal: false, // 分享 widget dialog
      transferModal: false, // 转让
      ssToken: {
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      },
      commentRequest: 0,
      currentProfile: Object.create(null),
      differenceToken: '0',
      showLock: false,
      showOrderModal: false,
      form: {
        input: '',
        inputToken: CNY,
        output: '',
        outputToken: {}
      },
      getInputAmountError: '',
      payBtnDisabled: true
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined', 'isMe']),
    cover() {
      if (this.article.cover) return this.$backendAPI.getAvatarImage(this.article.cover)
      return null
    },
    displayPlaceholder() {
      return this.$t('p.investmentPlaceholder', [this.currentUserInfo.idProvider])
    },
    compiledMarkdown() {
      return markdownIt.render(xssFilter(this.post.content))
    },
    getClipboard() {
      const { article, currentUserInfo } = this
      const { protocol, host } = window.location
      // console.debug(this.article);
      const articleUrl = `${protocol}//${host}/p/${article.id}`
      const shareLink = this.isLogined
        ? `${articleUrl}/?invite=${currentUserInfo.id}&referral=${currentUserInfo.id}`
        : articleUrl
      return `《${article.title}》by ${article.nickname ||
        article.username} \n${shareLink}\n${this.$t('p.clipboardText1')} \n ${this.$t(
        'p.clipboardText2'
      )}${this.$point.regInvitee}${this.$t('p.clipboardText3')}`
    },
    getShareLink() {
      // 应产品需求 这里改为移动端的链接

      const { article, currentUserInfo } = this
      // const { protocol, host } = window.location
      // const articleUrl = `${protocol}//${host}/p/${article.id}`
      const articleUrl = `${process.env.VUE_APP_URL}/p/${article.id}`

      const shareLink = this.isLogined
        ? `${articleUrl}?invite=${currentUserInfo.id}&referral=${currentUserInfo.id}`
        : articleUrl
      return shareLink
    },
    getCopyIpfsHash() {
      return `${this.article.hash}`
    },
    getDisplayedFissionFactor() {
      return this.article.fission_factor / 1000
    },
    getUrl() {
      const { article } = this
      const { protocol, host } = window.location
      return `${protocol}//${host}/p/${article.id}`
    },
    getInvite() {
      const { invite } = this.$route.query
      return invite ? invite : null
    },
    // 这里发现有问题 应该是下面直接设置了属性报错 后续需要修改
    // errorinfo - vue.js:634 [Vue warn]: Computed property "isSupported" was assigned to but it has no setter.
    isSupported() {
      const { article, isLogined } = this
      let isSupported = false
      if (isLogined)
        isSupported = article.is_support ? RewardStatus.REWARDED : RewardStatus.NOT_REWARD_YET
      else isSupported = RewardStatus.NOT_LOGGINED
      return isSupported
    },
    signId() {
      return this.article.id
    },
    articleCreateTimeComputed() {
      const { create_time: createTime } = this.article
      const time = moment(createTime)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    // 是否为付费文章
    tokenArticle() {
      return this.article.tokens && this.article.tokens.length !== 0
    },
    isTokenArticle() {
      // 付费文章
      if (this.article.tokens && this.article.tokens.length !== 0) {
        if (this.showLock) return true
        else return false
      } else {
        // 不付费
        return true
      }
    },
    // 需要多少粉丝币
    needTokenAmount() {
      if (this.article.tokens && this.article.tokens.length !== 0) {
        return precision(this.article.tokens[0].amount, 'CNY', this.article.tokens[0].decimals)
      } else return 0
    },
    // 需要多少粉丝币名称
    needTokenSymbol() {
      if (this.article.tokens && this.article.tokens.length !== 0) {
        return this.article.tokens[0].symbol
      } else return ''
    },
    limitValue() {
      const { input } = this.form
      return (parseFloat(input) / (1 - 0.01)).toFixed(4)
    }
  },
  watch: {
    article() {
      this.$emit('updateHead')
    },
    post() {
      this.$emit('updateHead')
    },
    isLogined(newState) {
      if (newState) this.getArticleInfo(this.id, false)
    },
    isRequest(newVal) {
      // 监听是否请求默认为false被改变为true下面不执行，请求完毕又被改变为false执行下列方法
      if (!newVal) {
        this.getArticleInfo(this.id)
      }
    }
  },
  created() {
    this.getArticleInfo(this.id) // 得到文章信息
  },
  mounted() {
  },
  methods: {
    ...mapActions(['makeShare', 'makeOrder']),
    // 增加文章阅读量
    async addReadAmount(hash) {
      await this.$backendAPI
        .addReadAmount(hash)
        .catch(err => console.log('add read amount error', err))
    },
    // 提取内容 删除多余的标签
    regRemoveContent(str) {
      // 去除空格
      const strTrim = str => str.replace(/\s+/g, '')
      // 去除标签
      const regRemoveTag = str => str.replace(/<[^>]+>/gi, '')
      // 去除markdown img
      const regRemoveMarkdownImg = str => str.replace(/!\[.*?\]\((.*?)\)/gi, '')
      // 去除 markdown 标签
      const regRemoveMarkdownTag = str => str.replace(/[\\\`\*\_\[\]\#\+\-\!\>]/gi, '')

      const regRemoveTagResult = regRemoveTag(str)
      const regRemoveMarkdownImgResult = regRemoveMarkdownImg(regRemoveTagResult)
      const regRemoveMarkdownTagResult = regRemoveMarkdownTag(regRemoveMarkdownImgResult)
      return strTrim(regRemoveMarkdownTagResult)
    },
    setWxShare() {
      /*const articleUrl = `https://sstest.frontenduse.top/p/${this.article.id}`;
      const link = this.isLogined ? `${articleUrl}?invite=${this.currentUserInfo.id}` : articleUrl;*/
      const link = window.location.href
      this.$backendAPI.wxShare(encodeURIComponent(link)).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let { hash, timestamp, nonce } = res.data.data
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx5c94f87f6c670341', // 必填，公众号的唯一标识
            timestamp, // 必填，生成签名的时间戳
            nonceStr: nonce, // 必填，生成签名的随机串
            signature: hash, // 必填，签名
            jsApiList: [
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'onMenuShareAppMessage'
            ]
          })
          wx.error(function(res) {
            console.log(713, res)
          })
          const title = this.article.title
          const desc = this.regRemoveContent(this.post.content) // .substr(0, 200);
          const imgUrl = this.$backendAPI.getAvatarImage(this.article.cover)
          wx.ready(function() {
            //需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({
              title, // 分享标题
              desc, // 分享描述
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl, // 分享图标
              success: function() {
                // 设置成功
              }
            })
            //需在用户可能点击分享按钮前就先调用
            wx.updateTimelineShareData({
              title, // 分享标题
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl, // 分享图标
              success: function() {
                // 设置成功
              }
            })
            // 即将废弃，适配电脑版微信，参考：https://mp.weixin.qq.com/wiki?action=doc&id=mp1421141115#10
            wx.onMenuShareAppMessage({
              title, // 分享标题
              desc, // 分享描述
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl, // 分享图标
              success: function() {
                // 用户点击了分享后执行的回调函数
              }
            })
          })
        }
      })
    },
    // 复制hash
    copyText(getCopyIpfsHash) {
      this.$copyText(getCopyIpfsHash).then(
        () => {
          this.$toast.success({ duration: 1000, message: this.$t('success.copy') })
        },
        () => {
          this.$toast.fail({ duration: 1000, message: this.$t('error.copy') })
        }
      )
    },
    // 获取用户在当前文章的属性
    async getCurrentProfile() {
      const data = {
        id: this.id
      }

      await this.$backendAPI
        .getCurrentProfile(data)
        .then(res => {
          // console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            this.currentProfile = res.data.data
            this.form.outputToken =
              res.data.data.holdMineTokens && res.data.data.holdMineTokens.length > 0
                ? res.data.data.holdMineTokens[0]
                : {}
            // console.log('article', this.article)
            this.differenceTokenFunc()
            this.calPayFormParams()
            this.setSSToken(res.data)
          } else if (res.data.code === 401) {
            console.log(res.data.message)
          } else {
            console.log(res.data.message)
          }
        })
        .catch(err => console.log(err))
    },
    // 差多少token 变为字符界面显示截取 - 号
    differenceTokenFunc() {
      if (
        this.currentProfile.holdMineTokens &&
        this.currentProfile.holdMineTokens.length !== 0 &&
        this.article.tokens
      ) {
        const tokenName = this.currentProfile.holdMineTokens.filter(
          list => list.id === this.article.tokens[0].id
        )
        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.tokens && this.article.tokens.length !== 0) {
          needTokenAmount = this.article.tokens[0].amount
        }
        // 减之后 换算
        const amountToken = precision(amount - needTokenAmount, 'CNY', tokenName[0].decimals)
        this.differenceToken =
          amountToken < 0 ? amountToken + '' : '+' + precision(amount, 'CNY', tokenName[0].decimals)
      } else this.differenceToken = '0'

      this.showLockFunc(this.differenceToken)
    },
    // 是否显示 Lock
    showLockFunc(differenceToken) {
      if (Number(differenceToken) < 0) {
        if (this.isMe(this.article.uid)) {
          // 自己的文章
          this.showLock = true
          this.getIpfsData()
        } else this.showLock = false
      } else {
        this.showLock = true
        this.getIpfsData()
      }
    },
    async getIpfsData() {
      if (!this.article.hash) return
      await this.$backendAPI
        .getIpfsData(this.article.hash)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.post.content = res.data.data.content
            this.setWxShare()
          } else {
            console.log(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast({ duration: 1000, message: '获取文章内容失败' })
        })
    },

    // 得到文章信息 hash id, supportDialog 为 true 则只更新文章信息
    async getArticleInfo(id, supportDialog = false) {
      await this.$backendAPI
        .getArticleInfo(id)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            // 判断是否为付费阅读文章
            let { data } = res.data
            this.article = data

            this.getCurrentProfile()

            if (data.tokens && data.tokens.length !== 0) {
              this.post.content = data.short_content
              this.setWxShare()
            } else {
              this.setArticle(data, supportDialog)
              this.getIpfsData()

              // 默认会执行获取文章方法，更新文章调用则不需要获取内容
              if (!supportDialog) {
                // this.getArticleDatafromIPFS(data.hash)
              }
            }
            this.setAvatar(data.uid)
            this.addReadAmount(this.article.hash)
          } else {
            this.$toast({ duration: 1000, message: res.data.message })
          }
        })
        .catch(err => {
          console.error(err)
          this.$toast({ duration: 1000, message: this.$t('error.getArticleInfoError') })
        })
        .finally(() => {
          this.articleLoading = false
        })
    },
    // 获取文章内容 from ipfs
    async getArticleDatafromIPFS(hash) {
      await this.$backendAPI
        .getArticleDatafromIPFS(hash)
        .then(({ data }) => {
          // console.log(data);
          this.setPost(data.data)
        })
        .catch(err => {
          console.error(err)
          this.$Message.error(this.$t('error.getArticleInfoError'))
        })
    },
    setSSToken(res) {
      console.log(856, res)
      this.$refs.articleFooter.postBackendReading(res.data)
      this.ssToken = {
        points: res.data.points || [], // 用户是否喜欢了这篇文章
        dislikes: res.data.dislikes,
        likes: res.data.likes,
        is_liked: res.data.is_liked || 0 // is_liked：0：没有操作过，1：不推荐，2：推荐
      }
    },
    // 设置文章
    async setArticle(article, supportDialog = false) {
      if (article.channel_id === 2) {
        this.product = {
          eosPrice: article.prices[0].price / 10 ** article.prices[0].decimals,
          ontPrice: article.prices[1].price / 10 ** article.prices[1].decimals,
          stock: article.prices[0].stock_quantity
        }
      }
      this.article.CreateTime = article.create_time
      this.totalSupportedAmount.show = article.value ? precision(article.value, 'eos') : 0 // 用于默认显示
      this.totalSupportedAmount.eos = article.value ? precision(article.value, 'eos') : 0 // eos
      this.totalSupportedAmount.ont = precision(article.ontvalue, 'ont') // ont

      // this.articleLoading = false // 文章加载状态隐藏
      this.isOriginal = Boolean(article.is_original)
      // 未登录下点击投资会自动登陆并且重新获取文章信息 如果没有打赏并且是点击投资 则显示投资框
      if (!article.is_support && supportDialog) {
        this.supportModal = true
      }
    },
    // 设置文章内容
    setPost(post) {
      this.post = post
      // this.articleLoading = false // 文章加载状态隐藏
    },
    handleChange(amount) {
      let amountValue = amount
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'EOS') {
        // 小数点后三位 如果后面需要解除限制修改正则  {0,3}
        amountValue = amountValue.match(/^\d*(\.?\d{0,3})/g)[0] || null
      } else if (idProvider === 'ONT') {
        amountValue = amountValue.match(/^\d*/g)[0] || null
      }
      this.amount = amountValue
    },
    b4support() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
      }
    },
    // 根据 idProvider 查询商品数据
    findBlockchain(articlePrices, idProvider) {
      const findBlockchain = (arr, symbol) => arr.filter(i => i.symbol === symbol)
      return findBlockchain(articlePrices, idProvider)
    },
    // 购买按钮
    buyButton() {
      if (!this.detection()) return
      const { currentUserInfo, findBlockchain, article } = this
      const { idProvider } = currentUserInfo
      const filterBlockchain = findBlockchain(article.prices, idProvider)
      const { stock_quantity: stockQuantity } = filterBlockchain[0]
      if (stockQuantity <= 0) {
        return this.$toast({ duration: 1000, message: this.$t('warning.inventoryShortage') })
      }
      this.buyProductModal = true
    },
    // 检测能否投资
    detection() {
      if (this.isSupport) {
        this.$toast({ duration: 1000, message: this.$t('p.investing') })
        return false
      }
      if (!this.isLogined) {
        this.$toast({ duration: 1000, message: this.$t('p.loginInvest') })
        return false
      }
      // email github 无法赞赏
      const { idProvider } = this.currentUserInfo
      if (this.$publishMethods.invalidId(idProvider)) {
        this.$toast({ duration: 1000, message: this.$t('p.account', [idProvider]) })
        return false
      }
      return true
    },
    // 投资按钮
    async invest() {
      if (!this.detection()) return

      if (this.currentUserInfo.idProvider === 'GitHub')
        return this.$toast({
          duration: 1000,
          message: this.$t('p.account', [this.currentUserInfo.idProvider])
        })
      // 如果是商品 判断库存是否充足
      if (this.article.channel_id === 2) {
        const { currentUserInfo, findBlockchain, article } = this
        const { idProvider } = currentUserInfo
        const filterBlockchain = findBlockchain(article.prices, idProvider)
        const { stock_quantity: stockQuantity } = filterBlockchain[0]
        if (stockQuantity <= 0) {
          return this.$toast({ duration: 1000, message: this.$t('warning.inventoryShortage') })
        }
        this.investTitle = this.$t('p.investShop')
      } else {
        this.investTitle = this.$t('p.investArticle')
      }
      this.investProductModal = true
    },
    async buyProduct() {
      const loading = this.$toast.loading({
        mask: true,
        duration: 0,
        message: this.$t('p.buying')
      })
      const { comment, signId, product } = this
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      const num = this.productNumber
      const amount =
        idProvider === 'ONT'
          ? num * product.ontPrice
          : idProvider === 'EOS'
          ? num * product.eosPrice
          : 0
      const toSponsor = async idOrName => {
        if (!idOrName) return { id: null, username: null }
        if (/^(0|[1-9][0-9]*)$/.test(idOrName)) {
          try {
            const id = idOrName
            const { status, data } = await this.$backendAPI.getUser({ id })
            if (status === 200 && data.code === 0) return { id, username: data.data.username }
          } catch (error) {
            console.error(error)
          }
        }
        return { id: null, username: idOrName }
      }
      this.isSupported = RewardStatus.LOADING
      let sponsor = await toSponsor(this.getInvite)
      await this.makeOrder({ amount, num, signId, sponsor, comment })
      /*try {
        // 發 comment 到後端
        console.log("Send comment...");
        const response = await sendComment({ comment, signId });
        console.log(response);
        if (response.status !== 200) throw new Error(error);
      } catch (error) {
        console.error(error);
        console.log("Resend comment...");
        const response = await sendComment({ comment, signId });
        console.log(response);
        if (response.status !== 200) throw new Error(error);
      }*/
      loading.clear()
      this.isSupported = RewardStatus.NOT_REWARD_YET
      this.isRequest = true
      this.buyProductModal = false
      this.buySuccessModal = true
    },
    async investProduct() {
      this.support('confirm', () => {
        this.investProductModal = false
      })
    },
    async support(action, done) {
      if (action !== 'confirm') return done()
      // TODO 疑问???
      let action_text =
        this.article.channel_id === 2 ? this.$t('p.investing') : this.$t('p.investing')
      const loading = this.$toast.loading({
        mask: true,
        duration: 0,
        message: `${action_text}...`
      })
      const { article, comment, signId } = this
      const { idProvider } = this.currentUserInfo
      if (idProvider === 'GitHub') return
      // 默认 ‘’ 转成了 NAN
      const amount = this.amount === '' ? 0 : parseFloat(this.amount)
      // 检查金额是否符合
      let checkPricesMatch = true

      // 检查价格
      const checkPrices = (prices, range, message) => {
        if (prices < range) {
          loading.clear()
          this.$toast({ duration: 1000, message })
          return false
        }
        return true
      }
      // 文章投资金额
      const minimumAmount = idProvider => {
        if (idProvider === 'EOS') return 0.01
        if (idProvider === 'ONT') return 1
      }
      checkPricesMatch = checkPrices(
        amount,
        minimumAmount(idProvider),
        this.$t('p.minMoney', [action_text, minimumAmount(idProvider), idProvider])
      )
      if (!checkPricesMatch) return done(false)

      // 检查商品价格
      // TODO 疑问???
      const checkCommodityPrices = () => {
        const filterBlockchain = this.findBlockchain(article.prices, idProvider)
        if (filterBlockchain.length !== 0) {
          const { symbol, price, decimals } = filterBlockchain[0]
          // exponentiation operator (**)
          if (symbol === 'EOS')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
          else if (symbol === 'ONT')
            checkPricesMatch = checkPrices(
              amount,
              price / 10 ** decimals,
              `${action_text}金额不能小于商品价格`
            )
        }
      }

      // 文章是商品判断价格
      // if (article.channel_id === 2) checkCommodityPrices();
      if (!checkPricesMatch) return done(false)

      const toSponsor = async idOrName => {
        if (!idOrName) return { id: null, username: null }
        if (/^(0|[1-9][0-9]*)$/.test(idOrName)) {
          try {
            const id = idOrName
            const { status, data } = await this.$backendAPI.getUser({ id })
            if (status === 200 && data.code === 0) return { id, username: data.data.username }
          } catch (error) {
            console.error(error)
          }
        }
        return { id: null, username: idOrName }
      }

      let sponsor = await toSponsor(this.getInvite)
      try {
        this.isSupported = RewardStatus.LOADING

        // 如果是ONT true 如果是 EOS或者其他 false
        const isOntAddressVerify = ontAddressVerify(sponsor.username)
        // 如果是EOS账户投资 但是邀请人是ONT用户 则认为没有邀请
        if (idProvider === 'EOS' && isOntAddressVerify) sponsor = { id: null, username: null }
        // 如果是ONT账户投资 但是邀请人EOS账户 则认为没有邀请
        else if (idProvider === 'ONT' && !isOntAddressVerify) sponsor = { id: null, username: null }

        await this.makeShare({ amount, signId, sponsor, comment })
        // if ( this.article.channel_id === 2 ) await this.makeOrder({ amount, signId, sponsor });

        // try {
        //   // 發 comment 到後端
        //   console.log("Send comment...");
        //   const response = await sendComment({ comment, signId });
        //   console.log(response);
        //   if (response.status !== 200) throw new Error(error);
        // } catch (error) {
        //   console.error(error);
        //   console.log("Resend comment...");
        //   const response = await sendComment({ comment, signId });
        //   console.log(response);
        //   if (response.status !== 200) throw new Error(error);
        // }
        this.isSupported = RewardStatus.REWARDED // 按钮状态
        this.$toast.success({ duration: 1000, message: this.$t('success.success') })
        this.isRequest = true // 自动请求
        this.supportModal = false // 关闭dialog
        loading.clear()
        done()
      } catch (error) {
        loading.clear()
        console.error(error)
        this.isSupported = RewardStatus.NOT_REWARD_YET
        this.$toast({
          duration: 1000,
          message: this.$t('p.sponsorFail', [action_text])
        })
        done(false)
      }
    },
    // 删除文章
    delArticleButton() {
      const jumpTo = name => this.$router.push({ name })
      const delSuccess = async () => {
        this.$Modal.remove()
        this.$toast({ duration: 2000, message: this.$t('p.deleteArticle') })
        // await sleep(3000)
        jumpTo('index')
      }
      const fail = err => {
        this.$Modal.remove()
        this.$toast({ duration: 1000, message: this.$t('p.deleteFail') })
        console.log('error', err)
      }
      const delArticleFunc = async id => {
        if (!id) return fail(this.$t('p.noId'))
        try {
          const response = await this.$backendAPI.delArticle({ id })
          if (response.status === 200 && response.data.code === 0) delSuccess()
          else fail(this.$t('p.deleteFail'))
        } catch (error) {
          return fail(error)
        }
      }
      this.$Modal.confirm({
        title: this.$t('promptTitle'),
        content: `<p>${this.$t('p.ipfsPrompt')}</p>`,
        loading: true,
        onOk: () => {
          delArticleFunc(this.article.id)
        }
      })
    },
    // 获取用户 得到头像
    async setAvatar(id) {
      try {
        const res = await this.$backendAPI.getUser({ id })
        if (res.status === 200 && res.data.code === 0) {
          this.followed = res.data.data.is_follow
          this.articleAvatar = res.data.data.avatar
            ? this.$backendAPI.getImg(res.data.data.avatar)
            : ''
        } else console.log(this.$t('error.getUserInfoError'))
      } catch (error) {
        console.log(`${this.$t('error.getUserInfoError')}${error}`)
      }
    },
    // 切换投资总额显示
    toggleAmount(name) {
      if (name === 'eos') {
        this.totalSupportedAmount.show = this.totalSupportedAmount.eos
      } else if (name === 'ont') {
        this.totalSupportedAmount.show = this.totalSupportedAmount.ont
      }
      this.totalSupportedAmount.showName = name
    },
    async followOrUnfollowUser({ id, type }) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
      try {
        if (type === 1) await this.$backendAPI.follow({ id })
        else await this.$backendAPI.unfollow({ id })
        this.$toast.success({ duration: 1000, message: `${message}${this.$t('success.success')}` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}${this.$t('error.fail')}` })
      }
    },
    wxpay() {
      if (this.getInputAmountError) {
        this.$message.error(this.getInputAmountError)
        return
      }
      this.showOrderModal = true
    },
    // 微信支付购买
    calPayFormParams() {
      if (
        this.currentProfile.holdMineTokens &&
        this.currentProfile.holdMineTokens.length !== 0 &&
        this.article.tokens
      ) {
        const tokenName = this.currentProfile.holdMineTokens.filter(
          list => list.id === this.article.tokens[0].id
        )
        // 获取有多少token
        const amount = tokenName.length !== 0 ? tokenName[0].amount : 0
        let needTokenAmount = 0
        // 获取需要多少token
        if (this.article.tokens && this.article.tokens.length !== 0) {
          needTokenAmount = this.article.tokens[0].amount
        }
        // 减之后 换算
        this.form.output = utils.fromDecimal(needTokenAmount - amount)
        const { inputToken, output, outputToken } = this.form
        if (output > 0) {
          this.getInputAmount(inputToken.id, outputToken.id, output)
        }
      }
    },
    getInputAmount(inputTokenId, outputTokenId, outputAmount) {
      const deciaml = 4
      const _outputAmount = utils.toDecimal(outputAmount, deciaml)
      this.$API.getInputAmount(inputTokenId, outputTokenId, _outputAmount).then(res => {
        this.payBtnDisabled = false
        if (res.code === 0) {
          this.getInputAmountError = ''
          // rmb向上取整
          if (inputTokenId === 0 && parseFloat(res.data) >= 100) {
            this.form.input = parseFloat(utils.formatCNY(res.data, deciaml)).toFixed(2)
          } else {
            this.form.input = parseFloat(utils.fromDecimal(res.data, deciaml)).toFixed(4)
          }
        } else {
          this.getInputAmountError = res.message
          this.form.input = ''
        }
      })
    }
  }
}
</script>

<style src="./index.less" scoped lang="less"></style>
<style>
/* 覆盖投资框宽度 */
.article .van-dialog {
  max-width: 350px;
}

.article .katex-display {
  overflow: auto;
}
</style>
