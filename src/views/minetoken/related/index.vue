<template>
  <div class="related mw">
    <BaseHeader :pageinfo="{ title: $t('user.related') }" :has-bottom-border-line="true" />
    <div class="options">
      <div class="sort">
      </div>
      <Poptip class="filter" placement="bottom-end">
        <div><img class="filter-icon" src="@/assets/img/filter.svg" /></div>
        <div slot="content">
          <CheckboxGroup v-model="checkedFilter" @on-change="handleCheckedFilterChanged">
            <div style="margin-bottom: 8px"><Checkbox label="1" :disabled="checkedFilter.length === 1 && filter === 1">持币可见</Checkbox></div>
            <div><Checkbox label="2" :disabled="checkedFilter.length === 1 && filter === 2">付费可见</Checkbox></div>
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
          filter: 3
        }
      },
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
        filter: this.filter
      }
    }, 500),
    getListData(res) {
      this.articles = res.list
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
  }

  .filter {
    margin-right: 4px;

    &-icon {
      width: 24px;
      height: 24px;
      margin: 4px 0;
    }
  }
}
</style>
