<template>
  <div class="activityHome">
    <div class="activityImg">
      <img src="https://cdn.54qj.com/img/business/coupon/main-top.jpg" alt="">
    </div>
    <div class="share" @click="pickerShow=true">
      <button>活动分享</button>
    </div>
    <div class="guize" @click="onActivity">活动规则</div>
    <div class="offerImg">
      <div class="offer" v-for="(item,index) of storeLists " :key="index" style="background-image: url('https://cdn.54qj.com/img/business/coupon/main-coupon1.png');background-size: 100% 100%;width:710rpx;height:150rpx;">
        <div class="offerBox">
          <div class="offerLeft" @click="onDetails(item.coupon_id,item.business,item.coupon)">
            <div><img :src="url+item.logo" :key="url+item.logo" alt=""></div>
            <div>
              <p>{{item.business}}</p>
              <p>{{item.coupon}}优惠券</p>
            </div>
          </div>
          <div class="offerRight" @click="onUse(item.coupon_id,item.business,item.coupon)">
            <div>立即使用</div>
          </div>
        </div>
      </div>
    </div>
    <div class="contact">
      <span>想推广你的店铺请联系：0755-86548648</span>
    </div>
    <!-- 分享弹窗 -->
    <div class="sharePopus" v-if="pickerShow" @click="pickerShow=false">
      <div>
        <button class="classPopus" open-type="share">分享给好友</button>
        <span class="classPopus" @click="onPaint">
          分享海报
        </span>
        <span class="classPopus" @click="pickerShow=false">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
import { storeList } from "@/utils/api";
import common from "@/utils/common";
import url from "@/utils/common";
export default {
  data() {
    return {
      pickerShow: false,
      storeLists: [],
      url: url.url,
      current_page: 1,
      pagesize: 6,
      ytotal: [],
      business: "",
      coupon: "",
    };
  },
  onLoad: function(options) {
    if (common.status == "dev") {
      wx.reportAnalytics("shopping_index_enterpage", {});
    }
    if (options.coupon_id) {
      wx.navigateTo({
        url:
          "/pages/eating/storeDetails/storeDetails?coupon_id=" +
          options.coupon_id
      });
    }
  },
  onShow() {
    (this.current_page = 1), (this.storeLists = []);
    this.pageData();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    this.pageData();
  },
  methods: {
    //活动规则
    onActivity() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_index_rule_click", {});
      }
      var url = "../eating/activity/activity";
      wx.navigateTo({
        url: url
      });
    },
    //优惠券列表
    pageData() {
      storeList(
        this.token,
        {
          page: this.current_page,
          pagesize: this.pagesize
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
          }
        }
      ).then(data => {
        if (data.data.length <= data.meta.per_page && data.data.length > 0) {
          this.current_page++;
          this.storeLists = this.storeLists.concat(data.data);
          this.storeLists.map((index, item) => {
            this.business = index.business;
            this.coupon = index.coupon;
          });
        } else {
          wx.showToast({
            title: "没有更多了",
            icon: "none"
          });
          return;
        }
      });
    },
    //分享朋友圈
    onPaint() {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_index_share_click", {});
      }
      var url = "../eating/share/share";
      wx.navigateTo({
        url: url
      });
    },

    //跳转到详情页面
    onDetails(coupon_id, business, coupon) {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_show_enterpage", {
          business: this.business,
          coupon: this.coupon
        });
      }
      var url = "../eating/storeDetails/storeDetails?coupon_id=";
      wx.navigateTo({
        url: url + coupon_id
      });
    },
    //立即购买
    onUse(coupon_id, business, coupon) {
      if (common.status == "dev") {
        wx.reportAnalytics("shopping_index_use_button_click", {
          business: this.business,
          coupon: this.coupon
        });
      }
      if (wx.getStorageSync("silentlogin").token) {
        var url = "../eating/buyNow/buyNow?coupon_id=";
        wx.navigateTo({
          url: url + coupon_id
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
              url: "../login/register/index"
            });
          }, 1000);
      }
    }
  },
  //分享给好友
  onShareAppMessage(res) {
    if (res.from === "button") {
    }
    return {
      title: "深大周边，美食折扣券大放送",
      path: "pages/index/index?activity_share=1",
      imageUrl: "https://cdn.54qj.com/img/business/coupon/dialogue-shareimg.jpg"
    };
  }
};
</script>
<style lang="scss" scoped>
.activityHome {
  background-color: #f95959;
  padding-bottom: 50rpx;
  /* height: 100vh; */
}
.activityHome .activityImg {
  width: 100%;
  height: 448rpx;
  flex-shrink: 0;
  position: relative;
}
.activityHome .activityImg img {
  width: 100%;
  height: 100%;
}
.activityHome .share {
  position: absolute;
  top: 0;
  right: 40rpx;
  background-image: linear-gradient(
    0deg,
    #ccf6ff 0%,
    #7ee1ff 76%,
    #2fcbfe 100%
  );
  box-shadow: 0px 10px 20px 0px rgba(192, 1, 57, 0.2);
  border-radius: 0px 0px 44px 44px;
  width: 88rpx;
  height: 88rpx;
}
.activityHome .share button {
  font-size: 24rpx;
  color: #333333;
  font-weight: 800;
  background-color: transparent;
  line-height: 26rpx;
  display: inline-block;
  margin: 10rpx 20rpx;
  position: relative;
  padding-left: 0rpx;
  padding-right: 0rpx;
  box-sizing: border-box;
  text-decoration: none;
  overflow: hidden;
  border: none;
}
.activityHome .share button::after {
  border: none;
}
.activityHome .guize {
  width: 125rpx;
  height: 44rpx;
  border-radius: 22rpx;
  position: absolute;
  top: 316rpx;
  right: 50rpx;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 22rpx;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  line-height: 44rpx;
}
.activityHome .offerImg .offer {
  height: 150rpx;
  width: 710rpx;
  flex-shrink: 0;
  margin: 0 auto;
  margin-top: 40rpx;
  box-shadow: 0px 10px 29px 0px rgba(192, 1, 57, 0.5);
}
.activityHome .offerBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150rpx;
  width: 100%;
}
.activityHome .offerLeft {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}
.activityHome .offerLeft div:nth-child(1) {
  height: 88rpx;
  width: 88rpx;
  flex-shrink: 0;
  margin-left: 30rpx;
  border-radius: 4rpx;
}
.activityHome .offerLeft div:nth-child(1) img {
  width: 100%;
  height: 100%;
  border-radius: 4rpx;
}
.activityHome .offerLeft div:nth-child(2) {
  margin-left: 20rpx;
}
.activityHome .offerLeft div:nth-child(2) > p:nth-child(1) {
  color: #333333;
  font-size: 28rpx;
}
.activityHome .offerLeft div:nth-child(2) > p:nth-child(2) {
  color: #c00139;
  font-size: 40rpx;
  font-weight: 800;
  margin-top: 5rpx;
}
.activityHome .offerRight {
  width: 200rpx;
  height: 100%;
  border-left: 1px dashed #f95959;
}
.activityHome .offerRight div {
  width: 160rpx;
  height: 66rpx;
  background-image: linear-gradient(0deg, #ffb90c 0%, #ffd32c 100%);
  border-radius: 33px;
  line-height: 66rpx;
  font-size: 28rpx;
  color: #333333;
  text-align: center;
  margin-top: 44rpx;
  margin-left: 25rpx;
  font-weight: 800;
}
.activityHome .contact {
  width: 100%;
  display: flex;
  flex: 1;
  background-color: #e03e3e;
  border-radius: 33px;
  color: #ffffff;
  font-size: 28rpx;
  height: 66rpx;
  line-height: 66rpx;
  margin: auto;
  margin-top: 90rpx;
  width: 90%;
}
.activityHome .contact span {
  text-align: center;
  flex: 1;
}
/* 分享弹窗 */
.activityHome .sharePopus {
  position: fixed;
  z-index: 12;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.activityHome .sharePopus div {
  width: 100%;
  position: absolute;
  bottom: 0rpx;
  background-color: #f5f5f5;
}
.activityHome .sharePopus > div .classPopus {
  background-color: transparent;
  background-color: #fff;
  font-size: 32rpx;
  color: #333333;
  display: block;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
}
.activityHome .sharePopus > div .classPopus:nth-child(2) {
  border-top: 1rpx solid #f5f5f5;
}
.activityHome .sharePopus > div .classPopus:after {
  border: none;
}
.activityHome .sharePopus > div .classPopus:nth-child(3) {
  margin-top: 18rpx;
}
</style>

