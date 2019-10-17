<template>
  <div class="publish-tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '发行的粉丝币' }"
      customize-header-bc="#fff"
    />
    <tokensPublish v-if="!isPublishCoins" @publishToken="isPublishCoins = true"></tokensPublish>
    <tokensManage v-else list-type="detail" @notToken="isPublishCoins = false"></tokensManage>
  </div>
</template>

<script>
import tokensManage from './components/tokens_manage_detail.vue'
import tokensPublish from './components/tokens_publish.vue'

export default {
  components: {
    tokensManage,
    tokensPublish
  },
  data() {
    return {
      isPublishCoins: true
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
