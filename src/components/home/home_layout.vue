<template>
  <div class="container">
    <home-head @login="showSidebar = true" />
    <div class="carousel">
      <van-swipe :autoplay="300000" indicator-color="#542DE0" :height="170">
        <van-swipe-item v-for="(item, index) in sipeList" :key="index">
          <div class="swip-container">
            <img v-if="item.cover" :src="cover(item.cover)" :alt="item.title" />
            <p>{{item.title}}</p>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="head">
      <div class="head-title">
        <router-link v-for="(item, index) in head" :to="{name: item.url}" :key="index" :class="item.url === $route.name && 'active'">{{item.lab}}</router-link>
      </div>
      <slot name="sort" />
    </div>
    <slot />
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>


<script>
import homeHead from '../../views/home/components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'

export default {
  components: {
    homeHead,
    Sidebar
  },
  data() {
    return {
      showSidebar: false,
      sipeList: [
        {
          src: '',
          title: ''
        }
      ],
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

.head {
  margin: 10px 0 0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-title {
    display: flex;
    align-items: center;
    a {
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
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
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