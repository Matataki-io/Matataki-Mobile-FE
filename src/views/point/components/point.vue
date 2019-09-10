<template>
  <div class="point-list">
    <div class="point-head fl fl-ac fl-js">
      <span class="point-title">积分余额</span>
      <span class="point-money">{{ point.res.amount }}</span>
    </div>
    <!-- 列表 -->
    <BasePull
      :key="index"
      :params="point.params"
      :api-url="point.apiUrl"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'logs' }"
      :auto-request-time="point.autoRequestTime"
      :need-access-token="true"
      loading-text="无邀请"
      @getListData="getListData"
    >
      <pointCard
        v-for="itemChild in point.list"
        :key="itemChild.create_time"
        :asset="itemChild"
      ></pointCard>
    </BasePull>
  </div>
</template>

<script>
import pointCard from '@/components/point_card/index.vue'

export default {
  components: {
    pointCard
  },
  data() {
    return {
      point: {
        params: {},
        apiUrl: 'userPoint',
        list: [],
        autoRequestTime: 0,
        timer: null,
        res: {
          amount: 0,
          count: 0
        }
      }
    }
  },
  created() {},
  methods: {
    getListData(res) {
      this.point.res.amount = res.data.data.amount
      this.point.res.count = res.data.data.count
      this.point.list = res.list
    }
  }
}
</script>

<style lang="less" scoped src="./point.less"></style>
