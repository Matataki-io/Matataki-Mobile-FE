<template>
  <div class="share-main">
    <svg-icon class="icon" icon-class="quotation_marks" />
    <svg-icon class="icon" icon-class="quotation_marks" />
    <p>{{ content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.share-main {
  margin: 0 20px 140px 20px;
  padding: 0 20px;
  position: relative;
  .icon {
    position: absolute;
    color: @purpleDark;
    font-size: 14px;
    &:nth-child(1) {
      left: 0;
      top: 0;
    }
    &:nth-child(2) {
      bottom: 0;
      right: 0;
      transform: rotate(-180deg);
    }
  }
  p {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding: 0;
    margin: 0;
    word-break: break-word;
  }
}
</style>