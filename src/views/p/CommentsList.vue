<template>
  <div>
    <h1 class="comment-title">
      {{ type === 2 ? $t('p.likeList') : $t('p.commentList') }}
      {{ commentLength }}
    </h1>
    <BasePull
      :loading-text="$t('notComment')"
      :params="params"
      :api-url="apiUrl"
      :is-refresh="false"
      :auto-request-time="autoRequestTime"
      :need-access-token="true"
      :is-obj="isObj"
      :immediate-check="false"
      @getListData="getListData"
    >
      <template v-if="type === 2">
        <CommentCard v-for="item in articles" :key="item.uid" :comment="item" :type="type" />
      </template>
      <template v-else>
        <articleCard v-for="item in articles" :key="item.uid" :comment="item" :type="type" />
      </template>
    </BasePull>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentCard from '@/components/comment/CommentCard.vue'
import articleCard from '@/components/comment/article_card.vue'

export default {
  components: { CommentCard, articleCard },
  props: {
    signId: {
      type: Number,
      required: true
    },
    isRequest: {
      type: Boolean,
      required: true
    },
    type: {
      type: Number, // 2是商品 1是文章
      required: true
    },
    commentRequest: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      params: {
        signid: this.signId
      },
      apiUrl: 'commentsList',
      articles: [],
      autoRequestTime: 0,
      timer: null,
      isObj: {
        type: 'newObject',
        key: 'data',
        keys: 'list'
      },
      commentLength: 0
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    signId(newVal) {
      this.params = {
        signid: newVal
      }
    },
    isRequest(newVal) {
      // console.log(newVal)
      if (newVal) {
        this.timer = setInterval(() => {
          if (this.autoRequestTime >= 2) {
            clearInterval(this.timer)
            this.$emit('stopAutoRequest', false)
          }
          this.autoRequestTime += 1
        }, 2000)
      } else {
        clearInterval(this.timer)
      }
    },
    commentRequest(val) {
      this.autoRequestTime = val
    }
  },

  created() {},

  methods: {
    getListData(res) {
      // console.log(res)
      if (
        this.isRequest &&
        res.data.data.length !== 0 &&
        res.data.data[0].author === this.currentUserInfo.name
      ) {
        this.$emit('stopAutoRequest', false)
      }
      this.articles = res.list
      this.commentLength = res.data.data.count
    }
  }
}
</script>

<style lang="less" scoped>
.comment-title {
  font-size: 18px;
  padding: 0;
  margin: 0;
  font-weight: 400;
}
</style>
