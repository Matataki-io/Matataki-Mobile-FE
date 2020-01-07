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
            <shareInsideCard :card="item" v-if="item.type === 'inside'" class="list-card" :key="'shareInsideCard' + index" :idx="index" @removeShareLink="removeShareLink"></shareInsideCard>
            <shareOuterCard :card="item" v-if="item.type === 'outer'" class="list-card" :key="'shareOuterCard' + index" :idx="index" @removeShareLink="removeShareLink"></shareOuterCard>
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
    <h3 class="sharehall-title">分享大厅</h3>
    <!-- pull list -->
    <shareCard class="list-card" v-for="(item, index) in shareList" :key="index" :card="item"></shareCard>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
import homeHead from './components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import shareCard from '@/components/share_card/index.vue'
import { sleep } from '@/common/methods'
import { getCookie } from '@/utils/cookie'
import { mapGetters } from 'vuex'

export default {
  components: {
    homeHead,
    Sidebar,
    shareOuterCard,
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
      shareList: [],
      fullscreenLoading: false,
      urlLoading: false,
    }
  },
  watch: {
    shareLinkList: {
      deep: true,
      handler() {
        sessionStorage.setItem('shareLink', JSON.stringify(this.shareLinkList))
      }
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
        await sleep(100)
        next()
      }
    }
  },
  created() {
    this.initShareLink()
    this.initUrlInput()
    this.shareListFunc()
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
      let { id, from } = this.$route.query
      if (from === 'share') {
        console.log('share', id)
        this.urlForm.url = id
      }
    },
    // 分享列表
    shareListFunc() {
      this.$API.shareList()
        .then(res => {
          if (res.code === 0) {
            console.log(res)
            this.shareList = res.data.list
          } else {

          }
        }).catch(err => {
          console.log(err)
        })
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
        console.log('currentUserInfo', this.currentUserInfo)
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
        // console.log('data', data)
        // console.log('data1', this.shareLinkList)
        this.shareLinkList.map(i => {
          // 目前只有外展
          if (i.type === 'outer') {
            data.refs.push({
            url: i.url,
            title: i.title,
            summary: i.summary,
            cover: i.cover
          })
          }
        })
        // return false
        this.$API.createShare(data)
          .then(res => {
            console.log(res)
            if (res.code === 0) {
              this.resetForm()
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

        // 自动检测url 获取标题 内容等
        this.urlLoading = true
        this.$API.extractRefTitle({
          url: this.urlForm.url.trim()
        })
          .then(res => {
            if (res.code === 0) {
              console.log(res)
              this.$toast({duration: 1000, message: '检测完成'})
              let { ref_sign_id = 0, title = '', summary = '', cover = '' } = res.data
              console.log(ref_sign_id, typeof ref_sign_id)
              if (Number(ref_sign_id) === 0) {
                this.shareLinkList.push({
                  type: 'outer',
                  cover,
                  title: title || '暂无标题',
                  summary: summary || '暂无内容',
                  url: this.urlForm.url
                })
              } else {
                this.shareLinkList.push({
                  type: 'inside',
                  avatar: 'http://s2.mycomic.cc/imgs/201810/22/12/15401826622251.jpg',
                  username: 'xiaotiandada',
                  content: '继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出进…继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出进…',
                  url: this.urlForm.url
                })
              }
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
    changeInput(val) {
      this.getUrlData('urlForm')
    },
    focusInput(e) {
      e.target.parentElement.parentElement.classList.add('active')
    },
    blurInput(e) {
      e.target.parentElement.parentElement.classList.remove('active')
    }
  }
}
</script>

<style lang="less" scoped>
.sharehall {
  padding: 46px 20px 20px;
  min-height: 100%;
  background-color: #fff;
}

.sharehall-title {
  font-size:14px;
  color:rgba(0,0,0,1);
  line-height:20px;
  margin: 20px 0 14px;
}

.push {
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