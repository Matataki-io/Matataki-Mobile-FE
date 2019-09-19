<template>
  <van-popup v-model="show" style="width:90%;">
    <van-search placeholder="请输入搜索关键词" v-model="search" show-action @search="onSearch">
      <van-button slot="action" @click="onSearch" type="primary" size="small">
        搜索
      </van-button>
    </van-search>
    <van-cell-group class="searchList">
      <van-cell v-for="(item) in list" :key="item.symbol" :title="item.symbol" is-link value=""  @click="handleClick(item.symbol)">
        <span slot="right-icon"></span>
      </van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
export default {
  name: "Pool",
  props: {
    value: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    value(v) {
      this.show = v;
    },
    show(v) {
      this.$emit('input', v);
    }
  },
  data() {
    return {
      show: false,
      search: '',
      list: [
        { symbol: 'RMB' },
        { symbol: 'ETH' },
      ],
      originList: [
        { symbol: 'RMB' },
        { symbol: 'ETH' },
      ],
    };
  },
  methods: {
    onSearch() {
      this.list = [{ symbol: 'RMB' }]
    },
    handleClick(symbol) {
      console.log(symbol)
    }
  }
};
</script>

<style lang="less" scoped>
.searchList {
  overflow-y: auto;
  height: 400px;
}
</style>
