<template>
  <div class="storeDetailsHome">
    <div
      class="storeBox"
      style="background-image: url('https://cdn.54qj.com/img/business/coupon/Details-top.png');padding: 0 20px;background-size: 100% 100%;width:600rpx;height:200rpx;"
    >
      <div>
        <p>{{storeDetail.business}}</p>
        <div>{{storeDetail.coupon}}优惠券</div>
        <div>有效期：{{storeDetail.active_start_at}} - {{storeDetail.active_end_at}}</div>
      </div>
      <div class="storeImg">
        <img
          :src="url+storeDetail.logo"
          :key="url+storeDetail.logo"
          alt=""
        >
      </div>
    </div>
    <div class="address">
      <div class="Positioning"><img
          src="https://cdn.54qj.com/img/business/coupon/Details-Positioning.png"
          alt=""
        ></div>
      <div @click="onMap">
        <div class="content">{{storeDetail.address}}</div>
        <div class="distance">距你{{storeDetail.distance}}km</div>
      </div>
      <div
        class="phone"
        @click="onPhone"
      ><img
          src="https://cdn.54qj.com/img/business/coupon/Details-phone.png"
          alt=""
        ></div>
    </div>
    <div class="detailsTime">
      <div><img
          src="https://cdn.54qj.com/img/business/coupon/Details-time.png"
          alt=""
        ></div>
      <p>{{storeDetail.business_time}}</p>
    </div>
    <div class="use">
      <div class="rules">
        <p v-html="storeDetail.rules"></p>
      </div>
    </div>
    <div class="buttonBox">
      <div class="storeButton">
        <button @click="onUse">立即使用</button>
        <button open-type="share">分享给好友</button>
      </div>
    </div>
  </div>
</template>
<script>
import { storeDetails } from "@/utils/api";
import url from "@/utils/common";
import common from "@/utils/common";
export default {
  data() {
    return {
      storeDetail: [],
      url: url.url,
      coupon_id: ""
    };
  },
  onLoad: function(options) {
    this.coupon_id = options.coupon_id;
  },
  mounted() {
    this.pageData();
  },
  methods: {
    //优惠券详情
    pageData() {
      this.longitude = wx.getStorageSync("longitude");
      this.latitude = wx.getStorageSync("latitude");
      storeDetails(
        this.coupon_id,
        { lat: this.latitude, lng: this.longitude },
        this.token,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      ).then(data => {
        this.storeDetail = data;
        this.business = data.business;
        this.coupon = data.coupon;
      });
    },
    //拨打电话
    onPhone() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_show_phone_click", {
          business: this.business,
          coupon: this.coupon
        });
      }
      wx.makePhoneCall({
        phoneNumber: this.storeDetail.phone, //仅为示例，并非真实的电话号码
        success() {
          console.log("拨打电话成功！");
        },
        fail() {
          console.log("拨打电话失败！");
        }
      });
    },
    //立即使用
    onUse() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_show_use_button_click", {
          business: this.business,
          coupon: this.coupon
        });
      }
      if (wx.getStorageSync("silentlogin").token) {
        var url = "../../eating/buyNow/buyNow?coupon_id=";
        wx.navigateTo({
          url: url + this.coupon_id
        });
        wx.getUserInfo({
          success: function(res) {
            console.log("拿到用户信息", res.userInfo);
          }
        });
      } else {
        wx.showToast({
          title: "请先注册"
        }),
          setTimeout(() => {
            wx.navigateTo({
              url: "../../login/register/index"
            });
          }, 1000);
      }
    },
    //地址跳转地图
    onMap() {
      let self = this;
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_show_position_click", {
          business: this.business,
          coupon: this.coupon
        });
      }
      wx.getLocation({
        type: "gcj02", // 返回可以用于wx.openLocation的经纬度
        success(res) {
          wx.openLocation({
            latitude: self.storeDetail.lat,
            longitude: self.storeDetail.lng,
            scale: 18,
            name: self.storeDetail.business,
            address: self.storeDetail.address
          });
        }
      });
    },
    fail: function(err) {
      console.log(err);
    }
  },
  //分享给好友
  onShareAppMessage(res) {
    if (common.status == "dev") {
      wx.reportAnalytics("shopping_show_share_button_click", {
        business: this.business,
        coupon: this.coupon
      });
    }
    if (res.from === "button") {
      // console.log(res.target);
    }
    return {
      title: this.business + "竟然在打" + this.coupon + "！！！",
      path: "/pages/index/index?coupon_id=" + this.coupon_id + "&storeList=1"
    };
  }
};
</script>
<style>
.storeDetailsHome {
  margin-top: 40rpx;
}
.storeDetailsHome .storeBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-top: 20rpx;
  padding: 0 30rpx;
}
.storeDetailsHome .storeBox > div:nth-child(1) p {
  color: #333333;
  font-size: 32rpx;
}
.storeDetailsHome .storeBox > div:nth-child(1) > div:nth-child(2) {
  color: #c00139;
  font-size: 40rpx;
  font-weight: 800;
  margin: 10rpx 0;
}
.storeDetailsHome .storeBox > div:nth-child(1) > div:nth-child(3) {
  font-size: 24rpx;
  color: #999999;
}
.storeDetailsHome .storeBox .storeImg {
  width: 132rpx;
  height: 132rpx;
  border-radius: 4px;
  flex-shrink: 0;
}
.storeDetailsHome .storeBox .storeImg img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.storeDetailsHome .address {
  display: flex;
  justify-content: flex-start;
  padding: 20rpx 40rpx;
}
.storeDetailsHome .address .Positioning {
  width: 20rpx;
  height: 26rpx;
  flex-shrink: 0;
}
.storeDetailsHome .address .Positioning img {
  width: 100%;
  height: 100%;
}
.storeDetailsHome .address .content {
  color: #333333;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 491rpx;
  padding: 0 30rpx;
  border-right: 1px solid #e5e5e5;
}
.storeDetailsHome .address .phone {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
  margin-top: 20rpx;
  padding-left: 30rpx;
  /* border-left: 1px solid #e5e5e5; */
}
.storeDetailsHome .address .phone img {
  width: 100%;
  height: 100%;
}
.storeDetailsHome .distance {
  padding: 5rpx 30rpx;
  color: #576b95;
  font-size: 24rpx;
}
.storeDetailsHome .detailsTime {
  display: flex;
  justify-content: flex-start;
  padding: 0 40rpx;
  padding-bottom: 16rpx;
}
.storeDetailsHome .detailsTime > div {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}
.storeDetailsHome .detailsTime > div img {
  width: 100%;
  height: 100%;
}
.storeDetailsHome .detailsTime p {
  color: #333333;
  font-size: 28rpx;
  margin-left: 20rpx;
}
.storeDetailsHome .use {
  padding: 40rpx;
  font-size: 28rpx;
  color: #333333;
}
.storeDetailsHome .use .rules {
  border-top: 1px solid #e6e6e6;
  padding-top: 40rpx;
}
.storeDetailsHome .buttonBox {
  height: 148rpx;
  width: 100%;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12);
  position: fixed;
  bottom: 0;
  left: 0;
}
.storeDetailsHome .buttonBox .storeButton {
  padding: 0 30rpx;
  height: 148rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.storeDetailsHome .buttonBox .storeButton > button:nth-child(1) {
  width: 320rpx;
  height: 88rpx;
  background-color: #ffb90c;
  border-radius: 8px;
  color: #332503;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 88rpx;
}
.storeDetailsHome .buttonBox .storeButton > button:nth-child(1)::after {
  border: none;
}
.storeDetailsHome .buttonBox .storeButton > button:nth-child(2) {
  width: 320rpx;
  height: 88rpx;
  border-radius: 8px;
  border: solid 1px #d9d9d9;
  color: #333333;
  font-weight: 800;
  font-size: 30rpx;
  line-height: 88rpx;
  background-color: transparent;
}
.storeDetailsHome .buttonBox .storeButton > button:nth-child(2)::after {
  border: none;
}
</style>

