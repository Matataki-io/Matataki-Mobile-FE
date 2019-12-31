<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <!-- <el-select slot="sort" class="head-sort" v-model="value" placeholder="请选择" size="mini" @change="changeSort">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select> -->
    <div slot="sort" class="sort">
      <span @click="value = options[0].value" :class="value === options[0].value && 'active'">{{ options[0].label }}</span>
      &nbsp;/&nbsp;
      <span @click="value = options[1].value" :class="value === options[1].value && 'active'">{{ options[1].label }}</span>
    </div>
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
          value: 'now',
          label: '最新文章'
        },
        {
          value: 'hot',
          label: '最热文章'
        },
      ],
      value: 'now',
      pull: {
        params: {
          channel: 1,
          extra: 'short_content'
        },
        autoRequestTime: 0,
        apiUrl: 'homeTimeRanking',
        list: [],
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal === 'hot') {
        this.pull.apiUrl = 'homeScoreRanking'
      } else if (newVal === 'now') {
        this.pull.apiUrl = 'homeTimeRanking'
      } else {
        this.pull.apiUrl = 'homeScoreRanking'
      }
      this.pull.autoRequestTime = Date.now()
      this.pull.list.length = 0
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

.sort {
  display: flex;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    &.active {
      font-weight: bold;
      color: @purpleDark;
    }
  }
}
</style>