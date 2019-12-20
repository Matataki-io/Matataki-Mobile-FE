<template>
  <div class="ring">
    <BaseHeader :pageinfo="{ title: headerTitle }" customize-header-bc="#fff" :has-bottom-border-line="true" />
    <div class="ring-logo">
      <img v-if="logo" :src="logoSrc" :alt="symbol">
    </div>
    <p class="ring-logo-title">{{symbol}}{{name ? (name) : ''}}</p>

    <div class="ring-head">
      <div class="ring-title">
        <router-link class="active" :to="{name: 'ring-id', params: { id: $route.params.id }}">全部内容</router-link>
        <!-- <router-link :to="{name: 'ring'}">只看创始人</router-link> -->
      </div>
      <slot name="sort"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: '',
      symbol: '',
      name: ''
    }
  },
  computed: {
    headerTitle() {
      return this.name ? this.symbol + '-' + 'Fan票圈' : 'Fan票圈'
    },
    logoSrc() {
      return this.logo ? this.$API.getImg(this.logo) : ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let { id } = this.$route.params
      if (!id) return this.$router.go(-1)
      this.$API.minetokenId(id).then(res => {
        if (res.code === 0 && res.data.token) {
          this.logo = res.data.token.logo
          this.symbol = res.data.token.symbol
          this.name = res.data.token.name
        } else {
          console.log('获取fan票信息失败')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ring {
  background-color: #fff;
  padding-top: 45px;
  min-height: 100%;
  &-logo {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    background-color: #f1f1f1;
    border: 1px solid #f1f1f1;
    box-sizing: border-box;
    overflow: hidden;
    margin: 20px auto 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-logo-title {
    font-size:14px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:20px;
    margin-top: 10px;
    text-align: center;
  }

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 10px 0;
    .ring-title {
      display: flex;
      align-items: center;
      a {
        font-size:14px;
        font-weight:400;
        color:rgba(178,178,178,1);
        line-height:20px;
        &:nth-child(1) {
          margin-right: 20px;
        }
        &.active {
          color: #000;
        }
      }
    }
  }
}
</style>