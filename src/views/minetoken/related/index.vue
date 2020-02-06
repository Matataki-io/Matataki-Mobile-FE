<template>
  <div class="related mw">
    <BaseHeader :pageinfo="{ title: $t('user.related') }" :has-bottom-border-line="true" />
    <div class="options">
      <Dropdown class="sort dropdown" trigger="click" placement="bottom-start" @on-click="toggleOrdering">
        <div class="dropdown-header" v-if="pull.params.sort === 'popular-desc'">
          按照热度排序
          <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
        </div>
        <div class="dropdown-header" v-else-if="pull.params.sort === 'time-desc'">
          按照时间排序
          <img class="arrow" src="@/assets/newimg/arrow-s.svg" />
        </div>
        <DropdownMenu slot="list">
          <DropdownItem name="popular-desc" :selected="pull.params.sort === 'popular-desc'">
            按照热度排序
          </DropdownItem>
          <DropdownItem name="time-desc" :selected="pull.params.sort === 'time-desc'">
            按照时间排序
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Poptip class="filter" placement="bottom-end">
        <div class="filter-header">
          <img class="filter-icon" src="@/assets/img/filter.svg" />过滤
        </div>
        <div slot="content">
          <CheckboxGroup v-model="checkedFilter" @on-change="handleCheckedFilterChanged">
            <div style="margin-bottom: 8px"><Checkbox label="1" :disabled="checkedFilter.length === 1 && filter === 1"><span style="margin-left: 4px">持票可见</span></Checkbox></div>
            <div><Checkbox label="2" :disabled="checkedFilter.length === 1 && filter === 2"><span style="margin-left: 4px">付费可见</span></Checkbox></div>
          </CheckboxGroup>
        </div>
      </Poptip>
    </div>
    <BasePull
      :url-replace="$route.params.id + ''"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <ArticleCard
        v-for="(item, i) in articles"
        :key="i"
        :article="item"
        type="article"
      />
    </BasePull>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters } from 'vuex'
import ArticleCard from '@/components/ArticleCard.vue'

export default {
  name: 'MinetokenRelated',
  components: {
    ArticleCard
  },
  props: ['id'],
  data() {
    return {
      articles: [],
      pull: {
        apiUrl: 'minetokenRelated',
        params: {
          filter: 3,
          sort: 'time-desc',
          pagesize: 20
        }
      },
      currentPage: 1,
      total: 0,
      checkedFilter: ['1', '2']
    }
  },
  computed: {
    ...mapGetters(['isMe']),
    filter() {
      let result = 0
      for (const item of this.checkedFilter) {
        result |= Number(item)
      }
      return result
    }
  },
  created() {},
  methods: {
    handleCheckedFilterChanged(value) {
      this.onCheckedFilterChanged()
    },
    onCheckedFilterChanged: debounce(function () {
      this.pull.params = {
        filter: this.filter,
        sort: this.pull.params.sort,
        pagesize: 20
      }
    }, 500),
    getListData(res) {
      this.articles = res.list
    },
    toggleOrdering(sort) {
      this.pull.params = {
        filter: this.filter,
        sort,
        pagesize: 20
      }
    }
  }
}
</script>

<style lang="less" scoped>
.related {
  background-color: #f7f7f7;
  padding-bottom: 20px;
  padding-top: 45px;
  min-height: 100%;
}

.options {
  margin: 4px 20px;
  display: flex;
  flex-direction: row;

  .sort {
    flex: 1;

    display: flex;
    align-items: stretch;

    .dropdown-header {
      height: 100%;
      display: flex;
      align-items: center;

      font-size: 14px;

      .arrow {
        margin-left: 4px;
      }
    }
  }

  .filter {
    margin-right: 4px;

    &-header {
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    &-icon {
      width: 24px;
      height: 24px;
    margin: 4px 4px 4px 0;
    }
  }
}
</style>
