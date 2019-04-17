<template>
    <!-- <div class="homeFloat">
      <div>
        <div class="homeTabar">
          <view :class="{'current':type == 1}" @click="typeChange(1)">免费门票</view>
          <view :class="{'current':type == 2}" @click="typeChange(2)">同台演出</view>
        </div>
      </div>
    </div> -->
    <!-- 免费门票 -->
  <div class="homeImg">
    <div class="addressBox">
      <div class="address">
        <img :src="url+'/img/default/address.png'" alt="">
         <span>{{concertDetails.name}}</span>
      </div>
      <div class="activityRule" @click="onActivity">
        <div>活动规则</div>
      </div>
    </div>
    <div class="VIPrule" @click="onRule" v-if="vipStatus">
      <div> VIP通道</div>
    </div>
    <!-- 活动规则弹窗 -->
    <div class="rulePopups" v-if="ruleStatus">
      <div>
        <h3>大湾区音乐节门票规则</h3>
        <div class="content">
          <p>1、点击领取门票后，可邀请好友为你助力，当助力值达到100时，即可获取门票；</p>
          <p>2、门票可以在活动首页底部“我的门票”查看，音乐节现场提供电子门票方可入场；</p>
          <p>3、单个用户可以为所有用户助力，对同一个参赛者只能助力一次，重复无效 </p>
          <p>4、音乐节门票仅有1000份，领完即止。</p>
          <h5>注意事项：</h5>
          <div>1、若用户存在恶习刷票行为，则立刻取消去领票资格并追究法律责任；</div>
          <div>2、本音乐节为公益项目，所有门票都是免费，禁止个人或商家等贩卖门票；</div>
          <div>3、门票报名按钮若为灰色，说明门票已全部发放；</div>
          <div>4、大湾区音乐节门票领取最终解释权为奇集所有。</div>
          <div class="closeRule" @click="ruleClose">
            <img :src="url+'/img/default/close_icon@2x.png'" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- VIP线下验证弹窗 -->
    <div class="popupBox" v-if="showState" >
      <div>
        <div class="usageBox">
          <div class="verification">
            <input type="text"  placeholder="输入VIP码" v-model="invite_code" focus="true">
          </div>
          <div class="usage">
            <div>{{error_msg}}</div>
          </div>
        </div>
        <div class="confirm" @click="onConfirm">确认</div>
        <div class="closeVIP" @click="changeClose">
          <img :src="url+'/img/default/close_icon@2x.png'" alt="">
        </div>
      </div>
    </div>
    <div class="holdDetails">
      <div>举办时间：{{concertDetails.start_at}}</div>
      <div>举办地址：{{concertDetails.address}}</div>
    </div>
    <div class="session" @click="onCheckOut" v-if="outStatus">
      <div v-if="concert_id==1">切换至珠海场</div>
      <div v-else>切换回广州场</div>
    </div>
    <!-- 场次弹窗 -->
    <div class="triggerBox" v-if="switchState">
      <div>
        <div class="change">选择你要参加的场次</div>
        <div class="switchingTimes">
          <div @click="onZhu">
            <img src="/static/images/zhBut@2x.png" alt="">
          </div>
          <div @click="onGuang">
            <img src="/static/images/gzBut@2x.png" alt="">
          </div>
        </div>
        <div class="only">* 门票只限领取一个场次，选择后无法切换 *</div>
        <div class="closeBut" @click="onCloseSwitch">
          <img :src="url+'/img/default/close_icon@2x.png'" alt="">
        </div>
      </div>
    </div>
    <div class="description">
      大湾区音乐节，大咖云集，还有你们的校园爱豆，确定不来看看吗？？这里还有免费门票，拼手速的时候到啦，先到先得!
    </div>
    <div class="contentImg">
      <img src="/static/images/content@2x.png" alt="">
    </div>
    <div class="avatarBox">
      <div class="avatarImg">
        <img :src="url+'/img/default/avatar.png'" alt="">
      </div>
      <div class="avatarImg">
        <img :src="url+'/img/default/avatar.png'" alt="">:src="url+'/img/default
      </div>
       <div class="avatarImg">
        <img :src="url+'/img/default/avatar.png'" alt="">
      </div>
    </div>
    <div class="avatarTitle">
      <div>敬请期待参与的明星阵容</div>
      <div>主办方：香港演艺界内地发展协进会</div>
    </div>
    <div class="receiveImg">
      <img :src="url+'/img/default/receive.png'" alt="">
      <div class="already">
        <div>已有<span>{{concertDetails.receive_tickets}}</span>人成功免费领取门票</div>
        <div class="remaining">还剩余<span>{{concertDetails.remaining_tickets}}</span>张</div>
      </div>
        <div class="title">
          <div v-for="(item,index) in sessionList" :index="index" :key="index"><span>{{item.realname}}</span>{{keepTime[index]}}成功免费领取门票</div>
        </div>
    </div>
    <div class="quotesBox">
      <div class="shareButton">
        <div class="shareImg">
            <img src="/static/images/mineBut.png" alt="" @click="onMine" v-if="mineStatus">
          <img src="/static/images/freeBut@2x.png" alt="" @click="onSwitch" v-else>
        </div>
        <div class="shareImg" @click="pickerShow=true">
          <img :src="url+'/img/default/shareBut.png'" alt="">
        </div>
      </div>
    </div>
    <!-- 分享弹窗 -->
      <div class="sharePopus" v-if="pickerShow" @click="pickerShow=false">
        <div>
          <button class="classPopus" open-type="share">分享给好友</button>
          <span class="classPopus"  @click="onPaint">
            分享到朋友圈
          </span>
          <span class="classPopus" @click="pickerShow=false">取消</span>
        </div>
      </div>
    <!-- 首页领取门票无票弹窗 -->
      <div class="noTicket" v-if="ticketStatus">
        <div>
          <div class="missingImg">
            <img src="/static/images/missing@2x.png" alt="">
          </div>
          <div>抢票的人数太多了</div>
          <div>你来晚了，已经没票啦</div>
          <div class="mineKnow" @click="ticketStatus=false">知道了</div>
        </div>
      </div>
  </div>
</template>
<script>
import {
  musicConcert,
  sessionTickets,
  userConcert,
  freeCollection,
  inviteReceive
} from "@/utils/api";
import keepTime from "@/utils/fetch";
import url from "@/utils/common";
export default {
  data() {
    return {
      checkStatus: true, //免费领票
      vipStatus: true,
      switchState: false,
      showState: false,
      ticketStatus: false,
      ruleStatus: false,
      concert_id: 1,
      concertDetails: [],
      pickerShow: false,
      token: " ",
      sessionList: [],
      userDetails: [], //当前用户门票
      keepTime: [],
      invite_code: "",
      concert: {},
      outStatus: true,
      mineStatus: false, //我的门票
      error_msg: "",
      url: url.url,
      img: [],
    };
  },
  created() {},
  mounted() {
    // this.token += wx.getStorageSync("silentlogin").token;
    console.log(this.token == " ");
    if (this.token == " ") {
      this.token += wx.getStorageSync("silentlogin").token;
    } else {
      this.token = " " + wx.getStorageSync("silentlogin").token;
    }
    this.pageData();
    this.sessionData();
    this.onUserAll();
  //   setInterval(() => {
  //     this.onUserAll();
  //   }, 5000);
  },
  onShow() {
    this.pageData();
    this.sessionData();
    this.showState = false;

  },
  methods: {
    //场次详情
    pageData() {
      var city = wx.getStorageSync("city");
      if (city == "zhu" || city == "guang") {
        this.checkStatus = false;
        this.mineStatus = true;
        this.outStatus = false;
        this.concert_id = city == "zhu" ? 2 : 1;
      }
      musicConcert(this.concert_id, {}, this.token).then(data => {
        this.concertDetails = data;
      });
    },
    //切换场次详情
    onCheckOut() {
      this.concert_id = this.concert_id == 2 ? 1 : 2;
      this.pageData();
    },
    //邀请码领取门票
    onConfirm() {
      inviteReceive(this.concert_id, this.token, {
        invite_code: this.invite_code
      })
        .then(data => {
          var url = "../musicTicket/musicTicket?concert_id=";
          wx.navigateTo({
            url:
              url +
              this.concert_id +
              "&id=" +
              this.id +
              "&ticket_id=" +
              this.ticket_id
          });
        })
        .catch(error => {
          this.error_msg = error.errors.invite_code[0];
        });
    },
    //免费领取门票
    onFree() {
      freeCollection(this.concert_id, this.token, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }).then(data => {})
      ;
    },
    onMine() {
      if (this.userDetails.is_receive == 1) {
        var url = "../musicTicket/musicTicket?concert_id=";
        wx.navigateTo({
          url:
            url +
            this.concert_id +
            "&id=" +
            this.id +
            "&ticket_id=" +
            this.ticket_id
        });
      } else {
        var url = "../musicCall/musicCall?concert_id=";
        wx.navigateTo({
          url: url + this.concert_id + "&id=" + this.id
        });
      }
    },
    //门票记录
    sessionData() {
      sessionTickets(this.concert_id, this.token).then(data => {
        this.sessionList = data.data;
        for (var i = 0; i < this.sessionList.length; i++) {
          this.keepTime.unshift(keepTime(this.sessionList[i].receive_at));
        }
      });
    },
    //当前用户的门票
    onUserAll() {
      userConcert({}, this.token).then(data => {
        console.log(data, 220);
        this.id = data.uuid;
        this.ticket_id = data.ticket_id;
        this.concert = data.concert;
        this.userDetails = data;
        console.log(data, 0);
        if (this.userDetails.is_receive == 1) {
          this.vipStatus = false;
          this.mineStatus = true;
          this.outStatus = false;
          this.checkStatus = false;
        }
      });
    },
    //珠海
    onZhu() {
      wx.setStorageSync("city", "zhu");
      this.concert_id = 2;
      freeCollection(this.concert_id, this.token).then(data => {
        console.log(this.concert_id);
        var url = "../musicCall/musicCall?concert_id=";
        wx.navigateTo({
          url:
            url +
            this.concert_id +
            "&id=" +
            this.id +
            "&ticket_id=" +
            this.ticket_id
        });
        this.outStatus = false;
        this.switchState = false;
        this.mineStatus = true;
        this.checkStatus = false;
      }).catch;
      this.pageData();
    },
    //广州
    onGuang() {
      wx.setStorageSync("city", "guang");
      this.concert_id = 1;
      freeCollection(this.concert_id, this.token).then(data => {
        console.log(this.concert_id);
        var url = "../musicCall/musicCall?concert_id=";
        wx.navigateTo({
          url:
            url +
            this.concert_id +
            "&id=" +
            this.id +
            "&ticket_id=" +
            this.ticket_id
        });
        this.outStatus = false;
        this.switchState = false;
        this.mineStatus = true;
        this.checkStatus = false;
      }).catch;
      this.pageData();
    },
    //vip弹窗开启关闭
    onRule() {
      this.showState = true;
    },
    changeClose() {
      this.showState = false;
    },

    //活动规则开启关闭
    onActivity() {
      this.ruleStatus = true;
    },
    ruleClose() {
      this.ruleStatus = false;
    },
    //场次弹窗打开
    onSwitch() {
      this.switchState = true;
    },
    //场次弹窗关闭+`
    onCloseSwitch() {
      this.switchState = false;
    },
    //分享好友
    onShare() {
      this.pickerShow = true;
    },
    onCancel() {
      this.pickerShow = false;
    },
    //点击切换
    // typeChange(type) {
    //   this.type = type;
    //   this.homeGoodsList = [];
    // }
    //分享朋友圈
    onPaint() {
      console.log(1);
      this.img = [];
      var a = "https://api.54qj.com/img/concert/poster.png";
      console.log(a, 999);
      this.img.push(a);
      wx.previewImage({
        urls: this.img,
        success: res => {
          console.log("成功");
          console.log(res);
        },
        fail: res => {
          console.log(res);
          wx.showModal({
            title: res,
            duration: 2000
          });
        }
      });
    }
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "大湾区音乐巡演，门票免费拿",
      path:
        "/pages/musicFestival/musicHome/musicHome?concert_id=" +
        this.concert_id,
      imageUrl:
        "http://qn.zhenwang.so//file/upload/20189/10/1539157130574mbbpvtf1"
    };
  }
};
</script>
<style scoped>
/* .homeFloat {
  height: 88rpx;
} */
/* .homeFloat > div {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  z-index: 4;
}
.homeTabar {
  display: flex;
  font-family: SourceHanSansCN-Medium;
  background-color: #292929;
  text-align: center;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 34rpx;
  color: #fff;
}
.homeTabar > view {
  flex: 1;
}
.homeTabar > view.current {
  position: relative;
  background-color: #e4b917;
} */
.homeImg {
  background: url("http://qn.zhenwang.so//file/upload/20188/29/1538193374468ibhrzrmo");
  /* background: url("http://qn.zhenwang.so//file/upload/20188/13/1536823013308jzsdqej7"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  flex-shrink: 0;
  /* min-height: 70vh; */
  background-color: #291e5f;
}
.homeImg .addressBox {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0 0 12rpx;
}
.homeImg .addressBox .address {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 136rpx;
  height: 54rpx;
  border-radius: 27rpx;
  background-color: rgba(0, 0, 0, 0.6);
}
.homeImg .addressBox .address > img {
  width: 20rpx;
  height: 26rpx;
  font-size: 30rpx;
  margin-left: 15rpx;
}
.homeImg .addressBox .address span {
  font-size: 24rpx;
  color: #fefefe;
  font-weight: 800;
  margin-left: 11rpx;
}
.homeImg .addressBox .activityRule {
  margin-top: 10rpx;
  width: 96rpx;
  height: 76rpx;
  background-image: linear-gradient(#11c1a3, #11c1a3),
    linear-gradient(#2f1c59, #2f1c59);
  border-top-left-radius: 38rpx;
  border-bottom-left-radius: 38rpx;
}
.homeImg .addressBox .activityRule > div {
  color: #007b63;
  font-size: 24rpx;
  width: 49rpx;
  height: 46rpx;
  margin-left: 34rpx;
  margin-top: 7rpx;
}
.homeImg .VIPrule {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 33rpx;
  height: 76rpx;
}
.homeImg .VIPrule > div {
  width: 49rpx;
  height: 46rpx;
  color: #007b63;
  font-size: 24rpx;
  background-image: linear-gradient(#11c1a3, #11c1a3),
    linear-gradient(#2f1c59, #2f1c59);
  padding: 7rpx 16rpx 23rpx 34rpx;
  border-top-left-radius: 38rpx;
  border-bottom-left-radius: 38rpx;
}
.homeImg .holdDetails {
  margin-top: 15vh;
  font-size: 24rpx;
  color: #ffffff;
  text-align: center;
  position: relative;
}
.homeImg .session {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 76rpx;
}
.homeImg .session > div {
  width: 72rpx;
  height: 48rpx;
  color: #7badff;
  background-image: linear-gradient(#44518f, #44518f),
    linear-gradient(#2f1c59, #2f1c59);
  font-size: 24rpx;
  border-top-left-radius: 38rpx;
  border-bottom-left-radius: 38rpx;
  padding: 7rpx 16rpx 23rpx 34rpx;
}
.homeImg .description {
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #aab5eb;
  padding: 0 50rpx;
}
.homeImg .contentImg {
  width: 355rpx;
  height: 72rpx;
  flex-shrink: 0;
  margin: 30rpx auto;
}
.homeImg .contentImg img {
  width: 100%;
  height: 100%;
}
.homeImg .avatarBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  margin: 0 10%;
}
.homeImg .avatarBox .avatarImg {
  width: 164rpx;
  height: 164rpx;
  flex-shrink: 0;
}
.homeImg .avatarBox .avatarImg img {
  width: 100%;
  height: 100%;
}
.homeImg .avatarTitle {
  margin-top: 26rpx;
  font-size: 28rpx;
  color: #aab5eb;
  text-align: center;
}
.homeImg .receiveImg {
  margin-top: 54rpx;
  padding: 0 92rpx;
  width: 569rpx;
  height: 620rpx;
  flex-shrink: 0;
  position: relative;
}
.homeImg .receiveImg img {
  width: 100%;
  height: 100%;
}
.homeImg .already {
  color: #3d2574;
  font-size: 28rpx;
  text-align: center;
  position: absolute;
  top: 70rpx;
  left: 190rpx;
}
.homeImg .already div > span {
  color: #f1a359;
}
.homeImg .remaining {
  font-size: 22rpx;
}
.homeImg .title {
  color: #666666;
  font-size: 22rpx;
  text-align: center;
  position: absolute;
  top: 180rpx;
  width: 560rpx;
  height: 73%;
  line-height: 43rpx;
}
.homeImg .title > div span {
  color: #f1a359;
  width: 120rpx;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 22rpx;
}
.homeImg .quotesBox {
  height: 120rpx;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0rpx;
  background-color: #291e5f;
}
.homeImg .shareButton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 60rpx;
}
.homeImg .shareButton .shareImg {
  width: 300rpx;
  height: 80rpx;
  flex-shrink: 0;
}
.homeImg .shareButton .shareImg img {
  width: 100%;
  height: 100%;
}
/* 场次选择弹窗 */
.homeImg .triggerBox {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.homeImg .triggerBox > div {
  width: 80%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 10%;
  border-radius: 8rpx;
  transform: translateY(-50%);
}
.homeImg .triggerBox .change {
  padding: 50rpx 0;
  color: #333333;
  text-align: center;
  font-size: 36rpx;
}
.homeImg .triggerBox .switchingTimes {
  display: flex;
  justify-content: space-between;
  padding: 0 78rpx;
}
.homeImg .triggerBox .switchingTimes div {
  width: 182rpx;
  height: 296rpx;
  flex-shrink: 0;
}
.homeImg .triggerBox .switchingTimes div img {
  width: 100%;
  height: 100%;
}
.homeImg .triggerBox .only {
  color: #999999;
  font-size: 20rpx;
  text-align: center;
  padding: 26rpx 0;
}
.homeImg .triggerBox .closeBut {
  position: absolute;
  bottom: -80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}
.homeImg .triggerBox .closeBut img {
  width: 100%;
  height: 100%;
}
/* VIP弹窗 */
.homeImg .popupBox {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.homeImg .popupBox > div {
  width: 68%;
  background-color: #fff;
  position: absolute;
  top: 40%;
  left: 15%;
  border-radius: 8rpx;
  transform: translateY(-50%);
}
.homeImg .popupBox .verification {
  height: 70rpx;
  background-color: #f1eeff;
  border-radius: 35rpx;
}
.homeImg .popupBox .usageBox {
  padding: 85rpx 70rpx;
  line-height: 50rpx;
  position: relative;
}
.homeImg .popupBox .verification input {
  color: #333333;
  font-size: 34rpx;
  line-height: 70rpx;
  margin: 0 105rpx;
  height: 70rpx;
}
#input-test::-webkit-input-placeholder {
  color: #b4b4b4;
  text-align: center;
}
.homeImg .popupBox .usage {
  position: absolute;
  top: 150rpx;
  /* left: 136rpx; */
  width: 72%;
  /* background-color: pink; */
}
.homeImg .popupBox .usage div {
  text-align: center;
  color: #ff5858;
  font-size: 22rpx;
}
.homeImg .popupBox .confirm {
  height: 96rpx;
  color: #301c5a;
  font-size: 32rpx;
  text-align: center;
  line-height: 96rpx;
  border-top: 1rpx solid #d2d3d5;
}
.homeImg .popupBox .closeVIP,
.homeImg .rulePopups .closeRule {
  position: absolute;
  bottom: -80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}
.homeImg .popupBox .closeVIP img,
.homeImg .rulePopups .closeRule img {
  width: 100%;
  height: 100%;
}
/* 首页领取门票无票弹窗 */
.homeImg .noTicket {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.homeImg .noTicket > div {
  width: 70%;
  background-color: #fff;
  border-radius: 8rpx;
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
  z-index: 999;
}
.homeImg .noTicket .missingImg {
  width: 203rpx;
  height: 102rpx;
  flex-shrink: 0;
  padding: 70rpx 106rpx 30rpx 106rpx;
  margin: 0 auto;
}
.homeImg .noTicket .missingImg img {
  width: 100%;
  height: 100%;
}
.homeImg .noTicket > div > div:nth-child(2),
.homeImg .noTicket > div > div:nth-child(3) {
  color: #b9b9b9;
  font-size: 24rpx;
  text-align: center;
  line-height: 40rpx;
}
.homeImg .noTicket > div > div:nth-child(3) {
  margin-bottom: 50rpx;
}
.homeImg .noTicket .mineKnow {
  color: #301c5a;
  font-size: 32rpx;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  border-top: 1rpx solid #d2d3d5;
}
/* 活动规则弹窗 */
.homeImg .rulePopups {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.homeImg .rulePopups > div {
  width: 80%;
  background-color: #fff;
  border-radius: 8rpx;
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  padding-bottom: 20rpx;
}
.homeImg .rulePopups > div > h3 {
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 70rpx;
  color: #333333;
}
.homeImg .rulePopups .content {
  padding: 0rpx 30rpx;
  font-size: 24rpx;
  color: #999;
  line-height: 40rpx;
}
.homeImg .rulePopups .content > h5 {
  color: #333;
  font-size: 28rpx;
  margin-top: 15rpx;
}
.homeImg .rulePopups .content > div {
  font-size: 24rpx;
  color: #999;
}
/* 分享弹窗 */
.homeImg .sharePopus {
  position: fixed;
  z-index: 12;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.homeImg .sharePopus div {
  width: 100%;
  position: absolute;
  bottom: 0rpx;
  background-color: #f5f5f5;
}
.homeImg .sharePopus > div .classPopus {
  background-color: transparent;
  background-color: #fff;
  font-size: 32rpx;
  color: #333333;
  display: block;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
}
.homeImg .sharePopus > div .classPopus:nth-child(2) {
  border-top: 1rpx solid #f5f5f5;
}
.homeImg .sharePopus > div .classPopus:after {
  border: none;
}
.homeImg .sharePopus > div .classPopus:nth-child(3) {
  margin-top: 18rpx;
}
</style>
