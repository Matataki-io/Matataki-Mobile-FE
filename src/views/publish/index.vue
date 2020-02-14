<template>
  <div class="new-post" @click.stop="transferButton = false">
    <BaseHeader
      ref="baseHeader"
      :is-center="false"
      :pageinfo="{ title: saveDraft }"
      :customize-back-func="true"
      :customize-home-func="true"
      :customize-header-bc="'#fff'"
      @headerBackFunc="headerBackFunc"
      @headerHomeFunc="headerHomeFunc"
    >
      <div slot="right" class="header-right-slot">
        <div class="post-button" @click="importVisible = true">
          <svg-icon class="import-icon" icon-class="import" />
          导入
        </div>

        <div v-loading.fullscreen.lock="fullscreenLoading" class="post-button" @click="sendThePost">
          发布
        </div>
        <div
          v-if="isShowTransfer"
          slot="right"
          class="more"
          @click.stop="transferButton = !transferButton"
        >
          <img src="@/assets/more.svg" alt="more" />
          <transition name="fade" mode="out-in">
            <div v-show="transferButton" class="dropdown">
              <div class="dropdown-item" @click="transferModal = true">
                {{ $t('publish.transfer') }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </BaseHeader>
    <div class="edit-content">
      <input
        v-model="title"
        class="edit-title"
        :placeholder="$t('publish.titlePlaceholder')"
        size="large"
        clearable
      />

      <mavon-editor
        ref="md"
        v-model="markdownData"
        class="editor"
        :toolbars="toolbars"
        :box-shadow="false"
        :autofocus="false"
        :subfield="false"
        :placeholder="$t('publish.contentPlaceholder')"
        @imgAdd="$imgAdd"
      />

      <!-- 持通证阅读 -->
      <div class="post-content">
        <div>
          <h3>
            阅读权限
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                添加限制条件后，<br />读者只有在持有特定数量的Fan票后才可查看全文的。
              </div>
              <svg-icon class="help-icon" icon-class="help" />
            </el-tooltip>
          </h3>
          <el-checkbox v-model="readauThority" size="small">
            设置持Fan票
          </el-checkbox>
        </div>
        <transition name="fade">
          <div v-show="readauThority" class="fl ac">
            <div>
              <h3>持Fan票类型</h3>
              <el-select
                v-model="readSelectValue"
                size="small"
                placeholder="请选择"
                style="width: 100%;"
                filterable
              >
                <el-option
                  v-for="item in readSelectOptions"
                  :key="item.id"
                  :label="item.symbol + '-' + item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div style="margin-left: 10px;">
              <h3>持Fan票数量</h3>
              <el-input
                v-model="readToken"
                :min="1"
                :max="100000000"
                size="small"
                placeholder="请输入内容"
              />
            </div>
          </div>
        </transition>
        <el-checkbox v-model="paymentTokenVisible" size="small" style="margin-top: 10px;">
          设置支付
        </el-checkbox>
        <transition name="fade">
          <div v-show="paymentTokenVisible" class="fl ac">
            <div>
              <h3>支付类型</h3>
              <el-select
                v-model="paymentSelectValue"
                disabled
                size="small"
                placeholder="请选择"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in paymentSelectOptions"
                  :key="item.id"
                  :label="item.symbol + '-' + item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div style="margin-left: 10px;">
              <h3>支付数量</h3>
              <el-input
                v-model="paymentToken"
                :min="1"
                :max="100000000"
                size="small"
                placeholder="请输入内容"
                @keypress.native="isNumber"
              />
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div v-show="readauThority">
            <h3>内容摘要</h3>
            <el-input
              v-model="readSummary"
              :autosize="{ minRows: 6, maxRows: 12 }"
              size="small"
              type="textarea"
              placeholder="请输入内容"
              maxlength="300"
              show-word-limit
            />
          </div>
        </transition>
      </div>

      <div v-if="$route.params.type !== 'edit'" class="fission">
        <p>
          {{ $t('publish.commentTitle') }}
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              {{ $t('publish.commentContent') }}
            </div>
            <svg-icon class="help-icon" icon-class="help" />
          </el-tooltip>
        </p>
        <div class="fission-num-slider">
          <el-input-number
            v-model="commentPayPoint"
            step-strictly
            style="width: 110px"
            controls-position="right"
            class="price-point"
            :min="1"
            :max="99999"
            size="mini"
            :label="$t('publish.commentTitle')"
          />
          <span class="input-number">
            {{ $t('publish.point') }}
          </span>
        </div>
        <!-- <span class="set-des"></span> -->
      </div>
      <!-- <div v-if="$route.params.type !== 'edit'" class="fission">
        <p>
          裂变系数
          <Poptip
            popper-class="my-poptip"
            content="决定每名投资者的收益上限 = 投资金额 * 裂变系数 裂变系数越大投资者的收益预期越高"
            width="250"
            word-wrap
            placement="top-start"
          >
            <span class="question">?</span>
          </Poptip>
        </p>
        <div v-if="$route.params.type !== 'edit'" class="fission-num-slider">
          <el-slider
            v-model="fissionNum"
            class="slider"
            :min="1"
            :max="2"
            :step="0.1"
            :show-tooltip="false"
          />
        </div>
        <div class="fission-num-Input">
          {{ fissionNum }}
        </div>
      </div> -->
      <div class="cover-container">
        <div v-show="cover">
          <img class="cover-img" :src="coverEditor" alt="cover" />
        </div>
        <div class="cover">
          <p>
            {{ $t('publish.coverTitle') }}
            <span class="cover-tip">
              {{ $t('publish.coverDes') }}
            </span>
          </p>
          <img-upload
            v-show="!cover"
            :img-upload-done="imgUploadDone"
            :aspect-ratio="2 / 1"
            class="cover-upload"
            :update-type="'artileCover'"
            @doneImageUpload="doneImageUpload"
          >
            <img slot="uploadButton" class="cover-add" src="@/assets/newimg/add.svg" alt="add" />
          </img-upload>
          <img
            v-show="cover"
            class="cover-btn"
            src="@/assets/newimg/del.svg"
            alt="remove"
            @click.prevent="removeCover"
          />
        </div>
      </div>
    </div>
    <el-checkbox v-model="isOriginal" class="is-original" @change="originalChange">
      我声明此文章为原创
    </el-checkbox>
    <div v-if="isOriginal" class="cc-licensing">
      <h3>
        Creative Commons 授权许可协议
        <el-tooltip effect="dark" placement="top-start">
          <div slot="content">
            CC是一种公共著作权许可协议，
            <br />
            其允许分发受著作权保护的作品。
            <br />
            一个创作共享许可用于一个作者想给他人分享
            <br />
            使用，甚至创作派生作品的权利。
          </div>
          <i class="el-icon-info info" />
        </el-tooltip>
      </h3>
      <h3>
        请问您允许本作品被别人转载、节选、混编、二次创作吗？
      </h3>
      <el-radio v-model="ccLicenseOptions.share" class="cc-licensing-radio" label="true">
        允许
      </el-radio>
      <el-radio v-model="ccLicenseOptions.share" class="cc-licensing-radio" label="false">
        不允许
        <el-tooltip effect="dark" placement="top-start">
          <div slot="content">
            他人不能再混合、转换、或者基于该作品创作，
            <br />且不能分发修改后的作品
          </div>
          <i class="el-icon-info" />
        </el-tooltip>
      </el-radio>
      <el-radio v-model="ccLicenseOptions.share" class="cc-licensing-radio" label="SA">
        仅允许采用本协议授权的二次创作
        <el-tooltip effect="dark" placement="top-start">
          <div slot="content">
            他人再混合、转换或者基于本作品进行创作，
            <br />必须基于与原先许可协议相同的许可协议分发作品。
          </div>
          <i class="el-icon-info" />
        </el-tooltip>
      </el-radio>
      <el-checkbox v-model="ccLicenseOptions.commercialUse" class="cc-licensing-checkbox">
        允许商业性使用
      </el-checkbox>
      <p>则授权条款为： {{ CCLicenseCredit.chinese }}</p>
    </div>
    <div class="tag">
      <p>
        {{ $t('publish.tagTitle') }}
      </p>
      <div class="tag-content">
        <tag-card
          v-for="(item, index) in tagCards"
          :key="index"
          :tag-card="item"
          @toggleTagStatus="toggleTagStatus"
        />
      </div>
    </div>

    <modal-prompt
      :show-modal="showModal"
      :modal-text="modalText"
      @changeInfo="changeInfo"
      @modalCancel="modalCancel"
    />
    <article-transfer
      v-if="isShowTransfer"
      :transfer-modal="transferModal"
      :article-id="$route.params.id"
      :from="$route.query.from"
      @changeTransferModal="status => (transferModal = status)"
    />
    <Prompt
      v-model="prompt"
      :content="{
        title: this.$t('publish.draftTitle'),
        confirmText: this.$t('publish.draftText'),
        cancelText: this.$t('publish.draftCancel')
      }"
      @confirm="createDraft(saveInfo)"
    />
    <statement :visible="statementVisible" @close="closeStatement" />
    <articleImport v-model="importVisible" :open-new-page="false" @res="importRes" />
    <oneKeyImport v-model="oneKeyImportVisible" @res="importRes"/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import { mavonEditor } from 'mavon-editor'
import { strTrim } from '@/common/reg'

import 'mavon-editor/dist/css/index.css' // editor css
// import { sleep } from '@/common/methods'
import { toolbars } from '@/config/toolbars' // 编辑器配置
import { CreativeCommonsLicenseGenerator, convertLicenseToChinese } from '@/utils/CreativeCommons'
import imgUpload from '@/components/imgUpload/index.vue' // 图片上传
import modalPrompt from './components/modal_prompt.vue' // 弹出框提示
import { Prompt } from '@/components/'

import tagCard from '@/components/tagCard/index.vue'
import articleTransfer from '@/components/articleTransfer/index.vue'
import { toPrecision, precision } from '@/utils/precisionConversion'
import statement from '@/components/statement/index.vue'
import articleImport from '@/components/article_import/index.vue'
import { getCookie } from '@/utils/cookie'
import * as clipboard from 'clipboard-polyfill'
import oneKeyImport from '@/components/one_key_import/index.vue'

export default {
  name: 'NewPost',
  components: {
    mavonEditor,
    imgUpload,
    modalPrompt,
    tagCard,
    articleTransfer,
    Prompt,
    statement,
    articleImport,
    oneKeyImport,
  },
  data() {
    return {
      prompt: false,
      title: '',
      author: '',
      markdownData: '',
      fissionFactor: 2000,
      toolbars: {},
      fissionNum: 2,
      cover: '',
      signature: '',
      signId: '',
      id: '',
      isOriginal: false, // 是否原创
      imgUploadDone: 0,
      showModal: false, // 弹框显示
      modalText: {
        text: [this.$t('publish.modalTextText')], // 退出
        button: [this.$t('publish.modalTextButton1'), this.$t('publish.modalTextButton2')]
      },
      modalMode: null, // header 判断点击的 back 还是 home
      tagCards: [], // 文章标签
      articleData: {}, // 文章数据
      transferButton: false, // 转让按钮
      transferModal: false, // 转让弹框
      allowLeave: false, // 允许离开
      saveInfo: {},
      commentPayPoint: 1,
      autoUpdateDfaft: false, // 是否自动更新草稿
      autoUpdateDfaftTags: false, // 是否自动更新草稿标签
      saveDraft: '文章发布', // 自动存为草稿
      readauThority: false, // 持Fan票阅读
      readToken: 1, // 阅读token数量
      readSelectOptions: [], // 阅读tokenlist
      readSelectValue: '', // 阅读tokenlist show value
      paymentTokenVisible: false, // 支付可见
      paymentToken: 0, // 支付token
      paymentSelectOptions: [
        {
          id: -1,
          symbol: 'CNY',
          name: '人民币'
        }
      ], // 支付tokenlist
      paymentSelectValue: -1, // 支付tokenlist show value

      readSummary: '',
      statementVisible: false, // 原创声明
      importVisible: false, // 导入
      oneKeyImportVisible:false,
      ccLicenseOptions: {
        share: 'false',
        commercialUse: false
      },
      fullscreenLoading: false
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
    coverEditor() {
      return this.$API.getImg(this.cover)
    },
    isShowTransfer() {
      return this.$route.query.from === 'draft'
    },
    CCLicenseCredit() {
      if (!this.isOriginal) return null
      let ShareAlike = false
      const Noncommercial = !this.ccLicenseOptions.commercialUse
      let NoDerivativeWorks = false
      if (this.ccLicenseOptions.share === 'false') NoDerivativeWorks = true
      if (this.ccLicenseOptions.share === 'SA') ShareAlike = true
      const license = CreativeCommonsLicenseGenerator({
        ShareAlike,
        Noncommercial,
        NoDerivativeWorks
      })
      const chinese = convertLicenseToChinese(license)
      const url = `https://creativecommons.org/licenses/${license.toLowerCase()}/4.0/deed.zh`
      return { license, chinese, url }
    },
    requireToken() {
      let tokenArr = []
      if (this.readauThority) {
        // 持通证
        // 获取当前选择的通证种
        const token = this.readSelectOptions.filter(list => list.id === this.readSelectValue)
        // 目前只用上传一种数据格式
        tokenArr = [
        {
          tokenId: token[0].id,
          amount: toPrecision(this.readToken, 'cny', token[0].decimals)
        }]
      }
      return tokenArr
    },
    requireBuy() {
      const { type } = this.$route.params
      if (this.paymentToken === 0) return null;
      if (type === 'edit' && !this.paymentTokenVisible) {
        return null
      } else {
        const data = {
          price: toPrecision(this.paymentToken, 'cny', 4) // 默认四位小数
        }
        return data
      }
    }
  },
  watch: {
    fissionNum() {
      this.fissionFactor = this.fissionNum * 1000
    },
    title() {
      this.updateDraftWatch()
    },
    markdownData() {
      this.updateDraftWatch()
    },
    commentPayPoint() {
      this.updateDraftWatch()
    },
    cover() {
      this.updateDraftWatch()
    },
    isOriginal() {
      this.updateDraftWatch()
    },
    tagCards: {
      deep: true,
      handler() {
        if (!this.autoUpdateDfaftTags) return
        this.updateDraftWatch()
      }
    }
  },
  created() {
    // 编辑文章不会自动保存
    if (this.$route.params.type === 'edit') this.saveDraft = ''
    const importRegexp = /^https?:\/\/.+$/
    clipboard.readText().then(text => {
      if (importRegexp.exec(text)) {
        this.oneKeyImportVisible = true
      }
    }).catch(err => {
      console.log('paste error:' + err.message)
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed()) next()
    else {
      this.showModal = true
      this.modalMode = 'back'
      next(false)
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.unload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.unload)
  },
  mounted() {
    // 没有登录 通过isLogined获取在页面刷新后会获取较慢 无法通过它来判断
    if (!getCookie('ACCESS_TOKEN')) return this.$router.go(-1)

    const { type, id } = this.$route.params

    if (type === 'draft' && id === 'create') {
      // 创建新草稿
      this.autoUpdateDfaft = true
    } else if (type === 'draft' && id !== 'create') {
      // 编辑草稿
      this.getDraft(id)
    } else if (type === 'edit') {
      const { hash } = this.$route.query
      // 编辑文章
      this.setArticleDataById(hash, id)
    } else {
      console.log('路由错误')
      this.$router.push({ name: 'publish-type-id', params: { type: 'draft', id: 'create' } })
    }

    this.getTags()
    this.getAllTokens()
    this.setToolBar()
  },

  methods: {
    ...mapActions(['getSignatureOfArticle']),
    // watch 监听草稿更新
    updateDraftWatch() {
      if (!this.autoUpdateDfaft) return
      this.updateDraftFunc()
    },
    // 更新草稿方法
    updateDraftFunc: debounce(function() {
      const { title, markdownData: content, fissionFactor, cover } = this
      const isOriginal = Number(this.isOriginal)
      const { type, id } = this.$route.params

      // console.log(this.$route)

      if (type === 'draft' && id === 'create') {
        // console.log('创建草稿')
        this.autoCreateDraft({
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      } else if (type === 'draft' && id !== 'create') {
        // console.log('更新草稿')
        // 草稿箱编辑 更新
        this.autoUpdateDraft({
          id: this.id,
          title,
          content,
          fissionFactor,
          cover,
          isOriginal
        })
      }
    }, 500),
    /**
     * 获取所有token
     */
    async getAllTokens() {
      const pagesize = 999
      await this.$backendAPI
        .allToken({ pagesize })
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.readSelectOptions = res.data.data.list
          }
        })
        .catch(err => console.log(err))
    },
    unload($event) {
      // 刷新页面 关闭页面有提示
      // https://jsfiddle.net/jbf4vL7h/29/
      // eslint-disable-next-line no-useless-escape
      var confirmationMessage = '\o/'
      $event.returnValue = confirmationMessage // Gecko, Trident, Chrome 34+
      return confirmationMessage // Gecko, WebKit, Chrome <34
    },
    changed() {
      // 如果允许关闭 或者 内容都为空
      return this.allowLeave || (!strTrim(this.title) && !strTrim(this.markdownData))
    },
    setTag(data) {
      this.articleData = data // 设置文章数据
      // 编辑的时候设置tag状态
      const { id } = this.$route.params
      if (id !== 'edit') this.setTagStatus()
    },
    // 通过ID拿数据
    async setArticleDataById(hash, id) {
      await this.$API
        .getIpfsData(hash)
        .then(res => {
          if (res.code === 0) {
            // 设置文章内容
            this.title = res.data.title
            this.markdownData = res.data.content
          } else this.$message.warning(res.message)
        })
        .catch(err => {
          console.log('err', err)
        })

      // 获取文章信息
      await this.$API
        .getMyPost(id)
        .then(res => {
          if (res.code === 0) {
            this.fissionNum = res.data.fission_factor / 1000
            this.signature = res.data.sign
            this.cover = res.data.cover
            this.signId = res.data.id
            this.isOriginal = Boolean(res.data.is_original)

            // 持Fan票阅读
            if (res.data.tokens && res.data.tokens.length !== 0) {
              this.readauThority = true
              this.readToken = precision(
                res.data.tokens[0].amount,
                'cny',
                res.data.tokens[0].decimals
              )
              this.readSummary = res.data.short_content
              // this.readSelectOptions = res.data.tokens
              this.readSelectValue = res.data.tokens[0].id
            }

            // 持Fan票支付
            if (res.data.prices && res.data.prices.length !== 0) {
              this.paymentTokenVisible = true
              this.paymentToken = precision(
                res.data.prices[0].price,
                res.data.prices[0].platform,
                res.data.prices[0].decimals
              )
              this.readSummary = res.data.short_content
              this.paymentSelectValue = -1
            }

            this.setTag(res.data)
          } else {
            this.$toast({ duration: 1000, message: res.message })
            this.$router.push({ path: '/article' })
          }
        })
        .catch(err => {
          console.error(err)
          this.$toast({ duration: 1000, message: this.$t('error.getArticleInfoError') })
          this.$router.push({ path: '/article' })
        })
    },
    // 得到草稿箱内容 by id
    async getDraft(id) {
      await this.$API
        .getDraft({ id })
        .then(res => {
          this.fissionNum = res.fission_factor ? res.fission_factor / 1000 : 2
          this.cover = res.cover
          this.title = res.title
          this.markdownData = res.content
          this.id = id
          this.isOriginal = Boolean(res.is_original)
          this.commentPayPoint = res.comment_pay_point

          this.setTag(res)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取草稿内容失败')
        })
        .finally(() => {
          this.autoUpdateDfaft = true
        })
    },
    // 错误提示
    failed(error) {
      console.error('发送失败', error)
      this.$toast({ duration: 1000, message: error })
    },
    // 跳转页面
    jumpToArticle(id) {
      this.$router.push({ name: 'p-id', params: { id: id } })
    },
    // 成功提示
    async success(id) {
      this.$toast({ duration: 1000, message: this.$t('success.public') })
      // await sleep(3000) // 休眠三秒
      this.jumpToArticle(id)
    },
    // 发送文章到ipfs
    async sendPost({ title, author, content }) {
      try {
        const res = await this.$API.sendPost({
          title,
          author,
          content,
          desc: 'whatever'
        })
        if (res.code === 0) return res
        else {
          this.failed(this.$t('error.sendPostIpfsFail'))
          return false
        }
      } catch (error) {
        console.log('sendPost error', error)
        this.failed('上传ipfs失败')
        return false
      }
    },
    // 文章标签 tag
    setArticleTag(tagCards) {
      let tags = ''
      const tagCardsFilter = tagCards.filter(i => i.status === true)
      if (tagCardsFilter.length !== 0) {
        tagCardsFilter.map((i, index) => {
          if (index === 0) tags += i.id
          else tags += `,${i.id}`
        })
      }
      return tags
    },
    // 文章持Fan票阅读
    async postMineTokens(id) {
      let data = null
      const { type } = this.$route.params
      // 如果是编辑 并且没有设置 传递空数组
      // 如果是发布文章 没有设置不会进入这里
      if (type === 'edit' && !this.readauThority) {
        data = {
          signId: id,
          tokens: []
        }
      } else {
        let tokenArr = []
        if (this.readauThority) {
          // 持通证
          // 获取当前选择的通证种
          const token = this.readSelectOptions.filter(list => list.id === this.readSelectValue)
          // 目前只用上传一种数据格式
          tokenArr = [
            {
              tokenId: token[0].id,
              amount: toPrecision(this.readToken, 'cny', token[0].decimals)
            }
          ]
        }
        data = {
          signId: id,
          tokens: tokenArr
        }
      }

      const res = await this.$API.addMineTokens(data)
      if (res.code === 0) return res.message
      else throw res.message
    },
    // 文章支付阅读
    async articlePrices(id) {
      const { type } = this.$route.params
      // 如果是编辑 并且没有设置 删除
      // 如果是发布文章 没有设置不会进入这里
      if (type === 'edit' && !this.paymentTokenVisible) {
        const res = await this.$API.articlePricesDelete(id)
        if (res.code === 0) return res.message
        else throw res.message
      } else {
        const data = {
          price: toPrecision(this.paymentToken, 'cny', 4) // 默认四位小数
        }
        const res = await this.$API.articlePrices(id, data)
        if (res.code === 0) return res.message
        else throw res.message
      }
    },
    // 发布文章
    async publishArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      article.cc_license = this.isOriginal ? this.CCLicenseCredit.license : null
      article.requireBuy = this.requireBuy
      article.requireToken = this.requireToken
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      const { failed } = this
      try {
        const { author, hash } = article
        let signature = null
        try {
          const response = await this.$API.publishArticle({ article, signature })

          if (response.code !== 0) throw new Error(response.message)

          // 发送完成开始设置阅读权限 因为需要返回的id
          const promiseArr = []
          if (this.readauThority) promiseArr.push(this.postMineTokens(response.data)) // 持Fan票阅读
          if (this.paymentTokenVisible) promiseArr.push(this.articlePrices(response.data)) // 支付Fan票
          promiseArr.push(this.delDraft(this.$route.params.id)) // 删除草稿
          Promise.all(promiseArr)
            .then(() => {
              this.success(
                response.data,
                `${this.$t('publish.publishArticleSuccess', [this.$point.publish])}`
              )
            })
            .catch(err => {
              console.log('err', err)
              this.$message.error(err)
            })
        } catch (error) {
          this.$store.commit('setLoginModal', this.$errorHandling.isNoToken(error))
          throw error
        }
      } catch (error) {
        console.error(error)
        failed(error)
        throw error
      }
    },
    // confirmSaveDraft() {
    //   this.createDraft(this.saveInfo)
    // },
    // 创建草稿
    // async createDraft(article) {
    //   try {
    //     // 设置文章标签 🏷️
    //     article.tags = this.setArticleTag(this.tagCards)
    //     // 设置积分
    //     article.commentPayPoint = this.commentPayPoint
    //     const response = await this.$backendAPI.createDraft(article)
    //     if (response.data.msg !== 'success') this.failed(this.$t('error.failTry'))
    //     this.$toast.success({ duration: 1000, message: this.$t('success.save') })
    //     this.$router.go(-1)
    //   } catch (error) {
    //     console.log(error)
    //     this.failed(this.$t('error.failTry'))
    //   }
    // },
    // 自动创建草稿
    async autoCreateDraft(article) {
      console.log(111, article)
      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      this.allowLeave = true
      article.tags = this.setArticleTag(this.tagCards)
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      await this.$API
        .createDraft(article)
        .then(res => {
          if (res.code === 0) {
            this.saveDraft = '自动存为草稿'
            // console.log(this.$route)
            this.$route.params.id = res.data
            this.id = res.data
            // console.log(this.$route)
            const url = window.location.origin + '/publish/draft/' + res.data
            history.pushState({}, '', url)
          } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
        })
        .catch(err => {
          console.log(err)
          this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
        })
    },
    // 编辑文章
    async editArticle(article) {
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      article.requireBuy = this.requireBuy
      article.requireToken = this.requireToken
      const { author } = article
      let signature = null
      // if (!this.$publishMethods.invalidId(this.currentUserInfo.idProvider)) {
      //   signature = await this.getSignatureOfArticle({ author, hash })
      // }
      const response = await this.$API.editArticle({ article, signature })
      if (response.code === 0) {
        const promiseArr = []
        promiseArr.push(this.postMineTokens(response.data)) // 持Fan票阅读
        promiseArr.push(this.articlePrices(response.data)) // 支付Fan票
        Promise.all(promiseArr)
          .then(() => {
            this.success(response.data)
          })
          .catch(err => {
            console.log('err', err)
            this.$message.error(err)
          })
      } else this.failed(this.$t('error.failTry'))
    },
    // 删除草稿
    async delDraft(id) {
      if (!id) {
        this.failed(this.$t('error.deleteDraft'))
        return
      }
      try {
        const response = await this.$backendAPI.delDraft({ id })
        if (response.status !== 200) this.failed(this.$t('error.deleteDraft'))
      } catch (error) {
        this.failed(this.$t('error.deleteDraft'))
      }
    },
    // 更新草稿
    async autoUpdateDraft(article) {
      this.allowLeave = true

      this.saveDraft = '保存中...'
      // 设置文章标签 🏷️
      article.tags = this.setArticleTag(this.tagCards)
      // 设置积分
      article.commentPayPoint = this.commentPayPoint
      try {
        const res = await this.$API.updateDraft(article)
        if (res.code === 0) {
          this.saveDraft = '自动存为草稿'
        } else this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      } catch (error) {
        this.saveDraft = '<span style="color: red">文章自动保存失败,请重试</span>'
      }
    },
    // // 更新草稿
    // async updateDraft(article) {
    //   // 设置文章标签 🏷️
    //   article.tags = this.setArticleTag(this.tagCards)
    //   // 设置积分
    //   article.commentPayPoint = this.commentPayPoint
    //   try {
    //     const response = await this.$backendAPI.updateDraft(article)
    //     if (response.status === 200 && response.data.code === 0) {
    //       this.$toast({ duration: 1000, message: this.$t('success.draftUpdate') })
    //       this.$navigation.cleanRoutes() // 清除路由记录
    //       this.$router.go(-1)
    //     } else this.failed(this.$t('error.failTry'))
    //   } catch (error) {
    //     this.failed(this.$t('error.failTry'))
    //   }
    // },
    // 发布||修改按钮
    sendThePost() {
      // 没有登陆 点击发布按钮都提示登陆  编辑获取内容的时候会被前面的func拦截并返回home page
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)

      // 标题或内容为空时
      if (!strTrim(this.title) || !strTrim(this.markdownData))
        return this.$toast(this.$t('warning.titleOrContent'))

      if (!this.cover) return this.$toast({ duration: 1000, message: this.$t('warning.cover') })

      if (this.fissionFactor === '') this.fissionFactor = 2 // 用户不填写裂变系数则默认为2

      this.allowLeave = true
      // const { type, id } = this.$route.params
      const { type } = this.$route.params

      const { currentUserInfo, title, markdownData: content, fissionFactor, cover } = this
      const { name: author } = currentUserInfo
      const isOriginal = Number(this.isOriginal)

      // url draft edit
      // 草稿发送
      const draftPost = async () => {
        if (this.readauThority) {
          if (!this.readSelectValue) return this.$message.warning('请选择持Fan票类型')
          else if (!(Number(this.readToken) > 0))
            return this.$message.warning('持Fan票数量设置不能小于0')
          else if (!this.readSummary) return this.$message.warning('请填写摘要')
        }

        if (this.paymentTokenVisible) {
          if (!this.paymentSelectValue) return this.$message.warning('请选择支付类型')
          else if (!(Number(this.paymentToken) > 0))
            return this.$message.warning('支付数量设置不能小于0')
          else if (!this.readSummary) return this.$message.warning('请填写摘要')
        }

        this.fullscreenLoading = true
        // 发布文章
        const data = { title, author, content }
        await this.publishArticle({
          author,
          title,
          data,
          fissionFactor,
          cover,
          isOriginal,
          shortContent: this.readSummary
        })
        this.fullscreenLoading = false
      }
      // 编辑发送
      const editPost = async () => {
        if (this.readauThority) {
          if (!(Number(this.readToken) > 0))
            return this.$message.warning('持Fan票证数量设置不能小于0')
          else if (!this.readSelectValue) return this.$message.warning('请选择持Fan票类型')
          else if (!this.readSummary) return this.$message.warning('请填写摘要')
        }

        this.fullscreenLoading = true
        // 编辑文章
        const data = { title, author, content }
        this.editArticle({
          signId: this.signId,
          author,
          title,
          data,
          fissionFactor,
          signature: this.signature,
          cover,
          isOriginal,
          shortContent: this.readSummary
        })
        this.fullscreenLoading = false
      }
      if (type === 'draft') draftPost()
      else if (type === 'edit') editPost()
      else draftPost() // 错误的路由, 当发布文章处理
    },
    $imgAdd(pos, imgfile) {
      // 想要更换默认的 uploader， 请在 src/api/imagesUploader.js 修改 currentImagesUploader
      // 不要在页面组件写具体实现，谢谢合作 - Frank
      if (imgfile.type === 'image/gif') {
        this.$API
          .ossUploadImage('article', imgfile)
          .then(res => {
            if (res.code === 0) {
              this.$refs.md.$img2Url(pos, this.$API.getImg(res.data))
            } else {
              this.$toast({ duration: 1000, message: '上传图片失败,请重试' })
              this.$refs.md.$img2Url(pos, '上传图片失败,请重试')
            }
          })
          .catch(err => {
            if (err.response.status === 401) {
              this.$toast({ duration: 1000, message: '请登录后上传图片' })
              this.$store.commit('setLoginModal', true)
            } else {
              console.log('err', err)
            }
            this.$refs.md.$img2Url(pos, '上传图片失败,请重试')
          })
      } else {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()
        image.onload = () => {
          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)
          canvas.toBlob(
            blob => {
              this.$API
                .ossUploadImage('article', blob)
                .then(res => {
                  if (res.code === 0) {
                    this.$refs.md.$img2Url(pos, this.$API.getImg(res.data))
                  } else {
                    this.$toast({ duration: 1000, message: '上传图片失败,请重试' })
                    this.$refs.md.$img2Url(pos, '上传图片失败,请重试')
                  }
                })
                .catch(err => {
                  this.$refs.md.$img2Url(pos, '上传图片失败,请重试')
                  if (err.response.status === 401) {
                    this.$toast({ duration: 1000, message: '请登录后上传图片' })
                    this.$store.commit('setLoginModal', true)
                  } else {
                    console.log('err', err)
                  }
                })
            },
            imgfile.type,
            0.3
          )
        }
        image.src = imgfile.miniurl
      }
    },
    setToolBar() {
      this.toolbars = Object.assign(toolbars.public, toolbars.mobile)
    },
    // 上传完成
    doneImageUpload(res) {
      // console.log(res);
      this.imgUploadDone += Date.now()
      this.cover = res.data.cover
    },
    // 删除cover
    removeCover() {
      this.cover = ''
    },
    // head 返回
    headerBackFunc() {
      this.modalMode = 'back'
      this.headLeavePageFunc()
    },
    // head 返回首页
    headerHomeFunc() {
      this.modalMode = 'home'
      this.headLeavePageFunc()
    },
    // head 离开页面方法
    headLeavePageFunc() {
      if (!strTrim(this.title) && !strTrim(this.markdownData)) {
        this.allowLeave = true
        this.leavePage()
      } else this.showModal = true
    },
    // 关闭modal
    changeInfo(status) {
      this.showModal = status
    },
    // modal 同意
    modalCancel() {
      this.showModal = false
      this.allowLeave = true
      this.leavePage()
    },
    // 离开页面
    leavePage() {
      if (this.modalMode === 'back') this.$router.go(-1)
      else if (this.modalMode === 'home') this.$router.push({ name: 'index' })
      else this.$router.go(-1)
    },
    // 获取标签
    async getTags() {
      await this.$backendAPI
        .getTags()
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            let { data } = res.data

            // 过滤商品标签 id <= 100
            const filterId = i => i.id <= 100
            const filterTag = data.filter(filterId)
            // 过滤商品标签 id <= 100 end

            filterTag.map(i => (i.status = false))
            this.tagCards = filterTag
          } else console.log(res.data.message)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.autoUpdateDfaftTags = true
        })
    },
    // 切换状态
    toggleTagStatus(data) {
      const tagCardsIndex = this.tagCards.findIndex(i => i.id === data.id)
      if (tagCardsIndex === -1) return
      this.tagCards.map(i => (i.status = false))
      this.tagCards[tagCardsIndex].status = data.status
      // console.log(this.tagCards, data)
    },
    // 设置标签状态
    setTagStatus() {
      let tagCardsCopy = this.tagCards
      this.articleData.tags.map(i => {
        tagCardsCopy.map((j, index) => {
          if (i.id === j.id) tagCardsCopy[index].status = true
        })
      })
      this.tagCards = tagCardsCopy
    },
    // 关闭原创声明框
    closeStatement(val) {
      // console.log(val)
      this.isOriginal = val
      this.statementVisible = false
    },
    // 原创改变 true 才显示原创声明
    originalChange(val) {
      if (val) this.statementVisible = true
    },
    importRes(res) {
      this.title = res.title
      this.markdownData = res.content
      this.cover = res.cover
    },
    isNumber(event) {
      if (!/\d/.test(event.key) && event.key !== '.') {
        return event.preventDefault()
      }
    }
  }
}
</script>

<style scoped lang="less" src="./index.less"></style>
<style lang="less">
/* 全局覆盖组件样式 */
.v-note-wrapper .v-note-op {
  border: none !important;
}
.content-input-wrapper {
  padding: 8px 10px 15px 10px !important;
}
// 外层容器
.editor {
  margin-top: 68px;
}
// 工具栏
.editor .v-note-op {
  position: fixed;
  top: 113px;
  left: 0;
  right: 0;
  border-top: 1px solid #eee !important;
  border-bottom: 1px solid #eee !important;
  box-sizing: border-box;
}
// 内容
.editor .v-note-panel {
  padding-top: 40px;
  border-top: none !important;
  border-right: none !important;
  border-left: none !important;
  border-bottom: 1px solid #eee !important;
}
// 工具栏按钮 去掉样式
.editor [type='button'] {
  -webkit-appearance: none;
}
// 工具栏样式下拉阴影
.editor .op-image.popup-dropdown,
.editor .op-header.popup-dropdown {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 4px 0px !important;
}

.editor .v-show-content.scroll-style {
  background-color: #fff !important;
}
.editor .v-note-edit.divarea-wrapper.scroll-style {
  background-color: #f8f9fa;
}
.editor .auto-textarea-input.no-border.no-resize {
  background-color: #f8f9fa;
}
.editor .v-note-op .v-left-item,
.editor .v-note-op .v-right-item {
  flex: none !important;
  display: flex;
  align-items: center;
}
.editor .v-note-op .v-right-item {
  max-width: auto !important;
}
.op-icon-divider {
  height: 18px !important;
}
.editor .op-icon {
  margin-left: 3px !important;
  margin-right: 3px !important;
}
@media screen and (max-width: 750px) {
  .editor .op-icon {
    margin-left: 1px !important;
    margin-right: 1px !important;
  }
}
.ivu-poptip-popper {
  z-index: 500;
}

.slider {
  .el-slider__bar {
    background-color: #542de0;
  }
  .el-slider__button {
    border-color: #542de0;
  }
}
</style>
