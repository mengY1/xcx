<template>
  <div class="search">
    <div class="searchFloat">
      <div class="search_box">
        <div class="inputBox">
          <div class="input">
            <input type="text" class="in" maxlength="20" @focus="searchFocu" @blur="searchBlu" :value="searchName" v-model="searchName" @confirm="toSearch" confirm-type="search">
            <div class="searchNumber" v-show="searchFocus">
              <text class="searchText">输入关键词</text>
            </div>
            <text class="iconfont icon-delete_fill" @click="deleted" v-if="searchName.length>0">
              <!-- <i class="iconfont icon-delete_fill" ></i> -->
            </text>
          </div>
          <span class="searchResult" @click="toSearch">搜索</span>
        </div>
        <div class="headerTab" v-show="tabShow">
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
    </div>

    <!-- 信息列表 -->
    <div class="list_wrap">
      <div class="msgList">
        <block v-for="(item,index) in mainList" :key="index">
          <!-- 无图情况下的列表 -->
          <div class="list-item noImg" v-if="item.banners.length===0">
            <div class="title" @click="toDetail(item.detail_id,item.type)">
              <p>{{item.title}}</p>
            </div>
            <div class="intro" @click="toDetail(item.detail_id,item.type)">
              <p><span>{{item.publisher}}</span><span>{{item.created_at}}</span></p>
            </div>
          </div>
          <!-- 有图情况下的列表 -->
          <div class="list-item" v-if="item.banners.length>0">
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
    <div class='noContent seachListNoContent' v-if="listNull">
      <image :src="url+'/img/2.0/Pagedefault.jpg'"></image>
      <div>暂无相关搜索内容</div>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import changeTime from "@/utils/changeTime";
import { tabName } from "@/utils/api";
import {
  getListInfo,
  moreList,
  toDetail,
  shareMsg
} from "@/utils/index/indexList";
export default {
  data() {
    return {
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      searchFocus: true,
      searchName: "",
      token: "",
      fixStatus: false,
      listNull: false, //空列表
      activeIndex: 0,
      selectTab: 0, //选择的tab类型
      tabName: "全部", //选择的类型名称
      headerTab: [],
      noContent: false, //暂无结果
      mainList: [],
      page: 1,
      pShow: true,
      tabShow: false
    };
  },
  onReachBottom() {
    if (this.pShow) {
      this.page += 1;
      moreList(this.selectTab, this.page, this.searchName).then(res => {
        if (res.data.length > 0) {
          for (var i in res.data) {
            if (this.selectTab === 0) {
              res.data[i].detail_id = res.data[i].foreign_id;
            } else if (this.selectTab === 1) {
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
  onLoad() {
    this.searchName = "";
    this.pShow = true;
    this.mainList = [];
    this.page = 1;
    this.activeIndex = 0;
    this.listNull = false;
    this.getTabInfo();
    this.tabShow = false;
  },
  onShow() {},
  methods: {
    deleted() {
      console.log(111);
      this.searchName = "";
    },
    tabClick(index, type, name) {
      if (index != this.activeIndex) {
        this.activeIndex = index;
        this.selectTab = type;
        this.tabName = name;
        if (this.searchName) {
          this.searchResult(this.selectTab);
        } else {
          this.mainList = [];
        }
      }
    },
    searchFocu() {
      this.searchFocus = false;
    },
    searchBlu() {
      this.searchName == ""
        ? (this.searchFocus = true)
        : (this.searchFocus = false);
    },
    toSearch(e) {
      this.searchName = this.searchName.replace(/\s*/g, "");
      if (this.searchName) {
        this.searchResult(this.selectTab);
      }
    },
    getTabInfo() {
      tabName({}).then(res => {
        this.headerTab = res.data;
        var recommendObj = { tab_name: "全部", type: 0 };
        this.headerTab.unshift(recommendObj);
        this.getListInfo();
      });
    },
    // 搜索结果
    searchResult(selectTab) {
      this.mainList = [];
      this.page = 1;
      this.pShow = true;
      this.tabShow = true;
      wx.pageScrollTo({
        scrollTop: 0
      });
      var loadingShow = true; //把该变量传到请求列表方法里，表示需要showLoading状态
      if (url.status === "dev") {
        wx.reportAnalytics("search_keyword", {
          keyword: this.searchName,
          tab_name: this.tabName
        });
      }
      getListInfo(this.selectTab, this.searchName, loadingShow).then(res => {
        this.mainList = res.data;
        this.listNull = res.data.length > 0 ? false : true;
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
      });
    },
    toDetail(id, type) {
      toDetail(this.activeIndex, id, type, "search");
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
<style lang="scss" scoped>
@import "../../../style/icon.css";
/*隐藏滚动条*/
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.search {
  // background-color: #f5f5f5;
  height: 100%;
}
.searchFloat {
  height: 215rpx;
}
.searchFloat .search_box {
  background-color: #fff;
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  z-index: 50;
}
.search .inputBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 39rpx;
}
.search .input {
  width: 610rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin: 20rpx;
}
.search .in {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
  /* flex: 1; */
}
.search .searchNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  line-height: 40rpx;
  font-size: 28rpx;
  color: #ccc7b8;
}
.searchResult {
  font-size: 28rpx;
  color: #333333;
}
.list_wrap {
  padding: 0 20rpx;
  background: #f5f5f5;
}
.search .iconfont {
  font-size: 35rpx;
  position: absolute;
  top: 29rpx;
  right: 30rpx;
  color: #cccccc;
  z-index: 10;
}
 .msgList{
  margin-top:10rpx;
  overflow: hidden;
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
  margin-bottom: 10rpx;
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
  // width: 566rpx;
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
  width: 36rpx;
  height: 36rpx;
  top: 100rpx;
  right: 24rpx;
  background: #fff;
  background-size: 100% 100%;
  padding: 0;
}
.msgList .list-item .item_left {
  float: left;
}
.msgList .list-item .item_left img {
  width: 174rpx;
  height: 130rpx;
  border-radius: 4rpx;
}
.msgList .list-item .item_right {
  float: left;
  margin-left: 18rpx;
}
.msgList .list-item .item_right .title p {
  width: 470rpx;
}
.headerTab scroll-view {
  height: 88rpx;
}
.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  text-align: center;
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
.fixTab {
  position: fixed;
  top: 0;
  height: 88rpx;
  z-index: 1;
  background: #fff;
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

.more p {
  font-size: 28rpx;
  line-height: 88rpx;
  text-align: center;
}

.club .item_left img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 20rpx;
}
/* 暂无数据 */

.noContent {
  width: 100%;
  // height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
}
.noContent.seachListNoContent {
  padding-top: 100rpx;
}
.noContent image {
  width: 530rpx;
  height: 408rpx;
}
.noContent div {
  font-size: 28rpx;
  color: #999;
  margin-top: 60rpx;
}
</style>

