<template>
  <div class="card">
    <div class="card-info">
      <avatar class="card-avatar" src="http://s2.mycomic.cc/imgs/201810/22/12/15401826622251.jpg"></avatar>
      <span class="card-username">JKDJSFKSDJFKSDFDF</span>
    </div>
    <div class="card-content">
      <svg-icon class="icon" icon-class="quotation_marks" />
      <svg-icon class="icon" icon-class="quotation_marks" />
      <p>我觉得这篇文章真的非常非常赞！！大家都快去看～～～我一
        直都在追这位作者的文章，每期都有看哟，对我的启发也很大，
        简直amazing～～～我觉得这篇文章真的非常非常赞！！
        大家都快去看～～～我一直都在追这位作者的文章，
        大家都快去看～～～我一直都在追这位作者的文章，
        大家都快去看～～～我一直都在追这位作者的文章，
        大家都快去看～～～我一直都在追这位作者的文章，
        大家都快去看～～～我一直都在追这位作者的文章，
        每期都有看哟，对我的启发也很大，简直amazing～～～</p>
    </div>
    <span v-if="cardType === 'edit'" class="card-remove" @click="removeCard">
      <i class="el-icon-close icon"></i>
    </span>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'

export default {
  components: {
    avatar
  },
  props: {
    cardType: {
      type: String,
      default: 'edit' // edit read
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
          this.$toast({ duration: 1000, message: '删除成功' })
        }).catch(() => {
          this.$toast.fail({ duration: 1000, message: '取消删除' })
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
  flex-direction: column;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  &-info {
    width: 100%;
    display: flex;
    align-items: center;
    .card-avatar {
      margin-right: 5px;
      width: 30px !important;
      height: 30px !important;
      flex: 0 0 30px;
    }
    .card-username {
      font-size:12px;
      font-weight:bold;
      color:rgba(0,0,0,1);
      line-height:17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-content {
    position: relative;
    padding: 0 20px;
    width: 100%;
    margin-top: 5px;
    .icon {
      position: absolute;
      color: #000;
      font-size: 12px;
      &:nth-child(1) {
        left: 0;
        top: 0;
      }
      &:nth-child(2) {
        bottom: 0;
        right: 0;
        transform: rotate(-180deg);
      }
    }

    p {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
      overflow: hidden;
      max-height: 87px;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
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