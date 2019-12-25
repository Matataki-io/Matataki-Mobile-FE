<template>
  <div>
    <div class="head">
      <div class="head-title">
        <span
          v-for="(item, index) in head"
          @click="$emit('setIdx', index)"
          :key="index"
          :class="idx === index && 'active'">{{item.lab}}</span>
      </div>
      <slot name="sort" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    idx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      head: [
        {
          url: 'article',
          lab: '综合创作'
        },
        {
          url: 'article-token',
          lab: 'Fan票圈'
        },
        {
          url: 'article-follow',
          lab: '我的关注'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.head {
  height: 30px;
  margin: 10px 0 0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-title {
    display: flex;
    align-items: center;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 20px;
      margin-right: 20px;
      text-decoration: none;
      &:nth-last-child(1) {
        margin-right: 0;
      }
      &.active {
        color: rgba(0, 0, 0, 1);
      }
    }
  }
}
</style>