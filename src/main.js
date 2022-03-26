import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/global.css'

import axios from 'axios'
import province from '@province-city-china/level'

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true

// 注册全局变量
Vue.prototype.$http = axios
Vue.prototype.$log = console.log
Vue.prototype.$province = province

Vue.config.productionTip = false

// 获取歌曲时长
Vue.filter('songTime', function (originVal) {
  const dt = new Date(originVal)
  // 规范格式，若不足两位数，则用0从前面开始填充
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${mm}:${ss}`
})
// 获取专辑发行时间
Vue.filter('albumTime', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 规范格式，若月份不足两位数，则用0从前面开始填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}.${m}.${d}`
})
// 获取歌曲创建时间
Vue.filter('publishTime', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})
// 获取评论发布时间
Vue.filter('commentTime', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const now = new Date()
  const nowY = now.getFullYear()
  const nowM = (now.getMonth() + 1 + '').padStart(2, '0')
  const nowD = (now.getDate() + '').padStart(2, '0')
  if (nowY === y && nowM === m && nowD === d) {
    return `${hh}:${mm}`
  } else if (nowY === y && nowM === m && nowD - d === 1) {
    return `昨天${hh}:${mm}`
  } else {
    return `${y}年${m}月${d}日 ${hh}:${mm}`
  }
})
// 获取电台节目时长
Vue.filter('programTime', function (originVal) {
  const dt = new Date(originVal)
  // 规范格式，若月份不足两位数，则用0从前面开始填充
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${mm}分${ss}秒`
})

// 数字转换
Vue.filter('numFormat', function (originVal) {
  if (originVal === undefined) return
  const str = originVal.toString()
  if (str.length < 5) {
    return str
  } else if (str.length < 9) {
    return str.slice(0, -4) + '万'
  } else {
    return str.slice(0, -8) + '亿'
  }
})
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
