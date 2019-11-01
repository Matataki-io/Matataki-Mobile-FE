<template>
  <div class="home-container">
    <home-head :nav="navList" :now-index="-1" @login="showSidebar = true" />
    <div ref="home" class="one">
      <img
        v-scroll-reveal="{ distance: '20px' }"
        class="logo"
        src="@/assets/img/home/logo_home.png"
        :alt="$t('about.logo')"
      />
      <img
        v-scroll-reveal="{ distance: '20px', delay: 100 }"
        class="des"
        src="@/assets/img/home/logo_des_home.png"
        :alt="$t('about.logoDes')"
      />
      <h1 v-scroll-reveal="{ distance: '20px', delay: 200 }">
        {{ $t('about.homeTitle') }}
      </h1>
      <p v-scroll-reveal="{ distance: '20px', delay: 400 }" class="home-text">
        {{ $t('about.homeDes') }}
      </p>
      <div v-scroll-reveal="{ distance: '20px', delay: 600 }" class="flex ac">
        <router-link :to="{ name: 'article' }">
          <el-button class="home-btn" icon="el-icon-reading">
            {{ $t('about.homeBtnRead') }}
          </el-button>
        </router-link>
        <el-button class="home-btn" icon="el-icon-edit" @click="jumpTo()">
          {{ $t('about.homeBtnCreate') }}
        </el-button>
      </div>
      <img
        v-scroll-reveal="{ distance: '20px', delay: 800 }"
        class="bg"
        src="@/assets/img/home/home_bg.png"
        alt="logo"
      />
    </div>
    <div class="two">
      <el-row v-for="(item, index) in effectList" :key="index">
        <el-col v-scroll-reveal="{ distance: '20px' }" :span="24">
          <h3 v-if="index === 0 || index === 3" :class="index === 3 && 'm'">{{ item.title }}</h3>
        </el-col>
        <el-col class="margin-t-20" :span="10">
          <p v-scroll-reveal="{ distance: '20px', delay: 200 * index }" class="title">
            {{ item.subtitle }}
          </p>
          <img
            v-scroll-reveal="{ distance: '20px', delay: 220 * index }"
            :src="item.img"
            alt="Features"
          />
        </el-col>
        <el-col class="margin-t-20" :span="14">
          <p v-scroll-reveal="{ distance: '20px', delay: 260 * index }" class="content">
            {{ item.des }}
          </p>
        </el-col>
      </el-row>
    </div>
    <div class="three">
      <h3 v-scroll-reveal="{ distance: '20px' }">
        {{ $t('about.blockTitle1') }}
      </h3>
      <p v-scroll-reveal="{ distance: '20px', delay: 200 }">
        {{ $t('about.blockDes1') }}
      </p>
      <a
        v-scroll-reveal="{ distance: '20px', delay: 300 }"
        target="_blank"
        href="https://www.matataki.io/p/806"
      >
        {{ $t('readMore') }}
        ></a
      >
      <img
        v-scroll-reveal="{ distance: '20px', delay: 400 }"
        src="@/assets/img/home/home_bg1.png"
        alt="block"
      />
    </div>
    <div class="three">
      <h3 v-scroll-reveal="{ distance: '20px' }">
        {{ $t('about.blockTitle2') }}
      </h3>
      <p v-scroll-reveal="{ distance: '20px', delay: 200 }">
        {{ $t('about.blockDes2') }}
      </p>
      <a
        v-scroll-reveal="{ distance: '20px', delay: 300 }"
        target="_blank"
        href="
        https://www.matataki.io/p/807
        "
      >
        {{ $t('readMore') }}
        ></a
      >
      <img
        v-scroll-reveal="{ distance: '20px', delay: 400 }"
        src="@/assets/img/home/home_bg2.png"
        alt="block"
      />
    </div>
    <div class="three">
      <h3 v-scroll-reveal="{ distance: '20px' }">
        {{ $t('about.blockTitle3') }}
      </h3>
      <p v-scroll-reveal="{ distance: '20px', delay: 200 }">
        {{ $t('about.blockDes31') }}
        <br />
        <span class="content-empty"></span>
        {{ $t('about.blockDes32') }}
        <br />
        <span class="content-empty"></span>
        {{ $t('about.blockDes33') }}
        <br />
        <span class="content-empty"></span>
        {{ $t('about.blockDes34') }}
      </p>
      <a
        v-scroll-reveal="{ distance: '20px', delay: 300 }"
        target="_blank"
        href="https://www.matataki.io/p/781"
      >
        {{ $t('readMore') }}
        ></a
      >
      <img
        v-scroll-reveal="{ distance: '20px', delay: 400 }"
        src="@/assets/img/home/home_bg3.png"
        alt="block"
      />
    </div>
    <div class="four">
      <div
        v-for="(item, index) in stageList"
        :key="index"
        v-scroll-reveal="{ distance: '20px', delay: 200 * index }"
        class="stage"
      >
        <img :src="item.img" alt="stage" />
        <h3>{{ item.title }}</h3>
        <p>{{ item.des }}</p>
        <p>{{ item.des1 }}</p>
      </div>
    </div>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import homeHead from '../home/components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'

import effect1 from '@/assets/img/home/effect1.png'
import effect2 from '@/assets/img/home/effect2.png'
import effect3 from '@/assets/img/home/effect3.png'
import effect4 from '@/assets/img/home/effect4.png'
import effect5 from '@/assets/img/home/effect5.png'
import effect6 from '@/assets/img/home/effect6.png'

import stage1 from '@/assets/img/home/stage1.png'
import stage2 from '@/assets/img/home/stage2.png'
import stage3 from '@/assets/img/home/stage3.png'

export default {
  components: {
    homeHead,
    Sidebar
  },
  data() {
    return {
      showSidebar: false,
      nowIndex: 0
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    navList() {
      return [this.$t('home.navArticle'), this.$t('home.navShop')]
    },

    effectList() {
      return [
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle1'),
          img: effect1,
          des: this.$t('about.painPointDes1')
        },
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle2'),
          img: effect2,
          des: this.$t('about.painPointDes2')
        },
        {
          title: this.$t('about.painPoint'),
          subtitle: this.$t('about.painPointTitle3'),
          img: effect3,
          des: this.$t('about.painPointDes3')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle1'),
          img: effect6,
          des: this.$t('about.programDes1')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle2'),
          img: effect4,
          des: this.$t('about.programDes2')
        },
        {
          title: this.$t('about.program'),
          subtitle: this.$t('about.programTitle3'),
          img: effect5,
          des: this.$t('about.programDes3')
        }
      ]
    },
    stageList() {
      return [
        {
          title: this.$t('about.stageTitle1'),
          des: this.$t('about.stageDes11'),
          des1: this.$t('about.stageDes12'),
          img: stage1
        },
        {
          title: this.$t('about.stageTitle2'),
          des: this.$t('about.stageDes21'),
          des1: this.$t('about.stageDes22'),
          img: stage2
        },
        {
          title: this.$t('about.stageTitle3'),
          des: this.$t('about.stageDes31'),
          des1: this.$t('about.stageDes32'),
          img: stage3
        }
      ]
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage() {
      this.$nextTick(() => {
        let clientHeight = document.body.clientHeight || document.documentElement.clientHeight
        let height = clientHeight - 48
        if (height > 620) this.$refs.home.style.height = `${clientHeight - 43}px`
      })
    },
    jumpTo() {
      if (!this.isLogined) return this.$store.commit('setLoginModal', true)
      this.$router.push({ name: 'Publish', params: { id: 'create' } })
    }
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
