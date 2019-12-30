<template>
  <div class="fandom-card">
    <div class="fl">
    <h2 class="token-title">
      加入{{tokenShortName}}粉丝群
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
          持有的{{tokenShortName}}票>{{fandom.minBalance}}即可加群
        </p>
      </div>
      <div>
        <el-button class="add-button" @click="addFandom(fandom)" size="small">加群</el-button>
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
          <h3>步骤 1</h3>
          <p class="introduction">绑定Telegram账号</p>
          <p>仅需要绑定一次</p>
        </div>
        <div>
          <el-button class="add-button">绑定</el-button>
        </div>
      </div>
      <div class="fl help-step">
        <div class="help-text">
          <h3>步骤 2</h3>
          <p class="introduction">点击加群按钮</p>
          <p>根据机器人的指引入群</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      tokenShortName: 'KJC',
      isExpand: false,
      showHelp: false,
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
          name: '初期粉丝群',
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
    /** 控制数据是否展开 */
    fandomList() {
      return this.isExpand ? this.fandomData : [this.fandomData[0]]
    }
  },
  methods: {
    addFandom(fandom) {
      console.log('加群：',fandom.name)
      this.showHelp = true
    }
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
  .add-button {
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
  }
  .add-button {
    margin-top: 40px;
  }
}

</style>
