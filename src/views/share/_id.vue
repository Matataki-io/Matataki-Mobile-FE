<template>
  <div class="share" @click.stop="hideClient">
    <BaseHeader
    :pageinfo="{title: '分享详情'}"
    customize-header-bc="#fff"
    :has-bottom-border-line="true"
    class="header" />
    <div v-loading="loading">
      <shareHeader
      :avatar="userInfo.avatar"
      :username="userInfo.nickname || userInfo.username"
      :time="content.create_time"
      :read="content.read"
      :hash="content.hash"
    ></shareHeader>
    <shareMain :content="shareContent"></shareMain>
    <div class="empty"></div>
    </div>
    <quote
      v-show="refernceTotal !== 0 || berefernceTotal !== 0"
      :show="showQuote"
      @showQuote="status => showQuote = status">
      <template slot="left-prompt">
        已引用<span>{{refernceTotal}}</span>
      </template>
      <template slot="right-prompt">
        被引用<span>{{berefernceTotal}}</span>
      </template>
      <quoteReference :nowTime="nowTime" slot="ref" @getArticle="getArticle"></quoteReference>
      <quoteBereference :nowTime="nowTime" slot="beref" @getArticle="getArticle"></quoteBereference>
    </quote>
    <shareFooter
      v-loading="footerLoading"
      :bookmarked="currentProfile.is_bookmarked"
      :isLiked="Number(currentProfile.is_liked)"
      :likes="content.likes"
      :dislikes="content.dislikes"
      @bookmarked="bookmarked"
      @share="shareDialogVisible = true"
      @like="like"
      class="footer">
    </shareFooter>
    <m-dialog v-model="shareDialogVisible">
      <!-- 如果内容过多可以抽离 -->
      <div class="dialog-content">
        <div class="dialog-content__btn">
          <div class="btn-icon" @click="copy('http://localhost:8080/share/101167?c=0f2a3ed6')">
            <svg-icon icon-class="copy3"></svg-icon>
          </div>
          <p class="btn-text">复制邀请链接</p>
        </div>
      </div>
    </m-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'
import { sleep } from '@/common/methods'

import shareFooter from '@/components/share_page/share_footer'
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import quote from '@/components/share_page/quote'
import quoteReference from '@/components/share_page/quote_reference'
import quoteBereference from '@/components/share_page/quote_bereference'

export default {
  components: {
    shareHeader,
    shareFooter,
    shareMain,
    quote,
    quoteReference,
    quoteBereference
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
    }
  },
  watch: {
    nowTime() {
      this.getReferenceCount('postsReferences', {}, 'refernce')
      this.getReferenceCount('postsPosts', {}, 'berefernce')
    },
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
    ...mapGetters(['isLogined']),
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
        }).catch(() => {})
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
        const res = await this.$backendAPI.getBackendData({ url, params, urlReplace: this.$route.params.id }, false)
        if (res.status === 200 && res.data.code === 0) {
          if (type === 'refernce') this.refernceTotal = res.data.data.count
          else if (type === 'berefernce') this.berefernceTotal = res.data.data.count
          else this.refernceTotal = res.data.data.count
        } else console.log(res.message)
      } catch (error) { console.log(error) }
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
  z-index: 9999;
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
</style>

<style lang="less" scoped>
.toast-zindex2999 {
  z-index: 2999 !important;
}
</style>