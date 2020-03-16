<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: 'Fan票夹' }"
      customize-header-bc="#fff"
    />
    <div class="sort-nav">
      <div
        class="nav-tag"
        @click="switchMode(0)"
      >
        <el-tooltip
          manual
          :value="showTooltip0"
          :content="orderName0"
          placement="top"
          effect="light"
        >
          <p :class="tagNum === 0 && 'active'">
            持有的Fan票
          </p>
        </el-tooltip>
        <span
          v-if="tagNum === 0"
          class="caret-wrapper"
        >
          <i
            class="sort-caret ascending"
            :class="pointLog[0].params.order === 1 && 'active'"
          />
          <i
            class="sort-caret descending"
            :class="pointLog[0].params.order === 2 && 'active'"
          />
        </span>
      </div>
      <div
        class="nav-tag"
        @click="switchMode(1)"
      >
        <el-tooltip
          manual
          :value="showTooltip1"
          :content="orderName1"
          placement="top"
          effect="light"
        >
          <p :class="tagNum === 1 && 'active'">
            持有的流动金
          </p>
        </el-tooltip>
        <span
          v-if="tagNum === 1"
          class="caret-wrapper"
        >
          <i
            class="sort-caret ascending"
            :class="pointLog[1].params.order === 1 && 'active'"
          />
          <i
            class="sort-caret descending"
            :class="pointLog[1].params.order === 2 && 'active'"
          />
        </span>
      </div>
    </div>
    <BasePull
      :params="pointLog[tagNum].params"
      :api-url="pointLog[tagNum].apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="autoRequestTime"
      @getListData="getListData"
    >
      <div v-if="tagNum">
        <holdliquidityCard
          v-for="item in pointLog[tagNum].list"
          :key="item.id"
          :card="item"
        />
      </div>
      <div v-else>
        <tokensCard
          v-for="item in pointLog[tagNum].list"
          :key="item.id"
          :card="item"
        />
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
      autoRequestTime: 0,
      pointLog: [{
        params: {
          pagesize: 20,
          order: 0
        },
        apiUrl: 'tokenTokenList',
        list: []
      },
      {
        params: {
          pagesize: 20,
          order: 0
        },
        apiUrl: 'liquidityLogs',
        list: []
      }
      ],
      orderName0: '',
      orderName1: '',
      showTooltip0: false,
      showTooltip1: false,
      hideCountdown: [
        0,
        0
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
  mounted() {
    setInterval(()=>this.hideTooltip(), 40)
  },
  methods: {
    getListData(res) {
      // console.log(res)
      this.pointLog[this.tagNum].list = res.list
    },
    switchMode(tag) {
      if(this.tagNum !== tag) {
        this['showTooltip' + tag] = false
        this['showTooltip' + (tag + 1) % 2] = false
        this.hideCountdown[tag] = 0
        this.hideCountdown[(tag + 1) % 2] = 0
        this.tagNum = tag
      } else {
        const orderNames = ['创建时间降序', '持仓量升序', '持仓量降序']

        this.hideCountdown[tag] = 35
        this['showTooltip' + tag] = true
        console.log(this.showTooltip0, this.showTooltip1)
        this.pointLog[tag].params.order = (this.pointLog[tag].params.order + 1) % 3
        this['orderName' + tag] = orderNames[this.pointLog[tag].params.order]
        this.autoRequestTime = Date.now()
      }
    },
    hideTooltip() {
      for(let i = 0; i < this.hideCountdown.length; i++) {
        if(this.hideCountdown[i] <= 0 && this['showTooltip' + i] === true) this['showTooltip' + i] = false
        if(this.hideCountdown[i] !== 0) --this.hideCountdown[i]
      }
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
  align-items: center;
  justify-content:space-around;
  .nav-tag {
    display: flex;
    align-items:center;
    width: 108px;
    p {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #b2b2b2;
      line-height: 20px;
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
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    cursor: pointer;
    overflow: visible;
    overflow: initial;
    position: relative;
    .sort-caret {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      position: absolute;
      left: 7px;
      &.ascending {
        border-bottom-color: #c0c4cc;
        top: 5px;
        &.active {
          border-bottom-color: #542de0;
        }
      }
      &.descending {
        border-top-color: #c0c4cc;
        bottom: 7px;
        &.active {
          border-top-color: #542de0;
        }
      }
    }
  }
}
</style>
