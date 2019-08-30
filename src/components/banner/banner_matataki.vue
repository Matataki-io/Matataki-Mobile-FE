<template>
  <div class="banner-container mw">
    <div class="banner">
      <div class="banner-logo">
        <img class="logo" src="@/assets/img/matataki_logo.png" alt="logo">
      </div>
      <div class="banner-data">
        <div class="data">
          <p class="data-title">
            生态共建者数
          </p>
          <p class="data-num">
            {{ postsStats.users || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            文章确权数
          </p>
          <p class="data-num">
            {{ postsStats.articles || 0 }}
          </p>
        </div>
        <div class="data">
          <p class="data-title">
            已发放积分
          </p>
          <p class="data-num">
            {{ postsStats.points || 0 }}
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postsStats: Object.create(null)
    }
  },
  mounted() {
    this.getPostsStats()
  },
  methods: {
    getPostsStats() {
      this.$backendAPI.postsStats().then(res => {
        if (res.status === 200 && res.data.code === 0) this.postsStats = res.data.data
      }).catch(err => console.log(`获得统计次数${err}`))
    }
  }
}
</script>

<style lang="less" scoped>
.banner-container {
  padding: 0 10px;
  box-sizing: border-box;
}
.banner {
  margin-top: 60px;
  margin-bottom: 20px;
  height:67px;
  background: #ebe6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
}

.banner-logo {
  display: flex;
  flex-direction: column;
  align-items: self-end;
  .logo {
    width: 87px;
  }
}

.banner-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.data {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 2px;
  box-sizing: border-box;
  &-title {
    color:rgba(178,178,178,1);
    padding: 0;
    margin: 0;
    font-size:12px;
    font-weight:400;
    line-height:14px;
  }
  &-num {
    font-size: 20px;
    font-weight:bold;
    color: #542DE0;
    padding: 0;
    margin: 0;
    word-break: break-all;
    line-height: 1.3;
  }
}

// .banner-more {
//   font-size: 14px;
//   margin: 8px 0 0;
//   text-decoration: underline;
//   color: #542de0;
// }
</style>
