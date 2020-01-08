<template>
  <tab @setIdx="i => $emit('setIdx', i)" :idx="idx">
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :loading-text="''"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <div class="list">
        <fanCard class="list-card" v-for="item in pull.list" :key="item.token_id" :card="item"></fanCard>
        <router-link :to="{name: 'token'}" class="list-card add">
          <svg-icon icon-class="add1" />
          <span>购买Fan票</span>
        </router-link>
      </div>
    </BasePull>
  </tab>
</template>


<script>
import tab from './tab.vue'
import fanCard from '@/components/fan_card/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    tab,
    fanCard
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
          login: null
        },
        apiUrl: 'tokenTokenList',
        list: []
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {
    if (this.isLogined) this.pull.params = {
      pageSize: 20
    } // 登录了才能请求数据, login: null只是为了阻断请求
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
  padding: 0 20px 20px;
  &::after {
    content: "";
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }
  .list-card {
    float: left;
    margin-top: 20px;
    width: calc(50% - 10px);
    height: 222px;
    &:nth-child(2n) {
      margin-left: 20px;
    }
    &.add {
      border: 1px dashed #dbdbdb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 40px;
      color: #dbdbdb;
      overflow: hidden;
      text-decoration: none;
      span {
        font-size: 12px;
        margin: 4px 0 0;
        padding: 0;
        color: #dbdbdb;
      }
    }
  }
}
</style>