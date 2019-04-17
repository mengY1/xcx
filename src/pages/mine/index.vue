<template>
  <div class="mine">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>

    <div class='shadow' v-if="isShowTips"></div>

    <div style="padding:0rpx 35rpx 0rpx 40rpx">
      <div class="userInfo">
        <div class="userInfo_top">
          <img :src="avatar">
          <div class="userTxt">
            <div style="overflow:hidden">
              <p class="userName">{{userName}}</p>
            </div>
            <p v-show="schoolName" style="font-size:24rpx;font-family:PingFang-SC-Bold;color:rgba(153,153,153,1);line-height:37rpx;text-align:center;">{{schoolName}}<span class="clubName" v-if="audit_status==20"> | {{clubName}}</span></p>

            <span class="build" @click="toBuildClub" v-if="audit_status == 30 ">
              <span style="color:#99958a">|</span> 创建社团发活动</span>

          </div>
        </div>
      </div>
    </div>

    <div class='successTips' v-if="isShowTips">
      <img class="mainImg" v-if="audit_status==20" :src="url+'/img/home/shenghetongguo.png'" alt="">
      <img class="mainImg" v-if="audit_status==30" :src="url+'/img/home/shengheshibai.png'" alt="">
      <div class="close_wrap" @click="changeIsShowTips">
        <img :src="url+'/img/home/pop_guanbi@2x.png'" class="closeImg">
      </div>
      <div class="content">
        <p>审核通知</p>
        <p v-if="audit_status==20">你创建的{{clubName}}社团通过了审核</p>
        <p v-if="audit_status==30">你创建的{{clubName}}社团审核失败了</p>
      </div>
      <div class="btn">
        <p @click="changTo" v-if="audit_status==20">去发活动</p>
        <p @click="toFail" v-if="audit_status==30">查看原因</p>
      </div>
    </div>
    <main>
      <!-- 社长身份界面 -->

      <!-- 个人用户界面 -->
      <div class="personal">
        <button class="mine-item" :open-type="index==4?'contact':''" v-for="(item,index) in main" :key="index" :data-id="index" @click="toTmore">
          <img :src="item.img" class="icon">
          <text>{{item.title}}</text>
          <div class="waiToSee" v-if="index==3&&unread_message>0">
            <text>你有{{unread_message}}条待读消息</text>
          </div>
          <div class="redDot" v-if="index==3&&unread_message>0"></div>
          <img src="http://54qj.54qn.cn/Public/images/club/detailsIcon.png" class="more">
        </button>
        <p class="build" @click="toBuildClub" v-if="(!org_claim_id&&!org_id)&&is_full==1"><img src="http://54qjapi.54qn.cn/img/2.0/img.jpg" style="width:43rpx;height:32rpx;"> <span style="color:#99958a"></span> 创建社团发活动</p>
      </div>
    </main>
    <div class="userInfo_bottom" v-show="is_full==0">
      <div class="perfectBtn" @click="toRegister">
        <button open-type="getUserInfo">完善个人信息</button>
      </div>
    </div>
    <div class="userInfo_bottom" v-if="audit_status == 10 " @click="toSchedule">
      <div class="perfectBtn">
        <button>查看审核进度</button>
      </div>
    </div>
    <div class="userInfo_bottom" v-if="audit_status==20" @click="toPublish">
      <div class="perfectBtn">
        <button>发活动</button>
      </div>
    </div>
  </div>

</template>
<script>
import url from "@/utils/common";
import { claimsGet, userInfo, silentlogin, claims_id } from "@/utils/api";
import tabBarMsg from "@/utils/tabBarMsg";
import loading from "@/components/loading";
import acttips from "@/components/tips/actUpdateTips";
export default {
  data() {
    return {
      loadingShow: true,
      actTipsShow: false, //活动更新提示是否显示
      isShowTips: "",
      url: url.url,
      org_claim_id: "",
      org_id: "",
      filterBgShow: false,
      userName: "用户名最大字数限制11字",
      schoolName: "",
      clubName: "",
      userInfoList: {},
      is_full: 0,
      code: "",
      iv: "",
      encryptedData: "",
      money: "",
      audit_status: "", //创建社团审核状态
      unread_message: 0,
      avatar: "http://54qj.54qn.cn/Public/images/mine/noComplete.jpg",
      main: [
        {
          img: url.url + "/img/2.0/tinified/mysubscription.png",
          title: "我的订阅"
        },
        {
          img: url.url + "/img/2.0/tinified/myCollection.png",
          title: "我的收藏"
        },
        {
          img: url.url + "/img/2.0/tinified/myreminder.png",
          title: "日程提醒"
        },
        {
          img: url.url + "/img/2.0/tinified/myMessage.png",
          title: "我的消息"
        },
        {
          img: url.url + "/img/2.0/tinified/myservice.png",
          title: "联系客服"
        }
      ]
    };
  },
  components: {
    loading,
    acttips
  },
  onShow() {
    //如果没有获取到openid就去授权页面
    if (!wx.getStorageSync("silentlogin").openid) {
      wx.navigateTo({
        url: "/pages/login/shouquan/shouquan"
      });
    }
    var wechatInfo = wx.getStorageSync("silentlogin");
    this.userName = wechatInfo.nickname;
    this.avatar = this.url + wechatInfo.avatar;
    if (wx.getStorageSync("silentlogin").token) {
      this.loadingShow = true;
      this.getInfo();
    } else {
      this.loadingShow = false;
    }
    if (this.userInfoList.is_full) {
      this.is_full = this.userInfoList.is_full;
    }
    if (this.userInfoList.orgs != undefined) {
      this.clubName = this.userInfoList.orgs.name;
    }
    // 显示红点(活动更新提示)
    if (!wx.getStorageSync("act_refresh")) {
      wx.showTabBarRedDot({
        index: 1
      });
      this.actTipsShow = true;
    } else {
      wx.hideTabBarRedDot({
        index: 1
      });
      this.actTipsShow = false;
    }
  },
  updated() {
    if (this.userInfoList.realname) {
      this.userName = this.userInfoList.realname;
    }
    this.schoolName = this.userInfoList.cms_school_name;
    this.unread_message = this.userInfoList.unread_message;
    wx.setStorageSync("cms_school_id", this.userInfoList.cms_school_id);
    if (this.userInfoList.is_full) {
      this.is_full = this.userInfoList.is_full;
    }
    if (this.userInfoList.orgs != undefined) {
      this.clubName = this.userInfoList.orgs.name;
      wx.setStorageSync("org_id", this.userInfoList.orgs.org_id);
    }
    this.unread_message = this.userInfoList.unread_message;
    // 设置消息条数显示
    tabBarMsg(this.unread_message);
  },
  methods: {
    async getInfo() {
      var token = " ";
      if (wx.getStorageSync("token")) {
        token += wx.getStorageSync("token");
      } else {
        token += wx.getStorageSync("silentlogin").token;
      }
      try {
        var userInfoList = await userInfo({}, token, true);
      } catch (e) {
        //重启小程序会刷新token，以防用户在token刷新过程中切换到该页面，导致token失效，故在失效的时候catch错误并重新执行方法拿最新的token进行数据请求，直至成功
        this.getInfo();
        // wx.navigateTo({
        //   url: "/pages/login/shouquan/shouquan"
        // });
      }
      setTimeout(() => {
        this.loadingShow = false;
      }, 200);
      this.userInfoList = userInfoList;
      this.is_full = userInfoList.is_full;

      if (this.is_full == 1) {
        var wechatInfo = wx.getStorageSync("silentlogin");
        this.userName = this.userInfoList.realname;
        this.schoolName = this.userInfoList.cms_school_name;
        this.avatar = this.url + wechatInfo.avatar;
      }
      if (userInfoList.orgs) {
        this.audit_status = 20;
      } else if (userInfoList.last_org_claim) {
        this.audit_status = userInfoList.last_org_claim.audit_status;
        let id = userInfoList.last_org_claim.org_claim_id; //社团认领/创建id
        this.org_claim_id = id;
      } else {
        this.audit_status = "";
        this.org_claim_id = "";
      }
      if (this.audit_status == 20) {
        if (wx.getStorageSync("isShowTips") != "success") {
          this.isShowTips = true;
        } else {
          this.isShowTips = false;
        }
      } else if (this.audit_status == 30) {
        if (wx.getStorageSync("isShowTips") != "fail") {
          this.isShowTips = true;
        } else {
          this.isShowTips = false;
        }
      } else {
        this.isShowTips = false;
      }
      if (userInfoList.orgs) {
        var org_id = userInfoList.orgs.org_id; //我的社团id
        this.org_id = org_id;
      } else {
        this.org_id = "";
      }
      wx.setStorageSync("org_claim_id", id);
      if (this.org_id) {
        wx.setStorageSync("org_id", this.org_id);
      }
      this.money = userInfoList.orgs.wallet_amount;
    },
    toRegister() {
      if (url.status == "dev") {
        wx.reportAnalytics("perfect_information_button", {});
      }
      wx.navigateTo({
        url: "./../login/register/index"
      });
    },
    toBuildClub() {
      if (url.status === "dev") {
        wx.reportAnalytics("personal_center_create_org", {});
      }
      wx.showModal({
        title: "提醒",
        content: "奇集社团还在开发中",
        showCancel: false
      });
    },
    toSchedule() {
      wx.navigateTo({
        url: "/pages/club/fail/index?org_claim_id=" + this.org_claim_id
      });
    },
    toTmore(e) {
      var id = e.currentTarget.dataset.id;
      var menuName = ""; //点击的菜单名
      if (id == 0) {
        menuName = "我的订阅";
        wx.navigateTo({
          url: "./mySubscription/index"
        });
      } else if (id == 1) {
        menuName = "我的收藏";
        wx.navigateTo({
          url: "./myCollect/index"
        });
      } else if (id == 2) {
        menuName = "日程提醒";
        wx.navigateTo({
          url: "./myTips/index"
        });
      } else if (id == 3) {
        wx.navigateTo({
          url: "./message/message"
        });
      }
      if (url.status == "dev" && menuName) {
        wx.reportAnalytics("personal_center_menu", {
          menu: menuName
        });
      }
    },
    toHistory() {
      wx.navigateTo({
        url: "/pages/mine/buildClub/history/history"
      });
    },
    changTo() {
      this.isShowTips = 1;
      wx.setStorageSync("isShowTips", "success");
      wx.navigateTo({
        url: "./publish/publish"
      });
    },
    toFail() {
      this.isShowTips = 1;
      wx.setStorageSync("isShowTips", "fail");
      wx.navigateTo({
        url: "/pages/club/fail/index?org_claim_id=" + this.org_claim_id
      });
    },
    toPublish() {
      if (url.status === "dev") {
        wx.reportAnalytics("personal_center_create_act", {});
      }
      wx.showModal({
        title: "提醒",
        content: "奇集社团还在开发中",
        showCancel: false
      });
    },
    changeIsShowTips() {
      this.isShowTips = false;
      if (this.audit_status == 20) {
        wx.setStorageSync("isShowTips", "success");
      } else if (this.audit_status == 30) {
        wx.setStorageSync("isShowTips", "fail");
      }
    },
    toActivity() {
      wx.navigateTo({
        url: "./activity/activity"
      });
    },
    toClubActivity() {
      wx.navigateTo({
        url: "../activity/published/published"
      });
    },
    childByValue: function(filterBgShow) {
      this.filterBgShow = filterBgShow;
    },
    toSupport() {
      var url = "./wallet/wallet?money=";
      wx.navigateTo({
        url: url + this.money
      });
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "来奇集，你需要的这里都有",
      path: "/pages/index/index",
      imageUrl: this.url + "/img/2.0/2x.jpg"
    };
  }
};
</script>
<style>
.shadow {
  z-index: 2;
  width: 1000rpx;
  height: 2000rpx;
  background: rgba(51, 25, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.mineBg img {
  width: 100%;
  height: 1206rpx;
  position: fixed;
  top: 0;
  z-index: -1;
}
.userInfo {
  background: rgba(255, 255, 255, 0.7);
  position: relative;
}
.userInfo .QRcode {
  position: absolute;
  top: 48rpx;
  right: 20rpx;
  width: 44rpx;
  height: 44rpx;
}
.userInfo .president {
  width: 80rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  color: #fff;
  border-radius: 8rpx;
  background: #ccb166;
  font-size: 22rpx;
  float: left;
  margin-top: 19rpx;
  margin-left: 20rpx;
}
.userInfo .userInfo_top {
  overflow: hidden;
  padding-bottom: 30rpx;
  position: relative;
  top: 0;
  left: 0;
}
.userInfo .userInfo_top img {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 248, 229, 1);
  border-radius: 50%;
  position: relative;
  left: 50%;
  margin-left: -80rpx;
  top: 0;
}
.userInfo .userInfo_top .userTxt {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.userInfo .userInfo_top .userTxt p {
  line-height: 68rpx;
}
.userInfo .userInfo_top .userTxt .userName {
  font-size: 40rpx;
  font-weight: bold;
  color: #331900;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}
.userInfo .userInfo_top .userTxt span:nth-child(2) {
  font-size: 26rpx;
  color: #99958a;
  margin-left: 20rpx;
}
.userInfo .userInfo_top .userTxt .clubName {
  color: #99958a;
  font-size: 26rpx;
  display: inline;
}
.build {
  margin-top: 80rpx;
  margin-left: 224rpx;
  font-size: 24rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
  line-height: 50rpx;
}
.successTips {
  position: fixed;
  top: 15%;
  left: 11%;
  width: 590rpx;
  height: 700rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 8rpx;
  z-index: 3;
  text-align: center;
}
.successTips .mainImg {
  width: 350rpx;
  height: 256rpx;
  margin-top: 90rpx;
}
.successTips .close_wrap {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  top: 12rpx;
  right: -8rpx;
}
.successTips .closeImg {
  width: 22rpx;
  height: 22rpx;
}
.successTips .content p:first-child {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  margin-top: 24rpx;
}
.successTips .content p:nth-child(2) {
  color: #999999;
  font-size: 28rpx;
  margin-top: 4rpx;
}
.successTips .btn p {
  width: 230rpx;
  height: 88rpx;
  background: rgba(255, 185, 12, 1);
  border-radius: 44rpx;
  font-size: 28rpx;
  color: #331900;
  line-height: 88rpx;
  text-align: center;
  margin: 52rpx auto 0;
}
main {
  padding: 0 40rpx;
}
main .president .presidentBox {
  display: flex;
  flex-direction: initial;
  justify-content: space-between;
  padding: 0 22rpx;
}
main .president .presidentBox .president-item {
  width: 128rpx;
  height: 192rpx;
  box-sizing: border-box;
  text-align: center;
}
main .president .presidentBox .president-item img {
  width: 120rpx;
  height: 120rpx;
}
main .president .presidentBox .president-item p {
  font-size: 32rpx;
  color: #333333;
  margin-top: -20rpx;
}
main .commonBox {
  padding: 0 20rpx;
}
main .commonBox .common-item {
  border-top: 1px solid #d9d9d9;
  line-height: 96rpx;
  font-size: 28rpx;
  color: #333333;
  position: relative;
  overflow: hidden;
}
main .commonBox .common-item span {
  float: left;
}
main .commonBox .common-item .waiToSee {
  font-size: 28rpx;
  color: #cccccc;
  float: left;
  margin-left: 260rpx;
}
main .commonBox .common-item .redDot {
  position: absolute;
  top: 44rpx;
  right: 278rpx;
  width: 14rpx;
  height: 14rpx;
  background: #ff4c5b;
  border-radius: 50%;
}
main .commonBox .common-item .more {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  right: 0rpx;
  top: 32rpx;
}
.mine-item {
  height: 140rpx;
  border-bottom: 2rpx solid #e6e6e6;
  position: relative;
  line-height: 140rpx;
}
.mine-item:last-child {
  border: none;
}
.mine-item .toMore {
  float: right;
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  top: 44rpx;
  left: 610rpx;
  z-index: 20;
}
.mine-item .icon {
  width: 120rpx;
  height: 120rpx;
  margin-top: 0rpx;
  position: absolute;
  top: 15rpx;
  left: 4rpx;
}
.mine-item text {
  float: left;
  font-size: 34rpx;
  color: #99958a;
  margin-left: 94rpx;
}
.mine-item .waiToSee {
  float: left;
  /* margin-left: 45rpx; */
  overflow: hidden;
}
.mine-item .waiToSee text {
  font-size: 26rpx;
  margin-left: 162rpx;
}
.mine-item .redDot {
  position: absolute;
  top: 64rpx;
  right: 266rpx;
  width: 14rpx;
  height: 14rpx;
  background: #ff4c5b;
  border-radius: 50%;
}
.mine-item .more {
  position: absolute;
  width: 16rpx;
  height: 28rpx;
  top: 58rpx;
  left: 624rpx;
}
.userInfo_bottom {
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}
.userInfo_bottom .perfectBtn button {
  width: 590rpx;
  height: 88rpx;
  background: #ffb90c;
  border-radius: 44rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 28rpx;
  color: #331900;
}
.publish {
  overflow: hidden;
  position: fixed;
  bottom: 20rpx;
  right: 20rpx;
  float: right;
}
.publish img {
  width: 120rpx;
  height: 120rpx;
}
button::after {
  border: none;
}
button {
  background-color: #fff;
}
button {
  border-radius: 0;
}
</style>

