<template>
  <div class="tipsPage">
    <div class="tips" v-for="(item,index) of activitiesInfo " :key="index">
      <div class="tipsBox" @click="onJump(item)">
        <div>{{item.title}}</div>
        <div class="tipsTime">
          <span>{{item.activityTime}}：{{item.enrol_start_at}}</span>
          <span>{{item.remind}}</span>
        </div>
      </div>
    </div>
    <!-- 暂无数据 -->
    <div class="default" v-if="activitiesInfo.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import { activitiesEvent } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      current_page: 1,
      pagesize: 10,
      activitiesInfo: []
    };
  },

  mounted() {
    this.pageData();
  },
  onLoad() {
    this.current_page = 1;
    this.activitiesInfo = [];
  },
  //页面上拉触底事件的处理函数
  onReachBottom: function() {
    this.pageData();
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.pageData();
  },
  methods: {
    pageData() {
      activitiesEvent({
        page: this.current_page,
        pagesize: this.pagesize
      }).then(data => {
        // if (data.data.length <= data.meta.per_page && data.data.length > 0) {
          this.current_page++;
          this.activitiesInfo = this.activitiesInfo.concat(data.data);
          this.activitiesInfo.map((index, item) => {
            if (index.act_type == 5) {
              index.activityTime = "报名时间";
            } else {
              index.activityTime = "活动时间";
            }
            if (index.status == 20 || index.status == 40) {
              index.remind = "已添加日程提醒";
            } else if (index.status == 50) {
              index.remind = "活动已结束";
            }
          });
        // } else {
        //   wx.showToast({
        //     title: "没有更多了",
        //     icon: "none"
        //   });
        //   return;
        // }
      });
    },
    //跳转到详情页
    onJump(el) {
      //1 社团活动 2 招聘活动 3 学术活动 4 竞赛活动 5考研
      if (el.act_type === 1) {
        wx.navigateTo({
          url:
            "/packageA/activity/clubActivitys/clubActivitys?act_id=" + el.act_id
        });
      } else if (el.act_type === 2) {
        wx.navigateTo({
          url:
            "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" +
            el.act_id
        });
      } else if (el.act_type === 3) {
        wx.navigateTo({
          url:
            "/packageA/activity/academicEvents/academicDetails?act_id=" +
            el.act_id
        });
      } else if (el.act_type === 4) {
        wx.navigateTo({
          url:
            "/packageA/activity/competitionActivity/competitionDetails?act_id=" +
            el.act_id
        });
      } else if (el.act_type === 5) {
        wx.navigateTo({
          url: "/packageA/activity/graduate/graduate?act_id=" + el.act_id
        });
      }
    }
  },
  //分享好友
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
.tipsPage {
  background-color: #f5f5f5;
  height: 100%;
  padding-top: 10rpx;
  .tips {
    margin: 10rpx 20rpx;
    border-radius: 8rpx;
    .tipsBox {
      padding: 20rpx;
      border: 2prx solid #e6e6e6;
      background-color: #fff;
      border-radius: 8rpx;
      > div:nth-child(1) {
        color: #333333;
        font-size: 32rpx;
        font-weight: 800;
        overflow: hidden;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        line-height: 48rpx;
      }
      .tipsTime {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;
        span {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }
  }
  .default {
    text-align: center;
    margin-top: 280rpx;
    height: 100vh;
    background-color: #f5f5f5;
    img {
      width: 300rpx;
      height: 300rpx;
    }
    p {
      font-size: 26rpx;
      color: #999999;
      margin-top: 10rpx;
    }
  }
}
</style>

