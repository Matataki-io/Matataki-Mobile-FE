<template>
  <div class="tokens">
    <BaseHeader
      :has-bottom-border-line="true"
      :pageinfo="{ title: '明细' }"
      customize-header-bc="#fff"
    />
    <div class="tokens-head">
      <div class="fl jsb">
        <div class="info">
          <router-link :to="{ name: 'token-id', params: { id: tokenDetail.id } }">
            <avatar :src="cover" size="30px" />
          </router-link>
          <div class="user-info">
            <h3>{{ tokenDetail.symbol || '' }}</h3>
            <h4>{{ tokenDetail.name || '' }}</h4>
          </div>
        </div>
        <div class="number">{{ tokenAmount(tokenDetail.total_supply) || 0 }}</div>
      </div>
      <div class="fl jsb publish-tokens">
        <div class="username">创始人：{{ userDetail.nickname || userDetail.username }}</div>
        <router-link class="jump" :to="{ name: 'user-id', params: { id: userDetail.id } }">
          <svg-icon icon-class="share"></svg-icon>
        </router-link>
      </div>
    </div>
    <BasePull
      :params="pointLog.params"
      :api-url="pointLog.apiUrl"
      loading-text="暂无"
      :is-obj="{ type: 'newObject', key: 'data', keys: 'list' }"
      :need-access-token="true"
      :auto-request-time="0"
      :reload="reload"
      @getListData="getListData"
    >
      <card v-for="item in pointLog.list" :key="item.id" :card="item"></card>
    </BasePull>
    <div class="fixed-bottom">
      <el-button class="fix-button" @click="showGift">赠送</el-button>
      <router-link :to="{ name: 'exchange', hash: '#swap', query: { output: tokenDetail.symbol } }">
        <el-button class="fix-button" type="primary">交易</el-button>
      </router-link>
    </div>

    <el-dialog
      title="赠送Fan票"
      :visible.sync="giftDialog"
      width="90%"
      :before-close="giftDialogClose"
    >
      <el-form
        ref="form"
        v-loading="transferLoading"
        :model="form"
        label-width="70px"
        class="gift-form"
        :rules="rules"
      >
        <el-form-item label="Fan票">
          <p class="tokenname">
            {{ form.tokenname }}
          </p>
        </el-form-item>
        <el-form-item label="接受对象">
          <el-input
            v-model="form.username"
            placeholder="请输入赠送的对象"
            size="medium"
            @keyup.enter.native="searchUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="form.userId" label="" prop="">
          <div class="avatar-content">
            <avatar class="gift-avatar" :src="form.useravatar" size="60px" />
            <div class="gift-ful" @click="closeUser">
              <i class="el-icon-close" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="发送数量" prop="tokens">
          <el-input
            placeholder="请输入内容"
            v-model="form.tokens"
            :max="form.max"
            :min="form.min"
            size="small"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('form')">
            确定
          </el-button>
          <el-button size="small" @click="formClose">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import card from './components/tokens_detail_card.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    card,
    avatar
  },
  data() {
    let validateToken = (rule, value, callback) => {
      if (Number(value) < this.form.min) {
        callback(new Error('发送数量不能少于0.0001'))
      } else if (Number(value) > this.form.max) {
        callback(new Error(`发送数量不能大于${this.form.max || 99999999}`))
      } else {
        callback()
      }
    }
    return {
      tokenDetail: Object.create(null),
      userDetail: Object.create(null),
      pointLog: {
        params: {
          tokenId: this.$route.params.id
        },
        apiUrl: 'tokenUserLogs',
        list: []
      },
      giftDialog: false,
      form: {
        tokenname: '',
        username: '',
        useravatar: '',
        userId: '',
        tokenId: '',
        tokens: 1,
        min: 0.0001,
        max: 99999999 // 默认最大
      },
      rules: {
        tokens: [
          { validator: validateToken, trigger: 'blur' }
        ]
      },
      reload: 0,
      transferLoading: false
    }
  },
  computed: {
    cover() {
      return this.tokenDetail.logo ? this.$API.getImg(this.tokenDetail.logo) : ''
    }
  },
  methods: {
    getListData(res) {
      console.log(res)
      this.tokenDetail = res.data.data.tokenDetail
      this.userDetail = res.data.data.userDetail
      this.pointLog.list = res.list
    },
    tokenAmount(amount) {
      const tokenamount = precision(amount, 'CNY', this.tokenDetail.decimals)
      return this.$publishMethods.formatDecimal(tokenamount, 4)
    },

    transferMinetoken() {
      this.transferLoading = true
      const data = {
        tokenId: this.form.tokenId,
        to: this.form.userId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals)
      }
      this.$API
        .transferMinetoken(data)
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.$message.success(res.data.message)
            this.reload = Date.now()
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('赠送token失败')
        })
        .finally(() => {
          this.transferLoading = false
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.userId && this.form.tokenId) this.transferMinetoken()
          else {
            this.$message.warning('请选择用户')
          }
        } else return false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formEmpty() {
      this.form.tokenname = ''
      this.form.username = ''
      this.form.useravatar = ''
      this.form.userId = ''
      this.form.tokenId = ''
      this.form.decimals = ''
      this.form.tokens = 1
      this.form.max = 99999999
      this.$refs.form.resetFields()
    },
    giftDialogClose(done) {
      this.formEmpty()
      done()
    },
    formClose() {
      this.giftDialog = false
      this.formEmpty()
    },
    closeUser() {
      this.form.userId = ''
      this.form.useravatar = ''
    },
    async searchUser() {
      if (!this.form.username.trim()) return this.$message.warning('用户名不能为空')
      this.transferLoading = true
      await this.$backendAPI
        .searchUsername(this.form.username.trim())
        .then(res => {
          if (res.status === 200 && res.data.code === 0) {
            console.log(res)
            this.form.useravatar = res.data.data.avatar
              ? this.$API.getImg(res.data.data.avatar)
              : ''
            this.form.userId = res.data.data.id
          } else return this.$message.warning(res.data.message)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.transferLoading = false
          console.log(this.transferLoading)
        })
    },
    showGift() {
      if (!this.tokenDetail.id) return this.$toast({ duration: 1000, message: '请稍后重试' })
      let { symbol, id: tokenId, total_supply: amount, decimals } = this.tokenDetail

      // console.log(Math.floor(Number(amount)))
      this.form.tokenname = symbol
      this.form.tokenId = tokenId
      this.form.decimals = decimals
      this.form.max = Number(amount)
      this.giftDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.tokens {
  background-color: #fff;
  padding: 45px 0 140px 0;
  min-height: 100%;
}
.tokens-head {
  padding: 20px;
  border-bottom: 1px solid #ececec;
  .info {
    display: flex;
    align-items: center;
  }
  .user-info {
    margin-left: 10px;
    h3 {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 17px;
    }
    h4 {
      font-size: 12px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      line-height: 17px;
    }
  }
  .username {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .number {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 20px;
  }
  .publish-tokens {
    margin-top: 10px;
  }
  .jump {
    background: rgba(241, 241, 241, 1);
    width: 20px;
    height: 20px;
    color: #b2b2b2;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.fixed-bottom {
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px 15px 20px;
  box-shadow: 0px -4px 16px 0px rgba(0, 0, 0, 0.1);
  height: 130px;
  .fix-button {
    width: 100%;
    margin: 5px 0;
  }
}

.gift-form {
  .tokenname {
    padding: 0;
    margin: 0;
  }
}
.gift-avatar {
  border: 1px solid #ececec;
}
.avatar-content {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -20px;
    align-items: center;
    justify-content: center;
    color: #8c8c8c;
    font-size: 20px;
  }
}
</style>
