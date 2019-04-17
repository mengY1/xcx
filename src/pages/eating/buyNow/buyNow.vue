<template>
  <div class="buyNowHome">
    <div
      class="detailsUrl"
      style="background-image: url('https://cdn.54qj.com/img/business/coupon/main-coupon-Details.png');background-size: 100% 100%;width:670rpx;"
    >
      <div class="buyImg"><img
          :src="url+storeDetail.logo"
          :key="url+storeDetail.logo"
          alt=""
        ></div>
      <p>{{storeDetail.business}}</p>
      <div class="Offer">奇集专属{{storeDetail.coupon}}优惠券</div>
      <div class="show">· 到店出示该券即可享受优惠</div>
      <div class="time">·有效期：{{storeDetail.active_start_at}}-{{storeDetail.active_end_at}}</div>
    </div>
    <div
      class="save"
      @click="onSave"
    >
      <button>保存到手机下次使用</button>
    </div>
  </div>
</template>
<script>
import { storeDetails, storePoster } from "@/utils/api";
import url from "@/utils/common";
import common from "@/utils/common";
export default {
  data() {
    return {
      storeDetail: [],
      url: url.url,
      coupon_id: "",
      coupon:'',
      business:''
    };
  },
  onLoad: function(options) {
    this.coupon_id = options.coupon_id;
    console.log(options, 90);
  },
  mounted() {
    this.pageData();
  },
  methods: {
    //优惠券详情
    pageData() {
      storeDetails(this.coupon_id, this.token, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(data => {
        this.storeDetail = data;
        this.business = data.business;
        this.coupon = data.coupon;
      });
    },
    //图片授权
    onSave() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_coupons_save_", {
          business: this.business,
          coupon: this.coupon
        });
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
      var imgSrc;
      storePoster(this.coupon_id, this.token, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(data => {
        imgSrc = this.url + data.path;
        console.log(imgSrc, 90909);
        wx.downloadFile({
          url: imgSrc,
          success: function(res) {
            console.log(res);
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(data) {
                console.log(data);
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
      });
    }
  }
};
</script>
<style>
.buyNowHome {
  background-color: #e6e6e6;
  height: 100vh;
  padding-top: 100rpx;
}
.buyNowHome .detailsUrl {
  margin: 0 auto;
  position: relative;
}
.buyNowHome .buyImg {
  width: 120rpx;
  height: 120rpx;
  flex-shrink: 0;
  position: absolute;
  top: 8rpx;
  left: 41%;
}
.buyNowHome .buyImg img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.buyNowHome .detailsUrl p {
  text-align: center;
  padding-top: 140rpx;
  color: #999999;
  font-size: 32rpx;
  font-weight: 800;
}
.buyNowHome .detailsUrl .Offer {
  text-align: center;
  margin-top: 10rpx;
  color: #333333;
  font-size: 48rpx;
  font-weight: 800;
}
.buyNowHome .detailsUrl .show {
  text-align: center;
  margin-top: 340rpx;
  color: #999;
  font-size: 24rpx;
}
.buyNowHome .detailsUrl .time {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding-bottom: 20rpx;
}
.buyNowHome .save {
  margin-top: 150rpx;
  padding: 0 40rpx;
  height: 88rpx;
  border-radius: 44px;
}
.buyNowHome .save button {
  background-color: transparent;
  background-color: #f4b320;
  border-radius: 44px;
  outline: none;
  color: #333333;
  font-size: 32rpx;
  font-weight: 800;
}
.buyNowHome .save button::after {
  border: none;
}
</style>


