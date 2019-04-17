export function toSharePage(options) {
  console.log(options)
  if (options.org_id) {
    wx.navigateTo({
      url: "/pages/club/index?id=" + options.org_id
    });
  } else if (options.act_id) {
    if (options.act_type == 1) {
      wx.navigateTo({
        url: "/packageA/activity/clubActivitys/clubActivitys?act_id=" + options.act_id
      });
    } else if (options.act_type == 2) {
      wx.navigateTo({
        url: `/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=${
          options.act_id
          }`
      });
    } else if (options.act_type == 3) {
      wx.navigateTo({
        url: `/packageA/activity/academicEvents/academicDetails?act_id=${
          options.act_id
          }`
      });
    } else if (options.act_type == 4) {
      wx.navigateTo({
        url: `/packageA/activity/competitionActivity/competitionDetails?act_id=${
          options.act_id
          }`
      });
    } else if (options.act_type == 5) {
      wx.navigateTo({
        url: `/packageA/activity/graduate/graduate?act_id=${options.act_id}`
      });
    }

    // wx.navigateTo({
    //   url: "/pages/activity/detail/detail?act_id=" + options.act_id
    // });
  } else if (options.rank) {
    wx.navigateTo({
      url: "/pages/index/popularityKing/index"
    });
  } else if (options.new_id) {
    wx.navigateTo({
      // url: "/pages/index/news/index?new_id=" + options.new_id
      url: "/pages/index/news/index?new_id=" +
        options.new_id +
        "&&type=" +
        options.type
    });
  } else if (options.share_id) {
    if (options.type == 1) {
      wx.navigateTo({
        // url: `/pages/index/news/list?share_id= ${options.share_id} &type= ${options.type}`
        url: "/pages/index/news/index?share_id=" +
          options.share_id +
          "&&share=1" +
          "&&type=" +
          options.type
      });
    } else if (options.type == 2) {
      wx.navigateTo({
        url: `/packageA/activity/driedFood/driedFood?share_id= ${options.share_id} &type= ${options.type}`
      });
    } else if (options.type == 3) {
      wx.navigateTo({
        url: `/packageA/activity/recruitmentActivities/recruitmentDetails?share_id= ${options.share_id} &type= ${options.type}`
      });
    } else if (options.type == 4) {
      wx.navigateTo({
        url: `/packageA/activity/graduate/graduate?share_id= ${options.share_id} &type= ${options.type}`
      });
    } else if (options.type == 5) {
      wx.navigateTo({
        url: `/packageA/activity/academicEvents/academicDetails?share_id= ${options.share_id} &type= ${options.type}`
      });
    } else if (options.type == 6) {
      wx.navigateTo({
        url: `/packageA/activity/clubActivitys/clubActivitys?share_id= ${options.share_id} &type= ${options.type}`
      });
    } else if (options.type == 7) {
      wx.navigateTo({
        url: `/packageA/activity/competitionActivity/competitionDetails?share_id= ${options.share_id} &type= ${options.type}`
      });
    }
  } else if (options.news) {
    wx.navigateTo({
      url: "/pages/index/news/index"
    });
  } else if (options.clubMore) {
    wx.navigateTo({
      url: "/pages/club/all/all"
    });
  } else if (options.newsList) {
    wx.navigateTo({
      url: "/pages/index/news/list"
    });
  } else if (options.new_subscribe) {
    wx.navigateTo({
      url: "/pages/index/news/list?new_subscribe=1"
    });
  } else if (options.university_id) {
    wx.navigateTo({
      url: "/packageA/activity/driedFood/driedFood?university_id=" + options.university_id
    });
  } else if (options.sponsor_id) {
    wx.navigateTo({
      url: "/pages/index/actSupport/index?sponsor_id=" + options.sponsor_id
    });
  }
  //优惠券活动分享
  else if (options.activity_share) {
    wx.navigateTo({
      url: "/pages/eating/index?activity_share=1"
    });
    //优惠券详情页分享给好友
  } else if (options.storeList) {
    wx.navigateTo({
      url: "/pages/eating/index?coupon_id=" + options.coupon_id //
    });
  } else if (options.actSupport) {
    wx.navigateTo({
      url: "/pages/index/actSupport/index"
    });
  } else if (options.university) {
    wx.navigateTo({
      url: "/pages/index/university/index"
    });
  }
  //  else if (options.score_learn) {
  //   wx.navigateTo({
  //     url: "/packageA/activity/driedFood/driedFood?university_id=8"
  //   })
  // } else if (options.score_end) {
  //   wx.navigateTo({
  //     url: "/packageA/activity/driedFood/driedFood?university_id=20"
  //   })
  // }
  // 海报跳转（获取的参数例子act=123&type=1或者org=123）
  var scene = decodeURIComponent(options.scene); //小程序码扫描进入的参数
  var arr = scene.split("=");
  if (arr[0] == "org") {
    wx.navigateTo({
      url: "/pages/club/index?id=" + arr[1]
    });
  } else if (arr[0] == "act") {
    // 二次分割出123&type
    var actArr = arr[1].split("&");
    if (arr[2] == 1) {
      wx.navigateTo({
        url: "/pages/activity/detail/detail?act_id=" + actArr[0]+"&&type=poster"
      });
    } else if (arr[2] == 2) {
      wx.navigateTo({
        url: "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" +
          actArr[0]+"&&type=poster"
      });
    } else if (arr[2] == 3) {
      wx.navigateTo({
        url: "/packageA/activity/academicEvents/academicDetails?act_id=" +
          actArr[0]+"&&type=poster"
      });
    } else if (arr[2] == 4) {
      wx.navigateTo({
        url: "/packageA/activity/competitionActivity/competitionDetails?act_id=" +
          actArr[0]+"&&type=poster"
      });
    } else if (arr[2] == 5) {
      wx.navigateTo({
        url: "/packageA/activity/graduate/graduate?act_id=" + actArr[0]+"&&type=poster"
      });
    }
  } else if (arr[0] == "claim") {
    wx.navigateTo({
      url: "/pages/mine/buildClub/help/help?id=" + arr[1]+"&&type=poster"
    });
  } else if (arr[0] == "rank") {
    wx.navigateTo({
      url: "/pages/index/popularityKing/index"+"&&type=poster"
    });
  } else if (arr[0] == "share_id") {
    // wx.navigateTo({
    //   url: "/pages/index/news/index?share=share&&share_id=" + arr[1]
    // });
    wx.navigateTo({
      url: "/pages/index/news/list?share_id=" + arr[1] + "&&type=poster"
    });
  } //优惠券海报二维码分享
  else if (arr[0] == "channel") {
    //解析小程序码获取到进入的渠道
    wx.setStorageSync("channel", arr[1])
    if (arr[1] === "eat_list") {
      wx.navigateTo({
        url: "/pages/eating/index?channel=" + arr[1]
      });
    }
  }
}
