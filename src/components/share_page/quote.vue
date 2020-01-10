<template>
  <!-- <div v-show="refernceTotal !== 0 || berefernceTotal !== 0"> -->
  <div>
    <div class="quote" :class="show && 'open'" @click.stop ref="quote">
      <div class="quote-head">
        <div class="quote-head__title one" @click.stop="showQuote(0)" :class="(idx === 0 || idx === -1 ) && 'open'">
          <slot name="left-prompt">已引用</slot>
        </div>
        <div class="quote-head__title two" @click.stop="showQuote(1)" :class="idx === 1 && 'open'">
          <slot name="right-prompt">被引用</slot>
        </div>
      </div>
      <slot v-if="idx === 0" name="ref"></slot>
      <slot v-if="idx === 1" name="beref"></slot>
    </div>
    <!-- <div class="full" :class="show && 'open'"></div> -->
  </div>
</template>


<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      idx: -1, // 解决默认第一个不会加载数据bug
      bottom: -306,
      height: 400,
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$refs.quote.style.height = this.height + 'px'
        this.$refs.quote.style.bottom = '50px'
      } else {
        this.$refs.quote.style.height = this.height + 'px'
        this.$refs.quote.style.bottom = this.bottom + 'px'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      let clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      if (!this.$refs.quote) return console.log('not refs quote')
      // 屏幕高度 - header - footer
      let height = ((clientHeight - 42 - 50) / 2)
      if (height > 260) {
        this.height = Math.round(height)
        // footer - refernce
        this.bottom = -(Math.round(height) - 42 -50)
      } else {
        // 260 默认高度
        this.height = 260
        this.bottom = -(260 - 42 -50)
      }
    })
  },
  mounted() {
    this.$nextTick( () => {
      setTimeout(() => {
        this.showQuote(0)
      }, 400)
    })
  },
  methods: {
    showQuote(i) {
      this.idx = i
      this.$emit('showQuote', true)
    },
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
    bottom: 50px;
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