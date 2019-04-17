<template>
  <div>
    <!-- 竞赛 -->
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>

    <!-- 订阅按钮 -->
    <div class="subscription_wrap" v-if="subAction">
      <div class="subscription">
        <div class="subscriptionImg">
          <div class="sub_logo">
            <img :src="sub_logo" :key="url+'/img/home/icon_Big broke.png'" alt="">
          </div>
          <div class="sub_txt">
            <p>订阅竞赛活动</p>
            <p>竞赛动态即刻知晓！</p>
          </div>
        </div>
        <div class="sub_btn">
          <form report-submit="true" @submit="subscriptionAction">
            <button form-type="submit" v-if="subAction">订阅</button>
            <button form-type="submit" class="fail" v-else>订阅成功</button>
          </form>
        </div>
      </div>
    </div>

    <!-- 订阅未关注公众号的提示 -->
    <newsGuide v-on:iKnow="iKnow" v-if="guideShow"></newsGuide>
    <!-- 日程提醒  -->
    <scheduleTips v-on:iKnowS="iKnowS" v-if="showScheduleTips"></scheduleTips>

    <!-- 分享场景的头部样式 -->
    <div :style="subAction?'margin-top:208rpx':''">
      <header v-show="isShare">
        <!-- <div class="banner_wrap" :style="{backgroundImage:'url('+bgImg+')'}" style="background-size:100% 100%;"> -->
        <div class="avatarBox">
          <img class="avatar" :src="url+avatar" alt="" v-if="avatar">
          <span class="invite">{{nickname}} <span style="color:#999999">请你看</span></span>
        </div>
        <!-- </div> -->
      </header>
      <main class="mainContent">
        <h1>{{detailInfoObj.title}}</h1>
        <p class="time">{{detailInfoObj.publisher}} {{detailInfoObj.created_at}}</p>
        <div class="copyUrl">
          <p class="queryTime">报名时间：{{detailInfoObj.enrol_start_at}}<span :class="{checked : signUpMes == '活动已结束'}" @click="toSignUp">{{signUpMes}}</span></p>
          <p class="queryUrl">报名链接：{{enrollUrl}}<span @click="copy">复制</span></p>
        </div>
        <div class="txt_wrap">
          <p class="content">
            <!--  :class="{'isflod': isFold==true}" -->
            <wxParse :content="detailInfoObj.introduction" />
          </p>
        </div>

      </main>
    </div>

    <div class="options_wrap">
      <!-- 以下评论回复区域 -->
      <div class="title" style="position:relative;top:10px;left:0px;margin-bottom:10px;">
        <span style="width:50rpx;">评论 {{main.length}}</span>
      </div>
      <div class="discuss">
        <div class="discuss-item" v-for="(item,index) in main" :index="index" :key="index">
          <div class="item_top">
            <img :src="url+item.from_avatar" :key="url+item.from_avatar">
            <div class="username">
              <p>{{item.from_realname}}</p>
            </div>
            <!-- <div class="time">
                <p>{{keepTime[index]}}</p>
              </div> -->
          </div>
          <div class="item_middle">
            <p>{{item.content}}</p>
          </div>
          <div class="item_bottom">
            <!-- 下面的是回复的点击事件 -->
            <div :data-id="item.comment_id" @click="reply(item.comment_id,item.to_user_realname)" class="huiFu">
              <div style="position:absolute;top:6px;left:-568rpx;font-size:22rpx;font-family:PingFang-SC-Medium; font-weight:500;  color:rgba(153,149,138,1);line-height:40rpx;">{{item.created_at_humans}}</div>
              <img src="http://54qj.54qn.cn/Public/images/common/mes.png">
              <text style="font-size:34rpx;">{{item.reply.length}}</text>
            </div>
            <!-- 下面的是回复的区域 -->
            <div class="replyArea">
              <ul v-for="(ite,ind) in item.reply" :index="ind" :key="ind">
                <li v-if="ind<zongT" :data-id="ite.comment_id" @click="bindReply(ite.comment_id,ite.from_user_realname)">
                  <p v-show="ite.is_reply_layer==1">
                    <span>{{ite.from_user_realname}} </span>{{ite.content}}
                  </p>
                  <p v-show="ite.is_reply_layer==0">
                    <span> {{ite.from_user_realname}} </span>
                    回复
                    <span> {{ite.to_user_realname}} </span>
                    {{ite.content}}
                  </p>
                </li>
              </ul>
              <div @click="changeZongT(item.reply.length)" v-show="isShowZ" v-if=" item.reply.length>6" style="text-align:left;color:#576B95;font-size:26rpx;padding-left:20rpx;padding-bottom:20rpx;">共{{item.reply.length}}条回复 展开 ></div>
              <div @click="changeZongTd(item.reply.length)" v-show="isShowZd" v-if=" item.reply.length>6" style="text-align:left;color:#576B95;font-size:26rpx;padding-left:20rpx;padding-bottom:20rpx;">共{{item.reply.length}}条回复 折叠 ></div>
            </div>
          </div>
        </div>
        <div v-if="main.length==0" class="noPL">
          暂无评论
        </div>
      </div>
    </div>

    <footer>
      <!-- 底部狂 -->
      <div class="buttonBox" v-if="showPICK">
        <div @click="toDiscuss" class="input">
          <span>说点什么吧...</span>
        </div>
        <!-- <input type="text" class="input" @click="toDiscuss" placeholder="说点什么吧"> -->
        <form @submit="send" report-submit="true" style="margin-right:-24px;">
          <button open-type="share" @click="shareIdGet" form-type="submit"><i class="iconfont icon-share-big"></i></button>
        </form>
        <form @submit="saveImg" report-submit="true" style="margin-right:-24px;margin-left:15px">
          <button form-type="submit">
            <i class="iconfont icon-Circleoffriends"></i>
          </button>
        </form>
        <form @submit="collection" v-if="isCollection" report-submit="true" style="margin-right:20px;margin-left:15px">
          <button v-if="isCollection" @click="collection" form-type="submit">
            <i class="iconfont icon-Collection"></i>
          </button>
        </form>
        <form @submit="cancelCollection" v-else report-submit="true" style="margin-right:20px;margin-left:15px">
          <button form-type="submit">
            <i class="iconfont icon-Collection-on-" style="color: #FFC71D;"></i>
          </button>
        </form>
      </div>
      <!-- 评论框 -->
      <div class='plK'>
        <div class="appear" :style="style" v-if="showPL" :class="getSystem" @click="changeNY">
          <input :cursor-spacing="0" :show-confirm-bar="false" @blur="outBlur" :focus="fs2" @focus="inFous" @confirm="bindKeyInputComment" placeholder="发表评论" v-model="msgPL" confirm-type="confirm" :adjust-position="false" :maxlength='140' />
          <span v-show="commentBtn" class="send" :data-id="msgPL" :class="getSystem" @click="bindKeyInputComment">发送</span>
        </div>
      </div>
      <!-- 回复框 -->
      <div class="hfK">
        <div class="appear" :style="style" v-if="showHF" :class="getSystem">
          <input :cursor-spacing="0" :show-confirm-bar="false" @blur="outBlur" @focus="inFous" :focus="fs" @confirm="bindKeyInputReply" :placeholder="hfXXX" confirm-type="confirm" v-model="msgRL" :adjust-position="false" />
          <span v-show="replyBtn" class="send" :data-id="msgRL" :class="getSystem" @click="bindKeyInputReply">发送</span>
        </div>
      </div>
    </footer>
    <div class="returnTop" v-show="scrollTop>=700&&showToTop==true" @click="toTop">
      <span>返回顶部</span>
    </div>
  </div>
</template>
<script>
import { toShouquan } from "@/utils/common";
import common from "@/utils/common";
import { formId } from "@/utils/common";
import wxParse from "mpvue-wxparse";
import url from "@/utils/common";
import {
  stars,
  subscriptionsList,
  shareOperation,
  newsPoster,
  shareDetail,
  userInfo,
  subscriptions,
  detailInfo,
  report,
  commentsList,
  actSignUp,
  shareAct,
  comments,
  reply,
  actCollection,
  cancelCollection
} from "@/utils/api";
import loading from "@/components/loading";
import newsGuide from "./../../../pages/index/news/newsGuide";
import scheduleTips from "./../../../components/tips/scheduleTips";
export default {
  data() {
    return {
      showToTop:true,
      enrollUrl: "",
      enrollUrlCopy: "",
      showScheduleTips: false,
      isCollection: "",
      signUpMes: "添加日程提醒",
      queryUrl: "",
      queryUrl2: "",
      detailInfoObj: "",
      is_full: 0,
      scrollTop: "",
      moreShow: false, //查看更多的按钮是否显示
      loadingShow: true,
      url: url.url,
      bgShow: false,
      isShare: false,
      bgImg: url.url + "/img/news/newBanner1.jpg",
      sub_logo: url.url + "/img/home/icon_Big broke.png",
      nickname: "", //分享人的名字
      avatar: "", //分享人的头像
      act_id: "",
      txt: "",
      title: "",
      time: "",
      star: "", //喜欢的人数
      cover: "", //分享的海报
      likeStatus: false,
      unionid: "",
      like: url.url + "/img/default/index/like-jihuo.jpg",
      unlike: url.url + "/img/default/index/like.jpg",
      new_idArr: "",
      share_id: "",
      sharePoster: "",
      main: "",
      fs: false,
      fs2: false,
      showPL: false,
      showHF: false,
      showPICK: true,
      commentBtn: false,
      replyBtn: false,
      comment_id: "",
      hfXXX: "",
      isShowZ: true,
      isShowZd: false,
      style: "position:fixed;bottom:0;left:0;",
      bottom: "",
      zongT: 6,
      msgPL: "",
      msgRL: "",
      content: "",
      token: "",
      subAction: true, //true是未点击订阅，false是点击了订阅
      guideShow: false, //关注公众号的提示
      type: "", //入口方式(friends为分享，poster为海报，list为列表页，send为消息模板推送)
      plImg: common.url + "/img/default/pinglun.png",
      judgeTime: "", //判断时间
      is_apply: "",
      act_type: "",
      collect_id: "",
      new_id: "",
      enrollUrl: "",
      enrollUrlCopy: ""
    };
  },
  onLoad(options) {
    this.scrollTop = 0;
    this.act_id = options.act_id;
    this.getSubscriptionsStatus();
    this.loadingShow = true;
    this.bgShow = false;
    this.txt = "";
    this.isShare = options.share ? true : false;
    this.moreShow = options.share ? true : false;
    this.type = options.type;
    //好友分享进入
    if (options.share_id) {
      this.share_id = options.share_id;
      this.isShare = true;
      this.moreShow = true;
      this.type = "friends"
      this.getShareInfo(); //分享详情
    } else if (options.act_id) {
      //消息模板推送进入或者列表点击进入
      this.isShare = false;
      this.act_id = options.act_id;
      this.getInfo();
    } else {
      //轮播图进入
      this.isShare = false;
      this.getInfo();
    }
  },
  components: {
    loading,
    wxParse,
    newsGuide,
    scheduleTips
  },
  onShow(options) {
    this.showScheduleTips = false;
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.guideShow = false;
    userInfo({}, this.token, true).then(res => {
      this.is_full = res.is_full;
    });
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    if (this.unionid) {
      this.shareOperation();
      this.getSubscriptionsStatus();
    }
  },
  methods: {
    copy() {
      wx.setClipboardData({
        data: this.enrollUrlCopy,
        success: res => {
          wx.getClipboardData({
            success: res => {
              wx.showToast({
                title: "复制成功"
              });
            }
          });
        }
      });
    },
    shareIdGet(e) {
      if (e) {
        formId(e);
      }
    },
    cancelCollection(e) {
      if (e) {
        formId(e);
      }
      if (common.status == "dev") {
        wx.reportAnalytics("show_page_btn_click", {
          title: this.title,
          channel: this.type,
          show_page_type: "竞赛",
          btn_name: "取消收藏"
        });
      }
      cancelCollection(this.collect_id, "", true).then(res => {
        this.isCollection = true;
        wx.showToast({
          title: "已取消收藏"
        });
      });
    },
    collection(e) {
      if (e) {
        formId(e);
      }
      if (common.status == "dev") {
        wx.reportAnalytics("show_page_btn_click", {
          title: this.title,
          channel: this.type,
          show_page_type: "竞赛",
          btn_name: "收藏"
        });
      }
      actCollection({ type: 3, foreign_id: this.act_id }, true).then(res => {
        this.isCollection = false;
        wx.showToast({
          title: "收藏成功"
        });
        this.collect_id = res.collect_id;
      });
    },
    toSignUp(e) {
      if (e) {
        formId(e);
      }
      if (common.status == "dev") {
        wx.reportAnalytics("show_page_btn_click", {
          title: this.title,
          channel: this.type,
          show_page_type: "竞赛",
          btn_name: "添加日程提醒"
        });
      }
      if (wx.getStorageSync("silentlogin").token) {
        if (this.judgeTime > 7200000) {
          if (this.is_apply == 1) {
            this.signUpMes = "已添加提醒";
          } else {
            actSignUp(this.act_id, {}, this.token, "", false)
              .then(res => {
                // formId(e);
                this.signUpMes = "已添加提醒";
                this.showScheduleTips = true;
                this.is_apply = 1;
              })
              .catch(err => {
                wx.showToast({
                  title: err.message
                });
              });
          }
        }
      } else {
        wx.showToast({
          title: "请完善信息"
        }),
          setTimeout(() => {
            wx.navigateTo({
              url: "/pages/login/register/index"
            });
          }, 1000);
      }
    },
    toTop() {
      wx.pageScrollTo({
        scrollTop: 0
      });
    },
    iKnow() {
      this.guideShow = false;
    },
    iKnowS() {
      this.showScheduleTips = false;
    },
    subscriptionAction(e) {
      if (e) {
        formId(e);
      }
      if (common.status == "dev") {
        wx.reportAnalytics("show_page_btn_click", {
          title: this.title,
          channel: this.type,
          show_page_type: "竞赛",
          btn_name: "订阅"
        });
      }
      if (this.subAction) {
        this.subAction = false;
        subscriptions({ unionid: this.unionid, type: 7 }).then(res => {
          this.guideShow = true;
        });
      }
    },
    getSubscriptionsStatus() {
      if (wx.getStorageSync("silentlogin").unionid) {
        subscriptionsList({
          unionid: wx.getStorageSync("silentlogin").unionid
        }).then(data => {
          for (var i of data.data) {
            if (i.type === 7) {
              this.subAction = i.is_subscribe === 1 ? false : true;
            }
          }
        });
      }
    },
    outBlur() {
      this.msgPL = "";
      this.msgRL = "";
      this.showPICK = true;
      this.showPL = false;
      this.commentBtn = false;
      this.showHF = false;
      this.replyBtn = false;
      this.showToTop=true;
      this.style = "position:fixed;bottom:0rpx;left:0rpx;";
    },
    inFous(e) {
      this.msgPL = "";
      this.msgRL = "";
      this.bottom = e.mp.detail.height;
      this.showToTop=true;
      this.style = `position:fixed;bottom:${this.bottom}px;left:0;`;
    },
    getCommonList() {
      commentsList(
        { pagesize: 1000, page: 1, type: 1, foreign_id: this.act_id },
        "",
        true
      )
        .then(res => {
          this.main = res.data;
          this.loadingShow = false;
        })
        .catch(err => {
          this.loadingShow = false;
        });
    },
    // 回复
    bindKeyInputReply(e) {
      if (e.target.value) {
        this.content = e.target.value;
      }
      if (e.target.dataset.id) {
        this.content = e.target.dataset.id;
      }
      this.page2 += 1;
      var act_id = wx.getStorageSync("act_id");
      reply(this.comment_id, { content: this.content }, this.token, false).then(
        res => {
          for (let i = 0; i < this.main.length; i++) {
            if (this.main[i].comment_id == res.comment_id) {
              this.main[i].reply.push(res);
            }
          }
          wx.showToast({
            title: "回复成功"
          });

          setTimeout(() => {
            this.getCommonList();
          }, 100);
          this.fs = false;
          this.fs2 = false;
        }
      );
      this.fs = false;
      this.fs2 = false;
    },
    // 评论
    bindKeyInputComment(e) {
      this.page += 1;
      if (e.target.value) {
        this.content = e.target.value;
      } else if (e.target.dataset.id) {
        this.content = e.target.dataset.id;
      } else {
        this.content = "";
      }
      comments(
        { content: this.content, type: 1, foreign_id: this.act_id },
        this.token,
        false
      ).then(res => {
          wx.showToast({
            title: "评论成功"
          });
        this.getCommonList();
        this.fs = false;
        this.fs2 = false;
      });
      this.fs = false;
      this.fs2 = false;
    },
    changeZongT(a) {
      this.zongT = a;
      this.isShowZ = false;
      this.isShowZd = true;
    },
    changeZongTd(a) {
      this.zongT = 6;
      this.isShowZd = false;
      this.isShowZ = true;
    },
    bindReply(comment_id, user) {
      if (this.is_full == 1) {
        this.hfXXX = `回复：${user}`;
        this.comment_id = comment_id;
        this.showPICK = false;
        this.showHF = true;
        this.replyBtn = true;
        this.showPL = false;
        this.commentBtn = false;
        this.fs = true;
      } else if (this.is_full == 0) {
        wx.showToast({
          title: "请完善信息"
        });
        setTimeout(() => {
          wx.navigateTo({
            url: "/pages/login/register/index"
          });
        }, 1000);
      }
    },
    reply(comment_id, user) {
      this.msgRL = "";
      this.hfXXX = "发表回复";
      this.comment_id = comment_id;
      this.showPICK = false;
      this.showHF = true;
      this.replyBtn = true;
      this.showPL = false;
      this.commentBtn = false;
      this.fs = true;
    },
    toDiscuss() {
      if (this.is_full == 1) {
        this.showPICK = false;
        this.showPL = true;
        this.fs2 = true;
        this.commentBtn = true;
      } else if (this.is_full == 0) {
        wx.showToast({
          title: "请完善信息"
        });
        setTimeout(() => {
          wx.navigateTo({
            url: "/pages/login/register/index"
          });
        }, 1000);
      }
    },
    getInfo() {
      this.unionid = wx.getStorageSync("silentlogin").unionid;
      detailInfo(this.act_id, {}, this.token, true)
        .then(res => {
          this.detailInfoObj = res;
          this.judgeTime =
            Date.parse(res.enrol_start_at) - Date.parse(new Date());
          this.is_apply = res.is_apply;
          this.act_type = res.act_type;
          this.collect_id = res.collect_id;
          this.txt = res.content;
          this.cover = res.cover;
          this.title = res.title;
          this.time = res.created_at;
          this.enrollUrl = `${res.contest_enrol_address.substring(0, 17)}...`;
          this.enrollUrlCopy = res.contest_enrol_address;
          if (this.collect_id == 0) {
            this.isCollection = true;
          } else {
            this.isCollection = false;
          }
          if (this.is_apply == 1) {//等于1的时候还有 this，judgeTIME吗?
            this.signUpMes = "已添加提醒";
            console.log(11111)
          } else {

            console.log(111112222222222)
            if (this.judgeTime > 7200000) {
              this.signUpMes = "添加日程提醒";
            } else if (this.judgeTime < 7200000 && this.judgeTime > 0) {
              this.signUpMes = "活动即将开始";
            } else if (this.judgeTime < 0) {
              this.signUpMes = "活动已结束";
            }
          }
          if (common.status == "dev") {
            wx.reportAnalytics("show_page", {
              title: this.title,
              channel: this.type,
              show_page_type: "竞赛"
            });
          }
          this.compareLike();
          this.getCommonList();
        })
        .catch(err => {
          this.loadingShow = false;
        });
    },
    // 获取分享详情
    getShareInfo() {
      shareDetail(this.share_id, "", true)
        .then(res => {
          this.avatar = res.share_user.avatar;
          this.nickname = res.share_user.nickname;
          this.unionid = res.share_user.unionid;
          this.act_id = res.foreign_id;
          this.compareLike();
          this.getCommonList();
        })
        .catch(err => {
          this.loadingShow = false;
        });
    },
    //获取分享的id
    shareOperation() {
      if (this.act_id) {
        shareOperation({
          unionid: this.unionid,
          share_type: 5,
          foreign_id: this.act_id
        }).then(res => {
          this.share_id = res.share_id;
        });
      }
    },
    //分享给好友
    send(e) {
      formId(e);
    },
    toIndex() {
      wx.navigateBack({
        success: function() {
          delta: -1;
        }
      });
    },
    //匹配当前日报是否用户喜欢的日报
    compareLike() {
      for (let i of this.new_idArr) {
        if (this.new_id == i) {
          this.likeStatus = true;
        } else {
          this.likeStatus = false;
        }
      }
    },
    changeLikeAction(e) {
      formId(e);
      this.likeStatus = !this.likeStatus;
      if (this.likeStatus) {
        this.star += 1;
      } else {
        this.star -= 1;
      }
      stars(this.new_id, { unionid: this.unionid });
    },
    saveImg(e) {
      var that = this;
      if (common.status == "dev") {
        wx.reportAnalytics("show_page_btn_click", {
          title: this.title,
          channel: this.type,
          show_page_type: "竞赛",
          btn_name: "分享到朋友圈"
        });
      }
      if (e) {
        formId(e);
      }
      newsPoster(this.share_id, "").then(res => {
        this.sharePoster = res.path;
        var imgArr = [];
        imgArr.push(this.url + this.sharePoster);
        wx.previewImage({
          urls: imgArr
        });
      });
    }
  },
  onShareAppMessage: function(res) {
    if (common.status == "dev") {
      wx.reportAnalytics("show_page_btn_click", {
        title: this.title,
        channel: this.type,
        show_page_type: "竞赛",
        btn_name: "分享给好友"
      });
    }
    return {
      title: this.title,
      // path:
      //   "/pages/index/news/index?share=share&share_id=" + this.share_id,
      path: this.share_id
        ? "/pages/index/index?share_id= " + this.share_id + "&type=7"
        : "/pages/index/index?act_id=" + this.act_id + "&type=7",
      // imageUrl: this.url + this.cover
    };
  },
  onPageScroll(obj) {
    this.scrollTop = obj.scrollTop;
    this.fs = false;
    this.fs2 = false;
    this.style = "position:fixed;bottom:0;left:0;";
  }
};
</script>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
@import "../../../style/icon.css";
.copyUrl {
  background: rgba(245, 245, 245, 1);
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 38rpx;
  padding: 40rpx;
  border-top: 1px solid black;
}
.copyUrl p:nth-child(1) {
  margin-bottom: 20rpx;
}
.copyUrl p span {
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(87, 107, 149, 1);
  line-height: 38rpx;
  float: right;
}
.copyUrl .checked{
  color: #999999!important;
}
/* 富文本图片宽高处理 */
.UEimages {
  max-width: 100%;
}
* {
  padding: 0;
}
.toMoreShow {
  position: fixed;
  bottom: 148rpx;
  /* width: 100%; */
  left: 50%;
  width: 260rpx;
  margin-left: -130rpx;
  z-index: 30;
}
.toMoreShow span {
  display: block;
  width: 260rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
  background: #ffb90c;
  border-radius: 44rpx;
  margin: 0 auto;
}
.subscription_wrap {
  width: 750rpx;
  height: 148rpx;
  position: fixed;
  top: 0rpx;
  box-sizing: border-box;
  padding: 42rpx 40rpx;
  border-bottom: 1px solid #e6e6e6;
  background: rgba(245, 245, 245, 1);
  z-index: 20;
}
.subscription {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.subscriptionImg {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.subscription .sub_logo img {
  width: 62rpx;
  height: 62rpx;
}
.subscription .sub_txt {
  margin-left: 20rpx;
}
.subscription .sub_txt p:first-child {
  font-size: 28rpx;
  color: #333333;
  margin-top: -6rpx;
}
.subscription .sub_txt p:nth-child(2) {
  font-size: 24rpx;
  color: #666666;
}
.subscription .sub_btn button::after {
  border: 0;
  padding-left: 0rpx;
  padding-right: 0rpx;
}
.subscription .sub_btn button {
  width: 148rpx;
  height: 58rpx;
  padding-left: 0rpx;
  padding-right: 0rpx;
  line-height: 58rpx;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  margin-top: 2rpx;
  background: linear-gradient(
    90deg,
    rgba(252, 63, 91, 1) 0%,
    rgba(252, 92, 61, 1) 100%
  );
  border-radius: 8px;
}
.subscription .sub_btn .fail {
  background: #f5f5f5;
  color: #333333;
}
header .avatarBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 40rpx;
}
header .avatarBox .avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
}
header .avatarBox .invite {
  font-size: 28rpx;
  color: #ffb90c;
  margin-left: 29rpx;
  margin-right: 8rpx;
}

.mainContent {
  padding: 0rpx 40rpx 40rpx 40rpx;
}
.mainContent h1 {
  font-size: 36rpx;
  color: #333333;
  font-weight: bold;
  line-height: 54rpx;
  text-align: left;
}
.mainContent .time {
  color: #999999;
  font-size: 24rpx;
  margin-top: 22rpx;
  margin-bottom: 40rpx;
}
.mainContent .txt_wrap {
  padding-bottom: 40rpx;
}
.mainContent .like_wrap {
  width: 100%;
  height: 164rpx;
  box-sizing: border-box;
  padding: 40rpx 0;
  text-align: center;
}
.mainContent .like_wrap .icon {
  position: relative;
}
.mainContent .like_wrap .icon button {
  position: absolute;
  width: 44rpx;
  height: 72rpx;
  top: -24rpx;
  left: 315rpx;
  box-sizing: border-box;
  padding: 0;
  background: #fff;
}
.mainContent .like_wrap .icon button:after {
  border: none;
  padding: 0;
}
.mainContent .like_wrap .icon img {
  width: 44rpx;
  height: 38rpx;
  z-index: 5;
}
.mainContent .like_wrap p {
  font-size: 28rpx;
  color: #333333;
  margin-top: 52rpx;
}
.mainContent .label {
  margin-bottom: 100rpx;
}
.mainContent .label span {
  border: 1rpx solid rgba(204, 204, 204, 1);
  border-radius: 28rpx;
  font-size: 20rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(204, 204, 204, 1);
  line-height: 38rpx;
  text-align: center;
  padding: 8rpx 20rpx;
  margin-right: 10rpx;
}
.options_wrap {
  border-top: 20rpx solid #f5f5f5;
  padding: 0 40rpx;
  padding-bottom: 148rpx;
}

.title {
  font-size: 34rpx;
  font-weight: bold;
}
.title span:nth-child(1) {
  border-bottom: 8rpx solid rgba(255, 185, 12, 1);
}
.title .underline {
  display: block;
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  width: 134rpx;
  height: 8rpx;
  background: #ffb90c;
}
.appear {
  width: 750rpx;
  height: 108rpx;
  background: #fff;
  border-top: 1px solid #eaeaea;
  z-index: 10;
}
.appear input {
  float: left;
  width: 570rpx;
  height: 72rpx;
  background: rgba(245, 245, 245, 1);
  border-radius: 8rpx;
  margin: 20rpx 0 0 20rpx;
  font-size: 26rpx;
  padding-left: 10rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #000;
  line-height: 72rpx;
}
.appear .send {
  float: right;
  width: 120rpx;
  height: 72rpx;
  background: rgba(255, 185, 12, 1);
  border-radius: 8rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(65, 41, 27, 1);
  line-height: 72rpx;
  text-align: center;
  margin: 20rpx 20rpx 0 0rpx;
}
.discuss {
  overflow: hidden;
  position: relative;
  padding-bottom: 10rpx;
  margin-top: 20rpx;
}
.discuss .noPL {
  margin-top: 30rpx;
  text-align: center;
  color: #99958a;
  font-size: 15px;
}
.discuss .discuss-item {
  margin-top: 60rpx;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}
.discuss .discuss-item .item_top {
  overflow: hidden;
  position: relative;
}
.discuss .discuss-item .item_top img {
  width: 80rpx;
  height: 80rpx;
  float: left;
}
.discuss .discuss-item .item_top .username {
  float: left;
  margin-left: 24rpx;
  overflow: hidden;
}
.discuss .discuss-item .item_top .username p {
  font-size: 30rpx;
  color: #332503;
  font-weight: bold;
  line-height: 37rpx;
  position: absolute;
  top: 22rpx;
  left: 110rpx;
}

.discuss .discuss-item .item_top .time {
  font-size: 22rpx;
  color: #99958a;
  position: absolute;
  top: 22rpx;
  right: 0;
}
.discuss .discuss-item .item_middle {
  font-size: 26rpx;
  color: #332503;
  margin-top: 30rpx;
  line-height: 40rpx;
}
.discuss .discuss-item .item_bottom {
  margin-top: 29rpx;
  text-align: right;
  position: relative;
  margin-bottom: 65rpx;
}
.discuss .discuss-item .item_bottom .huiFu {
  width: 100rpx;
  height: 20rpx;
  position: absolute;
  bottom: -10rpx;
  right: 3rpx;
  margin-bottom: 20rpx;
}
.discuss .discuss-item .item_bottom img {
  width: 32rpx;
  height: 34rpx;
  position: absolute;
  top: 10rpx;
}
.discuss .discuss-item .item_bottom text {
  padding-left: 40rpx;
  color: #99958a;
}
.discuss .discuss-item .item_bottom .replyArea {
  font-size: 22rpx;
  color: #99958a;
  float: left;
  width: 670rpx;
  height: 100%;
  background: rgba(245, 245, 245, 1);
  border-radius: 8rpx;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul {
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  line-height: 40rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li {
  overflow: hidden;
  width: 670rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li p {
  font-size: 26rpx;
  float: left;
  text-align: left;
  padding: 10rpx 20rpx 10rpx 20rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li p span {
  color: #576b95;
}
.returnTop {
  width: 60rpx;
  height: 184rpx;
  background: #db4416;
  text-align: center;
  color: #fff;
  font-weight: bold;
  font-size: 28rpx;
  border-radius: 8rpx 0 0 8rpx;
  padding: 16rpx;
  box-sizing: border-box;
  position: fixed;
  top: 500rpx;
  right: 0;
}

footer {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  height: 108rpx;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
}

footer .btn_wrap {
  position: fixed;
  bottom: 30rpx;
  left: 40rpx;
}
footer .buttonBox {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
}
footer .buttonBox .input {
  width: 392rpx;
  height: 68rpx;
  box-sizing: border-box;
  background: #f5f5f5;
  border-radius: 8rpx;
  padding-left: 20rpx;
  font-size: 26rpx;
  position: relative;
}
footer .buttonBox .input span {
  position: absolute;
  left: 20rpx;
  top: 20rpx;
  font-size: 26rpx;
  color: #ccc;
}
footer .buttonBox i {
  font-size: 46rpx;
  color: #333;
}
footer .buttonBox button {
  background: #fff;
  font-size: 46rpx;
  line-height: 68rpx;
  padding: 0;
  margin: 0;
  color: #333;
}
footer .buttonBox button::after {
  border: none;
  padding: 0;
  margin: 0;
  line-height: 0rpx;
}
</style>


