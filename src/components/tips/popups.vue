<template>
  <!-- 首次进入弹窗指引（首页） -->
  <div class='first_popup'>
    <div>
      <div class='firstBox'>
        <div class="firstImg"><img :src="url+'/img/2.0/update_prompt.jpg  '" alt=""> <i class="iconfont icon-Popups-close " @click="iKnow"></i></div>
        <div class="rulse">
          亲爱的奇集同学们，奇集进行了一次“大变身”以前的社长同学需要前往【奇集社团】的小程序进行社团管理
        </div>
        <form report-submit="true" @submit="iKnow">
          <button form-type="submit" class="iknow">我知道了</button>

        </form>
        <form report-submit="true" @submit="going">
          <button form-type="submit" class="going">前往奇集社团</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
export default {
  data() {
    return {
      url: common.url
    };
  },
  methods: {
    iKnow(e) {
      console.log("我知道了");
      if (common.status == "dev") {
        wx.reportAnalytics("update_layer", {
          layer_button: "我知道了"
        });
      }
      if (e) {
        formId(e);
      }
      this.$emit("firstShowAction", "");
    },
    //跳转奇集社团小程序
    going(e) {
      // wx.navigateToMiniProgram({
      //   appId: "", // 要跳转的小程序的appid
      //   path: "", // 跳转的目标页面
      //   extarData: {
      //     foo: "bar"
      //   },
      //   envVersion: "develop",
      //   success(res) {
      //     console.log("成功");
      //   }
      // });
      if (common.status == "dev") {
        wx.reportAnalytics("update_layer", {
          layer_button: "前往奇集社团"
        });
      }
      if (e) {
        formId(e);
      }
      this.$emit("going", "");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/icon.css";
.first_popup {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}
.first_popup .firstBox {
  width: 88%;
  position: absolute;
  background-color: white;
  top: 50%;
  left: 6%;
  transform: translateY(-50%);
}

.first_popup .firstBox {
  height: 695rpx;
  border-radius: 20rpx;
  .rulse {
    padding: 59rpx 90rpx;
    color: #333;
    font-size: 28rpx;
    line-height: 42rpx;
  }
  .iknow,
  .going {
    background-color: transparent;
    background-color: #ffb90c;
    width: 360rpx;
    height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #fff;
    line-height: 80rpx;
    &::after {
      border: none;
    }
  }
  .going {
    background-color: #f6f6f6;
    color: #ffb20b;
    margin-top: 20rpx;
  }
}
.first_popup .firstBox .firstImg {
  position: relative;
  height: 240rpx;
  i {
    position: absolute;
    top: 31rpx;
    right: 31rpx;
    color: #fff;
    font-size: 22rpx;
  }
}
.first_popup .firstBox image {
  width: 100%;
  height: 240rpx;
  flex-shrink: 0;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}
</style>
