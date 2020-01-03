<template>
  <el-dialog
    :title="title"
    :visible.sync="shareDialogVisible"
    width="90%"
    center>
    <slot></slot>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '提示'
      },
      value: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      value(newVal) {
        this.shareDialogVisible = newVal
      },
      shareDialogVisible(newVal) {
        this.$emit('input', newVal)
      },
    },
    data() {
      return {
        shareDialogVisible: false
      }
    }
  }
</script>