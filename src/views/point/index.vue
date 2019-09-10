<template>
  <div class="point">
    <BaseHeader :pageinfo="{ title: '我的积分' }" customize-header-bc="#fff" />
    <van-tabs v-model="active" swipeable color="#542de0">
      <van-tab title="积分任务">
        <task></task>
      </van-tab>
      <van-tab title="积分明细">
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
