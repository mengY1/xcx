<template>
  <div class="subscriptionPage">
    <div style="padding:0 40rpx; background-color: #fff;">
      <div class="sectionBox " v-for="(item,index) of subscriptionsInfo " :key="index">
        <div class="section_title">
          <span>{{item.name}}</span>
          <span v-if="item.is_subscribe"><i class="iconfont icon-Subscribed">&nbsp;&nbsp;已订阅</i></span>
        </div>
        <switch @change="changeSwitch(item)" :checked='item.is_subscribe' style='zoom:.7;' color='#FFB90C' name="switch" />
      </div>
    </div>
    <!-- 订阅未关注公众号的提示 -->
    <newsGuide v-on:iKnow="iKnow" v-if="guideShow"></newsGuide>
  </div>
</template>
<script>
import {
  subscriptionsList,
  subscriptionsOperating,
  subscriptionsCancel
} from "@/utils/api";
import newsGuide from "./../../../pages/index/news/newsGuide";
import common from "@/utils/common";
export default {
  data() {
    return {
      url:common.url,
      unionid: "",
      subscriptionsInfo: [],
      guideShow: false //关注公众号的提示
    };
  },
  components: {
    newsGuide
  },
  mounted() {
    this.pageData();
  },
  methods: {
    //我的订阅列表
    pageData() {
      this.unionid = wx.getStorageSync("silentlogin").unionid;
      subscriptionsList({ unionid: this.unionid }).then(data => {
        data.data.map((index, item) => {
          if (index.is_subscribe == 0) {
            index.is_subscribe = false;
          } else {
            index.is_subscribe = true;
          }
        });
        this.subscriptionsInfo = data.data;
      });
    },
    changeSwitch(el) {
      if (el.is_subscribe) {
        this.offSubscriptions(el.type, el.name);
      } else {
        this.onSubscriptions(el.type, el.name);
      }
    },
    iKnow() {
      this.guideShow = false;
    },
    //订阅操作(关注订阅)
    onSubscriptions(type, name) {
      var self = this;
      if (common.status === "dev") {
        wx.reportAnalytics("my_subscription", {
          subscribe_type: name,
          subscribe_operation: "订阅"
        });
      }
      subscriptionsOperating({ unionid: this.unionid, type: type }).then(
        data => {
          self.pageData();
          wx.showToast({
            title: "订阅成功"
          });
          if (data.subscribe == 0) {
            this.guideShow = true;
          }
        }
      );
    },
    //取消订阅
    offSubscriptions(type, name) {
      let self = this;
      if (common.status === "dev") {
        wx.reportAnalytics("my_subscription", {
          subscribe_type: name,
          subscribe_operation: "取消订阅"
        });
      }
      subscriptionsCancel({ unionid: this.unionid, type: type }).then(data => {
        self.pageData();
        wx.showToast({
          title: "取消订阅成功"
        });
      });
    }
  },
  //分享好友
  onShareAppMessage: function(res) {
    return {
      title: "来奇集，你需要的这里都有",
      path: "/pages/index/index",
      imageUrl: this.url + "/img/2.0/2x.jpg"
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../style/icon.css";
.subscriptionPage {
  background-color: #f5f5f5;
  height: 100vh;
  .sectionBox {
    height: 130rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f5f5f5;
    .section_title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span:nth-child(1) {
        color: #333333;
        font-size: 36rpx;
        line-height: 50px;
      }
      .iconfont {
        margin-left: 40rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>

