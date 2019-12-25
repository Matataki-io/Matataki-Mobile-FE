<template>
  <div class="container">
    <home-head @login="showSidebar = true" />
    <div class="carousel">
      <van-swipe :autoplay="3000" indicator-color="#542DE0" :height="170">
        <van-swipe-item v-for="(item, index) in sipeList" :key="index">
          <div class="swip-container" @click="viewP(item.id)">
            <img v-if="item.cover" :src="cover(item.cover)" :alt="item.title" />
            <p>{{item.title}}</p>
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
    <articleTab v-if="idx === 0" @setIdx="setIdx" :idx="idx" />
    <tokenTab v-if="idx === 1" @setIdx="setIdx" :idx="idx" />
    <followTab v-if="idx === 2" @setIdx="setIdx" :idx="idx" />
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>


<script>
import homeHead from './components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import articleTab from './index.vue'
import tokenTab from './token.vue'
import followTab from './follow.vue'

export default {
  components: {
    homeHead,
    Sidebar,
    articleTab,
    tokenTab,
    followTab
  },
  data() {
    return {
      showSidebar: false,
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
    this.initSwipe()
  },
  methods: {
    async initSwipe() {
      await this.$API
        .postsRecommend({
          channel: 1
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
      return src ? this.$API.getImg(src) : ''
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
      background: #dbdbdb;
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
        left: 16px;
        right: 16px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0;
        margin: 0;
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