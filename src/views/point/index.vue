<template>
  <div class="point">
    <BaseHeader :pageinfo="{ title: $t('point.title') }" customize-header-bc="#fff" />
    <van-tabs v-model="active" swipeable color="#542de0">
      <van-tab :title="$t('point.task')">
        <task></task>
      </van-tab>
      <van-tab :title="$t('point.list')">
        <point></point>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import task from './components/task.vue'
import point from './components/point.vue'

export default {
  components: {
    task,
    point
  },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
