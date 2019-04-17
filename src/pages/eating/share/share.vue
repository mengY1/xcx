<template>
  <div class="shareHome">
    <div
      class="detailsUrl"
      style="background-image: url('https://cdn.54qj.com/img/business/coupon/main-coupon-share.jpg');background-size: 100% 100%;height:90vh;"
    >
      <div class="shareImg">
        <img
          src="https://cdn.54qj.com/img/business/coupon/slogan.png"
          alt=""
        >
      </div>
      <div class="QRcodeImg"> <img
          src="https://cdn.54qj.com/img/business/coupon/QRcodeM.png"
          alt=""
        >
        <p>扫码了解更多</p>
      </div>
    </div>
    <div
      class="save"
      @click="onSave"
    >
      <div class="shareButton">
        <button>保存分享海报</button>
      </div>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import common from "@/utils/common";
export default {
  data() {
    return {
      url: url.url
    };
  },
  methods: {
    //图片授权
    onSave() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_index_share_poster_save", {});
      }
      wx.getSetting({
        success: function(res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                console.log("授权成功");
              }
            });
          }
        }
      });
      var imgSrc =
        "https://cdn.54qj.com/img/business/coupon/business_coupon_poster.jpg";
      wx.downloadFile({
        url: imgSrc,
        success: function(res) {
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(data) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000
              });
            },
            fail: function(err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("用户一开始拒绝了，我们想再次发起授权");
                console.log("打开设置窗口");
                wx.showToast({
                  title: "保存失败",
                  duration: 2000
                });
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata);
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      console.log(
                        "获取权限成功，给出再次点击图片保存到相册的提示。"
                      );
                    } else {
                      console.log(
                        "获取权限失败，给出不给权限就无法正常使用的提示"
                      );
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  }
};
</script>
<style>
.shareHome .detailsUrl {
  margin: 0 auto;
  position: relative;
}
.shareHome .shareImg {
  width: 73%;
  height: 220rpx;
  flex-shrink: 0;
  position: absolute;
  top: 200rpx;
  left: 5%;
}
.shareHome .shareImg img {
  width: 108%;
  height: 100%;
}
.shareHome .QRcodeImg {
  width: 302rpx;
  height: 302rpx;
  flex-shrink: 0;
  position: absolute;
  top: 465rpx;
  left: 30%;
}
.shareHome .QRcodeImg img {
  width: 100%;
  height: 100%;
}
.shareHome .detailsUrl p {
  text-align: center;
  padding-top: 10rpx;
  color: #fff;
  font-size: 24rpx;
}
.shareHome .save {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0rpx;
  border-radius: 44px;
}
.shareHome .save .shareButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  background-color: #fff;
}
.shareHome .save .shareButton button {
  background-color: transparent;
  background-color: #f4b320;
  outline: none;
  color: #333333;
  font-size: 32rpx;
  font-weight: 800;
  width: 100%;
}
.shareHome .save button::after {
  border: none;
}
</style>


