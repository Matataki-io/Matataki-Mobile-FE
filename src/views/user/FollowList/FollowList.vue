<template>
  <div class="mw draftbox">
    <BaseHeader :pageinfo="{ title: '' }" :has-bottom-border-line="true" />
    <!-- tabs.less -->
    <div class="tabs">
      <div
        v-for="(item, index) in tabsData"
        :key="index"
        class="tabs-item"
        :class="activeIndex === index && 'active'"
        @click="toggleTabs(index)"
      >
        {{ item.label }}
      </div>
    </div>

    <BasePull
      v-for="(item, index) in tabsData"
      v-show="activeIndex === index"
      :key="index"
      class="draftbox-list"
      :loading-text="item.loadingText"
      :params="item.params"
      :api-url="item.apiUrl"
      :active-index="activeIndex"
      :auto-request-time="item.autoRequestTime"
      :need-access-token="true"
      :now-index="index"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      @getListData="getListData"
    >
      <list
        v-for="(itemList, indexList) in item.articles"
        :key="indexList"
        :list="itemList"
        :index="index"
        :index-list="indexList"
        :owner-id="id"
        @followOrUnfollowUser="followOrUnfollowUser"
      />
    </BasePull>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { error } from 'util'
import list from './list.vue'

export default {
  name: 'DeaftBox',
  components: { list },
  props: ['id', 'listtype'],
  data() {
    return {
      tabsData: [
        {
          label: this.$t('follow'),
          params: { uid: this.id },
          apiUrl: 'followsList',
          articles: [],
          loadingText: this.$t('notFollow'),
          autoRequestTime: 0
        },
        {
          label: this.$t('fans'),
          params: { uid: this.id },
          apiUrl: 'fansList',
          articles: [],
          loadingText: this.$t('notFans'),
          autoRequestTime: 0
        }
      ],
      activeIndex: 0,
      activeIndexName: this.listtype
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  created() {
    if (this.activeIndexName === this.$t('follow')) this.activeIndex = 0
    else if (this.activeIndexName === this.$t('fans')) this.activeIndex = 1
    else this.activeIndex = 0
  },
  methods: {
    toggleTabs(i) {
      this.activeIndex = i

      // 判断是否自动刷新请求数据
      if (this.tabsData[i].autoRequestTime === 0 && this.tabsData[i].articles.length === 0)
        this.tabsData[i].autoRequestTime = Date.now()
    },
    getListData(res) {
      this.tabsData[res.index].articles = res.list
    },
    async followOrUnfollowUser({ id, type, index, indexList }) {
      // console.log(id, type, index, indexList);
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }
      const message = type === 1 ? this.$t('follow') : this.$t('unFollow')
      try {
        let res = null
        if (type === 1) res = await this.$API.follow(id)
        else res = await this.$API.unfollow(id)
        if (res.code === 0) {
          this.$toast.success({
            duration: 1000,
            message: `${message}${this.$t('success.success')}`
          })
          this.followed = type === 1
          let isFollow = this.tabsData[index].articles[indexList].is_follow
          this.tabsData[index].articles[indexList].is_follow = !isFollow
        } else {
          throw error(`${message}${this.$t('error.fail')}`)
        }
        this.$toast.success({ duration: 1000, message: `${message}${this.$t('success.success')}` })
        this.followed = type === 1
      } catch (error) {
        this.$toast.fail({ duration: 1000, message: `${message}${this.$t('error.fail')}` })
        this.$store.commit('setLoginModal', this.$errorHandling.isNoToken(error))
      }
    }
  }
}
</script>
<style scoped lang="less">
.draftbox {
  padding-bottom: 20px;
  padding-top: 45px;
}
.draftbox-list {
  margin: 10px 0 0;
}
</style>
