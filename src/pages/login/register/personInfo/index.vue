<template>
  <div class="person">
    <div class="photo">
      <div class="photo-item" :data-index="0" @click="getSex">
        <img v-if="index==1" src="http://54qj.54qn.cn/Public/images/register/boy.png" alt="">
        <img v-else :src="url+'/img/default/boy_user_avatar.png'" alt="">
        <text>男生</text>
      </div>
      <div class="photo-item" :data-index="1" @click="getSex">
        <img v-if="index==2" :src="url+'/img/default/girl.png'" alt="">
        <img v-else :src="girlAvatar" alt="">
        <text>女生</text>
      </div>
    </div>

    <div class="input">
      <input type="text" class="in" @focus="personFocu" @blur="personBlu" v-model="personName" minlength="2" maxlength="6">
      <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" alt="" v-show="personName" @click="clear">
      <div class="personNumber" v-show="personFocus">
        <text class="personText">请输入姓名</text>
      </div>
    </div>

    <div class="next" @click="toIndex" :class="btnBg">
      <span>确认</span>
    </div>
    <p class="tips">请输入你的真实姓名，以便奇集为你提供更好的服务</p>
  </div>
</template>
<script>
import url from "@/utils/common"
import { user } from "@/utils/api";
export default {
  data() {
    return {
      url:url.url,
      registerStatus: "",
      personFocus: true,
      personName: "",
      index: 1,
      boyAvatar:url.url+'/img/default/boy_user_avatar.png',
      girlAvatar:url.url+'/img/default/girl_user_avatar.png',
      person: [
        {
          photo: "http://54qj.54qn.cn/Public/images/register/boy.png",
          text: "男生"
        },
        {
          photo: "http://54qj.54qn.cn/Public/images/register/girl.png",
          text: "女生"
        }
      ]
    };
  },
  computed: {
    btnBg() {
      if (this.personName.length >= 2) {
        return "";
      } else {
        return "btnBg";
      }
    }
  },
  onLoad() {
    this.registerStatus = wx.getStorageSync("registerStatus");
  },
  updated() {},
  methods: {
    clear(){
      this.personName = ""
    },
    personFocu() {
      this.personFocus = false;
    },
    personBlu() {
      this.personName == ""
        ? (this.personFocus = true)
        : (this.personFocus = false);
    },
    getSex(e) {
      var index = Number(e.currentTarget.dataset.index) + 1;
      this.index = index;
    },
    toIndex() {
      if (url.status == "dev") {
        wx.reportAnalytics("perfect_information_step", {
          step: "第三步"
        });
      }
      if (this.personName.length >= 2) {
        let data = {
          realname: this.personName,
          sex: this.index
        };
        var token = " ";
        token += wx.getStorageSync("silentlogin").token;
        user(data, token).then(function(res) {
        });
        wx.reLaunch({
          url: "../../../index/index"
        });
      }
    },
    toBuild() {
      if (this.personName.length >= 2) {
        let data = {
          realname: this.personName,
          sex: this.index
        };
        var token = " ";
        token += wx.getStorageSync("silentlogin").token;
        user(data, token).then(function(res) {
        });
        wx.navigateTo({
          url: "/pages/mine/buildClub/index"
        });
      }
    }
  }
};
</script>
<style scoped>
.photo {
  padding: 86rpx 135rpx 0;
  overflow: hidden;
}
.photo .photo-item {
  width: 160rpx;
  text-align: center;
  float: left;
  margin: 0 40rpx;
}
.photo .photo-item img {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}
.photo .photo-item text {
  font-size: 34rpx;
  color: #331900;
  display: block;
}
.person .input {
  width: 675rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin: 80rpx 40rpx 40rpx;
}
.person .in {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
  padding-right: 100rpx;
}
.person .closeIcon{
  position: absolute;
  top:30rpx;
  right: 30rpx;
  width:26rpx;
  height: 26rpx;
  z-index: 5;
}
.person .personNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
.next {
  /* position: fixed;
  bottom: 98rpx; */
  margin-top: 20rpx;
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
  margin: 0 40rpx;
}
.next span {
  font-size: 28rpx;
  color: #331900;
}
.toIndex{
  text-align: center;
  font-size: 24rpx;
  color:#cccccc;
  margin-top:22rpx;
}

.tips{
  position: fixed;
  bottom:36rpx;
  font-size: 24rpx;
  text-align: center;
  color:#999999;
  width: 100%;
}

.btnBg {
  opacity: 0.3;
}
</style>

