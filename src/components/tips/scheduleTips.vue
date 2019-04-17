<template>
<!-- 日程提醒 -->
  <div class="newsGuide">
    <div class="bg"></div>
    <main>
      <div>
        <div class="newsImg"><img :src="url+'/img/2.0/Notice-Pop-ups.jpg'" style="width:592rpx;height:276rpx;" class="guideBg"><i class="iconfont icon-Popups-close " @click="iKnow"></i></div>
        <div class="iKnow">
          <p>我们将会在活动开始前两小时通过微信通知提醒你</p>
          <span class="know" @click="iKnow">我知道了</span>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      url: common.url
    };
  },
  methods: {
    iKnow() {
      this.$emit("iKnowS");
      if (common.status == "dev") {
        wx.reportAnalytics("act_remind_layer", {
          layer_button: "我知道了"
        });
      }
    }
  }
};
</script>
<style scoped>
@import "../../style/icon.css";
.newsGuide {
  width: 100%;
  height: 100vh;
  z-index: 200;
  position: fixed;
  top: 0;
}
.bg {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100vh;
  position: relative;
}
main {
  position: absolute;
  left: 11%;
  top: 260rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 16rpx;
}
main .guideBg {
  width: 475rpx;
  height: 900rpx;
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
}
.newsImg  {
  position: relative;
}
.newsImg i {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  color: #ccc;
  font-size: 20rpx;
}
.iKnow {
  width: 592rpx;
  height: 308rpx;
}
.iKnow p {
  width: 390rpx;
  height: 69rpx;
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 42rpx;
  padding: 40rpx 0 0 100rpx;
  text-align: center;
}
main .know {
  display: block;
  width: 360rpx;
  height: 80rpx;
  background: rgba(255, 178, 11, 1);
  border-radius: 40rpx;
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 80rpx;
  text-align: center;
  position: absolute;
  top: 80%;
  right: 120rpx;
}
</style>
