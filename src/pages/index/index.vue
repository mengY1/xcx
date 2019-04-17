<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <!-- 活动更新提示弹窗 -->
    <div v-if="firstShow">
      <popups v-on:firstShowAction="firstShowAction" v-on:going="going"></popups>
    </div>

    <div class="header_wrap">
      <div class="header" v-show="!fixStatus">
        <div class="header_left" @click="toChooseSchool">
          <i class="iconfont icon-Positioning"></i>
          <span class="schoolName">{{nowSchool}}</span>
          <i class="iconfont icon-select"></i>
        </div>
        <div class="header_right">
          <i class="iconfont icon-search" @click="toSearch"></i>
          <i class="iconfont icon-my" @click="toMine"></i>
        </div>
      </div>

      <div class="headerTab">
        <scroll-view scroll-x="true" :class="{'fixTab':fixStatus}">
          <div class="navbar">
            <block v-for="(item,index) in headerTab" :index="index" :key="index">
              <div :id="index" class="navbar_item" @click="tabClick(index,item.type,item.tab_name)">
                <form @submit="submit" report-submit='true'>
                  <button form-type="submit" class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.tab_name}}</button>
                </form>
                <div class="navbar_slider" v-if="index==activeIndex"></div>
              </div>
            </block>
          </div>
        </scroll-view>
      </div>
    </div>
    <main style="background:#f5f5f5;padding-bottom:20rpx" :class="{'distance':fixStatus}">
      <div class="main_wrap">
        <swiper class="swiper" autoplay="true" circular="true" interval="3000" indicator-dots="true" indicator-active-color="#fff" indicator-color="rgba(255,255,255,0.4)" style="height:164rpx">
          <block v-for="(item,index) in banner" :index="index" :key="index">
            <swiper-item>
              <img @click="toRank(item.url,item.banner_id)" :src="url+item.cover" :data-id="item.url">
            </swiper-item>
          </block>
        </swiper>
      </div>
      <!-- 信息列表 -->
      <div class="list_loading" v-show="list_loadingShow">
        <listLoad :scrollTop="scrollTop"></listLoad>
      </div>
      <div class="list_wrap">
        <div class="msgList">
          <block v-for="(item,index) in mainList" :key="index">
            <!-- 无图情况下的列表 -->
            <div class="list-item noImg" v-if="item.banners.length===0">
              <div>
                <!-- <span class="topIcon" v-if="index===0">置顶</span> -->
                <form report-submit="true" @submit="sendFormId">
                  <button form-type="submit" class="shareBtn" open-type="share" @click="shareIdGet" :style="{backgroundImage:'url('+bgImg+')'}" :id="item.detail_id" :data-title="item.title" :data-type="item.type"></button>
                </form>
              </div>
              <div class="title" @click="toDetail(item.detail_id,item.type)">
                <p>{{item.title}}</p>
              </div>
              <div class="intro" @click="toDetail(item.detail_id,item.type)">
                <p><span>{{item.publisher}}</span><span>{{item.created_at}}</span></p>
              </div>
            </div>
            <!-- 有图情况下的列表 -->
            <div class="list-item" v-if="item.banners.length>0">
              <div>
                <!-- <span class="topIcon" v-if="index===0">置顶</span> -->
                <form report-submit="true" @submit="sendFormId">
                  <button class="shareBtn" form-type="submit" open-type="share" @click="shareIdGet" :style="{backgroundImage:'url('+bgImg+')'}" :id="item.detail_id" :data-title="item.title" :data-type="item.type"></button>
                </form>
              </div>
              <div class="item_left">
                <img :src="url+item.banners[0]" @click="toDetail(item.detail_id,item.type)">
              </div>
              <div class="item_right" @click="toDetail(item.detail_id,item.type)">
                <div class="title">
                  <p>{{item.title}}</p>
                </div>
                <div class="intro">
                  <p><span>{{item.publisher}}</span><span>{{item.created_at}}</span></p>
                </div>
              </div>
            </div>
          </block>
        </div>
      </div>
    </main>
    <!-- <footer>
      <p v-if="!pShow">暂无更多内容</p>
      <p v-else>查看更多内容</p>
    </footer> -->
  </div>
</template>

<script>
import common from "@/utils/common";
import {
  bannerInfo,
  userInfo,
  access_token,
  bannerRecord,
  nearSchool,
  list,
  tabName,
} from "@/utils/api";
import { formId } from "@/utils/common";
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import loading from "@/components/loading";
import listLoad from "@/components/list_loading";
import { toSharePage } from "@/utils/index/toSharePage";
import {
  getListInfo,
  moreList,
  toDetail,
  shareMsg
} from "@/utils/index/indexList";
import popups from "@/components/tips/popups";
export default {
  data() {
    return {
      token: "",
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      banner: "",
      page: 1,
      pShow: true,
      loadingShow: true,
      list_loadingShow: true, //列表页面的加载样式
      nowSchool: "",
      fixStatus: false, //隐藏定位一行并且让导航栏固定
      scrollTop: "",
      headerTab: [],
      mainList: [],
      activeIndex: 0,
      selectTab: 0, //选择的tab类型
      bgImg: url.url + "/img/2.0/share.png", //分享icon
      firstShow: true //活动更新提醒
    };
  },
  onPageScroll(e) {
    this.fixStatus = e.scrollTop >= 44 && e.scrollTop > 0 ? true : false;
    this.scrollTop = e.scrollTop;
  },
  onReachBottom() {
    if (this.pShow) {
      this.page += 1;
      moreList(this.selectTab, this.page).then(res => {
        if (res.data.length > 0) {
          for (var i in res.data) {
            if (this.selectTab === 0) {
              res.data[i].detail_id = res.data[i].foreign_id;
            }
            if (this.selectTab === 1) {
              res.data[i].detail_id = res.data[i].new_id;
            } else if (this.selectTab === 2) {
              res.data[i].detail_id = res.data[i].university_id;
            } else if (
              // 求职，考研，学术，社团活动，竞赛
              this.selectTab === 3 ||
              this.selectTab === 4 ||
              this.selectTab === 5 ||
              this.selectTab === 6 ||
              this.selectTab === 7
            ) {
              res.data[i].detail_id = res.data[i].act_id;
            }
          }
          for (var i of res.data) {
            this.mainList.push(i);
          }
        } else {
          this.pShow = false;
        }
      });
    }
  },
  onPullDownRefresh() {
    this.loadingShow = true;
    this.list_loadingShow = true;
    this.page = 1;
    this.pShow = true;
    this.getInfo();
    wx.stopPullDownRefresh();
  },
  components: {
    loading,
    popups,
    listLoad
  },
  created() {},
  onLoad(options) {
    this.loadingShow = true;
    this.page = 1;
    this.pShow = true;
    this.getInfo(options);
  },
  onShow() {
    var that = this;
    if (wx.getStorageSync("nowSchool")) {
      setTimeout(() => {
        this.nowSchool = wx.getStorageSync("nowSchool");
      }, 300);
    }
    if (wx.getStorageSync("refreshIndex") === 20) {
      this.loadingShow = true;
      this.page = 1;
      this.pShow = true;
      this.getInfo();
      wx.setStorageSync("refreshIndex", 10); //10则不刷新页面重新请求数据
    }
  },
  methods: {
    shareIdGet(e) {
      if (e) {
        formId(e);
      }
    },
    sendFormId(e) {
      formId(e);
    },
    toMine() {
      wx.navigateTo({
        url: "/pages/mine/index"
      });
    },
    firstShowAction() {
      this.firstShow = false;
      wx.setStorageSync("firstShow", true);
    },
    going() {
      this.firstShow = false;
      wx.setStorageSync("firstShow", true);
      wx.showModal({
        title: "提示",
        content: "奇集社团还在开发中",
        showCancel: false
      });
    },
    tabClick(index, type, name) {
      if (common.status == "dev") {
        wx.reportAnalytics("index_tab", {
          tab_name: name
        });
      }
      if (index != this.activeIndex) {
        this.mainList = [];
        this.list_loadingShow = true;
        this.activeIndex = index;
        this.selectTab = type;
        this.pShow = true;
        this.page = 1;
        this.getListInfo();
      }
    },
    getTabInfo() {
      tabName({}, true)
        .then(res => {
          this.headerTab = res.data;
          var recommendObj = { tab_name: "推荐", type: 0 };
          this.headerTab.unshift(recommendObj);
          this.getListInfo();
        })
        .catch(err => {
          this.loadingShow = false;
          this.list_loadingShow =false;
        });
    },
    getListInfo() {
      getListInfo(this.selectTab)
        .then(res => {
          this.mainList = res.data;
          for (var i in this.mainList) {
            if (this.selectTab === 0) {
              this.mainList[i].detail_id = this.mainList[i].foreign_id;
            } else if (this.selectTab === 1) {
              this.mainList[i].detail_id = this.mainList[i].new_id;
            } else if (this.selectTab === 2) {
              this.mainList[i].detail_id = this.mainList[i].university_id;
            } else if (
              // 求职，考研，学术，竞赛
              this.selectTab === 3 ||
              this.selectTab === 4 ||
              this.selectTab === 5 ||
              this.selectTab === 6 ||
              this.selectTab === 7
            ) {
              this.mainList[i].detail_id = this.mainList[i].act_id;
            }
          }
          this.list_loadingShow = false;
        })
        .catch(err => {
          this.list_loadingShow = false;
        });
    },
    // 去列表详情
    toDetail(id, type) {
      toDetail(this.selectTab, id, type, "list");
    },
    getUserInfo() {
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      this.token = token;
      userInfo({}, this.token, true)
        .then(function(res) {
          if (res.cms_school_id) {
            wx.setStorageSync("cms_school_id", res.cms_school_id);
          }
          if (res.orgs) {
            wx.setStorageSync("org_id", res.orgs.org_id);
          }
          wx.setStorageSync("audit_status", res.last_org_claim.audit_status);
        })
        .catch(err => {});
    },
    async getInfo(options) {
      try {
        if (!wx.getStorageSync("firstShow")) {
          this.firstShow = true;
        } else {
          this.firstShow = false;
        }
        this.getTabInfo();
        let banner = await bannerInfo();
        this.banner = banner.data;
        let headerTabRes= await getHeaderTabArr()
        this.headerTab=headerTabRes
        console.log(headerTabRes)
        var longitude = wx.getStorageSync("longitude");
        var latitude = wx.getStorageSync("latitude");
        if (wx.getStorageSync("silentlogin").refresh_token) {
          var refresh_token = wx.getStorageSync("silentlogin").refresh_token;
          let refTokenAction = await access_token({
            refresh_token: refresh_token
          });
          var silentMsg = wx.getStorageSync("silentlogin");
          silentMsg.token = refTokenAction.access_token;
          silentMsg.refresh_token = refTokenAction.refresh_token;
          wx.setStorageSync("silentlogin", silentMsg);
          this.getUserInfo();
          if (options) {
            toSharePage(options);
          }
        } else {
          if (options) {
            toSharePage(options);
          }
        }
        this.loadingShow = false;
        // 获取的缓存为10并且用户是有授权过的则提醒切换城市(10提醒，20不提醒)
        if (
          wx.getStorageSync("refreshLocation") == 10 &&
          wx.getStorageSync("silentlogin")
        ) {
          this.getLocation();
        }
      } catch (e) {
        this.loadingShow = false;
      }
    },
    // 获取地理位置
    getLocation() {
      var that = this;
      wx.getLocation({
        type: "wgs84",
        success(res) {
          that.getSchool(res.longitude, res.latitude);
        }
      });
    },
    //根据地理位置获取附近学校
    getSchool(lng, lat) {
      var that = this;
      wx.setStorageSync("refreshLocation", 20);
      nearSchool(
        {
          lng: lng,
          lat: lat
        },
        true
      ).then(res => {
        var { lat, lng, name, cms_school_id } = res.data[0];
        if (name != wx.getStorageSync("nowSchool")) {
          wx.showModal({
            title: "提示",
            content: "你当前所在" + name + "是否切换定位",
            success(res) {
              if (res.confirm) {
                wx.setStorageSync("longitude", lng);
                wx.setStorageSync("latitude", lat);
                wx.setStorageSync("nowSchool", name);
                wx.setStorageSync("user_school_id", cms_school_id);
                that.nowSchool = name;
                that.loadingShow = true;
                that.page = 1;
                that.pShow = true;
                that.activeIndex = 0;
                that.getInfo();
              } else {
              }
            }
          });
        }
      });
    },
    toRank(url, id) {
      if (common.status == "dev") {
        wx.reportAnalytics("index_banner_click", {});
      }
      if (wx.getStorageSync("silentlogin")) {
        bannerRecord(
          id,
          { unionid: wx.getStorageSync("silentlogin").unionid },
          true
        );
      }
      if (url === "qj_score") {
        wx.navigateToMiniProgram({
          appId: "wx9932fe68bacd1398",
          path: "pages/home/home/home"
        });
      } else if (url.indexOf("pages/activity/index") != -1) {
        wx.switchTab({
          url
        });
      } else {
        wx.navigateTo({
          url
        });
      }
    },
    toSearch() {
      if (common.status == "dev") {
        wx.reportAnalytics("index_search_btn", {});
      }
      wx.navigateTo({
        url: "search/index"
      });
    },
    toChooseSchool() {
      wx.navigateTo({
        url: "/pages/index/address/chooseSchool"
      });
    }
  },
  onShareAppMessage: function(res) {
    var obj = {};
    var id = "";
    if (res.target) {
      obj = shareMsg(
        this.selectTab,
        res.target.id,
        res.target.dataset.title,
        res.target.dataset.type
      );
      id = res.target.id;
    } else {
      // 右上角三个点的分享
      obj.title = "来奇集，你需要的这里都有";
      obj.path = "/pages/index/index";
      // obj.imageUrl = this.url+"/img/2.0/2x.jpg";
    }
    return {
      title: obj.title,
      path: obj.path,
      imageUrl: obj.imageUrl
    };
  }
};
</script>

<style scoped>
/* @import url("../../../static/css/reset.css"); */
@import "../../style/icon.css";

/*隐藏滚动条*/
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.iconfont {
  color: #333333;
  display: inline-block;
  vertical-align: middle;
}
.icon-Positioning {
  font-size: 36rpx;
}
.icon-select {
  font-size: 22rpx;
  margin-left: 14rpx;
}
.icon-search {
  margin-right: 52rpx;
}
.header_wrap {
  color: #333333;
  font-weight: bold;
}
.header_wrap .header {
  padding-left: 32rpx;
  overflow: hidden;
  height: 88rpx;
  line-height: 88rpx;
  border-bottom: 1px solid #e6e6e6;
}
.header_wrap .header_left {
  float: left;
}
.header_wrap .header_left .schoolName {
  font-size: 36rpx;
  margin-left: 16rpx;
  display: inline-block;
  vertical-align: middle;
  max-width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header_wrap .header_right {
  float: right;
  margin-right: 50rpx;
}

.headerTab scroll-view {
  height: 88rpx;
}
.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  /* position: fixed;
  top: 0; */
  height: 88rpx;
  background: #ffffff;
  z-index: 5;
}
.fixTab {
  position: fixed;
  top: 0;
  height: 88rpx;
  z-index: 1;
  background: #fff;
}
.distance {
  margin-top: 176rpx;
}
.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  text-align: center;
}
.navbar_title {
  background: #fff;
  color: #333333;
  display: inline-block;
  font-size: 28rpx;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  color: #999999;
  box-sizing: border-box;
  height: 88rpx;
  line-height: 88rpx;
}
button::after {
  border: none;
}
.navbar_selectedTitle {
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
}
.navbar_slider {
  position: absolute;
  content: " ";
  left: 48rpx;
  top: 73rpx;
  width: 22rpx;
  height: 4rpx;
  background-color: #ffb90c;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.main_wrap {
  padding: 0 20rpx;
  overflow: hidden;
}
.swiper {
  width: 710rpx;
  border-radius: 8rpx;
  margin-top: 10rpx;
}
.swiper swiper-item {
  border-radius: 8rpx;
}
.swiper swiper-item img {
  width: 710rpx;
  height: 164rpx;
  border-radius: 8rpx;
}

.list_loading {
  position: fixed;
  top: 30%;
  width: 100%;
  height: 70%;
  z-index: 20;
}
.list_wrap {
  padding: 0 20rpx;
}

.msgList .list-item {
  width: 710rpx;
  padding: 20rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #fff;
  position: relative;
  overflow: hidden;
  margin-top: 10rpx;
}
.msgList .list-item .title {
  height: 80rpx;
  margin-top: -6rpx;
}
.msgList .list-item .title p {
  font-size: 32rpx;
  color: #333333;
  line-height: 48rpx;
  font-weight: bold;
  width: 566rpx;
  overflow: hidden;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msgList .list-item .intro {
  margin-top: 20rpx;
}
.msgList .list-item .intro p span {
  font-size: 24rpx;
  color: #999999;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msgList .list-item .intro p span:first-child {
  max-width: 182rpx;
  margin-right: 20rpx;
}
.msgList .noImg .intro p span:first-child {
  max-width: 342rpx;
  margin-right: 20rpx;
}
.msgList .list-item .topIcon {
  display: block;
  position: absolute;
  width: 60rpx;
  height: 32rpx;
  line-height: 30rpx;
  text-align: center;
  color: #ffffff;
  background: #ff864d;
  border-radius: 4rpx;
  top: 20rpx;
  right: 20rpx;
  font-size: 18rpx;
}
.msgList .list-item .shareBtn {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  top: 100rpx;
  right: 24rpx;
  background: #fff;
  background-size: 100% 100%;
  padding: 0;
  border-radius: 0;
}
.msgList .list-item .item_left {
  float: left;
}
.msgList .list-item .item_left img {
  width: 174rpx;
  height: 130rpx;
}
.msgList .list-item .item_right {
  float: left;
  margin-left: 18rpx;
  width: 410rpx;
}
.msgList .list-item .item_right .title p {
  width: 362rpx;
}

button::after {
  border: none;
}

footer p {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
  color: #99958a;
}
</style>
