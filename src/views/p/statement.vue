<template>
  <div class="decoration">
    <div class="flex mt">
      <span class="is-original">
        {{ $t('p.publishMatataki') }}
        <el-tooltip
          v-if="license"
          placement="bottom"
        >
          <div slot="content">
            点击可查看本文的授权许可详情
          </div>
          <span
            class="cc-license"
          >本文使用
            <a
              :href="license.url"
              class="license-statement"
              rel="noopener"
              target="_blank"
            >知识共享 {{ license.chinese }} 4.0</a>
            协议
          </span>
        </el-tooltip>
        <br>
        <template v-if="isOriginal">
          {{ $t('p.publishMatatakOriginal') }}
        </template>
      </span>
    </div>
    <p class="statement">
      {{ $t('p.publishMatatakiUser', [article.nickname || article.username]) }}
    </p>
  </div>
</template>

<script>
import { licenseDetailLink, convertLicenseToChinese } from '@/utils/CreativeCommons'

export default {
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    isOriginal() {
      return Boolean(this.article.is_original)
    },
    license() {
      if (!this.article.cc_license) return null
      const { cc_license: ccLicense } = this.article
      const chineseLicense = convertLicenseToChinese(ccLicense)
      const url = licenseDetailLink(ccLicense)
      return { eng: ccLicense, chinese: chineseLicense, url }
    }
  }
}
</script>

<style scoped lang="less">
.decoration {
  display: flex;
  flex-direction: column;
  .statement {
    font-size: 12px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 1.5;
    padding: 0;
    margin: 10px 0 0;
  }
  .is-original {
    padding: 0;
    margin: 40px 0 0;
    text-align: right;
    font-size: 12px;
    color: #b2b2b2;
    line-height: 16px;
    text-align: left;
  }
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mt {
  margin-top: 10px;
}
</style>
