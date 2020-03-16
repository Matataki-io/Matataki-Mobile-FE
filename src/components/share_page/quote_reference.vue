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
    <!-- <card @getArticle="getArticle" v-for="(item, index) in pull.list" :key="index" :card="item"></card> -->
    <template v-for="(item, index) in pull.list">
      <shareOuterCard
        v-if="item.ref_sign_id === 0"
        :key="index"
        :card="item"
        card-type="read"
        class="list-card"
      />
      <sharePCard
        v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1"
        :key="index"
        :card="item"
        card-type="read"
        class="list-card"
      />
      <shareInsideCard
        v-else-if="item.ref_sign_id && item.channel_id === 3"
        :key="index"
        :card="item"
        card-type="read"
        :toggle-article="true"
        class="list-card"
        @getArticle="getArticle"
      />
    </template>
  </BasePull>
</template>

<script>
// import card from './quote_reference_card.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'

export default {
  components: {
    // card,
    shareOuterCard,
    shareInsideCard,
    sharePCard
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
          pagesize: 20
        },
        apiUrl: 'postsReferences',
        list: []
      },
    }
  },
  created() {
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
.list-card {
  // margin-top: 10px;
  background-color: transparent;
  // &:nth-child(1) {
    // margin-top: 0;
  // }
}

</style>