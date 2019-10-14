<template>
  <footer class="sun-footer">
    <div class="progress">
      <Progress :p="timeCount" :clicked="clicked">
        <template slot="text">
          <span v-show="!clicked" class="center-text">+ {{ readPoint }}</span>
          <div v-show="type === 'great' || type === 'bullshit'" class="has-reward-box">
            <router-link :to="{ name: 'point' }">
              <span class="has-reward">{{ $t('articleFooter.received') }}{{ points.all }}</span>
            </router-link>
          </div>
          <!-- <svg-icon v-show="type==='great'" icon-class="great-solid" class="center-icon" /> -->
          <!-- <svg-icon v-show="type==='bullshit'" icon-class="bullshit-solid" class="center-icon" /> -->
        </template>
      </Progress>
    </div>
    <div class="sun-right-btns">
      <button class="sun-btn" :disabled="clicked" @click="like">
        <svg-icon v-if="!clicked" icon-class="great-solid" class="btn-prefix" />
        <span
          >{{ clicked ? $t('articleFooter.likes') : $t('articleFooter.like') }}
          {{ token && token.likes }}</span
        >
      </button>
      <button class="sun-btn" :disabled="clicked" @click="dislike">
        <svg-icon icon-class="bullshit-solid" class="btn-prefix" />
        <span>{{ $t('articleFooter.unlike') }} {{ token && token.dislikes }}</span>
      </button>
      <button class="sun-btn" @click="$emit('share')">
        <img src="@/assets/newimg/share.svg" class="btn-prefix" />
        {{ $t('share') }}
      </button>
    </div>
  </footer>
</template>

<script>
import Progress from './Progress'
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
    token: {
      type: Object,
      default: () => ({
        points: [],
        dislikes: 0,
        likes: 0,
        is_liked: 0
      })
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
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    this.handleFocus()
  },
  methods: {
    // 推荐
    like() {
      this.$backendAPI
        .like(this.article.id, this.timeCount)
        .then(response => {
          // console.log(response)
          let res = response.data
          if (res.code === 0) {
            clearInterval(this.timer)
            this.token.is_liked = 2
            this.token.points = res.data
            this.token.likes += 1
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
      this.$backendAPI
        .dislike(this.article.id, this.timeCount)
        .then(response => {
          // console.log(response)
          let res = response.data
          if (res.code === 0) {
            clearInterval(this.timer)
            this.token.is_liked = 1
            this.token.points = res.data
            this.token.dislikes += 1
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
      await this.$backendAPI
        .reading(article.id)
        .then(response => {
          let res = response.data
          if (res.code === 0) {
            this.isReading = true
            this.reading()
            // console.log('reading done')
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
        this.$backendAPI
          .postsIdReadnew(this.article.id, this.timeCount)
          .then(response => {
            let res = response.data
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
  font-size: 18px;
  font-weight: 700;
}
.has-reward-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.has-reward {
  color: #542de0;
  font-size: 12px;
  font-weight: 700;
}
.progress {
  position: absolute;
  z-index: 100;
  left: 5px;
  top: -15px;
  padding: 5px;
  background-color: #ffffff;
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
}
.like {
  font-size: 16px;
  font-style: normal;
  margin-left: 4px;
}
</style>
