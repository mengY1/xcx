<template>
  <!-- 已对好的借口 -->
  <div class="detail">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <!-- 取消报名的Tips -->
    <div class="cancelTips" v-if="isShowTips">
      <div class="bg"></div>
      <div class="cancel_wrap">
        <div class="cancelBox">
          <img :src="url+'/img/home/pop_guanbi@2x.png'" class="close" @click="close">
          <img :src="url+'/img/competitions/pop_baoming@2x.png'" class="bgImg">
          <div class="tips">
            <p>你真的要取消报名么？</p>
          </div>
          <div class="btnS">
            <span @click="cancelAction">取消</span>
            <span @click="close">再想想</span>
          </div>
        </div>
      </div>
    </div>
    <div class="shenhe" v-if="status==10">
      <p>奇集小编正在努力审核</p>
    </div>
    <div class="shenhe" v-if="status==30">
      <p>审核失败：{{audit_remark}}</p>
    </div>
    <div class="shenhe" v-if="line_status===0">
      <p>下架原因：{{line_status_remark}}</p>
    </div>
    <div class="banner" v-if="reviewMain==undefined">
      <img v-if="cover" :src="url+cover+otherUrl" @click="toPreview(cover)">
      <!-- <img @click="share" :src="url+'/img/default/share.png'" v-if="status==20||status==50"> -->
      <picker @change="bindPickerChange" :value="index" :range="array">
        <view class="picker">
          <img
            class="report"
            @click="report"
            :src="url+'/img/default/report.png'"
            v-if="status==20||status==50"
          >
        </view>
      </picker>
    </div>

    <swiper
      v-else
      class="swiper"
      circular="true"
      indicator-dots="true"
      indicator-active-color="#fff"
      indicator-color="rgba(255,255,255,0.4)"
    >
      <swiper-item v-for="(item,index) in reviewMain.img" :index="index" :key="index">
        <img :src="url+item" alt>
      </swiper-item>
    </swiper>

    <sharePicker :pickerShow="pickerShow" v-on:bgHide="bgHide"></sharePicker>
    <div style="border-bottom:20rpx solid #f5f5f5" v-if="reviewMain==undefined">
      <div class="detailTitle">
        <div v-if="date=='begin'">
          <div class="rank" v-if="status!=10&&status!=40&&status!=30">排名第{{ranking}}位</div>
          <div class="hot" v-if="status!=10&&status!=40&&status!=30">人气{{popularity}}</div>
        </div>
        <p>{{title}}</p>
        <div class="join" v-if="status===20||status===50">
          <!-- <p v-if="is_chief===0">{{cms_school_name}}有<span>{{total}}个人</span>报名了该活动</p>
          <p v-else @click="toList"><span>{{total}}人</span>已报名</p>-->
          <p v-if="sign_school_name">
            {{sign_school_name}}有
            <span>{{sign_members}}个人</span>报名了该活动
          </p>
          <p v-else>
            <span>{{sign_members}}人</span>已报名
          </p>
        </div>
        <div class="detailMes">
          <!-- <p>联系电话: {{phone}}</p> -->
          <p>活动时间：{{activity_start_at}} - {{activity_expire_at}}</p>
          <p>报名时间：{{enrol_start_at}} - {{enrol_expire_at}}</p>
          <p>活动方式：{{line_type2}}</p>
          <p v-if="line_type">活动地点：{{address}}</p>
        </div>
        <div class="detailTitleBottom" @click="toClub" :data-id="org_id">
          <img v-if="logo" :src="url+logo+logoUrl" class="logo">
          <div class="detailName">
            <p>{{org_name}}</p>
            <p>{{cms_school_name}}</p>
          </div>
          <img src="http://54qj.54qn.cn/Public/images/club/detailsIcon.png" class="more1">
        </div>
      </div>
    </div>

    <main style="padding-bottom:170rpx">
      <div class="synopsis" @click="toChange" v-if="reviewMain==undefined">
        <div class="title">
          <text>活动详情</text>
        </div>
        <div class="contain">
          <p class="content">{{introduction}}</p>
          <!--:class="{'isflod': isFold==true}"  -->
          <!-- <p class="fold" v-if="introduction.length>100" @click="showAll">
            {{isFold? '收起活动详情 ':'展开活动详情 '}}
            <i v-if="isFold===true" class="iconfont icon-up-"></i>
            <i v-if="isFold===false" class="iconfont icon-down-"></i>
          </p>-->
        </div>
      </div>
      <div class="review" v-else>
        <p>{{reviewMain.content}}</p>
      </div>

      <div
        class="title"
        style="position:relative;top:10px;left:5px;margin-bottom:10px;padding:0 20rpx 0 32rpx;"
      >
        <span style="width:50rpx;">评论 {{commenNum}}</span>
        <i
          v-if="is_chief==1||reviewMain!=undefined"
          @click="toDiscuss"
          class="iconfont icon-Activity_details_com"
          style="padding-left:25rpx;font-size:36rpx;"
        ></i>
      </div>
      <div class="discuss" v-if="status == 20||status==50">
        <div class="discuss-item" v-for="(item,index) in main" :index="index" :key="index">
          <div class="item_top">
            <img :src="url+item.from_avatar">
            <div class="username">
              <p>{{item.from_realname}}</p>
            </div>
            <div class="time">
              <p>{{keepTime[index]}}</p>
            </div>
          </div>
          <div></div>
          <div></div>
          <div class="item_middle">
            <p>{{item.content}}</p>
          </div>
          <div class="item_bottom">
            <!-- 下面的是回复的点击事件 -->
            <div
              :data-id="item.comment_id"
              @click="reply(item.comment_id,item.to_user_realname)"
              class="huiFu"
            >
              <img src="http://54qj.54qn.cn/Public/images/common/mes.png">
              <text>回复</text>
            </div>
            <!-- 下面的是回复的区域 -->
            <div class="replyArea">
              <ul v-for="(ite,ind) in item.reply" :index="ind" :key="ind">
                <li
                  v-if="ind<zongT"
                  :data-id="ite.comment_id"
                  @click="bindReply(ite.comment_id,ite.from_user_realname)"
                >
                  <p v-show="ite.is_reply_layer==1">
                    <span>{{ite.from_user_realname}}</span>
                    {{ite.content}}
                  </p>
                  <p v-show="ite.is_reply_layer==0">
                    <span>{{ite.from_user_realname}}</span>
                    回复
                    <span>{{ite.to_user_realname}}</span>
                    {{ite.content}}
                  </p>
                </li>
              </ul>
              <div
                @click="changeZongT(item.reply.length)"
                v-show="isShowZ"
                v-if=" item.reply.length>6"
                style="text-align:left;color:#576B95;font-size:26rpx;padding-left:20rpx;"
              >共{{item.reply.length}}条回复 展开 ></div>
              <div
                @click="changeZongTd(item.reply.length)"
                v-show="isShowZd"
                v-if=" item.reply.length>6"
                style="text-align:left;color:#576B95;font-size:26rpx;padding-left:20rpx;"
              >共{{item.reply.length}}条回复 折叠 ></div>
            </div>
          </div>
        </div>
        <div v-if="main.length==0" class="noPL">暂无评论</div>
      </div>
    </main>

    <footer>
      <div class="pickK" v-if="showPICK ">
        <div
          class="invite"
          v-if="status==20&&is_chief==0||status==50&&is_chief==0&&reviewMain==undefined"
        >
          <div class="pick">
            <form @submit="signUp" report-submit="true">
              <button class="signUp" :class="{signUpBg:isActive}" form-type="submit">{{signUpMes}}</button>
            </form>
            <!-- <button v-if="date=='end'" class="signUp" @click="toShare">分享活动</button> -->
            <div class="iconBox">
              <i @click="toDiscuss" class="iconfont icon-Activity_details_com"></i>
              <button
                open-type="share"
                :plain="true"
                style="width:114rpx;border:none;display:inline;"
              >
                <i class="iconfont icon-Activity_details_sha"></i>
              </button>
              <i class="iconfont icon-Activity_details_rin" @click="paint"></i>
            </div>
          </div>
        </div>

        <div class="pick shareActive" v-if="is_chief==1&&status==20">
          <text @click="toShare" class="signUp" v-if="line_status===1">分享活动</text>
          <text @click="toList">查看报名名单</text>
          <div v-if="date=='begin'">
            <text v-if="voted" style="background:#ccc7b8;color:#332503">投票成功</text>
            <text v-else @click="toPick" style="background:#ff555d;color:#fff">帮TA投票</text>
          </div>
        </div>

        <!-- <div
          class="invite"
          v-if="status==50&&is_chief==0&&reviewMain==undefined"
        >
          <div class="btn btn1 signUpBg">
                    <text>已结束</text>
                </div>
                <div class="btn btn1 signUpBg">
                    <text>Pick TA</text>
                </div>
            <div class="pick">
            <text style="background:#ccc7b8">活动已结束</text>
            <text
              v-if="date=='end'"
              @click="toShare"
              class="signUp"
            >分享活动</text>
            <div v-if="date=='begin'">
              <text
                v-if="voted"
                style="background:#ccc7b8;color:#332503"
              >投票成功</text>
              <text
                v-else
                style="background:#ff555d;color:#fff"
                @click="toPick"
              >帮TA投票</text>
            </div>
          </div>
          <div class="pick">
            <form
              @submit="signUp"
              report-submit='true'
            >
              <button
                class="signUp"
                :class="{signUpBg:isActive}"
                form-type="submit"
              >活动已结束</button>
            </form>
            <i
              @click="toDiscuss"
              class="iconfont icon-Activity_details_com"
              style="padding-left:25rpx;"
            ></i>
            <button
              open-type="share"
              :plain='true'
              style="width:114rpx;border:none;display:inline;"
            > <i class="iconfont icon-Activity_details_sha"></i></button>
            <i
              class="iconfont icon-Activity_details_rin"
              @click="paint"
            ></i>
          </div>
        </div>-->
        <div class="invite cancel" v-if="status==10">
          <div class="btn" @click="cancel" :class="{signUpBg:isActive}">
            <text>取消发布</text>
          </div>
        </div>

        <div class="invite cancel" v-if="status==30||status==40">
          <div class="btn" @click="review" :class="{signUpBg:isActive}">
            <text>重新发布</text>
          </div>
        </div>

        <div class="invite cancel" v-if="status==50&&is_chief==1&&reviewMain==undefined">
          <div class="btn" @click="option" :class="{signUpBg:isActive}">
            <text>发布回顾</text>
          </div>
        </div>

        <div class="end" v-if="reviewMain!=undefined" @click="toDiscuss">
          <input type="text" placeholder="发表评论">
        </div>
      </div>
      <div class="plK">
        <div class="appear" :style="style" v-if="showPL" :class="getSystem">
          <input
            :cursor-spacing="0"
            :show-confirm-bar="false"
            @blur="appearChange"
            :focus="fs2"
            @focus="inFous"
            @confirm="bindKeyInputComment"
            placeholder="发表评论"
            v-model="msgPL"
            confirm-type="confirm"
            :adjust-position="false"
          >
          <span
            v-show="commentBtn"
            class="send"
            :data-id="msgPL"
            :class="getSystem"
            @click="bindKeyInputComment"
          >发送</span>
        </div>
        <div v-if="isShowZz" class="shadePage"></div>
      </div>
      <div class="hfK">
        <div class="appear" :style="style" v-if="showHF" :class="getSystem">
          <input
            :cursor-spacing="0"
            :show-confirm-bar="false"
            @blur="outBlur"
            @focus="inFous"
            :focus="fs"
            @confirm="bindKeyInputReply"
            :placeholder="hfXXX"
            confirm-type="confirm"
            v-model="msgRL"
            :adjust-position="false"
          >
          <span
            v-show="replyBtn"
            class="send"
            :data-id="msgRL"
            :class="getSystem"
            @click="bindKeyInputReply"
          >发送</span>
        </div>
        <div v-if="isShowZz" class="shadePage"></div>
      </div>
    </footer>
    <div class="returnTop" v-show="scrollTop>=700" @click="toTop">
      <span>返回顶部</span>
    </div>
  </div>
</template>
<script>
import {
  detailInfo,
  report,
  commentsList,
  actSignUp,
  cancelAct,
  actPv,
  pick,
  shareAct,
  actPoster,
  membersGet,
  picks,
  comments,
  reply,
  commentDetail,
  userInfo,
  statistical,
  cancelSignUp
} from "@/utils/api";
import common from "@/utils/common";
import date from "@/utils/common";
import { formId } from "@/utils/common";
import sharePicker from "./sharePicker/sharePicker";
import changeTime from "@/utils/changeTime";
import keepTime from "@/utils/keepTime";
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import loading from "@/components/loading";
export default {
  data() {
    return {
      act_type: "",
      isShowTips: false,//提示框状态
      isFold: false,//详情展开
      isShowZz: false,//遮罩层
      bottom: "",
      zongT: 6,
      msgPL: "",
      msgRL: "",
      loadingShow: true,//load状态
      date: date.date,
      array: ["垃圾广告", "有害内容", "违法内容", "淫秽色情内容", "其他"],
      isShow: false,
      commenNum: "",
      test: "",
      spm: "",
      shadeShow: true,
      signUpMes: "我要报名",
      isActive: false,
      pickerShow: false,
      org_id: 0,
      main: "",
      ranking: "",
      cover: [],
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      title: "",
      org_name: "",
      cms_school_name: "",
      sign_school_name: "", //参与报名活动的学校名
      sign_members: "", //参与报名活动的人数
      activity_start_at: "",
      activity_expire_at: "",
      enrol_expire_at: "",
      enrol_start_at: "",
      logo: "",
      introduction: "",
      phone: "",
      address: "",
      popularity: 0,
      is_chief: "",
      scrollTop: "",
      user_school_id: "",
      //  下面是评论区
      act_id: "",
      keepTime: [],
      token: " ",
      is_chief: "",
      pickerShow: false,
      reviewMain: "", //回顾内容
      posterImg: [],
      status: "",
      avatar: "",
      total: "",
      audit_remark: "",
      line_status: 1,
      line_status_remark: "",
      line_type: "",
      line_type2: "",
      is_apply: "",
      enrol_status: "",
      unionid: "",
      actIdArr: "",
      voted: false,
      fs: false,//回复聚焦
      fs2: false,//评论聚焦
      showPL: false,//评论框
      showHF: false,//回复框
      showPICK: true,//底部iconBox，button
      commentBtn: false,//评论发送按钮
      replyBtn: false,//回复发送按钮
      comment_id: "",
      hfXXX: "",
      isShowZ: true,//回复展开
      isShowZd: false,//回复展开
      style: "position:fixed;bottom:0;left:0;z-index:20;",
      is_full: 0,
      img: []
    };
  },
  components: {
    sharePicker,
    loading
  },
  onLoad(options) {
    this.act_id = options.act_id;
  },
  onShow() {
    this.scrollTop=0;
    console.log(13456);
    this.fs = false;
    this.fs2 = false;
    this.msgPL = "";
    this.msgRL = "";
    this.user_school_id = wx.getStorageSync("user_school_id");
    this.loadingShow = true;
    this.spm = this.$root.$mp.query.act_id;
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    this.pickerShow = false;
    this.getInfo();
    var that = this;
    if (wx.getStorageSync("silentlogin").token) {
      userInfo({}, this.token, true).then(res => {
        console.log(res);
        this.is_full = res.is_full;
      });
    }
    this.scrollTop='';
    // actPoster(this.spm).then(function(res) {
    //   that.posterImg.push(that.url + res.path);
    // });
  },
  methods: {
    cancelAction() {
      cancelSignUp(this.act_id, {}, this.token).then(res => {
        this.isShowTips = false;
        wx.showToast({
          title: "取消报名成功"
        });
        this.getInfo();
      });
    },
    close() {
      this.isShowTips = false;
    },
    // 获取数据
    async getInfo() {
      // 活动详情
      let actRes = await detailInfo(this.spm, {}, this.token, true);
      console.log(actRes);
      if (actRes.status == 20 || actRes.status == 50) {
        this.haveUnionid();
        actPv(this.spm, {}, this.token, true);
      }
      this.line_type2 = actRes.line_type;
      if (actRes.line_type == "线上") {
        this.line_type = false;
      } else {
        this.line_type = true;
      }
      this.act_type = actRes.act_type;
      this.line_status = actRes.line_status;
      this.line_status_remark = actRes.line_status_remark;
      this.enrol_status = actRes.enrol_status;
      this.audit_remark = actRes.audit_remark;
      this.cover = actRes.cover;
      this.act_id = actRes.act_id;
      this.ranking = actRes.ranking;
      this.title = actRes.title;
      this.org_name = actRes.org.name;
      this.org_id = actRes.org.org_id;
      this.activity_start_at = changeTime(actRes.activity_start_at, 16);
      this.activity_expire_at = changeTime(actRes.activity_expire_at, 16);
      this.enrol_expire_at = changeTime(actRes.enrol_expire_at, 16);
      this.enrol_start_at = changeTime(actRes.enrol_start_at, 16);
      this.introduction = actRes.introduction;
      this.address = actRes.address;
      this.popularity = actRes.popularity;
      this.logo = actRes.org.logo;
      this.phone = actRes.org.phone;
      this.cms_school_name = actRes.cms_school_name;
      this.status = actRes.status;
      this.reviewMain = actRes.review;
      console.log(this.reviewMain);
      this.org_id = actRes.org.org_id;
      this.is_chief = actRes.is_chief;
      if (this.status == 50) {
        if (this.reviewMain != undefined) {
          this.commentBtn = true;
          this.showPL = true;
        }
      } else {
        this.commentBtn = false;
        this.showPL = false;
        this.showPICK = true;
      }
      console.log(this.status, 666666);
      console.log(Date.parse(actRes.enrol_expire_at));
      console.log(Date.parse(new Date()));
      this.is_apply = actRes.is_apply;
      console.log(this.enrol_status);

      if (this.enrol_status == 3) {
        this.signUpMes = "报名已结束";
        this.isActive = true;
      } else if (this.enrol_status == 1) {
        this.signUpMes = "报名未开始";
        this.isActive = true;
      } else {
        this.signUpMes = "我要报名";
        this.isActive = false;
      }
      if (actRes.is_apply == 1) {
        this.signUpMes = "报名成功";
        this.isActive = true;
      }
      console.log(this.act_id);
      if (common.status == "dev") {
        wx.reportAnalytics("activities_show_enterpage", {
          act_id: this.act_id,
          act_name: this.title,
          org_name: this.org_name,
          cms_school_name: this.cms_school_name
        });
      }
      wx.setStorageSync("act_id", this.act_id);
      // 报名列表
      let membersList = await membersGet(this.spm, "", "", true);
      console.log(membersList);
      this.total = membersList.meta.total;
      this.loadingShow = false;
      // 评论列表
      let commenList = await commentsList(
        this.spm,
        { pagesize: 1000 },
        "",
        true
      );
      console.log(commenList);
      this.main = commenList.data;
      this.commenNum = commenList.data.length;
      for (var i = 0; i < this.main.length; i++) {
        this.keepTime.push(
          keepTime(
            Date.parse(this.main[i].created_at.replace(/-/g, "/")) / 1000
          )
        );
      }
      // 报名人数统计
      let signRes = await statistical(
        this.spm,
        { cms_school_id: this.user_school_id },
        "",
        true
      );
      console.log(signRes);
      this.sign_school_name = signRes.school_name;
      this.sign_members = signRes.members;
      console.log(`返回${signRes.members}`);
    },
    showAll() {
      this.isFold = !this.isFold;
    },
    paint() {
      var that = this;
      this.img = [];
      var act_id = wx.getStorageSync("act_id");
      this.act_id = act_id;
      actPoster(act_id).then(function(res) {
        that.img.push(that.url + res.path);
        console.log(that.img);
        wx.previewImage({
          urls: that.img,
          success: res => {
            console.log("成功");
            console.log(res);
            shareAct(that.act_id);
          },
          fail: res => {
            console.log(res);
            wx.showToast({
              title: res,
              duration: 2000
            });
          }
        });
      });
      console.log(3333333, this.img);
    },
    bgHide(data) {
      this.pickerShow = false;
    },
    // 海报
    toPreview(img) {
      wx.previewImage({
        urls: [this.url + img]
      });
    },
    // 聚焦
    inFous(e) {
       console.log("聚焦刘英");
      this.msgPL = "";
      this.msgRL = "";
      this.isShowZz = true;
      console.log(e.mp.detail.height);
      this.bottom = e.mp.detail.height;
      this.style = `position:fixed;bottom:${this.bottom}px;left:0;z-index:20;`;
      console.log(this.style);
    },
    // 总条数
    changeZongT(a) {
      this.zongT = a;
      this.isShowZ = false;
      this.isShowZd = true;
      console.log(this.zongT);
    },
    // 总条数改变状态
    changeZongTd(a) {
      this.zongT = 6;
      this.isShowZd = false;
      this.isShowZ = true;
      console.log(this.zongT);
    },
    // 返回顶部
    toTop() {
      wx.pageScrollTo({
        scrollTop: 0
      });
    },
    // 点击回复类容
    bindReply(comment_id, user) {
      if (this.is_full == 1) {
        console.log(user);
        this.hfXXX = `回复：${user}`;
        this.comment_id = comment_id;
        this.showHF = true;
        this.showPL = false;
        this.showPICK = false;
        this.fs = true;
        this.fs2 = false;
        this.replyBtn = true;
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
    // 回复
    bindKeyInputReply(e) {
     
      console.log(e.target.value);
      console.log(e.target.dataset.id);
      if (e.target.value) {
        this.content = e.target.value;
      }
      if (e.target.dataset.id) {
        this.content = e.target.dataset.id;
      }
      this.page2 += 1;
      var act_id = this.act_id;
      reply(
        act_id,
        this.comment_id,
        { content: this.content },
        this.token
      ).then(res => {
        console.log(res);
        console.log(this.main);
        this.msgRL = "";
        for (let i = 0; i < this.main.length; i++) {
          if (this.main[i].comment_id == res.comment_id) {
            this.main[i].reply.push(res);
          }
        }
        setTimeout(() => {
          this.getInfo();
        }, 100);
        wx.showToast({
          title: "回复成功"
        });
          this.fs = false;
        this.fs2 = false;
      });
       this.fs = false;
        this.fs2 = false;
    },
    // 回复框失焦
    outBlur() {
      if (this.reviewMain != undefined) {
        console.log("活动回顾");
        this.showHF = true;
        this.replyBtn = true;
        this.showPICK = false;
      } else if (this.reviewMain == undefined) {
        console.log("活动详情");
        this.showHF = false;
        this.replyBtn = false;
        this.showPICK = true;
      }
      this.isShowZz = false;
      this.fs = false;
      this.fs2 = false;
      this.style = "position:fixed;bottom:0;left:0;z-index:20;";
    },
    // 回复按钮点击
    reply(comment_id, user) {
      this.hfXXX = "发表回复";
      this.comment_id = comment_id;
      this.showHF = true;
      this.showPL = false;
      this.showPICK = false;
      this.fs = true;
      this.replyBtn = true;
      this.commentBtn = false;
      this.isShowZz = false;
      console.log(this.fs)
      console.log("点击刘英")
    },
    // 评论
    bindKeyInputComment(e) {
      console.log(e);
      this.page += 1;
      var act_id = this.act_id;
      console.log(e.target.value);
      console.log(e.target.dataset.id);
      if (e.target.value) {
        this.content = e.target.value;
      } else if (e.target.dataset.id) {
        this.content = e.target.dataset.id;
      } else {
        this.content = "";
      }
      comments(act_id, { content: this.content }, this.token).then(res => {
        console.log(res);
        this.keepTime.unshift(
          keepTime(Date.parse(res.created_at.replace(/-/g, "/")) / 1000)
        );
        console.log(666666666666666666666666666666666);
        this.main.unshift(res);
        this.replyBtn = false;
        this.fs = false;
        this.fs2 = false;
        this.getInfo();
      });
      this.msgPL = "";
      this.fs2 = false;
      if (this.msgPL != "") {
        wx.showToast({
          title: "评论成功"
        });
      }
      this.showPICK = true;
        this.fs = false;
        this.fs2 = false;
    },
    // 评论框失焦
    appearChange() {
      if (this.reviewMain != undefined) {
        this.showPL = true;
        this.showPICK = false;
        this.commentBtn = true;
      } else if (this.reviewMain == undefined) {
        this.showPL = false;
        this.showPICK = true;
        this.commentBtn = false;
      }
      this.isShowZz = false;
      this.fs = false;
      this.fs2 = false;
      this.style = "position:fixed;bottom:0;left:0;z-index:20;";
    },
    bindPickerChange(e) {
      console.log(e);
      var type = Number(e.mp.detail.value);
      report(this.act_id, { report_type: (type += 1) }, this.token).then(
        res => {
          // wx.showToast({
          //   title: res.message
          // });
        }
      );
    },
    //获取uiionid请求活动已报名接口
    haveUnionid() {
      if (wx.getStorageSync("silentlogin").unionid) {
        this.unionid = wx.getStorageSync("silentlogin").unionid;
        picks({ unionid: this.unionid }, true).then(res => {
          this.actIdArr = res.act_ids;
          this.compare();
        });
      }
      // else {
      //   wx.navigateTo({
      //     url: "/pages/login/shouquan/shouquan"
      //   });
      // }
    },
    compare() {
      for (var i = 0; i < this.actIdArr.length; i++) {
        if (this.actIdArr[i] == this.act_id) {
          this.voted = true;
          console.log("该活动已报名");
          return;
        } else {
          console.log("???");
          this.voted = false;
        }
      }
    },
    // 报名
    signUp(e) {
      if (common.status == "dev") {
        wx.reportAnalytics("activities_show_enroll_click", {
          act_id: this.act_id,
          act_name: this.title,
          org_name: this.org_name,
          cms_school_name: this.cms_school_name
        });
      }

      if (wx.getStorageSync("silentlogin").token) {
        console.log(this.is_apply);
        if (
          Date.parse(this.enrol_start_at) <= Date.parse(new Date()) &&
          Date.parse(this.enrol_expire_at) >= Date.parse(new Date())
        ) {
          if (this.is_apply == 1) {
            console.log(666666666666666);
            this.isShowTips = true;
          } else {
            actSignUp(this.act_id, {}, this.token, "", false)
              .then(res => {
                console.log(res);
                console.log(132456);
                this.signUpMes = "报名成功";
                this.getInfo();
                this.isActive = true;
                formId(e);
                this.sign_members += 1;
              })
              .catch(err => {
                console.log(err);
                wx.showToast({
                  title: err.message
                });
              });
          }
        }
      } else {
        wx.showToast({
          title: "请先注册"
        }),
          setTimeout(() => {
            wx.navigateTo({
              url: "../../login/choose"
            });
          }, 1000);
      }
    },
    // 热度
    hot() {
      console.log(this.act_id);
      pick(this.act_id, {}, this.token, true).then(res => console.log(res));
    },
    //分享
    share() {
      this.pickerShow = false;
      this.pickerShow = true;
    },
    report() {
      this.isShow = !this.isShow;
      this.pickerShow = false;
    },
    intoMain() {
      this.shadeShow = false;
    },
    // 去列表页
    toList() {
      if (this.is_chief === 1) {
        wx.navigateTo({
          url: "./list/list?act_id=" + this.act_id
        });
      }
    },
    // 去社团
    toClub() {
      // wx.reportAnalytics("activity_detail_org_click", {
      //   org_id: this.org_id
      // });
      wx.navigateTo({
        url: "../../club/index?id=" + this.org_id
      });
    },
    Pl() {
      wx.navigateTo({
        url: "./discuss/discuss"
      });
    },
    toChange() {
      var url = "../../activity/published/change/change?act_id=" + this.spm;
      if (this.is_chief == 1) {
        wx.navigateTo({
          url
        });
      }
    },
    toPick() {
      console.log(this.token);
      pick(this.spm, { unionid: this.unionid }, "", true).then(res => {
        this.voted = true;
        //  wx.showModal({
        //     title: res.message,
        //     content:"每人每天有三次投票机会",
        //     showCancel:false,
        //     confirmText:"我知道了"
        //   });
      });
    },
    toDiscuss() {
      console.log(this.token);
      if (this.is_full == 1) {
        this.fs2 = true;
        this.showPICK = false;
        this.showPL = true;
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
    toShare() {
      this.pickerShow = false;
      this.pickerShow = true;
    },
    option() {
      var url = "../../mine/feedback/feedback?act_id=" + this.spm;
      wx.navigateTo({
        url: url
      });
    },

    cancel() {
      cancelAct(this.spm, {}, this.token).then(res => {
        // wx.showToast({
        //   title: res.message
        // });
        setTimeout(() => {
          wx.redirectTo({
            url: "../published/published"
          });
        }, 1000);
      });
    },
    review() {
      var url = "../../mine/publish/publish?act_id=" + this.spm;
      wx.navigateTo({
        url: url
      });
    }
  },
  onShareAppMessage: function(res) {
    console.log(res, 666);
    return {
      title: this.title,
      path:
        this.date === "end"
          ? `/pages/index/index?act_id=${this.spm}&act_type=${
              this.act_type
            }&status=share`
          : "/pages/index/popularityKing/index?act_id=" +
            this.spm +
            "&&status=share",
      imageUrl: this.url + this.cover
    };
  },
  onPageScroll(obj) {
    this.scrollTop = obj.scrollTop;
    this.fs = false;
    this.fs2 = false;
    this.style = "position:fixed;bottom:0;left:0;z-index:20;";
  }
};
</script>
<style scoped lang='scss'>
@import "../../../style/icon.css";
.bg {
  width: 100%;
  height: 100vh;
  background: rgba(51, 25, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 100;
}
.cancel_wrap {
  position: fixed;
  top: 200rpx;
  z-index: 100;
  width: 100%;
}
.cancelBox {
  width: 590rpx;
  height: 646rpx;
  background: #fff;
  margin: 0 auto;
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
}
.close {
  width: 22rpx;
  height: 22rpx;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}
.bgImg {
  width: 348rpx;
  height: 202rpx;
  display: block;
  margin: 116rpx auto 0;
}
.tips p:first-child {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  text-align: center;
  margin-top: 60rpx;
}
.tips p:nth-child(2) {
  font-size: 24rpx;
  color: #999999;
  text-align: center;
}
.btnS {
  display: flex;
  text-align: center;
  justify-content: space-between;
  margin: 46rpx;
}
.btn text {
  flex: 1;
  justify-content: center;
}
.btnS span {
  display: block;
  box-sizing: border-box;
  width: 230rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}
.btnS span:first-child {
  background: #f5f5f5;
}
.btnS span:nth-child(2) {
  background: #ffb90c;
}
.shenhe {
  width: 750rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #ff4c5b;
  padding-left: 39rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
/* .shade {
  width: 100%;
  height: 10000px;
  background: #000;
  opacity: 0.7;
  position: fixed;
  z-index: 5;
} */
.banner {
  position: relative;
  width: 750rpx;
  height: 422rpx;
}
.banner img:nth-child(1) {
  width: 748rpx;
  height: 422rpx;
  z-index: 1;
}
.banner img:nth-child(2) {
  position: absolute;
  top: 20rpx;
  left: 580rpx;
  width: 58rpx;
  height: 58rpx;
  z-index: 2;
}
.banner .picker .report {
  position: absolute;
  top: 20rpx;
  left: 670rpx;
  width: 58rpx;
  height: 58rpx;
  z-index: 2;
}
.swiper {
  height: 352rpx;
}
.swiper img {
  width: 750rpx;
  height: 352rpx;
}
.detailTitle {
  padding: 24rpx 40rpx 26rpx;
  overflow: hidden;
}
.detailTitle .rank {
  display: inline-block;
  padding: 0 14rpx;
  height: 36rpx;
  background: #ccb166;
  font-size: 22rpx;
  color: #ffffff;
  border-radius: 8rpx;
  line-height: 36rpx;
  text-align: center;
}
.detailTitle .hot {
  display: inline-block;
  padding: 0 12rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  color: #fff;
  background: #ff555d;
  border-radius: 8rpx;
  font-size: 22rpx;
  margin-left: 10rpx;
}
.detailTitle p {
  font-size: 34rpx;
  font-weight: bold;
  color: #332503;
  line-height: 52rpx;
  margin-top: 12rpx;
}
.detailTitle .detailTitleBottom {
  overflow: hidden;
  position: relative;
}
.detailTitle .detailTitleBottom .more1 {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  top: 40rpx;
  right: 0rpx;
}
.detailTitle .detailTitleBottom .logo {
  width: 80rpx;
  height: 80rpx;
  margin-top: 18rpx;
  float: left;
  border-radius: 50%;
}
.detailTitle .detailTitleBottom .detailName {
  float: left;
  margin-left: 12rpx;
}
.detailTitle .detailTitleBottom .detailName p:first-child {
  font-size: 26rpx;
  color: #332503;
  line-height: 40rpx;
}
.detailTitle .detailTitleBottom .detailName p:nth-child(2) {
  font-size: 22rpx;
  color: #99958a;
  line-height: 40rpx;
}
.detailTitle .detailTitleBottom .more {
  width: 16rpx;
  height: 28rpx;
  float: left;
  margin-top: 50rpx;
  margin-left: 255rpx;
}
.detailTitle .join {
  margin-top: -2rpx;
}
.detailTitle .join p {
  color: #999999;
  font-weight: normal;
  font-size: 26rpx;
}
.detailTitle .join span {
  color: #ffb90c;
}

.detailMes {
  padding-top: 20rpx;
  padding-bottom: 38rpx;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  margin-top: 28rpx;
}
.detailMes p {
  font-size: 26rpx;
  color: #332503;
  line-height: 40rpx;
}

.synopsis {
  border-bottom: 20rpx solid #f5f5f5;
  padding: 40rpx;
}
.title {
  font-size: 34rpx;
  color: #332503;
  font-weight: bold;
  position: relative;
  top: 0;
  left: 0;
  /* margin-top: 30rpx; */
}
.title i {
  position: absolute;
  top: 0rpx;
  right: 32rpx;
  color: #ccb166;
  font-size: 46rpx;
  line-height: 38rpx;
}
.synopsis .contain {
  margin-top: 28rpx;
  width: 660rpx;
}
.contain .fold {
  font-size: 28rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(87, 107, 149, 1);
  line-height: 128rpx;
  text-align: center;
  height: 128rpx;
  display: flex;
  justify-content: center;
  background-color: rgab(0, 0, 0, 0.8);
  color: #fff;
  // background-image: linear-gradient(
  //   0deg,
  //   #ffffff 0%,
  //   rgba(255, 255, 255, 0.8) 100%
  // );
  i {
    font-size: 12rpx;
    padding-left: 10rpx;
  }
}
.synopsis .contain .content {
  margin-top: 40rpx;
  color: #666;
  font-size: 26rpx;
  text-indent: 2em each-line;
  // word-break: break-all;
  // overflow: hidden;
  // max-height: 140rpx;
  transition: 0.5s all ease;
  &.isflod {
    // max-height: 10000rpx;
  }
}
.review p {
  padding: 40rpx;
  font-size: 26rpx;
  color: #99958a;
  line-height: 40rpx;
  border-bottom: 20rpx solid #f5f5f5;
}

.discuss {
  padding: 0 40rpx;
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
  height: 36rpx;
  position: absolute;
  bottom: 0rpx;
  right: 3rpx;
  margin: 10rpx 0 10rpx 10rpx;
}
.discuss .discuss-item .item_bottom img {
  width: 32rpx;
  height: 34rpx;
  position: absolute;
  top: 12rpx;
  right: 60rpx;
}
.discuss .discuss-item .item_bottom text {
  font-size: 22rpx;
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
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul {
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  line-height: 40rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li {
  overflow: hidden;
}
.discuss .discuss-item .item_bottom .replyArea ul li p {
  font-size: 26rpx;
  float: left;
  text-align: left;
  padding: 10rpx 0 10rpx 20rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li p span {
  color: #576b95;
}

footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 4rpx 0rpx;
  background: #ffffff;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
}
footer .pick {
  justify-content: space-between;
}
footer .pick button:nth-child(1) {
  width: 414rpx;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
  box-sizing: border-box;
  border-radius: 8rpx;
  margin: 20rpx;
  float: left;
}
.pick button::after {
  border: none;
}
.pick .iconBox {
  height: 100rpx;
  padding-right: 50rpx;
  float: right;
}
.pick .iconBox i {
  color: #333;
  font-size: 46rpx;
  line-height: -11rpx;
  display: inline;
  margin-left: 13rpx;
}

.signUp {
  background: #ffb90c;
  color: #332503;
  font-size: 28rpx;
}
footer .pick text:nth-child(2) {
  background: #fff;
  color: #333333;
  border: 1px solid #d9d9d9;
}
.signUpBg {
  background: #f5f5f5;
  z-index: 100;
  color: #333;
  font-size: 28rpx;
}
footer .invite .btn {
  width: 670rpx;
  height: 88rpx;
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
  border-radius: 8rpx;
  font-weight: bold;
  color: #332503;
  font-size: 28rpx;
  float: left;
  /* margin-left: 25rpx; */
}
footer .invite .btn1 {
  width: 300rpx;
  margin-left: 25rpx;
}

footer .invite .hot {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: 80rpx;
}
footer .invite .hot img {
  width: 44rpx;
  height: 50rpx;
}
footer .invite .hot text {
  font-size: 22rpx;
  color: #ccc7b8;
}
footer .cancel {
  margin-left: 40rpx;
}
footer .end input {
  width: 610rpx;
  height: 68rpx;
  padding-left: 20rpx;
  line-height: 68rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #f5f5f5;
  color: #ccc7b8;
  float: left;
  font-size: 26rpx;
  margin-left: 30rpx;
}
footer .end .hot {
  overflow: hidden;
  float: left;
  text-align: center;
  margin-left: 20rpx;
}
footer .end img {
  width: 34rpx;
  height: 34rpx;
}
footer .end p {
  font-size: 22rpx;
  color: #989388;
  font-weight: bold;
}
.appear {
  width: 750rpx;
  height: 108rpx;
  background: #fff;
  border-top: 1px solid #eaeaea;
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
.shadePage {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 12;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
.shareActive {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 20rpx 0rpx;
  background: #ffffff;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
  justify-content: space-between;
  display: flex;
  text {
    display: block;
    margin: 0 20rpx;
    height: 88rpx;
    width: 320rpx;
    font-weight: 800;
    font-size: 30rpx;
    text-align: center;
    line-height: 88rpx;
  }
}
</style>


