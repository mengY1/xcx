<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <!-- 取消订阅提示 -->
    <cancelTips v-if="tipsShow" v-on:tipsHide="tipsHide" v-on:cancelAction="cancelAction"></cancelTips>
    <!-- 订阅提示 -->
    <newsGuide v-on:iKnow="iKnow" v-if="guideShow"></newsGuide>
    <main>
      <div class="subscription">
        <form report-submit="true" @submit="subscription">
          <button form-type="submit">
            <span class="success" v-if="subscriptionStatus">订阅</span>
            <span class="cancel" v-else>取消订阅</span>
          </button>
        </form>
      </div>
      <div class="contain_wrap">
        <div class="contain">
          <div class="newsList" v-for="(item,index) in newsList" :key="index" @click="toNews(item.new_id)">
            <div class="list_left">
              <img :src="url+item.cover" alt="">
            </div>
            <div class="list_right">
              <div>
                <p>{{item.title}}</p>
              </div>
              <div>
                <p class="time">{{item.created_at}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import cancelTips from "@/components/tips/newsTips";
import loading from "@/components/loading";
import url from "@/utils/common";
import { formId } from "@/utils/common";
import { list, subscriptions, newsCancel, newsCheck } from "@/utils/api";
import newsGuide from "./newsGuide";
export default {
  data() {
    return {
      loadingShow: true,
      url: url.url,
      unionid: "",
      guideShow: false,
      subscriptionStatus: true, //true是未订阅状态，false是订阅状态
      newsList: [],
      page: 1,
      pShow: true,
      tipsShow: false,
      subAction: false //有unionid且从公众号进入的时候为true并在onShow调用自动订阅功能
    };
  },
  components: {
    newsGuide,
    loading,
    cancelTips
  },
  onReachBottom() {
    if (this.pShow) {
      this.more();
    }
  },
  onPullDownRefresh() {
    this.loadingShow = true;
    this.pShow = true;
    this.page = 1;
    this.newsList = [];
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    this.getListInfo();
    wx.stopPullDownRefresh();
  },
  onLoad(options) {
    this.loadingShow = true;
    this.pShow = true;
    this.page = 1;
    this.newsList = [];
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    this.getListInfo();
    if (options.new_id) {
      wx.navigateTo({
        url:
          "/pages/index/news/index?new_id=" +
          options.new_id +
          "&&share=1" +
          "&&type=" +
          options.type
      });
    } else if (options.share_id) {
      console.log("爆料分享的详情");
      wx.navigateTo({
        url:
          "/pages/index/news/index?share_id=" +
          options.share_id +
          "&&share=1" +
          "&&type=" +
          options.type
      });
    } else if (options.new_subscribe) {
      // this.subscriptionStatus = true;
      this.subAction = true;
    }
  },
  onShow() {
    this.guideShow = false;
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    this.getSubscriptionsStatus();
    console.log(this.subscriptionStatus, "订阅状态，true为未订阅");
    if (this.subAction && this.unionid && this.subscriptionStatus) {
      console.log("有参数，有unionid，未订阅状态");
      this.subscription();
    }
  },
  methods: {
    async getListInfo() {
      try {
        this.getSubscriptionsStatus();
        let listInfo = await list({}, true);
        this.newsList = listInfo.data;
        this.loadingShow = false;
      } catch (e) {
        this.loadingShow = false;
      }
    },
    more() {
      this.page += 1;
      list({ page: this.page }).then(res => {
        for (var i = 0; i < 8; i++) {
          if (res.data[i]) {
            this.newsList.push(res.data[i]);
          } else {
            this.pShow = false;
          }
        }
      });
    },
    getSubscriptionsStatus() {
      if (wx.getStorageSync("silentlogin").unionid) {
        newsCheck({ unionid: this.unionid }, true)
          .then(res => {
            if (res.is_subscribe === 0) {
              console.log("未订阅");
              this.subscriptionStatus = true;
            } else {
              console.log("订阅了");
              this.subscriptionStatus = false;
            }
            this.loadingShow = false;
          })
          .catch(err => {
            this.loadingShow = false;
          });
      }
    },
    iKnow() {
      this.guideShow = false;
      if (url.status === "dev") {
        wx.reportAnalytics("news_subscribe_attention", {
          position: "news_list"
        });
      }
    },
    subscription(e) {
      if (e && this.unionid) {
        formId(e);
      }
      if (this.subscriptionStatus) {
        if (url.status === "dev") {
          wx.reportAnalytics("news_subscribe_click", {
            position: "news_list"
          });
        }
        if (this.unionid) {
          subscriptions({ unionid: this.unionid }).then(res => {
            console.log(res);
            if (res.subscribe === 0) {
              this.guideShow = true;
            } else {
              this.subscriptionStatus = false;
              wx.showToast({
                title: "订阅成功",
                icon: "none"
              });
              this.subAction = false;
              console.log(193, "订阅成功", this.subAction);
            }
          });
        }
      } else {
        this.tipsShow = true;
      }
    },
    cancelAction() {
      // 取消订阅
      newsCancel({ unionid: this.unionid }).then(res => {
        this.subscriptionStatus = true;
        // this.subAction = true;
        this.tipsShow = false;
        if (url.status === "dev") {
          wx.reportAnalytics("news_unsubscribe_click", {
            position: "news_list"
          });
        }
      });
    },
    tipsHide() {
      this.tipsShow = false;
      if (url.status === "dev") {
        wx.reportAnalytics("news_unsubscribe_think", {
          position: "news_list"
        });
      }
    },
    toNews(id) {
      wx.navigateTo({
        url: "/pages/index/news/index?new_id=" + id + "&&type=list"
      });
    }
  }
};
</script>
<style scoped>
.subscription {
  position: fixed;
  right: 0rpx;
  top: 186rpx;
}
.subscription button {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 0;
  border-radius: 33rpx 0 0 33rpx;
}
.subscription button::after {
  border: none;
}
.subscription span {
  display: block;
  box-sizing: border-box;
  text-align: center;
  line-height: 66rpx;
  font-size: 28rpx;
  border-radius: 33rpx 0 0 33rpx;
}
.subscription .success {
  padding: 0 30rpx 0 36rpx;
  background: #0588fe;
  color: #fff;
}
.subscription .cancel {
  border: 1px solid #cccccc;
  color: #cccccc;
  padding: 0 30rpx 0 34rpx;
  background: #fff;
}
.contain_wrap {
  padding: 40rpx 40rpx 0;
}
.contain .newsList {
  border-bottom: 1px solid #d9d9d9;
  padding: 20rpx 0rpx 10rpx 0;
  overflow: hidden;
}
.contain .newsList .list_left {
  float: left;
}
.contain .newsList .list_left img {
  width: 240rpx;
  height: 180rpx;
  border-radius: 8rpx;
}
.contain .newsList .list_right {
  width: 370rpx;
  font-size: 28rpx;
  line-height: 42rpx;
  float: left;
  margin-left: 40rpx;
  color: #333333;
  overflow: hidden;
}
.contain .newsList .list_right > div:first-child {
  height: 124rpx;
}
.contain .newsList .list_right > div p {
  width: 370rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.contain .newsList .list_right .time {
  margin-top: 18rpx;
  font-size: 24rpx;
  color: #999999;
}
</style>
