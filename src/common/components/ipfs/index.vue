<template>
  <el-popover
    class="m-ipfs"
    placement="bottom"
    width="300"
    trigger="hover"
  >
    <div>
      <p class="ipfs-tip">
        本文内容已上传星际文件存储系统「IPFS」，永久保存。
      </p>
      <p class="ipfs-link">
        IPFS Hash: {{ hash }}
        <svg-icon
          icon-class="copy"
          @click="copy(hash)"
        />
      </p>
    </div>
    <svg-icon
      slot="reference"
      icon-class="ipfs"
      class="ipfs"
    />
  </el-popover>
</template>

<script>
export default {
  props: {
    hash: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy(val) {
      this.$copyText(val).then(
        () => this.$toast.success({ duration: 1000, message: this.$t('success.copy') }),
        () => this.$toast.fail({ duration: 1000, message: this.$t('fail.copy') })
      )
    }
  }
}
</script>

<style lang="less" scoped>
.m-ipfs {
  .ipfs {
    font-size: 20px;
    cursor: pointer;
  }
}
.ipfs-tip {
  font-size:10px;
  font-weight:400;
  color:rgba(178,178,178,1);
  line-height:14px;
  margin-bottom: 10px;
}

.ipfs-link {
  font-size:10px;
  font-weight: bold;
  color: @purpleDark;
  line-height:14px;
}
</style>