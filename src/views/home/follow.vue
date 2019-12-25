<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <div class="list">
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :loading-text="$t('notContent')"
      :auto-request-time="pull.autoRequestTime"
      @getListData="getListData"
    >
      <artcleCard class="list-card" v-for="item in pull.list" :key="item.id" :card="item"></artcleCard>
    </BasePull>
    </div>
  </tab>
</template>


<script>
import artcleCard from '@/components/article_card/index.vue'
import tab from './tab.vue'

export default {
  components: {
    artcleCard,
    tab
  },
  props: {
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pull: {
        params: {
          channel: 1,
          extra: 'short_content'
        },
        autoRequestTime: 0,
        apiUrl: 'followedPosts',
        list: [],
      }
    }
  },
  methods: {
    getListData(res) {
      this.pull.list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.head-sort {
    width: 100px;
  }
.list {
  padding: 0 20px;
  .list-card {
    margin: 20px 0 0;
  }
}
</style>