<template>
  <div class="ticketPage">
    <div class="addressBox">
      <div class="address">
        <img :src="url+'/img/default/address.png'" alt="">
        <span>{{concertDetails.name}}</span>
      </div>
    </div>
    <div class="description">
      大湾区音乐巡演，大咖云集,还有你们的校园爱豆，确定不来看看吗？王祖蓝等明星强势助阵!
    </div>
    <div class="callImg">
      <img :src="url+'/img/default/BoostBg@2x.png'" alt="">
      <div class="friendCall">
        <img src="/static/images/ticketBut.png" alt="">
      </div>
      <div class="QRcode">
        <img :src="qrcode" alt="">
      </div>
      <div class="userImg">
        <img src="/static/images/user_icon@2x.png" alt=""  v-if="userStatus">
      </div>
      <div class="time">
        <div>使用时间：{{concertDetails.start_at}}</div>
        <div>举办地址：{{concertDetails.address}}</div>
      </div>
    </div>
    <div class="commentary">
      <p>使用说明：</p>
      <p>1、门票仅限一人使用一次，不可重复使用；</p>
      <p>2、凭电子票入场，此票仅限大湾区音乐巡演入场使用，不含（抵）其它消费；</p>
      <p>3.、音乐巡演为公益活动，未经主办方同意，门票不可作为商业性质；</p>
      <p>4、此票最终解释权归奇集所有。</p>
    </div>
    <div class="showButton" @click="pickerShow=true">
      <img src="/static/images/showOff.png" alt="">
    </div>
    <!-- 分享弹窗 -->
      <div class="sharePopus" v-if="pickerShow"  @click="pickerShow=false">
        <div>
          <button class="classPopus" open-type="share">分享给好友</button>
          <span class="classPopus"  @click="onPaint">分享到朋友圈</span>
          <span class="classPopus"  @click="pickerShow=false">取消</span>
        </div>
      </div>
  </div>
</template>
<script>
import { musicConcert, musicPoster, userConcert } from "@/utils/api";
import url from "@/utils/common";
export default {
  data() {
    return {
      pickerShow: false,
      concertDetails: [],
      token: " ",
      userStatus: false,
      posterImg: [],
      url: url.url,
      qrcode:""
    };
  },
  mounted() {
    console.log(this.token == " ");
    if (this.token == " ") {
      this.token += wx.getStorageSync("silentlogin").token;
    } else {
      this.token = " " + wx.getStorageSync("silentlogin").token;
    }
    this.pageData();
    this.onUserAll();
    // // setTimeout(function() {
    //   wx.hideLoading();
    //   wx.navigateTo({
    //     url: "/pages/musicFestival/musicHome/musicHome"
    //   });
    // // }, 5000);
  },
  onLoad: function(options) {
    console.log(options);
    this.concert_id = options.concert_id;
    this.id = options.id;
    this.ticket_id = options.ticket_id;
    console.log(this.ticket_id);
  },
  methods: {
    //场次详情
    pageData() {
      musicConcert(this.concert_id, this.token).then(data => {
        this.concertDetails = data;
      });
    },
    //分享朋友圈
    onPaint() {
      console.log(1);
      this.posterImg = [];
      musicPoster({}, this.token)
        .then(res => {
          this.posterImg.push(this.url + res.path);
          wx.previewImage({
            urls: this.posterImg,
            success: res => {
              console.log("成功");
              console.log(res);
            },
            fail: res => {
              console.log(res);
              wx.showToast({
                title: res,
                duration: 2000
              });
            }
          });
        })
        .catch(err => {});
    },
    //当前用户的门票
    onUserAll() {
      userConcert({}, this.token).then(data => {
        console.log(data, 220);
        this.id = data.uuid;
        this.qrcode =this.url + data.qrcode;
        console.log(this.qrcode,122)
        console.log(this.id);
        this.concerts = data.concerts;
        this.userDetails = data;
        if (userDetails.is_check == 1) {
          this.userStatus = true;
        }
      });
    }
   },
  //分享好友
  onShareAppMessage(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "音乐节门票",
      query:
        "/pages/musicFestival/musicTicket/musicTicket?concert_id=" +
        this.concert_id,
      imageUrl:
        "http://qn.zhenwang.so//file/upload/20189/10/1539157130574mbbpvtf1"
    };
  }
};
</script>
<style scoped>
.ticketPage {
  background: url("http://qn.zhenwang.so//file/upload/20188/18/1537270435004vqrmj48v");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  min-height: 100vh;
  flex-shrink: 0;
}
.ticketPage .addressBox {
  display: flex;
  justify-content: space-between;
  padding-top: 10rpx;
}
.ticketPage .addressBox .address {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 136rpx;
  height: 54rpx;
  border-radius: 27rpx;
  background-color: rgba(0, 0, 0, 0.6);
}
.ticketPage .addressBox .address > img {
  width: 20rpx;
  height: 26rpx;
  font-size: 30rpx;
  margin-left: 15rpx;
}
.ticketPage .addressBox .address span {
  font-size: 24rpx;
  color: #fefefe;
  font-weight: 800;
  margin-left: 11rpx;
}
.ticketPage .description {
  margin-top: 313rpx;
  font-size: 26rpx;
  color: #aab5eb;
  padding: 0 98rpx;
}
.ticketPage .callImg {
  /* padding: 80rpx 55rpx; */
  margin: 0 auto;
  width: 534rpx;
  height: 388rpx;
  flex-shrink: 0;
  position: relative;
  padding: 40rpx 0;
}
.ticketPage .callImg img {
  width: 100%;
  height: 100%;
}
.ticketPage .friendCall {
  width: 240rpx;
  height: 65rpx;
  flex-shrink: 0;
  position: absolute;
  top: 18rpx;
  left: 150rpx;
}
.ticketPage .friendCall img {
  width: 100%;
  height: 100%;
}
.ticketPage .QRcode {
  /* background-color: pink; */
  width: 228rpx;
  height: 228rpx;
  flex-shrink: 0;
  position: absolute;
  top: 88rpx;
  left: 150rpx;
}
.ticketPage .userImg {
  width: 197rpx;
  height: 162rpx;
  flex-shrink: 0;
  position: absolute;
  top: 150rpx;
  right: 50rpx;
}
.ticketPage .userImg img {
  width: 100%;
  height: 100%;
}
.ticketPage .time {
  position: absolute;
  bottom: 76rpx;
  /* left: 65rpx; */
  width: 100%;
}
.ticketPage .time div {
  text-align: center;
  font-size: 22rpx;
  color: #301e57;
}
.ticketPage .commentary {
  width: 524rpx;
  /* height: 233rpx; */
  color: #7882af;
  font-size: 22rpx;
  padding: 0 98rpx;
}
.ticketPage .showButton {
  width: 660rpx;
  height: 90rpx;
  flex-shrink: 0;
  padding: 20rpx 45rpx;
}
.ticketPage .showButton img {
  width: 100%;
  height: 100%;
}
/* 分享弹窗 */
.ticketPage .sharePopus {
  position: fixed;
  z-index: 12;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.ticketPage .sharePopus div {
  width: 100%;
  position: absolute;
  bottom: 0rpx;
  background-color: #f5f5f5;
}
.ticketPage .sharePopus > div .classPopus {
  background-color: transparent;
  background-color: #fff;
  font-size: 32rpx;
  color: #333333;
  display: block;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
}
.ticketPage .sharePopus > div .classPopus:nth-child(2) {
  border-top: 1rpx solid #f5f5f5;
}
.ticketPage .sharePopus > div .classPopus:after {
  border: none;
}
.ticketPage .sharePopus > div .classPopus:nth-child(3) {
  margin-top: 18rpx;
}
</style>
