<template>
  <div
    class="buy-block"
    @click="jumpPage(buy.sign_id)"
  >
    <div class="head">
      <span class="date">{{ buyTime }}</span>
      <span class="des">{{ $t('user.transactionComplete') }}</span>
    </div>

    <div class="container">
      <div class="cover">
        <img
          v-if="buyCover"
          v-lazy="buyCover"
          :src="buyCover"
          alt="cover"
        >
      </div>
      <div class="info">
        <p
          v-clampy="2"
          class="title"
        >
          {{ buy.title }}
        </p>
        <p class="money">
          {{ $t('user.unitPrice') }}
          {{ buyPrice }}{{ buy.symbol }}
          &nbsp;&nbsp;
          {{ $t('user.totalPrice') }}
          {{ buyAmount }}{{ buy.symbol }}
        </p>
      </div>
    </div>

    <div
      v-for="(item, index) in buy.digital_copy"
      :key="index"
      class="copy"
    >
      <span>{{ item }}</span>
      <svg-icon
        class="icon"
        icon-class="copy"
        @click.stop="copyText(item)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import clampy from '@clampy-js/vue-clampy'
import Vue from 'vue'
import { precision } from '@/common/precisionConversion'

Vue.use(clampy)
export default {
  name: 'BuyCard',
  directives: {
    clampy
  },
  props: {
    buy: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    buyAmount() {
      return precision(this.buy.amount, this.buy.symbol)
    },
    buyPrice() {
      return precision(this.buy.price, this.buy.symbol)
    },
    buyTime() {
      return moment(this.buy.create_time).format('lll')
    },
    buyCover() {
      return this.buy.cover ? this.$ossProcess(this.buy.cover) : ''
    }
  },
  methods: {
    copyText(text) {
      this.$copyText(text).then(
        () => {
          this.$toast.success({ duration: 1000, message: this.$t('sucess.copy') })
        },
        () => {
          this.$toast.fail({ duration: 1000, message: this.$t('sucess.fail') })
        }
      )
    },
    jumpPage(id) {
      this.$router.push({ name: 'p-id', params: { id: id } })
    }
  }
}
</script>

<style lang="less" scoped>
.buy-block {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  margin: 0 0 10px 0;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .date {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 17px;
  }
  .des {
    font-size: 12px;
    font-weight: 400;
    color: #542de0;
    line-height: 17px;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px 0;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #eee;
  .cover {
    flex: 0 0 120px;
    width: 120px;
    height: 60px;
    background-color: #eee;
    border-radius: 6px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    flex: 1;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 0 10px;
    overflow: hidden;
    .title {
      font-size: 14px;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 18px;
      overflow: hidden;
    }
    .money {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 17px;
      text-align: right;
      width: 100%;
    }
  }
}
.copy {
  background: #f1f1f1;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin: 20px 0 0;
  span {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    padding: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon {
    width: 14px;
    height: 14px;
    color: #542de0;
    flex: 0 0 14px;
  }
}
</style>
