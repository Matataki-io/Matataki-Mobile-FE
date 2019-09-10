<template>
  <div class="card">
    <div class="info">
      <el-avatar size="medium" :src="circleUrl"></el-avatar>
      <span class="username">{{ card.username }}</span>
    </div>
    <p class="card-date">{{ friendlyDate }}</p>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    friendlyDate() {
      return moment(this.card.create_time).format('MMMDo HH:mm')
    },
    cover() {
      if (this.card.avatar) return this.$backendAPI.getAvatarImage(this.card.avatar)
      return ''
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.card {
  box-sizing: border-box;
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;
  &:nth-last-of-type(1) {
    border: none;
  }
  .info {
    display: flex;
    align-items: center;
    .username {
      margin-left: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #000;
      line-height: 20px;
    }
  }

  &-date {
    font-size: 14px;
    font-weight: 400;
    color: rgba(178, 178, 178, 1);
    line-height: 17px;
    margin-top: 10px;
  }
}
</style>
