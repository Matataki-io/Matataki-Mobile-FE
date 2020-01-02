<template>
  <div class="card">
    <div class="card-cover">
      <img src="http://s2.mycomic.cc/imgs/201810/22/12/15401826622251.jpg" alt="title">
    </div>
    <p class="card-text">继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出继Libra横空出世之后，还会有新的移动支付手段登上舞台吗？就Libra推出进…</p>
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
    }
  },
  methods: {
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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  p {
    font-size:12px;
    font-weight: bold;
    color:rgba(0,0,0,1);
    line-height:17px;
    flex: 1;
    max-height: 36px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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