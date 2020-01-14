<template>
  <div class="sharehall">
    <home-head @login="showSidebar = true" />
    <div style="height: 20px;"></div>
    <!-- <h3 class="sharehall-title">分享文章</h3> -->
    <div class="push">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="" prop="content">
          <el-input ref="shareContent" size="mini" type="textarea" rows="4" placeholder="谈谈感想" v-model="ruleForm.content"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="urlForm" :rules="urlRules" ref="urlForm" @submit.native.prevent>
        <el-form-item label="" prop="url">
          <div class="input-line">
            <!-- 为了使用from的验证功能, 不能用css实现下划线聚焦了 用js解决 -->
            <el-input size="mini" class="push-input" @focus="focusInput" @blur="blurInput" @change="changeInput" v-model="urlForm.url" placeholder="输入链接，包含http(s)://"></el-input>
            <el-button type="primary" size="mini" class="btn-black" @click="getUrlData('urlForm')" v-loading="urlLoading">
              <svg-icon icon-class="enter" class="icon" />
            </el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="shareLinkList.length !== 0">
          <template v-for="(item, index) in shareLinkList">
            <shareOuterCard :card="item" v-if="item.ref_sign_id === 0" class="list-card" :key="'shareInsideCard' + index" :idx="index" @removeShareLink="removeShareLink"></shareOuterCard>
            <sharePCard :card="item" v-else-if="item.ref_sign_id !== 0 && item.channel_id === 1" class="list-card" :key="'shareInsideCard' + index" :idx="index" @removeShareLink="removeShareLink"></sharePCard>
            <shareInsideCard :card="item" v-else-if="item.ref_sign_id && item.channel_id === 3" class="list-card" :key="'shareOuterCard' + index" :idx="index" @removeShareLink="removeShareLink"></shareInsideCard>
          </template>
        </el-form-item>
        <el-form-item>
          <div class="push-btn">
            <el-button type="primary" @click="pushShare('ruleForm')" class="btn-black" size="mini" v-loading.fullscreen.lock="fullscreenLoading">
              <svg-icon icon-class="edit" class="icon" />
              发布
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 100%;height: 1px;" ref="head"></div>
    <div class="sharehall-head" :class="shareHeadActive && 'active'">
      <h3 class="sharehall-title">分享大厅</h3>
      <div class="sort">
        <span @click="value = options[0].value" :class="value === options[0].value && 'active'">{{ options[0].label }}</span>
        &nbsp;/&nbsp;
        <span @click="value = options[1].value" :class="value === options[1].value && 'active'">{{ options[1].label }}</span>
      </div>
    </div>
    <!-- pull list -->

    <BasePull
      class="pull"
      :params="pull.params"
      :api-url="pull.apiUrl"
      :loading-text="$t('not')"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="pull.time"
      @getListData="getListData"
    >
      <shareCard class="list-card" v-for="(item, index) in pull.list" :key="index" :card="item" @refClick="refClick" @ref="ref"></shareCard>
    </BasePull>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
import homeHead from './components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import sharePCard from '@/components/share_p_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import shareCard from '@/components/share_card/index.vue'
import { sleep } from '@/common/methods'
import { getCookie } from '@/utils/cookie'
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'

export default {
  components: {
    homeHead,
    Sidebar,
    shareOuterCard,
    sharePCard,
    shareInsideCard,
    shareCard
  },
  data() {
    let httpTest = (rule, value, callback) => {
      if (new RegExp('[a-zA-z]+://[^\s]*').test(this.urlForm.url)) {
        callback()
      } else {
        callback(new Error('请输入包含http(s)://的链接地址'))
      }
    }
    return {
      showSidebar: false,
      ruleForm: {
        content: '',
      },
      urlForm: {
        url: '',
      },
      rules: {
        content: [
          { required: true, message: '请填写感想', trigger: 'blur' }
        ],
      },
      urlRules: {
        url: [
          { required: true, message: '请填写链接地址', trigger: 'change' },
          { validator: httpTest, trigger: 'change' }
        ]
      },
      shareLinkList: [
        // {
        //   type: 'inside',
        //   type: 'outer',
        // }
      ],
      fullscreenLoading: false,
      urlLoading: false,
      options: [ // 排序
        {
          value: 'time',
          label: '最新'
        },
        {
          value: 'hot',
          label: '最热'
        },
      ],
      value: this.$route.query.type || 'time', // 排序
      pull: { // 分页
        params: {
          type: this.$route.query.type || 'time',
          pagesize: 20
        },
        time: 0,
        apiUrl: 'share',
        list: []
      },
      shareHeadActive: false, // 导航是否到顶部
    }
  },
  watch: {
    shareLinkList: {
      deep: true,
      handler() {
        sessionStorage.setItem('shareLink', JSON.stringify(this.shareLinkList))
      }
    },
    value(newVal) {
      if (newVal === 'hot') {
        this.pull.params.type = 'hot'
      } else if (newVal === 'time') {
        this.pull.params.type = 'time'
      } else {
        this.pull.params.type = 'hot'
      }
      this.$router.push({
        query: {
          type: newVal
        }
      })
      this.pull.time = Date.now()
      this.pull.list.length = 0
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (this.shareLinkList.length === 0) {
      next()
    } else {
      try {
        await this.$confirm('您有分享未发布，是否发布了再离开？', '提示', {
          confirmButtonText: '去发布',
          cancelButtonText: '不要了',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          customClass: 'message-box__mobile'
        })
        this.$refs.shareContent.focus()
        next(false)
      } catch (error) {
        this.$navigation.cleanRoutes() // 清除路由记录
        sessionStorage.removeItem('shareLink')
        sessionStorage.removeItem('shareRef')
        await sleep(100)
        next()
      }
    }
  },
  created() {
    this.initShareLink()
    this.$nextTick(() => {
      this.initUrlInput()
    })
  },
  mounted() {
    window.addEventListener('scroll', throttle(this.shareHeadSetClass, 300))
  },
  destroyed() {
    window.removeEventListener('scroll', this.shareHeadSetClass)
  },
  computed: {
    ...mapGetters(['currentUserInfo', 'isLogined']),
  },
  methods: {
    initShareLink() {
      let shareLink = sessionStorage.getItem('shareLink')
      let shareLinkParse = JSON.parse(shareLink)
      // console.log('shareLinkParse', shareLinkParse)
      this.shareLinkList = Array.isArray(shareLinkParse) ? shareLinkParse : []

      console.log(shareLink, this.shareLinkList)
    },
    initUrlInput() {
      let id = sessionStorage.getItem('shareRef')
      if (id) {
        this.urlForm.url = `${process.env.VUE_APP_URL}/share/${id}`
        this.getUrlData('urlForm')
      }
    },
    // 初始化所有表单内容
    resetForm() {
      this.ruleForm.content = ''
      this.urlForm.url = ''
      this.shareLinkList = []
      this.$refs['ruleForm'].resetFields()
      this.$refs['urlForm'].resetFields()
    },
    setpFunc(formName) {
      return new Promise(resolve => this.$refs[formName].validate(valid => resolve(valid)))
    },
    // 发布分享
    async pushShare(formName) {
      if (await this.setpFunc(formName)) {
        // console.log('currentUserInfo', this.currentUserInfo)
        if (!this.isLogined) return this.$store.commit('setLoginModal', true)
        if (this.shareLinkList.length <= 0) return this.$toast({ duration: 1000, message: '分享引用不能为空'})
        // 平台检测
        let idProvider = getCookie('idProvider')
        if (!idProvider) {
          this.$toast({ duration: 1000, message: '发生错误, 请您重新登录'})
          this.$store.commit('setLoginModal', true)
          return false
        }
        let { name: author = '' } = this.currentUserInfo
        this.fullscreenLoading = true
        let data = {
            author,
            content: this.ruleForm.content.trim(),
            platform: idProvider.toLocaleLowerCase(),
            refs: []
        }
        this.shareLinkList.map(i => {
          // 目前只有外展
          data.refs.push({
            url: i.url,
            title: i.title,
            summary: i.summary,
            cover: i.cover
          })
        })
        // return false
        this.$API.createShare(data)
          .then(res => {
            if (res.code === 0) {
              this.resetForm()
              this.pull.time = Date.now()
              this.$toast.success({duration: 500, message: '发布成功'})
            } else {
              this.$toast.fail({duration: 500, message: '发布失败'})
            }
          }).catch(err => {
            console.log(err)
            this.$toast.fail({duration: 500, message: '发布失败'})
          }).finally(() => {
            this.fullscreenLoading = false
          })
      }
    },
    // 获取链接内容
    async getUrlData(formName) {
      if (await this.setpFunc(formName)) {
        if (!this.isLogined) return this.$store.commit('setLoginModal', true)
        if (this.urlLoading) return // 拦截重复请求
        let url = this.urlForm.url.trim()

        const urlIncludes = (url, arr) => {
          return arr.filter(i => i.url === url).length !== 0
        }

        if (urlIncludes(url, this.shareLinkList)) return this.$toast({duration: 1000, message: '不能引用重复的内容'})

        // 自动检测url 获取标题 内容等
        this.urlLoading = true
        this.$API.extractRefTitle({ url })
          .then(res => {
            if (res.code === 0) {
              this.$toast({duration: 1000, message: '检测完成'})
              res.data.url = url
              this.shareLinkList.push(res.data)
              // 清空数据
              this.urlForm.url = ''
              this.$refs[formName].resetFields()
            } else {
              this.$toast.fail(res.message)
            }
          }).catch(err => {
            console.log('获取信息失败', err)
          }).finally(() => {
            this.urlLoading = false
          })
      }
    },
    removeShareLink(i) {
      this.shareLinkList.splice(i, 1)
    },
    // 输入框改变
    changeInput(val) {
      this.getUrlData('urlForm')
    },
    // url 输入框聚焦
    focusInput(e) {
      e.target.parentElement.parentElement.classList.add('active')
    },
    // url 输入框失焦
    blurInput(e) {
      e.target.parentElement.parentElement.classList.remove('active')
    },
    // 引用
    refClick(card) {
      this.urlForm.url = `${process.env.VUE_APP_URL}/share/${card.id}`
      this.getUrlData('urlForm')
    },
    ref(val) {
      this.urlForm.url = val
      this.getUrlData('urlForm')
    },
    getListData(res) {
      console.log('res1', res)
      this.pull.list = res.list
    },
    shareHeadSetClass() {
      this.$nextTick(() => {
        try {
          let headOffsetTop = this.$refs.head.offsetTop
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          if (scrollTop >= headOffsetTop) this.shareHeadActive = true
          else this.shareHeadActive = false
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sharehall {
  padding: 46px 0 20px;
  min-height: 100%;
  background-color: #fff;
}
.sharehall-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 4px;
  padding: 10px 20px;
  position: sticky;
  top: 45px;
  background: #fff;
  z-index: 9;
  box-sizing: border-box;
  &.active {
    border-bottom: 0.0625rem solid #eaeaea;
    box-shadow: 0 0 10px 4px rgba(0,0,0,.08);
  }
}
.sharehall-title {
  font-size:14px;
  color:rgba(0,0,0,1);
  line-height:20px;
}

.push {
  padding: 0 20px;
  .input-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border-bottom: 1px solid #dbdbdb;
    transition: all .1s;
    &.active {
      border-color: #542DE0;
    }
  }
}
.list-card {
  margin-top: 20px;
  &:nth-child(1) {
    margin-top: 0;
  }
}

.sort {
  display: flex;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    &.active {
      font-weight: bold;
      color: @purpleDark;
    }
  }
}
.pull {
  padding: 0 20px;
}
</style>

<style lang="less">
.push {
  &-input input {
    border: none;
    flex: 1;
  }
}

.btn-black {
  background-color: #000;
  color: #fff;
  border-color: #000;
  &:hover, &:active, &:focus {
    background-color: #000;
    border-color: #000;
    color: #fff;
  }
}

.push-btn {
  display: flex;
  justify-content: flex-end;
}
</style>