<template>
  <searchLayout :params="params" api-url-path="searchArticleList" />
</template>

<script>
import searchLayout from './layout.vue'

export default {
  components: {
    searchLayout
  },
  data() {
    return {
      params: {
        channel: 2,
        type: 'post'
      }
    }
  }
}
</script>
