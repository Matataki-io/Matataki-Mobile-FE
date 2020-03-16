<template>
  <div class="reward mw">
    <BaseHeader
      :pageinfo="{ title: $t('user.investment') }"
      :has-bottom-border-line="true"
    />
    <ArticlesList
      :id="Number(id)"
      ref="ArticlesList"
      :listtype="'reward'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticlesList from './ArticlesList.vue'

export default {
  name: 'Original',
  components: { ArticlesList },
  props: ['id'],
  data() {
    return {
      playerincome: null,
      editing: false
    }
  },
  computed: {
    ...mapGetters(['isMe'])
  },
  created() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
.reward {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}
</style>
