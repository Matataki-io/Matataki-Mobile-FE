<template>
  <div class="share-footer">
    <div class="icon-num">
      <svg-icon class="icon" :class="bookmarked && 'active'" icon-class="bookmark-solid" @click="$emit('bookmarked', bookmarked)"/>
      <p>收藏</p>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="reference" @click="pushShare"/>
      <p>引用</p>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="share2" @click="$emit('share')"/>
      <p>分享</p>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" :class="isLiked === 2 && 'active'" icon-class="great-solid" @click="$emit('like', 2)" />
      <p>{{ likes }}</p>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" :class="isLiked === 1 && 'active'" icon-class="bullshit-solid" @click="$emit('like', 1)" />
      <p>{{ dislikes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 是否收藏
    bookmarked: {
      type: Number,
      default: 0
    },
    // 是否点赞 like 2 dislike 1
    isLiked: {
      type: Number,
      default: 0
    },
    // 点赞数
    likes: {
      type: Number,
      default: 0
    },
    // 不推荐数
    dislikes: {
      type: Number,
      default: 0
    }
  },
  methods: {
    pushShare() {
      this.$router.push({
        name: 'sharehall',
        query: {
          id: this.$route.params.id,
          from: 'share'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.share-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // height: 50px;
  padding: 7px 40px 7px;
  box-sizing: border-box;
  padding-bottom: calc(7px + constant(safe-area-inset-bottom));
  padding-bottom: calc(7px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow:0px -2px 8px 0px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .icon {
    font-size: 20px;
    color: #B2B2B2;
    &.active {
      color: @purpleDark;
    }
  }

  .icon-num {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // position: relative;
    p {
      // position: absolute;
      // top: 20px;
      // left: 0;
      text-align: center;
      font-size:12px;
      color:rgba(178,178,178,1);
      line-height: 1;
      padding: 0;
      margin: 4px 0 0 0;
    }
  }
}
</style>