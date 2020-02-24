<template>
  <div class="fl comment-input">
    <!-- <avatar :src="avatarSrc" size="40px" class="avatar" /> -->
    <div class="comment-container">
      <el-input
        v-model="comment"
        type="textarea"
        :autosize="{ minRows: 4 }"
        :placeholder="$t('p.commentPointPlaceholder')"
        maxlength="500"
        show-word-limit
        @keyup.native="postCommentKeyup"
      />
      <div class="btn-container fl ac">
        <el-button size="small" class="btn" @click="postComment">
          {{ $t('p.commentPointBtn') }}
        </el-button>
        <span class="btn-des">
          {{ article.comment_pay_point }}
          {{ $t('p.commentPointDes') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    // avatar
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comment: '',
      avatarSrc: ''
    }
  },
  computed: {
    ...mapGetters(['isLogined', 'currentUserInfo'])
  },
  watch: {
    isLogined(val) {
      // 监听登陆 重新获取头像
      if (val && this.currentUserInfo.id) this.getUser(this.currentUserInfo.id)
    }
  },
  mounted() {
    if (this.currentUserInfo.id) this.getUser(this.currentUserInfo.id)
  },
  methods: {
    async getUser(id) {
      // 获取用户头像
      await this.$backendAPI.getUser({ id }).then(res => {
        if (res.status === 200 && res.data.code === 0)
          this.avatarSrc = res.data.data.avatar ? this.$ossProcess(res.data.data.avatar) : ''
      })
    },
    islogin() {
      if (!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return false
      }
      return true
    },
    // 发送评论
    async postComment() {
      if (!this.islogin()) return
      if (!this.comment.trim())
        return this.$toast({ duration: 1000, message: this.$t('p.commentContent') })
      const data = {
        signId: this.article.id,
        comment: this.comment.trim()
      }
      try {
        const res = await this.$API.postPointComment(data)
        if (res.code === 0) {
          this.$toast({ duration: 1000, message: this.$t('p.commentSuccess') })
          this.comment = ''
          this.$emit('doneComment')
        } else this.$toast({ duration: 1000, message: res.message })
      }
      catch(e) {
        console.log(this.$t('p.commentFail'), e)
        this.$toast({ duration: 1000, message: this.$t('p.commentFail') })
      }
    },
    postCommentKeyup(e) {
      // TODO 组合键调用方法 Ctrl or ⌘ + Enter
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
        this.postComment()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-input {
  margin-top: 40px;
  margin-bottom: 40px;
  .avatar {
    margin-right: 20px;
  }
  .btn-container {
    margin-top: 10px;
  }
  .btn-des {
    font-size: 14px;
    font-weight: 400;
    color: #9a9a9a;
    line-height: 20px;
    margin-left: 10px;
  }
  .btn {
    background: #000;
    border-color: #000;
    color: #fff;
    &:hover {
      background: #333;
      border-color: #333;
    }
  }
}
.comment-container {
  // background-color: #fff;
  flex: 1;
  // min-height: 150px;
}
</style>

<style lang="less">
//  评论聚焦颜色
.comment-container .el-textarea__inner:focus {
  border-color: #542de0;
}
</style>
