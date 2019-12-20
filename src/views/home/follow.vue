<template>
  <homeLayout>
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
  </homeLayout>
</template>


<script>
import artcleCard from '@/components/article_card/index.vue'
import homeLayout from '@/components/home/home_layout.vue'

export default {
  components: {
    artcleCard,
    homeLayout
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