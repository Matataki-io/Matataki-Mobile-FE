<template>
  <div class="container">
    <div class="carousel">
      <van-swipe :autoplay="3000" indicator-color="#542DE0" :height="170">
        <van-swipe-item v-for="(item, index) in sipeList" :key="index">
          <div class="swip-container" @click="viewP(item.id)">
            <img v-if="item.cover" :src="cover(item.cover)" :alt="item.title" />
            <p>{{item.title}}</p>
            <div class="full" />
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- <div class="head">
      <div class="head-title">
        <router-link v-for="(item, index) in head" :to="{name: item.url}" :key="index" :class="item.url === $route.name && 'active'">{{item.lab}}</router-link>
      </div>
      <slot name="sort" />
    </div>
    <slot /> -->
    <bannerMatataki />
    <articleTab v-if="idx === 0" @setIdx="setIdx" :idx="idx" />
    <tokenTab v-if="idx === 1" @setIdx="setIdx" :idx="idx" />
    <followTab v-if="idx === 2" @setIdx="setIdx" :idx="idx" />
  </div>
</template>


<script>
import bannerMatataki from '@/components/banner/banner_matataki.vue'
import articleTab from './index.vue'
import tokenTab from './token.vue'
import followTab from './follow.vue'

export default {
  components: {
    articleTab,
    tokenTab,
    followTab,
    bannerMatataki
  },
  data() {
    return {
      idx: 0,
      sipeList: [
        {
          src: '',
          title: ''
        }
      ],
    }
  },
  created() {
    this.initSwipe(1)
  },
  methods: {
    async initSwipe(channel) {
      await this.$API
        .postsRecommend({
          channel: channel
        })
        .then(res => {
          if (res.code === 0) {
            this.sipeList = res.data
          } else console.log('获取推荐失败')
        })
        .catch(err => {
          console.log(err)
        })
    },
    cover(src) {
      return src ? this.$ossProcess(src, {h: 200, interlace: 1}) : ''
    },
    viewP(id) {
      this.$router.push({
        name: 'p-id',
        params: {
          id: id
        }
      })
    },
    setIdx(i) {
      this.idx = i
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  min-height: 100%;
  background-color: #fff;
  padding-top: 46px;
}

</style>

<style lang="less">
.container {
  .van-swipe-item {
    padding: 20px;
    box-sizing: border-box;
    .swip-container {
      border-radius: 10px;
      overflow: hidden;
      background: #f1f1f1;
      border: 1px solid #f1f1f1;
      box-sizing: border-box;
      height: 100%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      p {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 1);
        line-height: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        z-index: 10;
        margin: 0;
        padding: 0 0 0 8px;
        &::before {
          display: block;
          content: '';
          width: 2px;
          // height: 30px;
          background: #fff;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
      .full {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9;
        height: 60px;
        top: auto;
        background: linear-gradient(0, rgba(0,0,0,0.5) 0, transparent 100%);
      }
    }
  }
  .van-swipe__indicators {
    bottom: 6px;
    .van-swipe__indicator {
      background: #dbdbdb;
      opacity: 1;
      // margin: 0 10px;
    }
  }
}
</style>