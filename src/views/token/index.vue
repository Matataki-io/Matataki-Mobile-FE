<template>
  <div class="token">
    <home-head @login="showSidebar = true" />
    <div class="tokens-list">
      <div class="fl jsb">
        <div class="tokens-list-nav">
          <Dropdown class="dropdown" trigger="click" @on-click="toggleSort">
            <div v-if="sort === 'general'">
              综合排序
            </div>
            <div v-else-if="sort === 'unit-price-desc'">
              单价最高
              <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'unit-price-asc'">
              单价最低
              <img class="arrow reversed" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'liquidity-desc'">
              流动金最高
              <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'liquidity-asc'">
              流动金最低
              <img class="arrow reversed" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'exchange-desc'">
              24h 成交量最高
              <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'exchange-asc'">
              24h 成交量最低
              <img class="arrow reversed" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'name-asc'">
              首字母升序
              <img class="arrow reversed" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'name-desc'">
              首字母降序
              <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'time-asc'">
              时间升序
              <img class="arrow reversed" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <div v-else-if="sort === 'time-desc'">
              时间降序
              <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
            </div>
            <DropdownMenu slot="list">
              <DropdownItem name="general" :selected="sort === 'general'">
                综合排序
              </DropdownItem>
              <DropdownItem name="unit-price-desc" :selected="sort === 'unit-price-desc'">
                单价最高
              </DropdownItem>
              <DropdownItem name="unit-price-asc" :selected="sort === 'unit-price-asc'">
                单价最低
              </DropdownItem>
              <DropdownItem name="liquidity-desc" :selected="sort === 'liquidity-desc'">
                流动金最高
              </DropdownItem>
              <DropdownItem name="liquidity-asc" :selected="sort === 'liquidity-asc'">
                流动金最低
              </DropdownItem>
              <DropdownItem name="exchange-desc" :selected="sort === 'exchange-desc'">
                24h 成交量最高
              </DropdownItem>
              <DropdownItem name="exchange-asc" :selected="sort === 'exchange-asc'">
                24h 成交量最低
              </DropdownItem>
              <DropdownItem name="name-asc" :selected="sort === 'name-asc'">
                首字母升序
              </DropdownItem>
              <DropdownItem name="name-desc" :selected="sort === 'name-desc'">
                首字母降序
              </DropdownItem>
              <DropdownItem name="time-asc" :selected="sort === 'time-asc'">
                时间升序
              </DropdownItem>
              <DropdownItem name="time-desc" :selected="sort === 'time-desc'">
                时间降序
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
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
      sort: this.$route.query.sort || 'general',
      pull: {
        params: {
          pagesize: 20,
          sort: this.$route.query.sort || 'general'
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
      this.sort = name
      this.pull.params.sort = name
      this.$router.replace({
        query: {
          sort: name
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
