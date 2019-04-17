<template>
  <div class="newsGuide">
    <div class="bg"></div>
    <main>
      <div class="youKnow">
        <img :src="url+'/img/2.0/Subscription-tips.png'" style="width:610rpx;height:688rpx;" class="guideBg">
        <div class="know">
          <span @click="iKnow">我知道了</span>
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
      if (common.status == "dev") {
        wx.reportAnalytics("subscribe_remind_layer", {
          layer_button: "我知道了"
        });
      }
      this.$emit("iKnow");
    }
  }
};
</script>
<style scoped>
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
}
/* .mainCon {
  width: 610rpx;
  height: 688rpx;
  border-radius: 4rpx;
  position: absolute;
  left: 9%;
  top: 30rpx;
} */
main .youKnow {
  width: 610rpx;
  height: 688rpx;
  border-radius: 4rpx;
  position: absolute;
  left: 9%;
  top: 30rpx;
}
/* main .guideBg {
  width: 475rpx;
  height: 900rpx;
} */
/* main .arrow {
  width: 27rpx;
  height: 58rpx;
  position: fixed;
  top: 41rpx;
  right: 18%;
} */
main .know span {
  display: block;
  width: 360rpx;
  height: 80rpx;
  background: rgba(255, 178, 11, 1);
  border-radius: 40rpx;
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 72rpx;
  text-align: center;
  position: absolute;
  top: 82%;
  right: 125rpx;
  line-height: 80rpx;
}
</style>
