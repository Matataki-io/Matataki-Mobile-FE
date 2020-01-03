<template>
  <div class="share" @click.stop="hideClient">
    <BaseHeader :pageinfo="{title: '分享详情'}" customize-header-bc="#fff" :has-bottom-border-line="true" />
    <shareHeader></shareHeader>
    <shareMain></shareMain>
    <quote :show="showQuote" :nowTime="nowTime" @showQuote="status => showQuote = status" @getArticle="getArticle"></quote>
    <shareFooter class="footer"></shareFooter>
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
    quote
  },
  data() {
    return {
      showQuote: false, // refernces
      nowTime: 0 // refernces
    }
  },
  methods: {
    hideClient() {
      this.showQuote = false
    },
    async getArticle(id, popEvent) {
      console.log(id, popEvent)
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
.footer {
  z-index: 99;
}
</style>