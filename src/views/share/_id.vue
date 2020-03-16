<template>
  <div
    class="share"
    @click.stop="hideClient"
  >
    <BaseHeader
      :pageinfo="{title: '分享详情'}"
      customize-header-bc="#fff"
      :has-bottom-border-line="true"
      class="header"
    >
      <shareHeadRight
        v-if="isMe(content.uid)"
        :id="content.id"
        slot="right"
      />
    </BaseHeader>
    <div v-loading="loading">
      <shareHeader
        :id="content.uid"
        :avatar="userInfo.avatar"
        :username="userInfo.nickname || userInfo.username"
        :time="content.create_time"
        :read="content.read"
        :hash="content.hash"
      />
      <shareMain :content="shareContent" />
      <div class="empty" />
    </div>
    <quote
      v-show="refernceTotal !== 0 || berefernceTotal !== 0"
      :show="showQuote"
      @showQuote="status => showQuote = status"
    >
      <template slot="left-prompt">
        已引用<span>{{ refernceTotal }}</span>
      </template>
      <template slot="right-prompt">
        被引用<span>{{ berefernceTotal }}</span>
      </template>
      <quoteReference
        slot="ref"
        :now-time="nowTime"
        @getArticle="getArticle"
      />
      <quoteBereference
        slot="beref"
        :now-time="nowTime"
        @getArticle="getArticle"
      />
    </quote>
    <shareFooter
      v-loading="footerLoading"
      :bookmarked="currentProfile.is_bookmarked"
      :is-liked="Number(currentProfile.is_liked)"
      :likes="content.likes"
      :dislikes="content.dislikes"
      class="footer"
      @bookmarked="bookmarked"
      @share="shareDialogVisible = true"
      @like="like"
    />
    <m-dialog
      v-model="shareDialogVisible"
      :title="$t('share')"
    >
      <!-- 如果内容过多可以抽离 -->
      <div class="dialog-content">
        <div class="dialog-content__btn">
          <div
            class="btn-icon"
            @click="shareImageShow"
          >
            <svg-icon icon-class="share_img" />
          </div>
          <p class="btn-text">
            生成图片
          </p>
        </div>
        <div class="dialog-content__btn">
          <div
            class="btn-icon"
            @click="copy(shareLink)"
          >
            <svg-icon icon-class="copy3" />
          </div>
          <p class="btn-text">
            复制分享链接
          </p>
        </div>
      </div>
      <SocialShare
        :title="shareContent"
        :link="link"
        :qq-title="qqtitle"
      />
    </m-dialog>

    <m-dialog
      v-model="shareDoneCard"
      width="320px"
    >
      <!-- 如果内容过多可以抽离 -->
      <div>
        <img
          src="@/assets/img/done.png"
          alt="done"
          class="share-done"
        >
        <h4 class="share-done__title">
          分享已发布
        </h4>
        <p class="share-done__desciption">
          保存分享卡片把思考与灵感传达给更多的人
        </p>
        <div
          ref="shareCard"
          v-loading="createShareLoading"
          class="share-card"
        >
          <img
            v-if="saveImg"
            :src="saveImg"
            alt="save"
            @click="viewImage(saveImg)"
          >
        </div>
        <el-button
          v-loading="saveLoading"
          :disabled="saveLoading"
          type="primary"
          class="share-card__btn"
          @click="downloadShareImage"
        >
          保存并分享卡片
        </el-button>
        <p
          v-if="iswechat"
          class="wechat"
        >
          微信内可长按保存图片
        </p>
        <shareImage
          v-if="!saveImg"
          ref="shareImage"
          :content="shareCard.content"
          :avatar-src="shareCard.avatarSrc"
          :username="shareCard.username"
          :reference="shareCard.reference"
          :url="shareCard.url"
          card-type="read"
          class="share-card__box"
        />
      </div>
    </m-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'
import { sleep } from '@/common/methods'
import SocialShare from '@/components/share/social_share.vue'

import shareFooter from '@/components/share_page/share_footer'
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import quote from '@/components/share_page/quote'
import quoteReference from '@/components/share_page/quote_reference'
import quoteBereference from '@/components/share_page/quote_bereference'
import shareImage from '@/components/share_image/index'
import html2canvas from 'html2canvas'
import Vue from 'vue'
import { ImagePreview } from 'vant'
import shareHeadRight from '@/components/share_page/share_head_right'

Vue.use(ImagePreview)

export default {
  components: {
    shareHeader,
    shareFooter,
    shareMain,
    quote,
    quoteReference,
    quoteBereference,
    shareImage,
    SocialShare,
    shareHeadRight
  },
  data() {
    return {
      loading: false,
      footerLoading: false, // footer loading
      shareContent: '', // 分享内容
      content: Object.create(null), // 文章信息
      userInfo: Object.create(null), // 用户信息
      currentProfile: Object.create(null), // 当前相关信息
      shareDialogVisible: false, // 分享 dialog
      showQuote: false, // refernces
      nowTime: 0, // refernces
      refernceTotal: 0, // refernces slidebar
      berefernceTotal: 0, // refernces slidebar
      shareDoneCard: false, // share card
      shareCard: { // share card data
        content: '',
        avatarSrc: '',
        username: '',
        reference: [],
        url: process.env.VUE_APP_URL
      },
      saveImg: '', // share img src
      saveImgCanvas: '', // share img src
      createShareLoading: false,
      saveLoading: false, // 保存图片loading
    }
  },
  watch: {
    nowTime() {
      this.getReferenceCount('postsReferences', {}, 'refernce')
      this.getReferenceCount('postsPosts', {}, 'berefernce')
    },
    shareDoneCard(newVal) {
      if (!newVal) {
        this.shareCard = {
          content: '',
          avatarSrc: '',
          username: '',
          reference: [],
          url: process.env.VUE_APP_URL
        }
        this.saveImg = ''
        this.saveImgCanvas = ''
      }
    }
  },
  created() {
    // 无id
    let { id = '' } = this.$route.params
    this.init(id)
    this.getReferenceCount('postsReferences', {}, 'refernce')
    this.getReferenceCount('postsPosts', {}, 'berefernce')
  },
  mounted() {
    // console.log('mounted')
  },
  destroyed() {
    // console.log('destroyed')
    this.$navigation.cleanRoutes() // 清除路由记录
  },
  computed: {
    ...mapGetters(['isLogined', 'isMe']),
    link() {
      if (process.browser) return `${process.env.VUE_APP_URL}/share/${this.$route.params.id}`
      else return process.env.VUE_APP_URL
    },
    shareLink() {
      return `来自Matataki「${this.userInfo.nickname || this.userInfo.username}」用户的分享 - ${this.link}` || process.env.VUE_APP_URL
    },
    qqtitle() {
      return `来自Matataki「${this.userInfo.nickname || this.userInfo.username}」用户的分享`
    },
    iswechat() {
      return /micromessenger/.test(navigator.userAgent.toLowerCase())
    }
  },
  methods: {
    init(id) {
      if (!id) return this.$router.go(-1)
      this.getDetail(id)
      this.getCurrentProfile(id)
      this.reading(id)
    },
    // 客户端打开文章后提交，表示开始阅读
    async reading(id) {
      if (!getCookie('ACCESS_TOKEN')) return
      await this.$API.reading(id)
        .then(res => console.log(`reading ${res.message}`))
        .catch(err => console.log(`reading err ${err}`))
    },
    // 获取详情内容
    getDetail(id) {
      this.loading = true
      this.$API.shareDetail(id)
        .then(res => {
          if (res.code === 0) {
            this.content = res.data
            // 如果不是分享返回上一页
            if (res.data.channel_id !== 3) return this.$router.go(-1)
            else {
              this.authorInfo(res.data.uid)
              this.getIpfsData(res.data.hash)
              this.read(res.data.hash)

              // share
              this.setShareContentAndUrl(res.data.short_content, res.data.id)
            }
          } else {
            console.log(res.message)
            this.$toast({ duration: 1000, message: '获取内容失败, 请刷新后重试' })
            this.loading = false
          }
        }).catch(err => {
          console.log(err)
          this.$toast({ duration: 1000, message: '获取内容失败, 请刷新后重试' })
          this.loading = false
        })
    },
    // 得到作者信息
    authorInfo(id) {
      this.$API.getUser(id)
        .then(res => {
          if (res.code === 0) {
            this.userInfo = res.data

            // share
            this.setShareUser(res.data.avatar, res.data.nickname || res.data.username)
          } else {
            console.log(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
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
    // 设置微信分享
    setWxShare(title, desc) {
      this.$wechatShare({ title, desc: this.regRemoveContent(desc)})
    },
    // 得到ipfs内容
    async getIpfsData(hash) {
      if (!hash) return console.log('no hash')
      await this.$API
        .getIpfsData(hash)
        .then(res => {
          if (res.code === 0) {
            this.shareContent = res.data.content

            // share
            this.setShareContentAndUrl(res.data.content, this.content.id)
            this.setWxShare('分享详情-瞬MATATAKI', res.data.content)
          } else {
            this.$toast({ duration: 1000, message: res.message })
            console.log(res.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast({ duration: 1000, message: '获取文章内容失败' })
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 增加文章阅读量
    async read(hash) {
      await this.$API.read(hash).catch(err => console.log('add read amount error', err))
    },
    // 获取当前文章相关信息
    async getCurrentProfile (id) {
      if (!getCookie('ACCESS_TOKEN')) return
      await this.$API.currentProfile({id})
        .then(res => {
          if (res.code === 0) this.currentProfile = res.data
          else console.log(res.message)
        }).catch(err => {
          console.log(err)
        })
    },
    // 收藏
    async bookmarked(bookmarked) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.footerLoading = true
      // 状态码不为200 !!! 所以取消了res.code === 0
      if (bookmarked) {
        this.$confirm('是否取消收藏?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box__mobile'
        }).then(async () => {
          await this.$API.unbookmark(this.currentProfile.id)
            .then(res => {
              this.$toast.success({ duration: 1000, message: '取消成功' })
              this.currentProfile.is_bookmarked = 0
            })
            .catch(err => console.log(err))
            .finally(() => {
              this.footerLoading = false
            })
        }).catch(() => {
          this.footerLoading = false
        })
      } else {
        await this.$API.bookmark(this.currentProfile.id)
          .then(res => {
            this.$toast.success({ duration: 1000, message: '收藏成功' })
            this.currentProfile.is_bookmarked = 1
          })
          .catch(err => console.log(err))
          .finally(() => {
            this.footerLoading = false
          })
      }
    },
    // 推荐 不推荐
    async like(isLiked) {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      if (this.currentProfile.is_liked !== 0) return this.$toast({duration: 1000, message: '您已经操作过了哦'}) // 减少不必要的请求
      this.footerLoading = true
      if (Number(isLiked) === 1) { // 不推荐
        await this.$API.dislike(this.content.id, { time: 0 })
          .then(res => {
            if (res.code === 0) {
              this.content.dislikes++
              this.currentProfile.is_liked = 1
              this.$toast.success({duration: 1000, message: res.message})
            }
            else this.$toast({duration: 1000, message: res.message})
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.footerLoading = false
          })
      } else if (Number(isLiked === 2)) { // 推荐 
        await this.$API.like(this.content.id, { time: 0 })
          .then(res => {
            console.log('res API like token', res)
            if (res.code === 0) {
              this.content.likes++
              this.currentProfile.is_liked = 2
              this.$toast.success({duration: 1000, message: res.message})
            }
            else this.$toast({duration: 1000, message: res.message})
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.footerLoading = false
          })
      }
    },
    hideClient() {
      this.showQuote = false
    },
    async getArticle(id, popEvent) {
      // console.log(id, popEvent)
      this.$route.params.id = id
      let { origin } = window.location
      const url = `${origin}/share/${id}`
      history.replaceState({}, '', url)
      // // 切换 url不刷新
      // if (!popEvent) {
      //   const url = `${window.location.origin}/share/${id}`
      //   history.pushState({}, '', url)
      // }

      // refernce
      this.nowTime = Date.now()

      this.init(id)
    },
    copy(val) {
      this.$copyText(val).then(
        () => this.$toast.success({ className: 'toast-zindex2999', duration: 1000, message: this.$t('success.copy') }),
        () => this.$toast.fail({ className: 'toast-zindex2999', duration: 1000, message: this.$t('fail.copy') })
      )
    },
    // 获取引用数量
    async getReferenceCount(url, params, type) {
      try {
        const res = await this.$API.getBackendData({ url, params, urlReplace: this.$route.params.id })
        // console.log('res', res)
        if (res.code === 0) {
          if (type === 'refernce') {
            this.refernceTotal = res.data.count

            // share
            this.setShareRef(res.data.list)
          }
          else if (type === 'berefernce') this.berefernceTotal = res.data.count
          else this.refernceTotal = res.data.count
        } else console.log(res.message)
      } catch (error) { console.log(error) }
    },
    // 显示分享框
    shareImageShow() {
      this.shareDialogVisible = false
      this.shareDoneCard = true
      // 清空图片
      this.saveImg = ''
      this.saveImgCanvas = ''
      // 生成图片loading
      this.createShareLoading = true
      // 显示dialog
      this.shareDoneCard = true
      this.createShareImage()
    },
    // 设置内容和url
    setShareContentAndUrl(content, id) {
      this.shareCard.content = content
      this.shareCard.url = `${process.env.VUE_APP_URL}/share/${id}`
    },
    // 设置用户信息
    setShareUser(avatar, username) {
      this.shareCard.avatarSrc = avatar ? this.$ossProcess(avatar) : ''
      this.shareCard.username = username
    },
    // 设置引用
    setShareRef(ref) {
      this.shareCard.reference = ref.slice(0, 10)
      console.log(this.shareCard)
    },
    // 下载图片
    downloadShareImage() {
      this.saveLoading = true

      if (navigator.userAgent.includes('TokenPocket') && tp.isConnected()) {
        console.log('tp 环境')
        this.saveImgCanvas.toBlob(blob => {
          this.$API
            .ossUploadImage('temp', blob)
            .then(res => {
              if (res.code === 0) {
                tp.saveImage({
                  url: this.$ossProcess(res.data)
                })
              } else {
                this.$toast({ duration: 1000, message: '保存失败,请重试' })
              }
            })
            .catch(err => {
              console.log('err', err)
              if (err.response.status === 401) {
                this.$toast({ duration: 1000, message: '请登录后保存图片' })
                this.$store.commit('setLoginModal', true)
              } else this.$toast({ duration: 1000, message: '保存失败,请重试' })
            })
            .finally(() => {
              this.saveLoading = false
            })
        })

      } else {
        console.log('other 环境')
        let linkTag = document.querySelector('#downloadImg')
        const { content } = this.shareCard
        const name = content.length >= 12 ? content.slice(0, 12) + '...' : content

        // 没有则创建
        if (!linkTag) {
          linkTag = document.createElement('a')
          linkTag.id = 'downloadImg'
        }

        linkTag.href = this.saveImg
        linkTag.download = `${name}.png`
        linkTag.click()

        this.saveLoading = false
      }



    },
    // 创建分享的卡片
    createShareImage() {
      this.$nextTick(() => {
        setTimeout(() => {
          const dom = this.$refs.shareImage.$el
          html2canvas(dom, {
            useCORS: true,
            allowTaint: true, //允许加载跨域的图片
            tainttest: true, //检测每张图片都已经加载完成
            scrollX: 0,
            scrollY: 0,
            width: dom.clientWidth,
            height: dom.clientHeight
          })
            .then(canvas => {
            // this.saveLocal(canvas)
              this.saveImgCanvas = canvas
              this.saveImg = canvas.toDataURL()
            })
            .catch(error => {
              console.log(error)
              this.$toast({})
            }).finally(() => {
            // 生成完毕 关闭loading
              this.createShareLoading = false
            })
        }, 1500)
      })
    },
    viewImage(src) {
      ImagePreview({
        images: [src],
        className: 'share-view__image'
      })
    },
  }
}
</script>
<style lang="less" scoped>
.share {
  padding-top: 45px;
  min-height: 100%;
  background-color: #fff;
}
.header {
  z-index: 3000;
}
.footer {
  z-index: 99;
}

.empty {
  height: 140px;
}


.dialog-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 30px;
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .btn-icon {
    width: 60px;
    height: 60px;
    // background: #f9f9f9;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    cursor: pointer;
  }
  .btn-text {
    font-size: 12px;
    color: #333;
    text-align: center;
    margin: 4px 0 0 0;
  }
}

.share-done {
  display: block;
  margin: 0 auto;
  width: 124px;
}
.share-done__title {
  font-size:14px;
  font-weight:bold;
  color:rgba(0,0,0,1);
  line-height:20px;
  padding: 0;
  margin: 10px 0 0;
  text-align: center;
}
.share-done__desciption {
  font-size:14px;
  line-height:20px;
  padding: 0;
  margin: 0;
  text-align: center;
  color: #B2B2B2;
}
.share-card {
  width: 105px;
  height: 222px;
  margin: 10px auto 0;
  // background-color: red;
  overflow: hidden;
  border: 1px solid #f1f1f1;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &__box {
    // opacity: 0;
    // transform: scale(0.28);
    // transform-origin: 0 0;
    position: fixed;
    left: 100%;
    top: 0;
  }
  &__btn {
    display: block;
    margin: 20px auto 0;
  }
}

.wechat {
  text-align: center;
  font-size: 12px;
  color: #676767;
  padding: 0;
  margin: 10px 0 0;
}
</style>

<style lang="less" scoped>
.toast-zindex2999 {
  z-index: 2999 !important;
}
</style>