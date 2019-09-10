<template>
  <div class="point">
    <BaseHeader
      :pageinfo="{ title: '我的邀请' }"
      customize-header-bc="#fff"
      :has-bottom-border-line="true"
    />
    <point></point>
  </div>
</template>

<script>
import point from './components/point.vue'

export default {
  components: {
    point
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
