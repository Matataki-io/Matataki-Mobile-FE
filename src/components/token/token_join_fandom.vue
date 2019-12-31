<template>
  <div class="fandom-card">
    <div class="fl">
    <h2 class="token-title">
      加入{{tokenSymbol}}粉丝群
    </h2>
    <a @click="showHelp = true" class="help-click">入群指南 <i class="el-icon-arrow-right"></i></a>
    </div>
    <!-- 列表 -->
    <div v-for="(fandom, index) in fandomList" :key="index" class="fl fandom-unit">
      <div class="fandom-text">
        <h2>
          {{fandom.name}}
          <span>（已有{{fandom.people}}人）</span>
        </h2>
        <p class="condition">
          持有的{{tokenSymbol}}票>{{fandom.minBalance}}即可加群
        </p>
      </div>
      <div>
        <el-button v-if="!isLogined || fandom.minBalance <= balance" class="add-button top10" @click="addFandom(fandom)" size="small">加群</el-button>
        <div v-else class="disable top10">持票不足</div>
      </div>
    </div>
    <!-- 展开更多 -->
    <div v-if="fandomData.length > 1" class="expand-page">
      <a v-if="isExpand" @click="isExpand = false">
        收起列表
        <svg-icon class="svg-top" icon-class="arrow_down" />
      </a>
      <a v-else @click="isExpand = true">
        查看更多
        <svg-icon icon-class="arrow_down" />
      </a>
    </div>

    <el-dialog width="92%" title="入群指南" :visible.sync="showHelp" center>
      <p class="subtitle">根据以下步骤操作加入Fan票的粉丝群</p>
      <div class="fl help-step top">
        <div class="help-text">
          <h3>步骤
            <div class="help-serial">1</div>
              </h3>
          <p class="introduction">绑定Telegram账号</p>
          <p>仅需要绑定一次</p>
        </div>
        <div class="help-touch" v-if="bindStatus">
          <a @click="accountSettings()">
            账号变更
            <i class="el-icon-arrow-right"></i>
          </a>
          <div class="disable top20">已绑定</div>
        </div>
        <div class="help-touch" v-else>
          <el-button class="add-button top40" @click="setTelegram()">绑定</el-button>
        </div>
      </div>
      <div class="fl help-step">
        <div class="help-text">
          <h3>步骤
            <div class="help-serial">2</div>
          </h3>
          <p class="introduction">点击加群按钮</p>
          <p>根据机器人的指引入群</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  props: {
    tokenSymbol: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      isExpand: false,
      showHelp: false,
      bindStatus: false,
      balance: 100,
      fandomData: [
        {
          fandomId: '0',
          name: '高级粉丝群',
          people: 250,
          minBalance: 200,
        },
        {
          fandomId: '1',
          name: '中级粉丝群',
          people: 519,
          minBalance: 100,
        },
        {
          fandomId: '2',
          name: '初级粉丝群',
          people: 879,
          minBalance: 50,
        },
        {
          fandomId: '3',
          name: '新手粉丝群',
          people: 1358,
          minBalance: 10,
        },
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    /** 控制数据是否展开 */
    fandomList() {
      return this.isExpand ? this.fandomData : [this.fandomData[0]]
    }
  },
  mounted() {
    if(this.isLogined) this.getAccountStatus()
  },
  methods: {
    /** 申请加群 */
    addFandom(fandom) {
      // 未登录情况
      if(!this.isLogined) {
        this.$store.commit('setLoginModal', true)
        return
      }
      // 未绑定tg账号情况
      if(!this.bindStatus) {
        this.showHelp = true
        return
      }
      console.log('加群：',fandom.name)
      this.$message(`申请加入：${ fandom.name } 此功能还在开发中`)
    },
    /** 绑定tg账号 */
    setTelegram() {
      // if:未登录弹出登录框，否则如果未绑定tg账号则跳转至绑定页面
      if(!this.isLogined) {
        // 要先关掉弹窗，不然会产生遮挡
        this.showHelp = false
        this.$store.commit('setLoginModal', true)
      }
      else if(!this.bindStatus) this.$router.push({ name: 'login-telegram' })
    },
    /** 跳转至账号变更页面 */
    accountSettings() {
      // 要先关掉弹窗，不然页面跳转后会留有黑色遮罩。
      this.showHelp = false
      this.$router.push({ name: 'setting-account' })
    },
    /** 获取账号绑定状态 */
    getAccountStatus() {
      this.$API
        .accountList()
        .then(res => {
          if (res.code === 0) {
            // console.log('账号绑定状态：',res)
            const filterPlatform = res.data.filter(
              j => j.platform === 'telegram'
            )
            // console.log(filterPlatform)
            if (filterPlatform.length > 0) {
              this.bindStatus = filterPlatform[0].status ? true : false
            } else {
              this.bindStatus = false
            }
          } else {
            console.log(res.message)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
  }
}
</script>

<style lang="less" scoped>
.fandom-card {
  background: #fff;
  padding: 14px 20px;
  margin: 10px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}

.token-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  line-height: 33px;
  padding: 0;
  margin: 0;
  flex: 1;
}
.help-click {
  font-size: 14px;
  margin-top: auto;
  &:hover {
    color: #4c29ca;
  }
}
.fandom-unit {
  margin: 20px 0;
  .fandom-text {
    flex: 1;
    h2 {
      font-size: 15px;
      color: black;
      margin-bottom: 10px;
      span {
        font-size: 12px;
        color: #B2B2B2;
      }
    }
    .condition {
      font-size: 12px;
      color: #B2B2B2;
    }
  }
  .top10 {
    margin-top: 10px;
  }
}
.add-button {
  padding: 8px 27px;
  border-radius:6px;
  border: 1px solid black;
  color: black;
  &:hover {
    border-color: #4c29ca;
    color: #542DE0;
  }
}

.disable {
  width:80px;
  height:30px;
  background:rgba(178,178,178,1);
  border-radius:6px;
  text-align: center;
  color: white;
  padding-top: 6px;
  font-size: 12px;
}

.expand-page {
  text-align: center;
  margin-bottom: 6px;
  font-size: 14px;
  a:hover {
    color: #4c29ca;
  }
  .svg-top{
    transform: rotate(180deg);
  }
}

.subtitle {
  text-align: center;
  color: #B2B2B2;
  margin-bottom: 22px;
  font-size: 14px;
}

.help-step{
  &.top {
    margin-bottom: 25px;
  }
  .help-text {
    flex: 1;
    h3{
      font-size: 14px;
      color: black;
      padding-bottom: 12px;
    }
    p {
      font-size: 12px;
      color: #B2B2B2;
      &.introduction{
        color: black;
        font-size: 14px;
        padding-bottom: 10px;
      }
    }
    .help-serial {
      height: 16px;
      width: 16px;
      display: inline-block;
      background-color: black;
      color: white;
      text-align: center;
      border-radius: 50%;
      font-size: 8px;
      font-weight: 500;
      margin-left: 5px;
    }
  }
  .help-touch {
    text-align: center;
    .top20 {
      margin-top: 20px;
    }
    .top40 {
      margin-top: 40px;
    }
  }
}
</style>