<template>
  <router-link class="card" :to="{name: 'ring-id', params: {id: card.token_id}}">
    <div class="card-logo">
      <img v-if="logo" :src="logo" :alt="card.symbol">
    </div>
    <p>{{card.symbol}}{{(card.namr)}}</p>
  </router-link>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    logo() {
      return this.card.logo ? this.$API.getImg(this.card.logo) : ''
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  background:rgba(255,255,255,1);
  border-radius:10px;
  overflow: hidden;
  border:1px solid rgba(219,219,219,1);
  text-decoration: none;
  &-logo {
    height: 175px;
    background-color: #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
    box-sizing: border-box;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  p {
    padding: 0;
    margin: 10px 0;
    text-align: center;
    font-size:14px;
    font-weight:500;
    color:rgba(0,0,0,1);
    line-height:20px;
  }
}
</style>