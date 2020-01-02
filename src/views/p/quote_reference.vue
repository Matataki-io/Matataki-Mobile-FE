<template>
  <BasePull
    class="container"
    :url-replace="$route.params.id + ''"
    :params="pull.params"
    :api-url="pull.apiUrl"
    :loading-text="$t('not')"
    :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
    :need-access-token="true"
    :auto-request-time="nowTime"
    @getListData="getListData"
  >
    <card @getArticle="getArticle" v-for="(item, index) in pull.list" :key="index" :card="item"></card>
  </BasePull>
</template>

<script>
import card from './quote_reference_card.vue'

export default {
  components: {
    card
  },
  props: {
    nowTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pull: {
        params: {
          pagesize: 10
        },
        apiUrl: 'postsReferences',
        list: []
      },
    }
  },
  created() {
    console.log(121212121212)
  },
  methods: {
    getListData(res) {
      // console.log('res1', res.list)
      this.pull.list = res.list
    },
    getArticle(idInt, popEvent) {
      this.$emit('getArticle', idInt, popEvent)
    }
  }
}
</script>


<style lang="less" scoped>
.container {
  overflow: auto;
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  bottom: 0;
  padding: 0 10px;
}
</style>