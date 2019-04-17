<template>
  <div>
    <!-- 奇集外交官招募令 -->
    <div class="bg" :style="{backgroundImage:'url('+url+'/img/qiji_diplomat_Recruitment.png)'}">
      <div class="btn">
        <button style="background:#f0ad05" @click="copyWechat">添加微信</button>
        <button style="background:#fae06b" @click="toCall">电话联系</button>
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
  },
  methods: {
    copyWechat() {
      if (common.status === "dev") {
        wx.reportAnalytics("diplomat_add_wechat", {});
      }
      wx.setClipboardData({
        data: "qijiguanfangwechat",
        success: function(res) {
          wx.hideToast({});
          wx.showModal({
            title: "提示",
            content: "已复制微信号，在微信添加好友即可",
            showCancel: false
          });
        }
      });
    },
    toCall() {
      if (common.status === "dev") {
        wx.reportAnalytics("diplomat_phone", {});
      }
      wx.makePhoneCall({
        phoneNumber: "18820155952"
      });
    }
  }
};
</script>
<style scoped>
.bg {
  background-size: 100%;
  width: 100%;
  height: 2248rpx;
  overflow: hidden;
}
.btn {
  display: flex;
  position: fixed;
  bottom: 24rpx;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 0 40rpx;
}
.btn button {
  box-sizing: border-box;
  width: 320rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  border: 4rpx solid #350a59;
  font-size: 36rpx;
  color: #331900;
  padding: 0;
  margin: 0;
}
.btn button::after {
  border: 0;
}
</style>
