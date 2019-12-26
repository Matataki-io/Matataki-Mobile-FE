<template>
  <div v-if="refernceTotal !== 0 || berefernceTotal !== 0">
    <div class="quote" :class="show && 'open'" @click.stop>
      <div class="quote-head">
        <div class="quote-head__title one" @click.stop="showQuote(0)" :class="idx === 0 && 'open'">
          已引用<span>{{refernceTotal}}</span>
        </div>
        <div class="quote-head__title two" @click.stop="showQuote(1)" :class="idx === 1 && 'open'">
          被引用<span>{{berefernceTotal}}</span>
        </div>
      </div>
      <quoteRefernce :nowTime="nowTime" @getArticle="getArticle" ref="quoteRefernce" v-if="idx === 0"></quoteRefernce>
      <quoteBerefernce :nowTime="nowTime"  @getArticle="getArticle" ref="quoteBerefernce" v-if="idx === 1"></quoteBerefernce>
    </div>
    <div class="full" :class="show && 'open'"></div>
  </div>
</template>


<script>
import quoteRefernce from './quote_refernce'
import quoteBerefernce from './quote_berefernce'
export default {
  components: {
    quoteRefernce,
    quoteBerefernce
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    nowTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      idx: 0,
      refernceTotal: 0,
      berefernceTotal: 0,
    }
  },
  watch: {
    nowTime() {
      this.getRefernceCount('postsReferences', {}, 'refernce')
      this.getRefernceCount('postsPosts', {}, 'berefernce')
    }
  },
  created() {
    this.getRefernceCount('postsReferences', {}, 'refernce')
    this.getRefernceCount('postsPosts', {}, 'berefernce')
  },
  mounted() {
  },
  methods: {
    showQuote(i) {
      this.idx = i
      this.$emit('showQuote', true)
    },
    async getRefernceCount(url, params, type) {
      try {
        const res = await this.$backendAPI.getBackendData({ url, params, urlReplace: this.$route.params.id }, false)
        if (res.status === 200 && res.data.code === 0) {
          if (type === 'refernce') this.refernceTotal = res.data.data.count
          else if (type === 'berefernce') this.berefernceTotal = res.data.data.count
          else this.refernceTotal = res.data.data.count
        } else console.log(res.message)
      } catch (error) { console.log(error) }
    },
    getArticle(idInt, popEvent) {
      this.$emit('getArticle', idInt, popEvent)
    }
  }
}
</script>

<style lang="less" scoped>
.quote {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -306px;
  height: 400px;
  background: #fff;
  border-top: 1px solid #DBDBDB;
  z-index: 1;
  transition: all .3s;
  &.open {
    bottom: 54px;
  }
}

.quote-head {
  display: flex;
  margin: 0 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  &__title {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size:14px;
    font-weight:500;
    color:rgba(0,0,0,1);
    height: 40px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    box-sizing: border-box;
    border-bottom: 1px solid #DBDBDB;
    position: relative;
    &.one {
      &.open {
        &::after {
          border-radius: 0 8px 0 0;
          border-right: 1px solid #dbdbdb;
          transform: rotate(-36deg);
          right: -3px;
          top: -1px;
        }
      }
    }
    &.two {
      &.open {
        &::after {
          border-radius: 8px 0 0 0;
          border-left: 1px solid #dbdbdb;
          transform: rotate(36deg);
          left: -3px;
          top: -1px;
        }
      }
    }
    span {
      color: #542DE0;
      margin-left: 4px;
    }
    &.open {
      border-bottom: 1px solid transparent;
      &::after {
        content: '';
        display: block;
        width: 40px;
        height: 100px;
        background-color: #fff;
        position: absolute;
      }
    }
  }
}

.full {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  display: none;
  transition: all .2s;
  &.open {
    display: block;
    background-color: rgba(0,0,0,.4);
  }
}
</style>