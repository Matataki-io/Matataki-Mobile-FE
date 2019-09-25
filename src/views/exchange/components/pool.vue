<template>
  <div class="exchange">
    <van-dropdown-menu style="margin-top: 20px;">
      <van-dropdown-item v-model="vvvv" :options="ooooo" />
    </van-dropdown-menu>
    <van-field
      v-model="inputValue"
      center
      label="存入"
      type="number"
      min="0"
      placeholder="0.0"
      style="margin-top: 20px;"
    >
      <van-button slot="button" size="small" type="info" @click="$store.commit('setSelectTokenModal', true)">RMB</van-button>
    </van-field>
    <van-field
      v-model="outputValue"
      center
      label="存入"
      type="number"
      min="0"
      placeholder="0.0"
      style="margin-top: 20px;"
    >
      <van-button slot="button" size="small" type="info" @click="$store.commit('setSelectTokenModal', true)">
        BAT 
        <van-icon name="arrow-down" />
      </van-button>
    </van-field>
    <div style="text-align:center;margin-top: 20px;">
      <van-button type="primary" size="large">添加流动金</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pool",
  data() {
    return {
      vvvv: 0,
      ooooo: [
        { text: "添加流动金", value: 0 },
        { text: "删除流动金", value: 1 },
        { text: "创建交易所", value: 2 }
      ]
    };
  },
};
</script>

<style lang="less" scoped>
</style>
