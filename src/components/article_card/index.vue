<template>
  <div class="card">
    <div class="card-head">
      <router-link
        :to="{name: 'user-id', params: {id: card.uid}}"
        class="card-head__info"
      >
        <avatar
          class="info-avatar"
          :src="avatar"
        />
        <span>{{ card.nickname || card.author }}</span>
      </router-link>
      <span class="card-head__time">{{ friendlyDate }}</span>
    </div>
    <router-link
      class="card-link"
      :to="{name: 'p-id', params: {id: card.id}}"
    >
      <p
        class="card-title search-res"
        v-html="xssTitle"
      />
      <p
        v-if="xssContent"
        class="card-content search-res"
        v-html="xssContent"
      />
      <div class="card-footer">
        <div class="card-footer__lock">
          <img
            v-if="card.require_holdtokens || card.require_buy"
            class="lock-img"
            src="@/assets/img/lock.png"
            alt="lock"
          ><span class="lock-text">{{ lock }}</span>
        </div>
        <div class="card-footer__info">
          <div>
            <svg-icon icon-class="eye" />
            {{ card.read }}
          </div>
          <div>
            <svg-icon icon-class="like1" />
            {{ card.likes }}
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
import { isNDaysAgo } from '@/common/methods'

import clampy from '@clampy-js/vue-clampy'
import moment from 'moment'
import { precision } from '@/utils/precisionConversion'
import { filterOutHtmlTags } from '@/utils/xss'

export default {
  components: {
    avatar
  },
  directives: {
    clampy
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    xssTitle() {
      if (this.card.title) {
        return filterOutHtmlTags(this.card.title, {
          em: []
        })
      } else return ''
    },
    xssContent() {
      if (this.card.short_content) {
        return filterOutHtmlTags(this.card.short_content, {
          em: []
        })
      } else return ''
    },
    avatar() {
      return this.card.avatar ? this.$ossProcess(this.card.avatar, {h: 60}) : ''
    },
    friendlyDate() {
      const time = moment(this.card.create_time)
      return isNDaysAgo(2, time) ? time.format('MMMDo HH:mm') : time.fromNow()
    },
    lock() {
      if (this.card.pay_symbol) {
        return `${precision(this.card.pay_price, 'CNY', this.card.pay_decimals)} ${this.card.pay_symbol}`
      } else if (this.card.token_symbol) {
        return `${precision(this.card.token_amount, 'CNY', this.card.token_decimals)} ${this.card.token_symbol}`
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__info {
      display: flex;
      align-items: center;
      flex: 1;
      span {
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 17px;
        margin-left: 5px;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .info-avatar {
      width: 30px !important;
      height: 30px !important;
    }

    &__time {
      font-size: 12px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 17px;
    }
  }

  &-link {
    display: inline-block;
    text-decoration: none;
    width: 100%;
  }
  &-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    line-height: 22px;
    margin: 10px 0 5px;
    max-height: 46px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-content {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    max-height: 36px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__info {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 17px;
      & > div {
        margin-left: 16px;
        &:nth-child(1) {
          margin-left: 0;
        }
      }
    }
    &__lock {
      display: flex;
      align-items: center;
    }
    .lock-img {
      width: 16px;
    }
    .lock-text {
      color: #b2b2b2;
      font-size: 12px;
      line-height: 22px;
      margin: 0 0 0 4px;
      font-weight: bold;
    }
  }
}
</style>

<style lang="less">
.search-res em {
  font-weight: bold;
  font-style: normal;
  color: @purpleDark;
}
</style>
