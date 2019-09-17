<template>
  <searchLayout :params="params" api-url-path="searchUserList" />
</template>

<script>
import searchLayout from './layout.vue'

export default {
  components: {
    searchLayout
  },
  data() {
    return {
      params: {}
    }
  }
}
</script>
