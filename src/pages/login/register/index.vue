<template>
  <div class="register">
    <div class="mobile">
      <div class="input">
        <input type="number" class="in" @focus="mobileFocu" @blur="mobileBlu" v-model="phoneNumber" maxlength="11">
        <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" alt="" v-show="phoneNumber" @click="clear">
        <div class="phoneNumber" v-show="mobileFocus">
          <text class="phoneText">请输入手机号码</text>
        </div>
        <div class="phoneTips" v-show="mobileTips">
          <text class="tipsText">{{phoneMsg}}</text>
        </div>
        <!-- <div class="code" @click="test" v-show="!requireTips">
          <span></span>
          <text class="codeText" :class="yellow">发送验证码</text>
        </div> -->
        <!-- <div class="time" v-show="requireTips">
          <span>剩余{{seconds}}秒</span>
        </div> -->
      </div>
    </div>

    <div class="require">
      <div class="input">
        <input type="number" class="in" @focus="requireFocu" @blur="requireBlu" v-model="requireNumber" maxlength="6">
        <div class="requireNumber" v-show="requireFocus">
          <text class="requireText">请输入验证码　</text>
        </div>
        <div class="code" @click="test" v-show="!requireTips">
          <span></span>
          <text class="codeText" :class="yellow">发送验证码</text>
        </div>
        <div class="time" v-show="requireTips">
          <span>剩余{{seconds}}秒</span>
        </div>
      </div>
      <div class="requireTips" v-show="requireTrue">
        <text>{{msg}}</text>
      </div>
    </div>

    <div class="next" @click="toNext" :class="btnBg">
      <span>下一步</span>
    </div>

    <div class="agree">
      <p>点击下一步即视为同意<span @click="toProtocol">《奇集用户协议》</span></p>
    </div>
  </div>

</template>
<script>
import url from "@/utils/common";
import { verifycode, register, silentlogin } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      mobileFocus: true,
      requireFocus: true,
      phoneNumber: "",
      phoneReg: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
      mobileTips: false,
      requireNumber: "",
      requireTips: false, //发送验证码倒计时
      seconds: "",
      timer: null,
      toastShow: false,
      msg: "", //注册时错误信息
      phoneMsg: "", //手机号码错误时的提示信息
      unionid: "",
      requireTrue: false, //输入验证码是否正确
      correct: false //激活发送验证码按钮(颜色)
    };
  },
  beforeMount() {},
  computed: {
    btnBg() {
      if (this.phoneNumber.length == 11 && this.requireNumber.length >= 4) {
        return "";
      } else {
        return "btnBg";
      }
    },
    yellow() {
      if (this.phoneNumber.length == 11) {
        return "yellow";
      } else {
        return "";
      }
    }
  },
  onLoad() {
    this.phoneNumber = "";
    this.requireNumber = "";
    this.requireTips = false;
  },
  onShow() {
    var token = " ";
    if (wx.getStorageSync("token")) {
      token += wx.getStorageSync("token");
      wx.redirectTo({
        url: "./schoolInfo/index"
      });
    } else if (wx.getStorageSync("silentlogin").token) {
      token += wx.getStorageSync("silentlogin").token;
      console.log("有token，注册过了");
      wx.redirectTo({
        url: "./schoolInfo/index"
      });
    }
    this.mobileTips = false;
    var value = wx.getStorageSync("silentlogin"); //静默登录返回的用户信息
    this.unionid = value.unionid;
    var userInfo = wx.getStorageSync("userInfo"); //用户登录授权信息
    var token = wx.getStorageSync("token");
  },
  methods: {
    clear() {
      this.phoneNumber = "";
    },
    test() {
      var that = this;
      let phone = { phone: Number(this.phoneNumber) };
      verifycode(phone)
        .then(function(res) {
          that.requireTips = true;
          that.daojishi(); //执行倒计时
          that.toastShow = true;
          that.mobileTips = false;
          that.msg = res.message;
        })
        .catch(error => {
          that.toastShow = true;
          that.phoneMsg = error.errors.phone[0];
          that.mobileTips = true;
        });
      setTimeout(() => {
        that.toastShow = false;
      }, 1500);
    },
    daojishi() {
      this.seconds = 60;
      this.timer = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.requireTips = false;
        }
      }, 1000);
    },
    mobileFocu() {
      this.mobileFocus = false;
      this.mobileTips = false;
    },
    mobileBlu() {
      // this.phoneNumber.match(this.phoneReg)
      //   ? ((this.mobileTips = false), (this.correct = true))
      //   : ((this.mobileTips = true),
      //     (this.phoneNumber = ""),
      //     (this.correct = false));
      this.phoneNumber == ""
        ? (this.mobileFocus = true)
        : ((this.mobileFocus = false), (this.mobileTips = false));
    },
    requireFocu() {
      this.requireFocus = false;
      this.requireTrue = false;
    },
    requireBlu() {
      this.requireNumber == ""
        ? (this.requireFocus = true)
        : ((this.requireFocus = false), (this.requireTrue = false));
    },
    toProtocol() {
      wx.navigateTo({
        url: "./protocol"
      });
    },
    toNext() {
      if (url.status == "dev") {
        wx.reportAnalytics("perfect_information_step", {
          step: "第一步"
        });
      }
      var that = this;
      if (!wx.getStorageSync("silentlogin")) {
        wx.navigateTo({
          url: "/pages/login/shouquan/shouquan"
        });
      }
      this.unionid = wx.getStorageSync("silentlogin").unionid;
      var data = {
        phone: this.phoneNumber,
        verify_code: this.requireNumber,
        unionid: this.unionid
      };
      if (this.phoneNumber.length == 11 && this.requireNumber.length >= 4) {
        register(data)
          .then(function(res) {
            that.toastShow = false;
            var silentMsg = wx.getStorageSync("silentlogin");
            silentMsg.token = res.access_token;
            silentMsg.user_id = res.user_id;
            silentMsg.refresh_token = res.refresh_token;
            wx.setStorageSync("silentlogin", silentMsg);
            // setTimeout(() => {
            wx.redirectTo({
              url: "./schoolInfo/index"
            });
            // }, 500);
          })
          .catch(error => {
            if (error.errors.verify_code) {
              that.msg = error.errors.verify_code[0];
            } else if (error.errors.verification_code) {
              that.msg = error.errors.verification_code[0];
              that.requireTrue = true;
            } else if (error.errors.phone) {
              that.mobileTips = true;
              that.phoneMsg = error.errors.phone[0];
            } else if (error.errors.unionid) {
              that.msg = error.errors.unionid[0];
              wx.showModal({
                title: "提示",
                content: that.msg
              });
            }
            that.toastShow = true;
            setTimeout(() => {
              that.toastShow = false;
            }, 1500);
          });
      }
    }
  }
};
</script>
<style scoped>
.mobile {
  padding: 86rpx 40rpx 0;
}
.mobile .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.mobile .input .closeIcon {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 26rpx;
  height: 26rpx;
}
.mobile .in {
  width: 62%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  color: #331900;
  padding-left: 40rpx;
  font-size: 28rpx;
  padding-right: 100rpx;
}
.mobile .phoneNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
.phoneTips {
  margin-left: 40rpx;
  font-size: 28rpx;
  color: #ff4c5b;
}
.mobile .tipsText {
  color: #ff4c5b;
}

.require {
  padding: 86rpx 40rpx 0;
}
.require .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.require .time {
  position: absolute;
  top: 26rpx;
  right: 51rpx;
  font-size: 28rpx;
  color: #ccc7b8;
}
.require .in {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
}
.require .requireNumber {
  position: absolute;
  width: 196rpx;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
.require .requireTips {
  font-size: 28rpx;
  color: #ff4c5b;
  margin-left: 40rpx;
}
.require .code {
  position: absolute;
  top: 30%;
  font-size: 28rpx;
  color: #ccc7b8;
  right: 39rpx;
  z-index: 5;
}
.require .code .yellow {
  color: #ffb90c;
}
.require .code span {
  display: inline-block;
  position: absolute;
  width: 1px;
  height: 28rpx;
  background: #d9d9d9;
  top: 16%;
  right: 160rpx;
}

.next {
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  text-align: center;
  margin: 180rpx 40rpx 0;
  line-height: 88rpx;
}
.next span {
  font-size: 28rpx;
  color: #331900;
}

.showBox {
  text-align: center;
  width: 100%;
  position: fixed;
  top: 600rpx;
}
.show {
  background: #000;
  opacity: 0.6;
  color: #fff;
  border-radius: 8rpx;
  font-size: 24rpx;
  line-height: 50rpx;
  display: inline-block;
  padding: 0 10rpx;
  margin-left: auto;
}

.agree {
  width: 100%;
  position: fixed;
  bottom: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999999;
  margin: 0 auto;
}
.agree span {
  color: #576b95;
}

.btnBg {
  opacity: 0.3;
}
</style>
