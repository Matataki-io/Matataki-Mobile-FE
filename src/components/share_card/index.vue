<template>
  <div class="card-share">
    <div class="card-info">
      <div class="card-info__left">
        <avatar class="card-avatar" src="http://s2.mycomic.cc/imgs/201810/22/12/15401826622251.jpg"></avatar>
        <div class="card-author">
          <span class="card-username">JKDJSFKSDJFKSDFDFJKDJSFKSDJFKSDFDFJKDJSFKSDJFKSDFDF</span>
          <span class="card-date">123123123131231231</span>
        </div>
      </div>
      <div class="card-quote">
        <svg-icon class="icon" icon-class="quote" />
        <span>引用123</span>
      </div>
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
    <div class="card-list">
      <div v-for="(item, index) in shareList.slice(0, 1)" :key="index">
        <shareOuterCard v-if="item.type === 'outer'" cardType="read" class="list-card"></shareOuterCard>
        <shareInsideCard v-if="item.type === 'inside'" cardType="read" class="list-card"></shareInsideCard>
      </div>
      <div name="fade" v-show="toggleMore">
        <transition v-for="(item, index) in shareListMore" :key="index">
          <shareOuterCard v-if="item.type === 'outer'" cardType="read" class="list-card" ></shareOuterCard>
          <shareInsideCard v-if="item.type === 'inside'" cardType="read" class="list-card"></shareInsideCard>
        </transition>
      </div>
      <div v-if="shareListMore.length !== 0" class="card-more" :class="toggleMore && 'open'" @click="toggleMore = !toggleMore">
        <span>查看更多</span><i class="el-icon-d-arrow-left icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/avatar/index.vue'
import shareOuterCard from '@/components/share_outer_card/index.vue'
import shareInsideCard from '@/components/share_inside_card/index.vue'
export default {
  components: {
    avatar,
    shareOuterCard,
    shareInsideCard,
  },
  data() {
    return {
      toggleMore: false,
      shareList: [
        {
          type: 'outer'
        },
        {
          type: 'inside'
        },
        {
          type: 'outer'
        },
        {
          type: 'inside'
        },
      ],
    }
  },
  computed: {
    shareListMore() {
      if (this.shareList.length > 1) return this.shareList.slice(1)
      else return []
    }
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
.card-share {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.card {
    &-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__left {
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      margin-right: 10px;
    }
    .card-author {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      overflow: hidden;
    }
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
      width: 100%;
    }
    .card-date {
      font-size:12px;
      font-weight:400;
      color:rgba(178,178,178,1);
      line-height:17px;
    }
  }

  &-quote {
    border-radius:4px;
    border:1px solid @purpleDark;
    color: @purpleDark;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon {
      font-size: 16px;
    }
    span {
      font-size:12px;
      font-weight: bold;
      color: @purpleDark;
      line-height:17px;
    }
  }
  &-content {
    position: relative;
    padding: 0 20px;
    width: 100%;
    margin-top: 10px;
    .icon {
      position: absolute;
      color: @purpleDark;
      font-size: 14px;
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
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      overflow: hidden;
      max-height: 102px;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
    }
  }
  &-list {
    border-radius:6px;
    background-color: #eaeaea;
    padding: 0;
    width: 100%;
    margin: 14px 0 0 0;
    position: relative;
    &::before {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border-width: 10px 15px 10px 15px;
      border-style: solid;
      border-color: transparent transparent #eaeaea transparent;
      position: absolute;
      left: 20px;
      top: -20px;
    }
  }

  &-more {
    text-align: center;
    margin-bottom: 10px;
    &.open .icon {
      transform: rotate(90deg);
    }
    span {
      font-size:12px;
      font-weight:400;
      color:@purpleDark;
      line-height:17px;
      margin-right: 2px;
    }
    .icon {
      color:@purpleDark;
      transform: rotate(-90deg);
      font-size:12px;
    }
  }
}

</style>