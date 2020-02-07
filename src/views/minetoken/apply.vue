<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '申请Fan票' }"
      customize-header-bc="#fff"
    />
    <div class="apply-card">
      <img class="error-gif" src="@/assets/img/wallet.png" alt="cover">
      <p>
        聪明又创造力十足的你终于来到这里了！快来发布你的Fan票吧，这是作为你的社区一员的身份象征哦！
      </p>
      <p>
        填写表单，告诉我们你对社区的规划，工作人员会在1-5个工作日联系你为你提供专属服务。
      </p>
    </div>
    <div class="bottom-bar">
      <a href="https://wj.qq.com/s2/5208015/8e5d" target="_blank">
        <el-button type="primary" size="small">
          立即申请
        </el-button>
      </a>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.tokens {
  background-color: #fff;
  padding-top: 45px;
  height: 100%;
}
.apply-card {
  text-align: center;
  height: calc(100% - 60px);
  overflow: auto;
  img {
    width: 131pt;
    margin-top: 39pt;
  }
  p {
    font-size: 12px;
    margin: 10px 20px 0 20px;
    line-height: 1.5;
    color: #333;
    &:nth-of-type(1) {
      margin-top: 50px;
    }
  }
}
.bottom-bar {
  // bottom: 0rem;
  z-index: 9999;
  box-shadow: 0px -4px 5px #8888881a;
  position: sticky;
  overflow: hidden;
  text-align: center;
  button {
    margin: 10pt 0 10pt;
    width:90%;
  }
}
</style>
