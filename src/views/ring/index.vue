<template>
  <ringLayout>
    <el-popover
      slot="sort"
      placement="bottom"
      width="100"
      popper-class="ring-head-popper"
      trigger="click"
    >
      <div>
        <el-checkbox-group v-model="sortCheckList" @change="sortChange">
          <el-checkbox
            class="head-sort-check"
            v-for="(item, idx) in sortList"
            :key="idx"
            :disabled="sortCheckList.length <= 1 && sortCheckList[0] === item.label"
            :label="item.label"
          >{{item.value}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span class="head-sort" slot="reference">
        <i class="el-icon-s-operation"></i>筛选
      </span>
    </el-popover>

    <div class="list">
      <BasePull
        :url-replace="$route.params.id + ''"
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
  </ringLayout>
</template>

<script>
import artcleCard from '@/components/article_card/index.vue'
import ringLayout from '@/components/ring_layout/index.vue'
export default {
  components: {
    ringLayout,
    artcleCard
  },
  data() {
    return {
      sortList: [
        // 3
        {
          label: 'hold',
          value: '持票可见' // 1
        },
        {
          label: 'pay',
          value: '付费可见' // 2
        }
      ],
      sortCheckList: ['hold', 'pay'],
      pull: {
        params: {
          filter: 3,
          sort: 'popular-desc',
          // extra: 'short_content' // 好像接口没有提供这个功能
        },
        autoRequestTime: 0,
        apiUrl: 'minetokenRelated',
        list: []
      }
    }
  },
  methods: {
    sortChange(val) {
      if (val.length >= 2) {
        this.pull.params.filter = 3
      } else {
        if (val[0] === 'hold') this.pull.params.filter = 1
        else if (val[0] === 'pay') this.pull.params.filter = 2
        else this.pull.params.filter = 1
      }
      this.pull.autoRequestTime = Date.now()
      this.pull.list.length = 0
    },
    getListData(res) {
      this.pull.list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.head-sort {
  font-size: 14px;
}
.head-sort-check:nth-child(n + 2) {
  margin-top: 10px;
}
.list {
  padding: 0 20px;
  .list-card {
    margin: 20px 0 0;
  }
}
</style>

<style lang="less">
.ring-head-popper {
  z-index: 99 !important;
}
</style>