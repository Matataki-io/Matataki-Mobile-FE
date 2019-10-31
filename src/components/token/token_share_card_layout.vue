<template>
  <div class="token-card">
    <p class="title">
      请选择其中一种卡片样式
    </p>

    <div class="fl ac jsb token-style">
      <div
        class="token-img"
        :class="shareCardCheckedOne && 'active'"
        @click="shareCardCheckedOne = true"
      >
        <img src="@/assets/img/token_share_bg1.png" alt="card" />
      </div>
      <div
        class="token-img"
        :class="!shareCardCheckedOne && 'active'"
        @click="shareCardCheckedOne = false"
      >
        <img src="@/assets/img/token_share_bg2.png" alt="card" />
      </div>
    </div>
    <div class="token-content">
      <div class="share">
        <div ref="tokenCard">
          <tokenShareCard
            :minetoken-token="minetokenToken"
            :minetoken-user="minetokenUser"
            :card-style="shareCardCheckedOne ? 1 : 2"
          />
        </div>
      </div>
    </div>
    <el-button class="save" type="primary" @click="save">
      保存
    </el-button>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import tokenShareCard from './token_share_card.vue'

export default {
  components: {
    tokenShareCard
  },
  props: {
    minetokenToken: {
      type: Object,
      required: true
    },
    minetokenUser: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      shareCardCheckedOne: true
    }
  },
  computed: {},
  watch: {},
  mounted() {
    console.log(document.querySelector('.p-share').offsetLeft)
    console.log(document.querySelector('.p-share').offsetTop)
  },
  methods: {
    save() {
      this.toCanvas('tokenCard')
    },
    saveLocal(canvas) {
      const linkTag = document.querySelector('#downloadImg')
      if (linkTag) {
        linkTag.href = canvas.toDataURL()
        linkTag.click()
      } else {
        const link = document.createElement('a')
        link.id = 'downloadImg'
        link.href = canvas.toDataURL()
        link.setAttribute('download', `${this.minetokenToken.symbol}.png`)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
      }
    },
    toCanvas(name) {
      const loading = this.$loading({
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
        })
        .finally(() => {
          loading.close()
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
  margin: 0 0 20px;
  padding: 0 10px;
}
.share {
  // transform: scale(0.7);
  // height: 600px;
  cursor: pointer;
  transition: border 0.3s;
  box-sizing: border-box;
  border: 2px solid #f1f1f1;
}
.check {
  margin: 10px 0 0;
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
</style>
