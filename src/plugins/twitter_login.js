import Vue from 'vue'

const HelloJs = require('hellojs-xiaotian/dist/hello.all.js')
const VueHello = require('vue-hellojs')

HelloJs.init({
  twitter: process.env.VUE_APP_TWITTER_KEY
}, {
  redirect_uri: '/login/twitter_logined'
})

Vue.use(VueHello, HelloJs)
