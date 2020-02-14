<template>
  <div class="outer">
    <div ref="container" :class="{ 'white-bg': !canvas }">
      <div ref="capture">
        <div v-if="!canvas" class="container">
          <div class="header">
            <div style="height: 24px;"></div>
            <div class="info">
              <img class="avatar" :src="shareInfo.avatar" alt="" :onerror="defaultAvatar" />
              <span class="username">{{ shareInfo.name }}</span>
            </div>
            <p v-clampy="2">
              {{ shareInfo.title }}
            </p>
            <div v-if="shareInfo.cover" class="full" />
            <div v-if="shareInfo.cover" :style="coverImage" class="cover" />
          </div>
          <div class="content-container">
            <p v-clampy="8" class="markdown-body" v-html="htmlStr" />
          </div>
          <div class="hide-article-box">
            <span>—— {{ $t('p.sweepCodeView') }} ——</span>
          </div>
          <section class="footer">
            <div class="flex">
              <img class="logo" src="@/assets/img/share_logo.png" alt="logo" />
              <!-- <div ref="qr" class="qrcode" /> -->
              <canvas ref="qr" class="qrcode" width="80" height="80"></canvas>
            </div>
            <img class="des" src="@/assets/img/des_logo.png" alt="logo" />
          </section>
        </div>
        <img v-else :src="canvas" alt="" style="width: 100%;" />
      </div>
    </div>
    <!-- <button v-if="canvas" class="save-btn" disabled>{{ $t('p.pressImgSave') }}</button> -->
    <div class="save-content">
      <button class="save-btn" @click="toCanvas">{{ $t('p.createImg') }}</button>
      <p class="doc">如果图片无法下载, 点击保存后长按保存图片</p>
      <button class="save-btn close" @click="close">{{ $t('close') }}</button>
    </div>

    <!--<a
      :class="['save-btn', { disabled: isAPP }]"
      download="smartsignature.png"
      :href="downloadLink"
      :disabled="isAPP"
      @click="close"
      >{{ isAPP ? '长按图片保存' : '保存' }}
    </a>-->
  </div>
</template>

<script>
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { xssFilter } from '@/common/xss'

var tp = require('tp-js-sdk')

export default {
  name: 'QRCodeDialog',
  props: {
    shareInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      canvas: null,
      coverImage: {
        backgroundImage: `url(${this.shareInfo.cover})`
      },
      loading: null
    }
  },
  computed: {
    isAPP() {
      return /Edge|Firefox|Opera|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
    htmlStr() {
      // TODO:这边感觉有点问题, 只优先完成了 保留换行和去掉img引起的空行
      let filterStrRes = this.filterStr(this.shareInfo.content)
      let removeSpaceRes = this.removeSpace(filterStrRes)
      return xssFilter(removeSpaceRes.substr(0, 400))
    },
    QRCode: QRCode
  },
  watch: {},
  mounted() {
    this.genQRCode()
    // console.log(this.isAPP)
  },
  beforeDestroy() {
    // 离开删除插入的a dom
    let downloadImg = document.querySelector('#downloadImg')
    if (downloadImg) downloadImg.remove()
  },
  methods: {
    filterStr(str) {
      let re = /<[^>]+>/gi
      str = str.replace(re, '')
      return str
    },
    removeSpace(str) {
      return str.replace(/\n\s*\n/gi, '\n')
    },
    close() {
      this.$emit('change', false)
    },
    saveLocal(canvas) {
      this.canvas = canvas.toDataURL()
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
            `${(this.shareInfo && this.shareInfo.title) || Date.now()}.png`
          )
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
        }
        this.loading.close()
      }
    },
    toCanvas() {
      this.loading = this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        zIndex: 1200,
        message: 'loading...'
      })
      html2canvas(this.$refs.capture, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      })
        .then(canvas => {
          this.saveLocal(canvas)
        })
        .catch(error => {
          console.log(error)
          this.$toast(this.$t('close'))
          this.loading.close()
        })
    },
    genQRCode() {
      QRCode.toCanvas(this.$refs.qr, this.shareInfo.shareLink, { width: 80 }, error => {
        if (error) console.error(error)
        // console.log('success!')
        //this.toCanvas()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@purpleDark: #542de0;
.markdown-body {
  font-size: 14px;
  color: #000000;
}
.white-bg {
  background: #ffffff;
  width: 100%;
  margin: auto;
}
.outer {
  // margin-top: 100px;
}
.hide-article-box {
  width: 100%;
  background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 70%);
  padding-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 9999;
  padding-top: 70px;
  bottom: 2px;
  margin-top: -120px;
  color: #b2b2b2;
  font-size: 14px;
}
.save-btn {
  font-size: 14px;
  color: #ffffff;
  border-radius: 6px;
  border: none;
  background: #542de0;
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 auto;
  user-select: none;
  &.disabled {
    background: #b2b2b2;
  }
  &:disabled {
    background: #b2b2b2;
  }
  &.close {
    background: #b2b2b2;
  }
}
.container {
  width: 100%;
  margin: auto;
}
.header {
  height: 167px;
  background-color: #542de0;
  position: relative;
  overflow: hidden;
  .info {
    display: flex;
    align-items: center;
    z-index: 10;
    position: relative;
    margin: 0 0 0 20px;
  }
  .username {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    padding: 0;
    margin: 0 0 0 10px;
    letter-spacing: 1px;
  }
  p {
    display: block;
    width: 80%;
    font-size: 20px;
    color: #fff;
    padding: 0;
    margin: 40px auto 0;
    line-height: 1.5;
    letter-spacing: 1px;
    z-index: 10;
    position: relative;
  }
  .cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
  }
  .full {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
.content-container {
  box-sizing: border-box;
  // overflow: hidden;
  padding: 20px 40px 20px;
  margin: 0;
  min-height: 290px;
  p {
    font-size: 14px;
    line-height: 25px;
    max-height: 200px;
    overflow: hidden;
    padding: 0;
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.footer {
  box-sizing: border-box;
  padding: 0 0 40px;
  .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      height: 80px;
      margin-right: 15px;
    }
    .qrcode {
      background: #ffffff;
      width: 80px;
      height: 80px;
      margin-left: 15px;
    }
  }
  .des {
    display: block;
    width: 140px;
    margin: 20px auto 0;
  }
}
.save-content {
  background-color: #fff;
  padding: 10px 0;
  margin: 10px 0 0;
  border-radius: 3px;
}
.doc {
  color: #333;
  text-align: center;
  padding: 0;
  margin: 6px 0;
  font-size: 12px;
}
</style>
