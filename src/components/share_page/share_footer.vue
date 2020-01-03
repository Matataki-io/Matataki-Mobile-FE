<template>
  <div class="share-footer">
    <div class="icon-num">
      <svg-icon class="icon" icon-class="bookmark-solid"/>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="reference"/>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="share2"/>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="great-solid" />
      <p>12312312</p>
    </div>
    <div class="icon-num">
      <svg-icon class="icon" icon-class="bullshit-solid" />
      <p>121</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.share-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // height: 50px;
  padding: 16px 40px 2px;
  box-sizing: border-box;
  padding-bottom: calc(2px + constant(safe-area-inset-bottom));
  padding-bottom: calc(2px + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow:0px -2px 8px 0px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .icon {
    font-size: 20px;
    color: #B2B2B2;
  }

  .icon-num {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // position: relative;
    p {
      // position: absolute;
      // top: 20px;
      // left: 0;
      text-align: center;
      font-size:12px;
      color:rgba(178,178,178,1);
      line-height: 1;
    }
  }
}
</style>