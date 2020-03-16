<template>
  <el-dialog
    custom-class="import br10"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="$emit('close')"
  >
    <div class="promptStyle">
      {{ $t('publish.oneKeyImport') }}
    </div>
    <el-button @click="doImport">
      {{ $t('confirm') }}
    </el-button>
  </el-dialog>
</template>

<script>
import { strTrim, internetUrl } from '@/utils/reg'
import * as clipboard from 'clipboard-polyfill'
export default {
  props: {value : Boolean},
  data: () => {
    return {visible:false}
  },
  watch: {
    value(val) {
      this.visible = val
    }
  },
  methods: {
    async doImport() {
      const url = await clipboard.readText()
      if (!internetUrl(url)) return this.$message.error(this.$t('publish.importAddressError'))
      try {
        let res = await this.$API.importArticle(url)
        if (res.code === 0) {
          const templateLink = `\n\n${this.$t('publish.importAddress')}[${url}](${url})`
          res.data.content += templateLink
          const { title, content, cover } = res.data
          this.$message.success(this.$t('publish.importSuccess'))
          this.$emit('res', {
            title,
            content,
            cover
          })
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      } catch (err) {
        this.$message.error(this.$t('publish.importError'))
        console.log('err', err)
      }
    }
  }
}
</script>

<style lang="less">

  .promptStyle {
    font-size: 14px;
    font-weight: 400;
    color: #565656;
    line-height: 1.5;
  }
</style>
