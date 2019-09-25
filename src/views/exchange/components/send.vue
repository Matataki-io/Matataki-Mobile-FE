<template>
  <div class="exchange">
        <van-field
          v-model="inputValue"
          center
          label="输入"
          type="number"
          min="0"
          placeholder="0.0"
          style="margin-top: 20px;"
        >
          <van-button slot="button" size="small" type="info">￥</van-button>
        </van-field>
        <van-field
          v-model="outputValue"
          center
          label="输出"
          type="number"
          min="0"
          placeholder="0.0"
          style="margin-top: 20px;"
        >
          <van-button slot="button" size="small" type="info">BAT</van-button>
        </van-field>
        <van-field
          v-model="outputValue"
          center
          label="接收人"
          placeholder="0x1234..."
          style="margin-top: 20px;"
        />
        <div style="text-align:center;margin-top: 20px;">
          <van-button type="primary" size="large">发送</van-button>
        </div>
  </div>
</template>

<script>
export default {
  name: "Send",
  data() {
    return {
      inputValue: null,
      outputValue: null,
    };
  }
};
</script>

<style lang="less" scoped>
</style>
