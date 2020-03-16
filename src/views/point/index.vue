<template>
  <div class="point">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: $t('sidebar.account') }"
      customize-header-bc="#fff"
    />
    <accountNav />
    <!-- <task></task> -->
    <point />
  </div>
</template>

<script>
// import task from './components/task.vue'
import point from './components/point.vue'
import accountNav from '@/components/account_nav/index.vue'

export default {
  components: {
    // task,
    accountNav,
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
