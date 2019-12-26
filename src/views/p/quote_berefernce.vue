<template>
  <div class="container">
    <BasePull
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
  </div>
</template>

<script>
import card from './quote_berefernce_card.vue'

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
        apiUrl: 'postsPosts',
        list: []
      },
    }
  },
  methods: {
    getListData(res) {
      // console.log('res', res)
      let arr = []
      if (res) {
          res.list.map(i => {
          arr.push({
            url: `${process.env.VUE_APP_PC_URL}/p/${i.id}`,
            title: i.title,
          })
        })
        this.pull.list = arr
      }
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