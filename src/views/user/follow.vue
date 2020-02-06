<template>
  <userPage>
    <BasePull
      :params="pull.params"
      :api-url="pull.apiUrl"
      :active-index="0"
      :auto-request-time="pull.autoRequestTime"
      :loading-text="pull.loadingText"
      :need-access-token="true"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListDataTab"
    >
      <fansCard
        v-for="(item, i) in pull.list"
        :key="i"
        :card="{
          ...item,
          id: item.fuid
        }"
        class="fans-card"
        type="follow"
      />
    </BasePull>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import fansCard from '@/components/fansCard.vue'

export default {
  components: {
    userPage,
    fansCard
  },
  data() {
    return {
      pull: {
        params: { uid: this.$route.params.id, pagesize: 20 },
        apiUrl: 'followsList',
        list: [],
        loadingText: this.$t('not'),
        autoRequestTime: 0
      }
    }
  },
  methods: {
    getListDataTab(res) {
      // console.log(res)
      this.pull.list = res.list
    }
  }
}
</script>

<style scoped lang="less"></style>
