<template>
  <Modal
    v-model="widgetModalCopy"
    class="widget"
    width="375"
    class-name="widget-flex"
    :class="widgetModalStatus === 0 ? 'gray' : widgetModalStatus === 4 ? 'transparent' : 'white'"
    footer-hide
    :closable="false"
    @on-visible-change="change"
  >
    <div v-if="widgetModalStatus === 0">
      <div class="widget-content-button">
        <div
          class="widget-button"
          @click="createWidget"
        >
          <div class="widget-button-img">
            <img
              src="@/assets/img/widget/widget.svg"
              alt="widget"
            >
          </div>
          <p>
            {{ $t('p.createWidget') }}
          </p>
        </div>
        <div
          class="widget-button"
          @click="widgetModalStatus = 4"
        >
          <div class="widget-button-img">
            <img
              src="@/assets/img/widget/share.svg"
              alt="widget"
            >
          </div>
          <p>
            {{ $t('p.createLongImg') }}
          </p>
        </div>
        <div
          class="widget-button"
          @click="copyCode(getClipboard)"
        >
          <div class="widget-button-img">
            <img
              src="@/assets/img/widget/link.svg"
              alt="link"
            >
          </div>
          <p>
            {{ $t('p.copyInviteLink') }}
          </p>
        </div>
      </div>
      <SocialShare
        :img="shareInfo.cover"
        :title="getClipboard"
        :link="shareInfo.shareLink"
        :summary="filterStr(shareInfo.content)"
        :qq-title="shareInfo.title"
        :show-tg="true"
        class="social-bt"
      />
    </div>
    <div
      v-if="widgetModalStatus === 1"
      class="widget-writecontent"
    >
      <p class="widget-title">
        {{ $t('p.createWidget') }}
      </p>
      <van-field
        v-model="widgetContent"
        class="widget-textarea"
        type="textarea"
        placeholder="添加简介(选填)"
        rows="4"
        autosize
      />
      <div class="widget-footer">
        <a
          class="help"
          href="javascript:;"
          @click="reviewHelp"
        >
          {{ $t('p.widgetHelp') }}
        </a>
        <a
          class="create"
          href="javascript:;"
          @click="createWidgetContent"
        >{{
          $t('p.createWidget')
        }}</a>
      </div>
    </div>
    <div
      v-if="widgetModalStatus === 2"
      class="widget-help"
    >
      <p class="widget-help-title">
        {{ $t('p.articleWidgetHelp') }}
      </p>
      <p class="widget-help-content">
        {{ $t('p.articleWidgetContent') }}
      </p>
      <br>
      <p class="widget-help-title">
        {{ $t('p.stepTitle') }}
      </p>
      <p class="widget-help-content">
        1.{{ $t('p.stepContent1') }}<br>
        2.{{ $t('p.stepContent2') }}<br>
        3.{{ $t('p.stepContent3') }}<br>
        4.{{ $t('p.stepContent4') }}<br>
      </p>

      <a
        class="widget-help-button"
        href="javascript:;"
        @click="backPage"
      >{{
        $t('p.articleTransferHelpBtn')
      }}</a>
    </div>
    <div
      v-if="widgetModalStatus === 3"
      class="widget-review"
    >
      <p class="widget-title">
        {{ $t('p.widgetView') }}
      </p>
      <div
        class="widget-review-content"
        v-html="widgetContentIframe"
      />
      <p class="widget-review-des">
        {{ $t('p.widgetCopyDes') }}
      </p>
      <van-field
        id="codeIframe"
        v-model="widgetContentIframe"
        class="widget-textarea"
        type="textarea"
        placeholder=""
        rows="4"
        autosize
        @focus="selectValue($event)"
      />
      <div class="widget-footer">
        <a
          class="help"
          href="javascript:;"
          @click="reviewHelp"
        >{{ $t('p.widgetHelp') }}</a>
        <a
          class="create"
          href="javascript:;"
          @click="copyCode(widgetContentIframe)"
        >{{
          $t('p.copyCode')
        }}</a>
      </div>
    </div>
    <div v-if="widgetModalStatus === 4">
      <QRCodeDialog
        :share-info="shareInfo"
        @change="change"
      />
    </div>
  </Modal>
</template>

<script>
import { sleep } from '@/common/methods'
import { strTrim } from '@/common/reg' // 开发用
import QRCodeDialog from './QRCodeDialog'
import SocialShare from '@/components/share/social_share.vue'
// const urlAddress = 'http://localhost:8080'; // 开发用

export default {
  name: 'Widget',
  components: {
    SocialShare,
    QRCodeDialog
  },
  props: ['widgetModal', 'id', 'getClipboard', 'invite', 'shareInfo'],
  data() {
    return {
      widgetModalCopy: this.widgetModal,
      // 0 默认
      // 1 创建widget
      // 2 widget help
      // 3 review widget
      widgetModalStatus: 0,
      oldWidgetModalStatus: 0,
      widgetContent: '',
      widgetContentIframe: ''
    }
  },
  computed: {},
  watch: {
    widgetModalStatus(newVal, oldVal) {
      const urlAddress = process.env.VUE_APP_URL

      // console.log(newVal, oldVal)
      this.oldWidgetModalStatus = oldVal
      // 如果显示创建widget 但是没有内容
      if (newVal === 3 && !this.widgetContent) {
        const invite = this.invite ? `&invite=${this.invite}&referral=${this.invite}` : ''
        this.widgetContentIframe = `<iframe width="100%" height="180" src='${urlAddress}/widget/?id=${this.id}${invite}' frameborder=0></iframe>`
      }
    },
    widgetModal(newVal) {
      this.widgetModalCopy = newVal
    },
    widgetContent(newVal) {
      const urlAddress = process.env.VUE_APP_URL

      let content = ''
      const invite = this.invite ? `&invite=${this.invite}&referral=${this.invite}` : ''
      // 去前后空格防止空内容
      if (strTrim(newVal)) content = `&content=${newVal}`
      this.widgetContentIframe = `<iframe width="100%" height="180" src='${urlAddress}/widget/?id=${this.id}${content}${invite}' frameborder=0></iframe>`
    }
  },
  methods: {
    createWidget() {
      this.widgetModalStatus = 1
    },
    reviewHelp() {
      this.widgetModalStatus = 2
    },
    backPage() {
      this.widgetModalStatus = this.oldWidgetModalStatus
    },
    createWidgetContent() {
      this.widgetModalStatus = 3
    },
    copyCode(code) {
      this.$copyText(code).then(
        () => {
          this.$toast.success({
            duration: 1000,
            message: this.$t('success.copy')
          })
        },
        () => {
          this.$toast.fail({
            duration: 1000,
            message: this.$t('error.copy')
          })
        }
      )
    },
    selectValue() {
      event.currentTarget.select()
    },
    resetStatus() {
      this.widgetModalStatus = 0
      this.widgetContent = ''
      this.widgetContentIframe = ''
    },
    async change(status) {
      // console.log(status)
      this.widgetModalCopy = status
      this.$emit('changeWidgetModal', status)
      await sleep(300)
      !status && this.resetStatus()
    },
    filterStr(str) {
      let re = /<[^>]+>/gi
      str = str.replace(re, '')
      return str
    },
  }
}
</script>

<style lang="less">
/*样式覆盖*/
.widget {
  &.gray .ivu-modal-content {
    background-color: #f1f1f1;
  }
  &.white .ivu-modal-content {
    background-color: #fff;
  }
  &.transparent .ivu-modal-content {
    background-color: transparent;
    box-shadow: none;
  }
}
// .widget-flex {
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   .ivu-modal {
//     top: 0;
//   }
// }
</style>
<style src="./index.less" scoped lang="less"></style>
