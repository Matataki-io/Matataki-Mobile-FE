<template>
  <footer class="sun-footer">
    <div class="evaluation fl">
      <!-- 推荐、不推荐和积分进度条 -->
      <div class="fl purple-box">
        <div>
          <Progress
            :p="timeCount"
            :clicked="clicked"
          >
            <template slot="text">
              <span
                v-show="!clicked"
                class="center-text"
              >+{{ readPoint }}</span>
              <div
                v-show="type === 'great' || type === 'bullshit'"
                class="has-reward-box"
              >
                <router-link :to="{ name: 'point' }">
                  <span class="has-reward">+{{ points.all }}</span>
                </router-link>
              </div>
            </template>
          </Progress>
        </div>
        <div
          class="icon-center fl"
          :class="renderIconSet('great')"
        >
          <svg-icon
            icon-class="great-solid"
            class="borderless-icon-btn"
            @click="like"
          />
          <p class="tag">
            {{ token && likesFormat }}
          </p>
        </div>
        <div
          class="icon-center fl"
          :class="renderIconSet('bullshit')"
        >
          <svg-icon
            icon-class="bullshit-solid"
            class="borderless-icon-btn"
            @click="dislike"
          />
          <p class="tag">
            {{ token && dislikesFormat }}
          </p>
        </div>
      </div>
      <!-- 引用 -->
      <div class="icon-center icon-set">
        <svg-icon
          icon-class="reference"
          class="borderless-icon-btn"
          @click="pushShare"
        />
      </div>
      <!-- 收藏 -->
      <div
        class="icon-center"
        :class="bookmarkBtnClass"
      >
        <svg-icon
          :icon-class="'bookmark-solid'"
          class="borderless-icon-btn"
          @click="toggleBookmark"
        />
      </div>
      <!-- 分享 -->
      <div class="icon-center icon-set">
        <svg-icon
          icon-class="share2"
          class="borderless-icon-btn"
          @click="$emit('share')"
        />
      </div>
    </div>
  </footer>
</template>

<script>
import Progress from './Progress.vue'
import { isNDaysAgo } from '@/common/methods'

export default {
  name: 'ArticleFooter',
  components: {
    Progress
  },
  props: {
    article: {
      type: Object,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    token: {
      type: Object,
      default: () => ({
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      })
    },
    isBookmarked: {
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
      timeCount: 0,
      timer: null,
      postsIdReadnewStatus: false, // 新文章阅读是否上报
      isReading: false // read接口是否请求完毕
    }
  },
  computed: {
    bookmarkBtnClass() {
      let status = 'icon-set'
      if (this.isBookmarked) {
        status += ' clicked'
      }
      return status
    },
    points() {
      const { points } = this.token
      const pointTypes = {
        // reading: '用户阅读', // 用户阅读
        // beread: '+', // 读者的文章被阅读
        // publish: '+', // 发布文章
        read_new: this.$t('articleFooter.read_new'), // 用户阅读新文章，额外获得的
        // beread_new: '+', // 读者的新文章被阅读，额外获得的
        read_like: this.$t('articleFooter.read_like'), // 读者的新文章被阅读，额外获得的
        read_dislike: this.$t('articleFooter.read_dislike') // 读者的新文章被阅读，额外获得的
      }
      const arr = []
      let all = 0
      points.forEach(item => {
        const { type, amount } = item
        if (pointTypes[type]) {
          all += amount
          arr.push({
            text: pointTypes[type],
            amount
          })
        }
      })
      return {
        all,
        arr
      }
    },
    // 阅读积分
    readPoint() {
      if (this.timeCount >= 150) {
        return 10
      }
      if (this.clicked) {
        return 0
      } else {
        return Math.floor(this.timeCount / 30) * 2
      }
    },
    clicked() {
      // console.log('this.type', this.type)
      return this.type !== 'title'
    },
    type() {
      if (parseInt(this.token.is_liked) === 0) {
        return 'title'
      }
      if (parseInt(this.token.is_liked) === 2) {
        return 'great'
      }
      if (parseInt(this.token.is_liked) === 1) {
        return 'bullshit'
      }
      return 'title'
    },
    likesFormat() {
      if (!this.likes) return 0
      if (this.likes > 9999) { return (this.likes / 10000).toFixed(1) + '万' }
      return this.likes
    },
    dislikesFormat() {
      if (!this.dislikes) return 0
      if (this.dislikes > 9999) { return (this.dislikes / 10000).toFixed(1) + '万' }
      return this.dislikes
    }
  },
  watch: {
    timeCount(v) {
      if (!this.postsIdReadnewStatus && v >= 30) {
        this.postsIdReadnew()
        this.postsIdReadnewStatus = true
      }
      if (v >= 150) {
        clearInterval(this.timer)
      }
    },
    nowTime() {
      this.handleFocus()
      this.$nextTick(() => {
        clearInterval(this.timer)
        this.timer = null
        this.timeCount = 0
        // this.shareCount()
      })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    this.handleFocus()
  },
  methods: {
    getIconStatus(name) {
      return this.type === name
    },
    renderIconSet(name) {
      let status = 'icon-set'
      if (this.getIconStatus(name) || name === 'bookmark') {
        status += ' clicked'
      }
      return status
    },
    handleAlreadyClicked() {
      this.$toast.fail({
        duration: 2000,
        message: '你已经表态了，不能重复表态'
      })
    },
    // 推荐
    like() {
      if (this.clicked) {
        this.handleAlreadyClicked()
        return
      }
      this.$API
        .like(this.article.id, { time: this.timeCount })
        .then(res => {
          if (res.code === 0) {
            clearInterval(this.timer)
            this.token.is_liked = 2
            this.token.points = res.data
            this.likes += 1
            // this.feedbackShow = true
            this.$toast.success({
              duration: 1000,
              message: this.$t('articleFooter.commentDoneMessage')
            })

            // this.getArticleInfoFunc() // 更新文章信息
          } else {
            this.$toast.fail({
              duration: 1000,
              message: `${this.$t('articleFooter.like')}${this.$t('error.fail')}`
            })
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 401) {
            this.$store.commit('setLoginModal', true)
          }
        })
    },
    /* async getArticleInfoFunc() {
      await this.$API.getArticleInfo(this.$route.params.id)
        .then(res => {
          if (res.code === 0) this.article = res.data
        })
    }, */
    // 不推荐
    dislike() {
      if (this.clicked) {
        this.handleAlreadyClicked()
        return
      }
      this.$API
        .dislike(this.article.id, { time: this.timeCount })
        .then(res => {
          if (res.code === 0) {
            clearInterval(this.timer)
            this.token.is_liked = 1
            this.token.points = res.data
            this.dislikes += 1
            // this.feedbackShow = true
            this.$toast.success({
              duration: 1000,
              message: this.$t('articleFooter.commentDoneMessage')
            })

            // this.getArticleInfoFunc() // 更新文章信息
          } else {
            this.$toast.fail({
              duration: 1000,
              message: `${this.$t('articleFooter.unlike')}${this.$t('error.fail')}`
            })
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 401) {
            this.$store.commit('setLoginModal', true)
          }
        })
    },
    async postBackendReading(article) {
      // 阅读接口请求完毕才开始计时
      // 如果推荐/不推荐过 不进行调用
      if (parseInt(article.is_liked) === 1 || parseInt(article.is_liked) === 2) return
      await this.$API
        .reading(article.id)
        .then(res => {
          if (res.code === 0) {
            this.isReading = true
            this.reading()
          }
        })
        .catch(err => {
          console.log('文章 reading err', err)
        })
    },
    postsIdReadnew() {
      const _isNDaysAgo = isNDaysAgo(3, this.article.create_time)
      if (this.article.is_readnew !== 1 && !_isNDaysAgo) {
        // console.log('阅读新文章增加积分')
        this.$API
          .postsIdReadnew(this.article.id, this.timeCount)
          .then(res => {
            if (res.code === 0) {
              this.$toast.success({
                duration: 1000,
                message: this.$t('articleFooter.readNew', [this.$point.readNew])
              })
              // console.log('阅读新文章增加积分成功')
            } else console.log(this.$t('articleFooter.readNewFail'))
          })
          .catch(err => console.log(this.$t('articleFooter.readNewFail'), err))
      }
    },
    reading() {
      if (this.timer === null && !this.likedOrDisLiked) {
        this.timer = setInterval(() => {
          this.timeCount++
          // console.log('计时', this.timeCount)
        }, 1000)
      }
    },
    handleFocus() {
      // https://github.com/hehongwei44/my-blog/issues/184
      window.onfocus = () => {
        // console.log('页面激活')
        clearInterval(this.timer)
        if (this.isReading) this.reading()
      }
      window.onblur = () => {
        // console.log('页面隐藏')
        clearInterval(this.timer)
        this.timer = null
      }
    },
    async toggleBookmark() {
      try {
        if (!this.isBookmarked) {
          const res = await this.$API.bookmark(this.article.id)
          if (res.code === 0) {
            this.isBookmarked = true
          }
        } else {
          const res = await this.$API.unbookmark(this.article.id)
          if (res.code === 0) {
            this.isBookmarked = false
          }
        }
      } catch (err) {
        console.error('ToggleBookmark err', err)
        if (err.response.status === 401) {
          this.$store.commit('setLoginModal', true)
        }
      }
    },
    pushShare() {
      // 优化体验, 大厅取这个key
      sessionStorage.setItem('articleRef', this.$route.params.id)
      this.$router.push({ name: 'sharehall' })
    }
  }
}
</script>

<style scoped lang="less">
.center-icon {
  color: #542de0;
  font-size: 20px;
}
.center-text {
  color: #542de0;
  font-size: 14px;
  font-weight: 700;
}
.has-reward-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.has-reward {
  color: #542de0;
  font-size: 14px;
  font-weight: 700;
}
.evaluation {
  flex: 1;
  height: 37px;
  margin: 8px 0px 8px 15px;
  .purple-box {
    margin-bottom: -6px;
    background: #EBE6FF;
    height: 37px;
    border-radius: 1000px;
    display: inline-flex;
    min-width: 180px;
  }
}
.sun-right-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
}
.sun-btn {
  min-width: 70px;
  border: 1px solid #542de0;
  font-weight: 600;
  color: #542de0;
  background-color: #fff;
  letter-spacing: 1px;
  margin-left: 8px;
  outline: none;
  padding: 6px 5px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 6px;
  .btn-prefix {
    margin-right: 2px;
  }
  &:disabled {
    color: #ffffff;
    background-color: #b2b2b2;
    border: 1px solid #b2b2b2;
  }
  &[bookmarked] {
    color: #ffffff;
    background-color: #b2b2b2;
    border: 1px solid #b2b2b2;
  }
}
.like {
  font-size: 16px;
  font-style: normal;
  margin-left: 4px;
}
.borderless-icon-btn {
  width: 25px;
  height: 25px;
}
.clicked {
  color: rgb(73, 60, 216);
}
.clicked * {
  color: rgb(73, 60, 216);
}
.icon-set p.tag {
  text-align: center;
  // font-size: 18px;
  font-size: 14px;
  font-weight: 700;
  margin-left: 4px;
  line-height: 25px;
  white-space: nowrap;
}
.icon-center {
  margin: auto 10px;
  flex: 1;
  text-align: center;
}
</style>
