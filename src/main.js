import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false
App.store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: ["pages/login/shouquan/shouquan","pages/index/index"],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black',
      // navigationStyle:"custom"
    },
    permission: {
      "scope.userLocation": {
        desc: "奇集需要获取你的位置以便提供更好的内容推荐服务"
      }
    },
    "navigateToMiniProgramAppIdList":[
      "wx9932fe68bacd1398"
    ]
  }
}
