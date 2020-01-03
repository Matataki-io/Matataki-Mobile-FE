<template>
  <div class="share" @click.stop="hideClient">
    <BaseHeader :pageinfo="{title: '分享详情'}" customize-header-bc="#fff" :has-bottom-border-line="true" class="header" />
    <shareHeader></shareHeader>
    <shareMain></shareMain>
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
      shareDialogVisible: false, // 分享 dialog
      showQuote: false, // refernces
      nowTime: 0 // refernces
    }
  },
  computed: {
  },
  methods: {
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
  justify-content: space-between;
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .btn-icon {
    width: 60px;
    height: 60px;
    background: #f9f9f9;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
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