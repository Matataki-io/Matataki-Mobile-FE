<template>
  <div class="decoration">
    <p class="statement">
      免责声明：本文由用户「日番谷冬狮郎第十番队队长」上传发布，内容为作者独立观点。不代表瞬Matataki立场，不构成投资建议，请谨慎对待。
    </p>
    <div class="flex mt">
      <a
        data-pocket-label="pocket"
        data-pocket-count="horizontal"
        class="pocket-btn"
        data-lang="en"
      ></a>
      <span class="is-original">
        本文发布于瞬matataki
        <template v-if="isOriginal">
          未经授权禁止转载
        </template>
      </span>
    </div>
  </div>
</template>

<script>
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
    }
  }
}
</script>

<style scoped lang="less">
.decoration {
  display: flex;
  flex-direction: column;
  .statement {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 1.5;
    padding: 0;
    margin: 40px 0 0;
  }
  .is-original {
    padding: 0;
    margin: 10px 0 0;
    text-align: right;
    font-size: 14px;
    color: #b2b2b2;
    line-height: 16px;
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
