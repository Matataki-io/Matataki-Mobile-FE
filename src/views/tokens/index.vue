<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: 'Fan票夹' }"
      customize-header-bc="#fff"
    />
    <div class="sort-nav">
      <a :class="tagNum === 0 && 'active'" @click="tagNum = 0">
        持有的Fan票
      </a>
      <a :class="tagNum === 1 && 'active'" @click="tagNum = 1">
        持有的流动金
      </a>
    </div>
    <BasePull
      :params="pointLog[tagNum].params"
      :api-url="pointLog[tagNum].apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      @getListData="getListData"
    >
      <div v-if="tagNum">
        <holdliquidityCard v-for="item in pointLog[tagNum].list" :key="item.id" :card="item" />
      </div>
      <div v-else>
        <tokensCard v-for="item in pointLog[tagNum].list" :key="item.id" :card="item" />
      </div>
    </BasePull>
  </div>
</template>

<script>
import tokensCard from '@/components/tokens_card/tokens_card.vue'
import holdliquidityCard from '@/components/tokens_card/holdliquidity_card.vue'

export default {
  components: {
    tokensCard,
    holdliquidityCard
  },
  data() {
    return {
      tagNum: Number(this.$route.query.tab) || 0,
      pointLog: [{
        params: {
          pageSize: 20
        },
        apiUrl: 'tokenTokenList',
        list: []
      },
      {
        params: {
          pageSize: 20
        },
        apiUrl: 'liquidityLogs',
        list: []
      }
      ]
    }
  },
  watch: {
    tagNum(val) {
      // this.$emit('input', val)
      const query = { ...this.$route.query }
      query.tab = val
      this.$router.replace({
        query
      })
    },
  },
  methods: {
    getListData(res) {
      // console.log(res)
      this.pointLog[this.tagNum].list = res.list
    }
  }
}
</script>

<style lang="less" scoped>
.tokens {
  background-color: #fff;
  padding-top: 45px;
  min-height: 100%;
}
.sort-nav {
  padding: 12px 60px;
  text-align: center;
  border-bottom: 1px solid #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #b2b2b2;
    line-height: 20px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    &.active {
      color: #000;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        background: #542de0;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 1px;
        z-index: 0;
      }
    }
  }
}
</style>
