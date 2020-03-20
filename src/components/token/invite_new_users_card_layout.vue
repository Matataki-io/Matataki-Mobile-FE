<template>
  <div class="token-card">
    <div class="token-content">
      <div class="share">
        <div ref="tokenCard">
          <img
            v-if="tokenImg"
            class="img-screenshot"
            :src="tokenImg"
            alt="tokenImg"
          >
          <div v-else>
            <!-- home -->
            <section class="home">
              <!-- background -->
              <img
                class="home-background__left"
                src="@/assets/img/index/top.png"
                alt="matataki home background"
              >
              <img
                class="home-background__right"
                src="@/assets/img/index/bottom.png"
                alt="matataki home background"
              >
              <!-- logo -->
              <img
                class="home-logo"
                src="@/assets/img/index/logo.png"
                alt="logo"
              >
              <img
                class="home-sumary1"
                src="@/assets/img/index/invite_slogan1.png"
                alt="sumary"
              >
              <img
                class="home-sumary2"
                src="@/assets/img/index/invite_slogan2.png"
                alt="sumary"
              >
              <img
                class="home-sumary3"
                src="@/assets/img/index/invite_slogan3.png"
                alt="sumary"
              >
              <!-- btn -->
              <qrcode
                :value="link"
                :options="{ width: '74' }"
                class="code"
              />
              <p class="qrcode-text">
                扫一扫<br>
                进入瞬matataki
              </p>
              <div class="invite-synopsis">
                邀请有奖：<br>
                每成功邀请一名好友注册可得666积分！<br>
                新用户阅读5篇文章（30秒以上）并作出评价视为成功邀请。<br>
                受邀好友每次发文你可以获得额外20积分！<br>
                受邀好友每次阅读获得积分，你可额外获得其总额1/4的积分！<br>
                持有积分未来可共享 瞬Matataki 全平台收益！<br>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <p class="doc">
      如果图片无法下载, 点击保存后长按保存图片
    </p>
    <el-button
      class="save"
      type="primary"
      @click="save"
    >
      保存
    </el-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import html2canvas from 'html2canvas'
import VueQrcode from '@chenfengyuan/vue-qrcode'

var tp = require('tp-js-sdk')

export default {
  components: {
    qrcode: VueQrcode
  },
  props: {
  },
  data() {
    return {
      shareCardCheckedOne: true,
      tokenImg: '',
      loading: null
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo']),
    link() {
      if (process.browser && this.currentUserInfo && this.currentUserInfo.id) return `${window.location.origin}?referral=${this.currentUserInfo.id}`
      return ''
    }
  },
  watch: {
    shareCardCheckedOne() {
      this.tokenImg = ''
    }
  },
  mounted() {
    console.log(document.querySelector('.p-share').offsetLeft)
    console.log(document.querySelector('.p-share').offsetTop)
  },
  methods: {
    save() {
      this.toCanvas('tokenCard')
    },
    saveLocal(canvas) {
      this.tokenImg = canvas.toDataURL()

      if (navigator.userAgent.includes('TokenPocket') && tp.isConnected()) {
        console.log('tp 环境')
        canvas.toBlob(blob => {
          this.$API
            .ossUploadImage('temp', blob)
            .then(res => {
              if (res.code === 0) {
                tp.saveImage({
                  url: this.$ossProcess(res.data)
                })
              } else {
                this.$toast({ duration: 1000, message: '保存失败,请重试' })
              }
              this.loading.close()
            })
            .catch(err => {
              console.log('err', err)
              if (err.response.status === 401) {
                this.$toast({ duration: 1000, message: '请登录后保存图片' })
                this.$store.commit('setLoginModal', true)
              } else this.$toast({ duration: 1000, message: '保存失败,请重试' })
              this.loading.close()
            })
        })
      } else {
        console.log('other 环境')
        const linkTag = document.querySelector('#downloadImg')
        if (linkTag) {
          linkTag.href = canvas.toDataURL()
          linkTag.click()
        } else {
          const link = document.createElement('a')
          link.id = 'downloadImg'
          link.href = canvas.toDataURL()
          link.setAttribute(
            'download',
            `邀请有奖${ Date.now() }.png`
          )
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
        }
        this.loading.close()
      }
    },
    toCanvas(name) {
      this.loading = this.$loading({
        text: `${this.$t('p.createImg')}...`
      })
      const dom = this.$refs[name]
      // eslint-disable-next-line no-undef
      html2canvas(dom, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: dom.clientWidth,
        height: dom.clientHeight
      })
        .then(canvas => {
          this.saveLocal(canvas)
        })
        .catch(error => {
          console.log(error)
          this.$message(this.$t('p.createFail'))
          this.loading.close()
        })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 22px;
  text-align: center;
  padding: 0;
  margin: 40px 0 20px;
}
.token-content {
  display: flex;
  justify-content: space-around;
  margin: 10px 0 20px;
  padding: 0 10px;
}
.share {
  // transform: scale(0.7);
  // height: 600px;
  cursor: pointer;
  transition: border 0.3s;
  box-sizing: border-box;
  border: 2px solid #f1f1f1;
  width: 100%;
  .img-screenshot {
    width: 100%;
  }
}
.check {
  margin: 10px 0 0;
}
.doc {
  font-size: 12px;
  text-align: center;
  margin: 4px 0;
  color: #909090;
}
.save {
  width: 300px;
  display: block;
  margin: 0 auto 20px;
}

.token-style {
  padding: 0 10px;
  margin: 0 0 10px;
  .token-img {
    width: 48%;
    transition: border 0.3s;
    box-sizing: border-box;
    border: 2px solid #f1f1f1;
    overflow: hidden;
    &.active {
      border: 2px solid #542de0;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.home {
  // height: 1078px;
  background-color: #fff;
  position: relative;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 695px;

  .home-background__left,
  .home-background__right {
    position: absolute;
    // height: 100%;
    width: 100%;
    user-select: none;
  }

  .home-background__left {
    top: 0;
    left: 0;
    right: 0;
  }

  .home-background__right {
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-logo {
    width: 56px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-top: 180px;
    margin-bottom: 6px;
  }

  &-sumary1 {
    width: 148px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 26px;
  }
  &-sumary2 {
    width: 224px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 8px;
  }
  &-sumary3 {
    width: 224px;
    margin: 0 auto;
    display: block;
    z-index: 9;
    user-select: none;
    margin-bottom: 26px;
  }
  .qrcode-text {
    text-align: center;
    font-size: 10px;
    font-weight: 600;
    margin-top: 0px;
    margin-bottom: 28px;
    line-height:20px;
  }
  .invite-synopsis {
    font-size: 8px;
    font-weight: 600;
    line-height:20px;
    position: relative;
    padding: 0 30px;
  }
}
</style>
