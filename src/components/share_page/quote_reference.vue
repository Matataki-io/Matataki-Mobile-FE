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
    <div v-for="(item, index) in pull.list" :key="index" class="card">
      <p class="title">{{item.title || '暂无'}}</p>
      <p class="summary">{{item.summary || '暂无'}}</p>
      <!-- <shareOuterCard :card="item" v-if="item.ref_sign_id === 0" cardType="read" class="list-card"></shareOuterCard> -->
      <!-- <sharePCard :card="item" v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1" cardType="read" class="list-card"></sharePCard> -->
      <!-- <shareInsideCard :card="item" v-else-if="item.ref_sign_id && item.channel_id === 3" cardType="read" class="list-card"></shareInsideCard> -->
      <!-- <shareInsideCard cardType="read" v-if="item.type === 'inside'" class="list-card" :key="'shareInsideCard' + index" :idx="index"></shareInsideCard> -->
      <!-- <shareOuterCard cardType="read" v-if="item.type === 'outer'" class="list-card" :key="'shareOuterCard' + index" :idx="index"></shareOuterCard> -->
    </div>
  </BasePull>
</template>

<script>
// import card from './quote_reference_card.vue'
// import shareOuterCard from '@/components/share_outer_card/index.vue'
// import shareInsideCard from '@/components/share_inside_card/index.vue'
// import sharePCard from '@/components/share_p_card/index.vue'

export default {
  components: {
    // card,
    // shareOuterCard,
    // shareInsideCard,
    // sharePCard
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
  margin-top: 20px;
  background-color: transparent;
  &:nth-child(1) {
    margin-top: 0;
  }
}

.card {
  border: 1px solid #dadada;
  margin: 10px 10px 0;
  padding: 10px 10px;
  border-radius: 3px;
  .title {
    color: #000;
  }
  .summary {
    color: #5f5f5f;
  }
}
</style>