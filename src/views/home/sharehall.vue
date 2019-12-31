<template>
  <div class="sharehall">
    <home-head @login="showSidebar = true" />
    <h3 class="sharehall-title">分享文章</h3>
    <div class="push">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="" prop="content">
          <el-input size="mini" type="textarea" rows="4" placeholder="谈谈感想" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="" prop="url">
          <div class="input-line">
            <!-- 为了使用from的验证功能, 不能用css实现下划线聚焦了 用js解决 -->
            <el-input size="mini" class="push-input" @focus="focusInput" @blur="blurInput" v-model="ruleForm.url" placeholder="输入链接，包含http(s)://"></el-input>
            <el-button type="primary" size="mini" class="btn-black">
              <svg-icon icon-class="enter" class="icon" />
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <shareOuterCard class="list-card" v-for="item in 2" :key="'shareOuterCard' + item"></shareOuterCard>
          <shareInsideCard class="list-card" v-for="item in 1" :key="'shareInsideCard' + item"></shareInsideCard>
        </el-form-item>
        <el-form-item>
          <div class="push-btn">
            <el-button type="primary"  @click="submitForm('ruleForm')" class="btn-black" size="mini">
              <svg-icon icon-class="edit" class="icon" />
              发布
            </el-button>
          </div>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <h3 class="sharehall-title">分享大厅</h3>
    <shareCard class="list-card" v-for="item in 3" :key="'shareCard' + item"></shareCard>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>

<script>
import homeHead from './components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
import shareCard from '@/components/share_card/index.vue'
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
      if (new RegExp('[a-zA-z]+://[^\s]*').test(this.ruleForm.url)) {
        callback()
      } else {
        callback(new Error('请输入包含http(s)://的链接地址'))
      }
    }
    return {
      showSidebar: false,
      ruleForm: {
          content: '',
          url: '',
        },
        rules: {
          content: [
            { required: true, message: '请填写感想', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请填写链接地址', trigger: 'blur' },
            { validator: httpTest, trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    focusInput(e) {
      console.log(e)
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