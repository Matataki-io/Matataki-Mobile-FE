<template>
  <div class="share">
    <BaseHeader :pageinfo="{title: '分享详情'}" customize-header-bc="#fff" :has-bottom-border-line="true" />
    <shareHeader></shareHeader>
    <shareMain></shareMain>
    <shareFooter></shareFooter>
  </div>
</template>

<script>
import shareFooter from './share_footer'
import shareHeader from './share_header'
import shareMain from './share_main'
export default {
  components: {
    shareHeader,
    shareFooter,
    shareMain
  }
}
</script>
<style lang="less" scoped>
.share {
  padding-top: 45px;
  min-height: 100%;
  background-color: #fff;
}
</style>