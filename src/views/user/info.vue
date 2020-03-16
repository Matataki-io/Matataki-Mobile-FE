<template>
  <userPage>
    <div
      v-loading="loading"
      class="information"
    >
      <div
        v-if="urls.length !== 0"
        class="websites"
      >
        <h3 class="inline h3">
          相关网站
        </h3>
        <div class="inline url">
          <p
            v-for="(item, index) in urls"
            :key="index"
          >
            <a
              :href="formatUrl(item)"
              target="_blank"
            >{{ item }} </a>
          </p>
        </div>
      </div>
      <div
        v-if="social.length !== 0"
        class="social"
      >
        <h3 class="inline h3">
          社交账号
        </h3>
        <div class="inline social">
          <div
            v-for="(item, index) in social"
            :key="index"
          >
            <div class="social-icons">
              <socialIcon
                :icon="item.icon"
                :show-tooltip="true"
                :content="item.content"
              />
            </div>
            <a
              v-if="item.url"
              class="url-text"
              :href="item.url + item.content"
            >
              {{ item.type !== 'email' ? item.url + item.content : item.content }}
            </a>
            <span
              v-else
              class="url-text"
            >{{ item.content }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="social.length === 0 && urls.length === 0 && loading === false"
        class="social no-data"
      >
        <p>
          暂无信息
        </p>
      </div>
    </div>
  </userPage>
</template>

<script>
import userPage from '@/components/user/user_page.vue'
import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: {
    userPage,
    socialIcon
  },
  data() {
    return {
      loading: false,
      social: [],
      socialTemplate: [
        {
          icon: 'Email',
          type: 'email',
          url: 'mailto:',
          content: ''
        },
        {
          icon: 'QQ',
          type: 'qq',
          content: ''
        },
        {
          icon: 'Wechat',
          type: 'wechat',
          content: ''
        },
        {
          icon: 'Weibo',
          type: 'weibo',
          url: 'https://www.weibo.com/',
          content: ''
        },
        {
          icon: 'Telegram',
          type: 'telegram',
          content: ''
        },
        {
          icon: 'Twitter',
          type: 'twitter',
          url: 'https://twitter.com/',
          content: ''
        },
        {
          icon: 'Facebook',
          type: 'facebook',
          url: 'https://facebook.com/',
          content: ''
        },
        {
          icon: 'Github',
          type: 'github',
          url: 'https://github.com/',
          content: ''
        }
      ],
      urls: []
    }
  },
  created() {
    this.getMyUserLinks()
  },
  methods: {
    async getMyUserLinks() {
      this.loading = true
      try {
        const res = await this.$API.getUserLinks({
          id: this.$route.params.id
        })
        if (res.code === 0) {
          const data = res.data
          this.urls = data.websites
          data.socialAccounts.forEach(item => {
            this.socialTemplate.find(age => age.type === item.type).content = item.value
          })
          this.social = this.socialTemplate.filter(age => age.content !== '' && age.content != null)
          this.loading = false
        } else console.log('获取用户信息失败,', res.message)
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
    },
    formatUrl(url) {
      const isHttp = url.indexOf('http://')
      const isHttps = url.indexOf('https://')
      if(isHttp !== 0 && isHttps !== 0) url = 'http://' + url
      return url
    }
  }
}
</script>

<style scoped lang="less">
.information {
  margin: 10px 20px;
  min-height: 200px;
  .social-icons {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .inline {
    &.h3 {
      margin-right: 20px;
    }
    &.url {
      display: inline-table;
      p {
        margin: 15px 5px;
      }
    }
    &.social {
      margin: 15px 5px;
      .url-text {
        color: black;
        position: relative;
        top: -8px;
      }
    }
    a {
      text-decoration: underline;
    }
    a:link {
      color: black;
    }
    a:visited {
      color: black;
    }
    a:hover {
      color: dimgrey;
    }
    a:active {
      color: darkgray;
    }
  }
  .websites {
    margin-bottom: 20px;
  }
  .social {
    padding-bottom: 20px;
  }
}
</style>
