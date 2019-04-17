<template>
  <div class="musicPage">
    <div class="holdDetails">
      <div>举办时间：{{concertDetails.start_at}}</div>
      <div>举办地址：{{concertDetails.address}}</div>
    </div>
    <div class="callImg">
      <img :src="url+'/img/default/BoostBg@2x.png'" alt="">
      <div class="contentBox">
        <div><span>{{ticketsList.realname}}</span>正在奇集免费领取门票</div>
        <div>为 TA 打Call吧</div>
        <!-- 默认 -->
        <div v-if="callStatus">
          <div class="state processing" @click="doCall">
            <span>Call</span>
          </div>
          <div class="state free" @click="onSee">
            <span>免费拿门票</span>
          </div>
        </div>
        <!-- 没票 2 -->
        <div  v-if="ticketsStatus">
          <div class="state end">
            <span>已经没票啦</span>
          </div>
          <div class="state free" @click="onSee">
            <span>去看看</span>
          </div>
        </div>
        <!-- 有票 3 -->
        <div v-if="okStatus">
          <div class="state end" @click="onSuccess">
            <span>打Call成功</span>
          </div>
          <div class="state free" @click="onSee">
            <span>去看看</span>
          </div>
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
        <img src="/static/images/avatar.png" alt="">
      </div>
      <div class="avatarImg">
        <img src="/static/images/avatar.png" alt="">
      </div>
      <div class="avatarImg">
        <img src="/static/images/avatar.png" alt="">
      </div>
    </div>
    <div class="avatarTitle">
      <div>敬请期待参与的明星阵容</div>
      <div>主办方：香港演艺界内地发展协进会</div>
    </div>
  </div>
</template>
<script>
import {
  isCalls,
  operatingCall,
  ticketsDetails,
  musicConcert
} from "@/utils/api";
export default {
  data() {
    return {
      token: " ",
      callStatus: true,
      userDetails: [], //打call
      concerts: [],
      ticketsStatus: false, //无票
      okStatus: false, //打call成功
      ticketsList: [],
      concertDetails: []
    };
  },
  mounted() {
    if (this.token == " ") {
      this.token += wx.getStorageSync("silentlogin").token;
    } else {
      this.token = " " + wx.getStorageSync("silentlogin").token;
    }
    this.unionid = wx.getStorageSync("silentlogin").unionid;
    this.onTicketsAll();
    this.pageData();
    // this.onCalls();
  },
  onLoad: function(options) {
    this.id = options.id;
    this.concert_id = options.concert_id;
    this.ticket_id = options.ticket_id;
  },
  // onShow() {
  //   if (this.okStatus === true) {
  //     this.callStatus = false;
  //   }
  // },
  methods: {
    //场次详情
    pageData() {
      musicConcert(this.concert_id, {}, this.token).then(data => {
        this.concertDetails = data;
      });
    },
    // 已领取门票的详情
    onTicketsAll() {
      ticketsDetails(
         this.id,
        {},
        this.token
      ).then(data => {
        this.ticketsList = data;
        this.id = data.uuid;
        this.ticket_id = data.ticket_id;
      });
    },
    //打call操作
    doCall() {
      operatingCall(this.id, this.token, {
        unionid: this.unionid,
        ticket_id: this.ticket_id
      }).then(data => {});
      this.okStatus = true;
      this.callStatus = false;
    },
    //判断是否打 call
    onCalls() {
      isCalls(this.id, this.token, {
        unionid: this.unionid
      }).then(data => {
        this.iscalls = data;
        if ((this.okStatus = true)) {
          this.callStatus = false;
        }
      });
    },
    onSee() {
      var url = "../musicHome/musicHome?concert_id=";
      wx.navigateTo({
        url: url + this.concert_id + "&id=" + this.id
      });
    },
    onSuccess() {
      isCalls(this.id, this.token).then(data => {
        this.iscalls = data;
        // if (this.iscalls = 1) {
        this.okStatus = true;
        // }
      });
    }
  }
};
</script>
<style scoped>
.musicPage {
  background: url("http://qn.zhenwang.so//file/upload/20188/13/1536823013308jzsdqej7");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  flex-shrink: 0;
  height: 100vh;
}
.musicPage .holdDetails {
  padding-top: 220rpx;
  font-size: 24rpx;
  color: #ffffff;
  text-align: center;
}
.musicPage .callImg {
  padding: 35rpx 55rpx;
  height: 367rpx;
  flex-shrink: 0;
  position: relative;
}
.musicPage .callImg img {
  width: 100%;
  height: 100%;
}
.musicPage .contentBox {
  height: 354rpx;
  position: absolute;
  top: 45rpx;
  left: 145rpx;
  line-height: 80rpx;
  width: 468rpx;
}
.musicPage .contentBox > div:nth-child(1) {
  text-align: center;
  color: #333333;
  font-size: 36rpx;
  font-weight: 800;
  width: 468rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.musicPage .contentBox > div:nth-child(2) {
  text-align: center;
  color: #333333;
  font-size: 30rpx;
}
.musicPage .contentBox .state {
  white-space: nowrap;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 15rpx;
  border-radius: 40rpx;
  font-size: 36rpx;
  color: #ffffff;
}
.musicPage .contentBox .state.end {
  color: #fff;
  background-color: #b9b9b9;
}
.musicPage .contentBox .state.processing {
  background-color: #ff8915;
  color: #ffffff;
}
.musicPage .contentBox .state.free {
  background-color: #f3b219;
  color: #ffffff;
  margin-top: 14rpx;
}
.musicPage .description {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #aab5eb;
  padding: 0 50rpx;
}
.musicPage .contentImg {
  width: 355rpx;
  height: 72rpx;
  flex-shrink: 0;
  margin: 30rpx auto;
}
.musicPage .contentImg img {
  width: 100%;
  height: 100%;
}
.musicPage .avatarBox {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  margin: 0 10%;
}
.musicPage .avatarBox .avatarImg {
  width: 164rpx;
  height: 164rpx;
  flex-shrink: 0;
}
.musicPage .avatarBox .avatarImg img {
  width: 100%;
  height: 100%;
}
.musicPage .avatarTitle {
  margin-top: 5rpx;
  font-size: 28rpx;
  color: #aab5eb;
  text-align: center;
}
</style>
