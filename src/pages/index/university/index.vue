<template>
  <div>
    <div
      class="loading"
      v-show="loadingShow"
    >
      <loading></loading>
    </div>
    <div class="uniList">
      <div class="list-item" v-for="(item,index) in list" :key="index">
        <div class="item_bg" :style="{backgroundImage:'url('+url+item.cover+')'}" @click="toDetail(item.university_id,item.title)">
          <img v-show="item.is_new===1" :src="url+'/img/home/QIJIUniversity_new.png'" class="newIcon">
          <span class="title_wrap">
            <h1>{{item.title}}</h1>
          </span>
        </div>
      </div>
    </div>
    <footer v-if="list.length>0">
      <p
        @click='more'
        v-if="moreShow"
      >查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>
  </div>
</template>
<script>
import loading from "@/components/loading";
import common from "@/utils/common";
import { uniList } from "@/utils/api";
export default {
  data() {
    return {
      loadingShow: true,
      url: common.url,
      list: [],
      page: 1,
      moreShow: true
    };
  },
  components: {
    loading
  },
  onLoad(options) {
    this.loadingShow = true;
    this.page = 1;
    this.moreShow = true;
    this.getListInfo();
    if (options.university_id) {
      wx.navigateTo({
        url: "./detail?university_id=" + options.university_id+"&&channel=friends"
      });
    }
  },
  onReachBottom() {
    this.more();
  },
  methods: {
    async getListInfo() {
      try {
        let list = await uniList({}, true);
        this.list = list.data;
        this.loadingShow = false;
      } catch (e) {
        this.loadingShow = false;
      }
    },
    more() {
      if (this.moreShow) {
        this.page += 1;
        uniList({ page: this.page }).then(res => {
          for (var i = 0; i < 6; i++) {
            if (res.data[i]) {
              this.list.push(res.data[i]);
            } else if (!res.data[5]) {
              this.moreShow = false;
            } else {
              this.moreShow = false;
            }
          }
        });
      }
    },
    toDetail(id, title) {
      wx.navigateTo({
        url: "./detail?university_id=" + id + "&&title=" + title+"&&channel=list"
      });
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "奇集大学",
      path: "/pages/index/index?university=1"
      // imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.uniList {
  padding: 40rpx 40rpx 0;
  overflow: hidden;
}
.uniList .list-item {
  margin-bottom: 40rpx;
}
.uniList .list-item .item_bg {
  width: 670rpx;
  height: 376rpx;
  border-radius: 8rpx;
  background-size: 100% 100%;
  position: relative;
  display: table;
}
.uniList .list-item .newIcon {
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  width: 88rpx;
  height: 88rpx;
}
.uniList .list-item .title_wrap {
  display: table-cell;
  vertical-align: middle;
}
.uniList .list-item h1 {
  color: #fff;
  font-size: 40rpx;
  text-align: center;
  width: 550rpx;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

footer p {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
  color: #99958a;
}
</style>
