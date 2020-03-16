<template>
  <div class="home-slide">
    <p class="home-slide-title">
      {{ recommend.title }}
    </p>

    <ContentLoader
      v-if="recommend.list.length === 0"
      :height="137"
      :speed="2"
      primary-color="#f3f3f3"
      secondary-color="#ecebeb"
    >
      <rect
        x="20"
        y="20"
        rx="20"
        ry="20"
        width="280"
        height="117"
      />
      <rect
        x="320"
        y="20"
        rx="20"
        ry="20"
        width="280"
        height="117"
      />
    </ContentLoader>

    <div
      v-else
      ref="wrapper"
      class="slide-container"
    >
      <div class="slide-content">
        <homeSlideItem
          v-for="(item, index) in recommend.list"
          :key="index"
          :slide="item"
          :slide-index="slideIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
import Bscroll from 'better-scroll'
import homeSlideItem from './homeSlideItem.vue'

export default {
  name: 'HomeSlide',
  components: {
    homeSlideItem,
    ContentLoader
  },
  props: {
    recommend: {
      type: Object,
      required: true
    },
    slideIndex: {
      type: Number,
      default: 0
    },
    nowIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  watch: {
    recommend: {
      handler() {
        // 默认执行第一个
        this.setWrapperScroll()
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 设置横向滚动
    setWrapperScroll() {
      this.$nextTick(() => {
        new Bscroll(this.$refs.wrapper, {
          click: true,
          scrollX: true,
          scrollY: false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home-slide {
  &-title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    text-align: left;
    margin: 0 0 0 20px;
  }
}
.slide-container {
  overflow: hidden;
  &::-webkit-scrollbar {
    // display: none;
  }
}
.slide-content {
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 10px 0 20px;
}
</style>
