<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <main>
      <h1>{{title}}</h1>
      <p class="time">{{time}}</p>
      <!-- <div v-if="txt" v-html="txt">
          {{txt}}
        </div>-->
      <div class="ql-container ql-snow">
        <div class="ql-editor">
          <wxParse :content="txt" />
        </div>
      </div>

      <div class="way">
        <p>领取方式：复制【{{link}}】链接在浏览器中打开即可领取</p>
      </div>
    </main>

    <footer>
      <div class="btn_wrap">
        <button @click="copy">复制领取链接</button>
        <button open-type="share">分享给好友</button>
      </div>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { toShouquan } from "@/utils/common";
import loading from "@/components/loading";
import { uniDetail, uniPull } from "@/utils/api";
import wxParse from "mpvue-wxparse";
export default {
  data() {
    return {
      title: "",
      time: "",
      txt: "",
      link: "",
      university_id: "",
      channel: "", //进入页面的途径
      loadingShow: true
    };
  },
  components: {
    loading,
    wxParse
  },
  onLoad(options) {
    toShouquan();
    this.loadingShow = true;
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      });
      this.title = options.title;
    }
    this.university_id = options.university_id;
    this.channel = options.channel;
    this.getInfo(options.university_id);
  },
  methods: {
    async getInfo(id) {
      try {
        let content = await uniDetail(id, {}, true);
        this.txt = content.universities_content;
        this.time = content.created_at;
        this.link = content.url;
        this.loadingShow = false;
        this.title = content.title;
        wx.setNavigationBarTitle({
          title: content.title
        });
        if (common.status == "dev") {
          wx.reportAnalytics("university_show_enterpage", {
            title: this.title,
            channel: this.channel
          });
        }
      } catch (e) {
        this.loadingShow = false;
      }
    },
    copy() {
      if (common.status == "dev") {
        wx.reportAnalytics("university_show_copy_link", {
          title: this.title,
          channel: this.channel
        });
      }
      uniPull(
        this.university_id,
        { unionid: wx.getStorageSync("silentlogin").unionid },
        true
      );
      wx.setClipboardData({
        data: this.link
      });
    }
  },
  onShareAppMessage: function(res) {
    if (common.status == "dev") {
      wx.reportAnalytics("university_show_share_firends", {
        title: this.title,
        channel: this.channel
      });
    }
    return {
      title: this.title,
      path: "/pages/index/index?university_id=" + this.university_id
      // imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style>
@import "../../../style/quill.css";
@import "../../../style/quill.css";
@import url("~mpvue-wxparse/src/wxParse.css");

* {
  margin: 0;
  padding: 0;
}
.UEimages {
  max-width: 100%;
}
main {
  padding: 40rpx 40rpx 188rpx;
}
main h1 {
  font-size: 36rpx;
  color: #333333;
  font-weight: bold;
  line-height: 54rpx;
  text-align: left;
}
main .time {
  color: #999999;
  font-size: 24rpx;
  margin-top: 22rpx;
  margin-bottom: 40rpx;
}
main .txt_wrap {
  padding-bottom: 40rpx;
  border-bottom: 1px solid #e6e6e6;
}
main .way {
  margin-top: 28rpx;
}
main .way p {
  font-size: 28rpx;
  color: #576b95;
  line-height: 48rpx;
  word-break: break-all;
}

footer .btn_wrap {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  height: 148rpx;
  line-height: 148rpx;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-around;
}
footer .btn_wrap button {
  width: 320rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 30rpx;
  color: #332503;
  box-sizing: border-box;
  font-weight: bold;
}
footer .btn_wrap button:first-child {
  background: #ffb90c;
}
footer .btn_wrap button:nth-child(2) {
  background: #f5f5f5;
  margin-left: 30rpx;
}
footer .btn_wrap button::after {
  border: none;
}
</style>

