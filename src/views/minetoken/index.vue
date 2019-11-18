<template>
  <div class="publish-tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '发行的粉丝通证' }"
      customize-header-bc="#fff"
    />
    <minetoken></minetoken>
  </div>
</template>

<script>
import minetoken from './components/tokens_manage_layout.vue'

export default {
  components: {
    minetoken
  },
  data() {
    return {
      isPublishCoins: false
    }
  },
  methods: {}
}
</script>

<style scoped>
.publish-tokens {
  background-color: #fff;
  padding-top: 45px;
  min-height: 100%;
}
</style>
