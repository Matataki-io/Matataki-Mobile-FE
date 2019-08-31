<template>
  <div class="outer">
    <div ref="container" :class="{ 'white-bg': !canvas }">
      <div v-if="!canvas" ref="capture" class="container">
        <div class="header">
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
          <span>—— 扫描二维码 免费读全文 ——</span>
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
      <img v-else :src="downloadLink" alt="" style="width: 100%;" />
    </div>
    <button v-if="canvas" class="save-btn" disabled>长按图片保存</button>
    <button v-else class="save-btn" @click="toCanvas">生成图片</button>
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
      }
    }
  },
  computed: {
    downloadLink() {
      if (this.canvas) return this.canvas.toDataURL()
      return ''
    },
    isAPP() {
      return /Edge|Firefox|Opera|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
    htmlStr() {
      return xssFilter(this.filterStr(this.shareInfo.content).substr(0, 300))
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
    close() {
      this.$emit('change', false)
    },
    saveLocal(canvas) {
      let link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.setAttribute('download', 'smartsignature.png')
      link.style.display = 'none'
      link.click()
    },
    toCanvas() {
      const loading = this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        zIndex: 1200,
        message: `图片生成中...`
      })
      if (this.canvas) {
        document.querySelector('#downloadImg').click()
        loading.close()
        return
      }
      html2canvas(this.$refs.capture, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0
      })
        .then(canvas => {
          this.canvas = canvas
          this.saveLocal(canvas)
          loading.clear()
        })
        .catch(error => {
          console.log(error)
          loading.clear()
          this.$toast('图片生成失败')
        })
    },
    genQRCode() {
      QRCode.toCanvas(this.$refs.qr, this.shareInfo.shareLink, { width: 80 }, error => {
        if (error) console.error(error)
        console.log('success!')
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
  margin-top: 100px;
}
.hide-article-box {
  width: 100%;
  background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 70%);
  padding-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 9999;
  padding-top: 100px;
  bottom: 2px;
  margin-top: -100px;
  color: #b2b2b2;
  font-size: 14px;
}
.save-btn {
  font-size: 14px;
  color: #ffffff;
  border-radius: 6px;
  border: none;
  background: #542DE0;
  width: 335px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 10px auto 0 auto;
  user-select: none;
  &.disabled {
    background: #b2b2b2;
  }
  &:disabled {
    background: #b2b2b2;
  }
}
.container {
  width: 100%;
  margin: auto;
}
.header {
  height: 240px;
  background-color: @purpleDark;
  position: relative;
  overflow: hidden;
  .info {
    display: flex;
    align-items: center;
    z-index: 10;
    position: relative;
    padding: 24px 0 0 20px;
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
    margin: 80px auto 0;
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
  padding: 40px 40px 50px;
  margin: 0;
  min-height: 290px;
  p {
    font-size: 14px;
    line-height: 1.8;
    padding: 0;
    margin: 0;
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
</style>
