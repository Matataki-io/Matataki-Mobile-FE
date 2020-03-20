<template>
  <div class="point">
    <BaseHeader
      :pageinfo="{ title: $t('invite.headerTitle') }"
      customize-header-bc="#fff"
      :has-bottom-border-line="true"
    />
    <point />
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
