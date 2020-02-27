<template>
  <div class="bookmark mw">
    <BaseHeader :pageinfo="{ title: $t('user.bookmarks') }" :has-bottom-border-line="true" />
    <ArticlesList :id="Number(id)" ref="ArticlesList" :listtype="'bookmark'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticlesList from '../ArticlesList.vue'

export default {
  name: 'Bookmark',
  components: { ArticlesList },
  props: ['id'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isMe'])
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.bookmark {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}
</style>
