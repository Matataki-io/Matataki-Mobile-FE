<template>
  <div class="card">
    <div v-if="card.cover" class="card-cover">
      <!-- <div style="width: 100px;height:100px;" v-html="showImg(card.cover)"></div> -->
      <img referrer="no-referrer|origin|unsafe-url" :src="card.cover" :alt="card.title">
    </div>
    <div>
      <p class="card-text">{{ card.title }}</p>
      <p class="card-summary">{{ card.summary }}</p>
    </div>
    <span v-if="cardType === 'edit'" class="card-remove" @click="removeCard">
      <i class="el-icon-close icon"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    cardType: {
      type: String,
      default: 'edit' // edit read
    },
    idx: {
      type: Number,
      default: 0
    },
    card: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log(this.card)
  },
  methods: {
    // 太消耗性能 不可取
    // showImg (url) {
    //   if (!url) return ''
    //   var frameid = 'frameimg' + Math.random()
    //   window.img = '<img width="100" height="50" src=\'' + url + '?' + Math.random() + '\' />'
    //   return '<iframe id="' + frameid + '" src="javascript:parent.img;" frameBorder="0" scrolling="no" width="100" height="50"></iframe>'
    // },
    removeCard() {
      if (this.cardType !== 'edit') return
      this.$confirm('此操作将删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'message-box__mobile'
        }).then(() => {
          this.$emit('removeShareLink', this.idx)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  background: #EAEAEA;
  border-radius: 6px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  &-cover {
    width: 100px;
    height: 50px;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 5px;
    flex: 0 0 100px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &-text {
    font-size:12px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    flex: 1;
    max-height: 19px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  &-summary {
    font-size:12px;
    font-weight: bold;
    line-height:17px;
    flex: 1;
    max-height: 36px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #737373;
  }
  &-remove {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon {
      font-size: 14px;
    }
  }
}


</style>