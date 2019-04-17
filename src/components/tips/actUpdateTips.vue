<template>
  <!-- 活动更新提示 -->
  <div>
    <div class="actTips_wrap">
        <div class="actTips" :style="{backgroundImage:'url('+url+'/img/home_activity_Bigbroke.png)'}">
          <h1>有新活动啦</h1>
        </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      url: common.url
    };
  }
};
</script>
<style scoped>
.actTips_wrap {
  position: fixed;
  bottom: -12rpx;
  width: 100%;
  z-index: 5;
}
.actTips_wrap .actTips {
  background-size: 100%;
  width: 194rpx;
  height: 96rpx;
  z-index: 5;
  margin: 0 auto;
}
.actTips_wrap .actTips h1 {
  font-size: 24rpx;
  color: #fff;
  text-align: center;
  line-height: 60rpx;
}
</style>
