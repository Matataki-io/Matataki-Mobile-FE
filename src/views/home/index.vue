<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <el-select slot="sort" class="head-sort" v-model="value" placeholder="请选择" size="mini" @change="changeSort">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
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
      options: [
        {
          value: 'hot',
          label: '最热文章'
        },
        {
          value: 'now',
          label: '最新文章'
        }
      ],
      value: 'hot',
      pull: {
        params: {
          channel: 1,
          extra: 'short_content'
        },
        autoRequestTime: 0,
        apiUrl: 'homeScoreRanking',
        list: [],
      }
    }
  },
  methods: {
    getListData(res) {
      this.pull.list = res.list
    },
    changeSort(value) {
      if (value === 'hot') {
        this.pull.apiUrl = 'homeScoreRanking'
      } else if (value === 'now') {
        this.pull.apiUrl = 'homeTimeRanking'
      } else {
        this.pull.apiUrl = 'homeScoreRanking'
      }
      this.pull.autoRequestTime = Date.now()
      this.pull.list.length = 0
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