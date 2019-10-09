<template>
  <div class="decoration">
    <div class="flex mt">
      <span class="is-original">
        本文发布于瞬matataki
        {{ $t('p.publishMatataki') }}
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
    margin: 10px 0 0;
  }
  .is-original {
    padding: 0;
    margin: 40px 0 0;
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
