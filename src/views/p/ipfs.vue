<template>
  <div class="article-ipfs">
    <p>
      {{ $t('p.ipfsTitle') }}
      <el-popover placement="top-start" width="300" trigger="click" :content="$t('p.ipfsContent')">
        <svg-icon slot="reference" class="help-icon" icon-class="help" />
      </el-popover>
    </p>
    <div v-if="!isHide" class="ipfs-hash">
      <svg-icon class="copy-hash" icon-class="copy" @click="copyText(getCopyIpfsHash)" />
      <router-link class="ipfs" :to="{ name: 'ipfs', params: { hash: hash } }">
        IPFS Hash: {{ hash || 'Loading...' }}
      </router-link>
    </div>
    <img class="ipfs-img" src="@/assets/img/ipfs.png" alt="ipfs" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    hash: {
      type: Object,
      required: true
    },
    isHide: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    getCopyIpfsHash() {
      return `${this.hash}`
    }
  },
  methods: {
    // 复制hash
    copyText(getCopyIpfsHash) {
      this.$copyText(getCopyIpfsHash).then(
        () => {
          this.$toast.success({ duration: 1000, message: this.$t('success.copy') })
        },
        () => {
          this.$toast.fail({ duration: 1000, message: this.$t('fail.copy') })
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.article-ipfs {
  background: rgba(241, 241, 241, 1);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 20px 20px 0;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  p {
    padding: 0;
    margin: 0 0 4px;
    font-size: 12px;
    color: rgba(178, 178, 178, 1);
  }
}
.ipfs-img {
  position: absolute;
  width: 60px;
  right: 0;
  bottom: 0;
}
.ipfs-hash {
  margin: 4px 0 0;
  font-size: 12px;
  color: #b2b2b2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 60px 0 0;

  .copy-hash {
    width: 18px;
    cursor: pointer;
    vertical-align: middle;
    color: #542de0;
    .ipfs {
      font-size: 16px;
      color: #542de0;
    }
  }
}
</style>
