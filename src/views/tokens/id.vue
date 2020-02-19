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
            <avatar :src="cover" />
          </router-link>
          <div class="user-info">
            <h3>{{ tokenDetail.symbol || '' }}</h3>
            <h4>{{ tokenDetail.name || '' }}</h4>
          </div>
        </div>
        <div class="number">{{ userBalance || 0 }}</div>
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

    <m-dialog v-model="giftDialog" width="90%" title="赠送Fan票" class="transfer-dialog">
      <el-form
        ref="form"
        v-loading="transferLoading"
        :model="form"
        label-width="70px"
        class="gift-form"
        :rules="rules"
      >
        <el-form-item label="Fan票">
          <p class="tokenname">{{ form.tokenname }}</p>
        </el-form-item>
        <el-form-item label="接受对象">
          <el-input
            v-model="form.username"
            placeholder="请输入赠送的对象"
            size="small"
            style="z-index: 2;"
          />
          <!-- 常用候选对象列表 -->
          <template v-if="historyUser.length !== 0">
            <el-tag
              v-for="item in historyUser"
              :key="item.id"
              @click="continueUser(item)"
              type="info"
              class="history-user__tag"
            >
              {{
              (item.nickname || item.username).length > 20
              ? `${(item.nickname || item.username).slice(0, 20)}...`
              : item.nickname || item.username
              }}
            </el-tag>
          </template>
          <!-- 搜索结果 -->
          <div v-if="searchUserList.length !== 0 && $utils.isNull(toUserInfo)" class="transfer—search__list">
            <div v-for="item in searchUserList" :key="item.id" @click="continueUser(item)">
              <avatar :src="searchUserAvatar(item.avatar)" class="transfer—search__list__avatar" />
              <span
                v-html="searchUserTitle(item.nickname || item.username)"
                class="search-result__tag"
              />
            </div>
          </div>
        </el-form-item>
        <!-- 结果 -->
        <transition name="result">
          <el-form-item v-if="!$utils.isNull(toUserInfo)" label="" prop="">
            <router-link :to="{name: 'user-id', params: {id: toUserInfo.id}}" class="search-user" target="_blank">
              <avatar :src="searchUserAvatar(toUserInfo.avatar)" class="search-user-avatar" />
              <span v-html="searchUserTitle(toUserInfo.nickname || toUserInfo.username)" class="search-result__tag " />
              <div @click="closeUser" class="gift-ful">
                <i class="el-icon-close" />
              </div>
            </router-link>
          </el-form-item>
        </transition>
        <el-form-item label="发送数量" prop="tokens">
          <el-input
            placeholder="请输入内容"
            v-model="form.tokens"
            :max="form.max"
            :min="form.min"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
        <p v-if="form.balance" class="balance">
          余额&nbsp;{{ form.balance }}&nbsp;
          <a
            @click="form.tokens = form.balance"
            href="javascript:;"
          >全部转入</a>
        </p>
        <el-form-item>
          <div class="form-button">
            <el-button :disabled="$utils.isNull(toUserInfo)" @click="submitForm('form')" type="primary" size="small">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </m-dialog>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import card from './components/tokens_detail_card.vue'
import { precision, toPrecision } from '@/utils/precisionConversion'
import { xssFilter } from '@/utils/xss'
import avatar from '@/common/components/avatar'
import utils from '@/utils/utils'

export default {
  components: {
    card,
    avatar
  },
  data() {
    let validateToken = (rule, value, callback) => {
      if (!/^[0-9]+(\.[0-9]{1,4})?$/.test(value)) {
        callback(new Error('发送的数量小数不能超过4位'))
      } else if (Number(value) < this.form.min) {
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
      userBalance: 0,
      giftDialog: false,
      form: {
        tokenname: '',
        username: '',
        useravatar: '',
        userId: '',
        tokenId: '',
        tokens: '',
        min: 0.0001,
        max: 99999999, // 默认最大
        balance: 0
      },
      rules: {
        tokens: [{ validator: validateToken, trigger: 'blur' }]
      },
      reload: 0,
      transferLoading: false,
      searchUserList: [], // 搜索结果
      toUserInfo: null, // 转让的对象
      historyUser: [] // 历史转让用户
    }
  },
  computed: {
    cover() {
      return this.tokenDetail.logo
        ? this.$ossProcess(this.tokenDetail.logo)
        : ''
    },
    searchUserName() {
      return this.form.username
    }
  },
  watch: {
    giftDialog(newVal) {
      if (newVal) {
        this.historyUserFunc('post')
      } else {
        this.formEmpty()
      }
    },
    searchUserName: {
      deep: true,
      immediate: true,
      handler: function() {
        this.searchUser()
      }
    }
  },
  mounted() {
    this.getUserBalance()
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

      const toUserInfo = this.toUserInfo
      if (this.$utils.isNull(toUserInfo)) return

      const toId = this.$utils.isNull(toUserInfo) ? -1 : toUserInfo.id

      this.transferLoading = true
      const data = {
        tokenId: this.form.tokenId,
        to: toId,
        amount: toPrecision(this.form.tokens, 'CNY', this.form.decimals)
      }
      this.$API
        .transferMinetoken(data)
        .then(res => {
          console.log('res', res)
          if (res.code === 0) {
            this.$message.success(res.message)
            this.reload = Date.now()

            // 和pc端不一样 重新获取一次user balance
            this.getUserBalance()
          } else {
            this.$message.error(res.message)
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
          if (this.$utils.isNull(this.toUserInfo)) {
            this.$message.warning('请选择用户')
          } else {
            this.transferMinetoken()
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
      this.form.tokens = ''
      this.form.max = 99999999
      this.form.balance = 0
      this.$refs.form.resetFields()

      this.searchUserList = [] // 搜索结果
      this.toUserInfo = null
    },
    closeUser(e) {
      if (e && e.preventDefault) e.preventDefault()
      else if (e && e.stopPropagation) e.stopPropagation()
      this.toUserInfo = null
      this.searchUserList = []
      return false
    },
    searchUser: debounce(function() {
      const searchName = this.form.username.trim()
      if (!searchName) return

      this.toUserInfo = null

      const params = {
        word: searchName,
        pagesize: 10
      }

      this.$API
        .search('user', params)
        .then(res => {
          if (res.code === 0) {
            this.searchUserList = res.data.list
            if (res.data.list.length === 0) {
              // 没有结果
              this.$message.warning('没有搜索结果')
            }
          } else {
            // 失败
            this.$message.warning(res.message)
          }
        })
        .catch(err => {
          // 出错
          console.log(err)
          this.searchUserList = []
        })
    }, 300),
    showGift() {
      if (!this.tokenDetail.id)
        return this.$toast({ duration: 1000, message: '请稍后重试' })
      let {
        symbol,
        id: tokenId,
        total_supply: amount,
        decimals
      } = this.tokenDetail

      // console.log(Math.floor(Number(amount)))
      this.form.tokenname = symbol
      this.form.tokenId = tokenId
      this.form.decimals = decimals

      this.form.max = this.userBalance
      this.form.balance = this.userBalance

      this.giftDialog = true
    },
    getUserBalance() {
      if (!this.$route.params.id) return
      this.$API.getUserBalance(Number(this.$route.params.id)).then(res => {
        if (res.code === 0) {
          const balance = parseFloat(utils.fromDecimal(res.data, 4))

          this.userBalance = balance

          this.form.max = balance
          this.form.balance = balance
        }
      })
    },
    continueUser(val) {
      this.toUserInfo = val
    },
    searchUserAvatar(src) {
      return src ? this.$ossProcess(src, { h: 60 }) : ''
    },
    searchUserTitle(html) {
      return html ? xssFilter(html) : ''
    },
    // 获取常用用户列表
    historyUserFunc(type) {
      this.$API.historyUser({
        type
      }).then(res => {
        if (res.code === 0) {
          this.historyUser = res.data.slice(0, 10)
        } else {
          console.log(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
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

.balance {
  padding: 0;
  margin: 0 0 40px 70px;
  font-size: 14px;
  font-weight: 400;
  color: #777777;
  word-spacing: 1px;
  a {
    font-size: 14px;
    color: #542de0;
    cursor: pointer;
  }
}
.form-button {
  display: flex;
  justify-content: flex-end;
  button {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.transfer—search__list {
  position: absolute;
  left: 0;
  right: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #b2b2b2;
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 1;
  padding: 4px 0 0 0;
  &__avatar {
    margin-right: 10px;
    flex: 0 0 30px;
  }
  & > div {
    width: 100%;
    margin: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &:hover {
      background: #f1f1f1;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 178, 178, 1);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}

.search-user {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-top: 10px;
  &-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    flex: 0 0 40px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .gift-ful {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
  }
}

// result transition
.result-enter-active,
.result-leave-active {
  transition: opacity 0.2s;
}
.result-enter,
.result-leave-to {
  opacity: 0;
}

// history user
.history-user__tag {
  cursor: pointer;
  margin: 0 10px 0 0;
}

</style>
