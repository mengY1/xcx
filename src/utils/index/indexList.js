import {
  list,
  uniList,
  activitiesList,
  recommendsList
} from "@/utils/api";
import common from "@/utils/common"
// 获取首页的列表
export function getListInfo(index, keyword, loadingShow) {
  return new Promise((resolve, reject) => {
    keyword = keyword ? keyword : ""
    loadingShow = loadingShow ? false : true
    var latitude = wx.getStorageSync("latitude")
    var longitude = wx.getStorageSync("longitude")
    if (index === 0) {
      recommendsList({
        keyword: keyword,
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 1) {
      // 爆料
      list({
        pagesize: 20,
        keyword: keyword,
        sort: "1,2",
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 2) {
      // 干货
      uniList({
        pagesize: 20,
        keyword: keyword
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 3) {
      // 求职
      activitiesList({
        act_type: 2,
        pagesize: 20,
        keyword: keyword,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 4) {
      // 考研
      activitiesList({
        act_type: 5,
        pagesize: 20,
        keyword: keyword,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 5) {
      // 学术
      activitiesList({
        act_type: 3,
        pagesize: 20,
        keyword: keyword,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 6) {
      // 社团活动
      activitiesList({
        act_type: 1,
        pagesize: 20,
        keyword: keyword,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 7) {
      // 竞赛
      activitiesList({
        act_type: 4,
        pagesize: 20,
        keyword: keyword,
        sort: 5
      }, loadingShow).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

// 加载更多首页的列表
export function moreList(index, page, searchName) {
  return new Promise((resolve, reject) => {
    console.log(index)
    searchName = searchName ? searchName : ""
    var latitude = wx.getStorageSync("latitude")
    var longitude = wx.getStorageSync("longitude")
    if (index === 0) {
      recommendsList({
        page: page,
        keyword: searchName,
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 1) {
      // 爆料
      list({
        page: page,
        pagesize: 20,
        keyword: searchName,
        sort: "1,2",
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 2) {
      // 干货
      uniList({
        page: page,
        pagesize: 20,
        keyword: searchName
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 3) {
      // 求职
      activitiesList({
        act_type: 2,
        pagesize: 20,
        page: page,
        keyword: searchName,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 4) {
      // 考研
      activitiesList({
        act_type: 5,
        pagesize: 20,
        page: page,
        keyword: searchName,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 5) {
      // 学术
      activitiesList({
        act_type: 3,
        pagesize: 20,
        page: page,
        keyword: searchName,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 6) {
      // 社团活动
      activitiesList({
        act_type: 1,
        pagesize: 20,
        page: page,
        keyword: searchName,
        sort: "1,4",
        lat: latitude,
        lng: longitude
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else if (index === 7) {
      // 竞赛
      activitiesList({
        act_type: 4,
        pagesize: 20,
        page: page,
        keyword: searchName,
        sort: 5
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}

// 跳转到列表详情
export function toDetail(index, id, type, channel) {
  // channel为进入的渠道(list是首页列表，search是搜索结果)
  if (index === 0) {
    if (type === 1) {
      wx.navigateTo({
        url: "/pages/index/news/index?new_id=" + id + "&type=" + channel
      })
    } else if (type === 2) {
      wx.navigateTo({
        url: "/packageA/activity/driedFood/driedFood?university_id=" + id + "&type=" + channel
      })
    } else if (type === 3) {
      wx.navigateTo({
        url: "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" + id + "&type=" + channel
      })
    } else if (type === 4) {
      wx.navigateTo({
        url: "/packageA/activity/graduate/graduate?act_id=" + id + "&type=" + channel
      })
    } else if (type === 5) {
      wx.navigateTo({
        url: "/packageA/activity/academicEvents/academicDetails?act_id=" + id + "&type=" + channel
      })
    } else if (type === 6) {
      wx.navigateTo({
        url: "/packageA/activity/clubActivitys/clubActivitys?act_id=" + id + "&type=" + channel
      })
    } else if (type === 7) {
      wx.navigateTo({
        url: "/packageA/activity/competitionActivity/competitionDetails?act_id=" + id + "&type=" + channel
      })
    }
  } else if (index === 1) {
    wx.navigateTo({
      url: "/pages/index/news/index?new_id=" + id + "&type=" + channel
    })
  } else if (index === 2) {
    wx.navigateTo({
      url: "/packageA/activity/driedFood/driedFood?university_id=" + id + "&type=" + channel
    })
  } else if (index === 3) {
    wx.navigateTo({
      url: "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" + id + "&type=" + channel
    })
  } else if (index === 4) {
    wx.navigateTo({
      url: "/packageA/activity/graduate/graduate?act_id=" + id + "&type=" + channel
    })
  } else if (index === 5) {
    wx.navigateTo({
      url: "/packageA/activity/academicEvents/academicDetails?act_id=" + id + "&type=" + channel
    })
  } else if (index === 6) {
    wx.navigateTo({
      url: "/packageA/activity/clubActivitys/clubActivitys?act_id=" + id + "&type=" + channel
    })
  } else if (index === 7) {
    console.log("竞赛", id) + "&type=" + channel
    wx.navigateTo({
      url: "/packageA/activity/competitionActivity/competitionDetails?act_id=" + id + "&type=" + channel
    })
  }
}

//分享跳转的路径以及图片
export function shareMsg(index, id, title, type) {
  var obj = {
    title: "校园生活很无趣?社团活动上奇集!",
    path: "/pages/index/index",
    imageUrl: common.url + "img/share/app.jpg"
  }
  if (index === 0) {
    obj.title = title
    obj.imageUrl = ""
    if (type === 1) {
      obj.path = "/pages/index/index?new_id=" + id
      return obj
    } else if (type === 2) {
      obj.path = "/pages/index/index?university_id=" + id
      return obj
    } else if (type === 3) {
      obj.path = "/pages/index/index?act_id=" + id + "&act_type=2"
      return obj
    } else if (type === 4) {
      obj.path = "/pages/index/index?act_id=" + id + "&act_type=5"
      return obj
    } else if (type === 5) {
      obj.path = "/pages/index/index?act_id=" + id + "&act_type=3"
      return obj
    } else if (type === 6) {
      obj.path = "/pages/index/index?act_id=" + id + "&act_type=1"
      return obj
    } else if (type === 7) {
      obj.path = "/pages/index/index?act_id=" + id + "&act_type=4"
      return obj
    }
  } else if (index === 1) {
    obj.title = title
    obj.path = "/pages/index/index?new_id=" + id
    obj.imageUrl = ""
    return obj
  } else if (index === 2) {
    obj.title = title
    obj.path = "/pages/index/index?university_id=" + id
    obj.imageUrl = ""
    return obj
  } else if (index === 3) {
    obj.title = title
    obj.path = "/pages/index/index?act_id=" + id + "&act_type=2"
    obj.imageUrl = ""
    return obj
  } else if (index === 4) {
    obj.title = title
    obj.path = "/pages/index/index?act_id=" + id + "&act_type=5"
    obj.imageUrl = ""
    return obj
  } else if (index === 5) {
    obj.title = title
    obj.path = "/pages/index/index?act_id=" + id + "&act_type=3"
    obj.imageUrl = ""
    return obj
  } else if (index === 6) {
    obj.title = title
    obj.path = "/pages/index/index?act_id=" + id + "&act_type=1"
    obj.imageUrl = ""
    return obj
  } else if (index === 7) {
    obj.title = title
    obj.path = "/pages/index/index?act_id=" + id + "&act_type=4"
    obj.imageUrl = ""
    return obj
  }
}
