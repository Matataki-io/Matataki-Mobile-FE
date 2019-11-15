<template>
  <div class="token">
    <home-head @login="showSidebar = true" />
    <div class="tokens-list">
      <div class="fl jsb">
        <nav class="tokens-list-nav">
          <div :class="sort === 'id' && 'active'" @click="toggleSort('id')">
            发布顺序
          </div>
          <div :class="sort === 'symbol' && 'active'" @click="toggleSort('symbol')">
            字母顺序
          </div>
        </nav>
        <a class="help-link" href="https://www.matataki.io/p/977" target="_blank">什么是粉丝币?</a>
      </div>
    </div>

    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <tokenCard v-for="(item, index) in pull.list" :key="index" :card="item" />
    </BasePull>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
// import avatar from '@/components/avatar/index.vue'
import homeHead from '../home/components/homeHead.vue'
import tokenCard from '@/components/token_card/index.vue'
// import userPagination from '@/components/user/user_pagination.vue'
import Sidebar from '@/components/Sidebar/index.vue'

export default {
  components: {
    // avatar,
    tokenCard,
    homeHead,
    Sidebar
    // userPagination
  },
  data() {
    return {
      showSidebar: false,
      sort: this.$route.query.id || 'id',
      pull: {
        params: {
          pagesize: 20,
          sort: this.$route.query.sort || 'id-desc'
        },
        apiUrl: 'tokenAll',
        list: []
      },
      loading: false, // 加载数据
      total: 0,
      assets: {},
      viewStatus: 0, // 0 1
      amount: 0
    }
  },
  computed: {},
  methods: {
    toggleSort(name) {
      if (name === 'id') {
        this.sort = 'id'
        this.pull.params.sort = this.pull.params.sort === 'id-desc' ? 'id-asc' : 'id-desc'
      } else {
        this.sort = 'symbol'
        this.pull.params.sort =
          this.pull.params.sort === 'symbol-desc' ? 'symbol-asc' : 'symbol-desc'
      }
      this.$router.replace({
        query: {
          id: this.sort,
          sort: this.pull.params.sort
        }
      })
    },
    getListData(res) {
      this.pull.list = res.list
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
