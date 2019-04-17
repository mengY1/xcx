<template>
  <div class="collectPage">
    <block v-for="(item,index) of collectionInfo " :key="index" :data-index='index'>
      <!-- 无图 -->
      <div class="collect" v-if="item.banner.length ===0">
        <div class="collextBox">
          <div class="content" @click="onJump(item.collect_id)">
            <div>{{item.title}}</div>
            <p>{{item.publisher}} &nbsp;&nbsp; {{item.publish_at}}</p>
          </div>
          <div class="iconBox">
            <!-- @click="onCancel($event,item.collect_id)" -->
            <i class="iconfont icon-Collection-on-" style="color: #FFC71D;" ></i>
            <button open-type='share' :data-type="item.type" :id="item.foreign_id" :data-title="item.title"><i class="iconfont icon-share-big"></i></button>
          </div>
        </div>
      </div>
      <!-- 有图 -->
      <div class="collect" v-if="item.banner.length >0">
        <div class="collextBox">
          <div class="collectImg" @click="onJump(item.collect_id)"><img :src="url+item.banner[0]" alt=""></div>
          <div class="content contentW" @click="onJump(item.collect_id)">
            <div>{{item.title}}</div>
            <p>{{item.publisher}} &nbsp;&nbsp; {{item.publish_at}}</p>
          </div>
          <div class="iconBox">
            <!-- @click="onCancel($event,item.collect_id)" -->
            <i class="iconfont icon-Collection-on-" style="color: #FFC71D;"></i>
            <button open-type='share' :data-type="item.type" :id="item.foreign_id" :data-title="item.title"><i class="iconfont icon-share-big"></i></button>
          </div>
        </div>
      </div>
    </block>
    <!-- 暂无数据 -->
    <div class="default" v-if="collectionInfo.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import {
  collectionList,
  collectionDetail,
  cancelCollection
} from "@/utils/api";
import { shareMsg } from "@/utils/index/indexList";
export default {
  data() {
    return {
      url: url.url,
      collectionInfo: [],
      current_page: 1,
      pagesize: 10,
      collect_id: ""
    };
  },
  onShow() {
    this.pageData();
    this.current_page = 1;
  },
  onLoad() {
    this.current_page = 1;
    this.collectionInfo = [];
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
    //获取收藏列表接口
    pageData() {
      collectionList({
        page: this.current_page,
        pagesize: this.pagesize
      }).then(data => {
        // if (data.data.length <= data.meta.per_page && data.data.length > 0) {
          this.current_page++;
          this.collectionInfo = this.collectionInfo.concat(data.data);
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
    onJump(collectid) {
      collectionDetail(collectid).then(data => {
        this.typeStatus = data.data.type;
        this.foreign_id = data.data.foreign_id;
        if (this.typeStatus === 1) {
          wx.navigateTo({
            url: "/pages/index/news/index?new_id=" + this.foreign_id
          });
        } else if (this.typeStatus === 2) {
          wx.navigateTo({
            url:
              "/packageA/activity/driedFood/driedFood?university_id=" +
              this.foreign_id
          });
        } else if (this.typeStatus === 3) {
          wx.navigateTo({
            url:
              "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" +
              this.foreign_id
          });
        } else if (this.typeStatus === 4) {
          wx.navigateTo({
            url:
              "/packageA/activity/graduate/graduate?act_id=" + this.foreign_id
          });
        } else if (this.typeStatus === 5) {
          wx.navigateTo({
            url:
              "/packageA/activity/academicEvents/academicDetails?act_id=" +
              this.foreign_id
          });
        } else if (this.typeStatus === 6) {
          wx.navigateTo({
            url:
              "/packageA/activity/clubActivitys/clubActivitys?act_id=" +
              this.foreign_id
          });
        } else if (this.typeStatus === 7) {
          wx.navigateTo({
            url:
              "/packageA/activity/competitionActivity/competitionDetails?act_id=" +
              this.foreign_id
          });
        }
      });
    },
    //删除收藏
    // onCancel(e, el) {
    //   var index = e.currentTarget.dataset.index;
    //   var collectionInfo = this.collectionInfo;
    //   wx.showModal({
    //     title: "提示",
    //     content: "确定要取消吗？",
    //     success: res => {
    //       if (res.confirm) {
    //         cancelCollection(el, "", true).then(data => {
    //           collectionInfo.splice(index, 1);
    //           this.collectionInfo = this.collectionInfo;
    //           wx.showToast({
    //             title: "取消成功！"
    //           });
    //         });
    //       }
    //     }
    //   });
    // }
  },
  //分享好友
  onShareAppMessage: function(res) {
    var obj = {};
    var id = "";
    if (res.target) {
      obj = shareMsg(
        res.target.dataset.type,
        res.target.id,
        res.target.dataset.title
      );
      id = res.target.id;
    } else {
      // 右上角三个点的分享
      obj.title = "来奇集，你需要的这里都有";
      obj.path = "/pages/index/index";
      obj.imageUrl = this.url+"/img/2.0/2x.jpg";
    }
    return {
      title: "来奇集，你需要的这里都有",
      path: obj.path,
      imageUrl: this.url+"/img/2.0/2x.jpg"
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../style/icon.css";
.collectPage {
  background-color: #f5f5f5;
  height: 100%;
  padding-top: 10rpx;
  .collect {
    margin: 10rpx 20rpx;
    border-radius: 8rpx;
    .collextBox {
      background-color: #fff;
      padding: 20rpx;
      display: flex;
      justify-content: space-between;
      height: 142rpx;
      border-radius: 8rpx;
      border: 1prx solid #e6e6e6;
      .collectImg {
        width: 174rpx;
        height: 130rpx;
        margin-top: 8rpx;
        img {
          width: 100%;
          height: 100%;
          flex-shrink: 0;
          border-radius: 4rpx;
        }
      }
      .contentW {
        width: 365rpx;
        margin-left: 19rpx;
      }
      .content {
        width: 570rpx;
        div {
          height: 90rpx;
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
        p {
          font-size: 24rpx;
          color: #999999;
          font-weight: 500;
          margin-top: 19rpx;
        }
      }
      .iconBox {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        text-align: right;
        margin-top: 5rpx;
        i {
          font-size: 36rpx;
        }
        button {
          background-color: transparent;
          margin-top: 30rpx;
          margin-right: -25rpx;
          i {
            color: #ccc;
          }
          &::after {
            border: none;
          }
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

