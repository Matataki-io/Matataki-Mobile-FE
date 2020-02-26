/* eslint-disable no-shadow */
<template>
  <div v-loading="loading" class="edit-user mw">
    <BaseHeader :pageinfo="{ title: $t('edit') }">
      <div slot="right">
        <span class="done-button" :class="!setProfile && 'no-modify'" @click="save">{{
          $t('done')
        }}</span>
      </div>
    </BaseHeader>
    <div class="edit-card">
      <div class="edit-card-list">
        <div class="card-block">
          <span>{{ $t('avatar') }}</span>
          <img-upload
            class="imgcard"
            :img-upload-done="imgUploadDone"
            :update-type="'avatar'"
            @doneImageUpload="doneImageUpload"
          >
            <div slot="uploadButton" class="user-avatar">
              <img slot="description" :src="avatar" alt="" :onerror="defaultAvatar" />
            </div>
          </img-upload>
        </div>

        <div class="card-block">
          <span>{{ $t('username') + '*' }}</span>
          <input v-model="newNickName" :placeholder="$t('rule.strEnglishNumber', ['1-12'])" />
        </div>

        <div class="card-block">
          <span>{{ $t('profile') + '*' }}</span>
          <input v-model="newIntroduction" :placeholder="$t('rule.notExceedStr', ['20'])" />
        </div>
      </div>

      <div class="edit-card-list">
        <div v-for="(item, index) in about" :key="index" class="card-block">
          <span>{{ '相关网站' + (index + 1) }}</span>
          <input v-model="about[index]" placeholder="请填写网站链接" />
          <div v-if="about.length > 1" class="about-input-btn" @click="abountLess(index)">
            <i class="el-icon-minus" />
          </div>
        </div>
        <div v-if="about.length < 5" class="card-block">
          <span>{{ '相关网站' + (about.length + 1) }}</span>
          <div class="about-input-btn add" @click="aboutAdd">
            <i class="el-icon-plus" />
          </div>
        </div>
      </div>

      <div class="edit-card-list">
        <div class="card-block">
          <span>社交账号</span>
          <p class="note">仅用于信息展示</p>
        </div>
        <div v-for="(item, index) in social" :key="index" class="card-block">
          <div class="social-icons">
            <socialIcon :icon="item.symbol" />
          </div>
          <span>{{ item.name }}</span>
          <input v-model="item.value" :placeholder="item.placeholder" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import imgUpload from '@/components/imgUpload/index.vue'
import socialIcon from '@/components/social_icon/index.vue'

export default {
  components: { imgUpload, socialIcon },
  data() {
    return {
      defaultAvatar: `this.src="${require('@/assets/avatar-default.svg')}"`,
      loading: false,
      playerincome: 0,
      editing: false,
      nickname: '', // 昵称
      newNickName: '', // 昵称
      avatar: '',
      imgUploadDone: 0, // 图片是否上传完成
      introduction: '', // 简介
      newIntroduction: '', // 简介
      newEmail: '',
      setProfile: false, // 是否编辑信息
      linksData: null,
      aboutModify: false,
      socialModify: false,
      about: [''],
      social: [
        {
          symbol: 'Email',
          type: 'email',
          name: 'Email',
          placeholder: '邮箱',
          url: '',
          value: ''
        },
        {
          symbol: 'QQ',
          type: 'qq',
          name: 'QQ',
          placeholder: 'QQ帐号',
          url: '',
          value: ''
        },
        {
          symbol: 'Wechat',
          type: 'wechat',
          name: '微信22',
          placeholder: '微信号',
          url: '',
          value: ''
        },
        {
          symbol: 'Weibo',
          type: 'weibo',
          name: '微博',
          placeholder: '微博用户名(不需要完整URL)',
          url: 'https://www.weibo.com',
          value: ''
        },
        {
          symbol: 'Telegram',
          type: 'telegram',
          name: 'Telegram',
          placeholder: 'Telegram用户名',
          url: '',
          value: ''
        },
        {
          symbol: 'Twitter',
          type: 'twitter',
          name: 'Twitter',
          placeholder: 'Twitter用户名(不需要完整URL)',
          url: 'https://twitter.com',
          value: ''
        },
        {
          symbol: 'Facebook',
          type: 'facebook',
          name: 'Facebook',
          placeholder: 'Facebook用户名(不需要完整URL)',
          url: 'https://facebook.com',
          value: ''
        },
        {
          symbol: 'Github',
          type: 'github',
          name: 'Github',
          placeholder: 'Github用户名(不需要完整URL)',
          url: 'https://github.com',
          value: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUserInfo'])
  },
  watch: {
    // 监听内容修改 如果内容改动则改变setProfile
    newNickName(newVal) {
      if (
        newVal !== this.nickname ||
        this.introduction !== this.newIntroduction
      )
        this.setProfile = true
      else this.setProfile = false
    },
    // 监听内容修改 如果内容改动则改变setProfile
    newIntroduction(newVal) {
      if (
        newVal !== this.introduction ||
        this.nickname !== this.newNickName
      )
        this.setProfile = true
      else this.setProfile = false
    },
    about: {
      deep: true,
      handler() {
        if (JSON.stringify(this.linksData.websites) !== JSON.stringify(this.about))
          this.aboutModify = true
        else this.aboutModify = false
      }
    },
    social: {
      deep: true,
      handler() {
        for (const item of this.social) {
          const oSocial = this.linksData.socialAccounts.find(age => age.type === item.type)
          if (oSocial == null) {
            if (item.value !== '') {
              this.socialModify = true
              return
            }
          } else if (oSocial.value !== item.value) {
            this.socialModify = true
            return
          }
        }
        this.socialModify = false
      }
    }
  },
  created() {
    this.refreshUser()
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    checkSaveParams() {
      // 中文 字母 数字 1-12
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,12}$/
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!reg.test(this.newNickName)) {
        throw this.$t('rule.strEnglishNumber', ['1-12'])
      }
      if (this.newIntroduction.length > 20) {
        throw this.$t('rule.profileNotExceedStr', ['20'])
      }
      if (this.newEmail !== '' && !regEmail.test(this.newEmail)) {
        throw this.$t('rule.emailMessage')
      }
    },
    myToasted(message) {
      this.$toast({ duration: 1000, message })
    },
    async save() {
      // 如果没有改动返回上一页
      if (!this.setProfile && !this.aboutModify && !this.socialModify) return this.$router.go(-1)
      if (this.loading) return

      const saveProfile = async () => {
        if (!this.setProfile) return

        this.checkSaveParams()

        const requestData = {
          nickname: this.newNickName,
          introduction: this.newIntroduction
        }
        if (this.newNickName === this.nickname) delete requestData.nickname
        if (this.newIntroduction === this.introduction) delete requestData.introduction

        await this.$API.setProfile(requestData)

        this.setProfile = false
        this.nickname = this.newNickName
      }
      const saveLinks = async () => {
        if (!this.aboutModify && !this.socialModify) return

        const requestData = {
          websites: this.about.filter(Boolean),
          socialAccounts: (() => {
            const nSocial = {}
            this.social.forEach(item => {
              if (item.value && item.value !== '') {
                nSocial[item.type] = item.value
              }
            })
            return nSocial
          })()
        }

        await this.$API.setUserLinks(requestData)

        this.aboutModify = false
        this.socialModify = false
      }

      this.loading = true
      try {
        await Promise.all([saveProfile(), saveLinks()])

        // !!! 该方法会导致内容监听失效 !!!
        // this.$navigation.cleanRoutes() // 清除路由记录

        this.refreshUser()
        this.$toast.success({
          duration: 1000,
          message: this.$t('success.success')
        })
      } catch (error) {
        console.log(error)
        let message

        if (typeof error === 'string') {
          message = error
        } else if (error.response && error.response.data) {
          message = error.response.data.message
        } else {
          message = this.$t('error.fail')
        }

        this.$toast.fail({
          duration: 1000,
          message: this.$t(message)
        })
      } finally {
        this.loading = false
      }
    },
    async refreshUser() {
      this.loading = true
      const setUser = data => {
        this.nickname = data.nickname
        this.newNickName = this.nickname || data.username
        this.introduction = data.introduction
        this.newIntroduction = this.introduction
        this.setAvatarImage(data.avatar)
      }
      const setLinks = data => {
        this.linksData = data
        this.about = [...(data.websites.length !== 0 ? data.websites : [''])]
        data.socialAccounts.forEach(item => {
          this.social.find(age => age.type === item.type).value = item.value
        })
      }

      let userData = null
      try {
        userData = await this.getCurrentUser()
      } catch (error) {
        this.$toast.fail({
          duration: 1000,
          message: '获取当前用户信息失败'
        })
        console.log('error', error)
        this.loading = false
      }
      setUser(userData)

      try {
        const res = await this.$API.getUserLinks({
          id: this.currentUserInfo.id
        })
        if (res.code === 0) {
          setLinks(res.data)
        } else console.log('获取用户信息失败', res.message)
      } catch (error) {
        console.log(`获取用户信息失败${error}`)
      }
      this.loading = false
    },
    setAvatarImage(hash) {
      if (hash) this.avatar = this.$ossProcess(hash)
    },
    // 完成上传
    async doneImageUpload(res) {
      this.refreshUser()
      this.imgUploadDone += Date.now()
    },
    aboutAdd() {
      if (this.about.length >= 5) return
      this.about.push('')
    },
    abountLess(i) {
      if (this.about.length <= 1) return
      this.about.splice(i, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.edit-user {
  background-color: #f1f1f1;
  min-height: 100%;
  padding-top: 45px;
}
.edit-card {
  //background:rgba(255,255,255,1);
  &-list {
    margin-bottom: 10px;
    background: #ffffff;
    .card-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 18px 20px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }
      input {
        flex: 1;
        text-align: right;
        border: none;
        background: transparent;
        outline: none;
        overflow: hidden;
        padding-left: 10px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.7);
        &::placeholder {
          font-size: 14px;
          font-weight: 500;
          color: #b2b2b2;
        }
      }
    }
  }
}
.note {
  font-size: 14px;
  font-weight: 500;
  color: #b2b2b2;
}

.imgcard {
  width: 70px;
  height: 70px;
  flex: 0 0 70px;
  .user-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .camera {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
}
.done-button {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
  &.no-modify {
    color: rgba(0, 0, 0, 1);
  }
}
.about-input-btn {
  width: 24px;
  height: 24px;
  background-color: #542de0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin: 0 0 0 10px;
  cursor: pointer;
  &.add {
    margin-left: 56px;
  }
}
.social-icons {
  div {
    width: 25px;
    height: 25px;
    font-size: 17px;
    margin-right: 10px;
  }
}
</style>
