<template>
  <div class="share" @click.stop="hideClient" v-loading="loading">
    <BaseHeader :pageinfo="{title: '分享详情'}" customize-header-bc="#fff" :has-bottom-border-line="true" class="header" />
    <shareHeader
      :avatar="userInfo.avatar"
      :username="userInfo.nickname || userInfo.username"
      :time="content.create_time"
      :read="content.read"
      :hash="content.hash"
    ></shareHeader>
    <shareMain :content="shareContent"></shareMain>
    <quote :show="showQuote" :nowTime="nowTime" @showQuote="status => showQuote = status" @getArticle="getArticle"></quote>
    <shareFooter @share="shareDialogVisible = true" class="footer"></shareFooter>
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
import shareFooter from '@/components/share_page/share_footer'
import shareHeader from '@/components/share_page/share_header'
import shareMain from '@/components/share_page/share_main'
import quote from '@/components/share_page/quote'
export default {
  components: {
    shareHeader,
    shareFooter,
    shareMain,
    quote,
  },
  data() {
    return {
      loading: false,
      shareContent: '', // 分享内容
      content: Object.create(null), // 文章信息
      userInfo: Object.create(null), // 用户信息
      shareDialogVisible: false, // 分享 dialog
      showQuote: false, // refernces
      nowTime: 0 // refernces
    }
  },
  created() {
    this.getDetail()
  },
  computed: {
  },
  methods: {
    // 获取详情内容
    getDetail() {
      // 无id
      let { id = '' } = this.$route.params
      if (!id) return this.$router.go(-1)
      this.loading = true
      this.$API.shareDetail(id)
        .then(res => {
          if (res.code === 0) {
            this.content = res.data
            this.authorInfo(res.data.uid)
            this.getIpfsData(res.data.hash)
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
    hideClient() {
      this.showQuote = false
    },
    async getArticle(id, popEvent) {
      console.log(id, popEvent)
    },
    copy(val) {
      this.$copyText(val).then(
        () => this.$toast.success({ className: 'toast-zindex2999', duration: 1000, message: this.$t('success.copy') }),
        () => this.$toast.fail({ className: 'toast-zindex2999', duration: 1000, message: this.$t('fail.copy') })
      )
    }
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