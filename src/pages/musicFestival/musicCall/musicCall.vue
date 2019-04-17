<template>
  <div class="miusicCallPage">
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
     <!-- VIP线下验证弹窗 -->
    <div class="popupBox" v-if="showState" >
      <div>
        <div class="usageBox">
          <div class="verification">
            <input type="text" placeholder="输入VIP码" focus="true" v-model="invite_code">
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
    <div class="holdDetails">
      <div>举办时间：{{concertDetails.start_at}}</div>
      <div>举办地址：{{concertDetails.address}}</div>
    </div>
    <div class="callImg">
      <img :src="url+'/img/default/BoostBg@2x.png'" alt="">
      <div class="friendCall">
        <img src="/static/images/callingBut.png" alt="">
      </div>
      <p>● 100人为你打Call就能获得免费门票 ●</p>
      <div class="progress">
        <div class="progressSmall" :style='"margin-left:"+ userDetails.call_count  +"%"'>
          <div class="further">
            {{userDetails.call_count}}%
          </div>
         </div>
      </div>
      <div class="inviteBox">
        <div class="remaining">还差<span>{{userDetails.remaining_call_count}}</span>人</div>
        <div class="ticket">
          <div>门票还剩余 {{concertDetails.remaining_tickets}} 张</div>
          </div>
        <div class="invite"  @click="onShare" >
          <img src="/static/images/insufficient.png" alt=""  v-if="noTicket">
          <img src="/static/images/invitCall@2x.png" alt="" v-else>

        </div>
      </div>
      <!-- 分享弹窗 -->
      <div class="sharePopus" v-if="pickerShow" @click="onCancel">
        <div>
          <button class="classPopus" open-type="share" @click="onShareAppMessage">分享给好友</button>
          <span class="classPopus"  @click="onPaint">分享到朋友圈</span>
          <span class="classPopus" @click="onCancel">取消</span>
        </div>
      </div>
      <!-- 打call领取门票成功弹窗 -->
        <div class="successTicket" v-if="ticketStatus">
          <div>
            <div>恭喜你成功获得门票</div>
            <div>确认</div>
          </div>
        </div>
    </div>
    <div class="frameImg">
      <img :src="url+'/img/default/frameBg@2x.png'" alt="">
      <div class="frameTab">—— 已有{{userDetails.call_count}}人为我打Call ——</div>
      <div class="frameBigBox">
        <div class="frameBox"  v-for="(item,index) in calls" :index="index" :key="index">
          <div>
            <div class="avatarImg">
              <img :src="url+item.avatar" alt="">
            </div>
            <p>{{item.nickname}}</p>
          </div>
          <div>{{item.created_at}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { musicConcert, userConcert, inviteReceive } from "@/utils/api";
import url from "@/utils/common";
export default {
  data() {
    return {
      ticketStatus: false,
      showState: false,
      ruleStatus: false,
      keyWord: " ",
      pickerShow: false,
      concertDetails: [],
      id: "",
      token: " ",
      userDetails: [],
      vipStatus: true,
      noTicket: false,
      calls: [],
      error_msg: "",
      url: url.url,
      img: [],
    };
  },
  created() {},
  mounted() {
    if (this.token == " ") {
      this.token += wx.getStorageSync("silentlogin").token;
    } else {
      this.token = " " + wx.getStorageSync("silentlogin").token;
    }
    this.onUserAll();
    this.pageData();
    // setInterval(() => {
    //   this.onUserAll();
    // }, 5000);
  },
  onLoad: function(options) {
    this.concert_id = options.concert_id;
    this.id = options.id;
  },
  methods: {
    //场次详情
    pageData() {
      musicConcert(this.concert_id, this.token).then(data => {
        this.concertDetails = data;
        if (concert_remaining_tickets <= 0) {
          this.noTicket = true;
        } else {
          this.yesTicket = true;
        }
      });
    },
    //邀请码领取门票
    onConfirm() {
      inviteReceive(this.concert_id, this.token, {
        invite_code: this.invite_code
      })
        .then(data => {
          var url = "../musicTicket/musicTicket?concert_id=";
          wx.navigateTo({
            url: url + this.concert_id + "&id=" + this.id
          });
        })
        .catch(error => {
          this.error_msg = error.errors.invite_code[0];
        });
    },
    //当前用户的门票
    onUserAll() {
      userConcert({}, this.token).then(data => {
        this.calls = data.calls;
        this.userDetails = data;
        this.ticket_id = data.ticket_id;
        if (userDetails.concert.remaining_tickets > 0) {
          this.vipStatus = true;
        } else {
          this.vipStatus = true;
          this.noTicket = true;
        }
      });
    },
    //VIP码输入
    onChange(e) {
      var value = e.detail.value;
      this.keyWord = value;
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
    //分享好友
    onShare() {
      this.pickerShow = true;
    },
    onCancel() {
      this.pickerShow = false;
    },

    //分享朋友圈
    onPaint() {
      this.img = [];
      var a = "https://api.54qj.com/img/concert/poster.png";
      this.img.push(a);
      wx.previewImage({
        urls: this.img,
        success: res => {
        },
        fail: res => {
          wx.showModal({
            title: res,
            duration: 2000
          });
        }
      });
    }
  },
  onShareAppMessage: function(res) {
    if (res.from === "button") {
    }
    return {
      title: "帮我抢个票，我想看场免费的音乐节",
      path:
        "/pages/musicFestival/musicInvite/musicInvite?id=" +
        this.id +
        "&concert_id=" +
        this.concert_id +
        "&ticket_id=" +
        this.ticket_id,
      imageUrl:
        "http://qn.zhenwang.so//file/upload/20189/10/1539157052328xosck916"
    };
  }
};
</script>
<style scoped>
.miusicCallPage {
  background: url("http://qn.zhenwang.so//file/upload/20188/13/1536823013308jzsdqej7");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  flex-shrink: 0;
}
.miusicCallPage .addressBox {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0 0 12rpx;
}
.miusicCallPage .addressBox .address {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 136rpx;
  height: 54rpx;
  border-radius: 27rpx;
  background-color: rgba(0, 0, 0, 0.6);
}
.miusicCallPage .addressBox .address > img {
  width: 20rpx;
  height: 26rpx;
  font-size: 30rpx;
  margin-left: 15rpx;
}
.miusicCallPage .addressBox .address span {
  font-size: 24rpx;
  color: #fefefe;
  font-weight: 800;
  margin-left: 11rpx;
}
.miusicCallPage .addressBox .activityRule {
  margin-top: 10rpx;
  width: 96rpx;
  height: 76rpx;
  background-image: linear-gradient(#11c1a3, #11c1a3),
    linear-gradient(#2f1c59, #2f1c59);
  border-top-left-radius: 38rpx;
  border-bottom-left-radius: 38rpx;
}
.miusicCallPage .addressBox .activityRule > div {
  color: #007b63;
  font-size: 24rpx;
  width: 49rpx;
  height: 46rpx;
  margin-left: 34rpx;
  margin-top: 7rpx;
}
.miusicCallPage .VIPrule {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 33rpx;
  height: 76rpx;
}
.miusicCallPage .VIPrule > div {
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
.miusicCallPage .holdDetails {
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #ffffff;
  text-align: center;
}
.miusicCallPage .callImg {
  padding: 80rpx 55rpx;
  height: 367rpx;
  flex-shrink: 0;
  position: relative;
}
.miusicCallPage .callImg img {
  width: 100%;
  height: 100%;
}
.miusicCallPage .friendCall {
  width: 310rpx;
  height: 65rpx;
  flex-shrink: 0;
  position: absolute;
  top: 54rpx;
  left: 220rpx;
}
.miusicCallPage .friendCall img {
  width: 100%;
  height: 100%;
}
.miusicCallPage .callImg p {
  position: absolute;
  top: 130rpx;
  left: 169rpx;
  color: #e79198;
  font-size: 24rpx;
}
.miusicCallPage .progress {
  border-radius: 100rpx;
  position: absolute;
  top: 200rpx;
  left: 78rpx;
  width: 590rpx;
  height: 50rpx;
  box-sizing: border-box;
  background: url("http://qn.zhenwang.so//file/upload/20188/17/1537166372886aai0kjfu")
    no-repeat 100%;
}
.miusicCallPage .progress .progressSmall {
  background: url("http://qn.zhenwang.so//file/upload/20188/17/153716544064996o36e7n")
    no-repeat 100%;
  position: relative;
  height: 100%;
  flex: 1;
  border-radius: 100rpx;
}
.miusicCallPage .progress .further {
  width: 80rpx;
  height: 80rpx;
  color: #c96300;
  line-height: 80rpx;
  text-align: center;
  font-size: 22rpx;
  flex-shrink: 0;
  position: absolute;
  top: -12rpx;
  left: -40rpx;
  background: url("http://qn.zhenwang.so//file/upload/20188/17/1537165263714evhpotxy")
    no-repeat;
  background-size: 100%;
}
.miusicCallPage .inviteBox {
  padding-left: 25rpx;
  position: absolute;
  left: 55rpx;
  bottom: 40rpx;
  width: 82%;
}
.miusicCallPage .remaining {
  font-size: 24rpx;
  color: #999999;
}
.miusicCallPage .remaining > span {
  color: #f1a359;
}
.miusicCallPage .ticket {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 35rpx;
}
.miusicCallPage .ticket > div {
  background-color: #fecc34;
  border-radius: 26px 0px 0px 26px;
  color: #c96300;
  font-size: 24rpx;
  height: 52rpx;
  line-height: 52rpx;
  padding-left: 30rpx;
  padding-right: 23rpx;
}
.miusicCallPage .invite {
  width: 373rpx;
  height: 80rpx;
  flex-shrink: 0;
  margin-left: 110rpx;
}
.miusicCallPage .invite img {
  width: 100%;
  height: 100%;
}
.miusicCallPage .frameImg {
  padding: 20rpx 77rpx;
  height: 610rpx;
  flex-shrink: 0;
  position: relative;
}
.miusicCallPage .frameImg img {
  width: 100%;
  height: 100%;
}
.miusicCallPage .frameTab {
  display: flex;
  align-items: center;
  color: #e79198;
  font-size: 22rpx;
  position: absolute;
  top: 64rpx;
  left:235rpx;
}
.miusicCallPage .frameBox {
  display: flex;
  padding: 0 64rpx;
  justify-content: space-between;
  align-items: center;
  width: 448rpx;
}
.miusicCallPage .frameBox > div:nth-child(1) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.miusicCallPage .frameBox > div:nth-child(1) .avatarImg {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
  line-height: 30rpx;
  border-radius: 50%;
  position: relative;
}
.miusicCallPage .frameBox > div:nth-child(1) .avatarImg img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.miusicCallPage .frameBox > div:nth-child(1) p {
  color: #666666;
  font-size: 22rpx;
  margin-left: 15rpx;
  width: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.miusicCallPage .frameBox > div:nth-child(2) {
  color: #999999;
  font-size: 22rpx;
}
.miusicCallPage .frameBigBox {
  height: 540rpx;
  position: absolute;
  top: 111rpx;
  left: 83rpx;
  line-height: 50rpx;
}
/* VIP弹窗 */
.miusicCallPage .popupBox {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.miusicCallPage .popupBox > div {
  width: 68%;
  background-color: #fff;
  position: absolute;
  top: 40%;
  left: 15%;
  border-radius: 8rpx;
  transform: translateY(-50%);
}
.miusicCallPage .popupBox .verification {
  height: 70rpx;
  background-color: #f1eeff;
  border-radius: 35rpx;
}
.miusicCallPage .popupBox .usageBox {
  padding: 85rpx 70rpx;
  line-height: 50rpx;
  position: relative;
}
.miusicCallPage .popupBox .verification input {
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
.miusicCallPage .popupBox .usage {
  position: absolute;
  top: 150rpx;
  /* left: 136rpx; */
  width: 72%;
  /* background-color: pink; */
}
.miusicCallPage .popupBox .usage div {
  text-align: center;
  color: #ff5858;
  font-size: 22rpx;
}
.miusicCallPage .popupBox .confirm {
  height: 96rpx;
  color: #301c5a;
  font-size: 32rpx;
  text-align: center;
  line-height: 96rpx;
  border-top: 1rpx solid #d2d3d5;
}
.miusicCallPage .popupBox .closeVIP,
.miusicCallPage .rulePopups .closeRule {
  position: absolute;
  bottom: -80rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}
.miusicCallPage .popupBox .closeVIP img,
.miusicCallPage .rulePopups .closeRule img {
  width: 100%;
  height: 100%;
}
/* 门票领取成功 */
.miusicCallPage .successTicket {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.miusicCallPage .successTicket > div {
  width: 70%;
  background-color: #fff;
  border-radius: 8rpx;
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
}
.miusicCallPage .successTicket > div > div:nth-child(1) {
  color: #333333;
  font-size: 34rpx;
  text-align: center;
  padding: 104rpx 0;
}
.miusicCallPage .successTicket > div > div:nth-child(2) {
  color: #301c5a;
  font-size: 32rpx;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  border-top: 1rpx solid #d2d3d5;
}
/* 活动规则弹窗 */
.miusicCallPage .rulePopups {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.miusicCallPage .rulePopups > div {
  width: 80%;
  background-color: #fff;
  border-radius: 8rpx;
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  padding-bottom: 20rpx;
}
.miusicCallPage .rulePopups > div > h3 {
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 70rpx;
  color: #333333;
}
.miusicCallPage .rulePopups .content {
  padding: 0rpx 30rpx;
  font-size: 24rpx;
  color: #999;
  line-height: 40rpx;
}
.miusicCallPage .rulePopups .content > h5 {
  color: #301c5a;
  font-size: 28rpx;
  margin-top: 15rpx;
}
.miusicCallPage .rulePopups .content > div {
  font-size: 24rpx;
  color: #999;
}
/* 分享弹窗 */
.miusicCallPage .sharePopus {
  position: fixed;
  z-index: 12;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.miusicCallPage .sharePopus div {
  width: 100%;
  position: absolute;
  bottom: 0rpx;
  background-color: #f5f5f5;
}
.miusicCallPage .sharePopus > div .classPopus {
  background-color: transparent;
  background-color: #fff;
  font-size: 32rpx;
  color: #333333;
  display: block;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
}
.miusicCallPage .sharePopus > div .classPopus:nth-child(2) {
  border-top: 1rpx solid #f5f5f5;
}
.miusicCallPage .sharePopus > div .classPopus:after {
  border: none;
}
.miusicCallPage .sharePopus > div .classPopus:nth-child(3) {
  margin-top: 18rpx;
}
</style>
