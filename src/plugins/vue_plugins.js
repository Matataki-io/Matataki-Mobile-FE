import Vue from 'vue'
import VueScrollReveal from 'vue-scroll-reveal'
import VueClipboard from 'vue-clipboard2' // 复制内容
import VueHead from 'vue-head'

import point from '../config/points' // 积分配置
import publishMethods from '../utils/publish_methods'
import utils from '../utils/utils'
import wechatShare from '../utils/wechat_share' // wechat share
import userStatus from '../config/userStatus.js'

Vue.use(VueScrollReveal, {
  class: 'v-scroll-reveal',
  duration: 800,
  reset: false,
  desktop: false
})

Vue.use(VueClipboard)
Vue.use(VueHead)

Vue.prototype.$point = point
Vue.prototype.$publishMethods = publishMethods
Vue.prototype.$utils = utils
Vue.prototype.$wechatShare = wechatShare
Vue.prototype.$userStatus = userStatus