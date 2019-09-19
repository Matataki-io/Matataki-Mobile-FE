<template>
  <div class="error">
    <h1>❗404❗</h1>
    <a href="/">{{ $t('backHome') }}</a>
  </div>
</template>

<style lang="less" scoped>
.error {
  min-height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 40px;
    text-align: center;
  }
  a {
    text-decoration: underline;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
